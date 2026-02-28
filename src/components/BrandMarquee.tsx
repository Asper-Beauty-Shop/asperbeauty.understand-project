import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowRight,
  Award,
  Crown,
  Gem,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

// Premium brand logos with elegant styling - High quality luxury logos
import ceraveLogo from "@/assets/brands/cerave-luxury.png";
import theOrdinaryLogo from "@/assets/brands/the-ordinary-luxury.png";
import laRochePosayLogo from "@/assets/brands/la-roche-posay-luxury.png";
import paulasChoiceLogo from "@/assets/brands/paulas-choice-luxury.png";
import olaplexLogo from "@/assets/brands/olaplex-luxury.png";
import diorLogo from "@/assets/brands/dior-luxury.png";
import esteeLauderLogo from "@/assets/brands/estee-lauder-luxury.png";
import kerastaseLogo from "@/assets/brands/kerastase-luxury.png";
import cliniqueLogo from "@/assets/brands/clinique-luxury.png";
import lancomeLogo from "@/assets/brands/lancome-luxury.png";
import yslLogo from "@/assets/brands/ysl-luxury.png";

const BRANDS = [
  { name: "Dior", logo: diorLogo },
  { name: "Estée Lauder", logo: esteeLauderLogo },
  { name: "Lancôme", logo: lancomeLogo },
  { name: "YSL Beauty", logo: yslLogo },
  { name: "Clinique", logo: cliniqueLogo },
  { name: "Kérastase", logo: kerastaseLogo },
  { name: "La Roche-Posay", logo: laRochePosayLogo },
  { name: "CeraVe", logo: ceraveLogo },
  { name: "The Ordinary", logo: theOrdinaryLogo },
  { name: "Paula's Choice", logo: paulasChoiceLogo },
  { name: "Olaplex", logo: olaplexLogo },
];

export const BrandMarquee = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="w-full bg-gradient-to-b from-cream to-background py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Elegant Header with Premium Icons */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/60" />
            <div className="relative flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold/70 animate-pulse" />
              <div className="relative">
                <Crown
                  className="w-8 h-8 md:w-10 md:h-10 text-gold drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                  strokeWidth={1.5}
                />
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
              </div>
              <Sparkles
                className="w-4 h-4 text-gold/70 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
            <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <p className="font-serif text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {isAr ? "موزع معتمد للعلامات الفاخرة" : "Authorized Luxury Retailer"}
          </p>
        </div>

        {/* Luxury Brand Grid - Show first 8 on large screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 md:gap-6">
          {BRANDS.slice(0, 6).map((brand, index) => (
            <div
              key={brand.name}
              className="group relative flex items-center justify-center p-6 md:p-8 
                         bg-white/80 backdrop-blur-sm rounded-xl
                         border border-cream-dark/50 
                         shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)]
                         hover:shadow-[0_8px_32px_-4px_rgba(212,175,55,0.25)]
                         hover:border-gold/60
                         transition-all duration-500 ease-out
                         hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subtle gold glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-light/0 to-gold/0 
                              group-hover:from-gold-light/25 group-hover:to-gold/15 
                              transition-all duration-500" />

              {/* Floating Gem Icon - appears on hover */}
              <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 
                              transform translate-y-2 group-hover:translate-y-0
                              transition-all duration-500 ease-out z-10">
                <div className="relative">
                  {/* Gem glow */}
                  <div className="absolute inset-0 bg-gold/40 rounded-full blur-lg scale-150 animate-pulse" />
                  <div
                    className="relative w-8 h-8 rounded-full 
                                  bg-gradient-to-br from-gold via-gold-light to-gold
                                  flex items-center justify-center
                                  shadow-[0_4px_15px_rgba(212,175,55,0.5)]
                                  animate-bounce"
                    style={{ animationDuration: "2s" }}
                  >
                    <Gem className="w-4 h-4 text-burgundy" strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Sparkle particles on hover */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <Sparkles className="absolute top-2 left-2 w-3 h-3 text-gold/0 group-hover:text-gold/60 
                             transition-all duration-700 group-hover:animate-pulse" />
                <Sparkles
                  className="absolute bottom-2 right-2 w-3 h-3 text-gold/0 group-hover:text-gold/60 
                             transition-all duration-700 group-hover:animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>

              <img
                src={brand.logo}
                alt={`${brand.name} Logo`}
                className="relative h-8 md:h-10 w-auto max-w-full object-contain 
                           filter grayscale opacity-70
                           group-hover:grayscale-0 group-hover:opacity-100
                           transition-all duration-500 ease-out
                           group-hover:scale-105"
                onError={(e) => {
                  // Elegant text fallback with luxury styling
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    const fallback = document.createElement("span");
                    fallback.className =
                      "relative font-serif text-sm md:text-base font-medium text-foreground/80 tracking-wider group-hover:text-burgundy transition-colors duration-300";
                    fallback.textContent = brand.name;
                    e.currentTarget.parentElement.appendChild(fallback);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* View All Brands Button */}
        <div className="flex justify-center mt-10 md:mt-14">
          <Link
            to="/brands"
            className="group relative inline-flex items-center gap-3 px-8 py-4
                       bg-gradient-to-r from-burgundy via-burgundy to-burgundy-dark
                       hover:from-burgundy-dark hover:via-burgundy hover:to-burgundy
                       text-cream font-medium tracking-wider uppercase text-sm
                       rounded-full overflow-hidden
                       shadow-[0_4px_20px_-4px_rgba(74,14,25,0.4)]
                       hover:shadow-[0_8px_30px_-4px_rgba(74,14,25,0.6)]
                       transition-all duration-500 ease-out
                       hover:scale-105 hover:-translate-y-1"
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                            bg-gradient-to-r from-transparent via-white/20 to-transparent
                            transition-transform duration-1000 ease-out" />

            {/* Button content */}
            <Crown
              className="w-5 h-5 text-gold drop-shadow-[0_1px_4px_rgba(212,175,55,0.5)]"
              strokeWidth={1.5}
            />
            <span className="relative">
              {isAr ? "استكشف جميع العلامات التجارية" : "View All Brands"}
            </span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />

            {/* Decorative sparkles */}
            <Sparkles className="absolute top-1 right-3 w-3 h-3 text-gold/60 opacity-0 
                                 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          </Link>
        </div>

        {/* Bottom decorative element with Premium Icons */}
        <div className="flex items-center justify-center gap-3 mt-10 md:mt-14">
          <div className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 rounded-full border border-gold/20">
            <ShieldCheck
              className="w-5 h-5 md:w-6 md:h-6 text-gold drop-shadow-[0_1px_4px_rgba(212,175,55,0.3)]"
              strokeWidth={1.5}
            />
            <span className="text-gold text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase">
              {isAr ? "أصالة مضمونة" : "Authenticity Guaranteed"}
            </span>
            <Award
              className="w-5 h-5 md:w-6 md:h-6 text-gold drop-shadow-[0_1px_4px_rgba(212,175,55,0.3)]"
              strokeWidth={1.5}
            />
          </div>
          <div className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent via-gold/40 to-gold/60" />
        </div>
      </div>
    </section>
  );
};
