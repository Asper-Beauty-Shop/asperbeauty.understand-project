import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function requireAdmin(req: Request): Promise<{ userId: string } | Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: roleData } = await adminClient.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
  if (!roleData) {
    return new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return { userId: user.id };
}

interface FirecrawlResponse {
  success: boolean;
  data?: {
    metadata?: { ogImage?: string; title?: string; description?: string; keywords?: string };
    markdown?: string;
    links?: string[];
  };
  error?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authResult = await requireAdmin(req);
  if (authResult instanceof Response) return authResult;

  try {
    const { url, productId } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: "URL is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      return new Response(JSON.stringify({ success: false, error: "Firecrawl API key not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log(`🔍 Scrape by admin ${authResult.userId}: ${url}`);

    const firecrawlResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { "Authorization": `Bearer ${firecrawlApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url, formats: ["markdown", "links"], onlyMainContent: true, waitFor: 2000 }),
    });

    const data: FirecrawlResponse = await firecrawlResponse.json();
    if (!data.success) {
      return new Response(JSON.stringify({ success: false, error: data.error || "Scrape failed" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const metadata = data.data?.metadata;
    const markdown = data.data?.markdown || "";
    const links = data.data?.links || [];

    const productImagePatterns = [/cdn\..*\/products?\//i, /images?\..*\.(jpg|jpeg|png|webp)/i, /media\./i, /product.*\.(jpg|jpeg|png|webp)/i];
    let productImage = metadata?.ogImage;
    for (const link of links) {
      if (productImagePatterns.some((p) => p.test(link)) && !link.includes("logo") && !link.includes("icon") && !link.includes("avatar")) {
        productImage = link;
        break;
      }
    }

    const priceMatch = markdown.match(/(?:JOD|JD|USD|\$|€|£)\s*(\d+(?:[.,]\d{1,3})?)/i) || markdown.match(/(\d+(?:[.,]\d{1,3})?)\s*(?:JOD|JD|USD|\$|€|£)/i);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(",", ".")) : null;
    const descMatch = markdown.match(/([A-Z][^.!?]*(?:[.!?][^.!?]*){0,3}[.!?])/);
    const description = descMatch ? descMatch[1].substring(0, 500) : metadata?.description;

    if (productId) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      const updates: Record<string, unknown> = {};

      if (description && description.length > 20) {
        updates.description = description;
      }
      if (price && price > 0) updates.price = price;
      if (productImage) updates.image_url = productImage;
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase.from("products").update(updates).eq("id", productId);
        if (updateError) console.error("Database update error:", updateError);
        else console.log("✅ Product updated with:", Object.keys(updates));
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: { image_url: productImage, price, description: description?.substring(0, 200), title: metadata?.title, links_count: links.length, markdown_preview: markdown.substring(0, 300) } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
