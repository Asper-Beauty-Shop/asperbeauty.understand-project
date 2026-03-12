import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchProducts, normalizePrice } from "@/lib/shopify";
import { motion } from "framer-motion";
import { ArrowRight, Award, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PharmacistPicks() {
  const { data: picks } = useQuery({
    queryKey: ["pharmacist-picks-shopify"],
    queryFn: async () => {
      const products = await fetchProducts(50);
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
    <section className="py-24 lg:py-32 bg-[#F8F8FF] border-y border-polished-gold/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-6 border-burgundy/30 text-burgundy font-body text-[10px] uppercase tracking-[0.3em] px-5 py-2 bg-white/50 backdrop-blur-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-2" />
            Pharmacist Verified Protocol
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl text-asper-ink tracking-tight mb-6">
            The <span className="text-burgundy italic">Clinical</span> Selection
          </h2>
          <p className="mt-4 text-asper-ink/70 text-lg max-w-2xl mx-auto font-body leading-relaxed">
            Hand-selected by our master pharmacists for biological efficacy, safety, and measurable clinical results.
          </p>
          <div className="w-20 h-1 bg-burgundy mx-auto mt-8 rounded-full" />
        </div>

        {/* 1. CSS Grid Implementation (Strict Mandate) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {picks.map((product, i) => {
            const p = product.node;
            const imageUrl = p.images.edges[0]?.node.url;
            const price = normalizePrice(p.priceRange.minVariantPrice.amount);

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              >
                <Link to={`/product/${p.handle}`} className="group block">
                  {/* 2. Strict p-6 Padding (Mandate) */}
                  <div className="relative bg-white border border-border/40 p-6 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:shadow-[0_25px_60px_-15px_rgba(128,0,32,0.15)] hover:border-polished-gold/40">
                    
                    {/* Floating Excellence Badge */}
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                       <div className="bg-burgundy text-white p-2 rounded-full shadow-lg">
                          <Award className="w-4 h-4" />
                       </div>
                    </div>

                    {/* Image with negative space */}
                    <div className="aspect-[4/5] bg-asper-stone overflow-hidden flex items-center justify-center p-8 mb-8 relative">
                      <img
                        src={imageUrl}
                        alt={p.title}
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-burgundy/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Content Hierarchy */}
                    <div className="space-y-3">
                      {p.vendor && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-polished-gold mb-1">
                          {p.vendor}
                        </p>
                      )}
                      <h3 className="font-display text-lg font-semibold text-asper-ink line-clamp-2 leading-tight min-h-[3rem] group-hover:text-burgundy transition-colors">
                        {p.title}
                      </h3>

                      <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-4">
                        {price > 0 && (
                          <p className="font-body text-xl font-bold text-burgundy tracking-tight">
                            {price.toFixed(2)} <span className="text-[10px] uppercase font-normal text-asper-ink/50 ms-1">{p.priceRange.minVariantPrice.currencyCode}</span>
                          </p>
                        )}
                        <span className="text-[9px] uppercase tracking-widest font-bold text-asper-ink/40 group-hover:text-burgundy transition-colors">
                          Shop Now &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-20">
          <Link to="/products">
            <Button
              variant="outline"
              className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white uppercase tracking-[0.3em] text-[10px] font-bold px-12 h-14 transition-all duration-500 rounded-none group shadow-sm hover:shadow-xl active:scale-95"
            >
              Examine Full Catalog
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
