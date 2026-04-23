import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { AnimatedTrustBadge } from "./AnimatedTrustBadge";

// Hero assets
const heroLifestyle = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1920&q=80";
import heroVideo from "@/assets/brand-video-1.mp4";

// Toggle between video and image background
const USE_VIDEO_BACKGROUND = true;

// Preload hero image
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const Hero = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const parallaxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  const handleVideoReady = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  // Preload hero image on mount
  useEffect(() => {
    preloadImage(heroLifestyle)
      .then(() => setIsImageLoaded(true))
      .catch(() => setIsImageLoaded(true)); // Still show even if preload fails
  }, []);

  // Enhanced parallax effect with multiple layers
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setScrollY(scrolled);

      // Background moves slower (parallax depth effect)
      if (parallaxRef.current) {
        const bgRate = scrolled * 0.5;
        parallaxRef.current.style.transform =
          `translateY(${bgRate}px) scale(1.15)`;
      }

      // Content moves slightly faster for depth
      if (contentRef.current) {
        const contentRate = scrolled * 0.2;
        const opacity = Math.max(0, 1 - scrolled / 600);
        contentRef.current.style.transform = `translateY(${contentRate}px)`;
        contentRef.current.style.opacity = `${opacity}`;
      }

      // Overlay darkens as you scroll
      if (overlayRef.current) {
        const overlayOpacity = Math.min(0.8, 0.4 + scrolled / 1000);
        overlayRef.current.style.background =
          `linear-gradient(to right, rgba(103, 32, 46, ${overlayOpacity}), rgba(103, 32, 46, ${
            overlayOpacity * 0.6
          }), transparent)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMediaReady = USE_VIDEO_BACKGROUND
    ? (isImageLoaded || isVideoReady)
    : isImageLoaded;

  return (
    <section className="relative min-h-[70vh] lg:min-h-[85vh] overflow-hidden bg-burgundy">
      {/* Loading placeholder with brand color */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-burgundy via-burgundy/90 to-burgundy/70 z-0 transition-opacity duration-700 ${
          isMediaReady ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      />

      {/* Full-width background image with parallax */}
      <div
        className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${
          isMediaReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          ref={parallaxRef}
          className="absolute inset-[-10%] scale-115 will-change-transform transition-transform duration-100 ease-out"
          style={{ transform: "translateY(0) scale(1.15)" }}
        >
          {USE_VIDEO_BACKGROUND
            ? (
              <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                poster={heroLifestyle}
                className="w-full h-full object-cover"
                onCanPlay={handleVideoReady}
                onLoadedData={handleVideoReady}
              >
                <source src={heroVideo} type="video/mp4" />
                {/* Fallback to image if video fails */}
                <img
                  src={heroLifestyle}
                  alt={isArabic
                    ? "مجموعة الجمال الفاخرة"
                    : "Luxury Beauty Collection"}
                  className="w-full h-full object-cover"
                />
              </video>
            )
            : (
              <img
                src={heroLifestyle}
                alt={isArabic
                  ? "مجموعة الجمال الفاخرة"
                  : "Luxury Beauty Collection"}
                className="w-full h-full object-cover"
                fetchPriority="high"
                width={1920}
                height={1080}
                decoding="async"
                onLoad={() => setIsImageLoaded(true)}
              />
            )}
        </div>

        {/* Animated gradient overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 transition-all duration-300 ease-out"
          style={{
            background:
              "linear-gradient(to right, rgba(103, 32, 46, 0.75), rgba(103, 32, 46, 0.45), transparent)",
          }}
        />

        {/* Decorative floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-2 h-2 bg-gold/30 rounded-full blur-sm"
            style={{
              top: "20%",
              left: "15%",
              transform: `translateY(${scrollY * -0.3}px)`,
              transition: "transform 0.1s ease-out",
            }}
          />
          <div
            className="absolute w-3 h-3 bg-gold/20 rounded-full blur-sm"
            style={{
              top: "40%",
              left: "25%",
              transform: `translateY(${scrollY * -0.5}px)`,
              transition: "transform 0.1s ease-out",
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-cream/30 rounded-full blur-sm"
            style={{
              top: "60%",
              left: "10%",
              transform: `translateY(${scrollY * -0.4}px)`,
              transition: "transform 0.1s ease-out",
            }}
          />
          <div
            className="absolute w-2 h-2 bg-gold/25 rounded-full blur-sm"
            style={{
              top: "30%",
              left: "35%",
              transform: `translateY(${scrollY * -0.6}px)`,
              transition: "transform 0.1s ease-out",
            }}
          />
        </div>
      </div>

      {/* Content overlay with parallax */}
      <div
        ref={contentRef}
        className="relative z-10 luxury-container h-full min-h-[70vh] lg:min-h-[85vh] flex items-center will-change-transform"
        style={{ transform: "translateY(0)", opacity: 1 }}
      >
        <div
          className={`max-w-xl ${
            isArabic ? "text-right mr-auto" : "text-left"
          }`}
        >
          {/* Animated Trust Badge Component */}
          <div
            className="mb-6 animate-fade-in"
            style={{ animationDelay: "0.05s" }}
          >
            <AnimatedTrustBadge />
          </div>

          {/* Script Sub-header with staggered animation */}
          <span
            className="font-script text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold mb-4 block animate-fade-in drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
            style={{
              animationDelay: "0.1s",
              transform: `translateY(${scrollY * 0.1}px)`,
              transition: "transform 0.1s ease-out",
              animation: "gold-pulse 3s ease-in-out infinite",
            }}
          >
            {isArabic ? "مُنتقاة من الصيادلة." : "Curated by Pharmacists."}
          </span>

          {/* Main Headline with Gold Underline */}
          <div className="mb-6">
            <h1
              className="font-display text-4xl lg:text-5xl xl:text-6xl text-white leading-tight animate-fade-in drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              style={{
                animationDelay: "0.2s",
                transform: `translateY(${scrollY * 0.08}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              {isArabic ? "مدعومة بالذكاء." : "Powered by Intelligence."}
            </h1>
            {/* Gold Underline */}
            <div
              className="h-0.5 w-32 mt-3 bg-gradient-to-r from-gold via-gold-light to-transparent rounded-full animate-fade-in"
              style={{ animationDelay: "0.25s" }}
            />
          </div>

          {/* Luxury Divider */}
          <div
            className="flex items-center gap-3 mb-6 animate-fade-in"
            style={{ animationDelay: "0.28s" }}
          >
            <div className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-gold/50" />
            <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <div className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          {/* Subtext with gold-tinted shadow */}
          <p
            className="font-body text-lg text-cream/90 mb-10 leading-relaxed animate-fade-in tracking-wide drop-shadow-[0_2px_8px_rgba(212,175,55,0.1)]"
            style={{
              animationDelay: "0.3s",
              transform: `translateY(${scrollY * 0.05}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {isArabic
              ? "نحن لا نبيع مستحضرات التجميل فحسب؛ بل نوزّع الجمال بذكاء."
              : "We are not just selling cosmetics; we are dispensing beauty through intelligence."}
          </p>

          {/* CTA Buttons with luxury styling */}
          <div
            className="flex flex-wrap gap-4 animate-fade-in"
            style={{
              animationDelay: "0.4s",
              transform: `translateY(${scrollY * 0.03}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Primary CTA */}
            <Link to="/collections/skin-care">
              <Button className="relative overflow-hidden bg-gradient-to-r from-burgundy via-burgundy to-burgundy-light text-white 
                  hover:border-gold border-2 border-transparent
                  font-display text-sm tracking-widest uppercase px-10 py-6 rounded-full
                  transition-all duration-500 shadow-lg hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)] 
                  hover:-translate-y-1 hover:scale-105 group">
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isArabic ? "استكشف المختبر" : "Explore the Laboratory"}
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Button>
            </Link>

            {/* Secondary CTA */}
            <Link to="/brands">
              <Button
                variant="outline"
                className="relative overflow-hidden bg-transparent backdrop-blur-sm
                  border-2 border-gold/40 hover:border-gold text-cream hover:text-gold
                  font-display text-sm tracking-widest uppercase px-8 py-6 rounded-full
                  transition-all duration-500 hover:bg-gold/10 hover:shadow-[0_6px_25px_rgba(212,175,55,0.2)]
                  hover:-translate-y-1 group"
              >
                <span className="relative z-10">
                  {isArabic ? "تسوق حسب العلامة التجارية" : "Shop by Brand"}
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500"
        style={{ opacity: scrollY > 100 ? 0 : 1 }}
      >
        <span className="text-cream/70 text-xs font-body tracking-widest uppercase">
          {isArabic ? "اكتشف المزيد" : "Scroll to explore"}
        </span>
        <div className="w-6 h-10 border-2 border-gold/40 rounded-full flex justify-center pt-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <div className="w-1.5 h-3 bg-gold rounded-full animate-bounce shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
        </div>
      </div>

      {/* Decorative Gold Accent Line - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Video Sound Control Button */}
      {USE_VIDEO_BACKGROUND && (
        <button
          onClick={toggleMute}
          className={`absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full 
            flex items-center justify-center transition-all duration-300
            backdrop-blur-sm border border-cream/30
            ${
            isMuted
              ? "bg-cream/10 hover:bg-cream/20"
              : "bg-gold/80 hover:bg-gold"
          }
            group shadow-lg hover:shadow-xl hover:scale-110`}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted
            ? (
              <VolumeX className="w-5 h-5 text-cream group-hover:scale-110 transition-transform" />
            )
            : (
              <Volume2 className="w-5 h-5 text-burgundy group-hover:scale-110 transition-transform" />
            )}

          {/* Tooltip */}
          <span className="absolute bottom-full mb-2 px-3 py-1 bg-foreground text-cream text-xs font-body 
            rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {isMuted
              ? (isArabic ? "تشغيل الصوت" : "Unmute")
              : (isArabic ? "كتم الصوت" : "Mute")}
          </span>
        </button>
      )}
    </section>
  );
};

