import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home, Search, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const EASE = [0.19, 1, 0.22, 1] as unknown as number[];

const QUICK_LINKS = [
  { en: "Shop All Products", ar: "تسوق جميع المنتجات", href: "/shop" },
  { en: "Skin Concerns", ar: "مشاكل البشرة", href: "/skin-concerns" },
  { en: "Best Sellers", ar: "الأكثر مبيعاً", href: "/best-sellers" },
  { en: "Brands", ar: "العلامات التجارية", href: "/brands" },
];

const NotFound = () => {
  const location = useLocation();
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-[#0a0505] relative overflow-hidden",
        isAr && "text-right"
      )}
    >
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(128,0,32,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/50 to-transparent" />

      {/* Minimal header */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <Link
          to="/"
          className="font-display text-polished-gold text-lg tracking-widest uppercase"
        >
          Asper Beauty
        </Link>
        <Link
          to="/"
          className={cn(
            "inline-flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest font-body hover:text-polished-gold transition-colors",
            isAr && "flex-row-reverse"
          )}
        >
          <Home className="w-3.5 h-3.5" />
          {isAr ? "الرئيسية" : "Home"}
        </Link>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-polished-gold/30 bg-polished-gold/10 text-polished-gold text-[10px] uppercase tracking-[0.35em] font-body">
            <Sparkles className="w-3 h-3" />
            {isAr ? "خطأ 404" : "Error 404"}
          </span>
        </motion.div>

        {/* Giant gold number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="relative mb-8 select-none"
          aria-hidden="true"
        >
          <span
            className="font-display font-medium leading-none text-transparent bg-clip-text"
            style={{
              fontSize: "clamp(120px, 20vw, 200px)",
              backgroundImage:
                "linear-gradient(135deg, hsl(43 69% 46%) 0%, hsl(43 69% 65%) 40%, hsl(43 69% 46%) 100%)",
            }}
          >
            404
          </span>
          {/* Gold shimmer */}
          <motion.div
            initial={{ x: "-120%", opacity: 0.6 }}
            animate={{ x: "120%", opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.9 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          />
        </motion.div>

        {/* Animated gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          className="mb-8 h-px w-24 bg-gradient-to-r from-polished-gold/80 to-transparent mx-auto origin-center"
        />

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="font-display text-2xl md:text-3xl text-white font-medium mb-4 max-w-lg"
        >
          {isAr ? "هذه الصفحة غير موجودة" : "This page doesn't exist"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="font-body text-white/55 text-base max-w-sm mb-12 leading-relaxed"
        >
          {isAr
            ? "يبدو أن هذه الصفحة قد انتقلت. دعينا نساعدك في العثور على ما تبحثين عنه."
            : "The page may have moved or never existed. Let us help you find what you need."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
          className={cn(
            "flex flex-wrap items-center justify-center gap-4 mb-16",
            isAr && "flex-row-reverse"
          )}
        >
          <Link
            to="/"
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
            <Home className="w-4 h-4" />
            {isAr ? "العودة للرئيسية" : "Back to Home"}
          </Link>

          <Link
            to="/shop"
            className={cn(
              "group inline-flex items-center gap-2.5 px-8 py-4",
              "bg-transparent border-2 border-white/25 text-white/75",
              "font-body text-[11px] uppercase tracking-[0.3em]",
              "transition-all duration-500 backdrop-blur-sm",
              "hover:border-white/60 hover:text-white",
              isAr && "flex-row-reverse"
            )}
          >
            <Search className="w-4 h-4" />
            {isAr ? "تصفح المتجر" : "Browse the Shop"}
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
          className="border-t border-white/10 pt-8 w-full max-w-md"
        >
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/30 mb-5">
            {isAr ? "روابط سريعة" : "Quick Links"}
          </p>
          <ul
            className={cn(
              "flex flex-wrap justify-center gap-x-6 gap-y-2",
              isAr && "flex-row-reverse"
            )}
          >
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 font-body text-sm text-white/50",
                    "hover:text-polished-gold transition-colors",
                    isAr && "flex-row-reverse"
                  )}
                >
                  <ArrowRight
                    className={cn(
                      "w-3 h-3 opacity-50",
                      isAr && "rotate-180"
                    )}
                  />
                  {isAr ? link.ar : link.en}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </main>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent" />
    </div>
  );
};

export default NotFound;
