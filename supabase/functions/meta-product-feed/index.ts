import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * meta-product-feed — Facebook & Instagram Shopping product catalog feed
 *
 * Returns all available products in Facebook's required CSV format.
 * Facebook crawls this URL on schedule to keep the catalog up-to-date.
 *
 * URL: https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/meta-product-feed
 * Formats:
 *   ?format=csv  (default) — CSV feed for Facebook Catalog Manager
 *   ?format=json — JSON feed (alternative)
 *   ?page=N&limit=500 — pagination for large catalogs
 */

const STORE_URL = "https://asperbeautyshop.com";
const DEFAULT_CURRENCY = "USD";
const PAGE_SIZE = 500;

// Facebook's required Google Product Category for beauty/personal care
// https://www.facebook.com/business/help/120325381656392
const CATEGORY_MAP: Record<string, string> = {
  "Serum": "Health & Beauty > Personal Care > Cosmetics > Skin Care > Facial Serums",
  "Moisturizer": "Health & Beauty > Personal Care > Cosmetics > Skin Care > Moisturizers & Treatments",
  "Cleanser": "Health & Beauty > Personal Care > Cosmetics > Skin Care > Facial Cleansers",
  "Sunscreen": "Health & Beauty > Personal Care > Sun Care > Sunscreen",
  "Eye Cream": "Health & Beauty > Personal Care > Cosmetics > Skin Care > Eye Creams & Treatments",
  "Toner": "Health & Beauty > Personal Care > Cosmetics > Skin Care",
  "Mask": "Health & Beauty > Personal Care > Cosmetics > Skin Care > Face Masks",
  "Lip": "Health & Beauty > Personal Care > Cosmetics > Lip Care",
  "Hair": "Health & Beauty > Personal Care > Hair Care",
  "Shampoo": "Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner",
  "Perfume": "Health & Beauty > Personal Care > Fragrances",
  "Makeup": "Health & Beauty > Personal Care > Cosmetics > Makeup",
  "Baby": "Baby & Toddler > Diapering > Baby Wipes",
  "Supplement": "Health & Beauty > Health Care > Vitamins & Supplements",
};

function getFBCategory(asperCategory: string | null): string {
  if (!asperCategory) return "Health & Beauty > Personal Care > Cosmetics > Skin Care";
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (asperCategory.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return "Health & Beauty > Personal Care > Cosmetics > Skin Care";
}

function escapeCsv(val: string | null | undefined): string {
  if (!val) return "";
  const s = String(val).replace(/[\r\n]+/g, " ").trim();
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
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
  tags: string[] | null;
  key_benefit: string | null;
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "csv";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(PAGE_SIZE, parseInt(url.searchParams.get("limit") ?? String(PAGE_SIZE)));
  const offset = (page - 1) * limit;

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: products, error, count } = await supabase
    .from("products")
    .select("id,handle,title,description,price,currency,available,brand,image_url,asper_category,gtin,mpn,condition,compare_at_price,tags,key_benefit", { count: "exact" })
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
  const totalPages = Math.ceil((count ?? 0) / limit);

  if (format === "json") {
    const feed = items.map((p) => ({
      id: p.handle,
      retailer_id: p.handle,
      title: (p.title ?? "").slice(0, 200),
      description: (p.description || p.key_benefit || p.title || "").slice(0, 9999),
      availability: p.available ? "in stock" : "out of stock",
      condition: p.condition || "new",
      price: `${Number(p.price).toFixed(2)} ${p.currency || DEFAULT_CURRENCY}`,
      ...(p.compare_at_price ? { sale_price: `${Number(p.compare_at_price).toFixed(2)} ${p.currency || DEFAULT_CURRENCY}` } : {}),
      link: `${STORE_URL}/product/${p.handle}`,
      image_link: p.image_url,
      brand: p.brand || "Asper Beauty",
      google_product_category: getFBCategory(p.asper_category),
      product_type: p.asper_category || "Beauty",
      ...(p.gtin ? { gtin: p.gtin } : {}),
      ...(p.mpn ? { mpn: p.mpn } : {}),
    }));

    return new Response(JSON.stringify({ data: feed, page, total_pages: totalPages, total: count }), {
      headers: {
        "Content-Type": "application/json",
        "X-Total-Count": String(count ?? 0),
        "X-Total-Pages": String(totalPages),
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // CSV format (default) — Facebook catalog feed format
  const headers = [
    "id", "title", "description", "availability", "condition", "price",
    "sale_price", "link", "image_link", "brand", "google_product_category",
    "product_type", "gtin", "mpn",
  ];

  const rows = items.map((p) => [
    escapeCsv(p.handle),
    escapeCsv((p.title ?? "").slice(0, 200)),
    escapeCsv((p.description || p.key_benefit || p.title || "").slice(0, 9999)),
    p.available ? "in stock" : "out of stock",
    p.condition || "new",
    `${Number(p.price).toFixed(2)} ${p.currency || DEFAULT_CURRENCY}`,
    p.compare_at_price ? `${Number(p.compare_at_price).toFixed(2)} ${p.currency || DEFAULT_CURRENCY}` : "",
    `${STORE_URL}/product/${p.handle}`,
    escapeCsv(p.image_url),
    escapeCsv(p.brand || "Asper Beauty"),
    escapeCsv(getFBCategory(p.asper_category)),
    escapeCsv(p.asper_category || "Beauty"),
    escapeCsv(p.gtin),
    escapeCsv(p.mpn),
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="asper-beauty-catalog-p${page}.csv"`,
      "X-Total-Count": String(count ?? 0),
      "X-Total-Pages": String(totalPages),
      "Cache-Control": "public, max-age=3600",
    },
  });
});
