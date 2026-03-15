import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.asperbeautyshop.com",
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth guard ---
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { product_title, key_ingredients, skin_type, skin_concerns, locale } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const lang = locale === "ar" ? "Arabic" : "English";
    const userPrompt = `Evaluate this product for the user and respond in ${lang}:

Product: ${product_title || "Unknown"}
Key Ingredients: ${(key_ingredients || []).join(", ") || "Not specified"}
User Skin Type: ${skin_type || "Not specified"}
User Skin Concerns: ${(skin_concerns || []).join(", ") || "Not specified"}

Provide your clinical assessment as the specified JSON object.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from the AI response (strip markdown fences if present)
    let tipData;
    try {
      const cleaned = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      tipData = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI JSON:", rawContent);
      // Fallback to safe default
      tipData = {
        status: "safe",
        dr_sami_insight: rawContent || "Consult our pharmacist for personalized advice.",
        recommended_alternative_ingredient: null,
        ui_accent_color: "#C5A028",
      };
    }

    // Validate and normalize
    if (!["safe", "caution", "conflict"].includes(tipData.status)) {
      tipData.status = "safe";
    }
    tipData.ui_accent_color = tipData.status === "safe" ? "#C5A028" : "#800020";

    return new Response(JSON.stringify(tipData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("concierge-tip error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
