import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import promoTexture from "@/assets/promo-texture-cream.jpg";
import promoSunscreen from "@/assets/promo-sunscreen.jpg";
import promoGloss from "@/assets/promo-gloss.jpg";

export interface PromoSlide {
  image: string;
  label: string;
  alt: string;
  /** "left" | "right" | "center" for text placement */
  align?: "left" | "right" | "center";
}

export interface PromoBannerProps {
  /** Campaign headline shown above slides, e.g. "Summer Hydration" */
  campaign: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Slides — defaults to built-in set */
  slides?: PromoSlide[];
  /** CTA link — defaults to /products */
  ctaLink?: string;
  /** CTA label */
  ctaLabel?: string;
  /** Auto-advance interval in ms — default 2500 */
  interval?: number;
}

const defaultSlides: PromoSlide[] = [
  {
    image: promoTexture,
    label: "Summer Hydration",
    alt: "Rich skincare cream texture smear on skin",
    align: "right",
  },
  {
    image: promoSunscreen,
    label: "Protects.",
    alt: "Sunscreen product with drops",
    align: "left",
  },
  {
    image: promoGloss,
    label: "Shines.",
    alt: "Luxury lip gloss with color swatch",
    align: "left",
  },
];

export default function PromoBanner({
  campaign = "Summer Hydration",
  subtitle,
  slides = defaultSlides,
  ctaLink = "/products",
  ctaLabel = "Shop The Edit",
  interval = 2500,
}: PromoBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showClosing, setShowClosing] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Trigger on scroll
  useEffect(() => {
    if (hasPlayed) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasPlayed(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasPlayed]);

  // Auto-advance slides then show closing
  useEffect(() => {
    if (!hasPlayed) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev < slides.length - 1) return prev + 1;
        // Last slide done — show closing
        setTimeout(() => setShowClosing(true), interval * 0.6);
        return prev;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [hasPlayed, slides.length, interval]);

  // Progress dots
  const totalPhases = slides.length + 1; // slides + closing
  const currentPhase = showClosing ? slides.length : activeIndex;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-card py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Campaign Header */}
        <div className="text-center mb-10">
          <p className="font-body text-xs uppercase tracking-[0.25em] text-accent mb-2">
            Limited Edition
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {campaign}
          </h2>
          {subtitle && (
            <p className="mt-3 text-muted-foreground font-body text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Slide Stage */}
        <div className="relative w-full max-w-3xl mx-auto aspect-square sm:aspect-[4/3] rounded-lg overflow-hidden shadow-xl bg-muted">
          <AnimatePresence mode="wait">
            {!showClosing ? (
              <motion.div
                key={`slide-${activeIndex}`}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={slides[activeIndex].image}
                  alt={slides[activeIndex].alt}
                  className="h-full w-full object-cover"
                />
                {/* Text overlay */}
                <div
                  className={`absolute inset-0 flex items-end p-8 sm:p-12 ${
                    slides[activeIndex].align === "right"
                      ? "justify-end text-right"
                      : slides[activeIndex].align === "center"
                      ? "justify-center text-center"
                      : "justify-start text-left"
                  }`}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="font-heading text-3xl sm:text-5xl font-bold text-card drop-shadow-lg"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                  >
                    {slides[activeIndex].label}
                  </motion.p>
                </div>
              </motion.div>
            ) : (
              /* Closing — Golden Lotus */
              <motion.div
                key="closing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 bg-background flex flex-col items-center justify-center gap-6 p-8"
              >
                {/* Golden Lotus mark */}
                <motion.div
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                  className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center shadow-lg shadow-accent/20"
                >
                  <span className="font-heading text-3xl font-bold text-accent">
                    A
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center space-y-2"
                >
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Asper Beauty Shop
                  </p>
                  <p className="font-body text-sm text-muted-foreground tracking-wider uppercase">
                    Authentic Quality
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link to={ctaLink}>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm uppercase tracking-widest shadow-lg shadow-primary/20 group">
                      {ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inner gold frame */}
          <div className="absolute inset-3 border border-accent/20 pointer-events-none rounded-sm z-10" />
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPhases }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentPhase
                  ? "w-6 bg-accent"
                  : i < currentPhase
                  ? "w-1.5 bg-accent/40"
                  : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
