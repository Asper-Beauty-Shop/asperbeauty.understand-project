/**
 * useCatalogProducts — TanStack Query hook for Supabase product catalog.
 *
 * Replaces the Next.js Server Component fetch pattern with a client-side
 * TanStack Query useQuery — same data, same security (RLS enforced by Supabase).
 *
 * Cache: stale after 1 hour (matches Next.js revalidate: 3600).
 * Filter: skips Pending_Purge products and out-of-stock items by default.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATALOG_SELECT, type CatalogProduct } from "@/types/product";

interface CatalogFilters {
  /** Filter by asper_category */
  category?: string | null;
  /** Filter by primary_concern enum value */
  concern?: string | null;
  /** Filter by brand name */
  brand?: string | null;
  /** Include out-of-stock products (default: false) */
  includeOutOfStock?: boolean;
  /** Max results (default: 100) */
  limit?: number;
}

export function useCatalogProducts(filters: CatalogFilters = {}) {
  const {
    category,
    concern,
    brand,
    includeOutOfStock = false,
    limit = 100,
  } = filters;

  return useQuery<CatalogProduct[]>({
    queryKey: ["catalog-products", { category, concern, brand, includeOutOfStock, limit }],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(CATALOG_SELECT)
        .neq("availability_status", "Pending_Purge")
        .order("is_bestseller", { ascending: false })
        .order("bestseller_rank", { ascending: true, nullsFirst: false })
        .limit(limit);

      if (!includeOutOfStock) {
        query = query.gt("inventory_total", 0);
      }
      if (category) query = query.eq("asper_category", category);
      if (concern)  query = query.eq("primary_concern", concern);
      if (brand)    query = query.ilike("brand", `%${brand}%`);

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as CatalogProduct[];
    },
    staleTime: 60 * 60 * 1000, // 1 hour — matches Next.js revalidate: 3600
    gcTime:    2 * 60 * 60 * 1000,
  });
}
