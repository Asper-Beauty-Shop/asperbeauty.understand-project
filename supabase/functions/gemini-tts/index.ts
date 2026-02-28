import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ── Asper Beauty Shop — Gemini TTS Edge Function ───────────────────────────
// Persona → Voice mapping
//   Dr. Sami (Clinical Pharmacist)  → Puck   (authoritative, precise)
//   Ms. Zain (Beauty Concierge)     → Aoede  (warm, lyrical)
//
// Flow: POST {text, persona} → Gemini REST API → PCM → WAV → audio/wav

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

// ── PCM → WAV conversion ──────────────────────────────────────────────────
// Gemini TTS returns raw 16-bit signed PCM at 24 000 Hz, mono.
// Browsers need a proper RIFF/WAV header to play it via <audio>.
function pcmToWav(pcmBytes: Uint8Array, sampleRate = 24_000, channels = 1, bitsPerSample = 16): Uint8Array {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const dataSize = pcmBytes.byteLength;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);   // ChunkSize
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);             // Subchunk1Size (PCM)
  view.setUint16(20, 1, true);              // AudioFormat (PCM = 1)
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

// ── Main handler ─────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const { text, persona = "dr-sami" } = await req.json() as {
      text: string;
      persona?: string;
    };

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY secret is not configured" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    const voiceName = VOICE_MAP[persona.toLowerCase()] ?? "Puck";

    // ── Call Gemini TTS REST API ───────────────────────────────────────────
    // Model: gemini-2.5-flash-preview-tts
    // The API returns audio data in the response candidates as base64-encoded PCM.
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [
        {
          parts: [{ text: text.trim() }],
        },
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName,
            },
          },
        },
      },
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[gemini-tts] Gemini API error:", geminiRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Gemini API request failed", detail: errText }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    const geminiData = await geminiRes.json();

    // Extract base64 PCM audio from response
    const inlineData =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.inlineData;

    if (!inlineData?.data) {
      console.error("[gemini-tts] No audio data in Gemini response:", JSON.stringify(geminiData));
      return new Response(
        JSON.stringify({ error: "No audio data returned from Gemini" }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    // Decode base64 PCM → Uint8Array → WAV
    const rawBase64 = inlineData.data as string;
    const binaryString = atob(rawBase64);
    const pcmBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      pcmBytes[i] = binaryString.charCodeAt(i);
    }

    const wavBytes = pcmToWav(pcmBytes);

    console.log(
      `[gemini-tts] Generated ${wavBytes.byteLength} bytes WAV | persona=${persona} | voice=${voiceName}`,
    );

    return new Response(wavBytes, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "audio/wav",
        "Content-Length": String(wavBytes.byteLength),
        "X-Voice": voiceName,
        "X-Persona": persona,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[gemini-tts] Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }
});
