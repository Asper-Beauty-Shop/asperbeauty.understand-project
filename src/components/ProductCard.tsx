import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";        
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { Heart, Sparkles, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; 
import { QuickViewModal } from "./QuickViewModal";        
import { translateTitle } from "@/lib/productUtils";      
import { formatJOD } from "@/lib/productImageUtils";      
import { OptimizedImage } from "./OptimizedImage";        
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ShopifyProduct;
}

const getDNATag = (node: ShopifyProduct["node"]) => {
  const tags = Array.isArray(node.tags) ? node.tags : [];
  if (tags.includes("best-seller") || tags.includes("bestseller"))
    return { label: "Bestseller", bg: "bg-polished-gold", color: "text-asper-ink" };
  if (tags.includes("new-arrival"))
    return { label: "New Arrival", bg: "bg-burgundy", color: "text-white" };
  return null;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { node } = product;
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { language, locale } = useLanguage();
  const isAr = locale === "ar";

  const isWishlistedItem = isInWishlist(node.id);
  const dnaTag = getDNATag(node);
  const firstImage = node.images?.edges?.[0]?.node;
  const price = node.priceRange?.minVariantPrice?.amount;
  const firstVariant = node.variants?.edges?.[0]?.node;
  const displayTitle = translateTitle(node.title || "", language);

  // Asper Execution: Clinical Benefit Line
  const clinicalBenefit = node.productType || "Dermatologist Approved";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });
    setCartOpen(true);
    toast.success(isAr ? "تم الإضافة إلى السلة" : "Added to bag", { position: "bottom-right" });
  };

  return (
    <>
      <div 
        className="group relative bg-white border border-border/40 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-polished-gold/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 1. Image & Interaction Overlay */}
        <Link to={`/product/${node.handle}`} className="block relative aspect-[4/5] bg-asper-stone-light overflow-hidden">
          <OptimizedImage
            src={firstImage?.url || "/editorial-showcase-2.jpg"}
            alt={node.title}
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          />
          
          {/* Shimmer Beam */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {dnaTag && (
              <span className={cn("text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 shadow-sm", dnaTag.bg, dnaTag.color)}>
                {dnaTag.label}
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product); }}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
          >
            <Heart className={cn("w-5 h-5", isWishlistedItem ? "fill-burgundy text-burgundy" : "text-asper-ink")} />
          </button>

          {/* Quick Add Button Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-burgundy hover:bg-burgundy-light text-white rounded-none h-12 uppercase tracking-[0.2em] text-xs font-bold"
            >
              {isAr ? "إضافة إلى السلة" : "Add to Bag"}
            </Button>
          </div>
        </Link>

        {/* 2. Content Block */}
        <div className="p-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-polished-gold font-bold mb-2">
            {node.vendor}
          </p>
          
          <h3 className="font-heading text-lg text-asper-ink mb-1 line-clamp-1">
            {displayTitle}
          </h3>

          {/* Clinical Benefit Line */}
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-4 font-semibold italic">
            {clinicalBenefit}
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className="font-body text-sm font-bold text-asper-ink">
              {formatJOD(parseFloat(price || "0"))}
            </span>
            {/* Rating Stars (Shiny Gold) */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-polished-gold text-polished-gold" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  );
};