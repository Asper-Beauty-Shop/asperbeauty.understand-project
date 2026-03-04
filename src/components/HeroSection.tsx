import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Star,
  Award,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const CONCERNS = [
  { en: "Acne & Blemishes", ar: "حب الشباب", href: "/concerns/acne" },
  { en: "Anti-Aging", ar: "مكافحة الشيخوخة", href: "/concerns/anti-aging" },
  { en: "Deep Hydration", ar: "ترطيب عميق", href: "/concerns/hydration" },
  { en: "Sensitive Skin", ar: "بشرة حساسة", href: "/concerns/sensitivity" },
  { en: "Pregnancy Safe", ar: "آمن للحمل", href: "/concerns/sensitivity" },
];

const STATS = [
  { value: "5,000+", en: "Authentic SKUs", ar: "منتج أصيل" },
  { value: "100%", en: "Pharmacist Verified", ar: "معتمد صيدلانياً" },
  { value: "24/7", en: "AI Concierge", ar: "مساعد ذكي" },
];

const TRUST_ITEMS = [
  { icon: Shield, en: "100% Authentic", ar: "أصيل 100%" },
  { icon: Award, en: "Medically Approved", ar: "معتمد طبياً" },
  { icon: Star, en: "Free Delivery 50+ JOD", ar: "توصيل مجاني +50 JOD" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.19, 1, 0.22, 1] },
});

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#FAF7F2]"
      dir={dir}
    >
      {/* ─── DESKTOP SPLIT GRID ─── */}
      <div className="grid min-h-screen lg:grid-cols-[58fr_42fr]">

        {/* ══════════════════════════════
            LEFT — EDITORIAL CONTENT
        ══════════════════════════════ */}
        <div
          className={cn(
            "relative z-10 flex flex-col justify-center px-8 py-28 sm:px-14 lg:px-16 xl:px-24",
            isAr && "items-end text-right"
          )}
        >
          {/* Top accent */}
          <motion.div
            className={cn("mb-8 flex items-center gap-3", isAr && "flex-row-reverse")}
            {...fadeUp(0)}
          >
            <div className="h-px w-10 bg-[#D4AF37]" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-medium font-sans">
              {isAr ? "مُعتمد صيدلانياً" : "Pharmacist Curated"}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className={cn(
              "font-serif text-[2.8rem] sm:text-[3.4rem] lg:text-[3.6rem] xl:text-[4.2rem] font-bold text-[#2C1A1D] leading-[1.05] tracking-tight mb-5",
              isAr && "font-arabic"
            )}
            {...fadeUp(0.1)}
          >
            {isAr ? (
              <>
                بإشراف{" "}
                <span className="text-[#800020] italic">صيدلاني.</span>
                <br />
                مدعوم{" "}
                <span className="relative inline-block">
                  بالذكاء
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-transparent" />
                </span>
                .
              </>
            ) : (
              <>
                Curated by{" "}
                <span className="text-[#800020] italic">Pharmacists.</span>
                <br />
                Powered by{" "}
                <span className="relative inline-block">
                  Intelligence
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-transparent" />
                </span>
                .
              </>
            )}
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            className={cn("mb-6 h-px w-20 bg-gradient-to-r from-[#D4AF37] to-transparent", isAr && "bg-gradient-to-l ml-auto mr-0")}
            {...fadeUp(0.15)}
          />

          {/* Subheading */}
          <motion.p
            className={cn(
              "text-base sm:text-[1.05rem] text-[#2C1A1D]/60 font-sans max-w-[420px] leading-relaxed mb-10",
              isAr && "font-arabic"
            )}
            {...fadeUp(0.2)}
          >
            {isAr
              ? "أصالة مضمونة 100% عبر أكثر من 5,000 منتج — من Vichy إلى Maybelline. روتينك الجمالي يبدأ هنا."
              : "Guaranteeing 100% authenticity across 5,000+ SKUs — from Vichy to Maybelline. Your perfect regimen starts here."}
          </motion.p>

          {/* Stats row */}
          <motion.div
            className={cn("flex gap-8 mb-10", isAr && "flex-row-reverse")}
            {...fadeUp(0.3)}
          >
            {STATS.map((s, i) => (
              <div key={i} className={cn("flex flex-col", isAr && "items-end")}>
                <span className="text-2xl font-bold text-[#800020] font-serif leading-none">
                  {s.value}
                </span>
                <span className="text-[11px] text-[#2C1A1D]/45 font-sans mt-1 leading-tight">
                  {isAr ? s.ar : s.en}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className={cn("flex flex-wrap gap-3 mb-10", isAr && "flex-row-reverse")}
            {...fadeUp(0.4)}
          >
            <Link to="/intelligence">
              <Button
                size="lg"
                className="group bg-[#800020] hover:bg-[#4A0E19] text-white font-sans font-semibold px-8 h-14 rounded-full text-[13px] uppercase tracking-wider transition-all duration-300 hover:shadow-[0_8px_32px_rgba(128,0,32,0.4)] hover:scale-[1.02]"
              >
                <Sparkles className={cn("h-4 w-4 flex-shrink-0", isAr ? "ml-2" : "mr-2")} />
                {isAr ? "ابدئي تحليل بشرتك" : "Start Free AI Analysis"}
                <ArrowRight
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1",
                    isAr ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
                  )}
                />
              </Button>
            </Link>
            <Link to="/shop">
              <Button
                variant="outline"
                size="lg"
                className="border-[#D4AF37]/50 text-[#2C1A1D] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] font-sans font-medium px-8 h-14 rounded-full text-[13px] uppercase tracking-wider transition-all duration-300"
              >
                {isAr ? "تسوّقي الآن" : "Shop Collection"}
              </Button>
            </Link>
          </motion.div>

          {/* Concern pills */}
          <motion.div
            className={cn("flex flex-wrap gap-2", isAr && "flex-row-reverse")}
            {...fadeUp(0.55)}
          >
            {CONCERNS.map((c) => (
              <Link
                key={c.href + c.en}
                to={c.href}
                className="px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-white/70 text-[11px] font-sans text-[#2C1A1D]/55 hover:border-[#D4AF37] hover:text-[#2C1A1D] hover:bg-white transition-all duration-200"
              >
                {isAr ? c.ar : c.en}
              </Link>
            ))}
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            className={cn(
              "mt-10 text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-sans",
              isAr && "text-right"
            )}
            {...fadeUp(0.65)}
          >
            {isAr ? "أصالة معتمدة • جودة طبية فاخرة" : "Pharmacist Verified • Medical Luxury"}
          </motion.p>
        </div>

        {/* ══════════════════════════════
            RIGHT — VISUAL PANEL
        ══════════════════════════════ */}
        <div className="relative hidden lg:block overflow-hidden bg-[#1A0F12]">
          {/* Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              videoLoaded ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Fallback image */}
          <img
            src="/hero-banner.png"
            alt=""
            aria-hidden="true"
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              videoLoaded ? "opacity-0" : "opacity-100"
            )}
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F12]/70 via-[#1A0F12]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F12]/60 via-transparent to-[#1A0F12]/20" />

          {/* Left gold border seam */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent" />

          {/* Corner decorations */}
          <div className="absolute top-8 right-8 w-14 h-14 border-r border-t border-[#D4AF37]/35 rounded-tr-lg" />
          <div className="absolute top-8 left-8 w-14 h-14 border-l border-t border-[#D4AF37]/35 rounded-tl-lg" />
          <div className="absolute bottom-36 right-8 w-14 h-14 border-r border-b border-[#D4AF37]/35 rounded-br-lg" />
          <div className="absolute bottom-36 left-8 w-14 h-14 border-l border-b border-[#D4AF37]/35 rounded-bl-lg" />

          {/* Floating glass trust card */}
          <motion.div
            className="absolute bottom-10 left-6 right-6 p-5 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-sans whitespace-nowrap">
                {isAr ? "تجربة أسبر" : "The Asper Experience"}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#D4AF37]/50 to-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TRUST_ITEMS.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                    <item.icon className="h-3.5 w-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[9.5px] text-white/60 font-sans leading-tight">
                    {isAr ? item.ar : item.en}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── MOBILE VIDEO STRIP ─── */}
      <div className="lg:hidden relative h-[260px] overflow-hidden -mt-4">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <img
          src="/hero-banner.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-transparent" />
      </div>

      {/* ─── SCROLL INDICATOR ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-[#D4AF37]/50 flex items-start justify-center pt-2 bg-white/70 backdrop-blur-sm shadow-lg">
          <div className="h-2 w-1 rounded-full bg-[#D4AF37]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
