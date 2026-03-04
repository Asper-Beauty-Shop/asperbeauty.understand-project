import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/AnimatedSection";

interface EditorialSpotlightProps {
  badge?: string;
  badgeAr?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl: string;
  ctaText: string;
  ctaTextAr?: string;
  ctaLink: string;
  imagePosition?: "left" | "right";
  className?: string;
}

export const EditorialSpotlight = ({
  badge,
  badgeAr,
  title,
  titleAr,
  description,
  descriptionAr,
  imageUrl,
  ctaText,
  ctaTextAr,
  ctaLink,
  imagePosition = "left",
  className,
}: EditorialSpotlightProps) => {
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

export const EditorialSpotlight = () => {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className={cn("py-16 md:py-24 bg-gradient-to-b from-asper-stone to-asper-stone-light", className)}>
      <div className="luxury-container">
        <AnimatedSection animation="fade-up">
          <div
            className={cn(
              "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center",
              imagePosition === "right" && "lg:grid-flow-dense"
            )}
          >
            {/* Image Section */}
            <div
              className={cn(
                "relative group overflow-hidden rounded-2xl",
                imagePosition === "right" && "lg:col-start-2"
              )}
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={imageUrl}
                  alt={isArabic ? titleAr || title : title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {/* Gold border accent */}
              <div className="absolute inset-0 border-2 border-polished-gold/0 group-hover:border-polished-gold/40 rounded-2xl transition-all duration-500" />
            </div>

            {/* Content Section */}
            <div className={cn("space-y-6", imagePosition === "right" && "lg:col-start-1")}>
              {/* Badge */}
              {badge && (
                <div className="inline-block">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-burgundy/10 border border-burgundy/30 text-burgundy font-medium text-sm uppercase tracking-wider">
                    {isArabic ? badgeAr || badge : badge}
                  </span>
                </div>
              )}

              {/* Title */}
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-asper-ink font-bold leading-tight">
                {isArabic ? titleAr || title : title}
              </h2>

              {/* Decorative line */}
              <div className="w-16 h-px bg-gradient-to-r from-polished-gold to-transparent" />

              {/* Description */}
              <p className="font-body text-base md:text-lg text-asper-ink-muted leading-relaxed max-w-xl">
                {isArabic ? descriptionAr || description : description}
              </p>

              {/* CTA Button */}
              <Link to={ctaLink}>
                <Button
                  size="lg"
                  className={cn(
                    "group mt-4 bg-burgundy text-asper-stone-light hover:bg-burgundy-light",
                    "border border-transparent hover:border-polished-gold",
                    "hover:shadow-lg hover:shadow-polished-gold/20",
                    "text-sm uppercase tracking-widest px-8 h-12 font-semibold",
                    "transition-all duration-400"
                  )}
                >
                  {isArabic ? ctaTextAr || ctaText : ctaText}
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                      dir === "rtl" ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
    <section className="py-16 lg:py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        {/* WANTED! Hero Product Spotlight */}
        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Lifestyle Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80&auto=format&fit=crop"
                alt="Hydration trio skincare products in luxury setting"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Floating label */}
              <div className="absolute top-6 left-6">
                <span className="bg-burgundy text-polished-white text-xs uppercase tracking-[0.2em] font-body font-semibold px-4 py-2 rounded-full">
                  {isArabic ? "مطلوب!" : "WANTED!"}
                </span>
              </div>
            </div>

            {/* Descriptive Content */}
            <div className={cn(isArabic && "text-right")}>
              <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-4 block">
                {isArabic ? "منتجات مميزة" : "Hero Products"}
              </span>
              <h2
                className={cn(
                  "font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-asper-ink mb-6 leading-tight",
                  isArabic && "font-arabic"
                )}
              >
                {isArabic
                  ? "ثلاثي الترطيب المثالي"
                  : "The Ultimate Hydration Trio"}
              </h2>

              <p
                className={cn(
                  "font-body text-base text-muted-foreground leading-relaxed mb-8 max-w-lg",
                  isArabic && "font-arabic mr-0 ml-auto"
                )}
              >
                {isArabic
                  ? "تركيبة علمية مدروسة تمنح بشرتك ترطيباً عميقاً يدوم 72 ساعة. من التنظيف إلى الحماية — كل خطوة مصممة لإشراقة طبيعية."
                  : "A clinically formulated trio delivering 72-hour deep hydration. From cleansing to protection — every step is designed for a natural, healthy glow."}
              </p>

              {/* Product mini-list */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    step: isArabic ? "الخطوة ١" : "Step 1",
                    name: isArabic ? "جل منظف مرطب" : "Hydrating Cleansing Gel",
                  },
                  {
                    step: isArabic ? "الخطوة ٢" : "Step 2",
                    name: isArabic
                      ? "سيروم الهيالورونيك"
                      : "Hyaluronic Acid Serum",
                  },
                  {
                    step: isArabic ? "الخطوة ٣" : "Step 3",
                    name: isArabic
                      ? "كريم ترطيب عميق"
                      : "Rich Moisture Barrier Cream",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-center gap-4 border-b border-border pb-3"
                  >
                    <span className="text-xs uppercase tracking-wider text-polished-gold font-body font-semibold w-16 flex-shrink-0">
                      {item.step}
                    </span>
                    <span className="font-body text-sm text-asper-ink">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/skin-concerns">
                <Button
                  size="lg"
                  className="group bg-burgundy text-primary-foreground hover:bg-burgundy-light border border-transparent hover:border-polished-gold text-sm uppercase tracking-widest px-8 h-12 font-semibold transition-all duration-400"
                >
                  {isArabic ? "اكتشفي الآن" : "Discover Now"}
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
          </div>
        </AnimatedSection>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
};
