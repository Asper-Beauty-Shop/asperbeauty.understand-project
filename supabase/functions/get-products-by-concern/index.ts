/**
 * Real-time product data for 3-Click / "Shop This Routine".
 * Query products by concern (and optional brand). Returns products aligned with
 * the actual products table schema (primary_concern enum, regimen_step enum).
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Map user-friendly concern text to the products.primary_concern enum values */
const CONCERN_TO_ENUM: Record<string, string[]> = {
  acne: ["Concern_Acne", "Concern_Oiliness"],
  "anti-aging": ["Concern_Aging", "Concern_AntiAging"],
  aging: ["Concern_Aging", "Concern_AntiAging"],
  hydration: ["Concern_Hydration", "Concern_Dryness"],
  dryness: ["Concern_Hydration", "Concern_Dryness"],
  sensitivity: ["Concern_Sensitivity", "Concern_Redness"],
  "dark-spots": ["Concern_Pigmentation", "Concern_Brightening"],
  pigmentation: ["Concern_Pigmentation", "Concern_Brightening"],
  brightening: ["Concern_Brightening", "Concern_Pigmentation"],
  "sun-protection": ["Concern_SunProtection"],
  redness: ["Concern_Redness", "Concern_Sensitivity"],
  "oily-skin": ["Concern_Oiliness", "Concern_Acne"],
  oiliness: ["Concern_Oiliness"],
  "dark-circles": ["Concern_DarkCircles"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let concern = "";
  let brand = "";

  if (req.method === "GET") {
    const url = new URL(req.url);
    concern = (url.searchParams.get("concern") || "").trim().toLowerCase();
    brand = (url.searchParams.get("brand") || "").trim();
  } else {
    try {
      const body = await req.json();
      concern = (body.concern || "").trim().toLowerCase();
      brand = (body.brand || "").trim();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  if (!concern && !brand) {
    return new Response(
      JSON.stringify({ error: "concern or brand is required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  // Select only columns that exist in the products table
  const selectCols =
    "id, title, price, brand, image_url, handle, primary_concern, regimen_step, tags, is_hero, is_bestseller, bestseller_rank, inventory_total, clinical_badge, pharmacist_note, key_ingredients";

  let products: unknown[] = [];
  let queryError: { message: string } | null = null;

  if (concern) {
    // Normalize concern slug
    const slug = concern.replace(/\s+/g, "-");
    const enumValues = CONCERN_TO_ENUM[slug] || CONCERN_TO_ENUM[concern] || [];

    if (enumValues.length > 0) {
      // Primary: match by enum
      const { data, error } = await supabase
        .from("products")
        .select(selectCols)
        .in("primary_concern", enumValues)
        .gt("inventory_total", 0)
        .order("is_hero", { ascending: false })
        .order("is_bestseller", { ascending: false })
        .order("bestseller_rank", { ascending: true })
        .limit(20);
      queryError = error ?? null;
      products = data ?? [];
    }

    // Fallback: text search on title/brand
    if (products.length === 0 && !queryError) {
      const { data, error } = await supabase
        .from("products")
        .select(selectCols)
        .or(`title.ilike.%${concern}%,brand.ilike.%${concern}%`)
        .gt("inventory_total", 0)
        .limit(20);
      queryError = error ?? null;
      products = data ?? [];
    }
  } else if (brand) {
    const { data, error } = await supabase
      .from("products")
      .select(selectCols)
      .ilike("brand", `%${brand}%`)
      .gt("inventory_total", 0)
      .limit(20);
    queryError = error ?? null;
    products = data ?? [];
  }

  if (queryError) {
    console.error("get-products-by-concern error:", queryError);
    return new Response(JSON.stringify({ error: "Query failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const shopRoutinePath = concern
    ? `/products?concern=${concern.replace(/\s+/g, "-")}`
    : "/shop";
  const siteUrl = Deno.env.get("SITE_URL");
  const shopRoutineUrl =
    typeof siteUrl === "string" && siteUrl
      ? `${siteUrl}${shopRoutinePath}`
      : shopRoutinePath;

  return new Response(
    JSON.stringify({
      concern: concern || null,
      brand: brand || null,
      products: products || [],
      shop_routine_path: shopRoutinePath,
      shop_routine_url: shopRoutineUrl,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
