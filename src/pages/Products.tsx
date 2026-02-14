import { useState } from "react";
import { Link } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, ArrowLeft, Search, Loader2 } from "lucide-react";

const PRODUCT_TYPES = ["Skin Care", "Cleanser", "Sunscreen", "Hair Care", "Fragrance", "Body Care"];

const Products = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState<string | undefined>();
  const [activeType, setActiveType] = useState<string | null>(null);

  const buildQuery = () => {
    const parts: string[] = [];
    if (activeQuery) parts.push(activeQuery);
    if (activeType) parts.push(`product_type:${activeType}`);
    return parts.length > 0 ? parts.join(" ") : undefined;
  };

  const { data, isLoading, error } = useShopifyProducts(buildQuery(), 24);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim() || undefined);
  };

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

          {/* Search */}
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

          {/* Type filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={activeType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(null)}
              className="rounded-full text-xs"
            >
              All
            </Button>
            {PRODUCT_TYPES.map((type) => (
              <Button
                key={type}
                variant={activeType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveType(activeType === type ? null : type)}
                className="rounded-full text-xs"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load products. Please try again.
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.products.map((product) => (
                <ShopifyProductCard key={product.node.id} product={product} />
              ))}
            </div>

            {data.pageInfo?.hasNextPage && (
              <div className="mt-8 flex justify-center">
                <p className="text-sm text-muted-foreground font-body">
                  Showing {data.products.length} products — refine with search to find more
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Products;
