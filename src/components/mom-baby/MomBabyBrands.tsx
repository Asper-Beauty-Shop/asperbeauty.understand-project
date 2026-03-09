import { useLanguage } from "@/contexts/LanguageContext";

const brands = [
  "Mustela", "Medela", "Bioderma", "Uriage", "Isdin", "A-Derma",
  "Nuk", "Tommee Tippee", "SuavinÃ©x", "Klorane", "Barral",
  "La Roche-Posay", "MomCozy", "BabÃ©", "AvÃ¨ne", "Eucerin",
];

export default function MomBabyBrands() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="py-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="font-heading text-lg text-foreground mb-6">
          {isAr ? "Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ© Ø§Ù„Ù…ÙˆØ«ÙˆÙ‚Ø©" : "Trusted Brands"}
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="rounded-full border border-border bg-card px-4 py-2 text-xs font-body text-muted-foreground hover:border-accent/50 hover:text-foreground transition-all cursor-pointer"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

