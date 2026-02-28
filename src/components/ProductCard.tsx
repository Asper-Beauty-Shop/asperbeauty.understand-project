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

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { node } = product;
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { t, language } = useLanguage();

  const isWishlisted = isInWishlist(node.id);

  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  // Check for badges based on tags
  const tags = node.tags ?? [];
  const isBestseller = Array.isArray(tags)
    ? tags.some((tag: string) => tag.toLowerCase().includes("bestseller"))
    : typeof tags === "string" && tags.toLowerCase().includes("bestseller");

  // Check if product is new (created within last 30 days)
  const createdAt = node.createdAt ?? null;
  const isNewArrival = createdAt
    ? (Date.now() - new Date(createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false;

  // Check for sale/discount
  const compareAtPrice = firstVariant?.compareAtPrice;
  const currentPrice = parseFloat(firstVariant?.price?.amount || price.amount);
  const originalPrice = compareAtPrice
    ? parseFloat(compareAtPrice.amount)
    : null;
  const isOnSale = originalPrice && originalPrice > currentPrice;
  const discountPercent = isOnSale
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Premium Pharmacy: Verified / Pharmacist Verified badge
  const isVerified = Array.isArray(tags)
    ? tags.some((tag: string) => /verified|pharmacist|authentic/i.test(tag))
    : typeof tags === "string" && /verified|pharmacist|authentic/i.test(tags);

  // Extract brand from vendor or title
  const brand = node.vendor ?? node.title.split(" ")[0];

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

    toast.success(t.addedToBag, {
      description: node.title,
      position: "top-center",
    });

    setCartOpen(true);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);

    if (!isWishlisted) {
      toast.success("Added to wishlist", {
        description: node.title,
        position: "top-center",
      });
    }
  };

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      {/* Premium Pharmacy card: white, soft-ivory context, gold border on hover */}
      <div className="relative bg-white rounded-lg p-4 transition-all duration-300 border border-transparent hover:border-shiny-gold hover:shadow-lg">
        {/* Trust seal */}
        {isVerified && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-soft-ivory text-shiny-gold border border-shiny-gold text-xs font-bold uppercase tracking-wider">
              Verified
            </Badge>
          </div>
        )}

        {/* Image Container */}
        <div className="aspect-square overflow-hidden rounded-md bg-gray-50 mb-4">
          {firstImage
            ? (
              <OptimizedImage
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                width={400}
                height={400}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )
            : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-dark-charcoal/60 font-body text-sm">
                  {t.noImage}
                </span>
              </div>
            )}
        </div>

        {/* Content - clean & clinical */}
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {brand}
          </p>
          <h3 className="font-display text-lg text-dark-charcoal leading-tight line-clamp-2">
            {translateTitle(node.title, language)}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            {isOnSale && originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatJOD(originalPrice)}
              </span>
            )}
            <p className="text-maroon font-bold">
              {formatJOD(currentPrice)}
            </p>
          </div>
        </div>

        {/* Bestseller / New / Sale badges - top left */}
        {(isBestseller || isNewArrival || isOnSale) && (
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5">
            {isBestseller && (
              <div
                className="w-7 h-7 rounded-full bg-shiny-gold flex items-center justify-center shadow-md"
                title="Bestseller"
              >
                <Star className="w-3.5 h-3.5 text-white fill-white" />
              </div>
            )}
            {isNewArrival && !isBestseller && (
              <div
                className="w-7 h-7 rounded-full bg-shiny-gold flex items-center justify-center shadow-md"
                title="New Arrival"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            {isOnSale && (
              <div className="px-2 py-1 bg-maroon text-white text-xs font-medium rounded-full">
                -{discountPercent}%
              </div>
            )}
          </div>
        )}

        {/* Wishlist - top right (below Verified if present) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted
            ? (language === "ar" ? "إزالة من المفضلة" : "Remove from wishlist")
            : (language === "ar" ? "إضافة إلى المفضلة" : "Add to wishlist")}
          className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isVerified ? "top-10" : ""
          } ${
            isWishlisted
              ? "bg-shiny-gold text-white"
              : "bg-white/90 text-dark-charcoal/70 md:opacity-0 md:group-hover:opacity-100 hover:bg-shiny-gold hover:text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add - appears on hover (Premium Pharmacy: Add to Regimen) */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full mt-4 bg-maroon text-white py-2 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {language === "ar" ? "إضافة إلى النظام" : "Add to Regimen"}
        </button>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </Link>
  );
};
