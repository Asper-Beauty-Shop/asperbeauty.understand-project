import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { motion } from "framer-motion";
import { ArrowRight, Award, Shield } from "lucide-react";

export default function PharmacistPicks() {
  const { data: picks } = useQuery({
    queryKey: ["pharmacist-picks-shopify"],
    queryFn: async () => {
      const { products } = await fetchProducts(50);
      // Beauty/skincare product types to show on homepage
      const beautyTypes = [
        "fragrance", "body care", "skin care", "skincare", "hair care",
        "makeup", "cosmetics", "serum", "cream", "moisturizer",
        "cleanser", "toner", "sunscreen", "lip", "perfume", "cologne",
        "face", "beauty", "nail", "mask", "oil", "lotion", "eye care",
      ];
      return products
        .filter((p) => {
          const type = (p.node.productType || "").toLowerCase();
          const title = (p.node.title || "").toLowerCase();
          const hasImage = p.node.images.edges.length > 0;
          const isBeauty = beautyTypes.some((bt) => type.includes(bt) || title.includes(bt));
          return hasImage && isBeauty;
        })
        .slice(0, 6);
    },
    staleTime: 5 * 60 * 1000,
  });

  if (!picks || picks.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 text-primary font-body text-xs tracking-[0.2em] px-4 py-1.5"
          >
            <Award className="h-3 w-3 mr-2" />
            PHARMACIST'S CHOICE
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Top <span className="text-primary">Picks</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Hand-selected by our pharmacists for efficacy, safety, and clinical results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {picks.map((product, i) => {
            const p = product.node;
            const imageUrl = p.images.edges[0]?.node.url;
            const price = parseFloat(p.priceRange.minVariantPrice.amount);

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link to={`/product/${p.handle}`}>
                  <div className="group relative rounded-lg border border-border/50 hover:border-accent/30 bg-card overflow-hidden transition-all duration-500 shadow-maroon-glow hover:shadow-maroon-deep">
                    {/* Gold stitch animated border */}
                    <div className="absolute inset-0 rounded-lg border-2 border-accent/0 group-hover:border-accent/60 transition-all duration-700 pointer-events-none z-10">
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
                    </div>

                    {/* Image */}
                    <div className="aspect-square bg-background overflow-hidden flex items-center justify-center p-6">
                      <img
                        src={imageUrl}
                        alt={p.title}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      {p.vendor && (
                        <p className="text-xs font-body uppercase tracking-[0.15em] text-accent font-medium">
                          {p.vendor}
                        </p>
                      )}
                      <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>

                      {price > 0 && (
                        <p className="font-body text-lg font-semibold text-primary pt-1">
                          <span className="text-[10px] align-top mr-0.5 font-normal text-muted-foreground">
                            {p.priceRange.minVariantPrice.currencyCode}
                          </span>
                          {Math.floor(price)}
                          <span className="text-xs font-normal text-muted-foreground">
                            .{(price % 1).toFixed(2).slice(2)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/products">
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10 uppercase tracking-widest text-sm px-8 h-11 group"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
