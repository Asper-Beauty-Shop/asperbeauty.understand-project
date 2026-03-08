import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

export function DermoBrands() {
  return (
    <section className="py-8 bg-card border-y border-polished-gold/10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section micro-label */}
        <p className="text-center font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Pharmacist-Curated Brands
        </p>

        {/* Logo grid */}
        <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-10 flex-wrap">
          {DERMO_BRANDS.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
            >
              <Link
                to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                className="group relative flex items-center justify-center p-3 transition-all duration-400 gold-stitch-hover"
                aria-label={brand.name}
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-8 md:h-9 w-auto object-contain opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom gold accent */}
        <div className="mt-6 gold-accent-line max-w-xs mx-auto" />
      </div>
    </section>
  );
}
