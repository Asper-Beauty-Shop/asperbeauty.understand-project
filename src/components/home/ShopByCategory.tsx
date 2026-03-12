import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";

const CATEGORIES = [
  {
    id: "perfume",
en: "Perfume",
    ar: "عطور",
    icon: "https://placehold.co/120x120/FAF7F2/800020?text=🌸",
    href: "/collections/perfume",
  },
  {
    id: "skincare",
    en: "Skincare",
    ar: "العناية بالبشرة",
    icon: "https://placehold.co/120x120/FAF7F2/800020?text=✨",
    href: "/collections/skincare",
  },
  {
    id: "makeup",
    en: "Makeup",
    ar: "مكياج",
    icon: "https://placehold.co/120x120/FAF7F2/800020?text=💄",
    href: "/collections/makeup",
  },
  {
    id: "hair",
    en: "Hair",
    ar: "العناية بالشعر",
    icon: "https://placehold.co/120x120/FAF7F2/800020?text=💇",
    href: "/collections/hair",
  },
  {
    id: "body",
    en: "Body",
    ar: "العناية بالجسم",
    icon: "https://placehold.co/120x120/FAF7F2/800020?text=🧴",
    href: "/collections/body",
  },
  {
    id: "suncare",
    en: "Sun Care",
    ar: "حماية من الشمس",
    icon: "https://placehold.co/120x120/FAF7F2/800020?text=☀️",
    href: "/collections/suncare",
  },
];

export const ShopByCategory = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-16 lg:py-20 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        <AnimatedSection className="text-center mb-12" animation="fade-up">
          <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-3 block">
            {isArabic ? "تسوقي حسب الفئة" : "Browse by Category"}
          </span>
          <h2 className="font-display text-2xl lg:text-3xl text-asper-ink">
            {isArabic ? "اكتشفي مجموعاتنا" : "Shop by Category"}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-polished-gold/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-polished-gold/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-polished-gold/60" />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          {/* 1. CSS Grid Implementation (Strict Mandate) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={category.href}
                className="group relative flex flex-col items-center gap-4 p-6 bg-white border border-border/40 transition-all duration-500 hover:shadow-[0_15px_40px_-10px_rgba(128,0,32,0.1)] hover:border-polished-gold/30 rounded-sm"
                data-testid={`category-card-${category.id}`}
              >
                {/* Circle icon with negative space */}
                <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-polished-gold/10 group-hover:border-polished-gold/40 transition-all duration-700 group-hover:scale-110 p-1 bg-asper-stone shadow-inner">
                  <img
                    src={category.icon}
                    alt={isArabic ? category.ar : category.en}
                    className="h-full w-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-asper-ink group-hover:text-burgundy transition-colors duration-300 text-center">
                  {isArabic ? category.ar : category.en}
                </span>
                
                {/* Discover accent */}
                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 pt-2">
                   <div className="h-0.5 w-8 bg-burgundy rounded-full mx-auto" />
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

