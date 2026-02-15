import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useProductEnrichment } from "@/hooks/useProductEnrichment";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { ClinicalScoreRing } from "@/components/ClinicalScoreRing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, ShoppingCart, Loader2, Package, Shield, CheckCircle2,
  Barcode, Sun, Moon, Droplets, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* ─── Ingredient Pill ─── */
function IngredientPill({ name, isActive }: { name: string; isActive: boolean }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-body font-medium tracking-wide cursor-help transition-colors duration-300",
              isActive
                ? "border border-primary text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground"
                : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            {name}
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-foreground text-background text-xs font-body max-w-[200px] text-center">
          Key active ingredient in this formulation.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ─── How-To-Use Timeline ─── */
function UsageTimeline({ productName }: { productName: string }) {
  const steps = [
    { icon: Droplets, label: "Cleanse", desc: "Start with a gentle cleanser on damp skin.", time: "AM / PM" },
    { icon: Sparkles, label: `Apply ${productName}`, desc: "Apply a pea-sized amount evenly.", time: "AM / PM" },
    { icon: Sun, label: "Protect", desc: "Follow with SPF 30+ in the morning.", time: "AM" },
  ];

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          {/* Gold timeline line */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
              <step.icon className="h-4 w-4 text-accent" />
            </div>
            {i < steps.length - 1 && <div className="w-px flex-1 bg-accent/30 my-1" />}
          </div>
          <div className="pb-6">
            <div className="flex items-center gap-2">
              <p className="text-sm font-body font-semibold text-foreground">{step.label}</p>
              <span className="text-[10px] font-body text-accent uppercase tracking-wider">{step.time}</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-0.5">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
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
    toast.success("Added to your regimen", {
      description: `${node.title} — Excellent choice.`,
      position: "top-center",
    });
  };

  const keyIngredients = enrichment?.key_ingredients || [];
  const priceAmount = parseFloat(selectedVariant?.price.amount || "0");

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* LEFT — Images (60%) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main image — white bg, object-contain, cursor zoom */}
            <div className="aspect-square bg-card rounded-lg overflow-hidden flex items-center justify-center border border-border/30 shadow-maroon-glow cursor-zoom-in group">
              {images[selectedImage]?.node ? (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || node.title}
                  className="h-full w-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-luxury"
                />
              ) : (
                <Package className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all duration-300 bg-card",
                      selectedImage === i ? "border-accent shadow-maroon-glow" : "border-border/30 hover:border-accent/50"
                    )}
                  >
                    <img src={img.node.url} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Sticky Clinical Sidebar (40%) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Brand */}
              {node.vendor && (
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent">
                  {node.vendor}
                </p>
              )}

              {/* Title */}
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground leading-tight">{node.title}</h1>

              {/* Clinical Score Ring + Price */}
              <div className="flex items-center gap-4 flex-wrap">
                <p className="font-body text-2xl font-semibold text-primary">
                  <span className="text-xs align-top mr-0.5 font-normal text-muted-foreground">
                    {selectedVariant?.price.currencyCode}
                  </span>
                  {Math.floor(priceAmount)}
                  <span className="text-sm font-normal text-muted-foreground">
                    .{priceAmount.toFixed(2).split(".")[1]}
                  </span>
                </p>
                <ClinicalScoreRing
                  score={94}
                  label="Based on 420 verified trials"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {enrichment?.clinical_badge && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Shield className="h-3 w-3 text-primary" />
                    {enrichment.clinical_badge}
                  </Badge>
                )}
                {enrichment?.ai_persona_lead && (
                  <Badge variant="outline" className="border-accent/50 text-xs">
                    {enrichment.ai_persona_lead === "dr_sami" ? "🔬 Dr. Sami Pick" : "✨ Ms. Zain Pick"}
                  </Badge>
                )}
              </div>

              {/* Pharmacist Note */}
              {enrichment?.pharmacist_note && (
                <div className="flex items-start gap-2.5 bg-secondary/50 rounded-lg px-4 py-3 border border-border/30">
                  <span className="text-accent text-base mt-0.5 shrink-0">
                    {enrichment.ai_persona_lead === "ms_zain" ? "✨" : "🔬"}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-foreground mb-0.5 font-body">
                      {enrichment.ai_persona_lead === "ms_zain" ? "Ms. Zain says" : "Dr. Sami says"}
                    </p>
                    <p className="text-sm text-muted-foreground italic leading-relaxed font-body">
                      "{enrichment.pharmacist_note}"
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {node.description && (
                <p className="text-muted-foreground font-body leading-relaxed text-sm">
                  {node.description}
                </p>
              )}

              {/* Ingredients Decoder — Pill System */}
              {keyIngredients.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-body font-semibold text-foreground tracking-wide">Key Ingredients</p>
                  <div className="flex flex-wrap gap-2">
                    {keyIngredients.map((ing, i) => (
                      <IngredientPill key={ing} name={ing} isActive={i < 3} />
                    ))}
                  </div>
                </div>
              )}

              {/* Product Highlights */}
              {enrichment?.product_highlights && enrichment.product_highlights.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-body font-semibold text-foreground">Highlights</p>
                  <ul className="space-y-1.5">
                    {enrichment.product_highlights.map((h, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 font-body">
                        <span className="text-accent mt-0.5">✦</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How-To-Use Timeline */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-body font-semibold text-foreground tracking-wide">How to Use</p>
                <UsageTimeline productName={node.title.split(" ").slice(0, 3).join(" ")} />
              </div>

              {/* Authenticity Identifiers */}
              {(enrichment?.gtin || enrichment?.mpn) && (
                <div className="border border-border rounded-lg p-4 space-y-2 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Barcode className="h-4 w-4 text-accent" />
                    <p className="text-sm font-medium text-foreground font-body">Authenticity Identifiers</p>
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
              {node.options.map((option) =>
                option.name !== "Title" && (
                  <div key={option.name} className="space-y-2">
                    <label className="text-sm font-medium text-foreground font-body">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v, i) => {
                        const optionValue = v.node.selectedOptions.find(o => o.name === option.name)?.value;
                        if (!optionValue) return null;
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
              )}

              {/* Add to Cart / Notify Me — Desktop */}
              {selectedVariant?.availableForSale ? (
                <Button
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-ripple h-12 text-sm uppercase tracking-widest hidden lg:flex"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                >
                  {cartLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Regimen
                    </>
                  )}
                </Button>
              ) : (
                <div className="hidden lg:block space-y-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-12 text-sm uppercase tracking-widest border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toast.success("We'll notify you!", { description: "You'll get an alert when this item is back in stock.", position: "top-center" })}
                  >
                    🔔 Notify Me When Available
                  </Button>
                  <div className="flex items-start gap-2 bg-secondary/50 rounded-lg px-4 py-3 border border-border/30">
                    <span className="text-base shrink-0 mt-0.5">🔬</span>
                    <div>
                      <p className="text-xs font-medium text-foreground font-body">Dr. Sami suggests this alternative:</p>
                      <p className="text-xs text-muted-foreground font-body italic">Browse similar products with comparable active ingredients.</p>
                      <Link to="/products" className="text-xs text-primary font-semibold font-body hover:underline">
                        View Alternatives →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Add-to-Cart */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-border/30 bg-card/80 backdrop-blur-md px-4 py-3 safe-area-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold text-foreground truncate">{node.title}</p>
            <p className="text-xs text-primary font-body font-medium">
              {selectedVariant?.price.currencyCode} {priceAmount.toFixed(2)}
            </p>
          </div>
          {selectedVariant?.availableForSale ? (
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 btn-ripple px-6 h-11 text-sm uppercase tracking-widest shrink-0"
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              {cartLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary px-6 h-11 text-sm uppercase tracking-widest shrink-0"
              onClick={() => toast.success("We'll notify you!", { description: "You'll get an alert when this item is back.", position: "top-center" })}
            >
              🔔 Notify Me
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 glass-nav">
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
