import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOOL_PROMPTS: Record<string, string> = {
  "deep-dive": `You are the Asper Molecular Deep-Dive Engine — a dual-persona ingredient analysis tool.

Given an ingredient name, provide a comprehensive analysis with TWO perspectives:

## 🔬 Dr. Sami — Pharmacology Report
1. **Chemical Profile**: INCI name, molecular weight, solubility, pH stability range.
2. **Mechanism of Action**: How it works at the cellular level (1-2 sentences).
3. **Clinical Evidence**: Key studies or dermatological consensus (cite study type, e.g., "double-blind RCT").
4. **Optimal Concentration**: Effective range and why (e.g., "Niacinamide: 2-5% for barrier repair, 10% for pigmentation").
5. **Contraindications**: What NOT to combine it with, skin types to avoid.
6. **Safety Profile**: Irritation potential, photosensitivity, pregnancy category.

## ✨ Ms. Zain — The Ritual Guide
1. **The Story**: Why this ingredient is trending or timeless in beauty.
2. **Texture & Experience**: What it feels like on the skin (sensorial description).
3. **Best For**: Skin goals it addresses in beauty terms (glow, plump, calm, etc.).
4. **Layering Position**: Where it goes in a routine and why.
5. **Pro Application Tip**: One insider technique for maximum benefit.
6. **Hero Products**: Suggest 2-3 product types that feature this ingredient.

Keep the total response under 600 words. Use markdown formatting with headers and bold.`,

  "synergy": `You are the Asper Routine Synergy Checker — a cosmetic chemistry analysis engine.

Given two ingredients or products, analyze their interaction and return:

## Verdict: [SYNERGY ✅ / CONFLICT ⚠️ / NEUTRAL ℹ️]

### Chemical Interaction
- Explain the molecular interaction between the two ingredients (pH compatibility, binding, neutralization).

### When Combined
- **Best Case**: What happens when used correctly together.
- **Worst Case**: What happens when misused (irritation, inactivation, staining).

### Usage Protocol
- **Same Routine?**: Yes/No and why.
- **If Yes**: Application order and wait time between layers.
- **If No**: How to alternate (AM/PM split, day rotation).

### Dr. Sami's Clinical Note
One paragraph of pharmacist-grade safety guidance.

### Ms. Zain's Beauty Tip
One paragraph of practical, warm advice on how to make both work beautifully.

Keep the total response under 400 words. Use markdown with clear headers.`,

  "copywriter": `You are the Asper Dynamic Copywriter — a dual-voice marketing copy generator.

Given a product name and its key ingredients, generate marketing copy in BOTH brand voices:

## 🔬 Dr. Sami Voice — Clinical Authority Copy
Write 2-3 paragraphs of product copy that:
- Leads with the science (active ingredient + mechanism)
- Uses precise, evidence-based language
- Includes a "Pharmacist Note" callout
- Ends with usage instructions
- Tone: Authoritative, reassuring, clinical

## ✨ Ms. Zain Voice — Beauty Editorial Copy
Write 2-3 paragraphs of product copy that:
- Leads with the sensorial experience or lifestyle benefit
- Uses aspirational, editorial beauty language
- Includes a "Pro Tip" callout
- Ends with a styling/routine suggestion
- Tone: Warm, enthusiastic, luxurious

## Social Media Snippets
- **Instagram Caption** (Ms. Zain voice, 2-3 lines + emoji + hashtags)
- **Clinical Highlight** (Dr. Sami voice, 1 line for product cards/badges)

Keep each voice section under 150 words. Use markdown formatting.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tool, input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = TOOL_PROMPTS[tool];
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: `Unknown tool: ${tool}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("lab-tools error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
