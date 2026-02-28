import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GlassGoldProductCard } from "./GlassGoldProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedCollection = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(6);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <section className="py-24 bg-celestial-gradient relative overflow-hidden">
      {/* Top Gold Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-asper-gold to-transparent" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isRTL ? "rtl" : ""}`}>
          <p className="text-asper-gold/70 uppercase tracking-[0.3em] text-sm mb-4">
            {isRTL ? "منتقاة للإشراق" : "Curated for Radiance"}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-asper-ivory">
            {isRTL ? "المجموعة" : "The Collection"}
          </h2>
          {/* Gold Underline */}
          <div className="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-asper-gold to-transparent" />
        </div>

        {/* Product Grid */}
        {isLoading
          ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-asper-merlot/40 backdrop-blur-md rounded-sm overflow-hidden"
                >
                  <Skeleton className="aspect-[4/5] bg-asper-merlot/60" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-20 mx-auto bg-asper-merlot/60" />
                    <Skeleton className="h-6 w-32 mx-auto bg-asper-merlot/60" />
                    <Skeleton className="h-5 w-16 mx-auto bg-asper-merlot/60" />
                  </div>
                </div>
              ))}
            </div>
          )
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product, index) => (
                <div
                  key={product.node.id}
                  className="opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <GlassGoldProductCard product={product} />
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Bottom Gold Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-asper-gold to-transparent" />
    </section>
  );
};

export default FeaturedCollection;
