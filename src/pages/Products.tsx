import { useState, useMemo } from "react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { useProductEnrichmentBulk } from "@/hooks/useProductEnrichment";
import { CategoryFilter } from "@/components/CategoryFilter";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ConcernFilter } from "@/components/ConcernFilter";
import { VendorFilter, buildVendorQuery } from "@/components/VendorFilter";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeletons";
import MobileFilterButton from "@/components/MobileFilterButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Products = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const visibleGroups: { name: string; types: string[] }[] = [];

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

  // Reset sub-category selections when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedTypes([]);
  };

  const handles = useMemo(
    () => (data || []).map((p) => p.node.handle),
    [data]
  );
  const { data: enrichmentMap } = useProductEnrichmentBulk(handles);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim() || undefined);
  };

  const totalFilters = selectedTypes.length + selectedVendors.length;

  const filterSidebar = (
    <div className="space-y-4">
      <CategoryFilter selected={selectedTypes} onSelect={setSelectedTypes} />
      <Separator />
      <VendorFilter selected={selectedVendors} onSelect={setSelectedVendors} />
    </div>
  );

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

            <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-lg">
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="font-body"
              />
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Top-level category tabs */}
            <div className="mt-5">
              <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Active filter pills */}
            {totalFilters > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedTypes.map((type) => (
                  <Button
                    key={`type-${type}`}
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs h-7 gap-1"
                    onClick={() =>
                      setSelectedTypes(selectedTypes.filter((t) => t !== type))
                    }
                  >
                    {type}
                    <X className="h-3 w-3" />
                  </Button>
                ))}
                {selectedVendors.map((vendor) => (
                  <Button
                    key={`vendor-${vendor}`}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-7 gap-1 border-primary/30"
                    onClick={() =>
                      setSelectedVendors(selectedVendors.filter((v) => v !== vendor))
                    }
                  >
                    🏷️ {vendor}
                    <X className="h-3 w-3" />
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs h-7 text-muted-foreground"
                  onClick={() => { setSelectedTypes([]); setSelectedVendors([]); }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          {!isMobile && (
            <aside className="w-56 shrink-0">
              <div className="sticky top-24">{filterSidebar}</div>
            </aside>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Concern filter chips */}
            <div className="mb-5">
              <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-2">Shop by Concern</p>
              <ConcernFilter selected={selectedConcern} onSelect={setSelectedConcern} />
            </div>
            {/* Mobile: Floating sticky filter pill with scroll-hide */}
            {isMobile && (
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <span id="mobile-filter-trigger" className="hidden" />
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 overflow-y-auto">
                    <div className="pt-6">{filterSidebar}</div>
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

            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive font-body animate-shake">
                Something went wrong loading our catalog. Please check your connection and try again.
              </div>
            )}

            {isLoading && <ProductGridSkeleton count={6} />}

            {!isLoading && data && data.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Package className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium font-heading">No products found</p>
                <p className="text-sm font-body">Try a different search or filter</p>
              </div>
            )}

            {!isLoading && data && data.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.map((product) => (
                    <ShopifyProductCard key={product.node.id} product={product} enrichment={enrichmentMap?.get(product.node.handle)} />
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <p className="text-sm text-muted-foreground font-body">
                    Showing {data.length} products — refine with filters to find more
                  </p>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
