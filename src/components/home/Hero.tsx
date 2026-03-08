import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function Hero() {
  const { dir, locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="relative overflow-hidden bg-asper-stone">
      {/* Full-width editorial banner */}
      <div className="relative w-full">
        {/* Banner image — editorial style */}
        <div className="relative w-full aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=1920&q=80&auto=format&fit=crop')",
            }}
          />
          {/* Gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-asper-ink/70 via-asper-ink/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/50 via-transparent to-asper-ink/20" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="luxury-container w-full">
              <motion.div
                className={cn("max-w-xl", isAr && "ml-auto text-right")}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                {/* Campaign tag */}
                <span className="inline-block font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-4 border border-polished-gold/40 px-4 py-1.5 rounded-full bg-asper-ink/30 backdrop-blur-sm">
                  {isAr ? "ذكي. أصيل. خالد." : "Intelligent. Authentic. Eternal."}
                </span>

                <h1
                  className={cn(
                    "font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-polished-white leading-[1.05] tracking-tight",
                    isAr && "font-arabic"
                  )}
                >
                  {isAr ? (
                    <>
                      مُنتقاة من <span className="text-polished-gold">الصيادلة.</span>
                    </>
                  ) : (
                    <>
                      Curated by Pharmacists.{" "}
                      <span className="text-polished-gold">Built for Trust.</span>
                    </>
                  )}
                </h1>

                <p
                  className={cn(
                    "mt-4 text-base sm:text-lg text-polished-white/80 max-w-md leading-relaxed",
                    isAr ? "font-arabic" : "font-body"
                  )}
                >
                  {isAr
                    ? "حلول موثوقة لإشراقة خالدة"
                    : "Trusted Solutions for Ageless Radiance"}
                </p>

                {/* CTA */}
                <div className="mt-8">
                  <Link to="/shop">
                    <Button
                      size="lg"
                      className={cn(
                        "group bg-polished-gold text-asper-ink hover:bg-polished-gold/90",
                        "border border-transparent hover:border-polished-gold",
                        "text-sm uppercase tracking-widest px-10 h-14 font-semibold",
                        "transition-all duration-400 shadow-lg hover:shadow-xl"
                      )}
                    >
                      {isAr ? "تسوقي الآن" : "Shop Now"}
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                          dir === "rtl"
                            ? "mr-2 rotate-180 group-hover:-translate-x-1"
                            : "ml-2"
                        )}
                      />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/50 to-transparent" />
    </section>
  );
}
