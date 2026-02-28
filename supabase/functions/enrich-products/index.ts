import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      throw new Error("Firecrawl API key not configured");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    console.log("🕵️‍♀️ Starting Product Enrichment with Firecrawl Search...");

    // Find products without images
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, brand")
      .is("image_url", null)
      .limit(10);

    if (error) throw new Error(`Database Error: ${error.message}`);

    console.log(`🎯 Found ${products?.length || 0} products to enrich.`);

    const results: {
      id: string;
      title: string;
      status: string;
      image_url?: string;
    }[] = [];

    for (const product of products || []) {
      console.log(`\nSearching for: ${product.title}...`);

      try {
        // Search for the product to find images
        const searchQuery = `${
          product.brand || ""
        } ${product.title} product image`;

        const searchResponse = await fetch(
          "https://api.firecrawl.dev/v1/search",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${firecrawlApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: searchQuery,
              limit: 3,
            }),
          },
        );

        const searchData = await searchResponse.json();

        if (!searchData.success || !searchData.data?.length) {
          console.log(`   ⚠️ No search results found`);
          results.push({
            id: product.id,
            title: product.title,
            status: "no_results",
          });
          continue;
        }

        // Look for OG images in search results
        let foundImage: string | null = null;

        for (const result of searchData.data) {
          if (
            result.metadata?.ogImage &&
            !result.metadata.ogImage.includes("logo") &&
            !result.metadata.ogImage.includes("icon")
          ) {
            foundImage = result.metadata.ogImage;
            break;
          }
        }

        if (foundImage) {
          const { error: updateError } = await supabase
            .from("products")
            .update({ image_url: foundImage })
            .eq("id", product.id);

          if (!updateError) {
            console.log(`   ✅ Image found: ${foundImage.substring(0, 60)}...`);
            results.push({
              id: product.id,
              title: product.title,
              status: "success",
              image_url: foundImage,
            });
          } else {
            results.push({
              id: product.id,
              title: product.title,
              status: "update_failed",
            });
          }
        } else {
          console.log(`   ⚠️ No suitable image in results`);
          results.push({
            id: product.id,
            title: product.title,
            status: "no_image_found",
          });
        }
      } catch (err) {
        console.error(`   ❌ Error:`, err);
        results.push({ id: product.id, title: product.title, status: "error" });
      }

      // Rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }

    const successCount = results.filter((r) => r.status === "success").length;
    console.log(
      `\n✨ Enrichment complete. ${successCount}/${
        products?.length || 0
      } products enriched.`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        total: products?.length || 0,
        enriched: successCount,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Enrichment error:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
