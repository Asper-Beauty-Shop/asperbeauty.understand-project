import { useLanguage } from "@/contexts/LanguageContext";
import { Baby, Heart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import momBabyHero from "@/assets/mom-baby-hero.jpg";

export default function MomBabyHero() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const trustBadges = [
    { icon: ShieldCheck, en: "Pregnancy Safe", ar: "آمن للحمل", desc: { en: "Clinically verified", ar: "تم التحقق سريرياً" } },
    { icon: Heart, en: "Dermatologist Tested", ar: "مختبر من أطباء الجلد", desc: { en: "Gentle on skin", ar: "لطيف على البشرة" } },
    { icon: Baby, en: "Pediatric Grade", ar: "درجة طبية للأطفال", desc: { en: "Safe from day one", ar: "آمن من اليوم الأول" } },
  ];

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-gradient-to-br from-rose-clay/15 via-asper-stone/60 to-accent/10 py-16 md:py-24"
    >
      {/* Soft decorative blurs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-rose-clay/10 blur-[100px]" />
      <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-accent/8 blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={isAr ? "text-right" : "text-left"}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2 text-xs font-body uppercase tracking-widest text-accent mb-6">
              <Baby className="w-4 h-4" />
              {isAr ? "الأم والطفل" : "Mom & Baby"}
            </span>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] text-foreground mb-4 leading-tight">
              {isAr ? "رحلة الأمومة بأمان" : "Safe. Gentle. Clinical."}
            </h1>

            <p className="font-heading text-xl md:text-2xl text-primary italic mb-5">
              {isAr
                ? "من الحمل إلى السنوات الأولى"
                : "From Conception to First Steps"}
            </p>

            <p className="font-body text-muted-foreground max-w-xl text-base md:text-lg mb-8 leading-relaxed">
              {isAr
                ? "منتجات موثوقة ومعتمدة طبياً، تم اختيارها بعناية من قبل صيادلتنا لكل مرحلة من مراحل الأمومة."
                : "Pharmacist-curated, clinically validated products for every stage of motherhood. Trusted by dermatologists. Loved by mothers."}
            </p>

            <button
              onClick={() => document.getElementById("lifecycle-nav")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-sm font-semibold text-primary-foreground shadow-maroon-glow hover:bg-primary/90 transition-colors duration-300"
            >
              {isAr ? "استكشفي المراحل" : "Explore Stages"}
              <Baby className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] rounded-[2rem] overflow-hidden shadow-maroon-glow ring-1 ring-accent/20">
              <img
                src={momBabyHero}
                alt={isAr ? "أم تحمل طفلها بحنان" : "Mother tenderly holding her baby"}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Soft overlay gradient at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-asper-stone/40 to-transparent" />
            </div>
            {/* Floating gold accent ring */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-2 border-accent/30 bg-accent/5 blur-sm" />
          </motion.div>
        </div>

        {/* Trust badges - larger cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.en}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/80 backdrop-blur-sm px-6 py-6 text-center shadow-warm hover:border-accent/40 transition-colors duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-body font-semibold text-sm text-foreground">
                {isAr ? badge.ar : badge.en}
              </span>
              <span className="font-body text-xs text-muted-foreground">
                {isAr ? badge.desc.ar : badge.desc.en}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
