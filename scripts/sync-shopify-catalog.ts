/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Asper Beauty Shop — CSV → Shopify Admin API Catalog Sync
 *
 * Architecture:
 *   CSV → this script → Shopify Admin API (GraphQL)
 *   Shopify → Storefront API → Lovable frontend
 *   Shopify → Product feed → Google Merchant Center (ID 5717495012)
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

// ---------------------------------------------------------------------------
// Load .env (inline, no external dependency)
// ---------------------------------------------------------------------------

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnv();

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
const PUBLISH = args.includes("--publish");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const csvArg = args.find(
  (a) => !a.startsWith("--") && (limitIdx === -1 || a !== args[limitIdx + 1])
);
const CSV_PATH =
  csvArg || process.env.CSV_PATH || path.resolve("data/shopify-import-3.csv");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function adminGraphQL(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  // Rate limit handling
  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get("Retry-After") || "2", 10);
    console.warn(`  ⏳ Rate limited (429). Waiting ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return adminGraphQL(query, variables, 1);
  }

  if (!res.ok) {
    const text = await res.text();
    if (attempt < MAX_RETRIES && res.status >= 500) {
      const wait = Math.pow(2, attempt) * 1000;
      console.warn(`  ⏳ Server error ${res.status}, retrying in ${wait / 1000}s (attempt ${attempt}/${MAX_RETRIES})...`);
      await sleep(wait);
      return adminGraphQL(query, variables, attempt + 1);
    }
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: { message?: string }) => e.message ?? "").join("; "));
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

/** Normalize CSV Type to one of the canonical product types */
function normalizeProductType(raw: string): string {
  const lower = raw.toLowerCase().trim();
  const map: Record<string, string> = {
    skincare: "Skin Care", "skin care": "Skin Care", "skin": "Skin Care",
    cleanser: "Skin Care", serum: "Skin Care", moisturizer: "Skin Care",
    toner: "Skin Care", mask: "Skin Care", "eye cream": "Skin Care",
    sunscreen: "Skin Care", micellar: "Skin Care", exfoliant: "Skin Care",
    makeup: "Makeup", lipstick: "Makeup", foundation: "Makeup",
    concealer: "Makeup", mascara: "Makeup", blush: "Makeup",
    eyeshadow: "Makeup", primer: "Makeup", "lip gloss": "Makeup",
    "hair care": "Hair Care", haircare: "Hair Care", shampoo: "Hair Care",
    conditioner: "Hair Care", "hair oil": "Hair Care", "hair mask": "Hair Care",
    fragrance: "Fragrance", perfume: "Fragrance", cologne: "Fragrance",
    "eau de": "Fragrance", oud: "Fragrance",
    supplement: "Supplements", supplements: "Supplements", vitamin: "Supplements",
    "baby care": "Baby Care", baby: "Baby Care", "mom & baby": "Baby Care",
    "mom and baby": "Baby Care", maternity: "Baby Care",
    "bath & body": "Bath & Body", "body lotion": "Bath & Body",
    "body wash": "Bath & Body", soap: "Bath & Body",
  };
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  // If already one of the canonical types, return as-is with proper casing
  const canonical = ["Skin Care", "Makeup", "Hair Care", "Fragrance", "Supplements", "Baby Care"];
  const match = canonical.find((c) => c.toLowerCase() === lower);
  return match || raw || "Skin Care";
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

      // Add normalized tag for frontend filtering (e.g. "Skin Care" → tag "skincare")
      if (type) {
        const normalized = normalizeTag(type);
        if (!tags.some((t) => normalizeTag(t) === normalized)) {
          tags.push(normalized);
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
        productType: normalizeProductType(type),
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
  mutation ProductUpdate($input: ProductInput!, $media: [CreateMediaInput!]) {
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

const PRODUCT_MEDIA_CREATE = `
  mutation ProductCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media { alt mediaContentType status }
      mediaUserErrors { field message }
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
      publishable { ... on Product { id } }
      userErrors { field message }
    }
  }
`;

const GET_PUBLICATIONS = `
  query GetPublications {
    publications(first: 10) {
      edges {
        node { id name }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Inventory queries & mutations
// ---------------------------------------------------------------------------

const LOCATIONS_QUERY = `
  query GetLocations {
    locations(first: 1) {
      edges { node { id name } }
    }
  }
`;

const VARIANT_INVENTORY_ITEMS = `
  query VariantInventoryItems($productId: ID!) {
    product(id: $productId) {
      variants(first: 100) {
        edges {
          node {
            id
            sku
            inventoryItem { id }
          }
        }
      }
    }
  }
`;

const INVENTORY_SET_QUANTITIES = `
  mutation InventorySetQuantities($input: InventorySetQuantitiesInput!) {
    inventorySetQuantities(input: $input) {
      inventoryAdjustmentGroup { reason }
      userErrors { field message }
    }
  }
`;

let cachedLocationId: string | null = null;

async function getPrimaryLocationId(): Promise<string> {
  if (cachedLocationId) return cachedLocationId;
  const data = await adminGraphQL(LOCATIONS_QUERY);
  const loc = data?.locations?.edges?.[0]?.node;
  if (!loc) throw new Error("No Shopify locations found. Create a location first.");
  cachedLocationId = loc.id;
  console.log(`  📍 Primary location: ${loc.name} (${loc.id})`);
  return loc.id;
}

async function setInventoryQuantities(
  productId: string,
  variants: { sku: string; inventoryQty: number }[],
  tag: string
) {
  const locationId = await getPrimaryLocationId();

  // Fetch inventoryItemIds for the product's variants
  const data = await adminGraphQL(VARIANT_INVENTORY_ITEMS, { productId });
  const variantEdges = data?.product?.variants?.edges || [];

  const quantities: { inventoryItemId: string; locationId: string; quantity: number }[] = [];

  for (const edge of variantEdges) {
    const node = edge.node;
    const inventoryItemId = node.inventoryItem?.id;
    if (!inventoryItemId) continue;

    // Match by SKU or by position
    const csvMatch = variants.find((v) => v.sku && v.sku === node.sku);
    const qty = csvMatch?.inventoryQty ?? variants[variantEdges.indexOf(edge)]?.inventoryQty;

    if (qty !== undefined && qty >= 0) {
      quantities.push({ inventoryItemId, locationId, quantity: qty });
    }
  }

  if (quantities.length === 0) return;

  try {
    const result = await adminGraphQL(INVENTORY_SET_QUANTITIES, {
      input: {
        name: "available",
        reason: "correction",
        quantities,
      },
    });
    const errors = result?.inventorySetQuantities?.userErrors;
    if (errors?.length) {
      console.warn(`  ⚠️ ${tag} inventory warnings:`, errors);
    } else {
      console.log(`  📦 ${tag}: set inventory for ${quantities.length} variant(s)`);
    }
  } catch (invErr: any) {
    console.warn(`  ⚠️ ${tag} inventory update failed: ${invErr.message}`);
  }
}

// ---------------------------------------------------------------------------
// Inventory queries & mutations
// ---------------------------------------------------------------------------

const LOCATIONS_QUERY = `
  query GetLocations {
    locations(first: 1) {
      edges { node { id name } }
    }
  }
`;

const VARIANT_INVENTORY_ITEMS = `
  query VariantInventoryItems($productId: ID!) {
    product(id: $productId) {
      variants(first: 100) {
        edges {
          node {
            id
            sku
            inventoryItem { id }
          }
        }
      }
    }
  }
`;

const INVENTORY_SET_QUANTITIES = `
  mutation InventorySetQuantities($input: InventorySetQuantitiesInput!) {
    inventorySetQuantities(input: $input) {
      inventoryAdjustmentGroup { reason }
      userErrors { field message }
    }
  }
`;

let cachedLocationId: string | null = null;

async function getPrimaryLocationId(): Promise<string> {
  if (cachedLocationId) return cachedLocationId;
  const data = await adminGraphQL(LOCATIONS_QUERY);
  const loc = data?.locations?.edges?.[0]?.node;
  if (!loc) throw new Error("No Shopify locations found. Create a location first.");
  cachedLocationId = loc.id;
  console.log(`  📍 Primary location: ${loc.name} (${loc.id})`);
  return loc.id;
}

async function setInventoryQuantities(
  productId: string,
  variants: { sku: string; inventoryQty: number }[],
  tag: string
) {
  const locationId = await getPrimaryLocationId();

  // Fetch inventoryItemIds for the product's variants
  const data = await adminGraphQL(VARIANT_INVENTORY_ITEMS, { productId });
  const variantEdges = data?.product?.variants?.edges || [];

  const quantities: { inventoryItemId: string; locationId: string; quantity: number }[] = [];

  for (const edge of variantEdges) {
    const node = edge.node;
    const inventoryItemId = node.inventoryItem?.id;
    if (!inventoryItemId) continue;

    // Match by SKU or by position
    const csvMatch = variants.find((v) => v.sku && v.sku === node.sku);
    const qty = csvMatch?.inventoryQty ?? variants[variantEdges.indexOf(edge)]?.inventoryQty;

    if (qty !== undefined && qty >= 0) {
      quantities.push({ inventoryItemId, locationId, quantity: qty });
    }
  }

  if (quantities.length === 0) return;

  try {
    const result = await adminGraphQL(INVENTORY_SET_QUANTITIES, {
      input: {
        name: "available",
        reason: "correction",
        quantities,
      },
    });
    const errors = result?.inventorySetQuantities?.userErrors;
    if (errors?.length) {
      console.warn(`  ⚠️ ${tag} inventory warnings:`, errors);
    } else {
      console.log(`  📦 ${tag}: set inventory for ${quantities.length} variant(s)`);
    }
  } catch (invErr: any) {
    console.warn(`  ⚠️ ${tag} inventory update failed: ${invErr.message}`);
  }
}

// ---------------------------------------------------------------------------
// Sync logic
// ---------------------------------------------------------------------------

let publicationId: string | null = null;

async function getPublicationId(): Promise<string | null> {
  if (publicationId) return publicationId;
  try {
    const data = await adminGraphQL(GET_PUBLICATIONS);
    const edges = data?.publications?.edges || [];
    // Prefer "Online Store" publication
    const onlineStore = edges.find(
      (e: any) => e.node.name === "Online Store"
    );
    publicationId = onlineStore?.node?.id || edges[0]?.node?.id || null;
    return publicationId;
  } catch {
    return null;
  }
}

async function publishProduct(productId: string) {
  const pubId = await getPublicationId();
  if (!pubId) {
    console.warn("  ⚠️ No publication found, skipping publish");
    return;
  }
  try {
    const data = await adminGraphQL(PUBLISHABLE_PUBLISH, {
      id: productId,
      input: [{ publicationId: pubId }],
    });
    const errors = data?.publishablePublish?.userErrors;
    if (errors?.length) {
      console.warn(`  ⚠️ Publish warnings:`, errors.map((e: any) => e.message).join("; "));
    }
  } catch (err: any) {
    console.warn(`  ⚠️ Publish failed: ${err.message}`);
  }
}

async function syncProduct(product: ProductGroup, index: number, total: number) {
  const tag = `[${index}/${total}] ${product.handle}`;

  if (!product.title) {
    console.warn(`  ⚠️ ${tag}: missing title, skipping`);
    return { status: "skipped" as const, handle: product.handle, reason: "no title" };
  }

  if (DRY_RUN) {
    console.log(
      `  🔍 ${tag}: "${product.title}" | ${product.variants.length} variant(s) | ${product.images.length} image(s) [DRY RUN]`
    );
    return { status: "dry-run" as const, handle: product.handle };
  }

  // 1. Lookup existing product by handle
  const lookupData = await adminGraphQL(LOOKUP_BY_HANDLE, {
    query: `handle:${product.handle}`,
  });
  let existing = lookupData?.products?.edges?.[0]?.node;

  // Fallback: lookup by SKU if no match by handle
  if (!existing && product.variants[0]?.sku) {
    const skuLookup = await adminGraphQL(LOOKUP_BY_SKU, {
      query: `sku:${product.variants[0].sku}`,
    });
    existing = skuLookup?.products?.edges?.[0]?.node;
  }

  const input: Record<string, unknown> = {
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
      mediaContentType: "IMAGE" as const,
    }));

  let productId: string;
  let variantEdges: { node: { id: string } }[];

  if (existing) {
    // ---- UPDATE ----
    input.id = existing.id;
    const updateData = await adminGraphQL(PRODUCT_UPDATE, { input });
    const errors = updateData?.productUpdate?.userErrors;
    if (errors?.length) {
      console.error(`  ❌ ${tag} update errors:`, errors);
      return { status: "error" as const, handle: product.handle, errors };
    }
    productId = existing.id;
    variantEdges =
      updateData?.productUpdate?.product?.variants?.edges || existing.variants.edges;

    // Attach media on update via separate mutation
    if (media.length > 0) {
      try {
        await adminGraphQL(PRODUCT_MEDIA_CREATE, { productId, media });
      } catch (mediaErr: any) {
        console.warn(`  ⚠️ ${tag} media upload skipped: ${mediaErr.message}`);
      }
    }

    console.log(`  ✅ ${tag}: updated`);
  } else {
    // ---- CREATE ----
    const createData = await adminGraphQL(PRODUCT_CREATE, { input, media });
    const errors = createData?.productCreate?.userErrors;
    if (errors?.length) {
      console.error(`  ❌ ${tag} create errors:`, errors);
      return { status: "error" as const, handle: product.handle, errors };
    }
    productId = createData.productCreate.product.id;
    variantEdges = createData.productCreate.product.variants.edges;
    console.log(`  ✅ ${tag}: created "${product.title}"`);
  }

  // 2. Update variant prices/SKUs
  if (product.variants.length > 0 && variantEdges?.length > 0) {
    const variantUpdates = variantEdges
      .map((edge: { node: { id: string } }, i: number) => {
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
          console.warn(
            `  ⚠️ ${tag} variant update warnings:`,
            bulkErrors.map((e: any) => e.message).join("; ")
          );
        }
      } catch (err: any) {
        console.warn(`  ⚠️ ${tag} variant update failed: ${err.message}`);
      }
    }
  }
  // 3. Set inventory quantities at the primary location
  if (variantEdges?.length > 0 && product.variants.some((v) => v.inventoryQty > 0)) {
    await setInventoryQuantities(
      productId,
      product.variants.map((v) => ({ sku: v.sku, inventoryQty: v.inventoryQty })),
      tag
    );
  }

  // 3. Publish to storefront (auto-publish new active products, or if --publish flag)
  if (PUBLISH || (!existing && product.status === "active")) {
    await publishProduct(productId);
  }

  return {
    status: (existing ? "updated" : "created") as "updated" | "created",
    handle: product.handle,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  Asper Beauty Shop — Shopify Catalog Sync                   ║");
  console.log("║  Single source of truth: Shopify → Lovable + GMC            ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log(`  Store:    ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`  API:      ${API_VERSION}`);
  console.log(`  CSV:      ${CSV_PATH}`);
  console.log(`  Dry run:  ${DRY_RUN}`);
  console.log(`  Publish:  ${PUBLISH}`);
  console.log(`  Limit:    ${LIMIT === Infinity ? "all" : LIMIT}`);
  console.log("");

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN && !DRY_RUN) {
    console.error(
      "❌ SHOPIFY_ADMIN_ACCESS_TOKEN is required. Set it in .env or export it."
    );
    console.error(
      "   Get it from: Shopify Admin → Settings → Apps → Develop apps → Create app"
    );
    console.error(
      "   Scopes needed: write_products, read_products, write_inventory, read_inventory"
    );
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
  console.log(
    `  Grouped into ${products.length} unique products; syncing ${toSync.length}\n`
  );

  const results = { created: 0, updated: 0, skipped: 0, errors: 0, dryRun: 0 };
  const errorLog: { handle: string; error: string }[] = [];

  for (let i = 0; i < toSync.length; i++) {
    try {
      const result = await syncProduct(toSync[i], i + 1, toSync.length);
      if (result.status === "created") results.created++;
      else if (result.status === "updated") results.updated++;
      else if (result.status === "skipped") results.skipped++;
      else if (result.status === "error") {
        results.errors++;
        errorLog.push(result);
      } else if (result.status === "dry-run") results.dryRun++;
    } catch (err: unknown) {
      results.errors++;
      const msg = err instanceof Error ? err.message : String(err);
      errorLog.push({ handle: toSync[i].handle, error: msg });
      console.error(`  ❌ [${i + 1}] ${toSync[i].handle}: ${msg}`);
    }

    // Throttle between products to avoid rate limits
    if (!DRY_RUN && i < toSync.length - 1) {
      await sleep(THROTTLE_MS);
    }
  }

  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("  Summary:");
  console.log(`    Created:  ${results.created}`);
  console.log(`    Updated:  ${results.updated}`);
  console.log(`    Skipped:  ${results.skipped}`);
  console.log(`    Errors:   ${results.errors}`);
  if (DRY_RUN) console.log(`    Dry run:  ${results.dryRun}`);
  console.log("══════════════════════════════════════════════════════════════\n");

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
