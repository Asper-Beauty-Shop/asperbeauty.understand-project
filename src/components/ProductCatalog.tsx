import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Eye,
  Loader2,
  Percent,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatJOD, getProductImage } from "@/lib/productImageUtils";
import { ProductQuickView } from "./ProductQuickView";
import { useCartStore } from "@/stores/cartStore";

// Product type from Supabase with new columns
interface Product {
  id: string;
  title: string;
  price: number | null;
  handle: string;
  primary_concern: string;
  image_url: string | null;
  brand: string | null;
  clinical_badge: string | null;
  pharmacist_note: string | null;
  gold_stitch_tier: boolean;
  is_hero: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  category?: string;
  description?: string | null;
  volume_ml?: string | null;
  is_on_sale?: boolean | null;
  original_price?: number | null;
  discount_percent?: number | null;
  [key: string]: unknown;
}

// Professional ProductCard Component - BeautyBox/iHerb Style
const ProductCard = ({
  product,
  onQuickView,
  index,
}: {
  product: Product;
  onQuickView: (product: Product) => void;
  index: number;
}) => {
  const { language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const imageUrl = getProductImage(
    product.image_url,
    product.category,
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

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

    addItem({
      product: cartProduct as import("@/lib/shopify").ShopifyProduct,
      variantId: product.id,
      variantTitle: "Default",
      price: { amount: price.toString(), currencyCode: "JOD" },
      quantity: 1,
      selectedOptions: [],
    });

    toast.success(
      language === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart",
      {
        description: product.title,
        position: "top-center",
      },
    );

    setCartOpen(true);
  };

  const handleQuickView = () => {
    onQuickView(product);
  };

  return (
    <article
      className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in flex flex-col"
      onClick={handleQuickView}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Sale Badge - iHerb Style (top-left, red/orange) */}
        {isOnSale && discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-[#E53E3E] text-white px-2 py-1 rounded-sm text-xs font-semibold shadow-md">
            <Percent className="w-3 h-3" />
            <span>-{discountPercent}%</span>
          </div>
        )}

        {/* Category Badge (below sale badge if exists) */}
        {(product.category === "Best Seller" ||
          product.category === "New Arrival") && (
          <Badge
            className={`absolute ${
              isOnSale ? "top-10" : "top-2"
            } left-2 z-10 font-medium text-[10px] uppercase tracking-wide px-2 py-1 flex items-center gap-1 shadow-sm border-0 ${
              product.category === "Best Seller"
                ? "bg-amber-500 text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            {product.category === "Best Seller" && (
              <Star className="w-3 h-3 fill-current" />
            )}
            {product.category === "New Arrival" && (
              <Sparkles className="w-3 h-3" />
            )}
            {product.category}
          </Badge>
        )}

        {/* Quick View Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuickView();
            }}
            className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-burgundy hover:text-white transition-all duration-200 transform scale-90 group-hover:scale-100"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand - Small uppercase text */}
        {product.brand && (
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-medium">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 mb-1 group-hover:text-burgundy transition-colors flex-grow">
          {product.title}
        </h3>

        {/* Volume/Size - iHerb style specs */}
        {product.volume_ml && (
          <p className="text-xs text-gray-500 mb-2">
            {product.volume_ml}
          </p>
        )}

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            {isOnSale && product.original_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatJOD(product.original_price)}
              </span>
            )}
            <span
              className={`text-base font-bold ${
                isOnSale ? "text-[#E53E3E]" : "text-gray-900"
              }`}
            >
              {formatJOD(price)}
            </span>
          </div>

          {/* Add to Cart Button - Full width, modern shadcn style */}
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="w-full bg-burgundy hover:bg-burgundy-light text-white text-xs uppercase tracking-wide py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4 me-2" />
            {language === "ar" ? "أضف للسلة" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
};

// Category filter options with icons
const CATEGORY_FILTERS = [
  {
    value: "all",
    labelEn: "All Products",
    labelAr: "جميع المنتجات",
    icon: null,
  },
  {
    value: "Best Seller",
    labelEn: "Best Sellers",
    labelAr: "الأكثر مبيعاً",
    icon: Star,
  },
  {
    value: "New Arrival",
    labelEn: "New Arrivals",
    labelAr: "وصل حديثاً",
    icon: Sparkles,
  },
  { value: "Trending", labelEn: "Trending", labelAr: "رائج", icon: TrendingUp },
  { value: "Featured", labelEn: "Featured", labelAr: "مميز", icon: Award },
];

// ProductCatalog Section Component
export const ProductCatalog = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .neq("availability_status", "Pending_Purge")
          .order("created_at", { ascending: false })
          .limit(12);

        if (error) throw error;
        setProducts(data || []);
      } catch (err: unknown) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on active category
  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((product) => product.category === activeFilter);
  }, [products, activeFilter]);

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header - Clean, minimal like BeautyBox */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 font-medium">
            {language === "ar" ? "مجموعتنا" : "Our Collection"}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            {language === "ar"
              ? "منتجات الجمال الفاخرة"
              : "Premium Beauty Products"}
          </h2>
          <div className="w-12 h-0.5 bg-burgundy mx-auto" />
        </div>

        {/* Category Filter Tabs - Clean pill style */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-full max-w-4xl"
          >
            <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0">
              {CATEGORY_FILTERS.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <TabsTrigger
                    key={filter.value}
                    value={filter.value}
                    className="px-4 py-2 rounded-full text-xs font-medium border border-gray-200 bg-white text-gray-600 data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:border-burgundy hover:border-gray-300 transition-all duration-200"
                  >
                    {IconComponent && (
                      <IconComponent className="w-3.5 h-3.5 me-1.5" />
                    )}
                    {language === "ar" ? filter.labelAr : filter.labelEn}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-burgundy animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-500">
              {language === "ar"
                ? "حدث خطأ في تحميل المنتجات"
                : "Failed to load products"}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">
              {language === "ar"
                ? activeFilter === "all"
                  ? "لا توجد منتجات متاحة"
                  : "لا توجد منتجات في هذه الفئة"
                : activeFilter === "all"
                ? "No products available"
                : "No products in this category"}
            </p>
          </div>
        )}

        {/* Product Grid - 4 columns on desktop, responsive */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div
            key={activeFilter}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
                index={index}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="px-8 py-3 text-sm font-medium border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white transition-colors duration-200"
          >
            {language === "ar" ? "عرض جميع المنتجات" : "View All Products"}
          </Button>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </section>
  );
};

export default ProductCatalog;

