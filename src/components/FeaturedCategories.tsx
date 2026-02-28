import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Category images - WebP for better compression
import skinCareImg from "@/assets/categories/skin-care.webp";
import hairCareImg from "@/assets/categories/hair-care.webp";
import bodyCareImg from "@/assets/categories/body-care.webp";
import makeUpImg from "@/assets/categories/make-up.webp";
import fragrancesImg from "@/assets/categories/fragrances.webp";
import toolsDevicesImg from "@/assets/categories/tools-devices.webp";

const categories = [
  {
    id: "skin-care",
    nameEn: "Skin Care",
    nameAr: "العناية بالبشرة",
    image: skinCareImg,
    href: "/collections/skin-care",
  },
  {
    id: "hair-care",
    nameEn: "Hair Care",
    nameAr: "العناية بالشعر",
    image: hairCareImg,
    href: "/collections/hair-care",
  },
  {
    id: "body-care",
    nameEn: "Body Care",
    nameAr: "العناية بالجسم",
    image: bodyCareImg,
    href: "/collections/body-care",
  },
  {
    id: "make-up",
    nameEn: "Make Up",
    nameAr: "المكياج",
    image: makeUpImg,
    href: "/collections/make-up",
  },
  {
    id: "fragrances",
    nameEn: "Fragrances",
    nameAr: "العطور",
    image: fragrancesImg,
    href: "/collections/fragrances",
  },
  {
    id: "tools-devices",
    nameEn: "Tools & Devices",
    nameAr: "الأدوات والأجهزة",
    image: toolsDevicesImg,
    href: "/collections/tools-devices",
  },
];

export const FeaturedCategories = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section className="py-16 bg-soft-ivory">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-dark-charcoal mb-4">
            {language === "ar" ? "تسوقي حسب الفئة" : "Shop by Category"}
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-shiny-gold to-transparent mx-auto" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-100"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={language === "ar" ? category.nameAr : category.nameEn}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                width={300}
                height={400}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Gold Border on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-shiny-gold transition-colors duration-300 rounded-xl" />

              {/* Category Name */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <h3 className="font-display text-lg md:text-xl text-white drop-shadow-lg group-hover:text-shiny-gold transition-colors duration-300">
                  {language === "ar" ? category.nameAr : category.nameEn}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm text-white/80 font-body mt-1 group-hover:text-shiny-gold transition-colors duration-300">
                  {language === "ar" ? "تسوقي الآن" : "Shop Now"}
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${
                      isRTL ? "rotate-180 group-hover:-translate-x-1" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
