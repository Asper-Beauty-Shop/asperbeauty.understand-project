import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

const HERO_VIDEOS = [
  { webm: "/videos/hero-reel-1.webm", mp4: "/videos/hero-reel-1.mp4", poster: "/videos/hero-poster-1.jpg", id: "reel-1" },
  { webm: "/videos/hero-reel-2.webm", mp4: "/videos/hero-reel-2.mp4", poster: "/videos/hero-poster-2.jpg", id: "reel-2" },
  { webm: "/videos/hero-reel-3.webm", mp4: "/videos/hero-reel-3.mp4", poster: "/videos/hero-poster-3.jpg", id: "reel-3" },
];

const CROSSFADE_DURATION = 1.2; // seconds
const SLIDE_INTERVAL = 8000; // ms per video

export default function AmbientVideoHero() {
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Preload subsequent videos when first video is halfway
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (!firstVideo) return;

    const handleTimeUpdate = () => {
      if (firstVideo.currentTime > firstVideo.duration * 0.5) {
        // Trigger load on remaining videos
        videoRefs.current.forEach((v, i) => {
          if (i > 0 && v && v.preload === "none") {
            v.preload = "auto";
            v.load();
          }
        });
        firstVideo.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };

    firstVideo.addEventListener("timeupdate", handleTimeUpdate);
    return () => firstVideo.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Advance slides and manage playback
  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setProgress(0);

      // Play the target video, pause others
      videoRefs.current.forEach((v, i) => {
        if (!v) return;
        if (i === index) {
          v.currentTime = 0;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    },
    [],
  );

  // Auto-advance timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % HERO_VIDEOS.length;
        goTo(next);
        return next;
      });
    }, SLIDE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goTo]);

  // Progress bar animation (updates every 50ms for smooth fill)
  useEffect(() => {
    setProgress(0);
    const step = 50 / SLIDE_INTERVAL; // fraction per tick

    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + step, 1));
    }, 50);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [activeIndex]);

  const handleIndicatorClick = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    goTo(index);
    // Restart auto-advance
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % HERO_VIDEOS.length;
        goTo(next);
        return next;
      });
    }, SLIDE_INTERVAL);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* ── Cinematic Crossfade Video Layers ── */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 z-0">
        {HERO_VIDEOS.map((video, i) => (
          <video
            key={video.id}
            ref={(el) => { videoRefs.current[i] = el; }}
            autoPlay={i === 0}
            muted
            loop
            playsInline
            disablePictureInPicture
            poster={video.poster}
            preload={i === 0 ? "auto" : "none"}
            className="absolute inset-0 w-full h-full object-cover scale-105 will-change-[opacity]"
            style={{
              opacity: activeIndex === i ? 1 : 0,
              transition: `opacity ${CROSSFADE_DURATION}s ease-in-out`,
              zIndex: activeIndex === i ? 2 : 1,
            }}
          >
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </video>
        ))}

        {/* Luxury Vignette Overlay */}
        <div className="absolute inset-0 z-[3] bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/60" />
        <div className="absolute inset-0 z-[3] bg-charcoal/20" />
      </motion.div>

      {/* ── Content: Minimalist Floating Typography ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: LUXURY_EASE }}
          className="mb-12"
        >
          <img
            src="/asper-logo.png"
            alt="Asper"
            className="h-16 md:h-24 mx-auto drop-shadow-2xl brightness-0 invert"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: LUXURY_EASE }}
          className={cn(
            "font-display text-5xl md:text-8xl lg:text-9xl font-light text-white tracking-tighter leading-none mb-8",
            isAr && "font-arabic",
          )}
        >
          {isAr ? "الجمال بلمسة طبية" : "Clinical Excellence,"}
          <br />
          <span className="font-display italic text-polished-gold">
            {isAr ? "وفخامة عصرية" : "Elegantly Defined."}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
        >
          <Button
            asChild
            className="bg-polished-gold text-charcoal hover:bg-white px-12 py-8 text-sm uppercase tracking-[0.3em] font-bold rounded-none transition-all duration-500 hover:scale-105"
          >
            <Link to="/skin-concerns">
              {isAr ? "ابدئي الاستشارة" : "Begin Consultation"}
            </Link>
          </Button>

          <Link
            to="/shop"
            className="text-white uppercase tracking-[0.2em] text-xs font-semibold flex items-center group"
          >
            <span className="border-b border-polished-gold/0 group-hover:border-polished-gold transition-all duration-500 pb-1">
              {isAr ? "تسوقي المجموعة" : "Explore The Collection"}
            </span>
            <ArrowRight className="ms-3 h-4 w-4 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Cinematic Progress Indicators ── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => handleIndicatorClick(i)}
            className="group relative h-1 rounded-full overflow-hidden transition-all duration-500"
            style={{ width: activeIndex === i ? 48 : 24 }}
            aria-label={`Video ${i + 1}`}
          >
            {/* Track */}
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-colors duration-500",
                activeIndex === i ? "bg-white/30" : "bg-white/15 group-hover:bg-white/25",
              )}
            />
            {/* Fill */}
            {activeIndex === i && (
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-polished-gold"
                style={{
                  width: `${progress * 100}%`,
                  transition: "width 50ms linear",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <div className="w-px h-8 bg-gradient-to-b from-polished-gold to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.4em] text-polished-gold/60">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
