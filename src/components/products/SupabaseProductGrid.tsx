/**
 * Elite Grid — Premium editorial product grid for Asper Beauty Shop.
 * Uses generous spacing, staggered framer-motion entrance, slow-fade hover,
 * slide-up "Add to Bag", skeleton loaders in Soft Ivory, and tracked brand typography.
 */
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, Heart, ShoppingBag, Package, Stethoscope, Sparkles, ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlurUpImage } from "@/components/BlurUpImage";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatJOD } from "@/lib/productImageUtils";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { useState } from "react";

type Product = Tables<"products">;

// ─── Animation Constants ───
const LUXURY_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: LUXURY_EASE, delay: i * 0.08 },
  }),
};

const REDUCED_MOTION_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

// ─── Skeleton ───
function EliteSkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="bg-card border border-border/30 overflow-hidden"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="aspect-[3/4] w-full bg-secondary animate-skeleton-breathe" />
      <div className="p-5 md:p-6 space-y-3">
        <div className="h-2.5 w-16 bg-secondary rounded-sm animate-skeleton-breathe" style={{ animationDelay: `${index * 0.12 + 0.1}s` }} />
        <div className="h-4 w-3/4 bg-secondary rounded-sm animate-skeleton-breathe" style={{ animationDelay: `${index * 0.12 + 0.15}s` }} />
        <div className="h-3 w-1/2 bg-secondary rounded-sm animate-skeleton-breathe" style={{ animationDelay: `${index * 0.12 + 0.2}s` }} />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-14 rounded-full bg-secondary animate-skeleton-breathe" />
          <div className="h-5 w-18 rounded-full bg-secondary animate-skeleton-breathe" />
        </div>
        <div className="h-4 w-20 bg-secondary rounded-sm animate-skeleton-breathe" />
      </div>
    </div>
  );
}

export function EliteGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-6 md:gap-10 lg:gap-12 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <EliteSkeletonCard key={i} index={i} />
      ))}
    </div>
  );
}

// ─── Product Card ───
interface SupabaseProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  error: unknown;
  searchQuery?: string;
  /** If true, first product spans 2 cols (editorial hero) */
  editorialHero?: boolean;
  columns?: 3 | 4;
}

function EliteProductCard({ product, index, featured = false }: { product: Product; index: number; featured?: boolean }) {
  const handle = product.handle || product.id;
  const title = product.title || product.name;
  const imageUrl = product.image_url;
  const navigate = useNavigate();
  const { language } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const prefersReducedMotion = useReducedMotion();
  const [wishlist, setWishlist] = useState(false);

  const discount = product.original_price && product.is_on_sale
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product: {
        node: {
          id: product.id,
          title: title,
          handle: handle,
          description: product.description || "",
          vendor: product.brand || "",
          productType: product.category || "",
          images: { edges: imageUrl ? [{ node: { url: imageUrl, altText: title } }] : [] },
          priceRange: {
            minVariantPrice: { amount: product.price.toString(), currencyCode: "JOD" },
          },
          compareAtPriceRange: product.original_price ? {
            maxVariantPrice: { amount: product.original_price.toString(), currencyCode: "JOD" },
          } : null,
          variants: { edges: [{ node: { id: `${product.id}-default`, title: "Default", price: { amount: product.price.toString(), currencyCode: "JOD" }, compareAtPrice: null, availableForSale: true, selectedOptions: [] } }] },
          options: [],
          tags: [],
        },
      },
      variantId: `${product.id}-default`,
      variantTitle: "Default",
      price: { amount: product.price.toString(), currencyCode: "JOD" },
      quantity: 1,
      selectedOptions: [],
    });
    toast.success(language === "ar" ? "تمت الإضافة إلى الحقيبة" : "Added to bag", {
      description: title,
      position: "top-center",
    });
    setCartOpen(true);
  };

  return (
    <motion.div
      custom={index}
      variants={prefersReducedMotion ? REDUCED_MOTION_VARIANTS : CARD_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "group relative flex flex-col overflow-hidden bg-card",
        // Subtle gold framing — 1px border, not heavy shadows
        "border border-border/40 hover:border-accent/30",
        "transition-all duration-500 ease-in-out",
        "hover:shadow-[0_12px_48px_-12px_hsl(var(--accent)/0.12)]",
        product.gold_stitch_tier && "border-accent/50 hover:border-accent",
        featured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Image Area */}
      <Link to={`/product/${handle}`} className="block relative">
        <div className={cn(
          "relative overflow-hidden bg-secondary/30",
          featured ? "aspect-[3/2] md:aspect-[16/10]" : "aspect-[3/4]"
        )}>
          {imageUrl ? (
            <BlurUpImage
              src={imageUrl}
              alt={title}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
              containerClassName="h-full w-full"
              blurAmount={15}
              transitionDuration={400}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Slow-fade hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges — top-left */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.is_bestseller && (
              <span className="flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em]">
                <Sparkles className="h-3 w-3" />
                Bestseller
              </span>
            )}
            {product.clinical_badge && !product.is_bestseller && (
              <span className="bg-card/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-medium text-foreground">
                {product.clinical_badge}
              </span>
            )}
          </div>

          {/* Sale badge — top-right */}
          {discount && discount > 0 && (
            <span className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground px-2.5 py-1 text-[9px] font-bold">
              -{discount}%
            </span>
          )}

          {/* Hover Quick Actions — slides up from bottom */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
            <button
              onClick={(e) => { e.preventDefault(); navigate(`/product/${handle}`); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-card/95 backdrop-blur-sm text-foreground font-body text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              <Eye className="w-3.5 h-3.5" />
              {language === "ar" ? "عرض" : "View"}
            </button>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary/95 backdrop-blur-sm text-primary-foreground font-body text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-colors duration-300"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {language === "ar" ? "أضيفي" : "Add"}
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlist((v) => !v); }}
            className={cn(
              "absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center",
              "bg-card/10 backdrop-blur-sm border border-card/20",
              "opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:bg-card hover:border-transparent",
              discount && discount > 0 ? "top-10" : "top-3"
            )}
            aria-label="Toggle wishlist"
          >
            <Heart className={cn("w-4 h-4 transition-colors duration-200", wishlist ? "fill-primary text-primary" : "text-card")} />
          </button>

          {/* Mobile quick-add */}
          <button
            className="absolute bottom-2 right-2 md:hidden bg-primary text-primary-foreground p-2.5 shadow-lg active:scale-[0.95] transition-transform"
            onClick={handleAddToCart}
            aria-label={language === "ar" ? "أضف إلى الحقيبة" : "Add to Bag"}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </Link>

      {/* Content Area — Clinical Luxury Typography */}
      <Link to={`/product/${handle}`} className="flex flex-col flex-1 p-4 md:p-6">
        {/* Brand — tracked-out uppercase */}
        <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-1.5">
          {product.brand}
        </p>

        {/* Title — elegant, truncated */}
        <h3 className={cn(
          "font-display leading-tight text-foreground line-clamp-2 mb-2 flex-1",
          featured ? "text-base md:text-lg" : "text-sm md:text-[15px]"
        )}>
          {title}
        </h3>

        {/* Pharmacist note */}
        {product.pharmacist_note && (
          <div className="flex items-start gap-1.5 mb-2">
            <span className="text-accent text-[10px] mt-0.5 shrink-0">🔬</span>
            <p className="text-[10px] text-muted-foreground italic leading-snug line-clamp-1">
              {product.pharmacist_note}
            </p>
          </div>
        )}

        {/* Key ingredients pills */}
        {product.key_ingredients && product.key_ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {product.key_ingredients.slice(0, 3).map((ing) => (
              <span key={ing} className="text-[9px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                {ing}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={cn("h-2.5 w-2.5", star <= 4 ? "fill-accent text-accent" : "fill-accent/25 text-accent/25")} />
          ))}
          <span className="text-[9px] text-muted-foreground ml-0.5">4.8</span>
        </div>

        {/* Pricing — Deep Maroon accent */}
        <div className="flex items-center gap-2 mt-auto">
          {product.is_on_sale && product.original_price && (
            <span className="font-body text-[11px] text-muted-foreground line-through">
              {formatJOD(product.original_price)}
            </span>
          )}
          <span className={cn(
            "font-body font-semibold text-sm md:text-base",
            product.is_on_sale ? "text-destructive" : "text-primary"
          )}>
            {formatJOD(product.price)}
          </span>
        </div>
      </Link>

      {/* Desktop: Slide-up "Add to Bag" bar */}
      <div
        className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] bg-primary text-primary-foreground py-3.5 text-center cursor-pointer uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-primary/90 active:scale-[0.98]"
        onClick={handleAddToCart}
      >
        {language === "ar" ? "أضيفي إلى الحقيبة" : "Add to Bag"}
      </div>
    </motion.div>
  );
}

// ─── Empty State ───
function EmptySearchState({ searchQuery }: { searchQuery?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 md:py-28 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 flex items-center justify-center bg-secondary border border-accent/30">
          <Stethoscope className="h-8 w-8 text-accent" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent flex items-center justify-center shadow-md">
          <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
        </div>
      </div>
      <h3 className="font-display text-xl md:text-2xl text-foreground mb-2">
        {searchQuery ? `No matches for "${searchQuery}"` : "No products found"}
      </h3>
      <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-md mx-auto mb-8">
        <span className="font-semibold text-accent">🔬 Dr. Sami recommends:</span>{" "}
        "Try adjusting your filters or browse our full collection."
      </p>
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-body text-[11px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors duration-300"
      >
        <Sparkles className="h-4 w-4" />
        Browse All Products
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ─── Grid ───
export function SupabaseProductGrid({
  products,
  isLoading,
  error,
  searchQuery,
  editorialHero = false,
  columns = 4,
}: SupabaseProductGridProps) {
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 text-sm text-destructive font-body">
        Something went wrong loading our catalog. Please try again.
      </div>
    );
  }

  if (isLoading) return <EliteGridSkeleton count={columns === 3 ? 6 : 8} />;

  if (!products || products.length === 0) {
    return <EmptySearchState searchQuery={searchQuery} />;
  }

  const gridCols = columns === 3
    ? "grid-cols-2 lg:grid-cols-3"
    : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <>
      <div className={cn(
        "grid auto-rows-auto",
        // Elite spacing — generous gaps that let products breathe
        "gap-6 md:gap-10 lg:gap-12",
        gridCols
      )}>
        {products.map((product, i) => (
          <EliteProductCard
            key={product.id}
            product={product}
            index={i}
            featured={editorialHero && i === 0}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <p className="text-[11px] text-muted-foreground font-body uppercase tracking-[0.15em]">
          Showing {products.length} products
        </p>
      </div>
    </>
  );
}

// Re-export skeleton for external use
export { EliteGridSkeleton as ProductGridSkeleton };
