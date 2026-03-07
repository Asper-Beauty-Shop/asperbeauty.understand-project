import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Clinical mapping heuristics ──────────────────────────────────────

type SkinConcern =
  | "Concern_Acne"
  | "Concern_Hydration"
  | "Concern_Aging"
  | "Concern_Sensitivity"
  | "Concern_Pigmentation"
  | "Concern_Redness"
  | "Concern_Oiliness"
  | "Concern_Brightening"
  | "Concern_SunProtection"
  | "Concern_DarkCircles"
  | "Concern_AntiAging"
  | "Concern_Dryness";

type RegimenStep =
  | "Step_1_Cleanser"
  | "Step_2_Treatment"
  | "Step_3_Protection"
  | "Step_1"
  | "Step_2"
  | "Step_3";

interface MappingResult {
  primary_concern: SkinConcern;
  regimen_step: RegimenStep;
}

const CONCERN_RULES: Array<{ pattern: RegExp; concern: SkinConcern }> = [
  { pattern: /acne|blemish|salicylic|anti.?blemish|pimple/i, concern: "Concern_Acne" },
  { pattern: /spf|sunscreen|sun\s*protect|uv\s*protect|solar/i, concern: "Concern_SunProtection" },
  { pattern: /retinol|anti.?aging|anti.?age|wrinkle|firming|lift/i, concern: "Concern_AntiAging" },
  { pattern: /bright|vitamin\s*c|glow|radiance|luminous/i, concern: "Concern_Brightening" },
  { pattern: /pigment|dark\s*spot|melasma|even\s*tone/i, concern: "Concern_Pigmentation" },
  { pattern: /dark\s*circle|eye\s*contour|under.?eye/i, concern: "Concern_DarkCircles" },
  { pattern: /redness|rosacea|calming|anti.?redness/i, concern: "Concern_Redness" },
  { pattern: /oil\s*control|mattif|oily|sebum|shine.?free/i, concern: "Concern_Oiliness" },
  { pattern: /sensitiv|sooth|gentle|irritat|atopic/i, concern: "Concern_Sensitivity" },
  { pattern: /dry|dehydrat/i, concern: "Concern_Dryness" },
  { pattern: /hydra|hyaluronic|moistur|aqua|h\.a\./i, concern: "Concern_Hydration" },
];

const STEP_RULES: Array<{ pattern: RegExp; step: RegimenStep }> = [
  { pattern: /cleanser|wash|foam|micellar|makeup\s*remov|cleansing/i, step: "Step_1_Cleanser" },
  { pattern: /spf|sunscreen|sun\s*protect|solar/i, step: "Step_3_Protection" },
  { pattern: /moistur|cream|lotion|balm|emulsion/i, step: "Step_3_Protection" },
  { pattern: /serum|treatment|ampoule|booster|concentrate|essence|oil|mask|peel|exfoli|toner|tonic/i, step: "Step_2_Treatment" },
];

function mapProduct(text: string): MappingResult {
  let concern: SkinConcern = "Concern_Hydration";
  for (const rule of CONCERN_RULES) {
    if (rule.pattern.test(text)) { concern = rule.concern; break; }
  }

  let step: RegimenStep = "Step_2_Treatment";
  for (const rule of STEP_RULES) {
    if (rule.pattern.test(text)) { step = rule.step; break; }
  }

  return { primary_concern: concern, regimen_step: step };
}

// ── Shopify Storefront API fetch ─────────────────────────────────────

const SHOPIFY_DOMAIN = "lovable-project-milns.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

const PRODUCTS_QUERY = `
query($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    edges {
      node {
        id handle title vendor productType tags
        availableForSale
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 1) { edges { node { url } } }
      }
    }
  }
}`;

interface ShopifyNode {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string } }> };
}

async function fetchShopifyPage(
  token: string,
  first: number,
  after?: string,
): Promise<{
  products: ShopifyNode[];
  hasNext: boolean;
  endCursor: string | null;
}> {
  const url = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: { first, after: after ?? null },
    }),
  });

  if (!res.ok) throw new Error(`Shopify ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e: any) => e.message).join("; "));

  const data = json.data.products;
  return {
    products: data.edges.map((e: any) => e.node),
    hasNext: data.pageInfo.hasNextPage,
    endCursor: data.pageInfo.endCursor,
  };
}

// ── Main handler ─────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth: require service_role or admin bearer
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const storefrontToken = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN")!;

    const authHeader = req.headers.get("authorization") ?? "";
    const bearerToken = authHeader.replace("Bearer ", "").trim();

    // Use service_role for DB operations
    const supabase = createClient(supabaseUrl, serviceKey);

    // Validate caller: must be admin user or internal service call
    if (bearerToken && bearerToken !== serviceKey) {
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${bearerToken}` } },
      });
      const { data: { user }, error: authErr } = await userClient.auth.getUser();
      if (authErr || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin"]);
      if (!roles?.length) {
        return new Response(JSON.stringify({ error: "Admin role required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Parse params
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "200"), 1000);
    const dryRun = url.searchParams.get("dry_run") === "true";
    const batchSize = 50;

    let synced = 0, skipped = 0, failed = 0;
    const errors: string[] = [];
    let cursor: string | undefined = url.searchParams.get("after") ?? undefined;
    let fetched = 0;

    while (fetched < limit) {
      const pageSize = Math.min(batchSize, limit - fetched);
      const page = await fetchShopifyPage(storefrontToken, pageSize, cursor);
      fetched += page.products.length;

      for (const p of page.products) {
        try {
          // Skip products without images
          if (!p.images.edges.length) { skipped++; continue; }

          const rawPrice = parseFloat(p.priceRange.minVariantPrice.amount);
          const price = rawPrice / 10; // normalize 10x factor

          const combinedText = `${p.title} ${p.productType} ${p.tags.join(" ")}`;
          const { primary_concern, regimen_step } = mapProduct(combinedText);

          const row = {
            handle: p.handle,
            title: p.title,
            brand: p.vendor || null,
            price,
            image_url: p.images.edges[0].node.url,
            primary_concern,
            regimen_step,
            inventory_total: p.availableForSale ? 10 : 0,
            tags: p.tags,
          };

          if (dryRun) {
            synced++;
            continue;
          }

          // Upsert by handle — preserve manually curated fields
          const { error: upsertErr } = await supabase
            .from("products")
            .upsert(row, { onConflict: "handle", ignoreDuplicates: false })
            .select("id");

          if (upsertErr) {
            failed++;
            errors.push(`${p.handle}: ${upsertErr.message}`);
          } else {
            synced++;
          }
        } catch (e) {
          failed++;
          errors.push(`${p.handle}: ${(e as Error).message}`);
        }
      }

      if (!page.hasNext || page.products.length === 0) break;
      cursor = page.endCursor ?? undefined;
    }

    const result = {
      status: "complete",
      dry_run: dryRun,
      fetched,
      synced,
      skipped,
      failed,
      next_cursor: cursor ?? null,
      errors: errors.slice(0, 20),
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
