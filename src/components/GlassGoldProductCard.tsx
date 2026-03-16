import { useState } from "react";
import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { Heart, ShoppingBag, Sparkles, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuickViewModal } from "./QuickViewModal";
import { translateTitle } from "@/lib/productUtils";
import { formatJOD } from "@/lib/productImageUtils";
import { OptimizedImage } from "./OptimizedImage";

interface GlassGoldProductCardProps {
  product: ShopifyProduct;
}

export const GlassGoldProductCard = (
  { product }: GlassGoldProductCardProps,
) => {
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

  const tags = node.tags ?? [];
  const isBestseller = Array.isArray(tags)
    ? tags.some((tag: string) => tag.toLowerCase().includes("bestseller"))
    : typeof tags === "string" && tags.toLowerCase().includes("bestseller");

  const createdAt = node.createdAt ?? null;
  const isNewArrival = createdAt
    ? (Date.now() - new Date(createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false;

  const compareAtPrice = firstVariant?.compareAtPrice;
  const currentPrice = parseFloat(firstVariant?.price?.amount || price.amount);
  const originalPrice = compareAtPrice
    ? parseFloat(compareAtPrice.amount)
    : null;
  const isOnSale = originalPrice && originalPrice > currentPrice;
  const discountPercent = isOnSale
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

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
      {/* Frosted Clinical Glass Card */}
      <div className="relative w-full bg-soft-ivory/60 backdrop-blur-sm md:backdrop-blur-md border border-polished-gold/30 rounded-sm overflow-hidden transition-all duration-[400ms] hover:border-polished-gold hover:-translate-y-1 shadow-[0_8px_32px_0_rgba(0,0,0,0.03)]">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {firstImage
            ? (
              <OptimizedImage
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width={400}
                height={500}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )
            : (
              <div className="w-full h-full flex items-center justify-center bg-asper-stone/20">
                <span className="text-muted-foreground font-body text-sm">
                  {t.noImage}
                </span>
              </div>
            )}

          {/* Badges */}
          {(isBestseller || isNewArrival || isOnSale) && (
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
              {isBestseller && (
                <div
                  className="w-8 h-8 rounded-full bg-polished-gold flex items-center justify-center shadow-lg"
                  title="Bestseller"
                >
                  <Star className="w-4 h-4 text-burgundy fill-burgundy" />
                </div>
              )}
              {isNewArrival && !isBestseller && (
                <div
                  className="w-8 h-8 rounded-full bg-polished-gold flex items-center justify-center shadow-lg"
                  title="New Arrival"
                >
                  <Sparkles className="w-4 h-4 text-burgundy" />
                </div>
              )}
              {isOnSale && (
                <div className="px-2 py-1 bg-burgundy text-white font-body text-xs tracking-wide rounded-full shadow-lg">
                  -{discountPercent}%
                </div>
              )}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted
                ? "bg-polished-gold text-burgundy"
                : "bg-white/20 backdrop-blur-sm text-asper-ink md:opacity-0 md:group-hover:opacity-100 hover:bg-polished-gold hover:text-burgundy"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>

          {/* Quick Add Button — Slides up on hover with micro-interaction */}
          <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-burgundy text-white py-4 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:bg-burgundy-dark hover:scale-[1.02]"
            >
              <ShoppingBag size={16} />
              {language === "ar" ? "أضف للسلة" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 text-center">
          <p className="text-xs text-polished-gold/70 uppercase tracking-[0.2em] mb-2 font-body">
            {brand}
          </p>
          <h3 className="font-serif text-xl text-asper-ink mb-2 line-clamp-2">
            {translateTitle(node.title, language)}
          </h3>
          <div className="flex items-center justify-center gap-2">
            {isOnSale && originalPrice && (
              <p className="font-body text-sm text-asper-ink-muted line-through">
                {formatJOD(originalPrice)}
              </p>
            )}
            <p className="font-body text-polished-gold font-light">
              {formatJOD(currentPrice)}
            </p>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </Link>
  );
};

export default GlassGoldProductCard;
