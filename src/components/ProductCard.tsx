import { useState, useRef } from "react";
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

  const prefetchedRef = useRef(false);
  const prefetchProductDetail = () => {
    if (!prefetchedRef.current) {
      prefetchedRef.current = true;
      import("@/pages/ProductDetail").catch(() => { prefetchedRef.current = false; });
    }
  };

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
  const isOutOfStock = firstVariant ? !firstVariant.availableForSale : false;
  const discountPct = hasDiscount
    ? Math.round((1 - parseFloat(price || "0") / parseFloat(comparePrice!)) * 100)
    : 0;
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
        onMouseEnter={() => { setIsHovered(true); prefetchProductDetail(); }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative bg-asper-stone overflow-hidden transition-all duration-300 border border-border/60 hover:border-polished-gold/40 p-5 ${isOutOfStock ? "opacity-60" : ""}`}>
          {/* Clinical Shimmer Beam */}
          <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-[20deg] pointer-events-none z-20 group-hover:left-[150%] transition-all duration-700 ease-in-out" />

          {isOutOfStock && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-body font-semibold px-2.5 py-1 tracking-wider uppercase bg-muted-foreground/70 text-polished-white">
                {language === "ar" ? "نفد المخزون" : "Out of Stock"}
              </span>
            </div>
          )}
          {!isOutOfStock && discountPct > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-body font-semibold px-2.5 py-1 tracking-wider uppercase bg-polished-gold text-dark-charcoal">
                -{discountPct}%
              </span>
            </div>
          )}
          {!isOutOfStock && !discountPct && dnaTag && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-body font-semibold px-2.5 py-1 tracking-wider uppercase bg-burgundy text-polished-white">
                {dnaTag.label}
              </span>
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlistedItem
              ? (language === "ar" ? "إزالة من المفضلة" : "Remove from wishlist")
              : (language === "ar" ? "إضافة إلى المفضلة" : "Add to wishlist")}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-polished-white/80 backdrop-blur-sm transition-all hover:bg-polished-white shadow-sm"
          >
            <Heart className={`w-4 h-4 transition-colors ${isWishlistedItem ? "fill-burgundy text-burgundy" : "text-muted-foreground hover:text-burgundy"}`} />
          </button>
          {isVerified && (
            <div className="absolute top-4 right-14 z-10">
              <Badge className="bg-asper-stone text-polished-gold border border-polished-gold/40 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                Verified
              </Badge>
            </div>
          )}

          {/* Image — taller aspect for elegance */}
          <div className="aspect-[5/6] overflow-hidden bg-polished-white mb-4">
            {firstImage ? (
              <OptimizedImage
                src={displayImage?.url || firstImage.url}
                alt={displayImage?.altText || firstImage.altText || node.title || ""}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <Sparkles className="w-8 h-8 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Typography Hierarchy — Inline · Separator */}
          <div className="space-y-1.5">
            {node.vendor && (
              <p className="text-[10px] uppercase tracking-[0.15em] text-polished-gold font-body font-semibold truncate">
                {node.vendor}
              </p>
            )}
            <h3 className="font-display text-[15px] leading-relaxed text-asper-ink font-semibold line-clamp-2">
              {displayTitle}
              <span className="text-polished-gold mx-1 font-bold">&middot;</span>
              <span className="font-body text-[13px] font-normal italic text-muted-foreground">
                {keyBenefit}
              </span>
            </h3>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm font-body font-bold text-burgundy">
                {formatJOD(parseFloat(price || "0"))}
              </span>
              {hasDiscount && (
                <span className="text-xs line-through text-muted-foreground">
                  {formatJOD(parseFloat(comparePrice))}
                </span>
              )}
            </div>

            {/* Conversion CTA — appears on hover */}
            <div className={`pt-3 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-2.5 text-xs font-body font-semibold uppercase tracking-wider text-polished-white bg-burgundy transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isOutOfStock
                  ? (language === "ar" ? "نفد المخزون" : "Out of Stock")
                  : (language === "ar" ? "إضافة إلى النظام" : "Add to Regimen")}
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
                className="w-full text-center text-[11px] mt-2 font-body font-medium text-muted-foreground transition-colors hover:text-burgundy"
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


