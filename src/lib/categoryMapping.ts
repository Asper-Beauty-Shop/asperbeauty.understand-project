/**
 * Granular product‐type filter categories mapped to Shopify `productType` values.
 * Used by the Products page filter sidebar.
 */

export interface SubCategory {
  label: string;
  /** Shopify productType values that match this sub‐category (case‐insensitive) */
  types: string[];
}

export interface CategoryGroup {
  label: string;
  icon: string;
  subcategories: SubCategory[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: "Complexion",
    icon: "✨",
    subcategories: [
      { label: "Foundation", types: ["Foundation"] },
      { label: "Concealer", types: ["Concealer"] },
      { label: "Primer", types: ["Primer"] },
      { label: "Powder", types: ["Powder", "Loose Powder", "Compact Powder", "Face Powder"] },
      { label: "Blusher", types: ["Blusher", "Blush", "Cream Blush"] },
      { label: "Contour & Highlighter", types: ["Contour", "Highlighter", "Bronzer"] },
      { label: "Setting Spray", types: ["Setting Spray", "Fixing Spray"] },
    ],
  },
  {
    label: "Eyes & Brows",
    icon: "👁️",
    subcategories: [
      { label: "Mascara", types: ["Mascara"] },
      { label: "Eyeliner", types: ["Eyeliner", "Eye Liner", "Kohl", "Kajal"] },
      { label: "Eyebrow", types: ["Eyebrow", "Brow"] },
      { label: "Eyeshadow", types: ["Eyeshadow", "Eye Shadow", "Eye shadow"] },
    ],
  },
  {
    label: "Lips",
    icon: "💋",
    subcategories: [
      { label: "Lipstick", types: ["Lipstick", "Liquid Lipstick", "Matte Lipstick"] },
      { label: "Lip Liner", types: ["Lip Liner", "Lipliner"] },
      { label: "Lip Gloss", types: ["Lip Gloss", "Lip Plumper"] },
      { label: "Lip Care", types: ["Lip Balm", "Lip Care"] },
    ],
  },
  {
    label: "Skincare",
    icon: "🧴",
    subcategories: [
      { label: "Cleanser", types: ["Cleanser", "Face Wash", "Micellar Water", "Micellar"] },
      { label: "Serum", types: ["Serum", "Face Serum"] },
      { label: "Sunscreen", types: ["Sunscreen", "Sun Screen", "SPF", "Sun Care"] },
      { label: "Moisturizer", types: ["Moisturizer", "Moisturiser", "Face Cream", "Day Cream", "Night Cream"] },
    ],
  },
  {
    label: "Hair Care",
    icon: "💇",
    subcategories: [
      { label: "Shampoo", types: ["Shampoo"] },
      { label: "Conditioner", types: ["Conditioner"] },
      { label: "Hair Treatment", types: ["Hair Treatment", "Hair Mask", "Hair Oil", "Hair Serum"] },
    ],
  },
  {
    label: "Body & Fragrance",
    icon: "🌸",
    subcategories: [
      { label: "Body Care", types: ["Body Care", "Body Lotion", "Body Cream", "Body Wash"] },
      { label: "Fragrance", types: ["Fragrance", "Perfume", "Eau de Parfum", "Eau de Toilette", "Body Mist"] },
    ],
  },
];

/**
 * Build a Shopify search query string from selected sub-category labels.
 * Maps labels → their `types` and combines with OR via Shopify's product_type filter.
 */
export function buildTypeQuery(selectedLabels: string[]): string | undefined {
  if (selectedLabels.length === 0) return undefined;

  const allTypes: string[] = [];
  for (const group of CATEGORY_GROUPS) {
    for (const sub of group.subcategories) {
      if (selectedLabels.includes(sub.label)) {
        allTypes.push(...sub.types);
      }
    }
  }

  if (allTypes.length === 0) return undefined;

  // Shopify Storefront search supports `product_type:X OR product_type:Y`
  return allTypes.map((t) => `product_type:${t}`).join(" OR ");
}
