import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

const VIDEOS = [
  "/videos/brand-philosophy.mp4",
  "/videos/hero-reel-1.mp4",
  "/videos/hero-reel-2.mp4",
  "/videos/hero-reel-3.mp4",
];

export function AsperExperience() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // IntersectionObserver lazy-loading — only play when section is near viewport
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

  // Cycle videos every 6s
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % VIDEOS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isVisible]);

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

        {/* Contained video carousel with drop shadow */}
        <motion.div
          className="relative overflow-hidden rounded-xl"
          style={{
            boxShadow: "0 10px 30px hsla(345,100%,25%,0.05)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
        >
          <div className="relative w-full aspect-video">
            {isVisible &&
              VIDEOS.map((src, i) => (
                <video
                  key={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                    i === currentIdx ? "opacity-100" : "opacity-0"
                  )}
                >
                  <source src={src} type="video/mp4" />
                </video>
              ))}

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, hsla(345,100%,25%,0.25) 0%, transparent 60%)",
                }}
              />
              <div className="relative z-10 text-center px-6 mt-auto pb-12 md:pb-16">
                <p
                  className={cn(
                    "font-display text-xl md:text-2xl lg:text-3xl text-white leading-relaxed max-w-2xl mx-auto",
                    isAr && "font-arabic"
                  )}
                  style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
                >
                  {isAr
                    ? "ادخلي سبا الصباح. حيث الدقة السريرية تلتقي بالفخامة الاستثنائية."
                    : "Step into the Morning Spa. Where Clinical Precision meets Unmatched Luxury."}
                </p>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {VIDEOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                aria-label={`Video ${i + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-[400ms]",
                  i === currentIdx
                    ? "bg-accent w-6"
                    : "bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
