import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authentication using getUser() (not getClaims)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if user has admin role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all products
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("*");

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    console.log(`Processing ${products?.length || 0} products by admin ${userId}...`);

    // Clear existing documents
    await supabaseAdmin.from("documents").delete().neq("id", 0);

    // Process each product and create document entries
    const documents = [];
    for (const product of products || []) {
      const tags = product.tags?.join(", ") || "";

      const content = `
Product: ${product.title}
Brand: ${product.brand || "Unknown"}
Primary Concern: ${product.primary_concern || "General"}
Regimen Step: ${product.regimen_step || "General"}
Tags: ${tags}
Price: ${product.price} JOD
      `.trim();

      const metadata = {
        product_id: product.id,
        title: product.title,
        brand: product.brand,
        primary_concern: product.primary_concern,
        regimen_step: product.regimen_step,
        price: product.price,
        image_url: product.image_url,
        tags: product.tags,
      };

      const embedding = new Array(1536).fill(0);
      const keywords = [
        ...(product.title?.toLowerCase().split(/\s+/) || []),
        ...(product.brand?.toLowerCase().split(/\s+/) || []),
        ...(product.primary_concern?.toLowerCase().split(/\s+/) || []),
        ...(product.tags?.map((t: string) => t.toLowerCase()) || []),
      ].filter(Boolean);

      keywords.forEach((keyword) => {
        const hash = simpleHash(keyword);
        const position = Math.abs(hash) % 1536;
        embedding[position] = (embedding[position] || 0) + 1;
      });

      const magnitude = Math.sqrt(embedding.reduce((sum: number, val: number) => sum + val * val, 0)) || 1;
      const normalizedEmbedding = embedding.map((val: number) => val / magnitude);

      documents.push({
        content,
        metadata,
        embedding: `[${normalizedEmbedding.join(",")}]`,
      });
    }

    const batchSize = 50;
    let inserted = 0;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const { error: insertError } = await supabaseAdmin.from("documents").insert(batch);
      if (insertError) throw new Error(`Failed to insert documents: ${insertError.message}`);
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${documents.length} documents`);
    }

    return new Response(
      JSON.stringify({ success: true, message: `Successfully populated ${documents.length} product documents`, count: documents.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Generate embeddings error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}
