/**
 * product.ts — Supabase product types for Asper Beauty Shop
 *
 * Source of truth is the generated Supabase types (src/integrations/supabase/types.ts).
 * This file provides a leaner, named interface for use in UI components and API layers.
 */

import type { Tables } from "@/integrations/supabase/types";

/** Full Supabase product row — all columns */
export type SupabaseProduct = Tables<"products">;

/**
 * Lean product shape used by the Digital Tray ProductCard.
 * Select only these columns when fetching catalog data to keep payloads small.
 */
export interface CatalogProduct {
  id: string;
  title: string | null;
  handle: string | null;
  price: number;
  brand: string;
  asper_category: string | null;
  primary_concern: string | null;
  image_url: string | null;
  is_bestseller: boolean | null;
  gold_stitch_tier: boolean | null;
  clinical_badge: string | null;
  pharmacist_note: string | null;
  inventory_total: number | null;
  availability_status: string | null;
}

/** The columns to pass to .select() when fetching catalog products */
export const CATALOG_SELECT =
  "id, title, handle, price, brand, asper_category, primary_concern, image_url, is_bestseller, gold_stitch_tier, clinical_badge, pharmacist_note, inventory_total, availability_status" as const;
