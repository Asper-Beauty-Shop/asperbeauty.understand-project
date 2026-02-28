/**
 * Most Prescribed SKU: fetch best sellers from Shopify filtered by chatbot-referral (or similar) tag.
 * Requires SHOPIFY_STORE and SHOPIFY_ACCESS_TOKEN (Admin API). Schedule weekly (e.g. GitHub Actions cron).
 * Optionally persist to analytics_prescribed_sku_weekly or return JSON for dashboard.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-shopify-secret",
};

const REFERRAL_TAG = "chatbot-referral"; // or "prescription-referral" — tag your bot attaches to influenced orders

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

  const store = Deno.env.get("SHOPIFY_STORE");
  const token = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!store || !token) {
    return new Response(
      JSON.stringify({
        error: "SHOPIFY_STORE and SHOPIFY_ACCESS_TOKEN must be set",
        hint:
          "Use Shopify Admin API to fetch orders with tag, then aggregate by product/variant.",
      }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Stub: in production, call Shopify Admin REST or GraphQL:
  // - Orders: GET /admin/api/2024-01/orders.json?limit=250&status=any (filter by tags or order_note_attributes)
  // - Or use GraphQL orders query with tag filter; aggregate line items by product/variant ID.
  // - Tag orders at checkout when referral is from chatbot (e.g. order note or order tag).
  const placeholder = {
    message:
      "Wire Shopify Admin API: list orders with tag, aggregate line items by SKU.",
    shopify_store: store.replace(/\.myshopify\.com$/, ""),
    referral_tag: REFERRAL_TAG,
    docs: "https://shopify.dev/docs/api/admin-rest/2024-01/resources/order",
  };

  return new Response(JSON.stringify(placeholder), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
