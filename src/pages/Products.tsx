import { useState, useMemo } from "react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useProductEnrichmentBulk } from "@/hooks/useProductEnrichment";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ConcernFilter } from "@/components/ConcernFilter";
import { buildVendorQuery } from "@/components/VendorFilter";
import { ProductSearchForm } from "@/components/products/ProductSearchForm";
import { ProductFilterSidebar } from "@/components/products/ProductFilterSidebar";
import { ActiveFilterPills } from "@/components/products/ActiveFilterPills";
import { ProductResultsGrid } from "@/components/products/ProductResultsGrid";
import MobileFilterButton from "@/components/MobileFilterButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Products = () => {
  const [activeQuery, setActiveQuery] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const buildQuery = () => {
    const parts: string[] = [];
    if (activeQuery) parts.push(activeQuery);
    if (activeTab !== "All") parts.push(`product_type:${activeTab}`);
    if (selectedVendors.length > 0) {
      const vendorQuery = buildVendorQuery(selectedVendors);
      if (vendorQuery) parts.push(`(${vendorQuery})`);
    }
    return parts.length > 0 ? parts.join(" ") : undefined;
  };

  const { data, isLoading, error } = useShopifyProducts(buildQuery(), 24);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedTypes([]);
  };

  const handles = useMemo(
    () => (data || []).map((p) => p.node.handle),
    [data],
  );
  const { data: enrichmentMap } = useProductEnrichmentBulk(handles);

  const totalFilters = selectedTypes.length + selectedVendors.length;

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
              Browse our curated collection of 4,000+ beauty & wellness products
            </p>

            <ProductSearchForm onSearch={setActiveQuery} />

            <div className="mt-5">
              <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            <ActiveFilterPills
              selectedTypes={selectedTypes}
              selectedVendors={selectedVendors}
              onRemoveType={(t) => setSelectedTypes(selectedTypes.filter((x) => x !== t))}
              onRemoveVendor={(v) => setSelectedVendors(selectedVendors.filter((x) => x !== v))}
              onClearAll={() => { setSelectedTypes([]); setSelectedVendors([]); }}
            />
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {!isMobile && (
              <aside className="w-56 shrink-0">
                <div className="sticky top-24">
                  <ProductFilterSidebar
                    selectedTypes={selectedTypes}
                    onSelectTypes={setSelectedTypes}
                    selectedVendors={selectedVendors}
                    onSelectVendors={setSelectedVendors}
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
                          selectedTypes={selectedTypes}
                          onSelectTypes={setSelectedTypes}
                          selectedVendors={selectedVendors}
                          onSelectVendors={setSelectedVendors}
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

              <ProductResultsGrid
                products={data}
                isLoading={isLoading}
                error={error}
                enrichmentMap={enrichmentMap}
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
