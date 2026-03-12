/**
 * Beauty Assistant — Asper Beauty Shop AI Concierge (Dr. Sami / Ms. Zain).
 *
 * Webhook routes (?route=gorgias | ?route=manychat):
 * - HMAC: GORGIAS_WEBHOOK_SECRET (x-gorgias-signature), MANYCHAT_WEBHOOK_SECRET (x-hub-signature-256).
 *   If secret is set, signature is required; otherwise webhook is accepted (backward compat).
 * - Rate limit: 30 req/min per IP per route; 429 + Retry-After when exceeded.
 * - CORS: use ALLOWED_ORIGINS or ALLOWED_ORIGIN (comma-separated) for strict allowlist; no wildcard when set.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ──────────────────────────────────────────────────────────────
// Strict CORS: only allow listed origins (no wildcard for web)
// ──────────────────────────────────────────────────────────────
const WEBHOOK_HEADERS =
  "content-type, x-webhook-route, x-gorgias-signature, x-hub-signature-256";
const SITE_HEADERS =
  "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version";

function getAllowedOrigins(): string[] {
  const env = Deno.env.get("ALLOWED_ORIGINS") ?? Deno.env.get("ALLOWED_ORIGIN");
  if (!env) return [];
  return env.split(",").map((o) => o.trim()).filter(Boolean);
}

function getCorsHeaders(req: Request, options?: { webhookRoute?: boolean }): Record<string, string> {
  const origins = getAllowedOrigins();
  const requestOrigin = req.headers.get("Origin") ?? "";
  const allowOrigin =
    origins.length > 0
      ? (origins.includes(requestOrigin) ? requestOrigin : origins[0])
      : requestOrigin || "*";
  const allowHeaders = options?.webhookRoute
    ? WEBHOOK_HEADERS
    : `${SITE_HEADERS}, ${WEBHOOK_HEADERS}`;
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": allowHeaders,
    "Access-Control-Max-Age": "86400",
  };
}

// ──────────────────────────────────────────────────────────────
// Rate limit: 30 requests per 60 seconds per IP per webhook route
// ──────────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string, route: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  if (now - lastCleanup > RATE_LIMIT_WINDOW_MS) {
    for (const [key, v] of rateLimitStore.entries()) {
      if (v.resetAt < now) rateLimitStore.delete(key);
    }
    lastCleanup = now;
  }
  const key = `${ip}:${route}`;
  const entry = rateLimitStore.get(key);
  if (!entry) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

// ──────────────────────────────────────────────────────────────
// HMAC verification for Gorgias and ManyChat webhooks
// ──────────────────────────────────────────────────────────────
async function hmacSha256Hex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyGorgiasSignature(rawBody: string, signatureHeader: string | null, secret: string | null): Promise<boolean> {
  if (!secret || !signatureHeader?.trim()) return false;
  const expected = await hmacSha256Hex(secret, rawBody);
  return timingSafeEqual(signatureHeader.trim(), expected);
}

async function verifyManyChatSignature(rawBody: string, signatureHeader: string | null, secret: string | null): Promise<boolean> {
  if (!secret || !signatureHeader?.trim()) return false;
  const expectedPrefix = "sha256=";
  if (!signatureHeader.toLowerCase().startsWith(expectedPrefix)) return false;
  const hex = await hmacSha256Hex(secret, rawBody);
  return timingSafeEqual(signatureHeader.trim(), expectedPrefix + hex);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function getWebhookRoute(req: Request): "gorgias" | "manychat" | null {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("route")?.toLowerCase();
    if (q === "gorgias" || q === "manychat") return q;
    const header = req.headers.get("x-webhook-route")?.toLowerCase();
    if (header === "gorgias" || header === "manychat") return header;
  } catch { /* ignore */ }
  return null;
}

function extractFromGorgias(body: Record<string, unknown>): { message: string } {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = messages.filter((m: unknown) => m && typeof m === "object").pop() as Record<string, unknown> | undefined;
  const text =
    typeof last?.body_text === "string" ? last.body_text
    : typeof last?.body_html === "string" ? last.body_html.replace(/<[^>]+>/g, "").trim()
    : typeof (body as any).body_text === "string" ? (body as any).body_text
    : typeof (body as any).message === "string" ? (body as any).message
    : "";
  return { message: text || "(No message)" };
}

function extractFromManyChat(body: Record<string, unknown>): { message: string } {
  const data = body.data as Record<string, unknown> | undefined;
  const text =
    typeof data?.text === "string" ? data.text
    : typeof (body as any).text === "string" ? (body as any).text
    : typeof (body as any).message === "string" ? (body as any).message
    : "";
  return { message: text || "(No message)" };
}

/** Map UI concern labels (e.g. from context.current_concern) to internal slugs */
function concernLabelToSlug(label: string | null | undefined): string | null {
  if (!label || typeof label !== "string") return null;
  const map: Record<string, string> = {
    "acne": "acne",
    "dark circles": "dark-spots",
    "dark spots": "dark-spots",
    "hyperpigmentation": "dark-spots",
    "pigmentation": "dark-spots",
    "anti-aging": "anti-aging",
    "aging": "anti-aging",
    "wrinkles": "anti-aging",
    "hydration": "hydration",
    "dry": "hydration",
    "dryness": "hydration",
    "sensitivity": "sensitivity",
    "sensitive": "sensitivity",
    "redness": "redness",
    "sun protection": "sun-protection",
    "oily": "oily-skin",
    "oily skin": "oily-skin",
  };
  const normalized = label.toLowerCase().trim();
  return map[normalized] ?? (normalized.length > 0 ? normalized.replace(/\s+/g, "-") : null);
}

function detectConcernSlug(text: string): string | null {
  if (!text || typeof text !== "string") return null;
  const lower = text.toLowerCase().trim();
  const concernKeywords: [string, string[]][] = [
    ["acne", ["acne", "blemish", "pimple", "oil-free", "pore", "purif", "normaderm"]],
    ["anti-aging", ["anti-aging", "anti aging", "wrinkle", "retinol", "collagen", "peptide", "firming", "liftactiv"]],
    ["hydration", ["hydration", "hydrat", "dry", "tight", "dehydrat", "hyaluronic", "moistur", "mineral 89"]],
    ["sensitivity", ["sensitive", "redness", "irritat", "soothing", "calming", "gentle"]],
    ["dark-spots", ["dark spot", "pigment", "brighten", "vitamin c", "radiance", "glow", "luminous"]],
    ["sun-protection", ["sun protection", "sunscreen", "spf", "sun damage"]],
    ["redness", ["redness", "red"]],
    ["oily-skin", ["oily", "shine", "sebum"]],
  ];
  for (const [slug, keywords] of concernKeywords) {
    if (keywords.some((k) => lower.includes(k))) return slug;
  }
  return null;
}

/** Map a concern slug to the products table enum values */
function concernSlugToEnum(slug: string): string[] {
  const map: Record<string, string[]> = {
    "acne": ["Concern_Acne", "Concern_Oiliness"],
    "anti-aging": ["Concern_Aging", "Concern_AntiAging"],
    "hydration": ["Concern_Hydration", "Concern_Dryness"],
    "sensitivity": ["Concern_Sensitivity", "Concern_Redness"],
    "dark-spots": ["Concern_Pigmentation", "Concern_Brightening"],
    "sun-protection": ["Concern_SunProtection"],
    "redness": ["Concern_Redness", "Concern_Sensitivity"],
    "oily-skin": ["Concern_Oiliness", "Concern_Acne"],
  };
  return map[slug] || [];
}

/** Format a product row into a readable string for the AI context */
function formatProduct(p: any): string {
  const parts = [`**${p.title}**`];
  if (p.brand) parts[0] += ` (${p.brand})`;
  if (p.price) parts.push(`${p.price} JOD`);
  if (p.regimen_step) parts.push(p.regimen_step.replace(/^Step_\d+_?/, "").replace(/([A-Z])/g, " $1").trim());
  if (p.primary_concern) parts.push(p.primary_concern.replace("Concern_", ""));
  if (p.key_ingredients?.length) parts.push(`Ingredients: ${p.key_ingredients.slice(0, 3).join(", ")}`);
  if (p.clinical_badge) parts.push(`[${p.clinical_badge}]`);
  if (p.pharmacist_note) parts.push(`Note: ${p.pharmacist_note}`);
  return `- ${parts.join(" | ")}`;
}

/** Fetch products matching a concern or keywords from the products table */
async function fetchProductContext(
  supabaseClient: any,
  userMessage: string,
  detectedSlug: string | null
): Promise<{ productContext: string; matchedProducts: any[] }> {
  let matchedProducts: any[] = [];
  let productContext = "";

  // Try concern-based lookup first
  if (detectedSlug) {
    const enums = concernSlugToEnum(detectedSlug);
    if (enums.length > 0) {
      const { data } = await supabaseClient
        .from("products")
        .select("id, title, brand, price, primary_concern, regimen_step, key_ingredients, clinical_badge, pharmacist_note, image_url, handle, tags, is_hero, gold_stitch_tier, inventory_total")
        .in("primary_concern", enums)
        .gt("inventory_total", 0)
        .order("is_hero", { ascending: false })
        .order("inventory_total", { ascending: false })
        .limit(12);
      if (data?.length) {
        matchedProducts = data;
        productContext = `\n\n**Relevant Products (${detectedSlug}):**\n${data.map(formatProduct).join("\n")}`;
      }
    }
  }

  // Fallback: keyword search on title/brand/tags
  if (matchedProducts.length === 0) {
    const keywords = extractKeywords(userMessage);
    if (keywords.length > 0) {
      const orClauses = keywords.map(k =>
        `title.ilike.%${k}%,brand.ilike.%${k}%`
      ).join(",");
      const { data } = await supabaseClient
        .from("products")
        .select("id, title, brand, price, primary_concern, regimen_step, key_ingredients, clinical_badge, pharmacist_note, image_url, handle, tags, is_hero, gold_stitch_tier, inventory_total")
        .or(orClauses)
        .gt("inventory_total", 0)
        .limit(12);
      if (data?.length) {
        matchedProducts = data;
        productContext = `\n\n**Relevant Products:**\n${data.map(formatProduct).join("\n")}`;
      }
    }
  }

  if (!productContext) {
    productContext = "\n\n(No matching products found. Provide general skincare advice and invite them to browse asperbeautyshop.com)";
  }

  return { productContext, matchedProducts };
}

// ──────────────────────────────────────────────────────────────
// System Prompt Builder
// ──────────────────────────────────────────────────────────────
function buildSystemPrompt(
  productContext: string,
  shopRoutinePath: string | null,
  uiContext?: { current_concern?: string; skin_type?: string }
): string {
  const contextLine =
    uiContext?.current_concern || uiContext?.skin_type
      ? `\n**User context from UI:** ${[uiContext.current_concern, uiContext.skin_type].filter(Boolean).join(" · ")}. Use this to tailor your first reply without asking again.\n`
      : "";
  return `You are the **Asper Dual-Voice Concierge** for Asper Beauty Shop in Jordan — operating as either **Dr. Sami** (Voice of Science) or **Ms. Zain** (Voice of Luxury) depending on the user's intent. Both voices share the same Medical Luxury identity: pharmacist-curated, authentic, precise, never pushy. Recommend ONLY from the product inventory listed below when available; name title, brand, and price.
${contextLine}

**DR. SAMI — The Voice of Science** (clinical/safety queries)
- Trigger: acne, rosacea, eczema, hyperpigmentation, pregnancy, ingredient, barrier, retinol, SPF, allergy, supplement, dosage, safety, pharmacist
- Tone: Authoritative, precise, empathetic. Intro: "As your clinical pharmacist..."
- Mandatory guardrail: "I provide wellness guidance, not medical diagnosis."

**MS. ZAIN — The Voice of Luxury** (aesthetic/lifestyle queries)
- Trigger: glow, radiance, makeup, gift, bridal, routine, fragrance, luxury, dewy, pamper
- Tone: Editorial, warm, enthusiastic. Intro: "Welcome to your personal beauty ritual..."

**Rules:** Default Dr. Sami if unclear. Switch seamlessly — never announce. Both share continuous memory.

**3-Click Solution (first reply):** (1) Confirm concern in one sentence. (2) Recommend ONE authoritative regimen: Step 1 Cleanser → Step 2 Treatment → Step 3 Protection. (3) Close with "Shall I add this tray to your cart?"
${shopRoutinePath ? `\n**Regimen Link:** [See My Regimen](${shopRoutinePath})` : ""}

**Sales Intelligence:** If user hesitates, pivot to trust: "Every bottle carries our Seal of Authenticity — pharmacist-vetted, JFDA certified."

**Knowledge:** All products 100% authentic. Brands: Bioderma, Kérastase, YSL, Maybelline, Garnier, Beesline, Bio Balance, Seventeen, Petal Fresh.
**Language:** Respond in the same language as the user (English or Arabic only).
**Shipping:** Amman 3 JOD; Governorates 5 JOD; FREE over 50 JOD.

**Inventory:**
${productContext}`;
}

// ──────────────────────────────────────────────────────────────
// Main Handler
// ──────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  // Health check
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "active", version: "4.0", webhooks: ["gorgias", "manychat"] }),
      { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" }, status: 200 }
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

  const route = getWebhookRoute(req);
  const corsWebhook = (r: Request) => getCorsHeaders(r, { webhookRoute: true });

  // ——— Webhook Path (Gorgias / ManyChat) — HMAC + rate limit + strict CORS ———
  if (route === "gorgias" || route === "manychat") {
    try {
      // 1. Rate limit (before any heavy work)
      const clientIp = getClientIp(req);
      const rate = checkRateLimit(clientIp, route);
      if (!rate.ok) {
        return new Response(
          JSON.stringify({ error: "Too many requests", retry_after: rate.retryAfter }),
          {
            status: 429,
            headers: {
              ...corsWebhook(req),
              "Content-Type": "application/json",
              "Retry-After": String(rate.retryAfter ?? 60),
            },
          }
        );
      }

      // 2. Read raw body once (required for HMAC)
      let rawBody: string;
      try {
        rawBody = await req.text();
      } catch {
        return new Response(JSON.stringify({ error: "Invalid body" }), {
          status: 400,
          headers: { ...corsWebhook(req), "Content-Type": "application/json" },
        });
      }

      // 3. HMAC verification (required when secret is set)
      const gorgiasSecret = Deno.env.get("GORGIAS_WEBHOOK_SECRET");
      const manychatSecret = Deno.env.get("MANYCHAT_WEBHOOK_SECRET");
      if (route === "gorgias") {
        if (gorgiasSecret) {
          const sig = req.headers.get("x-gorgias-signature");
          const valid = await verifyGorgiasSignature(rawBody, sig, gorgiasSecret);
          if (!valid) {
            return new Response(JSON.stringify({ error: "Invalid signature" }), {
              status: 401,
              headers: { ...corsWebhook(req), "Content-Type": "application/json" },
            });
          }
        }
      } else {
        if (manychatSecret) {
          const sig = req.headers.get("x-hub-signature-256");
          const valid = await verifyManyChatSignature(rawBody, sig, manychatSecret);
          if (!valid) {
            return new Response(JSON.stringify({ error: "Invalid signature" }), {
              status: 401,
              headers: { ...corsWebhook(req), "Content-Type": "application/json" },
            });
          }
        }
      }

      let body: Record<string, unknown> = {};
      try {
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        body = {};
      }
      const { message: userMessage } = route === "gorgias" ? extractFromGorgias(body) : extractFromManyChat(body);

      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      const geminiKey = Deno.env.get("GEMINI_API_KEY");
      const apiKey = geminiKey ?? LOVABLE_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "API key not configured" }), {
          status: 503, headers: { ...corsWebhook(req), "Content-Type": "application/json" },
        });
      }

      // Fetch products using service role
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
      let productContext = "";
      if (supabaseUrl && supabaseKey) {
        const admin = createClient(supabaseUrl, supabaseKey);
        const slug = detectConcernSlug(userMessage);
        const result = await fetchProductContext(admin, userMessage, slug);
        productContext = result.productContext;
      }

      const systemPrompt = buildSystemPrompt(productContext, null);
      const useLovable = !!LOVABLE_API_KEY && !geminiKey;

      let replyText = "";
      if (useLovable) {
        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
            stream: false,
          }),
        });
        if (!res.ok) throw new Error(`AI gateway ${res.status}`);
        const data = await res.json();
        replyText = data?.choices?.[0]?.message?.content ?? "";
      } else {
        const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash";
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: userMessage }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
            }),
          }
        );
        if (!res.ok) throw new Error(`Gemini ${res.status}`);
        const data = await res.json();
        replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      }

      // ManyChat expects { version, content } format for rich responses
      if (route === "manychat") {
        return new Response(
          JSON.stringify({
            version: "v2",
            content: {
              messages: [
                { type: "text", text: replyText || "Sorry, I couldn't process that. Please try again." }
              ],
              actions: [],
              quick_replies: [
                { type: "node", caption: "🧴 Acne Help", target: "acne" },
                { type: "node", caption: "✨ Glow Routine", target: "glow" },
                { type: "node", caption: "👤 Talk to Human", target: "human" },
              ],
            },
            reply: replyText || "Sorry, I couldn't process that. Please try again.",
          }),
          { status: 200, headers: { ...corsWebhook(req), "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ reply: replyText || "Sorry, I couldn't process that. Please try again." }),
        { status: 200, headers: { ...corsWebhook(req), "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("Webhook error:", e);
      return new Response(
        JSON.stringify({ error: "beauty-assistant webhook failed", message: e instanceof Error ? e.message : String(e) }),
        { status: 500, headers: { ...corsWebhook(req), "Content-Type": "application/json" } }
      );
    }
  }

  // ——— Website Chat (requires Supabase Auth, streams SSE) ———
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    // Use getUser() instead of getClaims() which is not supported
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error("Auth failed:", authError?.message || "No user");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    console.log("Authenticated user:", userId);

    const body = await req.json() as Record<string, unknown>;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const sessionId = typeof body.session_id === "string" ? body.session_id : undefined;
    const campaignSource = typeof body.source === "string" ? body.source : undefined;
    const context = body.context && typeof body.context === "object" ? body.context as Record<string, unknown> : {};
    const contextConcern = typeof context.current_concern === "string" ? context.current_concern : undefined;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Log campaign source and session for attribution/tracing
    if (campaignSource || sessionId) {
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      adminClient.from("telemetry_events").insert({
        user_id: userId,
        event: "ai_concierge_request",
        source: "beauty_assistant",
        payload: {
          session_id: sessionId,
          campaign_source: campaignSource ?? null,
          has_context_concern: !!contextConcern,
        },
      }).then(({ error }) => {
        if (error) console.error("Telemetry insert error:", error.message);
      });
    }

    // Extract last user message for product matching
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content ?? "";
    const lastText = typeof lastUserMessage === "string"
      ? lastUserMessage
      : Array.isArray(lastUserMessage)
        ? lastUserMessage.filter((p: any) => p.type === "text").map((p: any) => p.text).join(" ")
        : "";

    // Prefer context.current_concern from UI (e.g. "Dark Circles" tab) then fall back to message-based detection
    const concernFromContext = concernLabelToSlug(contextConcern);
    const concernFromMessage = detectConcernSlug(lastText);
    const detectedConcernSlug = concernFromMessage ?? concernFromContext;
    const shopRoutinePath = detectedConcernSlug ? `/products?concern=${detectedConcernSlug}` : null;

    // Fetch product context
    const { productContext, matchedProducts } = await fetchProductContext(supabaseClient, lastText, detectedConcernSlug);

    // Detect persona from user message
    const drSamiTriggers = /acne|rosacea|eczema|hyperpigment|pregnan|حامل|حمل|ingredient|مكونات|barrier|retinol|spf|sunscreen|allergy|حساسية|salicylic|medical|طبي|clinical|pharmacist|صيدلاني|supplement|dosage|safety/i;
    const persona = drSamiTriggers.test(lastText) ? "dr_sami" : "ms_zain";

    const uiContext =
      contextConcern || typeof context.skin_type === "string"
        ? { current_concern: contextConcern, skin_type: typeof context.skin_type === "string" ? context.skin_type : undefined }
        : undefined;
    const systemPrompt = buildSystemPrompt(productContext, shopRoutinePath, uiContext);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response" }), {
        status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Stream response with persona header and product data events
    const encoder = new TextEncoder();
    const recommendEvent = shopRoutinePath
      ? `data: ${JSON.stringify({ type: "recommend", detected_concern: detectedConcernSlug, shop_routine_path: shopRoutinePath })}\n\n`
      : "";
    const productDataEvent = matchedProducts.length > 0
      ? `data: ${JSON.stringify({ type: "products", products: matchedProducts.map(p => ({ id: p.id, title: p.title, brand: p.brand, price: p.price, handle: p.handle, image_url: p.image_url })) })}\n\n`
      : "";

    const combinedStream = new ReadableStream({
      async start(controller) {
        if (recommendEvent) controller.enqueue(encoder.encode(recommendEvent));
        if (productDataEvent) controller.enqueue(encoder.encode(productDataEvent));
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        function processLine(line: string): void {
          if (!line.startsWith("data: ")) return;
          controller.enqueue(encoder.encode(line + "\n\n"));
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            processLine(line);
          }
        }

        if (buffer.trim()) processLine(buffer.trim());
        controller.close();
      },
    });

    return new Response(combinedStream, {
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "text/event-stream",
        "X-Persona": persona,
      },
    });
  } catch (error) {
    console.error("Beauty assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "the", "a", "an",
    "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from",
    "as", "is", "was", "are", "were", "been", "be", "have", "has", "had", "do", "does",
    "did", "will", "would", "could", "should", "may", "might", "can", "what", "which",
    "who", "how", "when", "where", "why", "this", "that", "these", "those", "am", "if",
    "then", "so", "than", "too", "very", "just", "about", "any", "some", "all", "need",
    "want", "looking", "help", "please", "thanks", "thank", "good", "best", "recommend",
    "suggest", "product", "products", "something",
  ]);
  const skinKeywords = [
    "acne", "aging", "wrinkles", "dark spots", "pigmentation", "dryness", "dry", "oily",
    "sensitive", "redness", "hydration", "moisturizer", "serum", "cleanser", "toner",
    "sunscreen", "spf", "retinol", "vitamin c", "hyaluronic", "niacinamide", "salicylic",
    "brightening", "anti-aging", "eye cream", "mask", "exfoliate", "rosacea", "pregnancy",
  ];
  const brandKeywords = [
    "bioderma", "kerastase", "kérastase", "ysl", "maybelline", "garnier",
    "beesline", "bio balance", "seventeen", "petal fresh",
  ];

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const matched = [...skinKeywords, ...brandKeywords].filter(kw => lowerText.includes(kw));
  return [...new Set([...words, ...matched])].slice(0, 10);
}
