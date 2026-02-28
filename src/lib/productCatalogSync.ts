/**
 * Product Brain sync: parse Shopify/Matrixify product into product_catalog row.
 * Use from Edge Function (sync-product-catalog) or webhook/scheduled job.
 *
 * Tags are the "brain": Concern_*, Step_*, plus optional Texture_*, Barrier_Repair.
 * Ghost fields: biomarker_indication -> biomarker_target, contraindication -> contraindications.
 */
export interface ShopifyProductForCatalog {
  handle: string;
  title: string;
  tags?: string[] | string;
  variants?: { inventory_quantity?: number }[] | {
    inventory_quantity?: number;
  };
  metafields?:
    | Array<{ namespace: string; key: string; value: string }>
    | Record<string, { value?: string }>;
}

export interface ProductCatalogRow {
  id: string;
  title: string;
  inventory_total: number;
  primary_concern: string | null;
  regimen_step: string | null;
  medical_tags: string[];
  bestseller_rank: number;
  biomarker_target: string | null;
  contraindications: string | null;
}

function parseTags(tags: string[] | string | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return String(tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function getMetafield(
  metafields: ShopifyProductForCatalog["metafields"],
  namespace: string,
  key: string,
): string | null {
  if (!metafields) return null;
  if (Array.isArray(metafields)) {
    const m = metafields.find((f) =>
      f.namespace === namespace && f.key === key
    );
    return m?.value ?? null;
  }
  const ns = (metafields as Record<string, { value?: string }>)[namespace];
  const k = ns && typeof ns === "object"
    ? (ns as Record<string, { value?: string }>)[key]
    : null;
  if (k && typeof k === "object" && "value" in k) {
    return (k as { value?: string }).value ?? null;
  }
  return null;
}

/**
 * Extract medical metadata from a Shopify product (after Matrixify import or API).
 * Returns a row ready for product_catalog upsert.
 */
export function processProduct(
  shopifyProduct: ShopifyProductForCatalog,
): ProductCatalogRow {
  const tags = parseTags(shopifyProduct.tags);

  const concernTag = tags.find((t) => t.startsWith("Concern_"));
  const stepTag = tags.find((t) => t.startsWith("Step_"));

  const primary_concern = concernTag
    ? concernTag.replace("Concern_", "")
    : null;
  const regimen_step = stepTag
    ? stepTag
      .split("_")
      .slice(0, 2)
      .join("_")
      .toLowerCase()
    : null;

  let inventory_total = 0;
  const v = shopifyProduct.variants;
  if (Array.isArray(v) && v.length > 0) {
    inventory_total = v.reduce(
      (sum, variant) => sum + (variant.inventory_quantity ?? 0),
      0,
    );
  } else if (v && typeof v === "object" && "inventory_quantity" in v) {
    inventory_total =
      (v as { inventory_quantity?: number }).inventory_quantity ?? 0;
  }

  const bestsellerRankRaw = getMetafield(
    shopifyProduct.metafields,
    "custom",
    "bestseller_rank",
  );
  const bestseller_rank = bestsellerRankRaw != null && bestsellerRankRaw !== ""
    ? parseInt(String(bestsellerRankRaw), 10) || 999
    : 999;

  const biomarker_target =
    getMetafield(shopifyProduct.metafields, "custom", "biomarker_indication") ??
      null;
  const contraindications =
    getMetafield(shopifyProduct.metafields, "custom", "contraindication") ??
      null;

  return {
    id: shopifyProduct.handle,
    title: shopifyProduct.title,
    inventory_total,
    primary_concern,
    regimen_step,
    medical_tags: tags,
    bestseller_rank,
    biomarker_target,
    contraindications,
  };
}

/**
 * Accept Matrixify-style row (e.g. from CSV or webhook payload).
 * Tags may be comma-separated string; metafields may be flat keys.
 */
export function processMatrixifyRow(row: {
  Handle: string;
  Title: string;
  Tags?: string;
  "Variant Inventory Qty"?: number | string;
  "Metafield: custom.bestseller_rank"?: number | string;
  "Metafield: custom.biomarker_indication"?: string;
  "Metafield: custom.contraindication"?: string;
}): ProductCatalogRow {
  const tags = row.Tags
    ? String(row.Tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    : [];
  const concernTag = tags.find((t) => t.startsWith("Concern_"));
  const stepTag = tags.find((t) => t.startsWith("Step_"));
  const inventory = row["Variant Inventory Qty"];
  const inventory_total = typeof inventory === "number"
    ? inventory
    : parseInt(String(inventory ?? 0), 10) || 0;
  const rankRaw = row["Metafield: custom.bestseller_rank"];
  const bestseller_rank = rankRaw != null && rankRaw !== ""
    ? parseInt(String(rankRaw), 10) || 999
    : 999;

  return {
    id: row.Handle,
    title: row.Title,
    inventory_total,
    primary_concern: concernTag ? concernTag.replace("Concern_", "") : null,
    regimen_step: stepTag
      ? stepTag
        .split("_")
        .slice(0, 2)
        .join("_")
        .toLowerCase()
      : null,
    medical_tags: tags,
    bestseller_rank,
    biomarker_target: row["Metafield: custom.biomarker_indication"]?.trim() ??
      null,
    contraindications: row["Metafield: custom.contraindication"]?.trim() ??
      null,
  };
}
