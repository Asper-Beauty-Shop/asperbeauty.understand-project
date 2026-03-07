import { ShieldCheck, Award, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Zone 5 — Clinical Truth Banner
 * Deep Maroon banner with three Shiny Gold trust pillars.
 */
export default function ClinicalTruthBanner() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const pillars = [
    {
      icon: ShieldCheck,
      title: isAr ? "جودة أصيلة" : "Authentic Quality",
      description: isAr
        ? "سلسلة توريد موثّقة ١٠٠٪ من موزّعين معتمدين."
        : "100% verified supply chain from authorized distributors.",
    },
    {
      icon: Award,
      title: isAr ? "معتمد طبياً" : "Dermatologist Approved",
      description: isAr
        ? "تركيبات مصمّمة للبشرة الحساسة ومُختبرة سريرياً."
        : "Formulated for sensitive skin and clinically tested.",
    },
    {
      icon: Sparkles,
      title: isAr ? "تجربة سبا الصباح" : "Morning Spa Experience",
      description: isAr
        ? "ملمس فاخر، نتائج طبية — جمال بلا تنازل."
        : "Luxury textures, clinical results — beauty without compromise.",
    },
  ];

  return (
    <section className="bg-burgundy py-16 md:py-20">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: LUXURY_EASE }}
            >
              <div className="w-14 h-14 rounded-full border border-polished-gold/40 flex items-center justify-center mb-5">
                <pillar.icon className="h-6 w-6 text-polished-gold" strokeWidth={1.2} />
              </div>
              <h3 className={cn(
                "font-heading text-lg md:text-xl font-semibold text-polished-gold mb-2",
                isAr && "font-arabic"
              )}>
                {pillar.title}
              </h3>
              <p className={cn(
                "font-body text-sm text-primary-foreground/75 leading-relaxed max-w-xs",
                isAr && "font-arabic"
              )}>
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
