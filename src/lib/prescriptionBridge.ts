/**
 * Prescription Bridge: translates a skin concern into a curated 3-step regimen
 * from the products database using concern tags (e.g. Concern_Acne) and
 * step tags (Step_1_Cleanser, Step_2_Treatment, Step_3_Protection).
 */
import { supabase } from "@/integrations/supabase/client";
import { normalizeConcernSlug } from "@/lib/concernMapping";

const STEP_1_TAG = "Step_1_Cleanser";
const STEP_2_TAG = "Step_2_Treatment";
const STEP_3_TAG = "Step_3_Protection";

export type RegimenProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor?: string;
  productType?: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        compareAtPrice?: { amount: string; currencyCode: string } | null;
        availableForSale: boolean;
      };
    }>;
  };
};

export type DigitalTrayRegimen = {
  cleanser: RegimenProduct | null;
  treatment: RegimenProduct | null;
  protection: RegimenProduct | null;
  allProducts: RegimenProduct[];
};

function dbRowToRegimenProduct(row: any): RegimenProduct {
  return {
    id: row.id,
    title: row.title || row.name,
    handle: row.handle || row.id,
    description: row.description || "",
    vendor: row.brand,
    productType: row.category,
    tags: row.tags || [],
    priceRange: {
      minVariantPrice: { amount: String(row.price), currencyCode: "JOD" },
    },
    images: {
      edges: row.image_url
        ? [{ node: { url: row.image_url, altText: row.title || row.name } }]
        : [],
    },
    variants: {
      edges: [{
        node: {
          id: `${row.id}-default`,
          title: "Default",
          price: { amount: String(row.price), currencyCode: "JOD" },
          compareAtPrice: null,
          availableForSale: row.in_stock !== false,
        },
      }],
    },
  };
}

/**
 * Get a 3-step regimen (Digital Tray) by concern.
 */
export async function getProductsByConcern(
  concern: string,
): Promise<DigitalTrayRegimen | null> {
  const slug = normalizeConcernSlug(concern) ?? concern.toLowerCase().trim();
  const concernTag = `Concern_${slug.charAt(0).toUpperCase()}${slug.slice(1).replace(/-(\w)/g, (_, c) => c.toUpperCase())}`;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .contains("tags", [concernTag])
      .neq("availability_status", "Pending_Purge")
      .limit(20);

    if (error || !data) {
      return { cleanser: null, treatment: null, protection: null, allProducts: [] };
    }

    const allProducts = data.map(dbRowToRegimenProduct);
    const tags = (node: RegimenProduct) => node.tags ?? [];

    return {
      cleanser: allProducts.find((p) => tags(p).includes(STEP_1_TAG)) ?? null,
      treatment: allProducts.find((p) => tags(p).includes(STEP_2_TAG)) ?? null,
      protection: allProducts.find((p) => tags(p).includes(STEP_3_TAG)) ?? null,
      allProducts,
    };
  } catch (error) {
    console.error("Prescription Bridge (getProductsByConcern):", error);
    return null;
  }
}

/** Convert a regimen to a flat list for Digital Tray / cart. */
export function regimenToTrayProducts(
  regimen: DigitalTrayRegimen | null,
): Array<{
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  brand?: string;
  category?: string;
}> {
  if (!regimen) return [];
  const out: Array<{
    id: string;
    title: string;
    price: number;
    image_url: string | null;
    brand?: string;
    category?: string;
  }> = [];
  const push = (p: RegimenProduct | null) => {
    if (!p) return;
    const amount = p.priceRange?.minVariantPrice?.amount;
    const price = typeof amount === "string" ? parseFloat(amount) : 0;
    const image_url = p.images?.edges?.[0]?.node?.url ?? null;
    out.push({
      id: p.id,
      title: p.title,
      price,
      image_url,
      brand: p.vendor ?? undefined,
      category: p.productType ?? undefined,
    });
  };
  push(regimen.cleanser);
  push(regimen.treatment);
  push(regimen.protection);
  return out;
}
