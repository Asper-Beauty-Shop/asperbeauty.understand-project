import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSwitcher = (
  { variant = "default" }: {
    variant?: "default" | "mobile" | "announcement" | "header";
  },
) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  if (variant === "announcement") {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-3 py-1 text-foreground font-body text-xs font-medium hover:bg-foreground/10 rounded transition-colors duration-400"
        aria-label="Toggle language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{language === "en" ? "AR" : "EN"}</span>
      </button>
    );
  }

  if (variant === "header") {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-3 py-1.5 text-gold font-body text-xs font-medium border border-gold/50 rounded-full hover:bg-gold/10 transition-colors duration-400"
        aria-label="Toggle language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{language === "en" ? "العربية" : "EN"}</span>
      </button>
    );
  }

  if (variant === "mobile") {
    return (
      <button
        onClick={toggleLanguage}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-burgundy font-display text-sm tracking-wider transition-colors duration-400 hover:bg-gold-light shadow-sm rounded-full"
        aria-label="Toggle language"
      >
        <Globe className="w-4 h-4" />
        <span>{language === "en" ? "العربية" : "English"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-gold text-burgundy font-display text-sm tracking-wider transition-all duration-400 hover:bg-gold-light shadow-md rounded-full"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">
        {language === "en" ? "العربية" : "EN"}
      </span>
      <span className="sm:hidden">{language === "en" ? "ع" : "EN"}</span>
    </button>
  );
};
