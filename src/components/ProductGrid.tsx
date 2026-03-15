/**
 * ProductGrid — Supabase-backed paginated product grid.
 *
 * Replaces the Shopify fetchProductsPaginated approach with direct
 * Supabase queries. Offset pagination: 24 per page, "Load More" button
 * + IntersectionObserver infinite scroll.
 *
 * Keeps existing ProductFilters sidebar, EN/AR strings, and skeleton states.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProductCard } from "./ui/SupabaseProductCard";
import { FilterState, ProductFilters } from "./ProductFilters";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CatalogProduct } from "@/types/product";
import { CATALOG_SELECT } from "@/types/product";

// ── Constants ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 24;

// ── Props ──────────────────────────────────────────────────────────────────────

interface ProductGridProps {
  showFilters?: boolean;
  /** Filter by asper_category value (e.g. "Concealer") */
  categorySlug?: string;
  initialPageSize?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────

export const ProductGrid = ({
  showFilters = false,
  categorySlug,
  initialPageSize = PAGE_SIZE,
}: ProductGridProps) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 5000],
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // ── Fetch page ───────────────────────────────────────────────────────────────

  const fetchPage = useCallback(
    async (pageOffset: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      let query = supabase
        .from("products")
        .select(CATALOG_SELECT)
        .neq("availability_status", "Pending_Purge")
        .order("is_bestseller", { ascending: false })
        .order("bestseller_rank", { ascending: true, nullsFirst: false })
        .range(pageOffset, pageOffset + (append ? PAGE_SIZE : initialPageSize) - 1);

      if (categorySlug) query = query.eq("asper_category", categorySlug);

      const { data, error } = await query;

      if (!error && data) {
        const rows = data as CatalogProduct[];
        setProducts((prev) => append ? [...prev, ...rows] : rows);
        setHasMore(rows.length === (append ? PAGE_SIZE : initialPageSize));

        if (!append && rows.length > 0) {
          const max = Math.max(...rows.map((p) => p.price));
          setFilters((prev) => ({
            ...prev,
            priceRange: [0, Math.ceil(max * 1.1)],
          }));
        }
      }

      if (append) setLoadingMore(false);
      else setLoading(false);
    },
    [categorySlug, initialPageSize],
  );

  // Initial load
  useEffect(() => {
    setOffset(0);
    setProducts([]);
    fetchPage(0, false);
  }, [fetchPage]);

  // Load more
  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    const nextOffset = offset + initialPageSize;
    setOffset(nextOffset);
    await fetchPage(nextOffset, true);
  }, [hasMore, loadingMore, offset, initialPageSize, fetchPage]);

  // Intersection observer
  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMoreProducts, hasMore, loadingMore]);

  // ── Client-side filters ────────────────────────────────────────────────────

  const { availableCategories, availableBrands, maxPrice } = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.asper_category).filter(Boolean))] as string[];
    const brands     = [...new Set(products.map((p) => p.brand).filter(Boolean))];
    const max        = products.length > 0 ? Math.ceil(Math.max(...products.map((p) => p.price))) : 5000;
    return { availableCategories: categories, availableBrands: brands, maxPrice: max };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.categories.length > 0 && !filters.categories.includes(p.asper_category ?? "")) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      return true;
    });
  }, [products, filters]);

  // ── Grid cols class ────────────────────────────────────────────────────────

  const gridCols = showFilters
    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4">

        {/* Section header (no-filter mode) */}
        {!showFilters && (
          <div className="text-center mb-16">
            <p className="text-sm font-body uppercase tracking-widest text-polished-gold mb-4">
              {isAr ? "تسوقي مجموعتنا" : "Shop Our Collection"}
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
              {isAr ? "المنتجات المميزة" : "Featured Products"}
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-polished-gold to-transparent mx-auto" />
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className={showFilters ? "flex flex-col lg:flex-row gap-8" : ""}>
            {showFilters && (
              <div className="w-full lg:w-64 shrink-0 animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-24" />
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-6 bg-muted/60 rounded" />)}
              </div>
            )}
            <div className="flex-1">
              <div className={`grid gap-6 lg:gap-8 ${gridCols}`}>
                {Array.from({ length: showFilters ? 6 : 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products + optional filters */}
        {!loading && products.length > 0 && (
          <div className={showFilters ? "flex flex-col lg:flex-row gap-8" : ""}>
            {showFilters && (
              <ProductFilters
                availableCategories={availableCategories}
                availableBrands={availableBrands}
                maxPrice={maxPrice}
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}

            <div className="flex-1">
              {/* Results count */}
              {showFilters && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="font-body text-sm text-foreground">
                    {isAr
                      ? `عرض ${filteredProducts.length} من ${products.length} منتج`
                      : `Showing ${filteredProducts.length} of ${products.length} products`}
                  </p>
                  {hasMore && (
                    <p className="font-body text-xs text-muted-foreground">
                      {isAr ? "المزيد متاح" : "More available"}
                    </p>
                  )}
                </div>
              )}

              {filteredProducts.length > 0 ? (
                <>
                  <div className={`grid gap-6 lg:gap-8 ${gridCols}`}>
                    {filteredProducts.map((product) => (
                      <SupabaseProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Load More / infinite scroll sentinel */}
                  <div ref={loadMoreRef} className="mt-12">
                    {loadingMore && (
                      <div className="flex items-center justify-center py-8 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-polished-gold" />
                        <span className="font-body text-sm text-muted-foreground">
                          {isAr ? "جاري تحميل المزيد..." : "Loading more..."}
                        </span>
                      </div>
                    )}

                    {hasMore && !loadingMore && (
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          onClick={loadMoreProducts}
                          className="border-polished-gold text-polished-gold hover:bg-polished-gold hover:text-white transition-all duration-300 gap-2"
                        >
                          <ChevronDown className="w-4 h-4" />
                          {isAr ? "تحميل المزيد" : "Load More"}
                        </Button>
                      </div>
                    )}

                    {!hasMore && products.length > initialPageSize && (
                      <p className="text-center font-body text-sm text-muted-foreground py-8">
                        {isAr ? "تم عرض جميع المنتجات" : "All products loaded"}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-polished-gold/10 flex items-center justify-center mx-auto mb-4">
                    <span className="font-heading text-2xl text-polished-gold">∅</span>
                  </div>
                  <h3 className="font-heading text-xl text-foreground mb-2">
                    {isAr ? "لم يتم العثور على منتجات" : "No products found"}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {isAr
                      ? "جربي تعديل الفلاتر للعثور على ما تبحثين عنه"
                      : "Try adjusting your filters to find what you're looking for."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 border border-polished-gold/30">
                <span className="font-heading text-3xl text-polished-gold">∅</span>
              </div>
              <h3 className="font-heading text-2xl text-foreground mb-4">
                {isAr ? "لا توجد منتجات بعد" : "No Products Yet"}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {isAr
                  ? "مجموعتنا قيد الإعداد. أخبرينا عن المنتجات التي ترغبين في رؤيتها في متجرك."
                  : "Our collection is being curated. Tell us what products you'd like to see in your store."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
