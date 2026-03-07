import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

interface SliderProduct {
  id: string;
  handle: string;
  title: string;
  brand: string;
  image: string;
  tag?: string;
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
    <section className="py-16 lg:py-20 bg-asper-stone-light relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        {/* Section Header */}
        <AnimatedSection
          className="flex items-end justify-between mb-10"
          animation="fade-up"
        >
          <div>
            {subtitle && (
              <span className="font-body text-xs uppercase tracking-[0.2em] text-polished-gold mb-2 block">
                {isArabic ? subtitle.ar : subtitle.en}
              </span>
            )}
            <h2 className="font-display text-2xl lg:text-3xl text-asper-ink">
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

        {/* Product Carousel */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.handle}`}
                className="group flex-shrink-0 w-64 lg:w-72"
              >
                {/* Product Card */}
                <div className="rounded-xl overflow-hidden border border-border bg-white gold-stitch-hover hover:shadow-maroon-glow transition-all duration-400">
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Product tag */}
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-polished-gold text-asper-ink text-[10px] uppercase tracking-wider font-body font-semibold px-3 py-1 rounded-full">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-1.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body font-semibold">
                      {product.brand}
                    </p>
                    <h3 className="font-display text-sm text-foreground line-clamp-2 leading-snug font-semibold">
                      {product.title}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-body text-burgundy font-semibold uppercase tracking-wider mt-2",
                        "group-hover:text-polished-gold transition-colors duration-300"
                      )}
                    >
                      {isArabic ? "تسوق الآن" : "Add to Regimen"}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
};

