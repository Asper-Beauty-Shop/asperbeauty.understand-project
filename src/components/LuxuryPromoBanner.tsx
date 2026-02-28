import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface LuxuryPromoBannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
  position?: "left" | "right";
  variant?: "primary" | "secondary";
}

export const LuxuryPromoBanner = ({
  title,
  subtitle,
  image,
  position = "left",
  variant = "primary",
}: LuxuryPromoBannerProps) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Default content based on variant
  const defaultContent = {
    primary: {
      title: isAr ? "مجموعة الشتاء الفاخرة" : "Winter Luxury Collection",
      subtitle: isAr
        ? "خصم 25% على جميع منتجات العناية بالبشرة المتميزة"
        : "25% Off All Premium Skincare Essentials",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    },
    secondary: {
      title: isAr ? "وصل حديثاً - مجموعة الربيع" : "New Arrivals — Spring Edit",
      subtitle: isAr
        ? "اكتشف أحدث المنتجات من أفضل العلامات التجارية"
        : "Discover the freshest picks from world-class brands",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    },
  };

  const content = defaultContent[variant];
  const displayTitle = title || content.title;
  const displaySubtitle = subtitle || content.subtitle;
  const displayImage = image || content.image;

  const isImageLeft = position === "left";

  return (
    <section className="relative grid min-h-[500px] overflow-hidden bg-muted md:grid-cols-2 md:min-h-[600px]">
      {/* Content Side */}
      <div
        className={`flex flex-col items-center justify-center px-8 py-16 text-center md:items-start md:px-16 md:py-24 md:text-left ${
          isImageLeft ? "md:order-2" : "md:order-1"
        }`}
      >
        {/* Eyebrow */}
        <span className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.3em] text-primary">
          {isAr ? "عرض لفترة محدودة" : "Limited Time Only"}
        </span>

        {/* Main Title */}
        <h2 className="font-serif text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {displayTitle}
        </h2>

        {/* Subtitle */}
        <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          {displaySubtitle}
        </p>

        {/* CTA Button */}
        <Button
          asChild
          size="lg"
          className="group mt-8 bg-primary px-8 py-6 font-sans text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
        >
          <Link to="/offers">
            {isAr ? "اكتشف الآن" : "Discover Now"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {/* Image Side */}
      <div
        className={`relative min-h-[300px] overflow-hidden md:min-h-full ${
          isImageLeft ? "md:order-1" : "md:order-2"
        }`}
      >
        <img
          src={displayImage}
          alt={displayTitle}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent" />
      </div>
    </section>
  );
};

export default LuxuryPromoBanner;
