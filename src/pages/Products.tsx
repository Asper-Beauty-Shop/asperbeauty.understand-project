import { useState } from "react";
import { Link } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { VendorFilter, buildVendorQuery } from "@/components/VendorFilter";
import { CartDrawer } from "@/components/CartDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";
import { buildTypeQuery } from "@/lib/categoryMapping";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const Products = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState<string | undefined>();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const buildQuery = () => {
    const parts: string[] = [];
    if (activeQuery) parts.push(activeQuery);
    const typeQuery = buildTypeQuery(selectedTypes);
    if (typeQuery) parts.push(`(${typeQuery})`);
    const vendorQuery = buildVendorQuery(selectedVendors);
    if (vendorQuery) parts.push(`(${vendorQuery})`);
    return parts.length > 0 ? parts.join(" ") : undefined;
  };

  const { data, isLoading, error } = useShopifyProducts(buildQuery(), 24);

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
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <span className="font-heading text-xl font-bold text-primary">Asper</span>
            </div>
            <CartDrawer />
          </div>
        </div>
      </nav>

      <header className="border-b border-border/50 bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Product Catalog
          </h1>
          <p className="mt-2 text-muted-foreground font-body">
            Browse our curated collection of 3,000+ beauty & wellness products
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
            {/* Mobile filter button */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="mb-4 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {totalFilters > 0 && (
                      <span className="ml-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                        {totalFilters}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 overflow-y-auto">
                  <div className="pt-6">{filterSidebar}</div>
                </SheetContent>
              </Sheet>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                Failed to load products. Please try again.
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && data?.products && data.products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Package className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium font-heading">No products found</p>
                <p className="text-sm font-body">Try a different search or filter</p>
              </div>
            )}

            {!isLoading && data?.products && data.products.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.products.map((product) => (
                    <ShopifyProductCard key={product.node.id} product={product} />
                  ))}
                </div>

                {data.pageInfo?.hasNextPage && (
                  <div className="mt-8 flex justify-center">
                    <p className="text-sm text-muted-foreground font-body">
                      Showing {data.products.length} products — refine with filters to find more
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
