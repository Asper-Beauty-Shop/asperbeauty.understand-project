import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { getLocalizedDescription, translateTitle } from "@/lib/productUtils";
import { formatJOD } from "@/lib/productImageUtils";
import { logPrescriptionAddToCart } from "@/lib/conciergeAnalytics";

interface QuickViewModalProps {
  product: ShopifyProduct;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal = (
  { product, isOpen, onClose }: QuickViewModalProps,
) => {
  const { node } = product;
  const { t, language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const images = node.images.edges;
  const variants = node.variants.edges;
  const selectedVariant = variants[selectedVariantIndex]?.node;
  const price = selectedVariant?.price || node.priceRange.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;

  const isOnSale = compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const discountPercent = isOnSale
    ? Math.round(
      ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
        parseFloat(compareAtPrice.amount)) * 100,
    )
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    logPrescriptionAddToCart(node.id, "quick_view");
    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success(t.addedToBag, {
      description: `${node.title} × ${quantity}`,
      position: "top-center",
    });

    setCartOpen(true);
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-cream border-gold/20">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative bg-gradient-to-br from-cream to-cream/80 aspect-square md:aspect-auto md:h-full">
            {images.length > 0
              ? (
                <>
                  <img
                    src={images[currentImageIndex]?.node.url}
                    alt={images[currentImageIndex]?.node.altText || node.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/90 backdrop-blur-sm border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-cream transition-colors shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/90 backdrop-blur-sm border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-cream transition-colors shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-gold w-6"
                                : "bg-foreground/30 hover:bg-foreground/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Sale Badge */}
                  {isOnSale && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-cream px-3 py-1.5 font-display text-xs tracking-widest uppercase shadow-lg">
                      -{discountPercent}% OFF
                    </div>
                  )}
                </>
              )
              : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground">{t.noImage}</span>
                </div>
              )}
          </div>

          {/* Product Details */}
          <div className="p-8 flex flex-col">
            <DialogHeader className="text-start mb-6">
              <DialogTitle className="font-display text-2xl md:text-3xl text-foreground leading-tight">
                {translateTitle(node.title, language)}
              </DialogTitle>
            </DialogHeader>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              {isOnSale && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatJOD(parseFloat(compareAtPrice.amount))}
                </span>
              )}
              <span
                className={`font-display text-2xl ${
                  isOnSale ? "text-red-600" : "text-gold"
                }`}
              >
                {formatJOD(parseFloat(price.amount))}
              </span>
            </div>

            {/* Description */}
            <p className="font-body text-muted-foreground mb-6 leading-relaxed flex-grow">
              {getLocalizedDescription(node.description, language, 150) ||
                t.premiumProduct}
            </p>

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="mb-6">
                <label className="font-display text-sm text-foreground mb-2 block">
                  {node.options?.[0]?.name || "Option"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => {
                    const oos = !variant.node.availableForSale;
                    return (
                      <button
                        key={variant.node.id}
                        onClick={() => !oos && setSelectedVariantIndex(index)}
                        disabled={oos}
                        title={oos ? (language === "ar" ? "نفد المخزون" : "Sold Out") : undefined}
                        className={`px-4 py-2 border text-sm font-body transition-all relative ${
                          oos
                            ? "border-border/30 text-muted-foreground/40 cursor-not-allowed line-through"
                            : index === selectedVariantIndex
                            ? "border-gold bg-gold text-cream"
                            : "border-gold/30 hover:border-gold text-foreground"
                        }`}
                      >
                        {variant.node.title}
                        {oos && (
                          <span className="absolute -top-2 -right-2 text-[8px] bg-muted-foreground/60 text-white px-1 rounded-full">
                            {language === "ar" ? "نفد" : "OOS"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="font-display text-sm text-foreground mb-2 block">
                {language === "ar" ? "الكمية" : "Quantity"}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-cream transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-display text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-cream transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 my-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold/60 to-gold/40" />
              <svg
                className="w-4 h-4 text-gold"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C12 2 9 6 9 9C9 11 10.5 12.5 12 12.5C13.5 12.5 15 11 15 9C15 6 12 2 12 2ZM6 8C6 8 3 11 3 13.5C3 15.5 4.5 17 6.5 17C7.5 17 8.5 16.5 9 15.5C7.5 14.5 6.5 12.5 6.5 10.5C6.5 9.5 6.5 8.5 6 8ZM18 8C17.5 8.5 17.5 9.5 17.5 10.5C17.5 12.5 16.5 14.5 15 15.5C15.5 16.5 16.5 17 17.5 17C19.5 17 21 15.5 21 13.5C21 11 18 8 18 8ZM12 14C10 14 8 15.5 7 17.5C8 19.5 10 21 12 21C14 21 16 19.5 17 17.5C16 15.5 14 14 12 14Z" />
              </svg>
              <div className="w-12 h-px bg-gradient-to-l from-transparent via-gold/60 to-gold/40" />
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-auto">
              <Button
                variant="luxury"
                size="luxury"
                className="w-full bg-cta hover:bg-cta/90 text-cta-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={selectedVariant ? !selectedVariant.availableForSale : false}
              >
                <ShoppingBag className="w-4 h-4 me-2" />
                {selectedVariant && !selectedVariant.availableForSale
                  ? (language === "ar" ? "نفد المخزون" : "Out of Stock")
                  : t.addToBag}
              </Button>

              <Link to={`/product/${node.handle}`} onClick={onClose}>
                <Button
                  variant="outline"
                  size="luxury"
                  className="w-full border-gold/30 hover:border-gold hover:bg-gold/5"
                >
                  <Eye className="w-4 h-4 me-2" />
                  {language === "ar"
                    ? "عرض التفاصيل الكاملة"
                    : "View Full Details"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Quick View Trigger Button
export const QuickViewButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="w-10 h-10 rounded-full bg-cream/95 backdrop-blur-sm border border-gold/50 flex items-center justify-center hover:bg-gold hover:text-cream transition-all duration-300 shadow-lg hover:scale-110"
    >
      <Eye className="w-4 h-4" />
    </button>
  );
};

