import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BiodermaLogo = () => (
  <svg viewBox="0 0 140 32" className="h-7 w-auto" aria-label="Bioderma">
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="700" fontSize="18" letterSpacing="3" fill="currentColor">BIODERMA</text>
  </svg>
);

const KerastaseLogo = () => (
  <svg viewBox="0 0 140 36" className="h-8 w-auto" aria-label="Kérastase">
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="700" fontSize="17" letterSpacing="2" fill="currentColor">KÉRASTASE</text>
  </svg>
);

const YSLLogo = () => (
  <svg viewBox="0 0 60 50" className="h-10 w-auto" aria-label="Yves Saint Laurent">
    <text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="800" fontSize="28" letterSpacing="1" fill="currentColor">YSL</text>
    <text x="50%" y="78%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="400" fontSize="5.5" letterSpacing="2.5" fill="currentColor">BEAUTY</text>
  </svg>
);

const MaybellineLogo = () => (
  <svg viewBox="0 0 150 36" className="h-7 w-auto" aria-label="Maybelline">
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="800" fontSize="16" letterSpacing="2" fill="currentColor" textDecoration="none">MAYBELLINE</text>
    <line x1="10" y1="30" x2="140" y2="30" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const GarnierLogo = () => (
  <svg viewBox="0 0 120 40" className="h-8 w-auto" aria-label="Garnier">
    <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="700" fontSize="18" letterSpacing="3" fill="currentColor">Garnier</text>
    <circle cx="60" cy="35" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
  </svg>
);

const BeeslineLogo = () => (
  <svg viewBox="0 0 130 40" className="h-8 w-auto" aria-label="Beesline">
    <text x="50%" y="40%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="600" fontSize="19" letterSpacing="1" fill="currentColor">Beesline</text>
    <text x="50%" y="78%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="400" fontSize="6" letterSpacing="3" fill="currentColor">NATURAL BEAUTY</text>
  </svg>
);

const BioBalanceLogo = () => (
  <svg viewBox="0 0 140 40" className="h-8 w-auto" aria-label="Bio Balance">
    <text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="300" fontSize="12" letterSpacing="4" fill="currentColor">BIO</text>
    <text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="700" fontSize="14" letterSpacing="2" fill="currentColor">BALANCE</text>
  </svg>
);

const SeventeenLogo = () => (
  <svg viewBox="0 0 140 36" className="h-7 w-auto" aria-label="Seventeen">
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="600" fontSize="15" letterSpacing="4" fill="currentColor">SEVENTEEN</text>
  </svg>
);

const PetalFreshLogo = () => (
  <svg viewBox="0 0 140 40" className="h-8 w-auto" aria-label="Petal Fresh">
    <text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="700" fontSize="16" letterSpacing="1" fontStyle="italic" fill="currentColor">Petal Fresh</text>
    <text x="50%" y="76%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="400" fontSize="5.5" letterSpacing="3" fill="currentColor">PURE</text>
  </svg>
);

const AsperLogo = () => (
  <svg viewBox="0 0 120 50" className="h-10 w-auto" aria-label="Asper Beauty">
    <text x="50%" y="40%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="800" fontSize="20" letterSpacing="2" fill="currentColor">ASPER</text>
    <text x="50%" y="76%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="400" fontSize="7" letterSpacing="3" fill="currentColor">Beauty Shop</text>
  </svg>
);

const brands = [
  { name: "Bioderma", slug: "bioderma", Logo: BiodermaLogo },
  { name: "Kérastase", slug: "kerastase", Logo: KerastaseLogo },
  { name: "Yves Saint Laurent", slug: "yves-saint-laurent", Logo: YSLLogo },
  { name: "Maybelline", slug: "maybelline", Logo: MaybellineLogo },
  { name: "Garnier", slug: "garnier", Logo: GarnierLogo },
  { name: "Beesline", slug: "beesline", Logo: BeeslineLogo },
  { name: "Bio Balance", slug: "bio-balance", Logo: BioBalanceLogo },
  { name: "Seventeen", slug: "seventeen", Logo: SeventeenLogo },
  { name: "Petal Fresh", slug: "petal-fresh", Logo: PetalFreshLogo },
  { name: "Asper Beauty", slug: "asper-beauty", Logo: AsperLogo },
];

export default function BrandDiscoveryGrid() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 font-body text-xs tracking-wider">
            {isAr ? "العلامات المميزة" : "TRUSTED BY THOUSANDS"}
          </Badge>
          <h2 className={cn(
            "font-heading text-3xl sm:text-4xl font-bold text-primary",
            isAr && "font-arabic"
          )}>
            {isAr ? "أكثر العلامات شراءً" : "Most Popular Brands"}
          </h2>
          <p className={cn(
            "mt-3 text-muted-foreground text-base max-w-xl mx-auto",
            isAr ? "font-arabic" : "font-body"
          )}>
            {isAr
              ? "أكثر من 5,000 منتج من أرقى العلامات العالمية — جميعها أصلية ومعتمدة."
              : "Over 5,000 SKUs from the world's most prestigious brands — all verified authentic."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {brands.map((brand) => (
            <a
              key={brand.slug}
              href={`/products?vendor=${encodeURIComponent(brand.name)}`}
              className="group flex items-center justify-center h-24 sm:h-28 rounded-xl bg-card border border-transparent hover:border-accent/60 shadow-sm hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer px-4 text-foreground/50 hover:text-primary"
            >
              <brand.Logo />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

