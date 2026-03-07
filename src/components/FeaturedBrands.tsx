import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { CLINICAL_AUTHORITY_BRANDS, AESTHETIC_LUXURY_BRANDS } from "@/constants/premiumBrands";

/**
 * Zone: Clinical Vogue Brand Footer
 * Monochrome, editorial-spaced brand names — no loud logos.
 * Opacity 60% → 100% on hover. All text remains charcoal or gold.
 */

const ALL_FOOTER_BRANDS = [
  ...CLINICAL_AUTHORITY_BRANDS.map((name) => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    tier: "clinical" as const,
  })),
  ...AESTHETIC_LUXURY_BRANDS.map((name) => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    tier: "luxury" as const,
  })),
];

export const FeaturedBrands = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-20 lg:py-28 bg-asper-stone relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16" animation="fade-up">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
            {isArabic ? "شركاء العلامة" : "Our Brand Partners"}
          </span>
          <h2 className="font-heading text-2xl lg:text-3xl text-asper-ink font-bold mb-6">
            {isArabic ? "علامات مختارة بعناية" : "Curated with Precision"}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-polished-gold/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-polished-gold/50" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-polished-gold/50" />
          </div>
        </AnimatedSection>

        {/* Monochrome Brand Ticker — Extreme Spacing */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="flex flex-wrap items-center justify-center gap-x-16 lg:gap-x-24 gap-y-8">
            {ALL_FOOTER_BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="group transition-all duration-500"
              >
                <span
                  className="font-heading text-lg lg:text-xl tracking-[0.08em] opacity-50 group-hover:opacity-100 transition-all duration-500 text-asper-ink group-hover:text-polished-gold"
                  style={{
                    /* Monochrome filter effect via text color only — no logo images */
                  }}
                >
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </AnimatedSection>

        {/* View All */}
        <AnimatedSection animation="fade-up" delay={400} className="text-center mt-14">
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-burgundy hover:text-polished-gold border-b border-burgundy/30 hover:border-polished-gold/60 pb-1 transition-all duration-500"
          >
            {isArabic ? "عرض جميع العلامات" : "View All Brands"}
          </Link>
        </AnimatedSection>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
};
