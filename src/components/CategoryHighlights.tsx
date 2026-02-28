import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Spotlight images - WebP for better compression
import skinCareSpotlight from "@/assets/spotlights/skin-care-spotlight.webp";
import hairCareSpotlight from "@/assets/spotlights/hair-care-spotlight.webp";
import makeUpSpotlight from "@/assets/spotlights/make-up-spotlight.webp";

const categories = [
  {
    id: "skin-care",
    nameEn: "Skin Care",
    nameAr: "العناية بالبشرة",
    image: skinCareSpotlight,
    href: "/collections/skin-care",
  },
  {
    id: "hair-care",
    nameEn: "Hair Care",
    nameAr: "العناية بالشعر",
    image: hairCareSpotlight,
    href: "/collections/hair-care",
  },
  {
    id: "make-up",
    nameEn: "Make Up",
    nameAr: "المكياج",
    image: makeUpSpotlight,
    href: "/collections/make-up",
  },
];

export const CategoryHighlights = () => {
  const { language } = useLanguage();

  return (
    <section className="py-12 bg-soft-ivory border-t border-gray-200">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-dark-charcoal mb-4">
            {language === "ar" ? "تسوقي حسب الفئة" : "Shop By Category"}
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-shiny-gold to-transparent mx-auto" />
        </div>

        {/* Category Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative overflow-hidden rounded-xl aspect-[4/5] md:aspect-[3/4]"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={language === "ar" ? category.nameAr : category.nameEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width={600}
                height={800}
              />

              {/* Dark Charcoal Overlay */}
              <div className="absolute inset-0 bg-dark-charcoal/50 transition-opacity duration-300 group-hover:bg-dark-charcoal/40" />

              {/* Category Name */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-shiny-gold drop-shadow-lg mb-4 transition-transform duration-300 group-hover:scale-105">
                    {language === "ar" ? category.nameAr : category.nameEn}
                  </h3>
                  <span className="inline-block px-6 py-2 border border-shiny-gold text-shiny-gold font-display text-sm tracking-wider opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {language === "ar" ? "تسوقي الآن" : "Shop Now"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
