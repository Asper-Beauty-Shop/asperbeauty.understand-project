import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const VOICE_MAP: Record<string, string> = {
  "dr-sami": "Puck",
  "ms-zain": "Aoede",
};

function pcmToWav(pcmBytes: Uint8Array, sampleRate = 24_000, channels = 1, bitsPerSample = 16): Uint8Array {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const dataSize = pcmBytes.byteLength;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, str: string) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  new Uint8Array(buffer).set(pcmBytes, 44);
  return new Uint8Array(buffer);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  // Auth check — require authenticated user
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  try {
    const { text, persona = "dr-sami" } = await req.json() as { text: string; persona?: string };

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "text is required" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY secret is not configured" }), { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    const voiceName = VOICE_MAP[persona.toLowerCase()] ?? "Puck";

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text.trim() }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[gemini-tts] Gemini API error:", geminiRes.status, errText);
      return new Response(JSON.stringify({ error: "Gemini API request failed", detail: errText }), { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    const geminiData = await geminiRes.json();
    const inlineData = geminiData?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (!inlineData?.data) {
      return new Response(JSON.stringify({ error: "No audio data returned from Gemini" }), { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    const binaryString = atob(inlineData.data as string);
    const pcmBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) pcmBytes[i] = binaryString.charCodeAt(i);

    const wavBytes = pcmToWav(pcmBytes);
    console.log(`[gemini-tts] ${wavBytes.byteLength} bytes WAV | user=${user.id} | persona=${persona} | voice=${voiceName}`);

    return new Response(wavBytes, {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "audio/wav", "Content-Length": String(wavBytes.byteLength), "X-Voice": voiceName, "X-Persona": persona, "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[gemini-tts] Unhandled error:", err);
    return new Response(JSON.stringify({ error: "Internal server error", message: String(err) }), { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }
});
