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
      >
        <div
          className="relative bg-white rounded-lg overflow-hidden transition-all duration-300 border border-transparent hover:border-[#C5A028]/30"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
        >
          {dnaTag && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
                style={{ backgroundColor: dnaTag.bg, color: dnaTag.color, fontFamily: "Montserrat, sans-serif" }}
              >
                {dnaTag.label}
              </span>
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlistedItem
              ? (language === "ar" ? "إزالة من المفضلة" : "Remove from wishlist")
              : (language === "ar" ? "إضافة إلى المفضلة" : "Add to wishlist")}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white shadow-sm"
          >
            <Heart className={`w-4 h-4 transition-colors ${isWishlistedItem ? "fill-[#800020] text-[#800020]" : "text-gray-400 hover:text-[#800020]"}`} />
          </button>
          {isVerified && (
            <div className="absolute top-3 right-12 z-10">
              <Badge className="bg-[#F8F8FF] text-[#C5A028] border border-[#C5A028]/40 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                Verified
              </Badge>
            </div>
          )}
          <div className="aspect-square overflow-hidden bg-gray-50">
            {firstImage ? (
              <OptimizedImage
                src={displayImage?.url || firstImage.url}
                alt={displayImage?.altText || firstImage.altText || node.title || ""}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Sparkles className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>
          <div className="p-4">
            {node.vendor && (
              <p className="text-[10px] uppercase tracking-widest mb-1 truncate"
                style={{ color: "#333333", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                {node.vendor}
              </p>
            )}
            <h3 className="text-sm leading-snug mb-1 line-clamp-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a1a", fontWeight: 600 }}>
              {displayTitle}
            </h3>
            <p className="text-[11px] mb-3 truncate" style={{ color: "#888", fontFamily: "Montserrat, sans-serif" }}>
              {keyBenefit}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold" style={{ color: "#800020", fontFamily: "Montserrat, sans-serif" }}>
                {formatJOD(parseFloat(price || "0"))}
              </span>
              {hasDiscount && (
                <span className="text-xs line-through text-gray-400">
                  {formatJOD(parseFloat(comparePrice))}
                </span>
              )}
            </div>
            <div className={`transition-all duration-200 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
              <button
                onClick={handleAddToCart}
                className="w-full py-2 text-xs font-semibold text-white rounded-md transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#800020", fontFamily: "Montserrat, sans-serif", borderRadius: "6px" }}
              >
                {language === "ar" ? "إضافة إلى النظام" : "Add to Regimen"}
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
                className="w-full text-center text-[11px] mt-2 font-medium transition-colors hover:text-[#800020]"
                style={{ color: "#888", fontFamily: "Montserrat, sans-serif" }}
              >
                View Ingredients
              </button>
            </div>
          </div>
        </div>
      </Link>
      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  );
};
