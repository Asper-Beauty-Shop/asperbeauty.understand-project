import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FirecrawlResponse {
  success: boolean;
  data?: {
    metadata?: {
      ogImage?: string;
      title?: string;
      description?: string;
      keywords?: string;
    };
    markdown?: string;
    links?: string[];
  };
  error?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, productId } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Firecrawl API key not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`🔍 Scraping product details from: ${url}`);

    // Use Firecrawl with markdown and links to extract product data
    const firecrawlResponse = await fetch(
      "https://api.firecrawl.dev/v1/scrape",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${firecrawlApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          formats: ["markdown", "links"],
          onlyMainContent: true,
          waitFor: 2000,
        }),
      },
    );

    const data: FirecrawlResponse = await firecrawlResponse.json();

    if (!data.success) {
      console.error("Firecrawl error:", data.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: data.error || "Scrape failed",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const metadata = data.data?.metadata;
    const markdown = data.data?.markdown || "";
    const links = data.data?.links || [];

    // Extract product image from links (look for product image URLs)
    const productImagePatterns = [
      /cdn\..*\/products?\//i,
      /images?\..*\.(jpg|jpeg|png|webp)/i,
      /media\./i,
      /product.*\.(jpg|jpeg|png|webp)/i,
    ];

    let productImage = metadata?.ogImage;

    // Try to find a better product image from links
    for (const link of links) {
      if (
        productImagePatterns.some((pattern) => pattern.test(link)) &&
        !link.includes("logo") &&
        !link.includes("icon") &&
        !link.includes("avatar")
      ) {
        productImage = link;
        break;
      }
    }

    // Extract price from markdown using regex
    const priceMatch =
      markdown.match(/(?:JOD|JD|USD|\$|€|£)\s*(\d+(?:[.,]\d{1,3})?)/i) ||
      markdown.match(/(\d+(?:[.,]\d{1,3})?)\s*(?:JOD|JD|USD|\$|€|£)/i);
    const price = priceMatch
      ? parseFloat(priceMatch[1].replace(",", "."))
      : null;

    // Extract description - first paragraph that's long enough
    const descMatch = markdown.match(
      /([A-Z][^.!?]*(?:[.!?][^.!?]*){0,3}[.!?])/,
    );
    const description = descMatch
      ? descMatch[1].substring(0, 500)
      : metadata?.description;

    console.log("📦 Extracted data:", {
      productImage,
      price,
      hasDescription: !!description,
    });

    // If productId is provided, update the product in database
    if (productId) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      const updates: Record<string, any> = {};

      if (description && description.length > 20) {
        updates.description = description;
      }
      if (price && price > 0) updates.price = price;
      if (productImage) updates.image_url = productImage;

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from("products")
          .update(updates)
          .eq("id", productId);

        if (updateError) {
          console.error("Database update error:", updateError);
        } else {
          console.log(
            "✅ Product updated in database with:",
            Object.keys(updates),
          );
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          image_url: productImage,
          price,
          description: description?.substring(0, 200),
          title: metadata?.title,
          links_count: links.length,
          markdown_preview: markdown.substring(0, 300),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Scrape error:", error);
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
