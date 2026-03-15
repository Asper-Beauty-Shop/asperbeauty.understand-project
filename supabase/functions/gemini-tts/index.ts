/**
 * Gemini TTS — Supabase Edge Function
 * Converts text to speech using Google Gemini 2.5 Flash TTS.
 * Persona → Voice: dr-sami → Puck | ms-zain → Aoede
 * Returns: audio/wav binary blob
 */
declare const Deno: { env: { get(key: string): string | undefined } };
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const VOICE_MAP: Record<string, string> = {
  "dr-sami": "Puck",
  "ms-zain": "Aoede",
  "dr_sami": "Puck",
  "ms_zain": "Aoede",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.asperbeautyshop.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const text = (body.text as string | undefined)?.trim();
    const persona = (body.persona as string | undefined) ?? "ms-zain";

    if (!text) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const voiceName = VOICE_MAP[persona] ?? "Aoede";
    // Clean markdown for TTS
    const cleanText = text
      .replace(/[#*_`~>[\]()!]/g, "")
      .replace(/\n+/g, ". ")
      .slice(0, 5000); // Gemini TTS limit

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: cleanText }] }],
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

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err.error?.message ?? `Gemini TTS error ${res.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const audioB64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType ?? "audio/wav";

    if (!audioB64) {
      return new Response(JSON.stringify({ error: "No audio returned from Gemini TTS" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode base64 → binary
    const binaryStr = atob(audioB64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    return new Response(bytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": mimeType,
        "Content-Length": String(bytes.length),
      },
    });

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
