import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Loader2, Shield, CheckCircle2, Leaf, Stethoscope, Droplets, Ban } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ShopifyProduct } from "@/lib/shopify";
import type { ProductEnrichment } from "@/hooks/useProductEnrichment";
import { useCartStore } from "@/stores/cartStore";
import { playAddToCartSound } from "@/lib/sounds";
import { BlurUpImage } from "@/components/BlurUpImage";

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
    playAddToCartSound();
    toast.success("Excellent choice", {
      description: `${node.title} added to your regimen.`,
      position: "top-center",
    });
  };

  return (
    <Link to={`/product/${node.handle}`}>
      <Card
        className={cn(
          "group overflow-hidden bg-card product-card-hover h-full shadow-maroon-glow hover:shadow-maroon-deep",
          isGold
            ? "border border-accent/60 hover:border-accent hover:shadow-[0_8px_30px_-8px_hsl(var(--accent)/0.35)]"
            : "border border-transparent hover:border-gold"
        )}
      >
        <div className="relative aspect-[3/4] bg-background flex items-center justify-center overflow-hidden">
          {image ? (
            <BlurUpImage
              src={image.url}
              alt={image.altText || node.title}
              className="p-4 transition-transform duration-700 group-hover:scale-105"
              containerClassName="h-full w-full"
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

          {/* Condition + Availability badges */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
            <div className="h-7 w-7 flex items-center justify-center border border-accent bg-card/80 backdrop-blur-sm rounded-sm p-1" title="Guaranteed Authenticity">
              <svg viewBox="0 0 24 24" fill="none" className="text-accent h-full w-full">
                <path d="M12 2L14.5 7.5L20 9L15.5 13L17 18.5L12 15.5L7 18.5L8.5 13L4 9L9.5 7.5L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            {enrichment?.condition && enrichment.condition !== 'new' && (
              <span className="rounded-full bg-muted/90 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground capitalize">
                {enrichment.condition}
              </span>
            )}
          </div>

          {/* Availability overlay for non-standard statuses */}
          {enrichment?.availability_status && enrichment.availability_status !== 'in_stock' && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge variant="secondary" className="text-[9px] font-medium bg-primary/90 text-primary-foreground">
                {enrichment.availability_status === 'preorder' ? 'Pre-order' : 
                 enrichment.availability_status === 'backorder' ? 'Backorder' : 
                 enrichment.availability_status === 'out_of_stock' ? 'Out of Stock' : 
                 enrichment.availability_status}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            {node.vendor && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
                {node.vendor}
              </p>
            )}
            <h3 className="font-heading text-sm font-semibold leading-tight text-foreground line-clamp-2">
              {node.title}
            </h3>
          </div>

          {/* Pharmacist Note — "Why it's here" */}
          {enrichment?.pharmacist_note && (
            <div className="flex items-start gap-1.5 bg-secondary/50 rounded-md px-2.5 py-1.5 border border-border/30">
              <span className="text-accent text-xs mt-0.5 shrink-0">
                {enrichment.ai_persona_lead === "ms_zain" ? "✨" : "🔬"}
              </span>
              <p className="text-[11px] text-muted-foreground italic leading-snug line-clamp-2">
                {enrichment.pharmacist_note}
              </p>
            </div>
          )}

          {enrichment?.texture_profile && (
            <p className="text-[11px] italic text-muted-foreground">
              {enrichment.texture_profile}
            </p>
          )}

          {enrichment?.product_highlights && enrichment.product_highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {enrichment.product_highlights.slice(0, 3).map((h, i) => {
                const lh = h.toLowerCase();
                const Icon = lh.includes("paraben") || lh.includes("free") ? Ban
                  : lh.includes("vegan") || lh.includes("organic") || lh.includes("natural") ? Leaf
                  : lh.includes("doctor") || lh.includes("clinical") || lh.includes("dermat") ? Stethoscope
                  : lh.includes("hydrat") || lh.includes("moistur") ? Droplets
                  : CheckCircle2;
                return (
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground border border-border/50">
                    <Icon className="h-2.5 w-2.5 text-accent shrink-0" />
                    <span className="line-clamp-1">{h}</span>
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-foreground font-body">
              <span className="text-[10px] align-top font-medium text-muted-foreground">{price.currencyCode}</span>
              <span className="text-base font-semibold text-primary mx-0.5">{parseFloat(price.amount).toFixed(2).split('.')[0]}</span>
              <span className="text-[10px] align-top font-medium text-muted-foreground">.{parseFloat(price.amount).toFixed(2).split('.')[1]}</span>
            </span>
            <div className="flex items-center gap-1.5">
              {enrichment?.gtin && (
                <span className="flex items-center gap-0.5 text-[9px] text-accent" title={`GTIN: ${enrichment.gtin}`}>
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Verified
                </span>
              )}
              {node.productType && (
                <Badge variant="secondary" className="text-[10px]">
                  {node.productType}
                </Badge>
              )}
            </div>
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

          {variant?.availableForSale ? (
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs btn-ripple"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toast.success("We'll notify you!", {
                    description: "You'll get an alert when this item is back in stock.",
                    position: "top-center",
                  });
                }}
              >
                🔔 Notify Me
              </Button>
              <p className="text-[10px] text-muted-foreground italic font-body text-center">
                🔬 Dr. Sami suggests a similar alternative
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
