import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Stethoscope, Sparkles, ArrowRight, Star } from "lucide-react";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeletons";
import { BlurUpImage } from "@/components/BlurUpImage";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

interface SupabaseProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  error: unknown;
  searchQuery?: string;
}

function EmptySearchState({ searchQuery }: { searchQuery?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-secondary border-2 border-accent/40 flex items-center justify-center shadow-[0_4px_20px_hsl(var(--accent)/0.15)]">
          <Stethoscope className="h-8 w-8 text-accent" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-md">
          <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
        </div>
      </div>
      <h3 className="font-heading text-xl md:text-2xl text-foreground mb-2">
        {searchQuery ? `No matches for "${searchQuery}"` : "No products found"}
      </h3>
      <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-md mx-auto mb-8">
        <span className="font-semibold text-accent">🔬 Dr. Sami recommends:</span>{" "}
        "Try adjusting your filters or browse our full collection."
      </p>
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wider hover:bg-primary/90 transition-colors duration-300"
      >
        <Sparkles className="h-4 w-4" />
        Browse All Products
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function SupabaseProductCard({ product }: { product: Product }) {
  const handle = product.handle || product.id;
  const title = product.title || product.name;
  const imageUrl = product.image_url;

  return (
    <Link to={`/product/${handle}`}>
      <Card className={cn(
        "group overflow-hidden bg-card product-card-hover h-full shadow-maroon-glow hover:shadow-maroon-deep",
        product.gold_stitch_tier
          ? "border border-accent/60 hover:border-accent hover:shadow-[0_8px_30px_-8px_hsl(var(--accent)/0.35)]"
          : "border border-transparent hover:border-gold"
      )}>
        <div className="relative aspect-[3/4] bg-background flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <BlurUpImage
              src={imageUrl}
              alt={title}
              className="p-4 transition-transform duration-700 group-hover:scale-105"
              containerClassName="h-full w-full"
            />
          ) : (
            <Package className="h-16 w-16 text-muted-foreground/40" />
          )}

          {product.is_bestseller && (
            <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md">
              <Sparkles className="h-3 w-3" />
              Bestseller
            </span>
          )}

          {product.clinical_badge && !product.is_bestseller && (
            <span className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
              {product.clinical_badge}
            </span>
          )}

          {product.is_on_sale && (
            <Badge className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground text-[10px]">
              Sale {product.discount_percent ? `-${product.discount_percent}%` : ""}
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
              {product.brand}
            </p>
            <h3 className="font-heading text-sm font-semibold leading-tight text-foreground line-clamp-2">
              {title}
            </h3>
          </div>

          {product.pharmacist_note && (
            <div className="flex items-start gap-1.5 bg-secondary/50 rounded-md px-2.5 py-1.5 border border-border/30">
              <span className="text-accent text-xs mt-0.5 shrink-0">🔬</span>
              <p className="text-[11px] text-muted-foreground italic leading-snug line-clamp-2">
                {product.pharmacist_note}
              </p>
            </div>
          )}

          {product.key_ingredients && product.key_ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.key_ingredients.slice(0, 3).map((ing) => (
                <span key={ing} className="text-[10px] rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">
                  {ing}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={cn("h-3 w-3", star <= 4 ? "fill-accent text-accent" : "fill-accent/30 text-accent/30")} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-body">4.8</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground font-body">
              <span className="text-[10px] align-top font-medium text-muted-foreground">JOD</span>
              <span className="text-base font-semibold text-primary mx-0.5">{Math.floor(product.price)}</span>
              <span className="text-[10px] align-top font-medium text-muted-foreground">.{(product.price % 1).toFixed(2).split('.')[1]}</span>
            </span>
            {product.category && (
              <Badge variant="secondary" className="text-[10px]">
                {product.category}
              </Badge>
            )}
          </div>

          <Button
            size="sm"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs btn-ripple"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

export function SupabaseProductGrid({ products, isLoading, error, searchQuery }: SupabaseProductGridProps) {
  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive font-body">
        Something went wrong loading our catalog. Please try again.
      </div>
    );
  }

  if (isLoading) return <ProductGridSkeleton count={6} />;

  if (!products || products.length === 0) {
    return <EmptySearchState searchQuery={searchQuery} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <SupabaseProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <p className="text-sm text-muted-foreground font-body">
          Showing {products.length} products
        </p>
      </div>
    </>
  );
}
