import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * run-sync — One-shot Shopify catalog sync triggered from pg_net or any HTTP client.
 * No JWT required. Uses SUPABASE_SERVICE_ROLE_KEY (auto-injected) + Shopify storefront token.
 *
 * Deploy: supabase functions deploy run-sync --no-verify-jwt
 * Trigger via SQL: SELECT net.http_post(url := '...supabase.co/functions/v1/run-sync', ...)
 */

const SHOPIFY_DOMAIN = Deno.env.get("SHOPIFY_DOMAIN") ?? "asper-beauty-shop-6.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";
// Shopify Storefront tokens are public-safe (read-only, client-side designed)
const SHOPIFY_STOREFRONT_TOKEN_FALLBACK = "2b2698dd0e30c6bcb9ac4286a95c0099e1180033c58ab2472cfa4c30da0a3c62";

const KNOWN_BRANDS = [
  "La Roche-Posay","CeraVe","Bioderma","Vichy","Eucerin","Sesderma","COSRX","SVR",
  "Avène","Uriage","Ducray","Noreva","ACM","Isdin","Cetaphil",
  "Lancôme","Lancome","Kérastase","YSL","L'Oréal","L'Oreal","Garnier","Maybelline","NYX",
  "Clarins","Guerlain","Nuxe","Dior","Olaplex","Estée Lauder","Clinique","Origins",
  "Beesline","Revlon","Rimmel","Bourjois","Max Factor","Essence","Catrice","Medela","Chicco","Mustela",
].sort((a, b) => b.length - a.length);

const PRODUCT_TERM = /^(serum|cream|lotion|gel|foam|wash|cleanser|moistur|mask|oil|spray|toner|sunscreen|spf|balm|mist|vitamin|retinol|hyaluronic|salicylic|niacin|collagen)/i;

function extractBrand(title: string, vendor: string): string {
  const tl = title.toLowerCase();
  for (const b of KNOWN_BRANDS) { if (tl.startsWith(b.toLowerCase())) return b; }
  const first = title.split(/\s+/)[0] ?? "";
  if (first && !PRODUCT_TERM.test(first) && first.length > 2) {
    if (vendor === "Asper Beauty" || !vendor) return first;
  }
  if (vendor && vendor !== "Asper Beauty") return vendor;
  return first || "Unknown";
}

const BUDGET = new Set(["essence","rimmel","catrice","bourjois","cetaphil","medela","chicco","mustela"]);
const MID = new Set(["maybelline","revlon","max factor","garnier","nyx","l'oréal","l'oreal"]);

function normalizePrice(raw: number, brand: string): number {
  const bl = brand.toLowerCase();
  const dec = raw % 1;
  if (dec > 0.01 && dec < 0.99 && raw < 100) return raw;
  if (BUDGET.has(bl) || MID.has(bl)) return raw >= 100 ? raw / 100 : raw;
  return raw;
}

const CONCERN_RULES = [
  { p: /acne|blemish|salicylic/i, c: "Concern_Acne" },
  { p: /spf|sunscreen|solar/i, c: "Concern_SunProtection" },
  { p: /retinol|anti.?aging|wrinkle|firming/i, c: "Concern_AntiAging" },
  { p: /bright|vitamin\s*c|glow|radiance/i, c: "Concern_Brightening" },
  { p: /pigment|dark\s*spot|whitening/i, c: "Concern_Pigmentation" },
  { p: /redness|rosacea|calming/i, c: "Concern_Redness" },
  { p: /oil\s*control|mattif|oily|sebum/i, c: "Concern_Oiliness" },
  { p: /sensitiv|sooth|gentle|irritat/i, c: "Concern_Sensitivity" },
  { p: /dry|dehydrat/i, c: "Concern_Dryness" },
  { p: /hydra|hyaluronic|moistur|aqua/i, c: "Concern_Hydration" },
];
const STEP_RULES = [
  { p: /cleanser|wash|foam|micellar|cleansing/i, s: "Step_1_Cleanser" },
  { p: /spf|sunscreen|solar|moistur|cream|lotion|balm/i, s: "Step_3_Protection" },
  { p: /serum|treatment|ampoule|essence|oil|mask|peel|toner/i, s: "Step_2_Treatment" },
];

function mapProduct(text: string) {
  let concern = "Concern_Hydration";
  for (const r of CONCERN_RULES) { if (r.p.test(text)) { concern = r.c; break; } }
  let step = "Step_2_Treatment";
  for (const r of STEP_RULES) { if (r.p.test(text)) { step = r.s; break; } }
  return { primary_concern: concern, regimen_step: step };
}

const PRODUCTS_QUERY = `query($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    edges { node {
      id handle title vendor productType tags availableForSale
      priceRange { minVariantPrice { amount } }
      images(first: 1) { edges { node { url } } }
    }}
  }
}`;

Deno.serve(async (_req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const storefrontToken = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN") || SHOPIFY_STOREFRONT_TOKEN_FALLBACK;

  if (!serviceKey) {
    return new Response(JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY not available" }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const shopifyUrl = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  let synced = 0, skipped = 0, failed = 0, fetched = 0;
  const errors: string[] = [];
  let cursor: string | null = null;
  const LIMIT = 500;

  while (fetched < LIMIT) {
    const pageSize = Math.min(50, LIMIT - fetched);
    const res = await fetch(shopifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": storefrontToken },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { first: pageSize, after: cursor } }),
    });
    if (!res.ok) { errors.push(`Shopify HTTP ${res.status}: ${await res.text()}`); break; }
    const json = await res.json();
    if (json.errors) { errors.push(json.errors.map((e: {message:string}) => e.message).join("; ")); break; }

    const page = json.data.products;
    const products = page.edges.map((e: {node: unknown}) => e.node) as Array<{
      handle: string; title: string; vendor: string; productType: string;
      tags: string[]; availableForSale: boolean;
      priceRange: { minVariantPrice: { amount: string } };
      images: { edges: Array<{ node: { url: string } }> };
    }>;

    fetched += products.length;

    const rows = [];
    for (const p of products) {
      if (!p.images.edges.length) { skipped++; continue; }
      const brand = extractBrand(p.title, p.vendor);
      const rawPrice = parseFloat(p.priceRange.minVariantPrice.amount);
      const price = normalizePrice(rawPrice, brand);
      const text = `${p.title} ${p.productType} ${p.tags.join(" ")}`;
      const { primary_concern, regimen_step } = mapProduct(text);
      rows.push({
        handle: p.handle, title: p.title, brand: brand || null,
        price, image_url: p.images.edges[0].node.url,
        primary_concern, regimen_step,
        available: p.availableForSale,
        inventory_total: p.availableForSale ? 10 : 0,
        tags: p.tags,
        updated_at: new Date().toISOString(),
      });
    }

    if (rows.length) {
      const { error } = await supabase.from("products").upsert(rows, { onConflict: "handle", ignoreDuplicates: false });
      if (error) { failed += rows.length; errors.push(error.message); }
      else synced += rows.length;
    }

    if (!page.pageInfo.hasNextPage || products.length === 0) break;
    cursor = page.pageInfo.endCursor;
  }

  return new Response(JSON.stringify({ status: "complete", fetched, synced, skipped, failed, errors: errors.slice(0, 10) }), {
    headers: { "Content-Type": "application/json" },
  });
});
