import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

const PROTOCOLS = [
  {
    id: "acne",
    en: "The Acne Protocol",
    ar: "بروتوكول حب الشباب",
    ingredients: { en: "Salicylic Acid · Niacinamide · Zinc", ar: "حمض الساليسيليك · نياسيناميد · زنك" },
    image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=600&q=80&auto=format&fit=crop",
    href: "/concerns/acne",
  },
  {
    id: "repair",
    en: "Cellular Repair",
    ar: "إصلاح خلوي",
    ingredients: { en: "Retinol · Peptides · Ceramides", ar: "ريتينول · ببتيدات · سيراميدات" },
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4ee4037?w=600&q=80&auto=format&fit=crop",
    href: "/concerns/anti-aging",
  },
  {
    id: "barrier",
    en: "Barrier Defense",
    ar: "حماية الحاجز",
    ingredients: { en: "Ceramides · Squalane · Panthenol", ar: "سيراميدات · سكوالين · بانثينول" },
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80&auto=format&fit=crop",
    href: "/concerns/sensitivity",
  },
  {
    id: "radiance",
    en: "Radiance Revival",
    ar: "إحياء الإشراق",
    ingredients: { en: "Vitamin C · AHA · Arbutin", ar: "فيتامين سي · أحماض الفا · أربوتين" },
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80&auto=format&fit=crop",
    href: "/concerns/pigmentation",
  },
  {
    id: "sun",
    en: "Sun Shield",
    ar: "الحماية من الشمس",
    ingredients: { en: "SPF 50+ · Tinosorb · Vitamin E", ar: "SPF 50+ · تينوسورب · فيتامين إي" },
    image: "https://images.unsplash.com/photo-1532947974358-a218d18d8d14?w=600&q=80&auto=format&fit=crop",
    href: "/collections/suncare",
  },
  {
    id: "hydration",
    en: "Deep Hydration",
    ar: "ترطيب عميق",
    ingredients: { en: "Hyaluronic Acid · B5 · Aloe", ar: "هيالورونيك أسيد · B5 · ألوفيرا" },
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80&auto=format&fit=crop",
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
            {isArabic ? "تسوقي حسب البروتوكول" : "Shop by Protocol"}
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl text-asper-ink font-bold">
            {isArabic ? "بروتوكولات عنايتك" : "Your Skincare Protocols"}
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

