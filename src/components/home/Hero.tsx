import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Leaf, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import heroVideo from "@/assets/hero-sanctuary-video.mp4";

export default function Hero() {
  const { dir, locale } = useLanguage();
  const isAr = locale === "ar";

  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  // Parallax scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${y * 0.35}px) scale(1.1)`;
      }
      if (contentRef.current) {
        const opacity = Math.max(0, 1 - y / 600);
        contentRef.current.style.opacity = `${opacity}`;
        contentRef.current.style.transform = `translateY(${y * 0.15}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen overflow-hidden flex items-center justify-center">
      {/* Video Background with Parallax */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.1)" }}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-asper-ink/40 via-asper-ink/30 to-asper-ink/60" />

      {/* Floating Gold Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[
          { size: 3, x: "15%", y: "20%", delay: 0, dur: 7 },
          { size: 2, x: "75%", y: "30%", delay: 2, dur: 9 },
          { size: 4, x: "45%", y: "60%", delay: 1, dur: 8 },
          { size: 2, x: "85%", y: "70%", delay: 3, dur: 6 },
          { size: 3, x: "25%", y: "80%", delay: 4, dur: 10 },
          { size: 2, x: "60%", y: "15%", delay: 1.5, dur: 7.5 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-polished-gold/40"
            style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Content with parallax */}
      <div ref={contentRef} className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 lg:px-16 text-center will-change-transform">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Glassmorphism Card */}
          <div className="bg-asper-stone/85 backdrop-blur-xl border border-polished-gold/30 rounded-2xl p-8 sm:p-12 lg:p-16 shadow-gold-lg">
            {/* Gold decorative line */}
            <div className="mx-auto w-20 h-px bg-gradient-to-r from-transparent via-polished-gold to-transparent mb-8" />

            <h1
              className={cn(
                "font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-asper-ink leading-[1.05] tracking-tight",
                isAr && "font-arabic"
              )}
            >
              {isAr ? (
                <>
                  بإشراف <span className="text-polished-gold">صيدلاني</span>.
                  <br />
                  مدعوم بالذكاء.
                </>
              ) : (
                <>
                  Curated by <span className="text-polished-gold">Pharmacists</span>.
                  <br />
                  Powered by Intelligence.
                </>
              )}
            </h1>

            <p
              className={cn(
                "mt-6 text-base sm:text-lg text-asper-ink-muted max-w-2xl mx-auto leading-relaxed",
                isAr ? "font-arabic" : "font-body"
              )}
            >
              {isAr
                ? "أصالة مضمونة 100% عبر أكثر من 5,000 منتج — من Vichy إلى Maybelline. روتينك المثالي يبدأ هنا."
                : "Guaranteeing 100% authenticity across 5,000+ SKUs — from Vichy to Maybelline. Your perfect regimen starts here."}
            </p>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[
                { icon: Shield, label: isAr ? "أصالة مضمونة" : "100% Authentic" },
                { icon: Leaf, label: isAr ? "خالٍ من القسوة" : "Cruelty-Free" },
                { icon: Sparkles, label: isAr ? "بإشراف صيدلاني" : "Pharmacist-Led" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 text-xs font-body text-asper-ink-muted border border-rose-clay-light rounded-full px-3 py-1 bg-asper-stone/60"
                >
                  <item.icon className="h-3 w-3 text-polished-gold" />
                  {item.label}
                </span>
              ))}
            </div>

            {/* Gold decorative line */}
            <div className="mx-auto w-20 h-px bg-gradient-to-r from-transparent via-polished-gold to-transparent my-8" />

            {/* CTA */}
            <Link to="/intelligence">
              <Button
                size="lg"
                className="group bg-burgundy text-primary-foreground hover:bg-burgundy-light border border-transparent hover:border-polished-gold hover:shadow-lg hover:shadow-polished-gold/20 text-sm uppercase tracking-widest px-10 h-14 font-semibold transition-all duration-400"
              >
                {isAr ? "ابدئي تحليل بشرتك المجاني" : "Start Free AI Skin Analysis"}
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                    dir === "rtl" ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
                  )}
                />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll-to-Explore Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ opacity: scrollY > 100 ? 0 : 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-xs font-body uppercase tracking-[0.2em] text-polished-white/70">
          {isAr ? "اكتشف المزيد" : "Scroll to explore"}
        </span>
        <motion.div
          className="w-5 h-8 rounded-full border border-polished-gold/40 flex items-start justify-center pt-1.5"
          aria-hidden="true"
        >
          <motion.div
            className="w-1 h-1.5 rounded-full bg-polished-gold"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Mute / Unmute Toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 end-6 z-20 p-2.5 rounded-full bg-asper-ink/40 backdrop-blur-sm border border-polished-gold/20 text-polished-white/80 hover:text-polished-gold hover:border-polished-gold/50 transition-all duration-300"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

      {/* Decorative Gold Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/50 to-transparent" />
    </section>
  );
}
