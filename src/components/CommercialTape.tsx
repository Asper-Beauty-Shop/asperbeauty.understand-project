import { useLanguage } from "@/contexts/LanguageContext";

const advantages = [
  { en: "Curated by Pharmacists: 5,000+ Premium SKUs", ar: "بإشراف صيدلاني: أكثر من 5,000 منتج طبي فاخر" },
  { en: "The Asper Experience: Same-Day Amman Concierge Delivery", ar: "تجربة أسبر: توصيل في نفس اليوم داخل عمّان" },
  { en: "Gold Standard: 100% Guaranteed Authenticity & JFDA Certified", ar: "المعيار الذهبي: أصالة مضمونة 100% ومعتمد من الغذاء والدواء" },
  { en: "Cruelty-Free, Ethical & Dermatologist Tested", ar: "خالٍ من القسوة، أخلاقي ومختبر من أطباء جلدية" },
  { en: "Powered by Intelligence: Discover the 3-Click AI Regimen", ar: "مدعوم بالذكاء الاصطناعي: اكتشفي روتينك بـ3 نقرات" },
];

const CommercialTape = () => {
  const { language } = useLanguage();
  const locale = language;

  const items = [...advantages, ...advantages];

  return (
    <div
      className="commercial-tape relative w-full overflow-hidden bg-primary h-10 flex items-center z-[60]"
      role="marquee"
      aria-label={locale === "ar" ? "مزايا أسبر بيوتي شوب" : "Asper Beauty Shop advantages"}
    >
      <div className="commercial-tape-track flex items-center whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-body text-sm font-medium text-primary-foreground px-4 select-none">
              {locale === "ar" ? item.ar : item.en}
            </span>
            <span
              className="text-accent text-xs select-none"
              aria-hidden="true"
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommercialTape;
