import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

const ALL_BRANDS = [
  { name: "Vichy", slug: "Vichy", logo: "/brands/vichy.png" },
  { name: "La Roche-Posay", slug: "La Roche-Posay", logo: "/brands/laroche-posay.png" },
  { name: "Bioderma", slug: "Bioderma", logo: "/brands/bioderma.png" },
  { name: "CeraVe", slug: "CeraVe", logo: "/brands/cerave.png" },
  { name: "Eucerin", slug: "Eucerin", logo: "/brands/eucerin.png" },
  { name: "Sesderma", slug: "Sesderma", logo: "/brands/sesderma.png" },
  { name: "COSRX", slug: "COSRX", logo: "/brands/cosrx.png" },
  { name: "Maybelline", slug: "Maybelline", logo: "/brands/maybelline.png" },
  { name: "Rimmel", slug: "Rimmel", logo: "/brands/rimmel.png" },
  { name: "L'Oréal", slug: "L'Oreal", logo: "/brands/loreal.png" },
  { name: "Guerlain", slug: "Guerlain", logo: "/brands/guerlain.png" },
  { name: "Nuxe", slug: "Nuxe", logo: "/brands/nuxe.png" },
  { name: "Kérastase", slug: "Kerastase", logo: "/brands/kerastase.png" },
];

// Pre-computed scattered positions so logos float randomly, not in a grid
const SCATTER_POSITIONS = [
  { x: "5%", y: "8%", size: "w-32 md:w-44", float: 3.2, delay: 0 },
  { x: "28%", y: "2%", size: "w-28 md:w-40", float: 3.8, delay: 0.4 },
  { x: "55%", y: "5%", size: "w-36 md:w-48", float: 2.9, delay: 0.2 },
  { x: "78%", y: "10%", size: "w-28 md:w-40", float: 3.5, delay: 0.6 },
  { x: "12%", y: "32%", size: "w-36 md:w-48", float: 4.0, delay: 0.1 },
  { x: "42%", y: "28%", size: "w-32 md:w-44", float: 3.3, delay: 0.5 },
  { x: "68%", y: "35%", size: "w-28 md:w-40", float: 3.7, delay: 0.3 },
  { x: "92%", y: "30%", size: "w-32 md:w-44", float: 2.8, delay: 0.7 },
  { x: "2%", y: "58%", size: "w-28 md:w-40", float: 3.6, delay: 0.2 },
  { x: "25%", y: "62%", size: "w-36 md:w-48", float: 3.1, delay: 0.8 },
  { x: "50%", y: "55%", size: "w-32 md:w-44", float: 3.9, delay: 0.4 },
  { x: "75%", y: "60%", size: "w-36 md:w-48", float: 3.4, delay: 0.1 },
  { x: "38%", y: "82%", size: "w-28 md:w-40", float: 3.0, delay: 0.6 },
];

export function ScienceMeetsStyle() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="w-full bg-asper-stone-light py-20 md:py-28 relative overflow-hidden">
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: LUXURY_EASE }}
        >
          <span className="font-body text-[11px] uppercase tracking-[0.4em] text-accent mb-4 block font-bold">
            {isAr ? "استراتيجية الكتالوج" : "Catalogue Strategy"}
          </span>
          <h2
            className={cn(
              "font-display text-3xl md:text-4xl lg:text-5xl text-primary leading-tight",
              isAr && "font-arabic"
            )}
          >
            {isAr ? "العلم يلتقي الأناقة" : "Science Meets Style"}
          </h2>
          <p
            className={cn(
              "font-body text-sm md:text-base text-muted-foreground mt-4 max-w-2xl mx-auto",
              isAr && "font-arabic"
            )}
          >
            {isAr
              ? "من الوصفات الطبية إلى الجمال اليومي — كل ما تحتاجينه تحت سقف واحد"
              : "From clinical prescriptions to everyday beauty — everything you need under one roof"}
          </p>
          <div className="luxury-divider mt-6" />
        </motion.div>

        {/* Chaotic Floating Brand Cloud */}
        <div className="relative w-full" style={{ height: "clamp(420px, 55vw, 650px)" }}>
          {ALL_BRANDS.map((brand, i) => {
            const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];
            return (
              <motion.div
                key={brand.slug}
                className="absolute"
                style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: pos.delay,
                  duration: 0.7,
                  ease: LUXURY_EASE,
                }}
                animate={{
                  y: [0, -18, 0, 12, 0],
                  rotate: [0, 1.5, 0, -1.5, 0],
                }}
                // @ts-ignore – framer transition for animate
                {...{
                  transition: {
                    y: {
                      duration: pos.float,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: pos.float + 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  },
                }}
              >
                <Link
                  to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                  className="group/logo block cursor-pointer"
                  aria-label={brand.name}
                  title={brand.name}
                >
                  <motion.img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className={cn(
                      pos.size,
                      "h-auto object-contain",
                      "opacity-40 grayscale",
                      "group-hover/logo:opacity-100 group-hover/logo:grayscale-0",
                      "will-change-transform transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                      "drop-shadow-md group-hover/logo:drop-shadow-2xl"
                    )}
                    whileHover={{ scale: 1.6, y: -20 }}
                    whileTap={{ scale: 1.8 }}
                    loading="lazy"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
}
