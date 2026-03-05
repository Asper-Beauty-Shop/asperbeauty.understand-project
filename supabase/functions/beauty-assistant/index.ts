import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Staging origins allowed alongside production ALLOWED_ORIGIN
const STAGING_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:8080",
  "https://id-preview--657fb572-13a5-4a3e-bac9-184d39fdf7e6.lovable.app",
]);

function getCorsHeaders(req: Request): Record<string, string> {
  const requestOrigin = req.headers.get("Origin") ?? "";
  const productionOrigin = Deno.env.get("ALLOWED_ORIGIN") ?? "";

  // Allow: exact production match, any staging origin, or fallback
  let allowOrigin: string;
  if (productionOrigin && requestOrigin === productionOrigin) {
    allowOrigin = productionOrigin;
  } else if (STAGING_ORIGINS.has(requestOrigin)) {
    allowOrigin = requestOrigin;
  } else {
    allowOrigin = productionOrigin || "*";
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-webhook-route",
  };
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

// ── Webhook Rate Limiter (in-memory, per-isolate) ──
const WEBHOOK_RATE_LIMIT_MAX = 30; // max requests per window per IP+route
const WEBHOOK_RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const webhookRateStore = new Map<string, { count: number; resetAt: number }>();

function webhookRateLimit(ip: string, route: string): boolean {
  const now = Date.now();
  const key = `wh:${route}:${ip}`;
  const entry = webhookRateStore.get(key);
  if (!entry || entry.resetAt < now) {
    webhookRateStore.set(key, { count: 1, resetAt: now + WEBHOOK_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= WEBHOOK_RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// Periodic cleanup to prevent memory leaks (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of webhookRateStore) {
    if (entry.resetAt < now) webhookRateStore.delete(key);
  }
}, 5 * 60_000);

// ── HMAC Signature Verification ──
async function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): Promise<boolean> {
  if (!signature || !secret) return false;
  try {
    // Strip optional "sha256=" prefix
    const sigHex = signature.startsWith("sha256=") ? signature.slice(7) : signature;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
    const expectedHex = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    // Constant-time comparison
    if (sigHex.length !== expectedHex.length) return false;
    let mismatch = 0;
    for (let i = 0; i < sigHex.length; i++) {
      mismatch |= sigHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
    }
    return mismatch === 0;
  } catch (e) {
    console.error("Signature verification failed:", e);
    return false;
  }
}

function extractFromGorgias(body: Record<string, unknown>): { message: string } {
  // Try body.messages[] array first
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = messages.filter((m: unknown) => m && typeof m === "object").pop() as Record<string, unknown> | undefined;
  // Try singular body.message object
  const singleMsg = (body.message && typeof body.message === "object") ? body.message as Record<string, unknown> : undefined;

  const text =
    typeof last?.body_text === "string" ? last.body_text
    : typeof last?.body_html === "string" ? last.body_html.replace(/<[^>]+>/g, "").trim()
    : typeof (body as Record<string, unknown>).body_text === "string" ? (body as Record<string, unknown>).body_text
    : typeof (body as Record<string, unknown>).message === "string" ? (body as Record<string, unknown>).message
    : "";
  return { message: text || "(No message)" };
}

function extractFromManyChat(body: Record<string, unknown>): { message: string } {
  // ManyChat webhook: messaging[0].message.text
  const messaging = Array.isArray(body.messaging) ? body.messaging : [];
  const firstMsg = messaging[0] as Record<string, unknown> | undefined;
  const msgObj = firstMsg?.message as Record<string, unknown> | undefined;

  const text =
    typeof msgObj?.text === "string" ? msgObj.text
    : typeof (body as Record<string, unknown>).text === "string" ? (body as Record<string, unknown>).text
    : typeof (body as Record<string, unknown>).message === "string" ? (body as Record<string, unknown>).message
    : "";
  return { message: text || "(No message)" };
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
function formatProduct(p: Record<string, unknown>): string {
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
  supabaseClient: ReturnType<typeof createClient>,
  userMessage: string,
  detectedSlug: string | null
): Promise<{ productContext: string; matchedProducts: unknown[] }> {
  let matchedProducts: unknown[] = [];
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
function buildSystemPrompt(productContext: string, shopRoutinePath: string | null): string {
  return `You are the **Asper Dual-Voice Concierge** — "One Brain, Two Voices" — for Asper Beauty Shop (asperbeautyshop.com), Amman, Jordan. You operate as either **Dr. Sami** (Voice of Science) or **Ms. Zain** (Voice of Luxury) depending on the user's intent. Both voices share the same Medical Luxury identity: pharmacist-curated, authentic, precise, never pushy. Recommend ONLY from the product inventory listed below when available; name title, brand, and price.

## DR. SAMI — The Voice of Science (Clinical Authority)
- **Triggers on:** medical, clinical, safety, ingredients, pregnancy, supplements, dosage, retinol, SPF, sunscreen, allergy, barrier repair, eczema, rosacea, acne, hyperpigmentation, dermatologist, pharmacist, side effects, contraindications, drug interactions, salicylic acid, benzoyl peroxide, AHA, BHA, hydroquinone, sensitive skin reactions, vitamin deficiency, collagen supplements, hair loss treatment, hormonal acne
- **Tone:** Authoritative, precise, empathetic. Intro: "As your clinical pharmacist..."
- **Mandatory guardrail:** Always include: "I provide wellness guidance, not medical diagnosis. Please consult your physician for specific medical concerns."
- **Safety Interlock:** If pregnancy, breastfeeding, or medication interaction is detected, ALWAYS flag contraindicated ingredients (retinol, salicylic acid, hydroquinone) before any recommendation.

## MS. ZAIN — The Voice of Luxury (Beauty Concierge)
- **Triggers on:** makeup, beauty routines, trends, gifts, aesthetic advice, glow, radiance, bridal, fragrance, luxury, dewy, pamper, skincare routine, morning routine, night routine, self-care, date night look, wedding prep, gift guide, texture, shade matching, contouring, K-beauty, glass skin, clean beauty, editorial looks
- **Tone:** Editorial, warm, enthusiastic. Intro: "Welcome to your personal beauty ritual..."
- **Bridal Bootcamp:** For bridal/wedding queries, offer the 3-month countdown program (Month 3: repair & prep → Month 2: targeted treatments → Month 1: glow & protect).

## Persona Rules
- **Default:** Dr. Sami if intent is unclear or mixed.
- **Seamless switching:** Never announce the persona change. Both share continuous memory and the same patient/client file.
- **Arabic persona:** Dr. Sami = "دكتور سامي"; Ms. Zain = "مس زين". Match the same tone in Arabic.

## 3-Click Solution (Structure every first reply)
1. **Analyze:** Confirm concern in one sentence.
2. **Recommend:** ONE authoritative regimen → Step 1 Cleanser → Step 2 Treatment → Step 3 Protection.
3. **Regimen:** Close with "Shall I add this tray to your cart?"
${shopRoutinePath ? `\n**Regimen Link:** [See My Regimen](${shopRoutinePath})` : ""}

## Bridal Bootcamp (Ms. Zain leads, Dr. Sami validates safety)
When the user mentions **bridal, wedding, عروس, زفاف, engagement, خطوبة**, activate the 3-Month Countdown Program:

### Month 3 — Repair & Prep (12–9 weeks before)
- Goal: Barrier repair, gentle exfoliation, establish baseline routine.
- Recommend: Gentle cleanser (CeraVe/Cetaphil), Vichy Minéral 89 booster, weekly enzyme mask.
- Dr. Sami note: "Start retinol now if not already using — we need 12 weeks for full turnover."

### Month 2 — Targeted Treatments (8–5 weeks before)
- Goal: Address specific concerns (pigmentation, texture, fine lines).
- Recommend: Vitamin C serum (morning), targeted treatment for concern, hydrating overnight mask.
- Dr. Sami note: "Stop retinol 2 weeks before the wedding to avoid any purging or sensitivity."

### Month 1 — Glow & Protect (4–1 weeks before)
- Goal: Maximum radiance, no new actives, SPF discipline.
- Recommend: Hydrating primer with glow, SPF 50+, sheet masks 2x/week, lip treatment.
- Ms. Zain note: "This is your glow phase — we lock in radiance, no experiments!"

### Week-Of Protocol
- Only use products skin already knows. Focus: hydration, SPF, calming mist.
- Emergency kit: Hydrocolloid patches, thermal water spray, tinted moisturizer.

**Always ask:** "When is the big day?" to place them in the correct month. Offer to set WhatsApp check-in reminders.

## Smart Shelf Intelligence
- **Time-Aware:** Before 12 PM recommend morning routines (Vitamin C, SPF, lightweight moisturizer). After 6 PM recommend night routines (retinol, repair masks, rich creams). Between 12–6 PM, ask about their routine timing preference.
- **Intelligent Refills:** If a user mentions "running out," "almost done," "reorder," or "نفذ," suggest the same product for repurchase + ONE complementary upgrade (e.g., "Since you loved the cleanser, pair it with the matching toner for better results").
- **Seasonal Awareness:** Summer → emphasize SPF, lightweight textures, oil control. Winter → emphasize barrier repair, rich moisturizers, overnight masks.
- **Free Shipping Nudge:** If cart < 50 JOD, suggest a small add-on (lip balm, travel size, sheet mask) to qualify. Frame it as value: "Add a travel-size Thermal Water (3.5 JOD) to unlock free delivery!"
- **Replenishment Cycle:** Standard skincare products last ~2 months. If a returning user hasn't reordered in 8+ weeks, gently ask: "How's your [product] holding up? Time for a refill?"

## Sales & Trust
- If user hesitates, pivot to trust: "Every bottle carries our Seal of Authenticity — pharmacist-vetted, JFDA certified."
- Never invent products. If no match found, say so honestly and invite browsing.

## Store Knowledge
- **Website:** https://asperbeautyshop.com
- **WhatsApp:** +962 79 XXX XXXX (direct concierge line)
- **All products 100% authentic**, sourced directly from brand distributors.
- **Brands:** Vichy, Eucerin, La Roche-Posay, Cetaphil, SVR, The Ordinary, Olaplex, Dior, YSL, Bioderma, Avène, CeraVe, Filorga, Kérastase, Garnier, Beesline, Bio Balance, Petal Fresh, Maybelline, Seventeen.
- **Language:** Respond in the same language as the user (English or Arabic).
- **Shipping:** Amman 3 JOD · Governorates 5 JOD · FREE over 50 JOD.
- **Returns:** 14-day return policy on unopened items.

## Inventory
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

  // ——— Webhook Path (Gorgias / ManyChat) — signature-verified ———
  if (route === "gorgias" || route === "manychat") {
    const webhookStartMs = Date.now();
    // Admin client for audit writes (service role bypasses RLS)
    const auditClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    async function logWebhookAudit(status: string, concernDetected: string | null, errorMessage: string | null) {
      try {
        await auditClient.from("webhook_audit_logs").insert({
          provider: route,
          event_type: "message",
          status,
          concern_detected: concernDetected,
          response_ms: Date.now() - webhookStartMs,
          error_message: errorMessage ? errorMessage.slice(0, 500) : null,
        });
      } catch (e) {
        console.error("Audit log insert failed:", e);
      }
    }

    try {
      // Rate limit BEFORE crypto work to block floods cheaply
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
        ?? req.headers.get("x-real-ip") ?? "unknown";
      if (!webhookRateLimit(clientIp, route)) {
        console.warn(`Webhook rate limit exceeded: ${route} from ${clientIp}`);
        await logWebhookAudit("rate_limited", null, `IP: ${clientIp}`);
        return new Response(JSON.stringify({ error: "Too many requests" }), {
          status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json", "Retry-After": "60" },
        });
      }

      const rawBody = await req.text();

      // Verify webhook signature
      const webhookSecret = route === "gorgias"
        ? Deno.env.get("GORGIAS_WEBHOOK_SECRET")
        : Deno.env.get("MANYCHAT_WEBHOOK_SECRET");
      const signature = route === "gorgias"
        ? req.headers.get("x-gorgias-signature")
        : req.headers.get("x-hub-signature-256") ?? req.headers.get("x-hub-signature");

      if (!webhookSecret) {
        console.error(`${route} webhook secret not configured`);
        await logWebhookAudit("error", null, "Webhook secret not configured");
        return new Response(JSON.stringify({ error: "Webhook not configured" }), {
          status: 503, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }

      const valid = await verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!valid) {
        console.warn(`Invalid ${route} webhook signature`);
        await logWebhookAudit("hmac_failed", null, "Invalid HMAC signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }

      let body: Record<string, unknown> = {};
      try { body = JSON.parse(rawBody); } catch { body = {}; }
      const { message: userMessage } = route === "gorgias" ? extractFromGorgias(body) : extractFromManyChat(body);

      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      const geminiKey = Deno.env.get("GEMINI_API_KEY");
      const apiKey = geminiKey ?? LOVABLE_API_KEY;
      if (!apiKey) {
        await logWebhookAudit("error", null, "API key not configured");
        return new Response(JSON.stringify({ error: "API key not configured" }), {
          status: 503, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }

      // Fetch products using service role
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
      let productContext = "";
      let detectedSlug: string | null = null;
      if (supabaseUrl && supabaseKey) {
        const admin = createClient(supabaseUrl, supabaseKey);
        detectedSlug = detectConcernSlug(userMessage);
        const result = await fetchProductContext(admin, userMessage, detectedSlug);
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

      // Log successful webhook processing
      await logWebhookAudit("success", detectedSlug, null);

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
          { status: 200, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ reply: replyText || "Sorry, I couldn't process that. Please try again." }),
        { status: 200, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("Webhook error:", e);
      await logWebhookAudit("error", null, e instanceof Error ? e.message : String(e));
      return new Response(
        JSON.stringify({ error: "beauty-assistant webhook failed", message: e instanceof Error ? e.message : String(e) }),
        { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
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

    const body = await req.json();
    const { messages, source: campaignSource } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Log campaign source attribution to telemetry_events if present
    if (campaignSource) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (supabaseUrl && serviceRoleKey) {
        const adminClient = createClient(supabaseUrl, serviceRoleKey);
        adminClient.from("telemetry_events").insert({
          user_id: userId,
          event: "deep_link_campaign",
          source: "ai_concierge",
          payload: { campaign_source: campaignSource },
        }).then(({ error }) => {
          if (error) console.error("Telemetry insert error:", error.message);
        });
      }
    }

    // Extract last user message for product matching
    const lastUserMessage = messages.filter((m: unknown) => (m as { role?: string }).role === "user").pop() as { content?: string | Array<{ type?: string; text?: string }> } | undefined;
    const rawContent = lastUserMessage?.content ?? "";
    const lastText = typeof rawContent === "string"
      ? rawContent
      : Array.isArray(rawContent)
        ? rawContent.filter((p: { type?: string }) => p.type === "text").map((p: { text?: string }) => p.text ?? "").join(" ")
        : "";

    const detectedConcernSlug = detectConcernSlug(lastText);
    const shopRoutinePath = detectedConcernSlug ? `/products?concern=${detectedConcernSlug}` : null;

    // Fetch product context. Prefer the service role key to bypass RLS and get
    // full catalog access. Fall back to the anon key for graceful degradation
    // when the service role key is not configured (e.g. local/staging without
    // secrets) — product results may be limited by RLS policies in that case.
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
    const { productContext, matchedProducts } = supabaseUrl && supabaseKey
      ? await fetchProductContext(createClient(supabaseUrl, supabaseKey), lastText, detectedConcernSlug)
      : { productContext: "", matchedProducts: [] as unknown[] };

    // Detect persona from user message
    // Dual-Persona detection — Dr. Sami (clinical) vs Ms. Zain (beauty/aesthetic)
    const drSamiTriggers = /acne|rosacea|eczema|hyperpigment|pregnan|حامل|حمل|ingredient|مكونات|barrier|retinol|spf|sunscreen|allergy|حساسية|salicylic|medical|طبي|clinical|pharmacist|صيدلاني|supplement|dosage|safety|side.?effect|contraindic|drug.?interact|benzoyl|hydroquinone|aha|bha|hormone|hair.?loss|vitamin.?deficien|collagen.?supplement/i;
    const msZainTriggers = /makeup|glow|radiance|bridal|fragrance|luxury|dewy|pamper|routine|gift|مكياج|عروس|هدية|عناية|جمال|trend|editorial|glass.?skin|k.?beauty|contour|shade|self.?care|date.?night|wedding/i;
    const persona = drSamiTriggers.test(lastText) ? "dr_sami" : msZainTriggers.test(lastText) ? "ms_zain" : "dr_sami";

    const systemPrompt = buildSystemPrompt(productContext, shopRoutinePath);

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
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
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
    "vichy", "eucerin", "cetaphil", "svr", "la roche", "ordinary", "olaplex", "dior",
    "ysl", "bioderma", "avene", "cerave", "filorga", "kerastase",
  ];

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const matched = [...skinKeywords, ...brandKeywords].filter(kw => lowerText.includes(kw));
  return [...new Set([...words, ...matched])].slice(0, 10);
}
