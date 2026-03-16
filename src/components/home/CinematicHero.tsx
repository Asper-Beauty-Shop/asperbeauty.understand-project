import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as unknown as number[];

const STATS = [
  { en: "10,000+", ar: "+١٠٠٠٠", labelEn: "Products", labelAr: "منتج" },
  { en: "50+", ar: "+٥٠", labelEn: "Brands", labelAr: "علامة تجارية" },
  { en: "100%", ar: "١٠٠٪", labelEn: "Pharmacist-Curated", labelAr: "بإشراف صيدلاني" },
];

export default function CinematicHero() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section
      className="relative w-full overflow-hidden bg-dark-charcoal"
      style={{ minHeight: "100dvh" }}
    >
      {/* Full-bleed video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        poster="/images/hero-poster-cinematic.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      >
        <source src="/videos/cinematic-hero.mp4" type="video/mp4" />
      </video>

      {/* Multi-layer overlay — darker at bottom for content legibility */}
      <div className="absolute inset-0 z-[1]" style={{
        background: `
          linear-gradient(to bottom,
            rgba(10,5,5,0.35) 0%,
            rgba(10,5,5,0.20) 40%,
            rgba(10,5,5,0.60) 75%,
            rgba(10,5,5,0.88) 100%
          ),
          linear-gradient(105deg, rgba(103,32,46,0.55) 0%, transparent 60%)
        `,
      }} />

      {/* Decorative gold top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/50 to-transparent z-10" />

      {/* ── Main Content ── */}
      <div className={cn(
        "relative z-10 flex flex-col justify-end h-full min-h-[100dvh] luxury-container pb-16 pt-32",
        isAr && "text-right"
      )}>

        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.2 }}
          className={cn("mb-6 flex", isAr ? "justify-end" : "justify-start")}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-polished-gold/40 bg-polished-gold/10 backdrop-blur-sm text-polished-gold text-[11px] uppercase tracking-[0.35em] font-body">
            <Sparkles className="w-3 h-3" />
            {isAr ? "حصرياً من أسبر بيوتي" : "The Asper Beauty Exclusive"}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: LUXURY_EASE, delay: 0.35 }}
          className={cn(
            "font-display text-5xl md:text-6xl lg:text-[72px] font-medium leading-[1.08] text-white mb-4",
            isAr && "font-arabic leading-[1.3]"
          )}
        >
          {isAr ? (
            <>
              عناية موثوقة.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-polished-gold via-amber-300 to-polished-gold">
                ترتقي بالأناقة.
              </span>
            </>
          ) : (
            <>
              Trusted Skincare.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-polished-gold via-amber-300 to-polished-gold">
                Elevated by Elegance.
              </span>
            </>
          )}
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.55 }}
          className={cn("mb-6 h-px w-40 bg-gradient-to-r from-polished-gold/80 to-transparent origin-left", isAr && "origin-right ml-auto")}
        />

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.6 }}
          className="font-body text-white/70 text-base md:text-lg max-w-md mb-10 leading-relaxed"
        >
          {isAr
            ? "مجموعة مختارة بعناية من قِبَل صيادلة متخصصين. لأن جمالك يستحق الأفضل."
            : "A curated collection by specialist pharmacists. Because your beauty deserves the best."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.75 }}
          className={cn("flex flex-wrap gap-4 mb-16", isAr && "flex-row-reverse")}
        >
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-burgundy border-2 border-burgundy text-white font-body text-[12px] uppercase tracking-[0.3em] transition-all duration-500 hover:bg-transparent hover:border-polished-gold hover:text-polished-gold hover:shadow-[0_0_30px_rgba(197,160,40,0.2)]"
          >
            {isAr ? "اكتشفي المجموعة" : "Discover the Collection"}
            <ArrowRight className={cn("w-4 h-4 transition-transform duration-300 group-hover:translate-x-1", isAr && "rotate-180 group-hover:-translate-x-1")} />
          </Link>
          <Link
            to="/skin-concerns"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white/80 font-body text-[12px] uppercase tracking-[0.3em] transition-all duration-500 hover:border-white hover:text-white backdrop-blur-sm"
          >
            {isAr ? "اختبار البشرة" : "Skin Quiz"}
          </Link>
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.95 }}
          className="border-t border-white/10 pt-8"
        >
          <div className={cn("grid grid-cols-3 gap-6 max-w-lg", isAr && "ml-auto")}>
            {STATS.map((stat, i) => (
              <div key={i} className={cn("flex flex-col", isAr ? "items-end" : "items-start")}>
                <span className="font-display text-2xl md:text-3xl text-polished-gold leading-none">
                  {isAr ? stat.ar : stat.en}
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
                  {isAr ? stat.labelAr : stat.labelEn}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-polished-gold rounded-full"
          />
        </div>
      </motion.div>

      {/* Bottom gold accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent z-10" />
    </section>
  );
}
