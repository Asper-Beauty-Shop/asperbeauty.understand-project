import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

const PROTOCOLS = [
  {
    id: "acne",
    en: "The Acne Protocol",
    ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø­Ø¨ Ø§Ù„Ø´Ø¨Ø§Ø¨",
    ingredients: { en: "Salicylic Acid Â· Niacinamide Â· Zinc", ar: "Ø­Ù…Ø¶ Ø§Ù„Ø³Ø§Ù„ÙŠØ³ÙŠÙ„ÙŠÙƒ Â· Ù†ÙŠØ§Ø³ÙŠÙ†Ø§Ù…ÙŠØ¯ Â· Ø²Ù†Ùƒ" },
    image: "/assets/luxury-asset-1.png",
    href: "/concerns/acne",
  },
  {
    id: "repair",
    en: "Cellular Repair",
    ar: "Ø¥ØµÙ„Ø§Ø­ Ø®Ù„ÙˆÙŠ",
    ingredients: { en: "Retinol Â· Peptides Â· Ceramides", ar: "Ø±ÙŠØªÙŠÙ†ÙˆÙ„ Â· Ø¨Ø¨ØªÙŠØ¯Ø§Øª Â· Ø³ÙŠØ±Ø§Ù…ÙŠØ¯Ø§Øª" },
    image: "/editorial-showcase-1.jpg?w=600&q=80&auto=format&fit=crop",
    href: "/concerns/anti-aging",
  },
  {
    id: "barrier",
    en: "Barrier Defense",
    ar: "Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø­Ø§Ø¬Ø²",
    ingredients: { en: "Ceramides Â· Squalane Â· Panthenol", ar: "Ø³ÙŠØ±Ø§Ù…ÙŠØ¯Ø§Øª Â· Ø³ÙƒÙˆØ§Ù„ÙŠÙ† Â· Ø¨Ø§Ù†Ø«ÙŠÙ†ÙˆÙ„" },
    image: "/assets/luxury-asset-2.png",
    href: "/concerns/sensitivity",
  },
  {
    id: "radiance",
    en: "Radiance Revival",
    ar: "Ø¥Ø­ÙŠØ§Ø¡ Ø§Ù„Ø¥Ø´Ø±Ø§Ù‚",
    ingredients: { en: "Vitamin C Â· AHA Â· Arbutin", ar: "ÙÙŠØªØ§Ù…ÙŠÙ† Ø³ÙŠ Â· Ø£Ø­Ù…Ø§Ø¶ Ø§Ù„ÙØ§ Â· Ø£Ø±Ø¨ÙˆØªÙŠÙ†" },
    image: "/assets/luxury-asset-3.png",
    href: "/concerns/pigmentation",
  },
  {
    id: "sun",
    en: "Sun Shield",
    ar: "Ø§Ù„Ø­Ù…Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø´Ù…Ø³",
    ingredients: { en: "SPF 50+ Â· Tinosorb Â· Vitamin E", ar: "SPF 50+ Â· ØªÙŠÙ†ÙˆØ³ÙˆØ±Ø¨ Â· ÙÙŠØªØ§Ù…ÙŠÙ† Ø¥ÙŠ" },
    image: "/assets/luxury-asset-4.png",
    href: "/collections/suncare",
  },
  {
    id: "hydration",
    en: "Deep Hydration",
    ar: "ØªØ±Ø·ÙŠØ¨ Ø¹Ù…ÙŠÙ‚",
    ingredients: { en: "Hyaluronic Acid Â· B5 Â· Aloe", ar: "Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ Ø£Ø³ÙŠØ¯ Â· B5 Â· Ø£Ù„ÙˆÙÙŠØ±Ø§" },
    image: "/assets/luxury-asset-5.png",
    href: "/concerns/dryness",
  },
];

export const ShopByProtocol = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        <AnimatedSection className="text-center mb-14" animation="fade-up">
          <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-3 block">
            {isArabic ? "ØªØ³ÙˆÙ‚ÙŠ Ø­Ø³Ø¨ Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„" : "Shop by Protocol"}
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl text-asper-ink font-bold">
            {isArabic ? "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„Ø§Øª Ø¹Ù†Ø§ÙŠØªÙƒ" : "Your Skincare Protocols"}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-polished-gold/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-polished-gold/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-polished-gold/60" />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {PROTOCOLS.map((protocol) => (
              <Link
                key={protocol.id}
                to={protocol.href}
                className="group relative aspect-[4/5] overflow-hidden"
                onMouseEnter={() => setHoveredId(protocol.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image */}
                <img
                  src={protocol.image}
                  alt={isArabic ? protocol.ar : protocol.en}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/70 via-asper-ink/20 to-transparent" />

                {/* Gold border on hover */}
                <div
                  className={cn(
                    "absolute inset-0 border-2 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none z-10",
                    hoveredId === protocol.id
                      ? "border-polished-gold opacity-100"
                      : "border-transparent opacity-0"
                  )}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="font-heading text-xl lg:text-2xl font-bold text-polished-white mb-2 tracking-tight">
                    {isArabic ? protocol.ar : protocol.en}
                  </h3>

                  {/* Ingredients reveal on hover */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                      hoveredId === protocol.id ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="font-body text-xs text-polished-gold tracking-wider uppercase">
                      {isArabic ? protocol.ingredients.ar : protocol.ingredients.en}
                    </p>
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

