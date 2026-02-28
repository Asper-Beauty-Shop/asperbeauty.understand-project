import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { LazyImage } from "./LazyImage";

// Brand logos
import vichyLogo from "@/assets/brands/vichy-logo.webp";
import eucerinLogo from "@/assets/brands/eucerin-logo.webp";
import svrLogo from "@/assets/brands/svr-logo.webp";
import cetaphilLogo from "@/assets/brands/cetaphil-logo.webp";
import biodermaLogo from "@/assets/brands/bioderma-logo.webp";
import bourjoisLogo from "@/assets/brands/bourjois-logo.webp";
import essenceLogo from "@/assets/brands/essence-logo.webp";
import isadoraLogo from "@/assets/brands/isadora-logo.webp";

const brands = [
  {
    id: "vichy",
    name: "Vichy",
    logo: vichyLogo,
    href: "/brands/vichy",
  },
  {
    id: "eucerin",
    name: "Eucerin",
    logo: eucerinLogo,
    href: "/brands/eucerin",
  },
  {
    id: "svr",
    name: "SVR",
    logo: svrLogo,
    href: "/brands/svr",
  },
  {
    id: "cetaphil",
    name: "Cetaphil",
    logo: cetaphilLogo,
    href: "/brands/cetaphil",
  },
  {
    id: "bioderma",
    name: "Bioderma",
    logo: biodermaLogo,
    href: "/brands/bioderma",
  },
  {
    id: "bourjois",
    name: "Bourjois",
    logo: bourjoisLogo,
    href: "/brands/bourjois",
  },
  {
    id: "essence",
    name: "Essence",
    logo: essenceLogo,
    href: "/brands/essence",
  },
  {
    id: "isadora",
    name: "IsaDora",
    logo: isadoraLogo,
    href: "/brands/isadora",
  },
];

export const FeaturedBrands = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-cream/20 to-white overflow-hidden relative">
      {/* Top decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="luxury-container relative">
        {/* Section Header */}
        <AnimatedSection
          className="text-center mb-12"
          animation="slide-up"
          duration={800}
        >
          {/* Icon badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full 
            bg-gradient-to-br from-gold/20 via-gold/10 to-transparent 
            border-2 border-gold/30 mb-4
            shadow-[0_2px_10px_rgba(212,175,55,0.2),inset_0_1px_0_rgba(255,255,255,0.5)]">
            <Sparkles className="w-6 h-6 text-gold drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]" />
          </div>

          <span className="font-script text-2xl text-gold mb-2 block drop-shadow-[0_1px_2px_rgba(212,175,55,0.3)]">
            {isArabic ? "علامات تجارية فاخرة" : "Luxury Brands"}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {isArabic ? "العلامات المميزة" : "Featured Brands"}
          </h2>

          {/* Luxury divider */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/60" />
            <div className="w-2 h-2 rounded-full bg-gold/60 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/60" />
          </div>
        </AnimatedSection>

        {/* Carousel Container */}
        <AnimatedSection animation="fade-up" delay={200} duration={900}>
          <div className="relative group">
            {/* Navigation Arrows - Desktop */}
            <button
              onClick={() => scroll("left")}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                w-12 h-12 rounded-full 
                bg-gradient-to-br from-white to-cream/80
                border-2 border-gold/30 hover:border-gold/60
                items-center justify-center text-burgundy hover:text-gold 
                transition-all duration-500 
                opacity-0 group-hover:opacity-100 
                shadow-[0_4px_15px_rgba(212,175,55,0.15)]
                hover:shadow-[0_6px_25px_rgba(212,175,55,0.3)]
                hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
                w-12 h-12 rounded-full 
                bg-gradient-to-br from-white to-cream/80
                border-2 border-gold/30 hover:border-gold/60
                items-center justify-center text-burgundy hover:text-gold 
                transition-all duration-500 
                opacity-0 group-hover:opacity-100 
                shadow-[0_4px_15px_rgba(212,175,55,0.15)]
                hover:shadow-[0_6px_25px_rgba(212,175,55,0.3)]
                hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scrollable Brands */}
            <div
              ref={scrollRef}
              className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={brand.href}
                  className="group/brand flex-shrink-0"
                >
                  {/* Brand Card */}
                  <div className="relative w-40 lg:w-48 rounded-xl p-6 lg:p-8 
                    bg-gradient-to-br from-white via-cream/30 to-white
                    border border-gold/20 
                    transition-all duration-500 
                    hover:border-gold/50 
                    hover:bg-gradient-to-br hover:from-white hover:via-gold/5 hover:to-white
                    shadow-[0_2px_10px_rgba(212,175,55,0.08)]
                    hover:shadow-[0_8px_30px_rgba(212,175,55,0.2),0_4px_15px_rgba(212,175,55,0.1)]
                    hover:scale-[1.02]
                    text-center overflow-hidden">
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover/brand:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 -translate-x-full group-hover/brand:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
                    </div>

                    {/* Top accent line */}
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover/brand:opacity-100 transition-opacity duration-500" />

                    {/* Brand Logo */}
                    <div className="relative h-20 lg:h-24 flex items-center justify-center mb-4">
                      <LazyImage
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain transition-all duration-500 group-hover/brand:scale-110 group-hover/brand:drop-shadow-[0_4px_8px_rgba(212,175,55,0.2)]"
                        loading="lazy"
                        width={150}
                        height={80}
                        skeletonClassName="rounded"
                      />
                    </div>

                    {/* Shop Link - appears on hover */}
                    <span className="font-body text-xs uppercase tracking-widest text-burgundy/60 
                      group-hover/brand:text-gold transition-colors duration-500
                      drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      {isArabic ? "تسوق الآن" : "Shop Now"}
                    </span>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover/brand:opacity-100 transition-opacity duration-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* View All Brands Link */}
        <AnimatedSection
          animation="zoom"
          delay={500}
          duration={800}
          className="text-center mt-10"
        >
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 
              px-6 py-3 rounded-full
              font-body text-sm text-burgundy 
              uppercase tracking-widest 
              border border-gold/30 hover:border-gold/60
              bg-gradient-to-r from-transparent via-gold/5 to-transparent
              hover:bg-gradient-to-r hover:from-gold/10 hover:via-gold/20 hover:to-gold/10
              hover:text-gold
              transition-all duration-500 
              shadow-[0_2px_10px_rgba(212,175,55,0.1)]
              hover:shadow-[0_4px_20px_rgba(212,175,55,0.25)]
              group"
          >
            {isArabic ? "عرض جميع العلامات" : "View All Brands"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
          </Link>
        </AnimatedSection>
      </div>

      {/* Bottom decorative accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
};
