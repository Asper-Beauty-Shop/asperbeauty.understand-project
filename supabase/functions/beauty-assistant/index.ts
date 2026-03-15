/**
 * Beauty Assistant — Supabase Edge Function
 * Dr. Bot = Asper Dual-Voice Concierge: Dr. Sami (clinical) + Ms. Zain (luxury).
 * Powered by Google Gemini 2.0 Flash with SSE streaming.
 */
declare const Deno: { env: { get(key: string): string | undefined } };
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CONCERN_MAPPING: Record<string, string[]> = {
  "acne":           ["Concern_Acne", "Concern_Oiliness"],
  "anti-aging":     ["Concern_Aging", "Concern_AntiAging", "Concern_Wrinkles"],
  "hydration":      ["Concern_Hydration", "Concern_Dryness"],
  "sensitivity":    ["Concern_Sensitivity", "Concern_Redness", "Concern_RosaceaSafe"],
  "dark-spots":     ["Concern_Pigmentation", "Concern_Brightening", "Concern_DarkSpots"],
  "sun-protection": ["Concern_SunProtection"],
  "hair-loss":      ["Concern_HairLoss"],
  "pregnancy-safe": ["Concern_PregnancySafe"],
};

const SAFETY_KEYWORDS: Record<string, string[]> = {
  pregnancy:   ["pregnant", "pregnancy", "breastfeed", "nursing"],
  sensitivity: ["sensitive", "allergic", "allergy", "rosacea", "eczema"],
  pediatric:   ["child", "baby", "infant", "toddler"],
};

function getCorsHeaders(req: Request): Record<string, string> {
  const allowOrigin = Deno.env.get("ALLOWED_ORIGIN") ?? req.headers.get("Origin") ?? "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-webhook-route",
    "Access-Control-Expose-Headers": "X-Persona, X-Safety-Flags",
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

function extractFromGorgias(body: Record<string, unknown>): string {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = messages.filter((m: unknown) => m && typeof m === "object").pop() as Record<string, unknown> | undefined;
  return typeof last?.body_text === "string" ? last.body_text : "(No message)";
}

function extractFromManyChat(body: Record<string, unknown>): string {
  const data = body.data as Record<string, unknown> | undefined;
  return (data?.text as string) || (body.message as string) || "";
}

function detectConcernSlug(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\b(acne|pimple|blemish|breakout|pore)\b/.test(lower)) return "acne";
  if (/\b(aging|wrinkle|fine.?line|retinol|collagen|firm)\b/.test(lower)) return "anti-aging";
  if (/\b(dry|tight|dehydrat|moistur)\b/.test(lower)) return "hydration";
  if (/\b(sensitive|red|irritat|calm|sooth)\b/.test(lower)) return "sensitivity";
  if (/\b(spot|pigment|bright|vit.?c|glow)\b/.test(lower)) return "dark-spots";
  if (/\b(sun|spf|burn|uv)\b/.test(lower)) return "sun-protection";
  if (/\b(hair|loss|thin|scalp)\b/.test(lower)) return "hair-loss";
  if (/\b(pregnant|pregnancy|baby|breastfeed)\b/.test(lower)) return "pregnancy-safe";
  return null;
}

function detectSafetyFlags(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.entries(SAFETY_KEYWORDS)
    .filter(([, kw]) => kw.some(k => lower.includes(k)))
    .map(([flag]) => flag);
}

function detectPersona(text: string): "dr_sami" | "ms_zain" {
  const clinical = /\b(ingredient|clinical|study|retinol|acid|spf|diagnos|medical|treat|concern|allerg|sensitiv|pregnan|pharmacist)\b/i;
  return clinical.test(text) ? "dr_sami" : "ms_zain";
}

function formatProduct(p: Record<string, unknown>): string {
  const step = typeof p.regimen_step === "string" ? p.regimen_step.replace("Step_", "") : "";
  return `- **${p.title}** (${p.brand}) | ${p.price} JOD | Step: ${step} | Note: ${p.pharmacist_note || "Pharmacist-curated"}`;
}

// deno-lint-ignore no-explicit-any
async function fetchProductContext(supabase: any, slug: string | null) {
  if (slug) {
    const enums = CONCERN_MAPPING[slug] || [];
    const { data } = await supabase.from("products").select("*").in("primary_concern", enums).gt("inventory_total", 0).limit(6);
    if (data?.length) return { context: data.map(formatProduct).join("\n"), products: data };
  }
  const { data } = await supabase.from("products").select("*").gt("inventory_total", 0).limit(6);
  const products = data || [];
  return { context: products.map(formatProduct).join("\n"), products };
}

function buildSystemPrompt(productContext: string, persona: "dr_sami" | "ms_zain", safetyFlags: string[], shopRoutinePath: string | null): string {
  const personaVoice = persona === "dr_sami"
    ? `You are **DR. SAMI** — The Voice of Science. Start with: "As your clinical pharmacist..." Use precise, evidence-based language.`
    : `You are **MS. ZAIN** — The Voice of Luxury. Start with: "Welcome to your personal beauty ritual..." Use warm, aspirational language.`;

  const safetyNote = safetyFlags.length
    ? `\n## SAFETY INTERLOCK\nUser flags: ${safetyFlags.join(", ")}. Prioritize safety. Avoid contraindicated ingredients. Always recommend consulting a doctor.`
    : "";

  return `# DR. BOT — ASPER DUAL-VOICE CONCIERGE
You are the AI concierge for Asper Beauty Shop (asperbeautyshop.com), Jordan's premier dermocosmetics pharmacy.

## YOUR PERSONA
${personaVoice}

## LANGUAGE MIRRORING
Always respond in the EXACT language the customer uses. Premium Arabic for Arabic speakers, elegant English for English speakers.

## SALES INTELLIGENCE
- Recommend a 3-step Clinical Regimen (Cleanser → Treatment → Protection).
- Always close with a CTA: "Shall I add this tray to your bag?"
- Mention: "Same-day Concierge Delivery in Amman" and "Free Shipping over 50 JOD."
- Shipping: Amman 3 JOD | Governorates 5 JOD | FREE > 50 JOD.

## CORE RULES
- Ask for skin type, allergies, and pregnancy status before recommending.
- Only recommend products from the inventory context below.
- Max 3 product recommendations per response.
- Include: "I provide professional skincare guidance, not medical diagnosis."
- Respond in markdown format.
${safetyNote}

## CURRENT INVENTORY
${productContext}
${shopRoutinePath ? `\nRoutine link: [View Regimen](${shopRoutinePath})` : ""}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: getCorsHeaders(req) });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  if (req.method === "GET") {
    return new Response(JSON.stringify({ status: "active", version: "6.0-gemini-native" }), {
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

  try {
    const route = getWebhookRoute(req);
    const body = await req.json();
    let messages: Array<{ role: string; content: unknown }> = [];
    let userMessage = "";

    if (route) {
      userMessage = route === "gorgias" ? extractFromGorgias(body) : extractFromManyChat(body);
      messages = [{ role: "user", content: userMessage }];
    } else {
      messages = body.messages ?? [];
      const lastMsg = messages[messages.length - 1];
      userMessage = typeof lastMsg?.content === "string" ? lastMsg.content
        : Array.isArray(lastMsg?.content) ? (lastMsg.content as Array<{ type: string; text?: string }>)
            .filter(p => p.type === "text").map(p => p.text).join(" ")
        : "";
    }

    const slug = detectConcernSlug(userMessage);
    const persona = body.forcePersona ?? detectPersona(userMessage);
    const safetyFlags = detectSafetyFlags(userMessage);
    const { context, products } = await fetchProductContext(supabase, slug);
    const systemPrompt = buildSystemPrompt(context, persona as "dr_sami" | "ms_zain", safetyFlags, slug ? `/products?concern=${slug}` : null);

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Convert messages to Gemini content format
    const geminiContents = messages.map(m => {
      const role = m.role === "assistant" ? "model" : "user";
      if (typeof m.content === "string") {
        return { role, parts: [{ text: m.content }] };
      }
      // Multimodal content (image + text)
      const parts = (m.content as Array<{ type: string; text?: string; image_url?: { url: string } }>).map(p => {
        if (p.type === "text") return { text: p.text ?? "" };
        if (p.type === "image_url" && p.image_url?.url) {
          const [header, data] = p.image_url.url.split(",");
          const mimeType = header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
          return { inlineData: { mimeType, data } };
        }
        return { text: "" };
      });
      return { role, parts };
    });

    // Non-streaming path for webhooks
    if (route) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );
      const data = await res.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Processing your request...";

      if (route === "manychat") {
        return new Response(JSON.stringify({
          version: "v2",
          content: {
            messages: [{ type: "text", text: replyText }],
            quick_replies: [
              { type: "node", caption: "🧴 Acne Help", target: "acne" },
              { type: "node", caption: "✨ Glow Routine", target: "glow" },
              { type: "node", caption: "👤 Human Support", target: "human" },
            ],
          },
        }), { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ reply: replyText, products: products.slice(0, 3).map((p: Record<string, unknown>) => ({ id: p.id, title: p.title, handle: p.handle })) }),
        { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } });
    }

    // ── SSE Streaming path ─────────────────────────────────────────────────
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err.error?.message ?? `Gemini error ${geminiRes.status}` }), {
        status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Pipe Gemini SSE → OpenAI-compatible SSE for the frontend
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    (async () => {
      const reader = geminiRes.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (!json) continue;
            try {
              const parsed = JSON.parse(json);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                // Emit OpenAI-compatible SSE chunk
                const chunk = JSON.stringify({ choices: [{ delta: { content: text } }] });
                await writer.write(encoder.encode(`data: ${chunk}\n\n`));
              }
            } catch { /* skip malformed */ }
          }
        }
        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } finally {
        await writer.close().catch(() => null);
      }
    })();

    return new Response(readable, {
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Persona": persona,
        "X-Safety-Flags": safetyFlags.length ? safetyFlags.join(",") : "none",
      },
    });

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
