import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type Locale = "en" | "ar";

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  toggle: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Locale, string>> = {
  "nav.shop": { en: "Shop", ar: "تسوق" },
  "nav.intelligence": { en: "Intelligence", ar: "الذكاء" },
  "nav.concierge": { en: "AI Concierge", ar: "المساعد الذكي" },
  "nav.about": { en: "About", ar: "عن أسبر" },
  "nav.shop_now": { en: "Shop Now", ar: "تسوق الآن" },
  "hero.badge": { en: "NATURE MEETS SCIENCE", ar: "الطبيعة تلتقي بالعلم" },
  "hero.title_1": { en: "Nature", ar: "الطبيعة" },
  "hero.title_2": { en: "Meets Science.", ar: "تلتقي بالعلم." },
  "hero.subtitle": {
    en: "Curated luxury skincare & beauty from the world's most prestigious brands — pharmacist verified. Where botanical purity meets clinical precision.",
    ar: "منتجات فاخرة للعناية بالبشرة والجمال من أرقى العلامات التجارية العالمية — مُعتمدة صيدلانياً. حيث تلتقي النقاء النباتي بالدقة السريرية.",
  },
  "hero.cta_primary": { en: "Find My Ritual", ar: "اكتشف روتيني" },
  "hero.cta_secondary": { en: "Shop All Brands", ar: "تصفح العلامات" },
  "hero.authentic": { en: "100% Authentic", ar: "أصلي 100%" },
  "hero.temperature": { en: "Temperature Controlled", ar: "تخزين مُبرّد" },
  "hero.pharmacist_led": { en: "Pharmacist Led", ar: "بإشراف صيدلاني" },
  "hero.sanctuary": { en: "Nature Meets Science", ar: "الطبيعة تلتقي بالعلم" },
  "footer.tagline": {
    en: '"We do not just sell cosmetics; we dispense beauty through intelligence."',
    ar: '"لا نبيع مستحضرات تجميل فحسب؛ بل نقدم الجمال من خلال الذكاء."',
  },
  "footer.copyright": { en: "Asper Beauty Shop. The Sanctuary of Science.", ar: "أسبر بيوتي شوب. حرم العلم." },
  "lang.switch": { en: "العربية", ar: "English" },
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    return (localStorage.getItem("asper-locale") as Locale) || "en";
  });

  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    localStorage.setItem("asper-locale", locale);
  }, [locale, dir]);

  const toggle = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key: string) => translations[key]?.[locale] ?? key,
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, dir, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}