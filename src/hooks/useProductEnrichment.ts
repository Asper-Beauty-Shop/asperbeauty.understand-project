import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductEnrichment {
  clinical_badge: string | null;
  ai_persona_lead: string | null;
  key_ingredients: string[] | null;
  texture_profile: string | null;
  hex_swatch: string | null;
  gold_stitch_tier: boolean;
  product_highlights: string[] | null;
  condition: string | null;
  availability_status: string | null;
  gtin: string | null;
  mpn: string | null;
  pharmacist_note: string | null;
}

/**
 * Fetches enriched product metadata from the Supabase `products` table
 * by matching the Shopify handle.
 */
export function useProductEnrichment(handle: string | undefined) {
  return useQuery({
    queryKey: ["product-enrichment", handle],
    queryFn: async () => {
      if (!handle) return null;
      const { data, error } = await supabase
        .from("products")
        .select("clinical_badge, ai_persona_lead, key_ingredients, texture_profile, hex_swatch, gold_stitch_tier, product_highlights, condition, availability_status, gtin, mpn, pharmacist_note")
        .eq("handle", handle)
        .maybeSingle();
      if (error) {
        console.warn("Enrichment lookup failed:", error.message);
        return null;
      }
      return data as ProductEnrichment | null;
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000, // cache 5 min
  });
}

/**
 * Bulk-fetches enrichment for a list of handles (for product grid).
 * Returns a Map<handle, ProductEnrichment>.
 */
export function useProductEnrichmentBulk(handles: string[]) {
  return useQuery({
    queryKey: ["product-enrichment-bulk", handles.sort().join(",")],
    queryFn: async () => {
      if (handles.length === 0) return new Map<string, ProductEnrichment>();
      const { data, error } = await supabase
        .from("products")
        .select("handle, clinical_badge, ai_persona_lead, key_ingredients, texture_profile, hex_swatch, gold_stitch_tier, product_highlights, condition, availability_status, gtin, mpn, pharmacist_note")
        .in("handle", handles);
      if (error) {
        console.warn("Bulk enrichment lookup failed:", error.message);
        return new Map<string, ProductEnrichment>();
      }
      const map = new Map<string, ProductEnrichment>();
      for (const row of data || []) {
        map.set(row.handle, {
          clinical_badge: row.clinical_badge,
          ai_persona_lead: row.ai_persona_lead,
          key_ingredients: row.key_ingredients,
          texture_profile: row.texture_profile,
          hex_swatch: row.hex_swatch,
          gold_stitch_tier: row.gold_stitch_tier,
          product_highlights: row.product_highlights,
          condition: row.condition,
          availability_status: row.availability_status,
          gtin: row.gtin,
          mpn: row.mpn,
          pharmacist_note: row.pharmacist_note,
        });
      }
      return map;
    },
    enabled: handles.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
