import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

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
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isRTL ? "rtl" : ""}`}>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-sm mb-4 font-body">
            {isRTL ? "منتقاة للإشراق" : "Curated for Radiance"}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            {isRTL ? "المجموعة" : "The Collection"}
          </h2>
          {/* Gold Underline */}
          <div className="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="luxury-card overflow-hidden">
                <Skeleton className="aspect-[4/5] bg-muted" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20 mx-auto bg-muted" />
                  <Skeleton className="h-6 w-32 mx-auto bg-muted" />
                  <Skeleton className="h-5 w-16 mx-auto bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product, index) => {
              const node = product.node;
              const image = node.images?.edges?.[0]?.node;
              const price = node.priceRange?.minVariantPrice;
              const handle = node.handle;

              return (
                <Link
                  to={`/product/${handle}`}
                  key={node.id}
                  className="luxury-card group opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {/* Image */}
                  <div className="luxury-card-image aspect-[4/5] bg-secondary">
                    {image?.url && (
                      <img
                        src={image.url}
                        alt={image.altText || node.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-6 text-center space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body">
                      {node.vendor || "Asper Beauty"}
                    </p>
                    <h3 className="font-display text-lg text-foreground line-clamp-2">
                      {node.title}
                    </h3>
                    {price && (
                      <p className="text-accent font-body font-semibold">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
    </section>
  );
};

export default FeaturedCollection;
