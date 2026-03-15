import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash";

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
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, prompt, image, persona, text, catalog } = await req.json();

    if (action === "chat") {
      // Build system instruction
      const isClinical = persona === "clinical";
      const inventory = (catalog || [])
        .map((p: { title: string; price: string }) => `${p.title} (${p.price} JOD)`)
        .join(", ");

      const systemInstruction = `
        You are the Asper AI Protocol. Inventory: ${inventory}.
        ${
          isClinical
            ? "Role: Dr. Sami (Pharmacist). Tone: Clinical, safety-first, authoritative. Jordan market context. Sign: '- Dr. Sami, Asper Clinical Support'."
            : "Role: Ms. Zain (Beauty Concierge). Tone: Radiant, high-end, friendly. Focus on rituals. Sign: '- Ms. Zain, Asper Beauty Concierge'."
        }
        Limit to 3 concise sentences. Priority: Catalog recommendations.
      `;

      const userContent = image
        ? `${prompt}\n[User attached an image for analysis]`
        : prompt;

      const response = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lovableApiKey}`,
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userContent },
          ],
        }),
      });

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content ?? "Intelligence protocol reset required. Please standby.";

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "tts") {
      // TTS via Lovable AI Gateway — generate spoken text as a text response
      // Note: Lovable AI Gateway doesn't support native TTS, so we return the text for client-side TTS
      return new Response(JSON.stringify({ 
        error: "TTS is not currently supported via the AI gateway. Please use browser-based speech synthesis.",
        text: text 
      }), {
        status: 501,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("asper-intelligence error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
