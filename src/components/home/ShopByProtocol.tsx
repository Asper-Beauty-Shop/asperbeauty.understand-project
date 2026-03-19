import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

import protocolAcne from "@/assets/protocols/protocol-acne.jpg";
import protocolRepair from "@/assets/protocols/protocol-repair.jpg";
import protocolBarrier from "@/assets/protocols/protocol-barrier.jpg";
import protocolRadiance from "@/assets/protocols/protocol-radiance.jpg";
import protocolSun from "@/assets/protocols/protocol-sun.jpg";
import protocolHydration from "@/assets/protocols/protocol-hydration.jpg";

const PROTOCOLS = [
  {
    id: "acne",
    en: "The Acne Protocol",
    ar: "بروتوكول حب الشباب",
    ingredients: { en: "Salicylic Acid · Niacinamide · Zinc", ar: "حمض الساليسيليك · نياسيناميد · زنك" },
    image: protocolAcne,
    href: "/concerns/acne",
  },
  {
    id: "repair",
    en: "Cellular Repair",
    ar: "إصلاح خلوي",
    ingredients: { en: "Retinol · Peptides · Ceramides", ar: "ريتينول · ببتيدات · سيراميدات" },
    image: protocolRepair,
    href: "/concerns/anti-aging",
  },
  {
    id: "barrier",
    en: "Barrier Defense",
    ar: "حماية الحاجز",
    ingredients: { en: "Ceramides · Squalane · Panthenol", ar: "سيراميدات · سكوالين · بانثينول" },
    image: protocolBarrier,
    href: "/concerns/sensitivity",
  },
  {
    id: "radiance",
    en: "Radiance Revival",
    ar: "إحياء الإشراق",
    ingredients: { en: "Vitamin C · AHA · Arbutin", ar: "فيتامين سي · أحماض الفا · أربوتين" },
    image: protocolRadiance,
    href: "/concerns/pigmentation",
  },
  {
    id: "sun",
    en: "Sun Shield",
    ar: "الحماية من الشمس",
    ingredients: { en: "SPF 50+ · Tinosorb · Vitamin E", ar: "SPF 50+ · تينوسورب · فيتامين إي" },
    image: protocolSun,
    href: "/collections/suncare",
  },
  {
    id: "hydration",
    en: "Deep Hydration",
    ar: "ترطيب عميق",
    ingredients: { en: "Hyaluronic Acid · B5 · Aloe", ar: "هيالورونيك أسيد · B5 · ألوفيرا" },
    image: protocolHydration,
    href: "/concerns/dryness",
  },
];

export const ShopByProtocol = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-br from-background to-secondary/30">
      {/* Radial glow behind glass cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 40% 40% at 20% 30%, hsl(43 69% 46% / 0.04) 0%, transparent 60%)",
            "radial-gradient(ellipse 40% 40% at 80% 70%, hsl(43 69% 46% / 0.04) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="luxury-container relative z-10">
        <AnimatedSection className="text-center mb-14" animation="fade-up">
          <span className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3 block">
            {isArabic ? "تسوقي حسب البروتوكول" : "Targeted Skincare Protocols"}
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl text-primary font-bold">
            {isArabic ? "بروتوكولات عنايتك" : "Your Skincare Protocols"}
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto mt-4 leading-relaxed">
            {isArabic
              ? "روتينات مُصممة بدقة تضم مستحضرات طبية أصلية لمعالجة مشاكل بشرتك بفعالية سريرية."
              : "Precision-crafted routines featuring authentic dermo-cosmetics, designed to address your specific skin concerns with clinical efficacy."}
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-accent/60" />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {PROTOCOLS.map((protocol) => (
              <Link
                key={protocol.id}
                to={protocol.href}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl clinical-glass-card"
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
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

                {/* Gold border glow on hover — handled by clinical-glass-card */}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="font-heading text-xl lg:text-2xl font-bold text-primary-foreground mb-2 tracking-tight">
                    {isArabic ? protocol.ar : protocol.en}
                  </h3>

                  {/* Ingredients reveal on hover */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                      hoveredId === protocol.id ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="font-body text-xs text-accent tracking-wider uppercase">
                      {isArabic ? protocol.ingredients.ar : protocol.ingredients.en}
                    </p>
                  </div>

                  {/* View Protocol CTA */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                      hoveredId === protocol.id ? "max-h-12 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
                    )}
                  >
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-primary-foreground border-b border-accent/50 pb-0.5">
                      {isArabic ? "عرض البروتوكول ←" : "View Protocol →"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
};
