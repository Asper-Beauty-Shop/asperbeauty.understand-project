import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchProductsPaginated,
  PaginatedProductsResponse,
  ShopifyProduct,
} from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { FilterState, ProductFilters } from "./ProductFilters";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { ChevronDown, Loader2 } from "lucide-react";
import { categorizeProduct } from "@/lib/categoryMapping";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductGridProps {
  showFilters?: boolean;
  categorySlug?: string;
  initialPageSize?: number;
}

const PRODUCTS_PER_PAGE = 24;

export const ProductGrid = ({
  showFilters = false,
  categorySlug,
  initialPageSize = PRODUCTS_PER_PAGE,
}: ProductGridProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState<
    PaginatedProductsResponse["pageInfo"] | null
  >(null);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 5000],
  });
  const { language } = useLanguage();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await fetchProductsPaginated(initialPageSize);
        setProducts(result.products);
        setPageInfo(result.pageInfo);

        // Set max price based on products
        if (result.products.length > 0) {
          const maxProductPrice = Math.max(
            ...result.products.map((p) =>
              parseFloat(p.node.priceRange.minVariantPrice.amount)
            ),
          );
          setFilters((prev) => ({
            ...prev,
            priceRange: [0, Math.ceil(maxProductPrice * 1.1)], // Add 10% buffer
          }));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [initialPageSize]);

  // Load more products
  const loadMoreProducts = useCallback(async () => {
    if (!pageInfo?.hasNextPage || loadingMore) return;

    try {
      setLoadingMore(true);
      const result = await fetchProductsPaginated(
        PRODUCTS_PER_PAGE,
        pageInfo.endCursor,
      );
      setProducts((prev) => [...prev, ...result.products]);
      setPageInfo(result.pageInfo);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [pageInfo, loadingMore]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting && pageInfo?.hasNextPage && !loadingMore
        ) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreProducts, pageInfo?.hasNextPage, loadingMore]);

  // Filter by category slug if provided
  const categoryFilteredProducts = useMemo(() => {
    if (!categorySlug) return products;

    return products.filter((product) => {
      const { node } = product;
      const productCategory = categorizeProduct(
        node.title,
        node.productType,
        node.vendor,
      );
      return productCategory === categorySlug;
    });
  }, [products, categorySlug]);

  // Extract unique categories and brands
  const { availableCategories, availableBrands, maxPrice } = useMemo(() => {
    const categories = [
      ...new Set(
        categoryFilteredProducts.map((p) => p.node.productType).filter(Boolean),
      ),
    ];
    const brands = [
      ...new Set(
        categoryFilteredProducts.map((p) => p.node.vendor).filter(Boolean),
      ),
    ];
    const max = categoryFilteredProducts.length > 0
      ? Math.ceil(
        Math.max(...categoryFilteredProducts.map((p) =>
          parseFloat(p.node.priceRange.minVariantPrice.amount)
        )),
      )
      : 5000;
    return {
      availableCategories: categories,
      availableBrands: brands,
      maxPrice: max,
    };
  }, [categoryFilteredProducts]);

  // Apply user filters
  const filteredProducts = useMemo(() => {
    return categoryFilteredProducts.filter((product) => {
      const { node } = product;
      const price = parseFloat(node.priceRange.minVariantPrice.amount);

      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(node.productType)
      ) {
        return false;
      }

      if (filters.brands.length > 0 && !filters.brands.includes(node.vendor)) {
        return false;
      }

      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [categoryFilteredProducts, filters]);

  return (
    <section id="products" className="py-24 bg-soft-ivory">
      <div className="luxury-container">
        {/* Section Header */}
        {!showFilters && (
          <div className="text-center mb-16">
            <p className="luxury-subheading text-shiny-gold mb-4">
              {language === "ar" ? "تسوقي مجموعتنا" : "Shop Our Collection"}
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-dark-charcoal mb-6">
              {language === "ar" ? "المنتجات المميزة" : "Featured Products"}
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-shiny-gold to-transparent mx-auto" />
          </div>
        )}

        {/* Loading State with Skeleton Grid */}
        {loading && (
          <div className={showFilters ? "flex flex-col lg:flex-row gap-8" : ""}>
            {showFilters && (
              <div className="w-full lg:w-64 flex-shrink-0">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-taupe/20 rounded w-24" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-6 bg-taupe/10 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1">
              <div
                className={`grid gap-8 lg:gap-10 ${
                  showFilters
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {Array.from({ length: showFilters ? 6 : 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content with Optional Filters */}
        {!loading && products.length > 0 && (
          <div className={showFilters ? "flex flex-col lg:flex-row gap-8" : ""}>
            {/* Filters Sidebar */}
            {showFilters && (
              <ProductFilters
                availableCategories={availableCategories}
                availableBrands={availableBrands}
                maxPrice={maxPrice}
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results count */}
              {showFilters && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="font-body text-sm text-dark-charcoal">
                    {language === "ar"
                      ? `عرض ${filteredProducts.length} من ${products.length} منتج`
                      : `Showing ${filteredProducts.length} of ${products.length} products`}
                  </p>
                  {pageInfo?.hasNextPage && (
                    <p className="font-body text-xs text-muted-foreground">
                      {language === "ar" ? "المزيد متاح" : "More available"}
                    </p>
                  )}
                </div>
              )}

              {filteredProducts.length > 0
                ? (
                  <>
                    <div
                      className={`grid gap-8 lg:gap-10 ${
                        showFilters
                          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      }`}
                    >
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.node.id} product={product} />
                      ))}
                    </div>

                    {/* Load More / Infinite Scroll Trigger */}
                    <div ref={loadMoreRef} className="mt-12">
                      {loadingMore && (
                        <div className="flex items-center justify-center py-8 gap-3">
                          <Loader2 className="w-6 h-6 animate-spin text-shiny-gold" />
                          <span className="font-body text-sm text-muted-foreground">
                            {language === "ar"
                              ? "جاري تحميل المزيد..."
                              : "Loading more..."}
                          </span>
                        </div>
                      )}

                      {pageInfo?.hasNextPage && !loadingMore && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={loadMoreProducts}
                            className="border-shiny-gold text-shiny-gold hover:bg-shiny-gold hover:text-dark-charcoal transition-all duration-300 gap-2"
                          >
                            <ChevronDown className="w-4 h-4" />
                            {language === "ar" ? "تحميل المزيد" : "Load More"}
                          </Button>
                        </div>
                      )}

                      {!pageInfo?.hasNextPage &&
                        products.length > PRODUCTS_PER_PAGE && (
                        <p className="text-center font-body text-sm text-muted-foreground py-8">
                          {language === "ar"
                            ? "تم عرض جميع المنتجات"
                            : "All products loaded"}
                        </p>
                      )}
                    </div>
                  </>
                )
                : (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-shiny-gold/10 flex items-center justify-center mx-auto mb-4">
                      <span className="font-display text-2xl text-shiny-gold">
                        ∅
                      </span>
                    </div>
                    <h3 className="font-display text-xl text-dark-charcoal mb-2">
                      {language === "ar"
                        ? "لم يتم العثور على منتجات"
                        : "No products found"}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {language === "ar"
                        ? "جربي تعديل الفلاتر للعثور على ما تبحثين عنه"
                        : "Try adjusting your filters to find what you're looking for."}
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 border border-shiny-gold/30">
                <span className="font-display text-3xl text-shiny-gold">∅</span>
              </div>
              <h3 className="font-display text-2xl text-dark-charcoal mb-4">
                {language === "ar" ? "لا توجد منتجات بعد" : "No Products Yet"}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {language === "ar"
                  ? "مجموعتنا قيد الإعداد. أخبرينا عن المنتجات التي ترغبين في رؤيتها في متجرك."
                  : "Our collection is being curated. Tell us what products you'd like to see in your store by describing the product name and price in the chat."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
