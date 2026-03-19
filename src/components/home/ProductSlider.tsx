import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

interface SliderProduct {
  id: string;
  handle?: string;
  title: string;
  brand?: string | null;
  image?: string;
  image_url?: string;
  tag?: string;
  tags?: string[];
  clinical_badge?: string | null;
}

interface ProductSliderProps {
  title: { en: string; ar: string };
  subtitle?: { en: string; ar: string };
  products: SliderProduct[];
}

export const ProductSlider = ({
  title,
  subtitle,
  products,
}: ProductSliderProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(240 100% 99%) 0%, hsl(0 0% 100%) 40%, hsl(240 50% 99.5%) 100%)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        {/* Section Header */}
        <AnimatedSection
          className="flex items-end justify-between mb-12"
          animation="fade-up"
        >
          <div>
            {subtitle && (
              <span className="font-body text-xs uppercase tracking-[0.2em] text-polished-gold mb-2 block">
                {isArabic ? subtitle.ar : subtitle.en}
              </span>
            )}
            <h2 className="font-heading text-2xl lg:text-3xl text-asper-ink font-bold">
              {isArabic ? title.ar : title.en}
            </h2>
          </div>

          {/* Desktop navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-polished-gold/30 hover:border-polished-gold/60 flex items-center justify-center text-asper-ink hover:text-polished-gold transition-all duration-300"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-polished-gold/30 hover:border-polished-gold/60 flex items-center justify-center text-asper-ink hover:text-polished-gold transition-all duration-300"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </AnimatedSection>

        {/* Product Carousel — Floating Cards */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => {
              const imgSrc = product.image || product.image_url || "/editorial-showcase-2.webp";
              const handle = product.handle || product.id;
              const clinicalTag = product.clinical_badge || product.tag;

              return (
                <Link
                  key={product.id}
                  to={`/product/${handle}`}
                  className="group flex-shrink-0 w-64 lg:w-72"
                >
                  {/* Clinical Glass Card */}
                  <div className="relative clinical-glass-card rounded-lg p-4 overflow-hidden">
                    {/* Clinical Shimmer Beam */}
                    <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[20deg] pointer-events-none z-20 group-hover:left-[150%] transition-all duration-700 ease-in-out" />

                    {/* Image — transparent PNG floats inside glass */}
                    <div className="relative aspect-[5/6] overflow-hidden mb-4">
                      <img
                        src={imgSrc}
                        alt={product.title}
                        className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                        loading="lazy"
                      />
                    </div>

                    {/* Typography Hierarchy */}
                    <div className="space-y-2">
                      {/* Clinical pill tag */}
                      {clinicalTag && (
                        <span className={cn(
                          "inline-block font-body text-[9px] uppercase tracking-[0.15em] px-3 py-1 rounded-full",
                          clinicalTag === "Jordanian Heritage" || clinicalTag === "Local Favorite"
                            ? "bg-accent/10 text-accent border border-accent/50 font-semibold"
                            : "text-accent border border-accent/40"
                        )}>
                          {clinicalTag}
                        </span>
                      )}

                      {/* Brand — Gold micro label */}
                      {product.brand && (
                        <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-body font-semibold">
                          {product.brand}
                        </p>
                      )}

                      {/* Product Name */}
                      <h3 className="font-heading text-sm text-foreground line-clamp-2 leading-snug font-semibold">
                        {product.title}
                      </h3>

                      {/* CTA text */}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-body text-primary font-semibold uppercase tracking-wider mt-1",
                          "group-hover:text-accent transition-colors duration-300"
                        )}
                      >
                        {isArabic ? "تسوق الآن" : "Add to Regimen"}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </AnimatedSection>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
};

