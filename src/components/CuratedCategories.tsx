import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Baby, Droplets, Flower2, Sparkle } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const categories = [
  {
    id: "clinical-skincare",
    name: "Clinical Skincare",
    nameAr: "العناية السريرية",
    icon: Droplets,
    href: "/collections/skin-care",
  },
  {
    id: "niche-fragrance",
    name: "Niche Fragrance",
    nameAr: "العطور الفاخرة",
    icon: Flower2,
    href: "/collections/fragrances",
  },
  {
    id: "dermo-hair",
    name: "Dermo-Hair",
    nameAr: "العناية بالشعر",
    icon: Sparkle,
    href: "/collections/hair-care",
  },
  {
    id: "mother-child",
    name: "Mother & Child",
    nameAr: "الأم والطفل",
    icon: Baby,
    href: "/collections/body-care",
  },
];

export const CuratedCategories = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="luxury-container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {isArabic ? "المجموعات الحصرية" : "Concierge Collections"}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </AnimatedSection>

        {/* Circular Category Cards */}
        <div
          className="flex md:grid md:grid-cols-4 gap-8 lg:gap-12 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => (
            <AnimatedSection
              key={category.id}
              animation="fade-up"
              delay={index * 100}
            >
              <Link
                to={category.href}
                className="group flex flex-col items-center flex-shrink-0"
              >
                {/* Circular Icon Container - Instagram-style gradient */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border border-gold/40 transition-all duration-400 group-hover:border-gold group-hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] bg-gradient-to-br from-cream via-white to-cream flex items-center justify-center">
                  {/* Inner circle for depth */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-cream/80 shadow-inner" />
                  <category.icon
                    className="relative z-10 w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 text-burgundy/80 transition-all duration-400 group-hover:text-burgundy group-hover:scale-110"
                    strokeWidth={1.2}
                  />
                </div>

                {/* Category Label */}
                <span className="mt-4 md:mt-5 font-display text-sm md:text-base text-foreground text-center transition-colors duration-400 group-hover:text-gold">
                  {isArabic ? category.nameAr : category.name}
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
