/**
 * Prescription Bridge (Edge Function): translates a skin concern into a curated
 * 3-step regimen from the Shopify Storefront API. Uses concern tags (Concern_Acne)
 * and step tags (Step_1_Cleanser, Step_2_Treatment, Step_3_Protection).
 *
 * Env: SHOPIFY_STORE_DOMAIN (e.g. store.myshopify.com), SHOPIFY_STOREFRONT_TOKEN.
 * GET ?concern=acne or POST { "concern": "hydration" }.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const REGIMEN_QUERY = `
  query getRegimen($query: String!) {
    products(first: 20, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          vendor
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

const CONCERN_TO_TAG: Record<string, string> = {
  acne: "Concern_Acne",
  "anti-aging": "Concern_AntiAging",
  dryness: "Concern_Dryness",
  hydration: "Concern_Hydration",
  sensitivity: "Concern_Sensitivity",
  pigmentation: "Concern_Pigmentation",
  brightening: "Concern_Brightening",
  "hair-loss": "Concern_HairLoss",
  hair: "Concern_HairLoss",
};

const STEP_1_TAG = "Step_1_Cleanser";
const STEP_2_TAG = "Step_2_Treatment";
const STEP_3_TAG = "Step_3_Protection";

function getConcernTag(concern: string): string {
  const lower = concern.toLowerCase().trim().replace(/\s+/g, "-");
  if (CONCERN_TO_TAG[lower]) return `tag:${CONCERN_TO_TAG[lower]}`;
  if (concern.startsWith("Concern_")) return `tag:${concern}`;
  return `tag:Concern_${concern.replace(/-/g, "")}`;
}

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
  if (req.method === "GET") {
    concern = new URL(req.url).searchParams.get("concern") ?? "";
  } else {
    try {
      const body = await req.json();
      concern = (body.concern ?? "").trim();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  if (!concern) {
    return new Response(
      JSON.stringify({ error: "concern is required (query or body)" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const store = Deno.env.get("SHOPIFY_STORE_DOMAIN");
  const token = Deno.env.get("SHOPIFY_STOREFRONT_TOKEN");
  if (!store || !token) {
    return new Response(
      JSON.stringify({
        error: "SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN must be set",
      }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const apiVersion = Deno.env.get("SHOPIFY_API_VERSION") ?? "2025-07";
  const url = `https://${
    store.replace(/^https?:\/\//, "").split("/")[0]
  }/api/${apiVersion}/graphql.json`;
  const query = getConcernTag(concern);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: REGIMEN_QUERY,
        variables: { query },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Shopify Storefront error:", res.status, text);
      return new Response(
        JSON.stringify({ error: "Shopify request failed" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await res.json();
    const edges = data?.data?.products?.edges ?? [];
    const allProducts = edges.map((e: { node: { tags?: string[] } }) => e.node);
    const getTags = (p: { tags?: string[] }) => p.tags ?? [];

    const cleanser = allProducts.find((p: { tags?: string[] }) =>
      getTags(p).includes(STEP_1_TAG)
    ) ?? null;
    const treatment = allProducts.find((p: { tags?: string[] }) =>
      getTags(p).includes(STEP_2_TAG)
    ) ?? null;
    const protection = allProducts.find((p: { tags?: string[] }) =>
      getTags(p).includes(STEP_3_TAG)
    ) ?? null;

    return new Response(
      JSON.stringify({
        concern,
        cleanser,
        treatment,
        protection,
        allProducts,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Prescription Bridge error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
