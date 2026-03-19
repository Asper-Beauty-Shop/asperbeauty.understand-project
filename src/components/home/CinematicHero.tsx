import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Brain } from "lucide-react";
import alchemistImg from "@/assets/alchemist-touch-hero.jpg";
import sanctuaryImg from "@/assets/hero-sanctuary.jpg";
import serumsImg from "@/assets/hero-golden-serums.jpg";

// ─── constants ────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

interface Stat {
  value: number;
  suffix: string;
  labelEn: string;
  labelAr: string;
  displayEn: string;
  displayAr: string;
}

const STATS: Stat[] = [
  {
    value: 10000,
    suffix: "+",
    labelEn: "Products",
    labelAr: "منتج",
    displayEn: "10,000+",
    displayAr: "+١٠٬٠٠٠",
  },
  {
    value: 50,
    suffix: "+",
    labelEn: "Brands",
    labelAr: "علامة تجارية",
    displayEn: "50+",
    displayAr: "+٥٠",
  },
  {
    value: 100,
    suffix: "%",
    labelEn: "Pharmacist-Curated",
    labelAr: "بإشراف صيدلاني",
    displayEn: "100%",
    displayAr: "١٠٠٪",
  },
];

// Editorial images for the right stack
const EDITORIAL_IMAGES = [
  {
    src: alchemistImg,
    alt: "Alchemist touch — premium serum",
    labelEn: "Pharmacist Picks",
    labelAr: "اختيارات الصيدلاني",
    rotate: "-6deg",
    offsetX: "-16px",
    offsetY: "-24px",
    zIndex: 1,
  },
  {
    src: sanctuaryImg,
    alt: "Morning spa sanctuary",
    labelEn: "Morning Ritual",
    labelAr: "طقوس الصباح",
    rotate: "4deg",
    offsetX: "24px",
    offsetY: "32px",
    zIndex: 2,
  },
  {
    src: serumsImg,
    alt: "Golden serums collection",
    labelEn: "Authentic Quality",
    labelAr: "جودة أصيلة",
    rotate: "-1deg",
    offsetX: "0px",
    offsetY: "0px",
    zIndex: 3,
  },
];

// ─── animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function AnimatedStat({ stat, isAr, animate }: { stat: Stat; isAr: boolean; animate: boolean }) {
  const count = useCountUp(stat.value, 1400, animate);
  const formatted =
    count >= 1000
      ? count.toLocaleString("en-US")
      : count.toString();

  return (
    <div className={cn("flex flex-col", isAr ? "items-end" : "items-start")}>
      <span className="font-display text-2xl md:text-3xl text-polished-gold leading-none tabular-nums">
        {animate ? `${formatted}${stat.suffix}` : (isAr ? stat.displayAr : stat.displayEn)}
      </span>
      <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
        {isAr ? stat.labelAr : stat.labelEn}
      </span>
    </div>
  );
}

// ─── editorial card ───────────────────────────────────────────────────────────

function EditorialCard({
  image,
  index,
  isAr,
  parallaxY,
}: {
  image: (typeof EDITORIAL_IMAGES)[number];
  index: number;
  isAr: boolean;
  parallaxY: ReturnType<typeof useTransform>;
}) {
  // Compute positional styles (no `transform` here — framer-motion owns that)
  const posStyle: React.CSSProperties = {
    zIndex: image.zIndex,
    top: index === 0 ? "5%" : index === 1 ? "35%" : "62%",
    left:
      index === 0
        ? isAr ? "auto" : "8%"
        : index === 1
        ? isAr ? "8%" : "auto"
        : "50%",
    right:
      index === 0
        ? isAr ? "8%" : "auto"
        : index === 1
        ? isAr ? "auto" : "8%"
        : "auto",
    marginLeft: index === 2 ? "-130px" : undefined,
  };

  return (
    <motion.div
      style={{ ...posStyle, y: parallaxY }}
      initial={{ opacity: 0, y: 40, rotate: image.rotate }}
      animate={{ opacity: 1, y: 0, rotate: image.rotate }}
      transition={{ duration: 1, ease: EASE, delay: 0.5 + index * 0.15 }}
      whileHover={{ scale: 1.03, rotate: "0deg", zIndex: 10 }}
      className="absolute w-[200px] md:w-[240px] lg:w-[260px] cursor-pointer select-none"
    >
      {/* Card shadow frame */}
      <div className="relative rounded-xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.5)] border border-white/10">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full aspect-[3/4] object-cover object-center"
          loading="eager"
        />
        {/* Frosted label pill */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-polished-gold/30">
            <div className="w-1.5 h-1.5 rounded-full bg-polished-gold animate-pulse" />
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-polished-gold">
              {isAr ? image.labelAr : image.labelEn}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function CinematicHero() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const sectionRef = useRef<HTMLElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Parallax: left content scrolls up, right images scroll at different rate
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const leftY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const img0Y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const img1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const img2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const parallaxValues = [img0Y, img1Y, img2Y];

  // Trigger counter when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0a0505]"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Layer 0: Full-bleed video ── */}
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

      {/* ── Layer 1: Split gradient overlay ── */}
      {/* Left dark for text legibility, right mostly clear to show images */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: isAr
            ? `
              linear-gradient(to left,
                rgba(10,5,5,0.92) 0%,
                rgba(10,5,5,0.78) 45%,
                rgba(10,5,5,0.30) 65%,
                rgba(10,5,5,0.10) 100%
              ),
              linear-gradient(to bottom,
                rgba(10,5,5,0.20) 0%,
                rgba(10,5,5,0.10) 50%,
                rgba(10,5,5,0.75) 100%
              )
            `
            : `
              linear-gradient(to right,
                rgba(10,5,5,0.92) 0%,
                rgba(10,5,5,0.78) 45%,
                rgba(10,5,5,0.30) 65%,
                rgba(10,5,5,0.10) 100%
              ),
              linear-gradient(to bottom,
                rgba(10,5,5,0.20) 0%,
                rgba(10,5,5,0.10) 50%,
                rgba(10,5,5,0.75) 100%
              )
            `,
        }}
      />

      {/* ── Layer 30: Gold accent lines ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/50 to-transparent z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent z-30" />

      {/* ── Main layout: side-by-side on md+, stacked on mobile ── */}
      <div
        className={cn(
          "relative z-10 flex flex-col md:flex-row items-center h-full min-h-[100dvh]",
          isAr && "md:flex-row-reverse"
        )}
      >
        {/* ═══ LEFT PANEL (55%) ═══════════════════════════════════════════════ */}
        <motion.div
          style={{ y: leftY, opacity: leftOpacity }}
          className={cn(
            "flex flex-col justify-center w-full md:w-[55%] min-h-[100dvh]",
            "px-6 sm:px-10 lg:px-16 xl:px-24 pt-28 pb-24",
            isAr ? "items-end text-right" : "items-start text-left"
          )}
        >
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mb-7"
          >
            <span
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full",
                "border border-polished-gold/40 bg-polished-gold/10 backdrop-blur-sm",
                "text-polished-gold text-[10px] uppercase tracking-[0.35em] font-body",
                isAr && "flex-row-reverse"
              )}
            >
              <Sparkles className="w-3 h-3 flex-shrink-0" />
              {isAr
                ? "مُختارة من صيادلة متخصصين · وجهة الجمال الأولى في الأردن"
                : "Curated by Pharmacists · Jordan's No.1 Beauty Destination"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
            className={cn(
              "font-display font-medium leading-[1.08] text-white mb-5",
              "text-[clamp(38px,5.5vw,66px)]",
              isAr && "font-arabic leading-[1.3] text-[clamp(32px,4.5vw,58px)]"
            )}
          >
            {isAr ? (
              <>
                حيث العلم{"\n"}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-polished-gold via-amber-300 to-polished-gold">
                    يلتقي بالرفاهية.
                  </span>
                  {/* Gold shimmer beam */}
                  <motion.span
                    initial={{ x: "-110%", opacity: 0.7 }}
                    animate={{ x: "110%", opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: 1.2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent pointer-events-none"
                  />
                </span>
              </>
            ) : (
              <>
                Where Science{"\n"}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-polished-gold via-amber-300 to-polished-gold">
                    Meets Sanctuary.
                  </span>
                  {/* Gold shimmer beam */}
                  <motion.span
                    initial={{ x: "-110%", opacity: 0.7 }}
                    animate={{ x: "110%", opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: 1.2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent pointer-events-none"
                  />
                </span>
              </>
            )}
          </motion.h1>

          {/* Animated gold rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            className={cn(
              "mb-6 h-px w-36 bg-gradient-to-r from-polished-gold/80 to-transparent",
              isAr ? "origin-right ml-auto" : "origin-left"
            )}
          />

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
            className={cn(
              "font-body text-white/65 text-base md:text-[17px] max-w-[420px] mb-10 leading-relaxed",
              isAr && "max-w-[380px]"
            )}
          >
            {isAr
              ? "مجموعة فاخرة مُعتمَدة من صيادلة متخصصين — تمزج بين الفعالية العلمية وجماليات المنتجع. لأن بشرتك تستحق الاثنين معاً."
              : "A pharmacist-approved luxury collection that blends clinical efficacy with spa-grade indulgence. Because your skin deserves both."}
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
            className={cn(
              "flex flex-wrap gap-4 mb-14",
              isAr && "flex-row-reverse"
            )}
          >
            {/* Primary CTA */}
            <Link
              to="/shop"
              className={cn(
                "group inline-flex items-center gap-2.5 px-8 py-4",
                "bg-burgundy border-2 border-burgundy text-white",
                "font-body text-[11px] uppercase tracking-[0.3em]",
                "transition-all duration-500",
                "hover:bg-transparent hover:border-polished-gold hover:text-polished-gold",
                "hover:shadow-[0_0_30px_rgba(197,160,40,0.2)]",
                isAr && "flex-row-reverse"
              )}
            >
              {isAr ? "استكشفي المجموعة" : "Explore the Collection"}
              <ArrowRight
                className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isAr
                    ? "rotate-180 group-hover:-translate-x-1"
                    : "group-hover:translate-x-1"
                )}
              />
            </Link>

            {/* Ghost CTA */}
            <Link
              to="/skin-concerns"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4",
                "bg-transparent border-2 border-white/25 text-white/75",
                "font-body text-[11px] uppercase tracking-[0.3em]",
                "transition-all duration-500 backdrop-blur-sm",
                "hover:border-white/60 hover:text-white",
                isAr && "flex-row-reverse"
              )}
            >
              <Brain className="w-4 h-4 opacity-70" />
              {isAr ? "تحليل البشرة بالذكاء الاصطناعي" : "AI Skin Analysis"}
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
            className={cn(
              "border-t border-white/10 pt-7 w-full max-w-[420px]",
              isAr && "ml-auto"
            )}
          >
            <div
              className={cn(
                "grid grid-cols-3 gap-4",
                isAr && "direction-rtl"
              )}
            >
              {STATS.map((stat, i) => (
                <AnimatedStat
                  key={i}
                  stat={stat}
                  isAr={isAr}
                  animate={statsVisible}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ═══ RIGHT PANEL (45%) — Editorial Image Stack ══════════════════════ */}
        <div
          className={cn(
            "hidden md:block relative w-[45%] self-stretch flex-shrink-0",
            "overflow-visible"
          )}
          aria-hidden="true"
        >
          {/* Floating cards container */}
          <div className="relative w-full h-full min-h-[100dvh]">
            <AnimatePresence>
              {EDITORIAL_IMAGES.map((image, i) => (
                <EditorialCard
                  key={i}
                  image={image}
                  index={i}
                  isAr={isAr}
                  parallaxY={parallaxValues[i]}
                />
              ))}
            </AnimatePresence>

            {/* Faint circular glow behind the stack */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(128,0,32,0.18) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-polished-gold rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
