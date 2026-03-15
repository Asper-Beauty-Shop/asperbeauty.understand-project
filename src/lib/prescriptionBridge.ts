/**
 * Prescription Bridge: translates a skin concern into a curated 3-step regimen
 * from the Shopify Storefront API using concern tags (e.g. Concern_Acne) and
 * step tags (Step_1_Cleanser, Step_2_Treatment, Step_3_Protection).
 *
 * Use for the "Digital Tray" so the AI/pharmacist flow recommends a complete
 * routine with real-time inventory. Aligns with Matrixify/import tags.
 */
import { storefrontApiRequest } from "@/lib/shopify";
import {
  concernToShopifyTag,
  normalizeConcernSlug,
} from "@/lib/concernMapping";

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
  /** All products matching the concern tag (for fallback or display) */
  allProducts: RegimenProduct[];
};

/**
 * Get a 3-step regimen (Digital Tray) from Shopify by concern.
 * Uses your Matrixify/import tags: Concern_* for the collection, Step_* for the role.
 *
 * @param concern - Concern slug (e.g. "acne", "hydration") or Shopify tag (e.g. "Concern_Acne")
 * @returns { cleanser, treatment, protection, allProducts } or null on error
 */
export async function getProductsByConcern(
  concern: string,
): Promise<DigitalTrayRegimen | null> {
  const slug = normalizeConcernSlug(concern) ?? concern.toLowerCase().trim();
  const concernTag = concernToShopifyTag(slug);
  // Shopify products query expects e.g. "tag:Concern_Acne" (concernToShopifyTag returns that)
  const query = concernTag ??
    (concern.startsWith("Concern_")
      ? `tag:${concern}`
      : `tag:Concern_${concern.replace(/-/g, "")}`);

  const variables = { query };
  try {
    const data = await storefrontApiRequest(REGIMEN_QUERY, variables) as Record<string, Record<string, unknown>>;
    const productsData = data?.data as Record<string, unknown> | undefined;
    const products = productsData?.products as { edges?: Array<{ node: RegimenProduct }> } | undefined;
    if (!products?.edges) {
      return {
        cleanser: null,
        treatment: null,
        protection: null,
        allProducts: [],
      };
    }

    const allProducts = data.data.products.edges.map(
      (e: { node: RegimenProduct }) => e.node,
    ) as RegimenProduct[];

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

/** Convert a regimen to a flat list for Digital Tray / cart (order: cleanser → treatment → protection). */
export function regimenToTrayProducts(
  regimen: DigitalTrayRegimen | null,
): Array<
  {
    id: string;
    title: string;
    price: number;
    image_url: string | null;
    brand?: string;
    category?: string;
  }
> {
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
