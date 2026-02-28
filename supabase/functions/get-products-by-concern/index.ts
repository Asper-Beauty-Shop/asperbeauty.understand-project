/**
 * Real-time product data for 3-Click / "Shop This Routine".
 * Query products by concern (and optional brand). Returns products + optional cross-sell add-ons.
 * Call from frontend to build "Shop This Routine" link or pre-filled collection.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CONCERN_TO_SLUG: Record<string, string> = {
  acne: "acne",
  "anti-aging": "anti-aging",
  hydration: "hydration",
  dryness: "hydration",
  sensitivity: "sensitivity",
  "dark spots": "dark-spots",
  "dark spots / pigmentation": "dark-spots",
  pigmentation: "dark-spots",
  brightening: "dark-spots",
  "sun protection": "sun-protection",
  "sun-protection": "sun-protection",
  redness: "redness",
  cleansing: "cleansing",
  wrinkles: "wrinkles",
  "oily skin": "oily-skin",
  "oily-skin": "oily-skin",
  "dry skin": "dry-skin",
  "dry-skin": "dry-skin",
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

  const concernSlug = CONCERN_TO_SLUG[concern] || concern.replace(/\s+/g, "-");
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

  let products: unknown[] = [];
  let productsError: { message: string } | null = null;

  if (concern) {
    const { data: byConcern, error: e1 } = await supabase
      .from("products")
      .select(
        "id, title, price, brand, category, image_url, skin_concerns, is_on_sale, discount_percent",
      )
      .contains("skin_concerns", [concernSlug])
      .limit(20);
    if (!e1 && byConcern && byConcern.length > 0) {
      products = byConcern;
    } else {
      const { data: byText, error: e2 } = await supabase
        .from("products")
        .select(
          "id, title, price, brand, category, image_url, skin_concerns, is_on_sale, discount_percent",
        )
        .or(`title.ilike.%${concern}%,description.ilike.%${concern}%`)
        .limit(20);
      productsError = e2 ?? null;
      products = byText ?? [];
    }
  } else if (brand) {
    const res = await supabase
      .from("products")
      .select(
        "id, title, price, brand, category, image_url, skin_concerns, is_on_sale, discount_percent",
      )
      .ilike("brand", `%${brand}%`)
      .limit(20);
    productsError = res.error ?? null;
    products = res.data ?? [];
  }

  if (productsError) {
    console.error("get-products-by-concern error:", productsError);
    return new Response(JSON.stringify({ error: "Query failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let addOnIds: string[] = [];
  if (concern) {
    const { data: rules } = await supabase
      .from("cross_sell_rules")
      .select("add_on_product_ids")
      .eq("trigger_concern", concernSlug)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (rules?.add_on_product_ids?.length) {
      addOnIds = (rules.add_on_product_ids as string[]).filter(Boolean);
    }
  }

  let addOns: unknown[] = [];
  if (addOnIds.length > 0) {
    const { data: addOnProducts } = await supabase
      .from("products")
      .select(
        "id, title, price, brand, category, image_url, is_on_sale, discount_percent",
      )
      .in("id", addOnIds);
    addOns = addOnProducts ?? [];
  }

  const shopRoutinePath = concern && concernSlug
    ? `/concerns/${concernSlug}`
    : "/shop";
  const siteUrl = Deno.env.get("SITE_URL");
  const shopRoutineUrl = typeof siteUrl === "string" && siteUrl
    ? `${siteUrl}${shopRoutinePath}`
    : shopRoutinePath;

  return new Response(
    JSON.stringify({
      concern: concern || null,
      brand: brand || null,
      products: products || [],
      add_ons: addOns,
      shop_routine_path: shopRoutinePath,
      shop_routine_url: shopRoutineUrl,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
