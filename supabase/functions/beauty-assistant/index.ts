/**
 * Beauty Assistant (Dr. Bot) — Supabase Edge Function.
 * Dr. Bot = Asper Dual-Voice Concierge: Dr. Sami (clinical) + Ms. Zain (luxury). 
 * Upgraded to "Super Smart" Architecture (March 2026).
 */
declare const Deno: { env: { get(key: string): string | undefined } };
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CONCERN_MAPPING: Record<string, string[]> = {
  "acne": ["Concern_Acne", "Concern_Oiliness"],
  "anti-aging": ["Concern_Aging", "Concern_AntiAging", "Concern_Wrinkles"],
  "hydration": ["Concern_Hydration", "Concern_Dryness"],
  "sensitivity": ["Concern_Sensitivity", "Concern_Redness", "Concern_RosaceaSafe"],
  "dark-spots": ["Concern_Pigmentation", "Concern_Brightening", "Concern_DarkSpots"],
  "sun-protection": ["Concern_SunProtection"],
  "hair-loss": ["Concern_HairLoss"],
  "pregnancy-safe": ["Concern_PregnancySafe"],
};

function getCorsHeaders(req: Request): Record<string, string> {
  const allowOrigin: string = Deno.env.get("ALLOWED_ORIGIN") ?? req.headers.get("Origin") ?? "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-webhook-route",
  };
}

function getWebhookRoute(req: Request): "gorgias" | "manychat" | null {
  try {
    const url = new URL(req.url);
    const routeParam = url.searchParams.get("route")?.toLowerCase();
    if (routeParam === "gorgias" || routeParam === "manychat") return routeParam;
    const header = req.headers.get("x-webhook-route")?.toLowerCase();
    if (header === "gorgias" || header === "manychat") return header;
  } catch { /* ignore */ }
  return null;
}

function extractFromGorgias(body: Record<string, unknown>): { message: string } {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = messages.filter((m: unknown) => m && typeof m === "object").pop() as Record<string, unknown> | undefined;
  const text = typeof last?.body_text === "string" ? last.body_text : "";
  return { message: text || "(No message)" };
}

function extractFromManyChat(body: Record<string, unknown>): { message: string } {
  const data = body.data as Record<string, unknown> | undefined;
  const extractedMessage = (data?.text as string) || (body.message as string) || "";
  return { message: extractedMessage };
}

function detectConcernSlug(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\b(acne|pimple|blemish|breakout|pore)\b/.test(lower)) return "acne";
  if (/\b(aging|wrinkle|fine line|retinol|collagen|firm)\b/.test(lower)) return "anti-aging";
  if (/\b(dry|tight|dehydrat|moistur)\b/.test(lower)) return "hydration";
  if (/\b(sensitive|red|irritat|calm|sooth)\b/.test(lower)) return "sensitivity";
  if (/\b(spot|pigment|bright|vit c|glow)\b/.test(lower)) return "dark-spots";
  if (/\b(sun|spf|burn|uv)\b/.test(lower)) return "sun-protection";
  if (/\b(hair|loss|thin|scalp)\b/.test(lower)) return "hair-loss";
  if (/\b(pregnant|pregnancy|baby|breastfeed)\b/.test(lower)) return "pregnancy-safe";
  return null;
}

function formatProduct(product: Record<string, unknown>): string {
  const step = typeof product.regimen_step === "string" ? product.regimen_step.replace("Step_", "") : "";
  return `- **${product.title}** (${product.brand}) | ${product.price} JOD | Step: ${step} | Note: ${product.pharmacist_note || "Pharmacist-curated"}`;
}

// deno-lint-ignore no-explicit-any
async function fetchProductContext(supabase: any, userMessage: string, slug: string | null) {
  let matchedProducts: Record<string, unknown>[] = [];
  if (slug) {
    const enums = CONCERN_MAPPING[slug] || [];
    const { data } = await supabase.from("products").select("*").in("primary_concern", enums).gt("inventory_total", 0).limit(6);
    matchedProducts = data || [];
  }
  if (matchedProducts.length === 0) {
    const { data } = await supabase.from("products").select("*").gt("inventory_total", 0).limit(6);
    matchedProducts = data || [];
  }
  return { context: matchedProducts.map(formatProduct).join("\n"), products: matchedProducts };
}

function buildSystemPrompt(productContext: string, shopRoutinePath: string | null): string {
  return `
# DR. BOT — THE ASPER DUAL-VOICE CONCIERGE
You are the high-intelligence AI for Asper Beauty Shop (asperbeautyshop.com) in Jordan. 
You operate in **Controlled AI Mode** as a Digital Dermatologist Assistant.

## YOUR DUAL-PERSONA
1. **DR. SAMI (The Voice of Science)**: Used for clinical, safety, and ingredient queries. Intro: "As your clinical pharmacist..."
2. **MS. ZAIN (The Voice of Luxury)**: Used for aesthetic, lifestyle, and ritual queries. Intro: "Welcome to your personal beauty ritual..."

## LANGUAGE & MIRRORING
1. **STRICT MIRRORING**: Always respond in the EXACT language the customer uses. If they speak Arabic, respond in premium Arabic (Tajawal font style). If English, use elegant English.
2. **BILINGUAL SALES**: Use persuasive marketing terminology native to the chosen language.

## SALES & MARKETING INTELLIGENCE
You are a high-performance Sales Consultant. Your goal is to maximize Basket Value (AOV) and Conversion.
1. **THE UPSELL**: Never recommend just one product. Recommend a 3-step Regimen (Cleanser + Treatment + Protection).
2. **THE CLOSER**: Always end with a call-to-action (CTA). Example: "Would you like me to add this personalized tray to your bag?"
3. **MARKETING HOOKS**: Mention "Same-day Concierge Delivery in Amman" and "Free Shipping on orders over 50 JOD."
4. **SCARCITY & TRUST**: Use terms like "Top-rated by our clinical team" and "Highly requested in our Amman boutique."

## CORE MISSION
- Increase conversion by providing expert, trustworthy guidance.
- Guide treatment decisions without diagnosing.
- **MANDATORY GUARDRAIL**: "I provide professional skincare guidance, not medical diagnosis."

## OPERATION RULES
1. **ASK BEFORE RECOMMENDING**: Always ask for skin type, allergies, and pregnancy status before suggesting products.
2. **LIMIT SUGGESTIONS**: Recommend a maximum of 3 products (The Clinical 3-Step Regimen).
3. **BILINGUAL**: Detect user language (English/Arabic) and maintain it. Use Tajawal/RTL for Arabic.
4. **NO HALLUCINATIONS**: Only recommend products from the inventory context below.
5. **SHIPPING**: Amman 3 JOD, Governorates 5 JOD, FREE > 50 JOD. Same-day concierge delivery in Amman.

## RESPONSE STRUCTURE (3-CLICK SOLUTION)
1. Confirm the concern with empathy.
2. Recommend ONE regimen: Step 1 (Cleanser) → Step 2 (Treatment) → Step 3 (Protection).
3. Close with: "Shall I add this clinical tray to your regimen?"

## CURRENT INVENTORY CONTEXT
${productContext}

${shopRoutinePath ? `Direct link to regimen: [View on Site](${shopRoutinePath})` : ""}
`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: getCorsHeaders(req) });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (req.method === "GET") return new Response(JSON.stringify({ status: "active", version: "5.0-super-smart" }), { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });

  try {
    const route = getWebhookRoute(req);
    let userMessage = "";
    let messages: Array<{ role: string; content: string }> = [];

    if (route) {
      const body = await req.json();
      userMessage = route === "gorgias" ? extractFromGorgias(body).message : extractFromManyChat(body).message;
      messages = [{ role: "user", content: userMessage }];
    } else {
      const body = await req.json();
      messages = body.messages;
      userMessage = messages[messages.length - 1].content;
    }

    const slug = detectConcernSlug(userMessage);
    const { context, products } = await fetchProductContext(supabase, userMessage, slug);
    const systemPrompt = buildSystemPrompt(context, slug ? `/products?concern=${slug}` : null);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(chatMessage => ({ role: chatMessage.role === "assistant" ? "assistant" : "user", content: chatMessage.content })),
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }), {
        status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up your Lovable workspace." }), {
        status: 402, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const aiResponseData = await res.json();
    const replyText = aiResponseData.choices?.[0]?.message?.content || "I apologize, I am processing your request. Please wait a moment.";

    if (route === "manychat") {
      return new Response(JSON.stringify({
        version: "v2",
        content: {
          messages: [{ type: "text", text: replyText }],
          quick_replies: [
            { type: "node", caption: "🧴 Acne Help", target: "acne" },
            { type: "node", caption: "✨ Glow Routine", target: "glow" },
            { type: "node", caption: "👤 Human Support", target: "human" }
          ]
        }
      }), { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ reply: replyText, products: products.map((product: Record<string, unknown>) => ({ id: product.id, title: product.title, handle: product.handle })) }), { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });
  }
});


