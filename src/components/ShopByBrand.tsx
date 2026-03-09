import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const brands = [
  { id: "vichy", name: "Vichy", nameAr: "ÙÙŠØ´ÙŠ" },
  { id: "eucerin", name: "Eucerin", nameAr: "ÙŠÙˆØ³ÙŠØ±ÙŠÙ†" },
  { id: "bioten", name: "Bioten", nameAr: "Ø¨Ø§ÙŠÙˆØªÙŠÙ†" },
  { id: "cetaphil", name: "Cetaphil", nameAr: "Ø³ÙŠØªØ§ÙÙŠÙ„" },
  { id: "bepanthen", name: "Bepanthen", nameAr: "Ø¨ÙŠØ¨Ø§Ù†Ø«ÙŠÙ†" },
  { id: "svr", name: "SVR", nameAr: "Ø¥Ø³ ÙÙŠ Ø¢Ø±" },
  { id: "bourjois", name: "Bourjois", nameAr: "Ø¨ÙˆØ±Ø¬ÙˆØ§" },
  { id: "isadora", name: "Isadora", nameAr: "Ø¥ÙŠØ²Ø§Ø¯ÙˆØ±Ø§" },
  { id: "mavala", name: "Mavala", nameAr: "Ù…Ø§ÙØ§Ù„Ø§" },
  { id: "essence", name: "Essence", nameAr: "Ø¥ÙŠØ³Ù†Ø³" },
];

export const ShopByBrand = () => {
  const { language, isRTL } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-soft-ivory border-t border-gray-200">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-dark-charcoal mb-4">
            {language === "ar" ? "ØªØ³ÙˆÙ‚ÙŠ Ø­Ø³Ø¨ Ø§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" : "Shop By Brand"}
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-shiny-gold to-transparent mx-auto" />
        </div>

        {/* Scrollable Brand Grid */}
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full h-10 w-10"
          >
            <ChevronLeft className="w-5 h-5 text-dark-charcoal" />
          </Button>

          {/* Brands Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands?brand=${brand.id}`}
                className="flex-shrink-0 group"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-shiny-gold flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-hover:border-shiny-gold/80">
                  <span className="font-display text-sm md:text-base text-dark-charcoal text-center px-2 leading-tight">
                    {language === "ar" ? brand.nameAr : brand.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full h-10 w-10"
          >
            <ChevronRight className="w-5 h-5 text-dark-charcoal" />
          </Button>
        </div>

        {/* View All Brands Link */}
        <div className="text-center mt-8">
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 font-display text-sm text-dark-charcoal hover:text-shiny-gold transition-colors tracking-wider"
          >
            {language === "ar"
              ? "Ø¹Ø±Ø¶ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©"
              : "View All Brands"}
            <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    </section>
  );
};

