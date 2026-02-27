import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <p className="font-serif text-lg mb-2">ASPER BEAUTY SHOP</p>
        <p className="text-sm opacity-70">{t("footer.tagline")}</p>
        <p className="text-xs opacity-50 mt-4">© {new Date().getFullYear()} {t("footer.copyright")}</p>
      </div>
    </footer>
  );
};
