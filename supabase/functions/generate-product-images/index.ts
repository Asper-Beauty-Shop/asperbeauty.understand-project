import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

  try {
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("🎨 Starting AI Product Image Generation...");

    // Get request body for optional filters
    let body: { productId?: string; limit?: number } = {};
    try {
      body = await req.json();
    } catch {
      // No body provided, use defaults
    }

    // Find products without images
    let query = supabase
      .from("products")
      .select("id, title, brand, category")
      .is("image_url", null);

    if (body.productId) {
      query = query.eq("id", body.productId);
    } else {
      query = query.limit(body.limit || 5);
    }

    const { data: products, error } = await query;

    if (error) throw new Error(`Database Error: ${error.message}`);

    console.log(`🎯 Found ${products?.length || 0} products needing images.`);

    const results: {
      id: string;
      title: string;
      status: string;
      image_url?: string;
    }[] = [];

    for (const product of (products as ProductToEnrich[]) || []) {
      console.log(`\n🖼️ Generating image for: ${product.title}...`);

      try {
        // Create a prompt based on product category and brand
        const brandText = product.brand ? `${product.brand} brand` : "";
        const categoryPrompts: Record<string, string> = {
          "Skin Care":
            "professional skincare product photography, luxury cosmetic bottle or tube, minimalist white background, soft studio lighting, premium beauty product, high-end dermatological",
          "Makeup":
            "professional makeup product photography, elegant cosmetic packaging, beauty product, studio lighting, white background, luxury makeup brand",
          "Fragrances":
            "luxury perfume bottle photography, elegant fragrance packaging, premium glass bottle, studio lighting, sophisticated beauty product",
          "Hair Care":
            "professional hair care product photography, premium shampoo or treatment bottle, salon-quality packaging, white background, studio lighting",
          "Body Care":
            "luxury body care product photography, premium lotion or cream container, elegant packaging, white background, soft lighting",
          "Tools & Devices":
            "professional beauty tool photography, premium skincare device, sleek modern design, white background, studio lighting",
        };

        const categoryStyle = categoryPrompts[product.category] ||
          categoryPrompts["Skin Care"];

        const prompt = `${categoryStyle}. Product: ${product.title}${
          brandText ? `, ${brandText}` : ""
        }. Ultra high resolution, professional e-commerce product shot, clean background, no text or labels, photorealistic.`;

        console.log(`   Prompt: ${prompt.substring(0, 100)}...`);

        // Generate image using Lovable AI
        const imageResponse = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${lovableApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image-preview",
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
              modalities: ["image", "text"],
            }),
          },
        );

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error(`   ❌ AI API Error: ${errorText}`);
          results.push({
            id: product.id,
            title: product.title,
            status: "ai_error",
          });
          continue;
        }

        const imageData = await imageResponse.json();
        const generatedImage = imageData.choices?.[0]?.message?.images?.[0]
          ?.image_url?.url;

        if (!generatedImage) {
          console.log(`   ⚠️ No image generated`);
          results.push({
            id: product.id,
            title: product.title,
            status: "no_image_generated",
          });
          continue;
        }

        console.log(`   ✅ Image generated, uploading to storage...`);

        // Extract base64 data from data URI
        const base64Match = generatedImage.match(
          /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/,
        );
        if (!base64Match) {
          console.log(`   ⚠️ Invalid image format`);
          results.push({
            id: product.id,
            title: product.title,
            status: "invalid_format",
          });
          continue;
        }

        const imageFormat = base64Match[1];
        const base64Data = base64Match[2];

        // Convert base64 to Uint8Array
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Generate unique filename
        const filename = `ai-generated/${product.id}.${imageFormat}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filename, bytes, {
            contentType: `image/${imageFormat}`,
            upsert: true,
          });

        if (uploadError) {
          console.error(`   ❌ Upload Error: ${uploadError.message}`);
          results.push({
            id: product.id,
            title: product.title,
            status: "upload_error",
          });
          continue;
        }

        // Get public URL
        const { data: publicUrl } = supabase.storage
          .from("product-images")
          .getPublicUrl(filename);

        const imageUrl = publicUrl.publicUrl;

        // Update product with new image URL
        const { error: updateError } = await supabase
          .from("products")
          .update({ image_url: imageUrl })
          .eq("id", product.id);

        if (updateError) {
          console.error(`   ❌ Update Error: ${updateError.message}`);
          results.push({
            id: product.id,
            title: product.title,
            status: "update_error",
          });
          continue;
        }

        console.log(`   ✅ Success! Image saved: ${imageUrl}`);
        results.push({
          id: product.id,
          title: product.title,
          status: "success",
          image_url: imageUrl,
        });
      } catch (err) {
        console.error(`   ❌ Error:`, err);
        results.push({ id: product.id, title: product.title, status: "error" });
      }

      // Rate limiting - wait between generations
      await new Promise((r) => setTimeout(r, 1000));
    }

    const successCount = results.filter((r) => r.status === "success").length;
    console.log(
      `\n✨ Complete! ${successCount}/${
        products?.length || 0
      } images generated.`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        total: products?.length || 0,
        generated: successCount,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Generation error:", error);
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
