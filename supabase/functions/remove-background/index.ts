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

    const { productId, imageUrl } = await req.json();
    if (!productId || !imageUrl) {
      throw new Error("productId and imageUrl are required");
    }

    console.log(`🎨 Background removal by admin ${authResult.userId} for product: ${productId}`);

    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Remove the background from this product image. Make the background completely pure white (#FFFFFF). Keep only the product itself with clean, professional edges. The result should look like a professional e-commerce product photo on a pure white background. Do not add any shadows, reflections, or other elements." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        }],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (imageResponse.status === 402) {
        return new Response(JSON.stringify({ success: false, error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI processing failed: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!generatedImage) throw new Error("AI did not return a processed image");

    const base64Match = generatedImage.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
    if (!base64Match) throw new Error("Invalid image format returned from AI");

    const imageFormat = base64Match[1];
    const binaryString = atob(base64Match[2]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

    const filename = `bg-removed/${productId}-${Date.now()}.${imageFormat}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(filename, bytes, { contentType: `image/${imageFormat}`, upsert: true });
    if (uploadError) throw new Error(`Failed to upload: ${uploadError.message}`);

    const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(filename);
    const { error: updateError } = await supabase.from("products").update({ image_url: publicUrl.publicUrl }).eq("id", productId);
    if (updateError) throw new Error(`Failed to update product: ${updateError.message}`);

    return new Response(
      JSON.stringify({ success: true, productId, originalUrl: imageUrl, newImageUrl: publicUrl.publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Background removal error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
