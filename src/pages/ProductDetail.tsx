import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useProductEnrichment } from "@/hooks/useProductEnrichment";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingCart, Loader2, Package, Shield, CheckCircle2, Barcode } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useShopifyProduct(handle || "");
  const { data: enrichment } = useProductEnrichment(handle);
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <Package className="h-16 w-16 mb-4" />
          <p className="text-lg font-heading">Product not found</p>
          <Link to="/products">
            <Button variant="outline" className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { node } = product;
  const images = node.images.edges;
  const variants = node.variants.edges;
  const selectedVariant = variants[selectedVariantIdx]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {images[selectedImage]?.node ? (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || node.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      selectedImage === i ? "border-primary" : "border-border/50"
                    }`}
                  >
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {node.vendor && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {node.vendor}
              </p>
            )}
            <h1 className="font-heading text-3xl font-bold text-foreground">{node.title}</h1>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold text-foreground">
                {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
              </span>
              {enrichment?.condition && (
                <Badge variant="secondary" className="capitalize">
                  {enrichment.condition}
                </Badge>
              )}
              {enrichment?.availability_status && enrichment.availability_status !== 'in_stock' && (
                <Badge variant="outline" className="border-primary/50 text-primary capitalize">
                  {enrichment.availability_status === 'preorder' ? 'Pre-order' : 
                   enrichment.availability_status === 'backorder' ? 'Backorder' : 
                   enrichment.availability_status === 'out_of_stock' ? 'Out of Stock' : 
                   enrichment.availability_status}
                </Badge>
              )}
              {node.productType && (
                <Badge variant="secondary">{node.productType}</Badge>
              )}
              {enrichment?.clinical_badge && (
                <Badge variant="outline" className="gap-1">
                  <Shield className="h-3 w-3 text-primary" />
                  {enrichment.clinical_badge}
                </Badge>
              )}
              {enrichment?.ai_persona_lead && (
                <Badge variant="outline" className="border-accent/50">
                  {enrichment.ai_persona_lead === "dr_sami" ? "🔬 Dr. Sami Pick" : "✨ Ms. Zain Pick"}
                </Badge>
              )}
            </div>

            {enrichment?.texture_profile && (
              <p className="text-sm italic text-muted-foreground">
                Texture: {enrichment.texture_profile}
              </p>
            )}

            {/* Product Highlights */}
            {enrichment?.product_highlights && enrichment.product_highlights.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Highlights</p>
                <ul className="space-y-1.5">
                  {enrichment.product_highlights.map((h, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent mt-0.5">✦</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {node.description && (
              <p className="text-muted-foreground font-body leading-relaxed">
                {node.description}
              </p>
            )}

            {enrichment?.key_ingredients && enrichment.key_ingredients.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Key Ingredients</p>
                <div className="flex flex-wrap gap-1.5">
                  {enrichment.key_ingredients.map((ing) => (
                    <Badge key={ing} variant="secondary" className="text-xs">
                      {ing}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* GTIN / MPN — Authenticity Proof */}
            {(enrichment?.gtin || enrichment?.mpn) && (
              <div className="border border-border rounded-lg p-4 space-y-2 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Barcode className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium text-foreground">Authenticity Identifiers</p>
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent ml-auto" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  {enrichment.gtin && (
                    <div>
                      <span className="font-medium text-foreground">GTIN</span>
                      <p className="font-mono mt-0.5">{enrichment.gtin}</p>
                    </div>
                  )}
                  {enrichment.mpn && (
                    <div>
                      <span className="font-medium text-foreground">MPN</span>
                      <p className="font-mono mt-0.5">{enrichment.mpn}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Variant Selection */}
            {node.options.map((option) => (
              option.name !== "Title" && (
                <div key={option.name} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, i) => {
                      const optionValue = v.node.selectedOptions.find(o => o.name === option.name)?.value;
                      if (!optionValue) return null;
                      // Deduplicate
                      const alreadyShown = variants.slice(0, i).some(
                        prev => prev.node.selectedOptions.find(o => o.name === option.name)?.value === optionValue
                      );
                      if (alreadyShown) return null;

                      const isSelected = selectedVariant?.selectedOptions.find(
                        o => o.name === option.name
                      )?.value === optionValue;

                      return (
                        <Button
                          key={`${option.name}-${optionValue}`}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const idx = variants.findIndex(
                              vv => vv.node.selectedOptions.find(o => o.name === option.name)?.value === optionValue
                            );
                            if (idx >= 0) setSelectedVariantIdx(idx);
                          }}
                        >
                          {optionValue}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )
            ))}

            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={cartLoading || !selectedVariant?.availableForSale}
            >
              {cartLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !selectedVariant?.availableForSale ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Products
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link to="/">
              <span className="font-heading text-xl font-bold text-primary">Asper</span>
            </Link>
          </div>
          <CartDrawer />
        </div>
      </div>
    </nav>
  );
}

export default ProductDetail;
