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

interface ProductToEnrich {
  id: string;
  title: string;
  brand: string | null;
  category: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authResult = await requireAdmin(req);
  if (authResult instanceof Response) return authResult;

  try {
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    console.log(`🎨 AI Image Generation started by admin ${authResult.userId}`);

    let body: { productId?: string; limit?: number } = {};
    try { body = await req.json(); } catch { /* defaults */ }

    let query = supabase.from("products").select("id, title, brand, category").is("image_url", null);
    if (body.productId) {
      query = query.eq("id", body.productId);
    } else {
      query = query.limit(body.limit || 5);
    }

    const { data: products, error } = await query;
    if (error) throw new Error(`Database Error: ${error.message}`);

    console.log(`🎯 Found ${products?.length || 0} products needing images.`);

    const results: { id: string; title: string; status: string; image_url?: string }[] = [];

    for (const product of (products as ProductToEnrich[]) || []) {
      console.log(`\n🖼️ Generating image for: ${product.title}...`);
      try {
        const brandText = product.brand ? `${product.brand} brand` : "";
        const categoryPrompts: Record<string, string> = {
          "Skin Care": "professional skincare product photography, luxury cosmetic bottle or tube, minimalist white background, soft studio lighting, premium beauty product, high-end dermatological",
          "Makeup": "professional makeup product photography, elegant cosmetic packaging, beauty product, studio lighting, white background, luxury makeup brand",
          "Fragrances": "luxury perfume bottle photography, elegant fragrance packaging, premium glass bottle, studio lighting, sophisticated beauty product",
          "Hair Care": "professional hair care product photography, premium shampoo or treatment bottle, salon-quality packaging, white background, studio lighting",
          "Body Care": "luxury body care product photography, premium lotion or cream container, elegant packaging, white background, soft lighting",
          "Tools & Devices": "professional beauty tool photography, premium skincare device, sleek modern design, white background, studio lighting",
        };
        const categoryStyle = categoryPrompts[product.category] || categoryPrompts["Skin Care"];
        const prompt = `${categoryStyle}. Product: ${product.title}${brandText ? `, ${brandText}` : ""}. Ultra high resolution, professional e-commerce product shot, clean background, no text or labels, photorealistic.`;

        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "google/gemini-2.5-flash-image-preview", messages: [{ role: "user", content: prompt }], modalities: ["image", "text"] }),
        });

        if (!imageResponse.ok) {
          results.push({ id: product.id, title: product.title, status: "ai_error" });
          continue;
        }

        const imageData = await imageResponse.json();
        const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (!generatedImage) { results.push({ id: product.id, title: product.title, status: "no_image_generated" }); continue; }

        const base64Match = generatedImage.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
        if (!base64Match) { results.push({ id: product.id, title: product.title, status: "invalid_format" }); continue; }

        const imageFormat = base64Match[1];
        const binaryString = atob(base64Match[2]);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

        const filename = `ai-generated/${product.id}.${imageFormat}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(filename, bytes, { contentType: `image/${imageFormat}`, upsert: true });
        if (uploadError) { results.push({ id: product.id, title: product.title, status: "upload_error" }); continue; }

        const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(filename);
        const { error: updateError } = await supabase.from("products").update({ image_url: publicUrl.publicUrl }).eq("id", product.id);
        if (updateError) { results.push({ id: product.id, title: product.title, status: "update_error" }); continue; }

        results.push({ id: product.id, title: product.title, status: "success", image_url: publicUrl.publicUrl });
      } catch (err) {
        console.error(`   ❌ Error:`, err);
        results.push({ id: product.id, title: product.title, status: "error" });
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    const successCount = results.filter((r) => r.status === "success").length;
    return new Response(
      JSON.stringify({ success: true, total: products?.length || 0, generated: successCount, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Generation error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
