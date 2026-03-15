import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

export default function CinematicHero() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="relative w-full min-h-[600px] overflow-hidden bg-dark-charcoal" style={{ height: '100dvh' }}>
      {/* Full-bleed video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        poster="/images/hero-poster-cinematic.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center md:object-[center_center] object-[75%_50%] z-0"
      >
        <source src="/videos/cinematic-hero.mp4" type="video/mp4" />
      </video>
      {/* Eager poster fallback for fast LCP */}
      <img
        src="/images/hero-poster-cinematic.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        fetchPriority="high"
        loading="eager"
      />

      {/* Subtle overlay for legibility */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, hsla(240,100%,99%,0.45) 0%, transparent 55%), linear-gradient(to bottom, hsla(240,100%,99%,0.15) 0%, transparent 30%)",
        }}
      />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: LUXURY_EASE, delay: 0.3 }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <span className="font-body text-[11px] md:text-[13px] uppercase tracking-[0.45em] text-accent font-semibold mb-6 block">
            {isAr
              ? "حصري من ذا أسبر بيوتي شوب"
              : "The Asper Beauty Shop Exclusive"}
          </span>

          {/* H1 */}
          <h1
            className={cn(
              "font-arabic text-4xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] text-primary mb-8",
              isAr && "font-arabic"
            )}
          >
            {isAr ? (
              <>
                عناية موثوقة.
                <br />
                <span className="text-foreground">ترتقي بالأناقة.</span>
              </>
            ) : (
              <>
                Trusted Skincare.
                <br />
                <span className="text-foreground">Elevated by Elegance.</span>
              </>
            )}
          </h1>

          {/* Ghost CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.8 }}
          >
            <Link to="/shop">
              <button
                className="relative z-20 inline-flex items-center justify-center
                           min-h-[48px] min-w-[200px] px-8 md:px-12 py-4
                           border-2 border-maroon bg-maroon text-white
                           font-body text-[12px] md:text-[13px] uppercase tracking-[0.3em]
                           hover:bg-maroon/90 hover:shadow-maroon-glow
                           transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]
                           hover:-translate-y-0.5"
              >
                {isAr ? "اكتشفي الإكسير" : "Discover the Elixir"}
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent z-10" />
    </section>
  );
}
