import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ShopifyProduct } from "@/lib/shopify";
import type { ProductEnrichment } from "@/hooks/useProductEnrichment";
import { useCartStore } from "@/stores/cartStore";

interface Props {
  product: ShopifyProduct;
  enrichment?: ProductEnrichment | null;
}

export function ShopifyProductCard({ product, enrichment }: Props) {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const variant = node.variants.edges[0]?.node;

  const isGold = enrichment?.gold_stitch_tier ?? false;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <Link to={`/product/${node.handle}`}>
      <Card
        className={cn(
          "group overflow-hidden bg-card transition-all hover:-translate-y-1 h-full",
          isGold
            ? "border border-accent/60 hover:border-accent hover:shadow-[0_8px_30px_-8px_hsl(var(--accent)/0.35)]"
            : "border border-transparent hover:shadow-md hover:border-gold"
        )}
      >
        <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Package className="h-16 w-16 text-muted-foreground/40" />
          )}

          {/* Clinical Badge */}
          {enrichment?.clinical_badge && (
            <span className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
              <Shield className="h-3 w-3 text-primary" />
              {enrichment.clinical_badge}
            </span>
          )}

          {/* Gold Seal — Guaranteed Authenticity */}
          <div className="absolute top-3 right-3 z-10">
            <div className="h-7 w-7 flex items-center justify-center border border-accent bg-card/80 backdrop-blur-sm rounded-sm p-1" title="Guaranteed Authenticity">
              <svg viewBox="0 0 24 24" fill="none" className="text-accent h-full w-full">
                <path d="M12 2L14.5 7.5L20 9L15.5 13L17 18.5L12 15.5L7 18.5L8.5 13L4 9L9.5 7.5L12 2Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            {node.vendor && (
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {node.vendor}
              </p>
            )}
            <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
              {node.title}
            </h3>
          </div>

          {enrichment?.texture_profile && (
            <p className="text-[11px] italic text-muted-foreground">
              {enrichment.texture_profile}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </span>
            {node.productType && (
              <Badge variant="secondary" className="text-[10px]">
                {node.productType}
              </Badge>
            )}
          </div>

          {/* Enrichment badges */}
          {enrichment && (enrichment.ai_persona_lead || (enrichment.key_ingredients && enrichment.key_ingredients.length > 0)) && (
            <div className="space-y-2">
              {enrichment.ai_persona_lead && (
                <Badge variant="outline" className="text-[10px] font-medium border-accent/50">
                  {enrichment.ai_persona_lead === "dr_sami" ? "🔬 Dr. Sami" : "✨ Ms. Zain"}
                </Badge>
              )}
              {enrichment.key_ingredients && enrichment.key_ingredients.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {enrichment.key_ingredients.slice(0, 3).map((ing) => (
                    <span key={ing} className="text-[10px] rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            size="sm"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : !variant?.availableForSale ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
