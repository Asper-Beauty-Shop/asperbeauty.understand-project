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
    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    // Verify user is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth
      .getClaims(token);

    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Check if user has admin role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

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

    console.log(`Processing ${products?.length || 0} products...`);

    // Clear existing documents
    await supabaseAdmin.from("documents").delete().neq("id", 0);

    // Process each product and create document entries
    const documents = [];
    for (const product of products || []) {
      // Create rich content for AI understanding
      const skinConcerns = product.skin_concerns?.join(", ") || "";
      const tags = product.tags?.join(", ") || "";

      const content = `
Product: ${product.title}
Brand: ${product.brand || "Unknown"}
Category: ${product.category}
Subcategory: ${product.subcategory || "General"}
Description: ${product.description || "Premium beauty product"}
Skin Concerns: ${skinConcerns || "General skincare"}
Tags: ${tags}
Volume: ${product.volume_ml || "Standard size"}
Price: ${product.price} JOD
${
        product.is_on_sale
          ? `On Sale: ${product.discount_percent}% off (Original: ${product.original_price} JOD)`
          : ""
      }
      `.trim();

      const metadata = {
        product_id: product.id,
        title: product.title,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        original_price: product.original_price,
        is_on_sale: product.is_on_sale,
        discount_percent: product.discount_percent,
        image_url: product.image_url,
        skin_concerns: product.skin_concerns,
        tags: product.tags,
      };

      // Generate a simple embedding placeholder (1536 dimensions of zeros)
      // In production, you would use OpenAI's embedding API
      const embedding = new Array(1536).fill(0);

      // Create weighted embedding based on keywords
      // This is a simplified approach - in production use proper embedding API
      const keywords = [
        ...(product.title?.toLowerCase().split(/\s+/) || []),
        ...(product.brand?.toLowerCase().split(/\s+/) || []),
        ...(product.category?.toLowerCase().split(/\s+/) || []),
        ...(product.skin_concerns?.map((s: string) => s.toLowerCase()) || []),
        ...(product.tags?.map((t: string) => t.toLowerCase()) || []),
      ].filter(Boolean);

      // Simple hash-based embedding for keyword matching
      keywords.forEach((keyword, idx) => {
        const hash = simpleHash(keyword);
        const position = Math.abs(hash) % 1536;
        embedding[position] = (embedding[position] || 0) + 1;
      });

      // Normalize the embedding
      const magnitude = Math.sqrt(embedding.reduce((sum, val) =>
        sum + val * val, 0)) || 1;
      const normalizedEmbedding = embedding.map((val) => val / magnitude);

      documents.push({
        content,
        metadata,
        embedding: `[${normalizedEmbedding.join(",")}]`,
      });
    }

    // Insert documents in batches
    const batchSize = 50;
    let inserted = 0;

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const { error: insertError } = await supabaseAdmin
        .from("documents")
        .insert(batch);

      if (insertError) {
        console.error(`Batch insert error:`, insertError);
        throw new Error(`Failed to insert documents: ${insertError.message}`);
      }

      inserted += batch.length;
      console.log(`Inserted ${inserted}/${documents.length} documents`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully populated ${documents.length} product documents`,
        count: documents.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Generate embeddings error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// Simple hash function for keyword embedding
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}
