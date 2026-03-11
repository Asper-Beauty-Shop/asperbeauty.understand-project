import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedTrustBadge } from "./AnimatedTrustBadge";
import { useLanguage } from "@/contexts/LanguageContext";

// Generate random gold particles
const generateParticles = (count: number) => {
  return Array.from({
    length: count,
  }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.5,
  }));
};
const GoldParticles = () => {
  const [particles] = useState(() => generateParticles(40));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-[#FFC300] to-[#D4AF37]"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `floatUp ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 195, 0, 0.6)`,
          }}
        />
      ))}

      {/* Keyframe styles */}
      <style>
        {`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: ${0.3 + Math.random() * 0.4};
          }
          90% {
            opacity: ${0.3 + Math.random() * 0.4};
          }
          100% {
            transform: translateY(-20vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}
      </style>
    </div>
  );
};
const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#FFF8E1] via-[#FFFDF5] to-[#FFF8E1]">
      {/* --- FLOATING GOLD PARTICLES --- */}
      <GoldParticles />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 lg:py-20">
        {/* Rotating Trust Badge */}
        <div
          className="mb-8 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <AnimatedTrustBadge />
        </div>

        {/* Gold divider above headline */}
        <div
          className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        />

        {/* Headline */}
        <h1
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-asper-charcoal mb-4 drop-shadow-sm text-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
          dir={isAr ? "rtl" : "ltr"}
        >
          {isAr ? "اكتشفي طقوسك الجمالية" : "Discover Your Ritual"}
        </h1>

        {/* Gold divider below headline */}
        <div
          className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Sub-Headline */}
        <p
          className="max-w-xl text-lg md:text-xl text-asper-charcoal/70 font-sans mb-10 text-center animate-fade-in"
          style={{ animationDelay: "0.6s" }}
          dir={isAr ? "rtl" : "ltr"}
        >
          {isAr
            ? "منتجات فاخرة للعناية بالبشرة والجمال من أرقى العلامات التجارية العالمية — مُعتمدة صيدلانياً"
            : "Curated luxury skincare & beauty from the world's most prestigious brands — pharmacist verified"}
        </p>

        {/* --- CINEMATIC VIDEO SHOWCASE --- */}
        <div
          className="relative w-full max-w-5xl mx-auto mb-12 animate-fade-in"
          style={{ animationDelay: "0.7s" }}
        >
          {/* Decorative Corner Accents */}
          <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-[#D4AF37]/60 rounded-tl-lg" />
          <div className="absolute -top-3 -right-3 w-16 h-16 border-r-2 border-t-2 border-[#D4AF37]/60 rounded-tr-lg" />
          <div className="absolute -bottom-3 -left-3 w-16 h-16 border-l-2 border-b-2 border-[#D4AF37]/60 rounded-bl-lg" />
          <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-[#D4AF37]/60 rounded-br-lg" />

          {/* Outer Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 via-transparent to-[#D4AF37]/20 blur-2xl -z-10 scale-105" />

          {/* Video Container with Gold Border */}
          <div className="group relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.3),0_10px_30px_-10px_rgba(0,0,0,0.15)] hover:border-[#D4AF37]/70 hover:shadow-[0_25px_70px_-15px_rgba(212,175,55,0.4),0_15px_40px_-10px_rgba(0,0,0,0.2)] transition-all duration-500 cursor-pointer">
            {/* Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none z-10" />

            {/* Fallback image while video loads */}
            <img
              src="/hero-banner.jpg"
              alt="Asper Beauty"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                videoLoaded ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Main Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full aspect-video object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>

            {/* Inner Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.15)_100%)] pointer-events-none" />
          </div>

          {/* "Now Playing" Label */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-[#D4AF37]/30 shadow-lg">
            <span className="text-xs uppercase tracking-[0.2em] text-asper-charcoal/60 font-sans">
              The Asper Experience
            </span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div
          className="flex flex-col gap-4 sm:flex-row animate-fade-in"
          style={{ animationDelay: "0.9s" }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#800020] to-[#4A0404] text-white font-semibold px-10 py-6 text-base hover:shadow-[0_8px_30px_rgba(128,0,32,0.45)] transition-all duration-300 hover:scale-105 rounded-full"
          >
            <Link to="/shop">
              {isAr ? "تسوّقي المجموعة" : "Shop Collection"}
              <ArrowRight className={`h-5 w-5 ${isAr ? "mr-2 rotate-180" : "ml-2"}`} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-[#D4AF37]/60 text-asper-charcoal px-10 py-6 text-base hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 rounded-full"
          >
            <Link to="/skin-concerns">
              <Sparkles className={`h-4 w-4 ${isAr ? "ms-2" : "me-2"} text-[#D4AF37]`} />
              {isAr ? "اكتشفي روتينك" : "Find My Ritual"}
            </Link>
          </Button>
        </div>

        {/* Concern shortcut pills */}
        <div
          className="mt-8 flex flex-wrap justify-center gap-2 animate-fade-in"
          style={{ animationDelay: "1.05s" }}
        >
          {[
            { label: isAr ? "حب الشباب" : "Acne Care", href: "/concerns/acne" },
            { label: isAr ? "مكافحة الشيخوخة" : "Anti-Aging", href: "/concerns/anti-aging" },
            { label: isAr ? "ترطيب" : "Hydration", href: "/concerns/hydration" },
            { label: isAr ? "بشرة حساسة" : "Sensitive Skin", href: "/concerns/sensitivity" },
            { label: isAr ? "آمن للحمل" : "Pregnancy Safe", href: "/concerns/sensitivity" },
          ].map((pill) => (
            <Link
              key={pill.href + pill.label}
              to={pill.href}
              className="px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-white/60 backdrop-blur-sm text-xs font-sans text-asper-charcoal/70 hover:border-[#D4AF37] hover:text-asper-charcoal hover:bg-white/80 transition-all duration-200"
            >
              {pill.label}
            </Link>
          ))}
        </div>

        {/* Tagline */}
        <p
          className="mt-10 font-serif text-sm uppercase tracking-[0.3em] text-[#D4AF37] animate-fade-in"
          style={{ animationDelay: "1.1s" }}
        >
          {isAr ? "أصالة معتمدة • جودة طبية" : "Pharmacist Verified • Medical Luxury"}
        </p>
      </div>

      {/* --- SCROLL INDICATOR --- */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-[#D4AF37]/60 bg-white/70 pt-2 backdrop-blur-sm shadow-lg">
          <div className="h-2 w-1 rounded-full bg-[#D4AF37]" />
        </div>
      </div>
    </section>
  );
};
export default HeroSection;

