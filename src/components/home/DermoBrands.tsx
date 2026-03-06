import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EucerinLogo = () => (
  <svg viewBox="0 0 120 28" className="w-20 sm:w-24 h-auto" aria-label="Eucerin">
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="700" fontSize="16" letterSpacing="2" fill="white">EUCERIN</text>
  </svg>
);

const LaRochePosayLogo = () => (
  <svg viewBox="0 0 130 40" className="w-20 sm:w-24 h-auto" aria-label="La Roche-Posay">
    <text x="50%" y="35%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="700" fontSize="11" letterSpacing="1" fill="white">LA ROCHE</text>
    <text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight="700" fontSize="11" letterSpacing="1" fill="white">POSAY</text>
  </svg>
);

const CeraVeLogo = () => (
  <svg viewBox="0 0 120 28" className="w-20 sm:w-24 h-auto" aria-label="CeraVe">
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="800" fontSize="18" letterSpacing="1" fill="white">CeraVe</text>
  </svg>
);

const BiodermaLogo = () => (
  <svg viewBox="0 0 140 28" className="w-20 sm:w-24 h-auto" aria-label="Bioderma">
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="700" fontSize="15" letterSpacing="3" fill="white">BIODERMA</text>
  </svg>
);

const VichyLogo = () => (
  <svg viewBox="0 0 100 28" className="w-16 sm:w-20 h-auto" aria-label="Vichy">
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="800" fontSize="18" letterSpacing="4" fill="white">VICHY</text>
  </svg>
);

const SesdermaLogo = () => (
  <svg viewBox="0 0 140 28" className="w-20 sm:w-24 h-auto" aria-label="Sesderma">
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="600" fontSize="15" letterSpacing="3" fill="white">SESDERMA</text>
  </svg>
);

const CosrxLogo = () => (
  <svg viewBox="0 0 110 28" className="w-16 sm:w-20 h-auto" aria-label="COSRX">
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontWeight="900" fontSize="20" letterSpacing="3" fill="white">COSRX</text>
  </svg>
);

const DERMO_BRANDS = [
  { name: "Eucerin", slug: "Eucerin", color: "from-[hsl(210,60%,45%)] to-[hsl(210,50%,55%)]", Logo: EucerinLogo },
  { name: "La Roche-Posay", slug: "La Roche-Posay", color: "from-[hsl(200,40%,40%)] to-[hsl(200,35%,55%)]", Logo: LaRochePosayLogo },
  { name: "CeraVe", slug: "CeraVe", color: "from-[hsl(195,55%,42%)] to-[hsl(195,45%,58%)]", Logo: CeraVeLogo },
  { name: "Bioderma", slug: "Bioderma", color: "from-[hsl(340,50%,45%)] to-[hsl(340,40%,60%)]", Logo: BiodermaLogo },
  { name: "Vichy", slug: "Vichy", color: "from-[hsl(160,40%,38%)] to-[hsl(160,35%,52%)]", Logo: VichyLogo },
  { name: "Sesderma", slug: "Sesderma", color: "from-[hsl(30,55%,45%)] to-[hsl(30,45%,58%)]", Logo: SesdermaLogo },
  { name: "COSRX", slug: "COSRX", color: "from-[hsl(0,0%,25%)] to-[hsl(0,0%,40%)]", Logo: CosrxLogo },
];

export function DermoBrands() {
  return (
    <section className="py-10 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-lg font-heading font-semibold tracking-wide text-foreground mb-6">
          Dermocosmetic Brands
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {DERMO_BRANDS.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Link
                to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                className={`
                  block aspect-square rounded-xl bg-gradient-to-br ${brand.color}
                  flex items-center justify-center
                  shadow-md hover:shadow-lg hover:scale-105
                  transition-all duration-200 group
                `}
              >
                <div className="group-hover:scale-105 transition-transform duration-200 drop-shadow-md">
                  <brand.Logo />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
