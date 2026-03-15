import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.asperbeautyshop.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch all products from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products, error: dbError } = await supabase
      .from("products")
      .select("id, name, description, category, price, brand, tags, image_url, in_stock");

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    // Use AI to find the best matching products
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a beauty product search assistant. Given a user query and a product catalog, return the IDs of the most relevant products (up to 5) ranked by relevance. Consider product names, descriptions, categories, brands, and tags when matching.`,
          },
          {
            role: "user",
            content: `User query: "${query}"\n\nProduct catalog:\n${JSON.stringify(products, null, 2)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_matching_products",
              description: "Return the IDs of matching products ranked by relevance",
              parameters: {
                type: "object",
                properties: {
                  product_ids: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of product UUIDs, ordered by relevance",
                  },
                },
                required: ["product_ids"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_matching_products" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    let matchedIds: string[] = [];
    if (toolCall?.function?.arguments) {
      const args = JSON.parse(toolCall.function.arguments);
      matchedIds = args.product_ids || [];
    }

    // Return matched products in order
    const matchedProducts = matchedIds.map((id: string) => products?.find((p: any) => p.id === id)).filter(Boolean);

    return new Response(JSON.stringify({ products: matchedProducts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
