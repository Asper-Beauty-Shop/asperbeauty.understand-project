import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck, Stethoscope, Truck } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { ADVANTAGES } from "@/lib/advantagesContent";

const ICON_MAP = {
  shield: ShieldCheck,
  stethoscope: Stethoscope,
  truck: Truck,
} as const;

const trustItems = ADVANTAGES.map((a) => ({
  ...a,
  icon: ICON_MAP[a.iconKey],
}));

export const TrustBanner = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-10 md:py-12 bg-gradient-to-r from-burgundy via-burgundy to-burgundy-light overflow-hidden relative">
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/60 to-transparent" />

      {/* Decorative gold glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-polished-gold/5 via-transparent to-polished-gold/5 pointer-events-none" />

      <div className="luxury-container relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {trustItems.map((item, index) => (
            <AnimatedSection
              key={item.id}
              animation={index === 0 ? "fade-left" : index === 2 ? "fade-right" : "fade-up"}
              delay={index * 150}
            >
              <div
                className={`group flex items-center gap-4 ${isArabic ? "flex-row-reverse" : ""} 
                  px-6 py-4 rounded-xl
                  bg-gradient-to-br from-polished-gold/10 via-polished-gold/5 to-transparent
                  border border-polished-gold/20 hover:border-polished-gold/40
                  backdrop-blur-sm
                  transition-all duration-500 ease-out
                  hover:bg-gradient-to-br hover:from-polished-gold/20 hover:via-polished-gold/10 hover:to-polished-gold/5
                  hover:shadow-[0_4px_20px_hsl(var(--polished-gold)/0.25),inset_0_1px_0_hsl(var(--polished-gold)/0.3)]
                  hover:scale-[1.02]`}
              >
                {/* Icon Badge */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-polished-gold/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150" />
                  <div className="relative w-14 h-14 rounded-full 
                    bg-gradient-to-br from-polished-gold/30 via-polished-gold/20 to-polished-gold/10
                    border-2 border-polished-gold/40 group-hover:border-polished-gold/60
                    flex items-center justify-center
                    shadow-[0_2px_10px_hsl(var(--polished-gold)/0.2),inset_0_1px_0_hsl(var(--polished-white)/0.2)]
                    group-hover:shadow-[0_4px_20px_hsl(var(--polished-gold)/0.4),inset_0_1px_0_hsl(var(--polished-white)/0.3)]
                    transition-all duration-500
                    group-hover:scale-110">
                    <item.icon
                      className="w-7 h-7 text-polished-gold drop-shadow-[0_2px_4px_hsl(var(--polished-gold)/0.5)] 
                        group-hover:drop-shadow-[0_4px_8px_hsl(var(--polished-gold)/0.7)]
                        transition-all duration-500"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Text content */}
                <div className={`${isArabic ? "text-right" : "text-left"}`}>
                  <h3 className="font-display text-sm lg:text-base text-asper-stone-light font-medium 
                    drop-shadow-[0_1px_2px_hsl(var(--asper-ink)/0.3)]
                    group-hover:text-polished-gold transition-colors duration-500">
                    {isArabic ? item.titleAr : item.title}
                  </h3>
                  <p className="font-body text-xs lg:text-sm text-asper-stone-light/70 mt-0.5
                    group-hover:text-asper-stone-light/90 transition-colors duration-500">
                    {isArabic ? item.descriptionAr : item.description}
                  </p>
                </div>

                {/* Separator */}
                {index < trustItems.length - 1 && (
                  <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-polished-gold/40 to-transparent" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-polished-gold/60" />
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Bottom gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/60 to-transparent" />
    </section>
  );
};

