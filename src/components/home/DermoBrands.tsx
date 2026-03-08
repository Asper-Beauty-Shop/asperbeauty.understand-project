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
    <section className="py-14 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-accent mb-3">
            Authorized Retailer
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            Pharmacist-Curated Brands
          </h2>
          <div className="luxury-divider" />
        </div>

        {/* Logo grid — large cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {DERMO_BRANDS.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                className="group relative flex items-center justify-center h-28 md:h-32 bg-card border border-border hover:border-accent/50 transition-all duration-500 gold-stitch-hover shadow-sm hover:shadow-gold-md"
                aria-label={brand.name}
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-12 md:h-14 w-auto max-w-[80%] object-contain opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
