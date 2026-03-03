/**
 * Dr. Bot Knowledge Base: products from Supabase (qqceibvalkoytafynwoc).
 * Classifies products as "Clinical" (Dr. Sami) vs "Cosmetic" (Ms. Zain) for persona-aware recommendations.
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/** Minimal product shape for classification (Supabase select subset). */
type ProductForClassification = Pick<
  ProductRow,
  "category" | "subcategory" | "skin_concerns" | "tags"
>;

export type ProductClassification = "clinical" | "cosmetic";

/** Categories/tags that indicate clinical/treatment products (Dr. Sami). */
const CLINICAL_INDICATORS = [
  "treatment",
  "serum",
  "medical",
  "clinical",
  "acne",
  "anti-aging",
  "retinol",
  "spf",
  "sunscreen",
  "prescription",
  "derm",
  "skin concern",
  "corrective",
  "therapeutic",
  "actives",
  "vitamin c",
  "niacinamide",
  "حبوب الشباب",
  "علاج",
  "سيروم",
  "ريتينول",
  "واقي شمس",
];

/** Categories/tags that indicate cosmetic/beauty products (Ms. Zain). */
const COSMETIC_INDICATORS = [
  "makeup",
  "fragrance",
  "gift",
  "body",
  "bath",
  "lipstick",
  "lip gloss",
  "mascara",
  "blush",
  "eyeshadow",
  "كولونيا",
  "هدية",
  "مكياج",
  "عطر",
];

export interface ClassifiedProduct extends ProductRow {
  classification: ProductClassification;
}

/**
 * Classify a single product as Clinical (Dr. Sami) or Cosmetic (Ms. Zain)
 * based on category, subcategory, skin_concerns, and tags.
 */
export function classifyProduct(
  product: ProductForClassification | ProductRow
): ProductClassification {
  const cat = (product.category ?? "").toLowerCase();
  const sub = (product.subcategory ?? "").toLowerCase();
  const concerns = (product.skin_concerns ?? []).join(" ").toLowerCase();
  const tags = (product.tags ?? []).join(" ").toLowerCase();
  const combined = [cat, sub, concerns, tags].join(" ");

  const clinicalScore = CLINICAL_INDICATORS.filter((i) =>
    combined.includes(i)
  ).length;
  const cosmeticScore = COSMETIC_INDICATORS.filter((i) =>
    combined.includes(i)
  ).length;

  return clinicalScore >= cosmeticScore ? "clinical" : "cosmetic";
}

/**
 * Fetch products from Supabase and attach classification.
 * Used by backend/Edge Function for knowledge base; can be used client-side for UI hints.
 */
export async function fetchClassifiedProducts(limit = 500): Promise<ClassifiedProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, price, image_url, category, subcategory, skin_concerns, tags, brand, description")
    .limit(limit);

  if (error) throw error;
  const rows = (data ?? []) as ClassifiedProduct[];
  return rows.map((row) => ({
    ...row,
    classification: classifyProduct(row),
  }));
}
