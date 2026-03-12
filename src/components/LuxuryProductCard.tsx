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
        className="group relative bg-white rounded-xl overflow-hidden cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow duration-500 hover:shadow-[0_10px_40px_rgba(128,0,32,0.08)] flex flex-col h-full"
      >
        {/* THE GOLD STITCH MICRO-INTERACTION */}
        <div className="absolute top-0 left-0 h-[2px] w-full bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-[11]"></div>

        {/* 1. Image Area */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8FF] p-6 flex items-center justify-center">
          {product.is_new && (
            <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm border border-gray-100 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-bold text-[#800020] tracking-wider uppercase shadow-sm">
              New
            </span>
          )}

          {/* Progressive blur-up image loading */}
          <BlurUpImage
            src={product.image_url}
            alt={product.title}
            className="max-h-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-in-out drop-shadow-sm mix-blend-multiply"
            containerClassName="h-full w-full"
            blurAmount={15}
            transitionDuration={400}
          />

          {/* Hover Actions - Quick View */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={handleQuickView}
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border border-[#D4AF37]/50 flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-lg hover:scale-110"
              title={language === "ar" ? "عرض سريع" : "Quick View"}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Content Area */}
        <div className="p-4 md:p-6 flex flex-col flex-1 text-center items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            {product.brand || product.category}
          </span>

          <h3 className="font-serif text-sm md:text-lg text-gray-900 line-clamp-2 leading-tight mb-2 flex-1 group-hover:text-[#800020] transition-colors duration-300">
            {product.title}
          </h3>

          <div className="mt-auto mb-6">
            <div className="flex items-center gap-2 justify-center font-sans">
              {product.is_on_sale && product.original_price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatJOD(product.original_price)}
                </span>
              )}
              <span className={`font-bold text-sm md:text-base ${product.is_on_sale ? "text-red-600" : "text-gray-600"}`}>
                {formatJOD(price)}
              </span>
            </div>
          </div>

          {/* The Action Button: Deep Maroon for conversion */}
          <button 
            onClick={handleAddToCart}
            className="w-full py-2.5 md:py-3 px-4 bg-white text-[#800020] border border-[#800020] font-semibold rounded-lg group-hover:bg-[#800020] group-hover:text-white transition-all duration-300 uppercase text-[10px] md:text-xs tracking-widest"
          >
            {language === "ar" ? "إضافة سريعة" : "Quick Add"}
          </button>
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


