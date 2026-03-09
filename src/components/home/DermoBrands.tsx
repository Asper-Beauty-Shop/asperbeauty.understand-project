import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const DERMO_BRANDS = [
  { name: "Eucerin", slug: "Eucerin", logo: "/brands/eucerin.svg" },
  { name: "La Roche-Posay", slug: "La Roche-Posay", logo: "/brands/laroche-posay.svg" },
  { name: "CeraVe", slug: "CeraVe", logo: "/brands/cerave.svg" },
  { name: "Bioderma", slug: "Bioderma", logo: "/brands/bioderma.svg" },
  { name: "Vichy", slug: "Vichy", logo: "/brands/vichy.svg" },
  { name: "Sesderma", slug: "Sesderma", logo: "/brands/sesderma.svg" },
  { name: "COSRX", slug: "COSRX", logo: "/brands/cosrx.svg" },
  { name: "KÃ©rastase", slug: "Kerastase", logo: "/brands/kerastase.svg" },
  { name: "Guerlain", slug: "Guerlain", logo: "/brands/guerlain.svg" },
  { name: "Nuxe", slug: "Nuxe", logo: "/brands/nuxe.svg" },
];

function LogoGroup() {
  return (
    <div className="flex items-center gap-16 md:gap-20 px-8 md:px-10">
      {DERMO_BRANDS.map((brand) => (
        <Link
          key={brand.slug}
          to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
          className="group flex-shrink-0"
          aria-label={brand.name}
        >
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            className="h-10 md:h-12 w-auto object-contain opacity-[0.65] grayscale-0
                       group-hover:opacity-100 group-hover:-translate-y-1 group-hover:scale-105
                       group-hover:drop-shadow-[0_8px_16px_hsl(var(--polished-gold)/0.15)]
                       will-change-transform transition-all duration-[400ms] ease-luxury"
            loading="lazy"
          />
        </Link>
      ))}
    </div>
  );
}

export function DermoBrands() {
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section
      className="relative py-10 md:py-14 bg-background overflow-hidden
                 border-b border-foreground/5 transition-all duration-[400ms]"
    >
      {/* Header â€” font switches with locale */}
      <div className="text-center mb-8">
        <p
          className={cn(
            "text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-accent transition-all duration-[400ms]",
            isAr ? "font-arabic" : "font-body"
          )}
        >
          {isAr ? "Ù…ÙˆØ²Ù‘Ø¹ Ù…Ø¹ØªÙ…Ø¯" : "Authorized Retailer"}
        </p>
      </div>

      {/* Infinite marquee â€” direction-aware animation */}
      <div
        className="flex w-max hover:[animation-play-state:paused]"
        style={{
          animation: `${isAr ? "marquee-rtl" : "marquee-ltr"} 35s linear infinite`,
        }}
      >
        <LogoGroup />
        <LogoGroup />
      </div>
    </section>
  );
}
