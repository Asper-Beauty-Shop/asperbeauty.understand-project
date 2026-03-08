import { Link } from "react-router-dom";

const DERMO_BRANDS = [
  { name: "Eucerin", slug: "Eucerin", logo: "/brands/eucerin.png" },
  { name: "La Roche-Posay", slug: "La Roche-Posay", logo: "/brands/laroche-posay.png" },
  { name: "CeraVe", slug: "CeraVe", logo: "/brands/cerave.png" },
  { name: "Bioderma", slug: "Bioderma", logo: "/brands/bioderma.png" },
  { name: "Vichy", slug: "Vichy", logo: "/brands/vichy.png" },
  { name: "Sesderma", slug: "Sesderma", logo: "/brands/sesderma.png" },
  { name: "COSRX", slug: "COSRX", logo: "/brands/cosrx.png" },
  { name: "Kérastase", slug: "Kerastase", logo: "/brands/kerastase.png" },
  { name: "Guerlain", slug: "Guerlain", logo: "/brands/guerlain.png" },
  { name: "Nuxe", slug: "Nuxe", logo: "/brands/nuxe.png" },
];

function LogoGroup() {
  return (
    <div className="flex items-center gap-16 md:gap-20 pr-16 md:pr-20">
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
                       will-change-transform transition-all duration-300 ease-luxury"
            loading="lazy"
          />
        </Link>
      ))}
    </div>
  );
}

export function DermoBrands() {
  return (
    <section
      dir="ltr"
      className="relative py-10 md:py-14 bg-background overflow-hidden
                 border-b border-foreground/5"
    >
      {/* Subtle header */}
      <div className="text-center mb-8">
        <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-accent">
          Authorized Retailer
        </p>
      </div>

      {/* Infinite marquee track — two identical groups for seamless loop */}
      <div
        className="flex w-max animate-[marquee-float_35s_linear_infinite] hover:[animation-play-state:paused]"
      >
        <LogoGroup />
        <LogoGroup />
      </div>
    </section>
  );
}
