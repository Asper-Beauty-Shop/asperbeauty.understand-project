import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DERMO_BRANDS = [
  { name: "Eucerin", slug: "Eucerin", color: "from-[hsl(210,60%,45%)] to-[hsl(210,50%,55%)]" },
  { name: "La Roche-Posay", slug: "La Roche-Posay", color: "from-[hsl(200,40%,40%)] to-[hsl(200,35%,55%)]" },
  { name: "CeraVe", slug: "CeraVe", color: "from-[hsl(195,55%,42%)] to-[hsl(195,45%,58%)]" },
  { name: "Bioderma", slug: "Bioderma", color: "from-[hsl(340,50%,45%)] to-[hsl(340,40%,60%)]" },
  { name: "Vichy", slug: "Vichy", color: "from-[hsl(160,40%,38%)] to-[hsl(160,35%,52%)]" },
  { name: "Sesderma", slug: "Sesderma", color: "from-[hsl(30,55%,45%)] to-[hsl(30,45%,58%)]" },
  { name: "COSRX", slug: "COSRX", color: "from-[hsl(0,0%,25%)] to-[hsl(0,0%,40%)]" },
];

export function DermoBrands() {
  return (
    <section className="py-6 bg-asper-stone border-b border-polished-gold/10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
          {DERMO_BRANDS.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Link
                to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                className="group flex items-center gap-2.5 py-2 px-1 transition-all duration-300"
              >
                {/* Color dot representing brand */}
                <span
                  className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${brand.color} group-hover:scale-125 transition-transform duration-300 flex-shrink-0`}
                />
                {/* Brand name — clear typography */}
                <span className="font-body text-xs sm:text-sm uppercase tracking-[0.15em] text-asper-ink/70 group-hover:text-burgundy font-semibold transition-colors duration-300 whitespace-nowrap">
                  {brand.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
