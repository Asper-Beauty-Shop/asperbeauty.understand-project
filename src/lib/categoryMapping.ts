/**
 * Granular product‐type filter categories mapped to Shopify `productType` values.
 * Used by the Products page filter sidebar.
 *
 * Top-level PARENT_TABS group the existing CATEGORY_GROUPS for broad tab navigation.
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

/** A top-level tab that groups one or more CategoryGroups */
export interface ParentTab {
  label: string;
  icon: string;
  /** Labels of CATEGORY_GROUPS that belong under this tab */
  groupLabels: string[];
  /** Additional loose Shopify productType values that don't fit an existing group */
  extraTypes?: string[];
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
      { label: "Toner", types: ["Toner", "Face Tonic"] },
      { label: "Mask", types: ["Face Mask", "Sheet Mask", "Clay Mask", "Peel-Off Mask"] },
      { label: "Eye Care", types: ["Eye Cream", "Eye Serum", "Under Eye"] },
      { label: "Exfoliator", types: ["Exfoliator", "Scrub", "Face Scrub", "Peeling"] },
    ],
  },
  {
    label: "Hair Care",
    icon: "💇",
    subcategories: [
      { label: "Shampoo", types: ["Shampoo"] },
      { label: "Conditioner", types: ["Conditioner"] },
      { label: "Hair Treatment", types: ["Hair Treatment", "Hair Mask", "Hair Oil", "Hair Serum"] },
      { label: "Styling", types: ["Hair Styling", "Hair Spray", "Hair Gel", "Hair Wax"] },
      { label: "Hair Color", types: ["Hair Color", "Hair Dye"] },
    ],
  },
  {
    label: "Body Care",
    icon: "🛁",
    subcategories: [
      { label: "Body Lotion", types: ["Body Lotion", "Body Cream", "Body Butter"] },
      { label: "Body Wash", types: ["Body Wash", "Shower Gel", "Bath & Body"] },
      { label: "Hand & Foot", types: ["Hand Cream", "Foot Cream", "Hand & Nail"] },
      { label: "Deodorant", types: ["Deodorant", "Antiperspirant"] },
    ],
  },
  {
    label: "Fragrance",
    icon: "🌹",
    subcategories: [
      { label: "Perfume", types: ["Perfume", "Eau de Parfum", "EDP"] },
      { label: "Eau de Toilette", types: ["Eau de Toilette", "EDT"] },
      { label: "Body Mist", types: ["Body Mist", "Body Spray"] },
      { label: "Gift Sets", types: ["Gift Set", "Fragrance Set"] },
    ],
  },
  {
    label: "Mom & Baby",
    icon: "👶",
    subcategories: [
      { label: "Baby Skin", types: ["Baby Lotion", "Baby Cream", "Baby Oil", "Baby Wash"] },
      { label: "Maternity", types: ["Maternity", "Stretch Mark", "Nursing"] },
      { label: "Baby Hair", types: ["Baby Shampoo"] },
    ],
  },
];

/**
 * Parent tabs that appear as the top-level horizontal navigation
 * on the catalog page. Each tab nests one or more CATEGORY_GROUPS.
 */
export const PARENT_TABS: ParentTab[] = [
  {
    label: "All",
    icon: "🏠",
    groupLabels: [], // empty = show all, no type filter
  },
  {
    label: "Skin Care",
    icon: "🧴",
    groupLabels: ["Skincare"],
    extraTypes: ["Skin Care"],
  },
  {
    label: "Makeup",
    icon: "💄",
    groupLabels: ["Complexion", "Eyes & Brows", "Lips"],
    extraTypes: ["Makeup"],
  },
  {
    label: "Hair Care",
    icon: "💇",
    groupLabels: ["Hair Care"],
  },
  {
    label: "Fragrance",
    icon: "🌹",
    groupLabels: ["Fragrance"],
  },
  {
    label: "Bath & Body",
    icon: "🛁",
    groupLabels: ["Body Care"],
    extraTypes: ["Bath & Body", "Body Care"],
  },
  {
    label: "Mom & Baby",
    icon: "👶",
    groupLabels: ["Mom & Baby"],
  },
];

/** Get the CATEGORY_GROUPS that belong to a given parent tab */
export function getGroupsForTab(tabLabel: string): CategoryGroup[] {
  if (tabLabel === "All") return CATEGORY_GROUPS;
  const tab = PARENT_TABS.find((t) => t.label === tabLabel);
  if (!tab) return CATEGORY_GROUPS;
  return CATEGORY_GROUPS.filter((g) => tab.groupLabels.includes(g.label));
}

/** Build a Shopify type query for a parent tab (all types under it) */
export function buildTabTypeQuery(tabLabel: string): string | undefined {
  if (tabLabel === "All") return undefined;
  const tab = PARENT_TABS.find((t) => t.label === tabLabel);
  if (!tab) return undefined;

  const allTypes: string[] = [...(tab.extraTypes || [])];
  const groups = getGroupsForTab(tabLabel);
  for (const group of groups) {
    for (const sub of group.subcategories) {
      allTypes.push(...sub.types);
    }
  }

  if (allTypes.length === 0) return undefined;
  return allTypes.map((t) => `product_type:${t}`).join(" OR ");
}

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
