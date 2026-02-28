import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { translateTitle } from "@/lib/productUtils";
import { formatJOD } from "@/lib/productImageUtils";
import { toast } from "sonner";
import { OptimizedImage } from "./OptimizedImage";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export const FeaturedCarousel = () => {
  const { language, isRTL } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts(12);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleQuickAdd = (product: ShopifyProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    toast.success(
      language === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart",
      {
        position: "top-center",
      },
    );
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-soft-ivory border-t border-gray-200">
        <div className="luxury-container">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl text-dark-charcoal mb-4">
              {language === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-shiny-gold to-transparent mx-auto" />
          </div>
          <div className="flex gap-6 overflow-x-hidden px-14">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton
                key={i}
                className="flex-shrink-0 w-64 md:w-72"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-soft-ivory border-t border-gray-200">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-dark-charcoal mb-4">
            {language === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-shiny-gold to-transparent mx-auto" />
        </div>

        {/* Product Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full h-12 w-12"
          >
            <ChevronLeft className="w-6 h-6 text-dark-charcoal" />
          </Button>

          {/* Products Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-14 py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => {
              const imageUrl = product.node.images.edges[0]?.node.url;
              const price = parseFloat(
                product.node.priceRange.minVariantPrice.amount,
              );
              const displayTitle = translateTitle(product.node.title, language);

              return (
                <Link
                  key={product.node.id}
                  to={`/product/${product.node.handle}`}
                  className="flex-shrink-0 w-64 md:w-72 group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
                    {imageUrl
                      ? (
                        <OptimizedImage
                          src={imageUrl}
                          alt={displayTitle}
                          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          width={400}
                          height={400}
                          sizes="(max-width: 768px) 256px, 288px"
                        />
                      )
                      : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ShoppingBag className="w-12 h-12 text-gray-300" />
                        </div>
                      )}

                    {/* Quick Add Button - Shows on Hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <Button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="w-full bg-shiny-gold text-black hover:bg-shiny-gold/90 font-display tracking-wider"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        {language === "ar" ? "أضف للسلة" : "Quick Add"}
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={isRTL ? "text-right" : "text-left"}>
                    {/* Brand */}
                    <p className="font-body text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {product.node.vendor}
                    </p>

                    {/* Product Name */}
                    <h3 className="font-display text-base text-dark-charcoal font-medium line-clamp-2 mb-2 group-hover:text-shiny-gold transition-colors">
                      {displayTitle}
                    </h3>

                    {/* Price */}
                    <p className="font-display text-lg text-shiny-gold font-semibold">
                      {formatJOD(price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full h-12 w-12"
          >
            <ChevronRight className="w-6 h-6 text-dark-charcoal" />
          </Button>
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            to="/best-sellers"
            className="inline-flex items-center gap-2 font-display text-sm text-dark-charcoal hover:text-shiny-gold transition-colors tracking-wider"
          >
            {language === "ar" ? "عرض جميع المنتجات" : "View All Products"}
            <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    </section>
  );
};
