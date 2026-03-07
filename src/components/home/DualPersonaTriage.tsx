import { useNavigate } from "react-router-dom";
import { Stethoscope, Sparkles, ArrowRight, Shield, Flower2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Zone 2 — Dual-Persona Triage
 * Large, editorial-scale persona cards with visual impact.
 */
export default function DualPersonaTriage() {
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";
  const navigate = useNavigate();

  return (
    <section className="w-full bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 lg:py-32">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: LUXURY_EASE }}
        >
          <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-4 block">
            {isAr ? "استشارة ذكية" : "Intelligent Consultation"}
          </span>
          <h2 className={cn(
            "font-heading text-3xl md:text-5xl text-asper-ink mb-6 font-bold",
            isAr && "font-arabic"
          )}>
            {isAr ? "مُصمّم لخارطة بشرتك" : "Curated for Your Skin's Blueprint"}
          </h2>
          <p className={cn(
            "text-muted-foreground font-body max-w-2xl mx-auto text-lg leading-relaxed",
            isAr && "font-arabic"
          )}>
            {isAr
              ? "تخطّي البحث. تواصلي مع مستشارينا الأذكياء لتصفية آلاف المنتجات وصولاً لروتينك المثالي."
              : "Skip the search. Connect with our intelligent consultants to filter thousands of dermo-cosmetics down to your perfect routine."}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-polished-gold/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-polished-gold/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-polished-gold/60" />
          </div>
        </motion.div>

        {/* The Dual-Persona Split — Large Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {/* Card A: Dr. Sami (Clinical / Repair) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: LUXURY_EASE }}
          >
            <button
              onClick={() => navigate("/?intent=sensitivity&source=dr-sami")}
              className="group relative w-full text-left overflow-hidden transition-all duration-500 hover:-translate-y-1"
            >
              {/* Background Image */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop"
                  alt="Clinical laboratory setting"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/80 via-asper-ink/30 to-transparent" />

                {/* Clinical Shimmer Beam */}
                <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-polished-white/20 to-transparent -skew-x-[20deg] pointer-events-none z-20 group-hover:left-[150%] transition-all duration-700 ease-in-out" />

                {/* Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="inline-flex items-center gap-2 bg-burgundy/90 backdrop-blur-sm text-polished-white text-[10px] uppercase tracking-[0.2em] font-body font-semibold px-4 py-2 rounded-full">
                    <Shield className="w-3 h-3" />
                    {isAr ? "طبي سريري" : "Clinical"}
                  </span>
                </div>

                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 z-10">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-polished-white/10 backdrop-blur-sm border border-polished-white/20 flex items-center justify-center mb-6 group-hover:bg-burgundy group-hover:border-burgundy transition-all duration-500">
                    <Stethoscope size={32} strokeWidth={1.2} className="text-polished-white" />
                  </div>

                  <h3 className={cn(
                    "font-heading text-2xl lg:text-3xl xl:text-4xl text-polished-white mb-3 font-bold",
                    isAr && "font-arabic"
                  )}>
                    {isAr ? "إصلاح وحماية" : "Repair & Protect"}
                  </h3>
                  <p className={cn(
                    "text-polished-white/80 font-body text-sm lg:text-base mb-6 max-w-md leading-relaxed",
                    isAr && "font-arabic"
                  )}>
                    {isAr ? (
                      <>استشيري <span className="font-semibold text-polished-white">الدكتور سامي</span>. تركيز على إصلاح حاجز البشرة، البشرة الحساسة، المكونات الفعّالة، والفعالية الطبية.</>
                    ) : (
                      <>Consult with <span className="font-semibold text-polished-white">Dr. Sami</span>. Focus on barrier repair, sensitive skin, active ingredients, and dermatological efficacy.</>
                    )}
                  </p>

                  <span className={cn(
                    "inline-flex items-center gap-2 text-polished-white font-semibold tracking-[0.15em] text-xs uppercase border-b-2 border-polished-white/40 group-hover:border-polished-gold pb-2 transition-all duration-300",
                    isAr && "flex-row-reverse"
                  )}>
                    {isAr ? "ابدئي الاستشارة الطبية" : "Start Clinical Consultation"}
                    <ArrowRight size={14} className={cn(dir === "rtl" && "rotate-180", "group-hover:translate-x-1 transition-transform duration-300")} />
                  </span>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Card B: Ms. Zain (Aesthetic / Glow) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: LUXURY_EASE }}
          >
            <button
              onClick={() => navigate("/?intent=hydration&source=ms-zain")}
              className="group relative w-full text-left overflow-hidden transition-all duration-500 hover:-translate-y-1"
            >
              {/* Background Image */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80&auto=format&fit=crop"
                  alt="Luxury beauty spa aesthetic"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                />
                {/* Warm overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/70 via-burgundy/10 to-transparent" />

                {/* Luxury Shimmer Beam */}
                <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-polished-gold/15 to-transparent -skew-x-[20deg] pointer-events-none z-20 group-hover:left-[150%] transition-all duration-700 ease-in-out" />

                {/* Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="inline-flex items-center gap-2 bg-polished-gold/90 backdrop-blur-sm text-asper-ink text-[10px] uppercase tracking-[0.2em] font-body font-semibold px-4 py-2 rounded-full">
                    <Flower2 className="w-3 h-3" />
                    {isAr ? "جمال فاخر" : "Aesthetic"}
                  </span>
                </div>

                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 z-10">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-polished-gold/10 backdrop-blur-sm border border-polished-gold/30 flex items-center justify-center mb-6 group-hover:bg-polished-gold group-hover:border-polished-gold transition-all duration-500">
                    <Sparkles size={32} strokeWidth={1.2} className="text-polished-gold group-hover:text-asper-ink transition-colors duration-500" />
                  </div>

                  <h3 className={cn(
                    "font-heading text-2xl lg:text-3xl xl:text-4xl text-polished-white mb-3 font-bold",
                    isAr && "font-arabic"
                  )}>
                    {isAr ? "إشراقة وتألق" : "Glow & Enhance"}
                  </h3>
                  <p className={cn(
                    "text-polished-white/80 font-body text-sm lg:text-base mb-6 max-w-md leading-relaxed",
                    isAr && "font-arabic"
                  )}>
                    {isAr ? (
                      <>تحدّثي مع <span className="font-semibold text-polished-white">مس زين</span>. اكتشفي درجاتك المثالية، اللمسات المضيئة، وجمالية "سبا الصباح".</>
                    ) : (
                      <>Chat with <span className="font-semibold text-polished-white">Ms. Zain</span>. Discover your perfect shade matches, luminous finishes, and the ultimate "Morning Spa" aesthetic.</>
                    )}
                  </p>

                  <span className={cn(
                    "inline-flex items-center gap-2 text-polished-gold font-semibold tracking-[0.15em] text-xs uppercase border-b-2 border-polished-gold/40 group-hover:border-polished-white pb-2 transition-all duration-300",
                    isAr && "flex-row-reverse"
                  )}>
                    {isAr ? "ابدئي استشارة الجمال" : "Start Beauty Consultation"}
                    <ArrowRight size={14} className={cn(dir === "rtl" && "rotate-180", "group-hover:translate-x-1 transition-transform duration-300")} />
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
}
