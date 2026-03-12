import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuickViewModal } from "./QuickViewModal";
import { translateTitle } from "@/lib/productUtils";
import { formatJOD } from "@/lib/productImageUtils";
import { OptimizedImage } from "./OptimizedImage";

interface ProductCardProps {
  product: ShopifyProduct;
}

const getDNATag = (node: ShopifyProduct["node"]) => {
  const tags = Array.isArray(node.tags) ? node.tags : [];
  const vendor = (node.vendor || "").toLowerCase();
  if (tags.includes("best-seller") || tags.includes("bestseller"))
    return { label: "Best Seller", bg: "#800020", color: "#fff" };
  if (tags.includes("organic"))
    return { label: "Organic", bg: "#2D6A4F", color: "#fff" };
  if (tags.includes("dermatologist") || vendor.includes("cerave") || vendor.includes("la roche"))
    return { label: "Dermatologist Tested", bg: "#C5A028", color: "#fff" };
  if (tags.includes("new-arrival"))
    return { label: "New Arrival", bg: "#800020", color: "#fff" };
  return null;
};

const getKeyBenefit = (node: ShopifyProduct["node"]) => {
  const type = (node.productType || "").toLowerCase();
  if (type.includes("serum")) return "Advanced Treatment Serum";
  if (type.includes("moisturizer")) return "Hydration & Repair";
  if (type.includes("cleanser")) return "Gentle Daily Cleansing";
  if (type.includes("sunscreen") || type.includes("spf")) return "Broad Spectrum UV Protection";
  if (type.includes("toner")) return "Balancing & Pore-Refining";
  if (type.includes("eye")) return "Targeted Eye Treatment";
  if (type.includes("supplement")) return "Clinical Nutritional Support";
  return "Clinically Formulated";
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { node } = product;
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { language } = useLanguage();

  const isWishlistedItem = isInWishlist(node.id);
  const dnaTag = getDNATag(node);
  const keyBenefit = getKeyBenefit(node);
  const firstImage = node.images?.edges?.[0]?.node;
  const secondImage = node.images?.edges?.[1]?.node;
  const displayImage = isHovered && secondImage ? secondImage : firstImage;
  const price = node.priceRange?.minVariantPrice?.amount;
  const firstVariant = node.variants?.edges?.[0]?.node;
  const comparePrice = firstVariant?.compareAtPrice?.amount;
  const hasDiscount = comparePrice && parseFloat(comparePrice) > parseFloat(price || "0");
  const isVerified = node.tags?.includes("authentic") || node.tags?.includes("verified");
  const displayTitle = translateTitle(node.title || "", language);

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
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (!isWishlistedItem) {
      toast.success("Added to wishlist", { description: node.title, position: "top-center" });
    }
  };

   return (
    <>
      <Link
        to={`/product/${node.handle}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`product-link-${node.handle}`}
      >
        <div 
          className="relative bg-asper-stone overflow-hidden transition-all duration-500 border border-border/60 hover:border-polished-gold/40 p-6 shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(128,0,32,0.1)]"
          data-testid={`product-card-${node.id}`}
        >
          {/* Clinical Shimmer Beam */}
          <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-[20deg] pointer-events-none z-20 group-hover:left-[150%] transition-all duration-1000 ease-in-out" />

          {dnaTag && (
            <div className="absolute top-6 left-6 z-10">
              <span className="text-[10px] font-body font-bold px-3 py-1.5 tracking-wider uppercase bg-burgundy text-polished-white shadow-sm">
                {dnaTag.label}
              </span>
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlistedItem
              ? (language === "ar" ? "إزالة من المفضلة" : "Remove from wishlist")
              : (language === "ar" ? "إضافة إلى المفضلة" : "Add to wishlist")}
            className="absolute top-6 right-6 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-polished-white/90 backdrop-blur-md transition-all hover:bg-polished-white shadow-md active:scale-90"
            data-testid="wishlist-toggle"
          >
            <Heart className={`w-4.5 h-4.5 transition-colors ${isWishlistedItem ? "fill-burgundy text-burgundy" : "text-muted-foreground hover:text-burgundy"}`} />
          </button>
          {isVerified && (
            <div className="absolute top-6 right-16 z-10">
              <Badge className="bg-asper-stone/80 backdrop-blur-sm text-polished-gold border border-polished-gold/40 text-[9px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
                Verified
              </Badge>
            </div>
          )}

          {/* Image — taller aspect for elegance */}
          <div className="aspect-[5/6] overflow-hidden bg-polished-white mb-6 relative">
            {firstImage ? (
              <OptimizedImage
                src={displayImage?.url || firstImage.url}
                alt={displayImage?.altText || firstImage.altText || node.title || ""}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <Sparkles className="w-10 h-10 text-muted-foreground/20" />
              </div>
            )}
            {/* Subtle overlay on image */}
            <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/5 transition-colors duration-500" />
          </div>

          {/* Typography Hierarchy — Inline · Separator */}
          <div className="space-y-2">
            {node.vendor && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-polished-gold font-body font-bold truncate">
                {node.vendor}
              </p>
            )}
            <h3 className="font-display text-base leading-relaxed text-asper-ink font-semibold line-clamp-2 min-h-[3.5rem]">
              {displayTitle}
              <span className="text-polished-gold mx-1.5 font-bold">&middot;</span>
              <span className="font-body text-[13px] font-normal italic text-muted-foreground tracking-tight">
                {keyBenefit}
              </span>
            </h3>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-lg font-body font-bold text-burgundy tracking-tight">
                {formatJOD(parseFloat(price || "0"))}
              </span>
              {hasDiscount && (
                <span className="text-sm line-through text-muted-foreground opacity-60">
                  {formatJOD(parseFloat(comparePrice))}
                </span>
              )}
            </div>

            {/* Conversion CTA — appears on hover */}
            <div className={`pt-4 transition-all duration-500 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 text-[11px] font-body font-bold uppercase tracking-[0.15em] text-polished-white bg-burgundy transition-all hover:bg-asper-ink shadow-lg active:scale-95"
                data-testid="add-to-cart-button"
              >
                {language === "ar" ? "إضافة إلى النظام" : "Add to Regimen"}
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
                className="w-full text-center text-[10px] mt-3 font-body font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-burgundy"
                data-testid="quick-view-button"
              >
                {language === "ar" ? "عرض المكونات" : "View Ingredients"}
              </button>
            </div>
          </div>
        </div>
      </Link>
      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  );
};


