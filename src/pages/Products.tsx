import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConcernFilter } from "@/components/ConcernFilter";
import { ProductSearchForm } from "@/components/products/ProductSearchForm";
import { ProductFilterSidebar } from "@/components/products/ProductFilterSidebar";
import { ActiveFilterPills } from "@/components/products/ActiveFilterPills";
import { SupabaseProductGrid } from "@/components/products/SupabaseProductGrid";
import { ShopCategoryTabs } from "@/components/products/ShopCategoryTabs";
import MobileFilterButton from "@/components/MobileFilterButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["shop-products", activeCategory, selectedBrands, selectedConcern, searchQuery],
    queryFn: async () => {
      // If there's a search query, use the search_products RPC
      if (searchQuery?.trim()) {
        const { data, error } = await supabase
          .rpc("search_products", { search_query: searchQuery, max_results: 50 });
        if (error) throw error;
        return data ?? [];
      }

      // Otherwise build a filtered query
      let query = supabase
        .from("products")
        .select("*")
        .neq("availability_status", "Pending_Purge")
        .order("bestseller_rank", { ascending: true, nullsFirst: false });

      if (activeCategory !== "All") {
        query = query.eq("category", activeCategory);
      }

      if (selectedBrands.length > 0) {
        query = query.in("brand", selectedBrands);
      }

      if (selectedConcern) {
        query = query.eq("primary_concern", selectedConcern);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const totalFilters = selectedBrands.length + (selectedConcern ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <header className="border-b border-border/50 bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Product Catalog
            </h1>
            <p className="mt-2 text-muted-foreground font-body">
              Browse our curated collection of premium beauty & wellness products
            </p>

            <ProductSearchForm onSearch={setSearchQuery} />

            <div className="mt-5">
              <ShopCategoryTabs activeTab={activeCategory} onTabChange={(tab) => { setActiveCategory(tab); }} />
            </div>

            <ActiveFilterPills
              selectedTypes={[]}
              selectedVendors={selectedBrands}
              onRemoveType={() => {}}
              onRemoveVendor={(v) => setSelectedBrands(selectedBrands.filter((x) => x !== v))}
              onClearAll={() => { setSelectedBrands([]); setSelectedConcern(null); }}
            />
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {!isMobile && (
              <aside className="w-56 shrink-0">
                <div className="sticky top-24">
                  <ProductFilterSidebar
                    selectedTypes={[]}
                    onSelectTypes={() => {}}
                    selectedVendors={selectedBrands}
                    onSelectVendors={setSelectedBrands}
                  />
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              <div className="mb-5">
                <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-2">Shop by Concern</p>
                <ConcernFilter selected={selectedConcern} onSelect={setSelectedConcern} />
              </div>

              {isMobile && (
                <>
                  <Sheet>
                    <SheetTrigger asChild>
                      <span id="mobile-filter-trigger" className="hidden" />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 overflow-y-auto">
                      <div className="pt-6">
                        <ProductFilterSidebar
                          selectedTypes={[]}
                          onSelectTypes={() => {}}
                          selectedVendors={selectedBrands}
                          onSelectVendors={setSelectedBrands}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <MobileFilterButton
                    activeFilterCount={totalFilters}
                    onClick={() => {
                      const trigger = document.getElementById("mobile-filter-trigger");
                      if (trigger) trigger.click();
                    }}
                  />
                </>
              )}

              <SupabaseProductGrid
                products={products}
                isLoading={isLoading}
                error={error}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
