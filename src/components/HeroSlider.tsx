/**
 * HeroSlider — Hero carousel with RTL-aware arrows, CTA links, and a11y.
 * - RTL: ChevronLeft/ChevronRight swapped so "previous/next" match visual direction.
 * - Each slide's href is used for the CTA link (no dead code).
 * - Focus: only pause autoplay when focus leaves the section (not when moving between prev/next).
 * - aria-live region announces slide changes for screen readers.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
  /** CTA link — used for the slide's primary button */
  href: string;
  ctaLabel?: string;
}

export interface HeroSliderProps {
  slides: Slide[];
  /** Auto-advance interval in ms; 0 = no autoplay */
  interval?: number;
  /** Pause autoplay when section has focus (keyboard/screen reader) */
  pauseOnFocus?: boolean;
  className?: string;
}

export function HeroSlider({
  slides,
  interval = 5000,
  pauseOnFocus = true,
  className,
}: HeroSliderProps) {
  const { isRTL } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[index] ?? slides[0];
  const prevIndex = index === 0 ? slides.length - 1 : index - 1;
  const nextIndex = (index + 1) % slides.length;

  // Announce slide change to screen readers
  useEffect(() => {
    const el = liveRef.current;
    if (!el || !currentSlide) return;
    el.textContent = currentSlide.title;
  }, [index, currentSlide?.title]);

  // Autoplay
  useEffect(() => {
    if (interval <= 0 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [interval, paused, slides.length]);

  // Pause only when focus leaves the section (not when moving between prev/next)
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      if (!pauseOnFocus) return;
      const related = e.relatedTarget as Node | null;
      if (sectionRef.current?.contains(related)) return;
      setPaused(true);
    },
    [pauseOnFocus],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      if (!pauseOnFocus) return;
      const target = e.target as Node | null;
      if (sectionRef.current?.contains(target)) setPaused(false);
    },
    [pauseOnFocus],
  );

  if (!slides.length) return null;

  // RTL: swap which button does prev/next so arrows match visual direction (left arrow = back in RTL = next slide)
  const goPrev = () => setIndex(prevIndex);
  const goNext = () => setIndex(nextIndex);
  const leftAction = isRTL ? goNext : goPrev;
  const rightAction = isRTL ? goPrev : goNext;
  const leftLabel = isRTL ? "Next slide" : "Previous slide";
  const rightLabel = isRTL ? "Previous slide" : "Next slide";

  return (
    <section
      ref={sectionRef}
      className={cn("relative overflow-hidden", className)}
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      {/* Live region for slide changes (visually hidden) */}
      <div
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Slide content */}
      <div className="relative aspect-[21/9] min-h-[280px] md:min-h-[360px] bg-muted">
        {currentSlide && (
          <>
            <img
              src={currentSlide.image}
              alt={currentSlide.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-end p-6 md:p-10",
                isRTL ? "text-right items-end" : "text-left items-start",
              )}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                {currentSlide.title}
              </h2>
              {currentSlide.subtitle && (
                <p className="mt-2 text-lg text-white/90 max-w-xl">
                  {currentSlide.subtitle}
                </p>
              )}
              {currentSlide.href && (
                <Button
                  asChild
                  size="lg"
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to={currentSlide.href}>
                    {currentSlide.ctaLabel ?? "Shop now"}
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Previous / Next — RTL: left/right actions swapped so arrow direction matches */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg border-0 bg-white/90 hover:bg-white"
        onClick={leftAction}
        aria-label={leftLabel}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg border-0 bg-white/90 hover:bg-white"
        onClick={rightAction}
        aria-label={rightLabel}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2",
          isRTL && "flex-row-reverse",
        )}
        role="tablist"
        aria-label="Slide navigation"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70",
            )}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;
