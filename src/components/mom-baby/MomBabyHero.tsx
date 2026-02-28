import { useLanguage } from "@/contexts/LanguageContext";
import { Baby, Heart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function MomBabyHero() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-clay/10 via-background to-background py-20 md:py-28">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-0 -left-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-body uppercase tracking-widest text-accent mb-6">
            <Baby className="w-3.5 h-3.5" />
            {isAr ? "الأم والطفل" : "Mom & Baby"}
          </span>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
            {isAr ? "رحلة الأمومة بأمان" : "Safe. Gentle. Clinical."}
          </h1>
          <p className="font-heading text-xl md:text-2xl text-primary italic mb-6">
            {isAr
              ? "من الحمل إلى السنوات الأولى"
              : "From Conception to First Steps"}
          </p>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-base md:text-lg mb-10">
            {isAr
              ? "منتجات موثوقة ومعتمدة طبياً، تم اختيارها بعناية من قبل صيادلتنا لكل مرحلة من مراحل الأمومة."
              : "Pharmacist-curated, clinically validated products for every stage of motherhood. Trusted by dermatologists. Loved by mothers."}
          </p>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {[
            { icon: ShieldCheck, en: "Pregnancy Safe", ar: "آمن للحمل" },
            { icon: Heart, en: "Dermatologist Tested", ar: "مختبر من أطباء الجلد" },
            { icon: Baby, en: "Pediatric Grade", ar: "درجة طبية للأطفال" },
          ].map((pill) => (
            <span
              key={pill.en}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-body text-foreground shadow-warm"
            >
              <pill.icon className="w-4 h-4 text-primary" />
              {isAr ? pill.ar : pill.en}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
