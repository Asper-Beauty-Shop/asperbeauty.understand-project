/**
 * Asper Beauty Shop — CSV → Shopify Admin API Catalog Sync
 *
 * Architecture:
 *   CSV → this script → Shopify Admin API (GraphQL)
 *   Shopify → Storefront API → Lovable frontend
 *   Shopify → Product feed → Google Merchant Center
 *
 * Single source of truth: Shopify.
 * Idempotent: lookup by Handle → update or create. No duplicates.
 *
 * Usage:
 *   npx ts-node scripts/sync-shopify-catalog.ts [--dry-run] [--limit N] [path/to/file.csv]
 *
 * Env vars (in .env or exported):
 *   SHOPIFY_ADMIN_ACCESS_TOKEN  — Admin API token (shpat_xxxx)
 *   SHOPIFY_STORE_DOMAIN        — e.g. lovable-project-milns.myshopify.com
 *   CSV_PATH                    — optional default CSV path
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SHOPIFY_STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN || "lovable-project-milns.myshopify.com";
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";
const API_VERSION = "2024-01";
const ADMIN_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

// CLI flags
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const csvArg = args.find((a) => !a.startsWith("--") && a !== args[limitIdx + 1]);
const CSV_PATH =
  csvArg || process.env.CSV_PATH || path.resolve("data/shopify-import-3.csv");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function adminGraphQL(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get("Retry-After") || "2", 10);
    console.warn(`  ⏳ Rate limited. Waiting ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return adminGraphQL(query, variables); // retry
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: any) => e.message).join("; "));
  }
  return json.data;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// CSV parser (minimal, handles quoted fields with commas/newlines)
// ---------------------------------------------------------------------------

function parseCSV(raw: string): Record<string, string>[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inQuotes) {
      if (ch === '"' && raw[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\n" || (ch === "\r" && raw[i + 1] === "\n")) {
        current.push(field);
        field = "";
        if (current.length > 1) rows.push(current);
        current = [];
        if (ch === "\r") i++;
      } else {
        field += ch;
      }
    }
  }
  if (field || current.length) {
    current.push(field);
    if (current.length > 1) rows.push(current);
  }

  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h.trim()] = (row[i] || "").trim()));
    return obj;
  });
}

// ---------------------------------------------------------------------------
// Group multi-row variants into products
// ---------------------------------------------------------------------------

interface ProductGroup {
  handle: string;
  title: string;
  bodyHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: string;
  seoTitle: string;
  seoDescription: string;
  images: { src: string; alt: string; position: number }[];
  variants: {
    optionValues: string[];
    sku: string;
    price: string;
    compareAtPrice: string;
    grams: number;
    inventoryQty: number;
  }[];
  optionNames: string[];
}

function groupProducts(rows: Record<string, string>[]): ProductGroup[] {
  const map = new Map<string, ProductGroup>();

  for (const row of rows) {
    const handle = row["Handle"] || slugify(row["Title"] || "unknown");
    let product = map.get(handle);

    if (!product) {
      const tags = (row["Tags"] || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const type = row["Type"] || "";
      // Add normalized tag for frontend filtering
      if (type && !tags.some((t) => t.toLowerCase() === type.toLowerCase())) {
        tags.push(type);
      }

      const optionNames: string[] = [];
      if (row["Option1 Name"] && row["Option1 Name"] !== "Title")
        optionNames.push(row["Option1 Name"]);
      if (row["Option2 Name"]) optionNames.push(row["Option2 Name"]);

      product = {
        handle,
        title: row["Title"] || "",
        bodyHtml: row["Body (HTML)"] || "",
        vendor: row["Vendor"] || "Asper Beauty",
        productType: type,
        tags,
        status: (row["Status"] || "active").toLowerCase(),
        seoTitle: row["SEO Title"] || "",
        seoDescription: row["SEO Description"] || "",
        images: [],
        variants: [],
        optionNames,
      };
      map.set(handle, product);
    }

    // Image (only add unique)
    const imgSrc = row["Image Src"] || "";
    if (imgSrc && !product.images.some((img) => img.src === imgSrc)) {
      product.images.push({
        src: imgSrc,
        alt: row["Image Alt Text"] || product.title,
        position: parseInt(row["Image Position"] || "1", 10),
      });
    }

    // Variant
    const optionValues: string[] = [];
    if (row["Option1 Value"]) optionValues.push(row["Option1 Value"]);
    if (row["Option2 Value"]) optionValues.push(row["Option2 Value"]);

    product.variants.push({
      optionValues,
      sku: row["Variant SKU"] || "",
      price: row["Variant Price"] || "0",
      compareAtPrice: row["Variant Compare At Price"] || "",
      grams: parseInt(row["Variant Grams"] || "0", 10),
      inventoryQty: parseInt(row["Variant Inventory Qty"] || "0", 10),
    });
  }

  return Array.from(map.values());
}

// ---------------------------------------------------------------------------
// Shopify Admin mutations
// ---------------------------------------------------------------------------

const LOOKUP_BY_HANDLE = `
  query LookupByHandle($query: String!) {
    products(first: 1, query: $query) {
      edges {
        node {
          id
          variants(first: 100) {
            edges { node { id sku } }
          }
        }
      }
    }
  }
`;

const PRODUCT_CREATE = `
  mutation ProductCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
    productCreate(input: $input, media: $media) {
      product {
        id
        variants(first: 100) {
          edges { node { id sku } }
        }
      }
      userErrors { field message }
    }
  }
`;

const PRODUCT_UPDATE = `
  mutation ProductUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        variants(first: 100) {
          edges { node { id sku } }
        }
      }
      userErrors { field message }
    }
  }
`;

const VARIANT_BULK_UPDATE = `
  mutation VariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id }
      userErrors { field message }
    }
  }
`;

// ---------------------------------------------------------------------------
// Sync logic
// ---------------------------------------------------------------------------

async function syncProduct(product: ProductGroup, index: number) {
  const tag = `[${index}] ${product.handle}`;

  if (!product.title) {
    console.warn(`  ⚠️ ${tag}: missing title, skipping`);
    return { status: "skipped", handle: product.handle, reason: "no title" };
  }

  if (DRY_RUN) {
    console.log(
      `  🔍 ${tag}: "${product.title}" | ${product.variants.length} variant(s) | ${product.images.length} image(s) [DRY RUN]`
    );
    return { status: "dry-run", handle: product.handle };
  }

  // 1. Lookup existing product by handle
  const lookupData = await adminGraphQL(LOOKUP_BY_HANDLE, {
    query: `handle:${product.handle}`,
  });
  const existing = lookupData?.products?.edges?.[0]?.node;

  const input: Record<string, any> = {
    title: product.title,
    handle: product.handle,
    descriptionHtml: product.bodyHtml,
    vendor: product.vendor,
    productType: product.productType,
    tags: product.tags,
    status: product.status === "active" ? "ACTIVE" : "DRAFT",
    seo: {
      title: product.seoTitle || product.title,
      description: product.seoDescription || "",
    },
  };

  // Options
  if (product.optionNames.length > 0) {
    input.options = product.optionNames;
  }

  // Variants for create
  if (!existing && product.variants.length > 0) {
    input.variants = product.variants.map((v) => ({
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compareAtPrice || undefined,
      weight: v.grams / 1000,
      weightUnit: "KILOGRAMS",
      options: v.optionValues.length > 0 ? v.optionValues : undefined,
    }));
  }

  const media = product.images
    .sort((a, b) => a.position - b.position)
    .map((img) => ({
      originalSource: img.src,
      alt: img.alt,
      mediaContentType: "IMAGE",
    }));

  let productId: string;
  let variantEdges: any[];

  if (existing) {
    // UPDATE
    input.id = existing.id;
    const updateData = await adminGraphQL(PRODUCT_UPDATE, { input });
    const errors = updateData?.productUpdate?.userErrors;
    if (errors?.length) {
      console.error(`  ❌ ${tag} update errors:`, errors);
      return { status: "error", handle: product.handle, errors };
    }
    productId = existing.id;
    variantEdges =
      updateData?.productUpdate?.product?.variants?.edges || existing.variants.edges;
    console.log(`  ✅ ${tag}: updated`);
  } else {
    // CREATE
    const createData = await adminGraphQL(PRODUCT_CREATE, { input, media });
    const errors = createData?.productCreate?.userErrors;
    if (errors?.length) {
      console.error(`  ❌ ${tag} create errors:`, errors);
      return { status: "error", handle: product.handle, errors };
    }
    productId = createData.productCreate.product.id;
    variantEdges = createData.productCreate.product.variants.edges;
    console.log(`  ✅ ${tag}: created`);
  }

  // 2. Update variant prices/SKUs if needed (for updates, or if create didn't set them)
  if (existing && product.variants.length > 0 && variantEdges?.length > 0) {
    const variantUpdates = variantEdges
      .map((edge: any, i: number) => {
        const csvVariant = product.variants[i];
        if (!csvVariant) return null;
        return {
          id: edge.node.id,
          price: csvVariant.price,
          compareAtPrice: csvVariant.compareAtPrice || undefined,
          sku: csvVariant.sku,
        };
      })
      .filter(Boolean);

    if (variantUpdates.length > 0) {
      const bulkData = await adminGraphQL(VARIANT_BULK_UPDATE, {
        productId,
        variants: variantUpdates,
      });
      const bulkErrors = bulkData?.productVariantsBulkUpdate?.userErrors;
      if (bulkErrors?.length) {
        console.warn(`  ⚠️ ${tag} variant update warnings:`, bulkErrors);
      }
    }
  }

  return { status: existing ? "updated" : "created", handle: product.handle };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║  Asper Beauty Shop — Shopify Catalog Sync              ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log(`  Store:    ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`  CSV:      ${CSV_PATH}`);
  console.log(`  Dry run:  ${DRY_RUN}`);
  console.log(`  Limit:    ${LIMIT === Infinity ? "all" : LIMIT}`);
  console.log("");

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN && !DRY_RUN) {
    console.error("❌ SHOPIFY_ADMIN_ACCESS_TOKEN is required. Set it in .env or export it.");
    process.exit(1);
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV file not found: ${CSV_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSV(raw);
  console.log(`  Parsed ${rows.length} CSV rows`);

  const products = groupProducts(rows);
  const toSync = products.slice(0, LIMIT);
  console.log(`  Grouped into ${products.length} products; syncing ${toSync.length}\n`);

  const results = { created: 0, updated: 0, skipped: 0, errors: 0, dryRun: 0 };
  const errorLog: any[] = [];

  for (let i = 0; i < toSync.length; i++) {
    try {
      const result = await syncProduct(toSync[i], i + 1);
      if (result.status === "created") results.created++;
      else if (result.status === "updated") results.updated++;
      else if (result.status === "skipped") results.skipped++;
      else if (result.status === "error") {
        results.errors++;
        errorLog.push(result);
      } else if (result.status === "dry-run") results.dryRun++;
    } catch (err: any) {
      results.errors++;
      errorLog.push({ handle: toSync[i].handle, error: err.message });
      console.error(`  ❌ [${i + 1}] ${toSync[i].handle}: ${err.message}`);
    }

    // Throttle: 500ms between products
    if (!DRY_RUN && i < toSync.length - 1) {
      await sleep(500);
    }
  }

  console.log("\n══════════════════════════════════════════════════════════");
  console.log("  Summary:");
  console.log(`    Created:  ${results.created}`);
  console.log(`    Updated:  ${results.updated}`);
  console.log(`    Skipped:  ${results.skipped}`);
  console.log(`    Errors:   ${results.errors}`);
  if (DRY_RUN) console.log(`    Dry run:  ${results.dryRun}`);
  console.log("══════════════════════════════════════════════════════════\n");

  if (errorLog.length > 0) {
    const errPath = path.resolve("data/sync-errors.json");
    fs.writeFileSync(errPath, JSON.stringify(errorLog, null, 2));
    console.log(`  Error details saved to ${errPath}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
