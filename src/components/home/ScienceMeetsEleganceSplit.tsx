import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

export function ScienceMeetsEleganceSplit() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="w-full bg-background relative overflow-hidden">
      {/* Subtle radial glow behind the glass for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 50% 50% at 25% 50%, hsl(43 69% 46% / 0.04) 0%, transparent 60%)",
            "radial-gradient(ellipse 50% 50% at 75% 50%, hsl(345 100% 25% / 0.03) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* ── Desktop: side-by-side ── */}
      <div className="hidden md:grid grid-cols-2 min-h-[70vh]">
        {/* LEFT — Dr. Sami */}
        <Link
          to="/shop?category=Clinical+Serums+%26+Actives"
          className="group relative flex flex-col justify-center items-center text-center
                     px-8 md:px-14 py-20 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.06] group-hover:opacity-[0.12] group-hover:scale-[1.02]
                        transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80')",
            }}
          />

          <motion.div
            className="clinical-glass relative z-10 rounded-xl p-8 lg:p-10 xl:p-12 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: LUXURY_EASE }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-1.5 mb-6">
              <Stethoscope className="h-3.5 w-3.5 text-accent" />
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                {isAr ? "مجال الدكتور سامي" : "Dr. Sami's Domain"}
              </span>
            </div>

            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent mb-4 block font-semibold">
              {isAr ? "الجانب السريري" : "The Clinical Side"}
            </span>

            <h2
              className={cn(
                "font-display text-3xl md:text-4xl lg:text-[42px] text-primary leading-tight mb-4",
                isAr && "font-arabic"
              )}
            >
              {isAr ? "اكتشفي السيروم المثالي" : "Discover Your Ideal Serum"}
            </h2>

            <p
              className={cn(
                "font-body text-sm md:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed mb-8",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "استكشفي مجموعتنا من التركيبات المُنتقاة من الصيادلة"
                : "Pharmacist-curated formulas backed by clinical evidence."}
            </p>

            <span className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.3em] text-primary-foreground bg-primary px-6 py-3 group-hover:bg-burgundy-dark transition-all duration-[400ms]">
              {isAr ? "استكشفي" : "Explore Clinical"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </motion.div>
        </Link>

        {/* RIGHT — Ms. Zain */}
        <Link
          to="/shop?category=Evening+Radiance+%26+Glamour"
          className="group relative flex flex-col justify-center items-center text-center
                     bg-primary px-8 md:px-14 py-20 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.08] group-hover:opacity-[0.15] group-hover:scale-[1.02]
                        transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80')",
            }}
          />

          <motion.div
            className="relative z-10 rounded-xl p-8 lg:p-10 xl:p-12 max-w-md
                       bg-primary-foreground/10 backdrop-blur-md border border-accent/20
                       shadow-[0_12px_40px_0_rgba(14,20,36,0.05)]
                       transition-all duration-[400ms]
                       group-hover:border-accent/50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.15 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                {isAr ? "مجال الآنسة زين" : "Ms. Zain's Domain"}
              </span>
            </div>

            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent mb-4 block font-semibold">
              {isAr ? "الجانب الفاخر" : "The Luxury Side"}
            </span>

            <h2
              className={cn(
                "font-display text-3xl md:text-4xl lg:text-[42px] text-primary-foreground leading-tight mb-4",
                isAr && "font-arabic"
              )}
            >
              {isAr ? "ترتقي بالأناقة" : "Elevated By Elegance"}
            </h2>

            <p
              className={cn(
                "font-body text-sm md:text-base text-primary-foreground/70 max-w-sm mx-auto leading-relaxed mb-8",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "روتين عناية بالبشرة موثوق وفعّال"
                : "Luxury daily rituals that transform skincare into self-care."}
            </p>

            <span className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.3em] text-primary bg-accent px-6 py-3 group-hover:bg-polished-gold-light transition-all duration-[400ms]">
              {isAr ? "تسوقي" : "Shop Luxury"}
              <Sparkles className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
            </span>
          </motion.div>
        </Link>
      </div>

      {/* ── Mobile: "Overlap & Anchor" stacked layout ── */}
      <div className="md:hidden flex flex-col">
        {/* Dr. Sami — image area + overlapping glass card */}
        <Link
          to="/shop?category=Clinical+Serums+%26+Actives"
          className="group relative"
        >
          <div
            className="relative h-[300px] overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>

          <motion.div
            className="clinical-glass relative z-10 -mt-14 mx-4 rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: LUXURY_EASE }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/80 border border-accent/30 rounded-full px-3 py-1 mb-4">
              <Stethoscope className="h-3 w-3 text-accent" />
              <span className="font-body text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">
                {isAr ? "مجال الدكتور سامي" : "Dr. Sami's Domain"}
              </span>
            </div>

            <h2
              className={cn(
                "font-display text-2xl text-primary leading-tight mb-3",
                isAr && "font-arabic"
              )}
            >
              {isAr ? "اكتشفي السيروم المثالي" : "Discover Your Ideal Serum"}
            </h2>

            <p
              className={cn(
                "font-body text-sm text-muted-foreground leading-relaxed mb-5",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "تركيبات مُنتقاة من الصيادلة"
                : "Pharmacist-curated clinical formulas."}
            </p>

            {/* 48px+ touch target */}
            <span className="inline-flex items-center justify-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-primary-foreground bg-primary px-6 py-3.5 min-h-[48px] w-full active:scale-[0.98] transition-all duration-200">
              {isAr ? "استكشفي" : "Explore Clinical"}
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </motion.div>
        </Link>

        {/* Ms. Zain — image area + overlapping glass card */}
        <Link
          to="/shop?category=Evening+Radiance+%26+Glamour"
          className="group relative mt-8"
        >
          <div className="relative h-[300px] overflow-hidden bg-primary">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
          </div>

          <motion.div
            className="relative z-10 -mt-14 mx-4 rounded-xl p-6 text-center
                       bg-primary-foreground/10 backdrop-blur-sm border border-accent/20
                       shadow-[0_8px_30px_0_rgba(14,20,36,0.05)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: LUXURY_EASE, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-accent/30 rounded-full px-3 py-1 mb-4">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="font-body text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">
                {isAr ? "مجال الآنسة زين" : "Ms. Zain's Domain"}
              </span>
            </div>

            <h2
              className={cn(
                "font-display text-2xl text-primary leading-tight mb-3",
                isAr && "font-arabic"
              )}
            >
              {isAr ? "ترتقي بالأناقة" : "Elevated By Elegance"}
            </h2>

            <p
              className={cn(
                "font-body text-sm text-muted-foreground leading-relaxed mb-5",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "روتين عناية فاخر يومي"
                : "Luxury daily rituals for radiant self-care."}
            </p>

            <span className="inline-flex items-center justify-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-primary bg-accent px-6 py-3.5 min-h-[48px] w-full active:scale-[0.98] transition-all duration-200">
              {isAr ? "تسوقي" : "Shop Luxury"}
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </motion.div>
        </Link>

        <div className="h-8" />
      </div>
    </section>
  );
}
