import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

const BRAND_SLIDES = [
  { id: 1, image: "/brands/vichy.png" },
  { id: 2, image: "/editorial-showcase-1.jpg" },
  { id: 3, image: "/editorial-showcase-2.jpg" },
];

export const BrandOfTheWeek = () => {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % BRAND_SLIDES.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + BRAND_SLIDES.length) % BRAND_SLIDES.length);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-asper-stone to-asper-stone-light relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Brand Story Content */}
            <div className={cn("order-2 lg:order-1", isArabic && "text-right")}>
              <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-4 block">
                {isArabic ? "علامة الأسبوع" : "Brand of the Week"}
              </span>
              <h2 className={cn(
                "font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-asper-ink mb-3 leading-tight",
                isArabic && "font-arabic"
              )}>
                Vichy
              </h2>

              <p className="font-body text-lg text-polished-gold/80 mb-6 italic">
                {isArabic ? "— قوة المياه البركانية" : "— The Power of Volcanic Water"}
              </p>

              <p className={cn(
                "font-body text-base text-muted-foreground leading-relaxed mb-8 max-w-lg",
                isArabic && "font-arabic mr-0 ml-auto"
              )}>
                {isArabic
                  ? "منذ 1931، تجمع Vichy بين خبرة أطباء الجلد وقوة المياه البركانية الفرنسية لتقديم حلول عناية بالبشرة فعالة وآمنة. كل منتج يمر باختبارات سريرية صارمة لضمان نتائج ملموسة."
                  : "Since 1931, Vichy has combined dermatological expertise with the power of French volcanic water to deliver effective, safe skincare solutions. Every product undergoes rigorous clinical testing to ensure visible results."}
              </p>

              {/* Key pillars */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { en: "Dermatologist\nTested", ar: "معتمد من\nأطباء الجلد" },
                  { en: "Volcanic\nWater", ar: "مياه\nبركانية" },
                  { en: "Sensitive\nSkin Safe", ar: "آمن للبشرة\nالحساسة" },
                ].map((pillar) => (
                  <div key={pillar.en} className="text-center p-3 border border-polished-gold/20 rounded-lg bg-polished-gold/5">
                    <span className="font-body text-xs uppercase tracking-wider text-asper-ink whitespace-pre-line leading-tight">
                      {isArabic ? pillar.ar : pillar.en}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/brands/vichy">
                <Button size="lg" className="group bg-burgundy text-primary-foreground hover:bg-burgundy-light border border-transparent hover:border-polished-gold text-sm uppercase tracking-widest px-8 h-12 font-semibold transition-all duration-400">
                  {isArabic ? "اكتشفي المجموعة" : "Explore Collection"}
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                    dir === "rtl" ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
                  )} />
                </Button>
              </Link>
            </div>

            {/* Brand Image Slideshow */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-[4/5] bg-white p-8">
                {BRAND_SLIDES.map((slide, index) => (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={`Vichy brand showcase ${index + 1}`}
                    className={cn(
                      "absolute inset-0 h-full w-full object-contain p-12 transition-opacity duration-700",
                      index === activeSlide ? "opacity-100" : "opacity-0"
                    )}
                    loading="lazy"
                  />
                ))}

                {/* Slide controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <button aria-label="Previous slide" onClick={prevSlide} className="w-8 h-8 rounded-full bg-asper-ink/40 backdrop-blur-sm border border-polished-white/20 flex items-center justify-center text-polished-white hover:text-polished-gold transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2">
                    {BRAND_SLIDES.map((_, index) => (
                      <button
                        key={index}
                        aria-label={`Go to slide ${index + 1}`}
                        onClick={() => setActiveSlide(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          index === activeSlide ? "bg-polished-gold w-6" : "bg-polished-white/50 hover:bg-polished-white/80"
                        )}
                      />
                    ))}
                  </div>
                  <button aria-label="Next slide" onClick={nextSlide} className="w-8 h-8 rounded-full bg-asper-ink/40 backdrop-blur-sm border border-polished-white/20 flex items-center justify-center text-polished-white hover:text-polished-gold transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
