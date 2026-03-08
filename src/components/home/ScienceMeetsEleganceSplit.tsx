import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

export function ScienceMeetsEleganceSplit() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        {/* LEFT — Clinical Side */}
        <Link
          to="/shop?category=Clinical+Serums+%26+Actives"
          className="group relative flex flex-col justify-center items-center text-center
                     bg-background px-8 md:px-14 py-20 overflow-hidden
                     border-r border-border/20
                     transition-all duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)]
                     hover:border-accent"
        >
          {/* Hover border accent */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent transition-all duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none z-10" />

          {/* Background image with zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.06] group-hover:opacity-[0.12] group-hover:scale-[1.02]
                        transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80')",
            }}
          />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: LUXURY_EASE }}
          >
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent mb-4 block font-semibold">
              {isAr ? "الجانب السريري" : "The Clinical Side"}
            </span>

            <h2
              className={cn(
                "font-display text-3xl md:text-4xl lg:text-[42px] text-primary leading-tight mb-4",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "اكتشفي السيروم المثالي"
                : "Discover Your Ideal Serum"}
            </h2>

            <p
              className={cn(
                "font-body text-sm md:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed mb-8",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "استكشفي مجموعتنا من التركيبات المُنتقاة من الصيادلة"
                : "Explore our range of pharmacist-curated formulas."}
            </p>

            <span className="inline-block font-body text-[11px] uppercase tracking-[0.3em] text-foreground border-b border-accent pb-1 group-hover:text-primary transition-colors duration-[400ms]">
              {isAr ? "استكشفي" : "Explore"}
            </span>
          </motion.div>
        </Link>

        {/* RIGHT — Luxury Side */}
        <Link
          to="/shop?category=Evening+Radiance+%26+Glamour"
          className="group relative flex flex-col justify-center items-center text-center
                     bg-primary px-8 md:px-14 py-20 overflow-hidden
                     transition-all duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
        >
          {/* Hover border accent */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent transition-all duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none z-10" />

          {/* Background image with zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.08] group-hover:opacity-[0.15] group-hover:scale-[1.02]
                        transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80')",
            }}
          />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.15 }}
          >
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent mb-4 block font-semibold">
              {isAr ? "الجانب الفاخر" : "The Luxury Side"}
            </span>

            <h2
              className={cn(
                "font-display text-3xl md:text-4xl lg:text-[42px] text-primary-foreground leading-tight mb-4",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "ترتقي بالأناقة"
                : "Elevated By Elegance"}
            </h2>

            <p
              className={cn(
                "font-body text-sm md:text-base text-primary-foreground/70 max-w-sm mx-auto leading-relaxed mb-8",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "روتين عناية بالبشرة موثوق وفعّال"
                : "Trustworthy and effective skincare routines."}
            </p>

            <span className="inline-block font-body text-[11px] uppercase tracking-[0.3em] text-primary-foreground border-b border-accent pb-1 group-hover:text-accent transition-colors duration-[400ms]">
              {isAr ? "تسوقي" : "Shop"}
            </span>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
