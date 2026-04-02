import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * meta-catalog-push — Push products directly to Facebook/Instagram Catalog via Batch API
 *
 * Reads products from Supabase and batch-uploads them to a Facebook Commerce Catalog.
 * Supports partial pushes via ?offset=N&limit=N, useful for large catalogs.
 *
 * Requires these Supabase edge function secrets:
 *   META_ACCESS_TOKEN   — Page Access Token (must have catalog_management permission)
 *   META_CATALOG_ID     — Facebook Commerce Catalog ID
 *
 * Trigger via:
 *   POST https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/meta-catalog-push
 *
 * Or via SQL:
 *   SELECT net.http_post(url := '...supabase.co/functions/v1/meta-catalog-push', ...)
 */

const STORE_URL = "https://asperbeautyshop.com";
const DEFAULT_CURRENCY = "USD";
const FB_BATCH_SIZE = 50; // Facebook's max batch size per request
const FB_API_VERSION = "v19.0";

function getFBCategory(category: string | null): string {
  const c = (category ?? "").toLowerCase();
  if (c.includes("sunscreen") || c.includes("spf")) return "8 > 101 > 473"; // Sunscreen
  if (c.includes("serum")) return "8 > 101 > 6031"; // Skin serums
  if (c.includes("cleanser") || c.includes("wash")) return "8 > 101 > 474"; // Facial cleansers
  if (c.includes("moisturizer") || c.includes("cream")) return "8 > 101 > 6030"; // Moisturizers
  if (c.includes("eye")) return "8 > 101 > 2592"; // Eye cream
  if (c.includes("hair") || c.includes("shampoo")) return "8 > 116 > 3017"; // Hair care
  if (c.includes("makeup") || c.includes("foundation")) return "8 > 1624"; // Makeup
  if (c.includes("perfume") || c.includes("fragrance")) return "8 > 7239"; // Fragrances
  if (c.includes("baby")) return "537 > 5593"; // Baby care
  return "8 > 101"; // Personal care (default)
}

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  price: number;
  currency: string | null;
  available: boolean;
  brand: string | null;
  image_url: string | null;
  asper_category: string | null;
  gtin: string | null;
  mpn: string | null;
  condition: string | null;
  compare_at_price: number | null;
  key_benefit: string | null;
}

function toFBProduct(p: Product) {
  const currency = p.currency || DEFAULT_CURRENCY;
  const priceStr = `${Number(p.price).toFixed(2)} ${currency}`;
  const description = (p.description || p.key_benefit || p.title || "").slice(0, 9999);

  const item: Record<string, unknown> = {
    retailer_id: p.handle,
    name: (p.title ?? "").slice(0, 200),
    description,
    availability: p.available ? "in stock" : "out of stock",
    condition: p.condition || "new",
    price: priceStr,
    url: `${STORE_URL}/product/${p.handle}`,
    image_url: p.image_url,
    brand: p.brand || "Asper Beauty",
    category: getFBCategory(p.asper_category),
    currency,
  };

  if (p.compare_at_price && p.compare_at_price > p.price) {
    item.sale_price = `${Number(p.compare_at_price).toFixed(2)} ${currency}`;
  }
  if (p.gtin) item.gtin = p.gtin;
  if (p.mpn) item.mpn = p.mpn;

  return item;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const accessToken = Deno.env.get("META_ACCESS_TOKEN") || Deno.env.get("META_PAGE_ACCESS_TOKEN");
  const catalogId = Deno.env.get("META_CATALOG_ID");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!accessToken || !catalogId) {
    return new Response(JSON.stringify({
      error: "Missing META_ACCESS_TOKEN and/or META_CATALOG_ID",
      hint: "Set these in Supabase edge function secrets: https://supabase.com/dashboard/project/vhgwvfedgfmcixhdyttt/settings/functions",
    }), { status: 503, headers: { "Content-Type": "application/json" } });
  }

  const url = new URL(req.url);
  const offset = parseInt(url.searchParams.get("offset") ?? "0");
  const limit = Math.min(500, parseInt(url.searchParams.get("limit") ?? "500"));

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: products, error, count } = await supabase
    .from("products")
    .select("id,handle,title,description,price,currency,available,brand,image_url,asper_category,gtin,mpn,condition,compare_at_price,key_benefit", { count: "exact" })
    .eq("available", true)
    .not("image_url", "is", null)
    .not("handle", "is", null)
    .order("bestseller_rank", { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }

  const items = (products ?? []) as Product[];
  const fbEndpoint = `https://graph.facebook.com/${FB_API_VERSION}/${catalogId}/batch`;

  let pushed = 0, failed = 0;
  const errors: string[] = [];

  // Process in FB_BATCH_SIZE chunks
  for (let i = 0; i < items.length; i += FB_BATCH_SIZE) {
    const chunk = items.slice(i, i + FB_BATCH_SIZE);
    const requests = chunk.map((p) => ({
      method: "UPDATE",
      retailer_id: p.handle,
      data: toFBProduct(p),
    }));

    const res = await fetch(fbEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: accessToken,
        requests,
        allow_upsert: true,
      }),
    });

    const json = await res.json();

    if (!res.ok || json.error) {
      const msg = json.error?.message ?? `HTTP ${res.status}`;
      errors.push(`Batch ${Math.floor(i / FB_BATCH_SIZE) + 1}: ${msg}`);
      failed += chunk.length;
    } else {
      // Count per-item results
      const handles = (json.handles ?? []) as string[];
      pushed += handles.length;
      // Check for item-level errors
      if (json.errors) {
        for (const e of json.errors) {
          errors.push(`Item ${e.retailer_id}: ${e.message}`);
          pushed--;
          failed++;
        }
      }
    }
  }

  return new Response(JSON.stringify({
    status: "complete",
    total_available: count,
    fetched: items.length,
    pushed,
    failed,
    offset,
    has_more: offset + limit < (count ?? 0),
    next_offset: offset + limit,
    errors: errors.slice(0, 20),
  }), { headers: { "Content-Type": "application/json" } });
});
