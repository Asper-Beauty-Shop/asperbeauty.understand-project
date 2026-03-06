/**
 * Beauty Assistant (Dr. Bot) — Supabase Edge Function.
 * Dr. Bot = Asper Dual-Voice Concierge: Dr. Sami (clinical) + Ms. Zain (luxury). 
 * Upgraded to "Super Smart" Architecture (March 2026).
 */
declare const Deno: { env: { get(key: string): string | undefined } };
// @ts-expect-error — Deno URL imports; resolved at runtime by Supabase Edge
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error — Deno URL imports; resolved at runtime by Supabase Edge
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
  const text = typeof last?.body_text === "string" ? last.body_text : "";
  return { message: text || "(No message)" };
}

function extractFromManyChat(body: Record<string, unknown>): { message: string } {
  const data = body.data as Record<string, unknown> | undefined;
  return { message: (data?.text as string) || (body as any).message || "" };
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

function formatProduct(p: any): string {
  return `- **${p.title}** (${p.brand}) | ${p.price} JOD | Step: ${p.regimen_step?.replace("Step_", "")} | Note: ${p.pharmacist_note || "Pharmacist-curated"}`;
}

async function fetchProductContext(supabase: any, userMessage: string, slug: string | null) {
  let matched: any[] = [];
  if (slug) {
    const enums = CONCERN_MAPPING[slug] || [];
    const { data } = await supabase.from("products").select("*").in("primary_concern", enums).gt("inventory_total", 0).limit(6);
    matched = data || [];
  }
  if (matched.length === 0) {
    const { data } = await supabase.from("products").select("*").gt("inventory_total", 0).limit(6);
    matched = data || [];
  }
  return { context: matched.map(formatProduct).join("\n"), products: matched };
}

function buildSystemPrompt(productContext: string, shopRoutinePath: string | null): string {
  return `
# DR. BOT — THE ASPER DUAL-VOICE CONCIERGE
You are the high-intelligence AI for Asper Beauty Shop (asperbeautyshop.com) in Jordan. 
You operate in **Controlled AI Mode** as a Digital Dermatologist Assistant.

## YOUR DUAL-PERSONA
1. **DR. SAMI (The Voice of Science)**: Used for clinical, safety, and ingredient queries. Intro: "As your clinical pharmacist..."
2. **MS. ZAIN (The Voice of Luxury)**: Used for aesthetic, lifestyle, and ritual queries. Intro: "Welcome to your personal beauty ritual..."

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
    let messages: any[] = [];

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

    const apiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("LOVABLE_API_KEY")!;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    const data = await res.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I am processing your request. Please wait a moment.";

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

    return new Response(JSON.stringify({ reply: replyText, products: products.map(p => ({ id: p.id, title: p.title, handle: p.handle })) }), { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });
  }
});
