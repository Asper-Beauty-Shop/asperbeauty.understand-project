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
