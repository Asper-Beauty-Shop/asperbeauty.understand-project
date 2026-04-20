import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { translateTitle } from "@/lib/productUtils";
import { formatJOD } from "@/lib/productImageUtils";

export const WishlistDrawer = () => {
  const { items, isOpen, setOpen, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { t, language, isRTL } = useLanguage();

  const handleAddToCart = (product: typeof items[0]) => {
    const firstVariant = product.node.variants.edges[0]?.node;
    if (!firstVariant) return;

    addToCart({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });

    toast.success(t.addedToBag, {
      description: product.node.title,
      position: "top-center",
    });

    removeItem(product.node.id);
    setOpen(false);
    setCartOpen(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        className={`w-full sm:max-w-md flex flex-col h-full bg-[#F8F8FF] ${
          isRTL ? "border-r border-l-0" : "border-l"
        } border-[#C5A028]/40 shadow-gold-lg`}
        side={isRTL ? "left" : "right"}
        style={{
          transition: "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Decorative Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <SheetHeader className="flex-shrink-0 border-b border-[#C5A028]/30 pb-4 pt-2 bg-gradient-to-b from-white/50 to-transparent">
          <SheetTitle className="font-display text-2xl text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A028]/30 via-[#C5A028]/20 to-transparent border border-[#C5A028]/40 flex items-center justify-center shadow-gold-sm">
              <Heart className="w-5 h-5 text-[#C5A028] fill-[#C5A028]" />
            </div>
            {language === "ar" ? "قائمة الرغبات" : "My Wishlist"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0
            ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C5A028]/20 via-[#C5A028]/10 to-transparent border border-[#C5A028]/30 flex items-center justify-center mb-4 shadow-gold-md">
                  <Heart className="w-10 h-10 text-[#C5A028]" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">
                  {language === "ar"
                    ? "قائمة الرغبات فارغة"
                    : "Your wishlist is empty"}
                </h3>
                <p className="font-body text-muted-foreground mb-6">
                  {language === "ar"
                    ? "احفظي منتجاتك المفضلة لشرائها لاحقاً"
                    : "Save your favorite products to purchase them later"}
                </p>
                <Button
                  variant="outline"
                  className="border-[#C5A028]/40 hover:border-[#C5A028] hover:bg-[#C5A028]/10 transition-all duration-500"
                  onClick={() => setOpen(false)}
                >
                  {language === "ar" ? "متابعة التسوق" : "Continue Shopping"}
                </Button>
              </div>
            )
            : (
              <div className="space-y-4 px-1">
                {items.map((product) => {
                  const firstImage = product.node.images.edges[0]?.node;
                  const price = product.node.priceRange.minVariantPrice;

                  return (
                    <div
                      key={product.node.id}
                      className="flex gap-4 p-3 bg-white/80 border border-[#C5A028]/20 hover:border-[#C5A028]/50 hover:shadow-gold-sm transition-all duration-500 rounded-lg group"
                    >
                      {/* Image */}
                      <Link
                        to={`/product/${product.node.handle}`}
                        onClick={() => setOpen(false)}
                        className="w-20 h-24 flex-shrink-0 bg-[#F8F8FF] overflow-hidden rounded-lg border border-[#C5A028]/10 shadow-gold-sm"
                      >
                        {firstImage
                          ? (
                            <img
                              src={firstImage.url}
                              alt={firstImage.altText || product.node.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )
                          : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F8F8FF]">
                              <Heart className="w-6 h-6 text-[#C5A028]/30" />
                            </div>
                          )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <Link
                          to={`/product/${product.node.handle}`}
                          onClick={() => setOpen(false)}
                          className="font-display text-sm text-foreground hover:text-[#C5A028] transition-colors duration-500 line-clamp-2 mb-1"
                        >
                          {translateTitle(product.node.title, language)}
                        </Link>
                        <p className="font-display text-[#800020] text-sm mb-auto font-semibold">
                          {formatJOD(parseFloat(price.amount))}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-xs border-[#C5A028]/40 hover:bg-gradient-to-r hover:from-[#C5A028] hover:to-[#C5A028]/80 hover:text-[#800020] hover:border-[#C5A028] transition-all duration-500 shadow-gold-sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingBag className="w-3 h-3 me-1" />
                            {language === "ar" ? "أضف للحقيبة" : "Add to Bag"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-[#800020] hover:bg-[#800020]/10 transition-colors duration-500"
                            onClick={() => removeItem(product.node.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>

        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-[#C5A028]/30 pt-4 pb-2 space-y-3 bg-gradient-to-t from-white/50 to-transparent px-4">
            <p className="font-body text-sm text-muted-foreground text-center">
              {language === "ar"
                ? `${items.length} ${
                  items.length === 1 ? "منتج محفوظ" : "منتجات محفوظة"
                }`
                : `${items.length} item${items.length !== 1 ? "s" : ""} saved`}
            </p>
            <Button
              variant="outline"
              className="w-full border-[#C5A028]/40 hover:border-[#C5A028] hover:bg-[#C5A028]/10 transition-all duration-500"
              onClick={() => setOpen(false)}
            >
              {language === "ar" ? "متابعة التسوق" : "Continue Shopping"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Wishlist Icon Button for Header
export const WishlistButton = () => {
  const { items, setOpen } = useWishlistStore();
  const itemCount = items.length;

  return (
    <button
      onClick={() => setOpen(true)}
      className="relative p-2 text-foreground hover:text-[#C5A028] transition-colors"
      aria-label="Wishlist"
    >
      <Heart
        className={`w-5 h-5 ${itemCount > 0 ? "fill-[#C5A028] text-[#C5A028]" : ""}`}
      />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-cream text-xs font-display rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
};


