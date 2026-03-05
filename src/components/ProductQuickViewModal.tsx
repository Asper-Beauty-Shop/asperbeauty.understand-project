import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Eye, Heart, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { formatJOD } from "@/lib/productImageUtils";
import { useWishlistStore } from "@/stores/wishlistStore";
import { logPrescriptionAddToCart } from "@/lib/conciergeAnalytics";

interface ProductData {
  id: string;
  title: string;
  price: number;
  original_price?: number | null;
  discount_percent?: number | null;
  image_url?: string | null;
  description?: string | null;
  brand?: string | null;
  category?: string;
  is_on_sale?: boolean | null;
  volume_ml?: string | null;
}

interface ProductQuickViewModalProps {
  product: ProductData;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQuickViewModal = (
  { product, isOpen, onClose }: ProductQuickViewModalProps,
) => {
  const { language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  const [quantity, setQuantity] = useState(1);

  const isOnSale = product.is_on_sale && product.original_price &&
    product.original_price > product.price;
  const discountPercent = product.discount_percent ||
    (isOnSale
      ? Math.round(
        ((product.original_price! - product.price) / product.original_price!) *
          100,
      )
      : 0);

  const handleAddToCart = () => {
    logPrescriptionAddToCart(product.id, "quick_view");
    // Create a mock Shopify-like product for the cart
    const cartProduct = {
      node: {
        id: product.id,
        title: product.title,
        handle: product.id,
        description: product.description || "",
        vendor: product.brand || "",
        productType: product.category || "",
        images: {
          edges: product.image_url
            ? [{ node: { url: product.image_url, altText: product.title } }]
            : [],
        },
        priceRange: {
          minVariantPrice: {
            amount: product.price.toString(),
            currencyCode: "JOD",
          },
          maxVariantPrice: {
            amount: product.price.toString(),
            currencyCode: "JOD",
          },
        },
        compareAtPriceRange: {
          maxVariantPrice: {
            amount: (product.original_price || product.price).toString(),
            currencyCode: "JOD",
          },
          minVariantPrice: {
            amount: (product.original_price || product.price).toString(),
            currencyCode: "JOD",
          },
        },
        variants: {
          edges: [{
            node: {
              id: `${product.id}-default`,
              title: "Default",
              price: { amount: product.price.toString(), currencyCode: "JOD" },
              compareAtPrice: product.original_price
                ? {
                  amount: product.original_price.toString(),
                  currencyCode: "JOD",
                }
                : null,
              availableForSale: true,
              selectedOptions: [],
            },
          }],
        },
        options: [],
        tags: [],
      },
    };

    addItem({
      product: cartProduct,
      variantId: `${product.id}-default`,
      variantTitle: "Default",
      price: { amount: product.price.toString(), currencyCode: "JOD" },
      quantity,
      selectedOptions: [],
    });

    toast.success(
      language === "ar" ? "تمت الإضافة إلى الحقيبة" : "Added to bag",
      {
        description: `${product.title} × ${quantity}`,
        position: "top-center",
      },
    );

    setCartOpen(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-cream border-gold/20 z-50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-sm border border-gold/30 flex items-center justify-center hover:bg-burgundy hover:text-cream transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative bg-gradient-to-br from-cream to-background aspect-square md:aspect-auto md:min-h-[500px] flex items-center justify-center p-8">
            {product.image_url
              ? (
                <>
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                  />

                  {/* Sale Badge */}
                  {isOnSale && discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-cream px-3 py-1.5 font-display text-xs tracking-widest uppercase shadow-lg rounded">
                      -{discountPercent}% OFF
                    </div>
                  )}
                </>
              )
              : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground">
                    {language === "ar" ? "لا توجد صورة" : "No image"}
                  </span>
                </div>
              )}
          </div>

          {/* Product Details */}
          <div className="p-6 md:p-8 flex flex-col bg-cream">
            <DialogHeader className="text-start mb-4">
              {/* Brand */}
              {product.brand && (
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-2">
                  {product.brand}
                </p>
              )}
              <DialogTitle className="font-display text-xl md:text-2xl text-foreground leading-tight">
                {product.title}
              </DialogTitle>
            </DialogHeader>

            {/* Volume */}
            {product.volume_ml && (
              <p className="text-sm text-muted-foreground mb-3">
                {product.volume_ml}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              {isOnSale && product.original_price && (
                <span className="text-base text-muted-foreground line-through">
                  {formatJOD(product.original_price)}
                </span>
              )}
              <span
                className={`font-display text-2xl ${
                  isOnSale ? "text-red-600" : "text-gold"
                }`}
              >
                {formatJOD(product.price)}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-4">
                {product.description}
              </p>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="font-display text-sm text-foreground mb-2 block">
                {language === "ar" ? "الكمية" : "Quantity"}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gold/30 rounded flex items-center justify-center hover:bg-gold hover:text-cream transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-display text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gold/30 rounded flex items-center justify-center hover:bg-gold hover:text-cream transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Luxury Divider */}
            <div className="flex items-center justify-center gap-3 my-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold/60 to-gold/40" />
              <span className="text-gold text-xs">✦</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent via-gold/60 to-gold/40" />
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-auto">
              <Button
                className="w-full bg-burgundy hover:bg-burgundy-light text-cream font-display uppercase tracking-widest text-xs py-6"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4 me-2" />
                {language === "ar" ? "أضف إلى الحقيبة" : "Add to Bag"}
              </Button>

              <Link to={`/product/${product.id}`} onClick={onClose}>
                <Button
                  variant="outline"
                  className="w-full border-gold/30 hover:border-gold hover:bg-gold/5 font-display uppercase tracking-widest text-xs py-6"
                >
                  <Eye className="w-4 h-4 me-2" />
                  {language === "ar"
                    ? "عرض التفاصيل الكاملة"
                    : "View Full Details"}
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-6 pt-4 border-t border-gold/20">
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="text-gold">✓</span>{" "}
                  {language === "ar" ? "أصلي 100%" : "100% Authentic"}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-gold">✓</span>{" "}
                  {language === "ar" ? "شحن سريع" : "Fast Shipping"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Quick View Trigger Button Component
export const ProductQuickViewButton = (
  { onClick }: { onClick: () => void },
) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="w-9 h-9 rounded-full bg-cream/95 backdrop-blur-sm border border-gold/50 flex items-center justify-center hover:bg-gold hover:text-cream transition-all duration-300 shadow-lg hover:scale-110"
      title="Quick View"
    >
      <Eye className="w-4 h-4" />
    </button>
  );
};

export default ProductQuickViewModal;
