import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Minus,
  Package,
  Percent,
  Plus,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatJOD, getProductImage } from "@/lib/productImageUtils";
import { useCartStore } from "@/stores/cartStore";

import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products"> & {
  description?: string | null;
  category?: string;
  [key: string]: unknown;
};

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQuickView = (
  { product, isOpen, onClose }: ProductQuickViewProps,
) => {
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  if (!product) return null;

  const imageUrl = getProductImage(
    product.image_url,
    product.category ?? "",
    product.title,
  );
  const price = product.price ?? 0;
  const isOnSale = product.is_on_sale && product.original_price &&
    product.original_price > price;
  const discountPercent = product.discount_percent ||
    (isOnSale
      ? Math.round(
        ((product.original_price! - price) / product.original_price!) *
          100,
      )
      : 0);

  const handleAddToCart = () => {
    // Create a mock product for cart compatibility
    const cartProduct = {
      node: {
        id: product.id,
        title: product.title,
        handle: product.id,
        description: product.description || "",
        priceRange: {
          minVariantPrice: {
        amount: price.toString(),
            currencyCode: "JOD",
          },
        },
        images: {
          edges: [{
            node: {
              url: imageUrl,
              altText: product.title,
            },
          }],
        },
        variants: {
          edges: [{
            node: {
              id: product.id,
              title: "Default",
              price: { amount: price.toString(), currencyCode: "JOD" },
              selectedOptions: [],
            },
          }],
        },
      },
    };

    for (let i = 0; i < quantity; i++) {
      addItem({
        product: cartProduct as unknown as import("@/lib/shopify").ShopifyProduct,
        variantId: product.id,
        variantTitle: "Default",
        price: { amount: price.toString(), currencyCode: "JOD" },
        quantity: 1,
        selectedOptions: [],
      });
    }

    toast.success(
      language === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart",
      {
        description: `${product.title} × ${quantity}`,
        position: "top-center",
      },
    );
    setQuantity(1);
    setCartOpen(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-50 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative bg-gray-50 aspect-square md:aspect-auto md:min-h-[500px]">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {/* Sale Badge */}
            {isOnSale && discountPercent > 0 && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-[#E53E3E] text-white px-3 py-1.5 rounded text-sm font-bold shadow-lg">
                <Percent className="w-4 h-4" />
                <span>-{discountPercent}% OFF</span>
              </div>
            )}

            {/* Category Badge */}
            {(product.category === "Best Seller" ||
              product.category === "New Arrival") && (
              <Badge
                className={`absolute ${
                  isOnSale ? "top-14" : "top-4"
                } left-4 z-10 font-medium text-xs uppercase tracking-wide px-3 py-1.5 flex items-center gap-1.5 shadow-lg border-0 ${
                  product.category === "Best Seller"
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-500 text-white"
                }`}
              >
                {product.category === "Best Seller" && (
                  <Star className="w-3.5 h-3.5 fill-current" />
                )}
                {product.category === "New Arrival" && (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {product.category}
              </Badge>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 md:p-8 flex flex-col">
            <DialogHeader className="text-start mb-2">
              {/* Brand */}
              {product.brand && (
                <p className="text-xs uppercase tracking-[0.15em] text-gray-500 font-medium mb-1">
                  {product.brand}
                </p>
              )}

              <DialogTitle className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                {product.title}
              </DialogTitle>
            </DialogHeader>

            {/* Volume/Size */}
            {product.volume_ml && (
              <p className="text-sm text-gray-500 mb-4">
                {product.volume_ml}
              </p>
            )}

            {/* Price Section */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-baseline gap-3">
                {isOnSale && product.original_price && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatJOD(product.original_price)}
                  </span>
                )}
                <span
                  className={`text-2xl font-bold ${
                    isOnSale ? "text-[#E53E3E]" : "text-gray-900"
                  }`}
                >
                  {formatJOD(price)}
                </span>
              </div>
              {isOnSale && (
                <p className="text-sm text-[#E53E3E] mt-1 font-medium">
                  {language === "ar"
                    ? `وفر ${
                      formatJOD(product.original_price! - price)
                    }`
                    : `Save ${
                      formatJOD(product.original_price! - price)
                    }`}
                </p>
              )}
            </div>

            {/* Description - iHerb style benefit-focused */}
            <div className="mb-6 flex-grow">
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || (language === "ar"
                  ? "منتج فاخر عالي الجودة من مجموعتنا المميزة. يتميز بأفضل المكونات لبشرة مشرقة وصحية. مصرح من هيئة الغذاء والدواء الأردنية."
                  : "Premium quality beauty product from our curated collection. Formulated with the finest ingredients for radiant, healthy skin. JFDA approved and authorized retailer.")}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-xs uppercase tracking-wide text-gray-700 mb-2 block font-medium">
                {language === "ar" ? "الكمية" : "Quantity"}
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-14 text-center text-lg font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-burgundy hover:bg-burgundy-light text-white text-sm uppercase tracking-wide py-6 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5 me-2" />
              {language === "ar" ? "أضف إلى السلة" : "Add to Cart"} -{" "}
              {formatJOD(price * quantity)}
            </Button>

            {/* Trust Badges - iHerb/BeautyBox style */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center text-center">
                <Shield className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                  {language === "ar" ? "أصلي 100%" : "100% Authentic"}
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Truck className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                  {language === "ar" ? "شحن سريع" : "Fast Shipping"}
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Package className="w-5 h-5 text-purple-600 mb-1" />
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                  {language === "ar" ? "مرخص JFDA" : "JFDA Approved"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;

