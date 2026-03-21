import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function verifyJwt(req: Request, supabaseUrl: string, anonKey: string): Promise<{ userId: string } | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) return null;

  return { userId: data.claims.sub as string };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // --- JWT Authentication ---
    const auth = await verifyJwt(req, supabaseUrl, anonKey);
    if (!auth) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Rate limiting: 10 searches per 60 seconds per user ---
    const serviceClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: isLimited } = await serviceClient.rpc("check_rate_limit", {
      p_key: `ai-search:${auth.userId}`,
      p_max_requests: 10,
      p_window_seconds: 60,
    });
    if (isLimited === true) {
      return new Response(JSON.stringify({ error: "Search rate limit exceeded. Please wait." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Use anon client for product reads (publicly readable)
    const anonClient = createClient(supabaseUrl, anonKey);

    const { data: products, error: dbError } = await anonClient
      .from("products")
      .select("id, title, handle, brand, category, price, primary_concern, tags")
      .eq("availability_status", "in_stock")
      .order("bestseller_rank", { ascending: true, nullsFirst: false })
      .limit(200);

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a beauty product search assistant for Asper Beauty Shop (Jordan).
Given a user query and a product catalog, return the IDs of the most relevant products (up to 5) ranked by relevance.
Consider product titles, brands, categories, concerns, and tags when matching.`,
          },
          {
            role: "user",
            content: `User query: "${query}"\n\nProduct catalog:\n${JSON.stringify(products)}`,
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
                    description: "Array of product UUIDs, ordered by relevance (max 5)",
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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    let matchedIds: string[] = [];
    if (toolCall?.function?.arguments) {
      const args = JSON.parse(toolCall.function.arguments);
      matchedIds = args.product_ids || [];
    }

    const matchedProducts = matchedIds
      .map((id: string) => products?.find((p: { id: string }) => p.id === id))
      .filter(Boolean);

    return new Response(JSON.stringify({ products: matchedProducts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
