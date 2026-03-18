import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

import heroImg from "@/assets/hero-serum-discovery.png";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

export default function ClinicalLuxuryHero() {
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="relative w-full min-h-[600px] bg-background overflow-hidden" style={{ height: "100dvh" }}>
      {/* Subtle radial glow behind image */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 65% 50%, hsl(43 69% 46% / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Desktop: Split Layout ── */}
      <div className="hidden md:flex h-full">
        {/* Left — Copy */}
        <div className="flex flex-col justify-center w-1/2 px-12 lg:px-20 xl:px-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: LUXURY_EASE, delay: 0.1 }}
          >
            {/* Eyebrow */}
            <span className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.45em] text-accent font-semibold mb-5 block">
              {isAr ? "ذا أسبر بيوتي شوب" : "The Asper Beauty Shop"}
            </span>

            {/* H1 */}
            <h1
              className={cn(
                "font-display text-4xl lg:text-5xl xl:text-[56px] font-bold leading-[1.08] text-primary mb-6",
                isAr && "font-arabic text-right"
              )}
            >
              {isAr ? (
                <>
                  مُنتقاة من{" "}
                  <span className="text-accent">الصيادلة.</span>
                  <br />
                  مدعومة بالذكاء.
                </>
              ) : (
                <>
                  Curated by
                  <br />
                  Pharmacists.
                  <br />
                  <span className="italic text-accent">
                    Powered by Intelligence.
                  </span>
                </>
              )}
            </h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.5 }}
              className={cn(
                "font-body text-base lg:text-lg text-foreground/70 max-w-md leading-relaxed mb-10",
                isAr && "font-arabic text-right"
              )}
            >
              {isAr
                ? "حلول طبية موثوقة لإشراقة خالدة — من الصيدلي إليكِ مباشرة."
                : "Trusted clinical solutions for ageless radiance — dispensed directly from the pharmacist's shelf to you."}
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.7 }}
              className={cn("flex items-center gap-5", isAr && "flex-row-reverse")}
            >
              <Link to="/shop">
                <button
                  className="group inline-flex items-center justify-center
                             min-h-[52px] px-10 md:px-12 py-4
                             bg-primary text-primary-foreground
                             font-body text-[11px] md:text-[12px] uppercase tracking-[0.3em] font-semibold
                             hover:bg-burgundy-dark hover:shadow-maroon-glow
                             transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]
                             hover:-translate-y-0.5"
                >
                  {isAr ? "تسوقي الآن" : "Shop Now"}
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                      dir === "rtl" && "mr-2 rotate-180 group-hover:-translate-x-1",
                      dir === "ltr" && "ml-2"
                    )}
                  />
                </button>
              </Link>

              <Link
                to="/skin-concerns"
                className="font-body text-xs uppercase tracking-[0.2em] text-primary
                           border-b border-primary/30 hover:border-accent pb-1
                           transition-all duration-[400ms]"
              >
                {isAr ? "ابدئي الاستشارة" : "Begin Consultation"}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — Hero image */}
        <div className="relative w-1/2 flex items-center justify-center overflow-hidden">
          <motion.img
            src={heroImg}
            alt={isAr ? "منتجات العناية بالبشرة المميزة" : "Premium skincare serums — ISDIN, Vichy, La Mer"}
            className="relative z-10 w-[85%] max-w-[560px] h-auto object-contain mix-blend-multiply drop-shadow-2xl"
            initial={{ opacity: 0, scale: 1.06, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: LUXURY_EASE, delay: 0.3 }}
            loading="eager"
            fetchPriority="high"
          />
          {/* Gold accent circle */}
          <motion.div
            className="absolute w-[420px] h-[420px] rounded-full border border-accent/20 z-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: LUXURY_EASE, delay: 0.5 }}
          />
        </div>
      </div>

      {/* ── Mobile: Stacked Layout ── */}
      <div className="md:hidden flex flex-col h-full">
        {/* Image area */}
        <div className="relative flex-shrink-0 flex items-center justify-center pt-20 pb-6 px-8">
          <motion.img
            src={heroImg}
            alt={isAr ? "منتجات العناية بالبشرة" : "Premium skincare serums"}
            className="relative z-10 w-[75%] max-w-[320px] h-auto object-contain mix-blend-multiply"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: LUXURY_EASE, delay: 0.2 }}
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Copy area */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.3 }}
          >
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent font-semibold mb-3 block text-center">
              {isAr ? "ذا أسبر بيوتي شوب" : "The Asper Beauty Shop"}
            </span>

            <h1
              className={cn(
                "font-display text-3xl font-bold leading-[1.1] text-primary mb-4 text-center",
                isAr && "font-arabic"
              )}
            >
              {isAr ? (
                <>مُنتقاة من <span className="text-accent">الصيادلة.</span></>
              ) : (
                <>
                  Curated by Pharmacists.
                  <br />
                  <span className="italic text-accent">Powered by Intelligence.</span>
                </>
              )}
            </h1>

            <p
              className={cn(
                "font-body text-sm text-foreground/70 leading-relaxed mb-7 text-center max-w-sm mx-auto",
                isAr && "font-arabic"
              )}
            >
              {isAr
                ? "حلول طبية موثوقة لإشراقة خالدة."
                : "Trusted clinical solutions for ageless radiance."}
            </p>

            <Link to="/shop" className="block">
              <button
                className="group w-full inline-flex items-center justify-center
                           min-h-[52px] py-4
                           bg-primary text-primary-foreground
                           font-body text-[12px] uppercase tracking-[0.25em] font-semibold
                           hover:bg-burgundy-dark transition-all duration-[400ms]"
              >
                {isAr ? "تسوقي الآن" : "Shop Now"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10" />
    </section>
  );
}
