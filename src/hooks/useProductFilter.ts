import { useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  concernToShopifyTag,
  filterProductsByConcern as filterByConcern,
  normalizeConcernSlug,
} from "@/lib/concernMapping";
import type { ShopifyProduct } from "@/lib/shopify";

/** Brand slug (URL) â†’ Shopify vendor name (e.g. vichy â†’ Vichy) */
const BRAND_TO_VENDOR: Record<string, string> = {
  vichy: "Vichy",
  laroche: "La Roche-Posay",
  larocheposay: "La Roche-Posay",
  cerave: "CeraVe",
  maybelline: "Maybelline",
  loreal: "L'OrÃ©al Paris",
  loreÃ¡l: "L'OrÃ©al Paris",
  garnier: "Garnier",
};

export interface UseProductFilterOptions {
  /** Read from path (e.g. /concerns/:slug, /brands/:slug) in addition to search params */
  usePathParams?: boolean;
}

export interface UseProductFilterResult {
  /** Concern from URL (?concern=acne or /concerns/acne) */
  concernSlug: string | null;
  /** Brand from URL (?brand=vichy or /brands/vichy) */
  brandSlug: string | null;
  /** Shopify API query string (e.g. "vendor:Vichy" or "tag:Concern_Acne") for fetchProducts(first, query) */
  shopifyQuery: string | undefined;
  /** True when at least one of concern or brand is set */
  isFiltering: boolean;
  /** Set concern in URL (search param or navigate to /concerns/:slug) */
  setConcern: (slug: string | null) => void;
  /** Set brand in URL */
  setBrand: (slug: string | null) => void;
  /** Clear concern and brand from URL */
  clearFilters: () => void;
  /** Filter products by current concern (client-side keyword match). Use when not using shopifyQuery for fetch. */
  filterProductsByConcern: (products: ShopifyProduct[]) => ShopifyProduct[];
}

/**
 * useProductFilter â€” 3-Click Solution hook.
 * Reads selected Concern or Brand from the URL and provides:
 * - shopifyQuery for API (fetchProducts(first, shopifyQuery) or fetchProductsPaginated(first, after, shopifyQuery))
 * - Client-side filter by concern (keyword match) when tag-based API query isn't used
 * Use on Collection / Concern / Brand pages to drive filtered results.
 */
export function useProductFilter(
  options: UseProductFilterOptions = {},
): UseProductFilterResult {
  const { usePathParams = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams<{ slug?: string; concernSlug?: string }>();

  // Source of truth: search params take precedence, then path
  const concernFromQuery = searchParams.get("concern");
  const brandFromQuery = searchParams.get("brand");
  const concernFromPath = usePathParams
    ? params.concernSlug ?? params.slug
    : null;
  const brandFromPath = usePathParams && params.slug && !concernFromPath
    ? params.slug
    : null;

  const concernSlug = useMemo(() => {
    const raw = concernFromQuery || concernFromPath || null;
    return normalizeConcernSlug(raw ?? undefined);
  }, [concernFromQuery, concernFromPath]);

  const brandSlug = useMemo(() => {
    const raw = brandFromQuery || brandFromPath || null;
    if (!raw) return null;
    return raw.toLowerCase().trim();
  }, [brandFromQuery, brandFromPath]);

  const shopifyQuery = useMemo(() => {
    const parts: string[] = [];
    if (brandSlug && BRAND_TO_VENDOR[brandSlug]) {
      parts.push(`vendor:${BRAND_TO_VENDOR[brandSlug]}`);
    }
    if (concernSlug) {
      const tagQuery = concernToShopifyTag(concernSlug);
      if (tagQuery) parts.push(tagQuery);
    }
    if (parts.length === 0) return undefined;
    return parts.join(" AND ");
  }, [brandSlug, concernSlug]);

  const isFiltering = Boolean(
    concernSlug || (brandSlug && BRAND_TO_VENDOR[brandSlug]),
  );

  const setConcern = useCallback(
    (slug: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (slug) next.set("concern", slug);
        else next.delete("concern");
        return next;
      });
    },
    [setSearchParams],
  );

  const setBrand = useCallback(
    (slug: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (slug) next.set("brand", slug);
        else next.delete("brand");
        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("concern");
      next.delete("brand");
      return next;
    });
  }, [setSearchParams]);

  const filterProductsByConcern = useCallback(
    (products: ShopifyProduct[]): ShopifyProduct[] => {
      if (!concernSlug) return products;
      return filterByConcern(products as Array<{ node: { title: string; description?: string | null; tags?: string[] } }>, concernSlug) as unknown as ShopifyProduct[];
    },
    [concernSlug],
  );

  return {
    concernSlug,
    brandSlug,
    shopifyQuery,
    isFiltering,
    setConcern,
    setBrand,
    clearFilters,
    filterProductsByConcern,
  };
}
