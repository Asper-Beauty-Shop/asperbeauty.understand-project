import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeletons";
import { Package } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import type { ProductEnrichment } from "@/hooks/useProductEnrichment";

interface ProductResultsGridProps {
  products: ShopifyProduct[] | undefined;
  isLoading: boolean;
  error: unknown;
  enrichmentMap?: Map<string, ProductEnrichment>;
}

export function ProductResultsGrid({
  products,
  isLoading,
  error,
  enrichmentMap,
}: ProductResultsGridProps) {
  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive font-body animate-shake">
        Something went wrong loading our catalog. Please check your connection and try again.
      </div>
    );
  }

  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  if (products && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Package className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium font-heading">No products found</p>
        <p className="text-sm font-body">Try a different search or filter</p>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ShopifyProductCard
            key={product.node.id}
            product={product}
            enrichment={enrichmentMap?.get(product.node.handle)}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <p className="text-sm text-muted-foreground font-body">
          Showing {products.length} products — refine with filters to find more
        </p>
      </div>
    </>
  );
}
