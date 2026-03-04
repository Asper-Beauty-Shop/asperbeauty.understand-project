				import { Gift, Truck, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/AnimatedSection";

interface USPItem {
  icon: React.ElementType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

const uspItems: USPItem[] = [
  {
    icon: Gift,
    title: "2 Free Samples",
    titleAr: "عينتان مجانيتان",
    description: "With every order",
    descriptionAr: "مع كل طلب",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    titleAr: "توصيل سريع",
    description: "3-6 business days",
    descriptionAr: "٣-٦ أيام عمل",
  },
  {
    icon: Sparkles,
    title: "Free Beauty Deals",
    titleAr: "عروض جمال مجانية",
    description: "Exclusive member offers",
    descriptionAr: "عروض حصرية للأعضاء",
  },
];

interface USPBarProps {
  className?: string;
}

export const USPBar = ({ className }: USPBarProps) => {
import { Gift, Truck, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const USP_ITEMS = [
  {
    icon: Gift,
    en: "2 Free Samples",
    enSub: "With every order",
    ar: "عيّنتان مجانيتان",
    arSub: "مع كل طلب",
  },
  {
    icon: Truck,
    en: "Fast Delivery",
    enSub: "3-6 business days",
    ar: "توصيل سريع",
    arSub: "٣-٦ أيام عمل",
  },
  {
    icon: Tag,
    en: "Free Beauty Deals",
    enSub: "Exclusive offers weekly",
    ar: "عروض جمال مجانية",
    arSub: "عروض حصرية أسبوعياً",
  },
];

export const USPBar = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className={cn("py-8 md:py-10 bg-gradient-to-r from-polished-gold via-polished-gold-light to-polished-gold relative overflow-hidden", className)}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-burgundy rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-burgundy rounded-full blur-3xl" />
      </div>

      <div className="luxury-container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-16">
          {uspItems.map((item, index) => (
            <AnimatedSection
              key={item.title}
              animation={index === 0 ? "fade-right" : index === 2 ? "fade-left" : "fade-up"}
              delay={index * 100}
            >
              <div
                className={cn(
                  "flex items-center gap-4",
                  isArabic && "flex-row-reverse"
                )}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-burgundy/20 border-2 border-burgundy flex items-center justify-center shadow-lg">
                    <item.icon className="w-7 h-7 md:w-8 md:h-8 text-burgundy" strokeWidth={2} />
                  </div>
                </div>

                {/* Text */}
                <div className={cn(isArabic ? "text-right" : "text-left")}>
                  <h3 className="font-display text-base md:text-lg text-burgundy font-bold">
                    {isArabic ? item.titleAr : item.title}
                  </h3>
                  <p className="font-body text-xs md:text-sm text-burgundy/80">
                    {isArabic ? item.descriptionAr : item.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
    <section className="py-6 bg-burgundy relative">
      <div className="luxury-container">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 lg:gap-20">
          {USP_ITEMS.map((item, index) => (
            <div key={item.en} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-polished-gold/15 border border-polished-gold/30 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-polished-gold" />
              </div>
              <div className={isArabic ? "text-right" : "text-left"}>
                <p className="font-display text-sm text-polished-white font-medium leading-tight">
                  {isArabic ? item.ar : item.en}
                </p>
                <p className="font-body text-[11px] text-asper-stone-light/60">
                  {isArabic ? item.arSub : item.enSub}
                </p>
              </div>
              {/* Separator */}
              {index < USP_ITEMS.length - 1 && (
                <div className="hidden sm:block w-px h-8 bg-polished-gold/20 ml-6 sm:ml-8 lg:ml-12" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
