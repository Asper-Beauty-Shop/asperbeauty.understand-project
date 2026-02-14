import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export function ShopifyProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const variant = node.variants.edges[0]?.node;

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
      <Card className="group overflow-hidden border border-transparent bg-card transition-all hover:shadow-md hover:-translate-y-1 hover:border-gold h-full">
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
