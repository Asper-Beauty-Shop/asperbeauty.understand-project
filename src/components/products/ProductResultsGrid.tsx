import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeletons";
import { Stethoscope, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";
import type { ProductEnrichment } from "@/hooks/useProductEnrichment";

interface ProductResultsGridProps {
  products: ShopifyProduct[] | undefined;
  isLoading: boolean;
  error: unknown;
  enrichmentMap?: Map<string, ProductEnrichment>;
  searchQuery?: string;
}

function EmptySearchState({ searchQuery }: { searchQuery?: string }) {
  return (
    <div 
      data-testid="empty-search-state"
      className="flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center"
    >
      {/* Dr. Sami Avatar */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-secondary border-2 border-accent/40 flex items-center justify-center shadow-[0_4px_20px_hsl(var(--accent)/0.15)]">
          <Stethoscope className="h-8 w-8 text-accent" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-md">
          <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
        </div>
      </div>

      {/* Heading */}
      <h3 className="font-heading text-xl md:text-2xl text-foreground mb-2">
        {searchQuery
          ? `No matches for "${searchQuery}"`
          : "No products found"}
      </h3>

      {/* Dr. Sami's Recommendation */}
      <div className="max-w-md mx-auto mb-8">
        <p className="text-sm text-muted-foreground font-body leading-relaxed">
          <span className="font-semibold text-accent">🔬 Dr. Sami recommends:</span>{" "}
          "Let me guide you to our pharmacist-curated clinical serums — precision formulas trusted by dermatologists across Jordan."
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wider hover:bg-primary/90 transition-colors duration-300"
        >
          <Sparkles className="h-4 w-4" />
          Explore Clinical Serums
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          data-testid="dr-sami-cta"
          onClick={() => window.dispatchEvent(new CustomEvent("open-beauty-assistant"))}
          className="inline-flex items-center gap-2 px-6 py-3 border border-accent/50 text-accent font-body text-sm tracking-wider hover:bg-accent/10 transition-colors duration-300"
        >
          <Stethoscope className="h-4 w-4" />
          Ask Dr. Sami
        </button>
      </div>

      {/* Trust line */}
      <p className="mt-6 text-[10px] text-muted-foreground/60 font-body uppercase tracking-widest">
        ✓ Dermatologist Approved · Authentic Sourcing · JFDA Certified
      </p>
    </div>
  );
}

export function ProductResultsGrid({
  products,
  isLoading,
  error,
  enrichmentMap,
  searchQuery,
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
    return <EmptySearchState searchQuery={searchQuery} />;
  }

  if (!products || products.length === 0) return null;

  return (
    <>
      <div data-testid="product-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
