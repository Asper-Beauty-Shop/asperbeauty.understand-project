/**
 * Concern slug â†’ keywords for client-side filtering and optional Shopify tag.
 * Aligns with "Concern_" tags (Acne, AntiAging) for chatbot/collection logic.
 */
export const CONCERN_CONFIG: Record<
  string,
  { keywords: string[]; tag?: string }
> = {
  acne: {
    keywords: [
      "acne",
      "blemish",
      "purif",
      "normaderm",
      "cleanser",
      "pore",
      "oil-free",
      "mattif",
    ],
    tag: "Concern_Acne",
  },
  "anti-aging": {
    keywords: [
      "anti-aging",
      "collagen",
      "retinol",
      "liftactiv",
      "wrinkle",
      "firming",
      "peptide",
    ],
    tag: "Concern_AntiAging",
  },
  dryness: {
    keywords: [
      "hydration",
      "hyaluronic",
      "moistur",
      "mineral 89",
      "aqua",
      "h.a.",
      "booster",
      "dryness",
    ],
    tag: "Concern_Dryness",
  },
  hydration: {
    keywords: [
      "hydration",
      "hyaluronic",
      "moistur",
      "mineral 89",
      "aqua",
      "h.a.",
      "booster",
    ],
    tag: "Concern_Hydration",
  },
  sensitivity: {
    keywords: [
      "sensitive",
      "soothing",
      "calming",
      "gentle",
      "redness",
      "irritat",
      "dermatolog",
    ],
    tag: "Concern_Sensitivity",
  },
  pigmentation: {
    keywords: [
      "bright",
      "vitamin c",
      "radiance",
      "glow",
      "dark spot",
      "b3",
      "luminous",
      "pigment",
    ],
    tag: "Concern_Pigmentation",
  },
  brightening: {
    keywords: [
      "bright",
      "vitamin c",
      "radiance",
      "glow",
      "dark spot",
      "b3",
      "luminous",
    ],
    tag: "Concern_Brightening",
  },
  "hair-loss": {
    keywords: ["hair", "loss", "thinning", "scalp", "regrowth", "biotin"],
    tag: "Concern_HairLoss",
  },
  hair: {
    keywords: ["hair", "loss", "thinning", "scalp", "regrowth", "biotin"],
    tag: "Concern_HairLoss",
  },
};

/** Normalize concern from URL (e.g. anti-aging, acne) to a key in CONCERN_CONFIG */
export function normalizeConcernSlug(slug: string | undefined): string | null {
  if (!slug) return null;
  const lower = slug.toLowerCase().trim();
  if (CONCERN_CONFIG[lower]) return lower;
  // Map common variants
  if (lower === "antiaging") return "anti-aging";
  if (lower === "hairloss") return "hair-loss";
  return lower;
}

type NodeWithText = {
  title: string;
  description?: string | null;
  tags?: string[];
};

/**
 * Filter Shopify products by concern using title/description/tags keyword match.
 * Use when Shopify API query is not used or as fallback.
 */
export function filterProductsByConcern<T extends { node: NodeWithText }>(
  products: T[],
  concernSlug: string,
): T[] {
  const normalized = normalizeConcernSlug(concernSlug);
  const config = normalized ? CONCERN_CONFIG[normalized] : undefined;
  if (!config) return products;
  const keywords = config.keywords;
  return products.filter((p) => {
    const node = p.node as NodeWithText;
    const title = node.title.toLowerCase();
    const description = (node.description ?? "").toLowerCase();
    const tags = (node.tags ?? []).join(" ").toLowerCase();
    const combined = `${title} ${description} ${tags}`;
    return keywords.some((k) => combined.includes(k.toLowerCase()));
  });
}

/** Build Shopify Storefront API query string for tag (e.g. tag:Concern_Acne) */
export function concernToShopifyTag(concernSlug: string): string | null {
  const normalized = normalizeConcernSlug(concernSlug);
  if (!normalized) return null;
  const config = CONCERN_CONFIG[normalized];
  return config?.tag ? `tag:${config.tag}` : null;
}

/**
 * Detect concern from free text (e.g. "My skin feels tight and dry" â†’ "hydration").
 * Use for "Detected: [Concern]" chip in chat or analytics.
 * Order of CONCERN_CONFIG keys determines priority when multiple match.
 */
export function detectConcernFromText(text: string): string | null {
  if (!text || typeof text !== "string") return null;
  const lower = text.toLowerCase().trim();
  for (const [slug, config] of Object.entries(CONCERN_CONFIG)) {
    const hit = config.keywords.some((k) => lower.includes(k));
    if (hit) return slug;
  }
  if (/\b(dry|tight|dehydrat)\b/.test(lower)) return "hydration";
  if (/\b(oily|shine|pore)\b/.test(lower)) return "acne";
  if (/\b(sensitiv|red|irritat)\b/.test(lower)) return "sensitivity";
  if (/\b(wrinkle|aging|anti-?age)\b/.test(lower)) return "anti-aging";
  if (/\b(dull|dark spot|pigment)\b/.test(lower)) return "brightening";
  return null;
}
