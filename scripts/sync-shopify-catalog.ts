/**
 * Asper Beauty Shop — CSV → Shopify Admin API Catalog Sync
 *
 * Architecture:
 *   CSV → this script → Shopify Admin API (GraphQL)
 *   Shopify → Storefront API → Lovable frontend
 *   Shopify → Product feed → Google Merchant Center (ID: 5717495012)
 *
 * Single source of truth: Shopify.
 * Idempotent: lookup by Handle (fallback SKU) → update or create. No duplicates.
 *
 * Usage:
 *   npx tsx scripts/sync-shopify-catalog.ts [--dry-run] [--limit N] [--publish] [path/to/file.csv]
 *
 * Env vars (in .env or exported):
 *   SHOPIFY_ADMIN_ACCESS_TOKEN  — Admin API token (shpat_xxxx)
 *   SHOPIFY_STORE_DOMAIN        — e.g. lovable-project-milns.myshopify.com
 *   CSV_PATH                    — optional default CSV path
 */

import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load .env from project root
config({ path: path.resolve(import.meta.dirname ?? ".", "../.env") });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SHOPIFY_STORE_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN || "lovable-project-milns.myshopify.com";
const SHOPIFY_ADMIN_ACCESS_TOKEN =
  process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";
const API_VERSION = "2025-01";
const ADMIN_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const MAX_RETRIES = 5;
const THROTTLE_MS = 500;

// CLI flags
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const PUBLISH = args.includes("--publish");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const csvArg = args.find(
  (a) =>
    !a.startsWith("--") &&
    (limitIdx === -1 || a !== args[limitIdx + 1])
);
const CSV_PATH =
  csvArg || process.env.CSV_PATH || path.resolve("data/shopify-import-2.csv");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function adminGraphQL(
  query: string,
  variables: Record<string, unknown> = {},
  retries = 0
): Promise<any> {
  const res = await fetch(ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 429) {
    if (retries >= MAX_RETRIES) {
      throw new Error("Rate limit: max retries exceeded");
    }
    const retryAfter = parseInt(res.headers.get("Retry-After") || "2", 10);
    const backoff = Math.max(retryAfter, Math.pow(2, retries)) * 1000;
    console.warn(`  Rate limited. Waiting ${backoff / 1000}s (retry ${retries + 1}/${MAX_RETRIES})...`);
    await sleep(backoff);
    return adminGraphQL(query, variables, retries + 1);
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
// CSV parser (handles quoted fields with commas/newlines)
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

      // Add normalized tag for frontend category filtering
      // e.g. "Skin Care" → tag "skincare" so /products?category=skincare works
      if (type) {
        const normalizedTag = type.toLowerCase().replace(/\s+/g, "");
        if (!tags.some((t) => t.toLowerCase().replace(/\s+/g, "") === normalizedTag)) {
          tags.push(type);
        }
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
// Shopify Admin GraphQL mutations
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

const LOOKUP_BY_SKU = `
  query LookupBySKU($query: String!) {
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

const PUBLISHABLE_PUBLISH = `
  mutation PublishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable { availablePublicationCount }
      userErrors { field message }
    }
  }
`;

const GET_PUBLICATIONS = `
  query GetPublications {
    publications(first: 10) {
      edges { node { id name } }
    }
  }
`;

// ---------------------------------------------------------------------------
// Resolve existing product (by handle, fallback to SKU)
// ---------------------------------------------------------------------------

async function resolveExisting(
  handle: string,
  sku: string | undefined
): Promise<{ id: string; variants: any[] } | null> {
  // Primary: lookup by handle
  const byHandle = await adminGraphQL(LOOKUP_BY_HANDLE, {
    query: `handle:${handle}`,
  });
  const handleNode = byHandle?.products?.edges?.[0]?.node;
  if (handleNode) return { id: handleNode.id, variants: handleNode.variants.edges };

  // Fallback: lookup by SKU
  if (sku) {
    const bySku = await adminGraphQL(LOOKUP_BY_SKU, {
      query: `sku:${sku}`,
    });
    const skuNode = bySku?.products?.edges?.[0]?.node;
    if (skuNode) return { id: skuNode.id, variants: skuNode.variants.edges };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Sync a single product
// ---------------------------------------------------------------------------

let publicationId: string | null = null;

async function getPublicationId(): Promise<string | null> {
  if (publicationId) return publicationId;
  try {
    const data = await adminGraphQL(GET_PUBLICATIONS);
    const onlineStore = data?.publications?.edges?.find(
      (e: any) =>
        e.node.name === "Online Store" || e.node.name === "online_store"
    );
    publicationId = onlineStore?.node?.id || data?.publications?.edges?.[0]?.node?.id || null;
    return publicationId;
  } catch {
    return null;
  }
}

async function syncProduct(
  product: ProductGroup,
  index: number,
  total: number
): Promise<{ status: string; handle: string; reason?: string; errors?: any }> {
  const tag = `[${index}/${total}] ${product.handle}`;

  if (!product.title) {
    console.warn(`  SKIP ${tag}: missing title`);
    return { status: "skipped", handle: product.handle, reason: "no title" };
  }

  if (DRY_RUN) {
    console.log(
      `  DRY  ${tag}: "${product.title}" | ${product.variants.length} variant(s) | ${product.images.length} image(s)`
    );
    return { status: "dry-run", handle: product.handle };
  }

  // 1. Resolve existing product by handle (or SKU fallback)
  const firstSku = product.variants[0]?.sku;
  const existing = await resolveExisting(product.handle, firstSku);

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

  // Include variants in create input
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

  // Media for create
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
    // ── UPDATE ──
    input.id = existing.id;
    const updateData = await adminGraphQL(PRODUCT_UPDATE, { input });
    const errors = updateData?.productUpdate?.userErrors;
    if (errors?.length) {
      console.error(`  FAIL ${tag} update:`, errors);
      return { status: "error", handle: product.handle, errors };
    }
    productId = existing.id;
    variantEdges =
      updateData?.productUpdate?.product?.variants?.edges || existing.variants;
    console.log(`  UPD  ${tag}: updated`);
  } else {
    // ── CREATE ──
    const createData = await adminGraphQL(PRODUCT_CREATE, { input, media });
    const errors = createData?.productCreate?.userErrors;
    if (errors?.length) {
      console.error(`  FAIL ${tag} create:`, errors);
      return { status: "error", handle: product.handle, errors };
    }
    productId = createData.productCreate.product.id;
    variantEdges = createData.productCreate.product.variants.edges;
    console.log(`  NEW  ${tag}: created`);
  }

  // 2. Bulk-update variant prices/SKUs (for BOTH create and update)
  //    productCreate does not always set variant price correctly;
  //    always reconcile via productVariantsBulkUpdate.
  if (product.variants.length > 0 && variantEdges?.length > 0) {
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
      try {
        const bulkData = await adminGraphQL(VARIANT_BULK_UPDATE, {
          productId,
          variants: variantUpdates,
        });
        const bulkErrors = bulkData?.productVariantsBulkUpdate?.userErrors;
        if (bulkErrors?.length) {
          console.warn(`  WARN ${tag} variant update:`, bulkErrors);
        }
      } catch (err: any) {
        console.warn(`  WARN ${tag} variant update failed: ${err.message}`);
      }
    }
  }

  // 3. Publish to Online Store (optional, via --publish flag)
  if (PUBLISH) {
    const pubId = await getPublicationId();
    if (pubId) {
      try {
        await adminGraphQL(PUBLISHABLE_PUBLISH, {
          id: productId,
          input: [{ publicationId: pubId }],
        });
      } catch (err: any) {
        console.warn(`  WARN ${tag} publish failed: ${err.message}`);
      }
    }
  }

  return { status: existing ? "updated" : "created", handle: product.handle };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now();

  console.log("");
  console.log("  Asper Beauty Shop — Shopify Catalog Sync");
  console.log("  =========================================");
  console.log(`  Store:    ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`  API:      ${API_VERSION}`);
  console.log(`  CSV:      ${CSV_PATH}`);
  console.log(`  Dry run:  ${DRY_RUN}`);
  console.log(`  Publish:  ${PUBLISH}`);
  console.log(`  Limit:    ${LIMIT === Infinity ? "all" : LIMIT}`);
  console.log("");

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN && !DRY_RUN) {
    console.error(
      "  ERROR: SHOPIFY_ADMIN_ACCESS_TOKEN is required.\n" +
      "  Set it in .env or export it in your shell.\n" +
      "  Get it from: Shopify Admin > Settings > Apps > Develop apps > Create app\n" +
      "  Scopes needed: write_products, read_products, write_inventory, read_inventory"
    );
    process.exit(1);
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`  ERROR: CSV file not found: ${CSV_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSV(raw);
  console.log(`  Parsed ${rows.length} CSV rows`);

  const products = groupProducts(rows);
  const toSync = products.slice(0, LIMIT);
  console.log(`  Grouped into ${products.length} unique products; syncing ${toSync.length}`);
  console.log("");

  const results = { created: 0, updated: 0, skipped: 0, errors: 0, dryRun: 0 };
  const errorLog: { timestamp: string; handle: string; error: string }[] = [];

  for (let i = 0; i < toSync.length; i++) {
    try {
      const result = await syncProduct(toSync[i], i + 1, toSync.length);
      if (result.status === "created") results.created++;
      else if (result.status === "updated") results.updated++;
      else if (result.status === "skipped") results.skipped++;
      else if (result.status === "error") {
        results.errors++;
        errorLog.push({
          timestamp: new Date().toISOString(),
          handle: result.handle,
          error: JSON.stringify(result.errors),
        });
      } else if (result.status === "dry-run") results.dryRun++;
    } catch (err: any) {
      results.errors++;
      errorLog.push({
        timestamp: new Date().toISOString(),
        handle: toSync[i].handle,
        error: err.message,
      });
      console.error(`  FAIL [${i + 1}/${toSync.length}] ${toSync[i].handle}: ${err.message}`);
    }

    // Throttle between products to avoid rate limits
    if (!DRY_RUN && i < toSync.length - 1) {
      await sleep(THROTTLE_MS);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("");
  console.log("  =========================================");
  console.log("  Summary");
  console.log("  =========================================");
  console.log(`    Created:  ${results.created}`);
  console.log(`    Updated:  ${results.updated}`);
  console.log(`    Skipped:  ${results.skipped}`);
  console.log(`    Errors:   ${results.errors}`);
  if (DRY_RUN) console.log(`    Dry run:  ${results.dryRun}`);
  console.log(`    Time:     ${elapsed}s`);
  console.log("");

  if (errorLog.length > 0) {
    const errDir = path.resolve("data");
    if (!fs.existsSync(errDir)) fs.mkdirSync(errDir, { recursive: true });
    const errPath = path.resolve("data/sync-errors.json");
    fs.writeFileSync(errPath, JSON.stringify(errorLog, null, 2));
    console.log(`  Error details saved to ${errPath}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
