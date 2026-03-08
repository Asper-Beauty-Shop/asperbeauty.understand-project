import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Sparkles, Stethoscope, Flower2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

const SCIENCE_BRANDS = [
{ name: "Vichy", slug: "Vichy", logo: "/brands/vichy.png" },
{ name: "La Roche-Posay", slug: "La Roche-Posay", logo: "/brands/laroche-posay.png" },
{ name: "Bioderma", slug: "Bioderma", logo: "/brands/bioderma.png" },
{ name: "CeraVe", slug: "CeraVe", logo: "/brands/cerave.png" },
{ name: "Eucerin", slug: "Eucerin", logo: "/brands/eucerin.png" },
{ name: "Sesderma", slug: "Sesderma", logo: "/brands/sesderma.png" }];


const STYLE_BRANDS = [
{ name: "Maybelline", slug: "Maybelline", logo: "/brands/maybelline.png" },
{ name: "Rimmel", slug: "Rimmel", logo: "/brands/rimmel.png" },
{ name: "L'Oréal", slug: "L'Oreal", logo: "/brands/loreal.png" },
{ name: "Guerlain", slug: "Guerlain", logo: "/brands/guerlain.png" },
{ name: "Nuxe", slug: "Nuxe", logo: "/brands/nuxe.png" },
{ name: "Kérastase", slug: "Kerastase", logo: "/brands/kerastase.png" }];


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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: LUXURY_EASE }}>
          
          <span className="font-body text-[11px] uppercase tracking-[0.4em] text-accent mb-4 block font-bold">
            {isAr ? "استراتيجية الكتالوج" : "Catalogue Strategy"}
          </span>
          <h2 className={cn(
            "font-display text-3xl md:text-4xl lg:text-5xl text-primary leading-tight",
            isAr && "font-arabic"
          )}>
            {isAr ? "العلم يلتقي الأناقة" : "Science Meets Style"}
          </h2>
          <p className={cn(
            "font-body text-sm md:text-base text-muted-foreground mt-4 max-w-2xl mx-auto",
            isAr && "font-arabic"
          )}>
            {isAr ?
            "من الوصفات الطبية إلى الجمال اليومي — كل ما تحتاجينه تحت سقف واحد" :
            "From clinical prescriptions to everyday beauty — everything you need under one roof"}
          </p>
          <div className="luxury-divider mt-6" />
        </motion.div>

        {/* Floating Brand Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
          {[...SCIENCE_BRANDS, ...STYLE_BRANDS].map((brand, i) =>
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: LUXURY_EASE }}>
              
              <Link
                to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                className="group/logo flex items-center justify-center cursor-pointer h-32"
                aria-label={brand.name}
                title={brand.name}>
                
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-28 md:w-40 h-auto object-contain grayscale opacity-40 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-125 will-change-transform transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  loading="lazy" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>);

}