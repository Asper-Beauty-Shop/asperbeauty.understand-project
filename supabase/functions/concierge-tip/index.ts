/**
 * Concierge Tip — Supabase Edge Function
 * Dr. Sami clinical ingredient safety checker.
 * Migrated to Google Gemini 2.0 Flash.
 */
declare const Deno: { env: { get(key: string): string | undefined } };
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Dr. Sami, the clinical authority at Asper Beauty Shop — a luxury dermo-retail platform in Jordan.

Before generating a skincare tip, you MUST evaluate the product's key ingredients against the user's skin profile for contraindications (e.g., strong acids on sensitive skin, retinoids during pregnancy, conflicting actives in routines).

**If Safe:** Provide a 1-sentence professional insight on how to maximize the ingredient's clinical efficacy.

**If Unsafe/Harsh (Caution):** Explicitly advise caution in a reassuring, luxurious tone. Do NOT just say "avoid this." You MUST immediately recommend a gentler alternative category or specific active ingredient that achieves a similar result safely.

**If Ingredient Conflict:** Warn about the interaction and suggest a usage schedule (e.g., AM/PM separation) or a safer substitute.

You MUST respond with ONLY a valid JSON object in this exact format — no markdown, no backticks, no explanation:
{
  "status": "safe" | "caution" | "conflict",
  "dr_sami_insight": "Your 1-2 sentence clinical advice in the requested locale.",
  "recommended_alternative_ingredient": "PHA, Azelaic Acid, Bakuchiol, etc." or null if safe,
  "ui_accent_color": "#C5A028" for safe, "#800020" for caution/conflict
}

Mandatory disclaimer awareness: You provide professional skincare guidance, not medical diagnosis.
Tone: Clinical yet warm, luxurious yet trustworthy. You are a pharmacist, not a salesperson.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const { product_title, key_ingredients, skin_type, skin_concerns, locale } = await req.json();
    const lang = locale === "ar" ? "Arabic" : "English";

    const userPrompt = `Evaluate this product for the user and respond in ${lang}:

Product: ${product_title || "Unknown"}
Key Ingredients: ${(key_ingredients || []).join(", ") || "Not specified"}
User Skin Type: ${skin_type || "Not specified"}
User Skin Concerns: ${(skin_concerns || []).join(", ") || "Not specified"}

Provide your clinical assessment as the specified JSON object.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
        }),
      }
    );

    if (!res.ok) {
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Gemini error ${res.status}`);
    }

    const data = await res.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let tipData;
    try {
      const cleaned = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      // Extract JSON object if surrounded by other text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      tipData = JSON.parse(jsonMatch?.[0] ?? cleaned);
    } catch {
      tipData = {
        status: "safe",
        dr_sami_insight: rawContent || "Consult our pharmacist for personalized advice.",
        recommended_alternative_ingredient: null,
        ui_accent_color: "#C5A028",
      };
    }

    if (!["safe", "caution", "conflict"].includes(tipData.status)) tipData.status = "safe";
    tipData.ui_accent_color = tipData.status === "safe" ? "#C5A028" : "#800020";

    return new Response(JSON.stringify(tipData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
