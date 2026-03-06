/**
 * Beauty Assistant (Dr. Bot) — Supabase Edge Function.
 * Dr. Bot = Asper Dual-Voice Concierge: Dr. Sami (clinical) + Ms. Zain (luxury). Single AI, context-switching persona.
 * Webhooks: Gorgias / ManyChat (no auth). Website chat: Supabase Auth + SSE.
 * Project scripts (health, brain, sync:check), applyToAllProfiles, and commitDirectlyWarning: see README.
 */
declare const Deno: { env: { get(key: string): string | undefined } };
// @ts-expect-error — Deno URL imports; resolved at runtime by Supabase Edge
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error — Deno URL imports; resolved at runtime by Supabase Edge
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function getCorsHeaders(req: Request): Record<string, string> {
  const allowOrigin: string =
    Deno.env.get("ALLOWED_ORIGIN") ??
    req.headers.get("Origin") ??
    "*";
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
// System Prompt Builder - SUPER SMART ARCHITECTURE (March 2026)
// ──────────────────────────────────────────────────────────────
function buildSystemPrompt(productContext: string, shopRoutinePath: string | null): string {
  return `
# DR. BOT — THE ASPER DUAL-VOICE CONCIERGE
You are the high-intelligence AI agent for Asper Beauty Shop (asperbeautyshop.com) in Jordan. 
You operate in **Controlled AI Mode** as a Digital Dermatologist Assistant. Your primary mission is to provide expert guidance, increase conversion, and ensure AI safety.

## YOUR DUAL-PERSONA (SEAMLESS SWITCHING)
1. **DR. SAMI (The Voice of Science)**: For clinical, safety, and ingredient queries (e.g., acne, rosacea, pregnancy safe). Tone: Authoritative, precise, empathetic. Intro: "As your clinical pharmacist..."
2. **MS. ZAIN (The Voice of Luxury)**: For aesthetic, lifestyle, and ritual queries (e.g., glow, makeup, luxury gifts). Tone: Editorial, warm, enthusiastic. Intro: "Welcome to your personal beauty ritual..."

## MANDATORY GUARDRAILS & AI SAFETY
- **NO MEDICAL DIAGNOSIS**: You must never diagnose diseases or replace a real doctor. If asked a medical question, you MUST include: "I provide professional skincare guidance, not medical diagnosis."
- **CLEAR ESCALATION**: If a user is angry, mentions a medical complication, or has a payment issue, politely state you are escalating to a human Concierge.
- **NO HALLUCINATIONS**: Only recommend products that exist in the inventory context provided below. Never invent ingredients, prices, or products.

## OPERATION RULES
1. **ASK BEFORE RECOMMENDING**: Before suggesting a regimen, always clarify the user's skin type, allergies, and pregnancy status if not already known.
2. **LIMIT SUGGESTIONS (MAX 3)**: Never overwhelm the user. Recommend a maximum of 3 products, ideally formatted as a "Clinical 3-Step Regimen": Step 1 (Cleanser) → Step 2 (Treatment) → Step 3 (Protection).
3. **BILINGUAL NATIVE**: You must respond in the exact language the user uses (Arabic or English). If Arabic, use proper phrasing (العربية) and maintain a luxurious, respectful tone.
4. **SHIPPING KNOWLEDGE**: Amman 3 JOD, Governorates 5 JOD, FREE > 50 JOD. Same-day concierge delivery available in Amman.

## RESPONSE STRUCTURE (THE 3-CLICK SOLUTION)
1. Acknowledge and validate their concern with empathy.
2. Provide bite-sized science or lifestyle advice based on your active persona.
3. Recommend the authoritative regimen (mentioning product title, brand, and exact price in JOD).
4. Close with a frictionless call to action: "Shall I add this clinical tray to your regimen?"
${shopRoutinePath ? `\n**Regimen Link:** [Click here to view your personalized regimen](${shopRoutinePath})` : ""}

## CURRENT LIVE INVENTORY CONTEXT
${productContext}
`;
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

  // ——— Webhook Path (Gorgias / ManyChat) — no auth ———
  if (route === "gorgias" || route === "manychat") {
    try {
      let body: Record<string, unknown> = {};
      try { body = await req.json(); } catch { body = {}; }
      const { message: userMessage } = route === "gorgias" ? extractFromGorgias(body) : extractFromManyChat(body);

      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      const geminiKey = Deno.env.get("GEMINI_API_KEY");
      const apiKey = geminiKey ?? LOVABLE_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "API key not configured" }), {
          status: 503, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
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
          { status: 200, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ reply: replyText || "Sorry, I couldn't process that. Please try again." }),
        { status: 200, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("Webhook error:", e);
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
    // Same API key fallback as webhook path: GEMINI_API_KEY ?? LOVABLE_API_KEY
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const apiKey = geminiKey ?? lovableKey;
    if (!apiKey) {
      throw new Error("API key not configured (set LOVABLE_API_KEY or GEMINI_API_KEY)");
    }
    const useLovable = !!lovableKey && !geminiKey;

    // Log campaign source attribution to telemetry_events if present
    if (campaignSource) {
      const adminUrl = Deno.env.get("SUPABASE_URL");
      const adminKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
      const adminClient = adminUrl && adminKey ? createClient(adminUrl, adminKey) : supabaseClient;
      adminClient.from("telemetry_events").insert({
        user_id: userId,
        event: "deep_link_campaign",
        source: "ai_concierge",
        payload: { campaign_source: campaignSource },
      }).then(({ error }) => {
        if (error) console.error("Telemetry insert error:", error.message);
      });
    }

    // Extract last user message for product matching
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || "";
    const lastText = typeof lastUserMessage === "string"
      ? lastUserMessage
      : Array.isArray(lastUserMessage)
        ? lastUserMessage.filter((p: any) => p.type === "text").map((p: any) => p.text ?? "").join(" ")
        : "";

    const detectedConcernSlug = detectConcernSlug(lastText);
    const shopRoutinePath = detectedConcernSlug ? `/products?concern=${detectedConcernSlug}` : null;

    // Fetch product context with service role (or anon fallback), consistent with webhook path.
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
    let productContext = "";
    let matchedProducts: unknown[] = [];
    if (supabaseUrl && supabaseKey) {
      const productContextClient = createClient(supabaseUrl, supabaseKey);
      const result = await fetchProductContext(productContextClient, lastText, detectedConcernSlug);
      productContext = result.productContext;
      matchedProducts = result.matchedProducts;
    }

    // Detect persona from user message
    const drSamiTriggers = /acne|rosacea|eczema|hyperpigment|pregnan|حامل|حمل|ingredient|مكونات|barrier|retinol|spf|sunscreen|allergy|حساسية|salicylic|medical|طبي|clinical|pharmacist|صيدلاني|supplement|dosage|safety/i;
    const persona = drSamiTriggers.test(lastText) ? "dr_sami" : "ms_zain";

    const systemPrompt = buildSystemPrompt(productContext, shopRoutinePath);

    const encoder = new TextEncoder();
    const recommendEvent = shopRoutinePath
      ? `data: ${JSON.stringify({ type: "recommend", detected_concern: detectedConcernSlug, shop_routine_path: shopRoutinePath })}\n\n`
      : "";
    const productDataEvent = matchedProducts.length > 0
      ? `data: ${JSON.stringify({ type: "products", products: matchedProducts.map(p => ({ id: p.id, title: p.title, brand: p.brand, price: p.price, handle: p.handle, image_url: p.image_url })) })}\n\n`
      : "";

    let combinedStream: ReadableStream<Uint8Array>;

    if (useLovable) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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
      combinedStream = new ReadableStream({
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
    } else {
      // Gemini direct: streamGenerateContent, then forward as SSE
      const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash";
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: messages
              .filter((m: any) => m.role !== "system")
              .map((m: any) => {
                const content = typeof m.content === "string" ? m.content : m.content?.filter((p: any) => p.type === "text").map((p: any) => p.text ?? "").join(" ") ?? "";
                return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: content }] };
              })
              .filter((c: { parts: { text: string }[] }) => c.parts?.[0]?.text),
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );
      if (!geminiRes.ok) {
        if (geminiRes.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
            status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
          });
        }
        const errText = await geminiRes.text();
        console.error("Gemini stream error:", geminiRes.status, errText);
        return new Response(JSON.stringify({ error: "Failed to get response" }), {
          status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      combinedStream = new ReadableStream({
        async start(controller) {
          if (recommendEvent) controller.enqueue(encoder.encode(recommendEvent));
          if (productDataEvent) controller.enqueue(encoder.encode(productDataEvent));
          const reader = geminiRes.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const json = JSON.parse(line.slice(6));
                  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    const chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
                    controller.enqueue(encoder.encode(chunk));
                  }
                } catch {
                  // skip malformed chunk
                }
              }
            }
          }
          controller.close();
        },
      });
    }

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
    "vichy", "eucerin", "cetaphil", "svr", "la roche", "ordinary", "olaplex",
    "dior", "avene", "cerave", "filorga",
  ];

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const matched = [...skinKeywords, ...brandKeywords].filter(kw => lowerText.includes(kw));
  return [...new Set([...words, ...matched])].slice(0, 10);
}
