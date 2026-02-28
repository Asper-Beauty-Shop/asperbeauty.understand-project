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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { productId, imageUrl } = await req.json();

    if (!productId || !imageUrl) {
      throw new Error("productId and imageUrl are required");
    }

    console.log(`🎨 Removing background for product: ${productId}`);
    console.log(`   Source image: ${imageUrl}`);

    // Use Lovable AI to remove the background
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
              content: [
                {
                  type: "text",
                  text:
                    "Remove the background from this product image. Make the background completely pure white (#FFFFFF). Keep only the product itself with clean, professional edges. The result should look like a professional e-commerce product photo on a pure white background. Do not add any shadows, reflections, or other elements.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      },
    );

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error(`❌ AI API Error: ${imageResponse.status} - ${errorText}`);

      if (imageResponse.status === 429) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Rate limit exceeded. Please try again later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (imageResponse.status === 402) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "AI credits exhausted. Please add credits to continue.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      throw new Error(`AI processing failed: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    const generatedImage = imageData.choices?.[0]?.message?.images?.[0]
      ?.image_url?.url;

    if (!generatedImage) {
      console.log(`⚠️ No processed image returned from AI`);
      throw new Error("AI did not return a processed image");
    }

    console.log(`✅ Background removed successfully`);

    // Extract base64 data from data URI
    const base64Match = generatedImage.match(
      /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/,
    );
    if (!base64Match) {
      throw new Error("Invalid image format returned from AI");
    }

    const imageFormat = base64Match[1];
    const base64Data = base64Match[2];

    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const filename = `bg-removed/${productId}-${timestamp}.${imageFormat}`;

    console.log(`📤 Uploading to storage: ${filename}`);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filename, bytes, {
        contentType: `image/${imageFormat}`,
        upsert: true,
      });

    if (uploadError) {
      console.error(`❌ Upload Error: ${uploadError.message}`);
      throw new Error(
        `Failed to upload processed image: ${uploadError.message}`,
      );
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(filename);

    const newImageUrl = publicUrl.publicUrl;

    // Update product with new image URL
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_url: newImageUrl })
      .eq("id", productId);

    if (updateError) {
      console.error(`❌ Update Error: ${updateError.message}`);
      throw new Error(`Failed to update product: ${updateError.message}`);
    }

    console.log(`✨ Product updated with clean image: ${newImageUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        productId,
        originalUrl: imageUrl,
        newImageUrl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Background removal error:", error);
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
