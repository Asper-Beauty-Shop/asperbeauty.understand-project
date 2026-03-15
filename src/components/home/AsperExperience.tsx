import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

const VIDEOS = [
  { src: "/videos/brand-philosophy.mp4", label: "Brand Philosophy", link: "/philosophy" },
  { src: "/videos/hero-reel-1.mp4", label: "Clinical Serums", link: "/shop?category=Clinical+Serums" },
  { src: "/videos/hero-reel-2.mp4", label: "Morning Ritual", link: "/shop" },
  { src: "/videos/hero-reel-3.mp4", label: "Skin Consultation", link: "/skin-concerns" },
];

export function AsperExperience() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // IntersectionObserver lazy-loading
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle every 6s
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % VIDEOS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const goNext = useCallback(() => setCurrentIdx((p) => (p + 1) % VIDEOS.length), []);
  const goPrev = useCallback(() => setCurrentIdx((p) => (p - 1 + VIDEOS.length) % VIDEOS.length), []);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { goNext(); } else { goPrev(); }
    }
    touchStartX.current = null;
  };

  return (
    <section ref={sectionRef} className="w-full bg-background py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: LUXURY_EASE }}
        >
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent mb-3 block font-semibold">
            {isAr ? "فلسفة العلامة" : "Brand Philosophy"}
          </span>
          <h2
            className={cn(
              "font-display text-3xl md:text-4xl text-primary",
              isAr && "font-arabic"
            )}
          >
            {isAr ? "تجربة أسبر" : "The Asper Experience"}
          </h2>
        </motion.div>

        {/* Video carousel with swipe + arrows */}
        <motion.div
          className="relative overflow-hidden rounded-xl"
          style={{ boxShadow: "0 10px 30px hsla(345,100%,25%,0.05)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full aspect-video">
            {isVisible &&
              VIDEOS.map(({ src }, i) => (
                <video
                  key={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  poster="/images/hero-poster-carousel.jpg"
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover object-[75%_50%] md:object-center transition-opacity duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                    i === currentIdx ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <source src={src} type="video/mp4" />
                </video>
              ))}

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, hsla(345,100%,25%,0.35) 0%, transparent 60%)",
              }}
            />

            {/* Text overlay + CTA deep-link */}
            <div className="absolute inset-0 flex flex-col justify-end z-10 px-6 pb-14 md:pb-16">
              <p
                className={cn(
                  "font-display text-xl md:text-2xl lg:text-3xl text-white leading-relaxed max-w-2xl mx-auto text-center mb-4",
                  isAr && "font-arabic"
                )}
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
              >
                {isAr
                  ? "ادخلي سبا الصباح. حيث الدقة السريرية تلتقي بالفخامة الاستثنائية."
                  : "Step into the Morning Spa. Where Clinical Precision meets Unmatched Luxury."}
              </p>

              {/* Deep-link to featured product/page */}
              <div className="flex justify-center">
                <Link
                  to={VIDEOS[currentIdx].link}
                  className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30
                             text-white px-5 py-2.5 font-body text-[11px] uppercase tracking-[0.2em]
                             hover:bg-white/25 transition-all duration-[400ms] min-h-[44px]"
                >
                  {VIDEOS[currentIdx].label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Desktop arrow controls */}
            <button
              onClick={goPrev}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center
                         bg-background/20 backdrop-blur-sm border border-white/20 text-white
                         hover:bg-background/40 transition-all duration-300 rounded-full"
              aria-label="Previous video"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center
                         bg-background/20 backdrop-blur-sm border border-white/20 text-white
                         hover:bg-background/40 transition-all duration-300 rounded-full"
              aria-label="Next video"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {VIDEOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                aria-label={`Video ${i + 1}`}
                className={cn(
                  "h-3 rounded-full transition-all duration-[400ms] min-h-[12px] min-w-[12px]",
                  i === currentIdx
                    ? "bg-accent w-8"
                    : "bg-white/50 hover:bg-white/80 w-3"
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
