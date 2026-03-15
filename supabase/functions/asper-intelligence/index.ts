import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.asperbeautyshop.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TEXT_MODEL = "google/gemini-2.5-flash";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

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

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!lovableApiKey && !geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "AI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, prompt, image, persona, text, catalog } = await req.json();

    if (action === "chat") {
      const isClinical = persona === "clinical";
      const inventory = (catalog || [])
        .map((p: { title: string; price: string }) => `${p.title} (${p.price} JOD)`)
        .join(", ");

      const systemContent = `You are the Asper AI Protocol. Inventory: ${inventory}.
        ${
          isClinical
            ? "Role: Dr. Sami (Pharmacist). Tone: Clinical, safety-first, authoritative. Jordan market context. Sign: '- Dr. Sami, Asper Clinical Support'."
            : "Role: Ms. Zain (Beauty Concierge). Tone: Radiant, high-end, friendly. Focus on rituals. Sign: '- Ms. Zain, Asper Beauty Concierge'."
        }
        Limit to 3 concise sentences. Priority: Catalog recommendations.`;

      const userContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
        { type: "text", text: prompt },
      ];
      if (image) {
        userContent.push({ type: "image_url", image_url: { url: image } });
      }

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lovableApiKey}`,
        },
        body: JSON.stringify({
          model: TEXT_MODEL,
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: userContent },
          ],
        }),
      });

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content ??
        "Intelligence protocol reset required. Please standby.";

      return new Response(
        JSON.stringify({ reply }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "tts") {
      if (!geminiApiKey) {
        return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const isClinical = persona === "clinical";
      const voiceName = isClinical ? "Puck" : "Aoede";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
            },
          }),
        }
      );

      const data = await response.json();
      const part = data.candidates?.[0]?.content?.parts?.[0];

      if (!part?.inlineData) {
        return new Response(
          JSON.stringify({ error: "No audio generated" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          audioData: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("asper-intelligence error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
