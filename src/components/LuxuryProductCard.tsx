import { useState } from "react";
import { Eye, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatJOD } from "@/lib/productImageUtils";
import { BlurUpImage } from "./BlurUpImage";

interface ProductProps {
  id: string;
  title: string;
  category?: string;
  brand?: string;
  price: string | number;
  original_price?: number | null;
  discount_percent?: number | null;
  image_url: string;
  is_new?: boolean;
  is_on_sale?: boolean;
  description?: string;
  volume_ml?: string;
}

export const LuxuryProductCard = ({ product }: { product: ProductProps }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const price = typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;

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
          minVariantPrice: { amount: price.toString(), currencyCode: "JOD" },
          maxVariantPrice: { amount: price.toString(), currencyCode: "JOD" },
        },
        compareAtPriceRange: {
          maxVariantPrice: {
            amount: (product.original_price || price).toString(),
            currencyCode: "JOD",
          },
          minVariantPrice: {
            amount: (product.original_price || price).toString(),
            currencyCode: "JOD",
          },
        },
        variants: {
          edges: [{
            node: {
              id: `${product.id}-default`,
              title: "Default",
              price: { amount: price.toString(), currencyCode: "JOD" },
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
      price: { amount: price.toString(), currencyCode: "JOD" },
      quantity: 1,
      selectedOptions: [],
    });

    toast.success(
      language === "ar" ? "تمت الإضافة إلى الحقيبة" : "Added to bag",
      {
        description: product.title,
        position: "top-center",
      },
    );

    setCartOpen(true);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const price = typeof product.price === "string"
    ? parseFloat(product.price)
    : product.price;

  return (
    <>
      <Link
        to={`/product/${product.id}`}
        className="group relative bg-background border border-border flex flex-col h-full overflow-hidden"
      >
        {/* 1. Image Area - Aspect Ratio is key for consistency */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
          {product.is_new && (
            <span className="absolute top-2 left-2 z-10 bg-gold text-[8px] md:text-[10px] text-foreground px-2 py-0.5 font-bold uppercase tracking-widest">
              New
            </span>
          )}

          {/* Sale badge */}
          {product.is_on_sale && product.discount_percent && (
            <span className="absolute top-2 right-2 z-10 bg-red-600 text-cream text-[8px] md:text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest rounded">
              -{product.discount_percent}%
            </span>
          )}

          {/* Progressive blur-up image loading */}
          <BlurUpImage
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            containerClassName="h-full w-full"
            blurAmount={15}
            transitionDuration={400}
          />

          {/* Hover Actions - Quick View & Add to Cart */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              {/* Quick View Button */}
              <button
                onClick={handleQuickView}
                className="w-10 h-10 rounded-full bg-cream/95 backdrop-blur-sm border border-gold/50 flex items-center justify-center hover:bg-gold hover:text-cream transition-all duration-300 shadow-lg hover:scale-110"
                title={language === "ar" ? "عرض سريع" : "Quick View"}
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Add to Cart Button - Desktop */}
              <button
                onClick={handleAddToCart}
                className="hidden md:flex w-10 h-10 rounded-full bg-burgundy/95 backdrop-blur-sm border border-burgundy flex items-center justify-center hover:bg-burgundy-light text-cream transition-all duration-300 shadow-lg hover:scale-110"
                title={language === "ar" ? "أضف إلى الحقيبة" : "Add to Bag"}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Quick-Add: Only shows on mobile */}
          <button
            className="absolute bottom-2 right-2 md:hidden bg-foreground text-background p-2 rounded-full shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        {/* 2. Content Area - Optimized Typography */}
        <div className="p-3 md:p-6 flex flex-col flex-1 text-center md:text-left">
          <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-1">
            {product.brand || product.category}
          </p>

          <h3 className="font-serif text-sm md:text-lg text-foreground line-clamp-2 leading-tight mb-2 flex-1">
            {product.title}
          </h3>

          <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              {product.is_on_sale && product.original_price && (
                <span className="font-sans text-xs text-muted-foreground line-through">
                  {formatJOD(product.original_price)}
                </span>
              )}
              <span
                className={`font-sans font-bold text-xs md:text-base ${
                  product.is_on_sale ? "text-red-600" : "text-foreground"
                }`}
              >
                {formatJOD(price)}
              </span>
            </div>

            {/* Rating - Hidden on very small screens to save space */}
            <div className="hidden sm:flex items-center gap-1 text-gold">
              <Star className="h-2 w-2 md:h-3 md:w-3 fill-current" />
              <span className="text-[9px] md:text-xs text-muted-foreground">
                4.9
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Only: Add to Cart on Hover */}
        <div
          className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-burgundy text-cream p-4 text-center cursor-pointer uppercase text-[10px] font-bold tracking-widest hover:bg-burgundy-light"
          onClick={handleAddToCart}
        >
          {language === "ar" ? "أضف إلى الحقيبة" : "Add to Bag"}
        </div>
      </Link>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={{
          id: product.id,
          title: product.title,
          price: price,
          original_price: product.original_price,
          discount_percent: product.discount_percent,
          image_url: product.image_url,
          description: product.description,
          brand: product.brand,
          category: product.category,
          is_on_sale: product.is_on_sale,
          volume_ml: product.volume_ml,
        }}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default LuxuryProductCard;
