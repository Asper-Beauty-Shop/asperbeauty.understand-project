import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Slide data                                                         */
/* ------------------------------------------------------------------ */

interface Slide {
  id: number;
  /** Background image URL */
  bg: string;
  /** Overlay treatment — keeps text readable on busy imagery */
  overlayClass: string;
  /** Render function for the slide's unique content layout */
  render: (isAr: boolean, dir: "rtl" | "ltr") => React.ReactNode;
  /** CTA link */
  href: string;
}

const slides: Slide[] = [
  /* ---- Slide 1 — "Beauty Deals" ---- */
  {
    id: 1,
    bg: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1920&q=80",
    overlayClass: "bg-white/20",
    href: "/offers",
    render: (isAr) => (
      <div className="relative flex flex-col items-start justify-end h-full pb-12 px-6 sm:px-12 lg:px-20">
        {/* "BEST OF" label */}
        <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.35em] text-asper-ink/80 mb-2">
          {isAr ? "الأفضل من" : "BEST OF"}
        </span>

        {/* Main headline — mixed-font treatment */}
        <h2 className="leading-[0.95]">
          <span
            className={cn(
              "block text-4xl sm:text-5xl lg:text-7xl italic font-light text-asper-ink",
              isAr ? "font-arabic" : "font-serif"
            )}
          >
            {isAr ? "عروض" : "Beauty"}
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight text-asper-ink font-sans">
            {isAr ? "الجمال" : "DEALS"}
          </span>
        </h2>

        {/* FOMO tagline — grunge/sticker style */}
        <div className="mt-6 bg-asper-ink text-white px-4 py-1.5 -rotate-2 inline-block">
          <span className="text-xs sm:text-sm italic font-sans tracking-wide">
            {isAr ? "اغتنمها قبل فوات الأوان" : "get it OR REGRET IT"}
          </span>
        </div>
      </div>
    ),
  },

  /* ---- Slide 2 — "Wonder Women Edit" ---- */
  {
    id: 2,
    bg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80",
    overlayClass: "bg-gradient-to-r from-black/50 via-black/30 to-transparent",
    href: "/collections",
    render: (isAr) => (
      <div className="relative flex flex-col items-start justify-center h-full px-6 sm:px-12 lg:px-20">
        {/* Small caps label */}
        <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.35em] text-white/70 mb-3">
          {isAr ? "إصدار خاص" : "EXCLUSIVE EDIT"}
        </span>

        {/* Title — editorial serif */}
        <h2 className="leading-[1.05]">
          <span
            className={cn(
              "block text-3xl sm:text-4xl lg:text-6xl font-light text-white",
              isAr ? "font-arabic" : "font-serif italic"
            )}
          >
            {isAr ? "نساء" : "Wonder Women"}
          </span>
          <span
            className={cn(
              "block text-4xl sm:text-5xl lg:text-7xl font-bold text-white",
              isAr ? "font-arabic" : "font-serif"
            )}
          >
            {isAr ? "ملهمات" : "Edit"}
          </span>
        </h2>

        {/* Subtitle */}
        <p
          className={cn(
            "mt-4 text-sm sm:text-base text-white/80 max-w-md leading-relaxed",
            isAr ? "font-arabic" : "font-sans"
          )}
        >
          {isAr
            ? "تعرّفي على المؤسسات اللواتي يعيدن تعريف صناعة الجمال"
            : "Meet the female founders redefining the beauty industry"}
        </p>

        {/* CTA */}
        <Link
          to="/collections"
          className="mt-6 inline-flex items-center gap-2 bg-white text-asper-ink px-6 py-2.5 text-xs sm:text-sm font-sans uppercase tracking-[0.2em] hover:bg-white/90 transition-colors duration-300"
        >
          {isAr ? "تسوق الآن" : "SHOP NOW"}
        </Link>
      </div>
    ),
  },

  /* ---- Slide 3 — "Inside the Studio" ---- */
  {
    id: 3,
    bg: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1920&q=80",
    overlayClass: "bg-black/40",
    href: "/collections",
    render: (isAr) => (
      <div className="relative flex flex-col items-center justify-center h-full text-center px-6 sm:px-12 lg:px-20">
        {/* Title — centered editorial */}
        <h2 className="leading-[1.1]">
          <span className="block text-xs sm:text-sm font-sans uppercase tracking-[0.4em] text-white/70 mb-2">
            {isAr ? "داخل" : "INSIDE"}
          </span>
          <span
            className={cn(
              "block text-4xl sm:text-5xl lg:text-7xl text-white",
              isAr ? "font-arabic font-bold" : "font-serif italic"
            )}
          >
            {isAr ? "الاستوديو" : "the Studio"}
          </span>
        </h2>

        {/* Body copy */}
        <p
          className={cn(
            "mt-4 text-sm sm:text-base text-white/80 max-w-lg leading-relaxed",
            isAr ? "font-arabic" : "font-sans"
          )}
        >
          {isAr
            ? "اكتشفي أسرار المكياج وآخر صيحات الجمال من وراء الكواليس"
            : "Discover makeup secrets, trend coverage, and behind-the-scenes beauty stories"}
        </p>

        {/* CTA — solid black button */}
        <Link
          to="/collections"
          className="mt-6 inline-flex items-center gap-2 bg-asper-ink text-white px-8 py-3 text-xs sm:text-sm font-sans uppercase tracking-[0.2em] hover:bg-asper-ink/80 transition-colors duration-300"
        >
          {isAr ? "اكتشف الآن" : "DISCOVER NOW!"}
        </Link>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const AUTOPLAY_INTERVAL = 5000; // ms between slide changes
const SLIDE_COUNT = slides.length;

/* ------------------------------------------------------------------ */
/*  Slide transition variants (crossfade)                              */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroSlider() {
  const { dir, locale } = useLanguage();
  const isAr = locale === "ar";

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---------- Auto-play ---------- */
  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDE_COUNT);
    }, AUTOPLAY_INTERVAL);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPaused) startAutoplay();
    return stopAutoplay;
  }, [isPaused, startAutoplay, stopAutoplay]);

  /* ---------- Navigation ---------- */
  const goTo = useCallback(
    (index: number) => {
      setCurrent(index);
      // Reset autoplay timer on manual navigation
      stopAutoplay();
      if (!isPaused) startAutoplay();
    },
    [isPaused, startAutoplay, stopAutoplay],
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % SLIDE_COUNT);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, [current, goTo]);

  /* ---------- Keyboard support ---------- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        dir === "rtl" ? goPrev() : goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        dir === "rtl" ? goNext() : goPrev();
      }
    },
    [dir, goNext, goPrev],
  );

  const activeSlide = slides[current];

  return (
    <section
      className="relative w-full h-[350px] sm:h-[370px] lg:h-[420px] overflow-hidden select-none"
      dir={dir}
      role="region"
      aria-roledescription="carousel"
      aria-label={isAr ? "عرض الشرائح الرئيسي" : "Hero slideshow"}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* ---------- Slide backgrounds + content ---------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          className="absolute inset-0"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Background image */}
          <img
            src={activeSlide.bg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            loading={current === 0 ? "eager" : "lazy"}
          />

          {/* Overlay */}
          <div className={cn("absolute inset-0", activeSlide.overlayClass)} />

          {/* Content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto">
            {activeSlide.render(isAr, dir)}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ---------- Arrow navigation ---------- */}
      {/* Previous */}
      <button
        onClick={goPrev}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-20 p-2 text-white/60 hover:text-white transition-colors duration-200",
          dir === "rtl" ? "right-3 sm:right-5" : "left-3 sm:left-5"
        )}
        aria-label={isAr ? "الشريحة السابقة" : "Previous slide"}
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
      </button>

      {/* Next */}
      <button
        onClick={goNext}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-20 p-2 text-white/60 hover:text-white transition-colors duration-200",
          dir === "rtl" ? "left-3 sm:left-5" : "right-3 sm:right-5"
        )}
        aria-label={isAr ? "الشريحة التالية" : "Next slide"}
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
      </button>

      {/* ---------- Dot / dash indicators ---------- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goTo(i)}
            className={cn(
              "h-[3px] rounded-full transition-all duration-300",
              i === current
                ? "w-6 bg-white"
                : "w-3 bg-white/40 hover:bg-white/60"
            )}
            aria-label={
              isAr
                ? `انتقل إلى الشريحة ${i + 1}`
                : `Go to slide ${i + 1}`
            }
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
