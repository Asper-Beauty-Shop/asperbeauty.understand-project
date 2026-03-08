import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Zone 1 — Split Editorial "Magazine Cover" Hero
 * Left: massive Playfair headline + CTAs on ivory
 * Right: full-bleed macro texture image
 */
export default function AmbientVideoHero() {
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col lg:flex-row overflow-hidden">
      {/* ── Left: Editorial Typography ── */}
      <div
        className={cn(
          "flex-1 flex items-center justify-center bg-asper-stone-light px-8 md:px-16 lg:px-20 py-24 lg:py-0 order-2 lg:order-1",
          isAr && "lg:order-2"
        )}
      >
        <div className={cn("max-w-xl", isAr && "text-right")}>
          {/* Campaign tag */}
          <motion.span
            className="inline-block font-body text-[10px] sm:text-xs uppercase tracking-[0.35em] text-polished-gold mb-8 border border-polished-gold/30 px-5 py-2 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: LUXURY_EASE }}
          >
            {isAr ? "مستقبل التجزئة الجلدية" : "The Future of Dermo-Retail"}
          </motion.span>

          {/* Headline */}
          <motion.h1
            className={cn(
              "font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-8",
              "text-asper-ink",
              isAr && "font-arabic"
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: LUXURY_EASE }}
            dir={isAr ? "rtl" : "ltr"}
          >
            {isAr ? (
              <>
                مُنتقاة من الصيادلة.
                <br />
                <span className="italic text-burgundy">مدعومة بالذكاء.</span>
              </>
            ) : (
              <>
                Curated by Pharmacists.
                <br />
                <span className="italic text-burgundy">Powered by Intelligence.</span>
              </>
            )}
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            className={cn(
              "h-px bg-gradient-to-r from-polished-gold via-polished-gold/60 to-transparent mb-8",
              isAr && "bg-gradient-to-l"
            )}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: LUXURY_EASE }}
          />

          {/* Subheadline */}
          <motion.p
            className={cn(
              "max-w-md text-base sm:text-lg leading-relaxed mb-10 font-body text-muted-foreground",
              isAr && "font-arabic mr-0 ml-auto"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: LUXURY_EASE }}
            dir={isAr ? "rtl" : "ltr"}
          >
            {isAr
              ? "نحن لا نبيع مستحضرات التجميل فحسب؛ بل نوزّع الجمال بذكاء."
              : "We are not just selling cosmetics; we are dispensing beauty through intelligence."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className={cn("flex flex-col sm:flex-row gap-4", isAr && "sm:flex-row-reverse")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: LUXURY_EASE }}
          >
            {/* Primary CTA */}
            <Button
              asChild
              size="lg"
              className={cn(
                "group bg-burgundy text-primary-foreground hover:bg-burgundy-dark",
                "px-10 py-6 text-sm uppercase tracking-[0.2em] font-semibold",
                "transition-all duration-300 hover:shadow-maroon-glow rounded-none"
              )}
            >
              <Link to="/skin-concerns">
                {isAr ? "ابدئي استشارتك" : "Begin Your Consultation"}
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                    dir === "rtl" ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
                  )}
                />
              </Link>
            </Button>

            {/* Secondary CTA */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(
                "border-2 border-burgundy/40 text-burgundy bg-transparent",
                "hover:bg-burgundy hover:text-polished-white",
                "px-10 py-6 text-sm uppercase tracking-[0.2em] font-semibold",
                "transition-all duration-300 rounded-none"
              )}
            >
              <Link to="/shop">
                <Sparkles className={cn("h-4 w-4", isAr ? "ms-2" : "me-2", "text-polished-gold")} />
                {isAr ? "اكتشفي البروتوكولات" : "Explore Protocols"}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ── Right: Full-bleed macro texture image ── */}
      <motion.div
        className={cn(
          "flex-1 relative min-h-[50vh] lg:min-h-full order-1 lg:order-2",
          isAr && "lg:order-1"
        )}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: LUXURY_EASE }}
      >
        <img
          src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80&auto=format&fit=crop"
          alt="Golden serum texture macro close-up"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-asper-stone-light/20 via-transparent to-transparent lg:from-asper-stone-light/30" />
      </motion.div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-10 bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent" />
    </section>
  );
}
