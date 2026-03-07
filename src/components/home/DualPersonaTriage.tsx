import { Link } from "react-router-dom";
import { Stethoscope, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Zone 2 — Dual-Persona Triage
 * Segments user intent before exposing 5,000+ SKUs.
 * Dr. Sami (Clinical) vs Ms. Zain (Aesthetic) with shimmer hover effect.
 */
export default function DualPersonaTriage() {
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="w-full bg-asper-stone py-20 px-4 md:px-8 border-b border-foreground/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: LUXURY_EASE }}
        >
          <h2 className={cn(
            "font-heading text-3xl md:text-4xl text-foreground mb-4",
            isAr && "font-arabic"
          )}>
            {isAr ? "مُصمّم لخارطة بشرتك" : "Curated for Your Skin's Blueprint"}
          </h2>
          <p className={cn(
            "text-muted-foreground font-body max-w-2xl mx-auto text-lg font-light",
            isAr && "font-arabic"
          )}>
            {isAr
              ? "تخطّي البحث. تواصلي مع مستشارينا الأذكياء لتصفية آلاف المنتجات وصولاً لروتينك المثالي."
              : "Skip the search. Connect with our intelligent consultants to filter thousands of dermo-cosmetics down to your perfect routine."}
          </p>
        </motion.div>

        {/* The Dual-Persona Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Card A: Dr. Sami (Clinical / Repair) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: LUXURY_EASE }}
          >
            <Link
              to="/skin-concerns"
              className="group relative bg-card p-10 md:p-14 border border-border flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/5 hover:-translate-y-1 cursor-pointer overflow-hidden block"
            >
              {/* Clinical Shimmer Beam */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-card/60 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />

              <div className="w-16 h-16 rounded-full bg-asper-stone flex items-center justify-center mb-6 border border-foreground/10 text-foreground group-hover:bg-burgundy group-hover:text-primary-foreground transition-colors duration-300">
                <Stethoscope size={28} strokeWidth={1.2} />
              </div>

              <h3 className={cn(
                "font-heading text-2xl text-foreground mb-3",
                isAr && "font-arabic"
              )}>
                {isAr ? "إصلاح وحماية" : "Repair & Protect"}
              </h3>
              <p className={cn(
                "text-muted-foreground font-body text-sm md:text-base mb-8 flex-grow leading-relaxed",
                isAr && "font-arabic"
              )}>
                {isAr ? (
                  <>استشيري <span className="font-semibold text-foreground">الدكتور سامي</span>. تركيز على إصلاح حاجز البشرة، البشرة الحساسة، المكونات الفعّالة، والفعالية الطبية.</>
                ) : (
                  <>Consult with <span className="font-semibold text-foreground">Dr. Sami</span>. Focus on barrier repair, sensitive skin concerns, active ingredients, and dermatological efficacy.</>
                )}
              </p>

              <span className={cn(
                "flex items-center gap-2 text-foreground font-semibold tracking-wide text-sm border-b border-transparent group-hover:border-foreground transition-all duration-300 pb-1",
                isAr && "flex-row-reverse"
              )}>
                {isAr ? "ابدئي الاستشارة الطبية" : "START CLINICAL CONSULTATION"}
                <ArrowRight size={16} className={cn(dir === "rtl" && "rotate-180")} />
              </span>
            </Link>
          </motion.div>

          {/* Card B: Ms. Zain (Aesthetic / Glow) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: LUXURY_EASE }}
          >
            <Link
              to="/skin-concerns"
              className="group relative bg-asper-stone p-10 md:p-14 border border-polished-gold/30 flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl hover:shadow-polished-gold/10 hover:-translate-y-1 cursor-pointer overflow-hidden block"
            >
              {/* Luxury Shimmer Beam */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-polished-gold/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />

              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-6 border border-polished-gold/40 text-polished-gold group-hover:bg-polished-gold group-hover:text-card transition-colors duration-300">
                <Sparkles size={28} strokeWidth={1.2} />
              </div>

              <h3 className={cn(
                "font-heading text-2xl text-foreground mb-3",
                isAr && "font-arabic"
              )}>
                {isAr ? "إشراقة وتألق" : "Glow & Enhance"}
              </h3>
              <p className={cn(
                "text-muted-foreground font-body text-sm md:text-base mb-8 flex-grow leading-relaxed",
                isAr && "font-arabic"
              )}>
                {isAr ? (
                  <>تحدّثي مع <span className="font-semibold text-foreground">مس زين</span>. اكتشفي درجاتك المثالية، اللمسات المضيئة، وجمالية "سبا الصباح".</>
                ) : (
                  <>Chat with <span className="font-semibold text-foreground">Ms. Zain</span>. Discover your perfect shade matches, luminous finishes, and the ultimate "Morning Spa" aesthetic.</>
                )}
              </p>

              <span className={cn(
                "flex items-center gap-2 text-polished-gold font-semibold tracking-wide text-sm border-b border-transparent group-hover:border-polished-gold transition-all duration-300 pb-1",
                isAr && "flex-row-reverse"
              )}>
                {isAr ? "ابدئي استشارة الجمال" : "START BEAUTY CONSULTATION"}
                <ArrowRight size={16} className={cn(dir === "rtl" && "rotate-180")} />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
