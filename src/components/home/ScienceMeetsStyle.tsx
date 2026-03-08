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
  { name: "Sesderma", slug: "Sesderma", logo: "/brands/sesderma.png" },
];

const STYLE_BRANDS = [
  { name: "Maybelline", slug: "Maybelline", logo: "/brands/maybelline.png" },
  { name: "Rimmel", slug: "Rimmel", logo: "/brands/rimmel.png" },
  { name: "L'Oréal", slug: "L'Oreal", logo: "/brands/loreal.png" },
  { name: "Guerlain", slug: "Guerlain", logo: "/brands/guerlain.png" },
  { name: "Nuxe", slug: "Nuxe", logo: "/brands/nuxe.png" },
  { name: "Kérastase", slug: "Kerastase", logo: "/brands/kerastase.png" },
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: LUXURY_EASE }}
        >
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
            {isAr
              ? "من الوصفات الطبية إلى الجمال اليومي — كل ما تحتاجينه تحت سقف واحد"
              : "From clinical prescriptions to everyday beauty — everything you need under one roof"}
          </p>
          <div className="luxury-divider mt-6" />
        </motion.div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* ── Side A: Science / Dr. Sami ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: LUXURY_EASE }}
            className="group bg-white rounded-none p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-accent transition-all duration-700 relative overflow-hidden"
          >
            {/* Subtle clinical gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10">
              {/* Persona badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
                    {isAr ? "د. سامي" : "Dr. Sami"}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {isAr ? "السلطة السريرية" : "Clinical Authority"}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className={cn(
                "font-display text-xl md:text-2xl text-foreground mb-2",
                isAr && "font-arabic"
              )}>
                {isAr ? "مستحضرات الجلدية الطبية" : "Dermocosmetics"}
              </h3>
              <p className={cn(
                "font-body text-sm italic text-muted-foreground mb-8",
                isAr && "font-arabic"
              )}>
                {isAr ? "الركيزة السريرية — وصفات الصيدلي" : "The Clinical Core — Pharmacist Prescriptions"}
              </p>

              {/* Brand mini-grid */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {SCIENCE_BRANDS.map((brand, i) => (
                  <motion.div
                    key={brand.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                      className="group/card flex items-center justify-center p-6 md:p-8 rounded-xl bg-white shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-2 border-2 border-transparent hover:border-accent will-change-transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer"
                      aria-label={brand.name}
                    >
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="w-20 md:w-28 h-auto max-h-14 md:max-h-20 object-contain mix-blend-multiply grayscale opacity-60 group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-105 will-change-transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        loading="lazy"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/shop?category=dermocosmetics"
                className="mt-8 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors duration-300"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                {isAr ? "تصفح الوصفات الطبية" : "Browse Clinical Range"}
              </Link>
            </div>
          </motion.div>

          {/* ── Side B: Style / Ms. Zain ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.1 }}
            className="group bg-white rounded-none p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-accent transition-all duration-700 relative overflow-hidden"
          >
            {/* Warm editorial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent pointer-events-none" />

            <div className="relative z-10">
              {/* Persona badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
                    {isAr ? "مس زين" : "Ms. Zain"}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {isAr ? "أيقونة الجمال" : "Beauty Curator"}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3 className={cn(
                "font-display text-xl md:text-2xl text-foreground mb-2",
                isAr && "font-arabic"
              )}>
                {isAr ? "أساسيات الجمال اليومي" : "Everyday Essentials"}
              </h3>
              <p className={cn(
                "font-body text-sm italic text-muted-foreground mb-8",
                isAr && "font-arabic"
              )}>
                {isAr ? "محركات الإقبال — المكياج والعناية اليومية" : "The Traffic Drivers — Makeup & Daily Beauty"}
              </p>

              {/* Brand mini-grid */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {STYLE_BRANDS.map((brand, i) => (
                  <motion.div
                    key={brand.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      to={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                      className="group/card flex items-center justify-center p-6 md:p-8 rounded-xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-accent transition-all duration-700 cursor-pointer"
                      aria-label={brand.name}
                    >
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="w-20 md:w-28 h-auto max-h-14 md:max-h-20 object-contain mix-blend-multiply grayscale opacity-60 group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700"
                        loading="lazy"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/shop?category=beauty"
                className="mt-8 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-accent hover:text-primary transition-colors duration-300"
              >
                <Flower2 className="w-3.5 h-3.5" />
                {isAr ? "تصفح مجموعة الجمال" : "Browse Beauty Edit"}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
}
