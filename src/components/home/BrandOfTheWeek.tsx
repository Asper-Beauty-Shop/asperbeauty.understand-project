import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
<<<<<<< copilot/add-hero-section-storefront
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/AnimatedSection";

interface BrandOfTheWeekProps {
  brandName: string;
  brandNameAr?: string;
  tagline: string;
  taglineAr?: string;
  description: string;
  descriptionAr?: string;
  images: string[];
  ctaText?: string;
  ctaTextAr?: string;
  ctaLink?: string;
  className?: string;
}

export const BrandOfTheWeek = ({
  brandName,
  brandNameAr,
  tagline,
  taglineAr,
  description,
  descriptionAr,
  images,
  ctaText = "Explore Collection",
  ctaTextAr = "استكشف المجموعة",
  ctaLink = "/brands",
  className,
}: BrandOfTheWeekProps) => {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className={cn("py-16 md:py-24 bg-burgundy relative overflow-hidden", className)}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-polished-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-polished-gold rounded-full blur-3xl" />
      </div>

      <div className="luxury-container relative z-10">
        <AnimatedSection animation="fade-up">
          {/* Badge */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center px-5 py-2 rounded-full bg-polished-gold/20 border border-polished-gold text-polished-gold font-medium text-xs md:text-sm uppercase tracking-[0.3em]">
              {isArabic ? "علامة الأسبوع" : "Brand of the Week"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <div className="text-asper-stone-light space-y-6">
              <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold">
                {isArabic ? brandNameAr || brandName : brandName}
              </h2>

              {/* Decorative line */}
              <div className="w-20 h-px bg-gradient-to-r from-polished-gold to-transparent" />

              <p className="font-script text-2xl md:text-3xl text-polished-gold italic">
                {isArabic ? taglineAr || tagline : tagline}
              </p>

              <p className="font-body text-base md:text-lg text-asper-stone-light/80 leading-relaxed max-w-xl">
                {isArabic ? descriptionAr || description : description}
              </p>

              {/* CTA */}
              {ctaLink && (
                <Link to={ctaLink}>
                  <Button
                    size="lg"
                    className="mt-6 bg-polished-gold text-burgundy hover:bg-polished-gold-light border-2 border-polished-gold hover:border-polished-gold-light hover:shadow-2xl text-sm uppercase tracking-widest px-8 h-12 font-semibold transition-all duration-400"
                  >
                    {isArabic ? ctaTextAr : ctaText}
                  </Button>
                </Link>
              )}
            </div>

            {/* Image Slider Section */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`${brandName} ${currentImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                />
                {/* Gold border overlay */}
                <div className="absolute inset-0 border-4 border-polished-gold/30 rounded-2xl" />

                {/* Navigation Arrows (only show if multiple images) */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevSlide}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full",
                        "bg-asper-stone-light/80 backdrop-blur-sm hover:bg-asper-stone-light",
                        "transition-all duration-300",
                        dir === "rtl" ? "right-4" : "left-4"
                      )}
                      aria-label="Previous image"
                    >
                      {dir === "rtl" ? (
                        <ChevronRight className="h-5 w-5 text-burgundy" />
                      ) : (
                        <ChevronLeft className="h-5 w-5 text-burgundy" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextSlide}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full",
                        "bg-asper-stone-light/80 backdrop-blur-sm hover:bg-asper-stone-light",
                        "transition-all duration-300",
                        dir === "rtl" ? "left-4" : "right-4"
                      )}
                      aria-label="Next image"
                    >
                      {dir === "rtl" ? (
                        <ChevronLeft className="h-5 w-5 text-burgundy" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-burgundy" />
                      )}
                    </Button>
                  </>
                )}
              </div>

              {/* Dot indicators (only show if multiple images) */}
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        currentImageIndex === index
                          ? "w-8 bg-polished-gold"
                          : "bg-polished-gold/30 hover:bg-polished-gold/50"
                      )}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
=======
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

const BRAND_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80&auto=format&fit=crop",
  },
];

export const BrandOfTheWeek = () => {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () =>
    setActiveSlide((prev) => (prev + 1) % BRAND_SLIDES.length);
  const prevSlide = () =>
    setActiveSlide(
      (prev) => (prev - 1 + BRAND_SLIDES.length) % BRAND_SLIDES.length
    );

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
              <h2
                className={cn(
                  "font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-asper-ink mb-3 leading-tight",
                  isArabic && "font-arabic"
                )}
              >
                Vichy
              </h2>

              <p className="font-body text-lg text-polished-gold/80 mb-6 italic">
                {isArabic
                  ? "— قوة المياه البركانية"
                  : "— The Power of Volcanic Water"}
              </p>

              <p
                className={cn(
                  "font-body text-base text-muted-foreground leading-relaxed mb-8 max-w-lg",
                  isArabic && "font-arabic"
                )}
              >
                {isArabic
                  ? "منذ 1931، تجمع Vichy بين خبرة أطباء الجلد وقوة المياه البركانية الفرنسية لتقديم حلول عناية بالبشرة فعّالة وآمنة. كل منتج يمر باختبارات سريرية صارمة لضمان نتائج ملموسة."
                  : "Since 1931, Vichy has combined dermatological expertise with the power of French volcanic water to deliver effective, safe skincare solutions. Every product undergoes rigorous clinical testing to ensure visible results."}
              </p>

              {/* Key pillars */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  {
                    en: "Dermatologist\nTested",
                    ar: "معتمد من\nأطباء الجلد",
                  },
                  { en: "Volcanic\nWater", ar: "مياه\nبركانية" },
                  { en: "Sensitive\nSkin Safe", ar: "آمن للبشرة\nالحساسة" },
                ].map((pillar) => (
                  <div
                    key={pillar.en}
                    className="text-center p-3 border border-polished-gold/20 rounded-lg bg-polished-gold/5"
                  >
                    <span className="font-body text-xs uppercase tracking-wider text-asper-ink whitespace-pre-line leading-tight">
                      {isArabic ? pillar.ar : pillar.en}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/brands/vichy">
                <Button
                  size="lg"
                  className="group bg-burgundy text-primary-foreground hover:bg-burgundy-light border border-transparent hover:border-polished-gold text-sm uppercase tracking-widest px-8 h-12 font-semibold transition-all duration-400"
                >
                  {isArabic ? "اكتشفي المجموعة" : "Explore Collection"}
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                      dir === "rtl"
                        ? "mr-2 rotate-180 group-hover:-translate-x-1"
                        : "ml-2"
                    )}
                  />
                </Button>
              </Link>
            </div>

            {/* Brand Image Slideshow */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-[4/5]">
                {BRAND_SLIDES.map((slide, index) => (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={`Vichy brand showcase ${index + 1}`}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                      index === activeSlide ? "opacity-100" : "opacity-0"
                    )}
                    loading="lazy"
                  />
                ))}

                {/* Slide controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <button
                    onClick={prevSlide}
                    className="w-8 h-8 rounded-full bg-asper-ink/40 backdrop-blur-sm border border-polished-white/20 flex items-center justify-center text-polished-white hover:text-polished-gold transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2">
                    {BRAND_SLIDES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          index === activeSlide
                            ? "bg-polished-gold w-6"
                            : "bg-polished-white/50 hover:bg-polished-white/80"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="w-8 h-8 rounded-full bg-asper-ink/40 backdrop-blur-sm border border-polished-white/20 flex items-center justify-center text-polished-white hover:text-polished-gold transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
>>>>>>> main
            </div>
          </div>
        </AnimatedSection>
      </div>
<<<<<<< copilot/add-hero-section-storefront
=======

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
>>>>>>> main
    </section>
  );
};
