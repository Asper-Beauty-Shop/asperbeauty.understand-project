/**
 * AI Product Search — Supabase Edge Function
 * Uses Google Gemini to find best-matching products from query.
 */
declare const Deno: { env: { get(key: string): string | undefined } };
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: products, error: dbError } = await supabase
      .from("products")
      .select("id, title, description, asper_category, price, brand, tags, image_url, inventory_total")
      .gt("inventory_total", 0)
      .limit(100);

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    const catalog = (products ?? []).map((p: Record<string, unknown>) => ({
      id: p.id,
      title: p.title,
      brand: p.brand,
      category: p.asper_category,
      price: p.price,
      tags: p.tags,
    }));

    const prompt = `You are a beauty product search assistant for Asper Beauty Shop, Jordan.
User query: "${query}"
Product catalog (JSON): ${JSON.stringify(catalog)}

Return ONLY a JSON array of up to 5 product IDs (UUIDs) ranked by relevance to the query.
Example: ["uuid1", "uuid2", "uuid3"]
Return ONLY the JSON array, no other text.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini error ${res.status}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    let matchedIds: string[] = [];
    try {
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (jsonMatch) matchedIds = JSON.parse(jsonMatch[0]);
    } catch { matchedIds = []; }

    const matchedProducts = matchedIds
      .map((id: string) => (products ?? []).find((p: Record<string, unknown>) => p.id === id))
      .filter(Boolean);

    return new Response(JSON.stringify({ products: matchedProducts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
