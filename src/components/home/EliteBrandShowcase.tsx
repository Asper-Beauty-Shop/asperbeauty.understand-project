import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const eliteBrands = [
  {
    id: '1',
    name: 'La Mer',
    labelAr: 'لا مير',
    tagline: 'The Miracle Broth™',
    taglineAr: 'مرق المعجزة™',
    imageUrl: 'https://images.unsplash.com/photo-1615397323194-cefbe81cb878?q=80&w=2000&auto=format&fit=crop',
    href: '/shop?brand=La%20Mer',
    featured: true,
  },
  {
    id: '2',
    name: 'Augustinus Bader',
    labelAr: 'أوغستينوس بادر',
    tagline: 'The Cell-Renewal Formula',
    taglineAr: 'تركيبة تجديد الخلايا',
    imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=2000&auto=format&fit=crop',
    href: '/shop?brand=Augustinus%20Bader',
    featured: false,
  },
  {
    id: '3',
    name: 'Dr. Barbara Sturm',
    labelAr: 'د. باربرا ستورم',
    tagline: 'Science-Backed Anti-Aging',
    taglineAr: 'مكافحة الشيخوخة العلمية',
    imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000&auto=format&fit=crop',
    href: '/shop?brand=Dr.%20Barbara%20Sturm',
    featured: false,
  },
  {
    id: '4',
    name: 'Sisley Paris',
    labelAr: 'سيسلي باريس',
    tagline: 'Phyto-Cosmetology',
    taglineAr: 'علم التجميل النباتي',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2000&auto=format&fit=crop',
    href: '/shop?brand=Sisley%20Paris',
    featured: false,
  },
  {
    id: '5',
    name: 'Valmont',
    labelAr: 'فالمون',
    tagline: 'Swiss Cellular Excellence',
    taglineAr: 'التميز الخلوي السويسري',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop',
    href: '/shop?brand=Valmont',
    featured: false,
  },
  {
    id: '6',
    name: 'ILIA Beauty',
    labelAr: 'إيليا بيوتي',
    tagline: 'Clean with Confidence',
    taglineAr: 'نظافة بثقة',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2000&auto=format&fit=crop',
    href: '/shop?brand=ILIA%20Beauty',
    featured: false,
  },
];

const featuredBrand = eliteBrands.find((b) => b.featured) ?? eliteBrands[0];
const gridBrands = eliteBrands.filter((b) => b !== featuredBrand);

export default function EliteBrandShowcase() {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="bg-asper-stone py-24 w-full overflow-hidden">
      <div className="luxury-container">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn("mb-16", isAr ? "text-right" : "text-center")}
        >
          <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-3 block">
            {isAr ? "علامات تجارية مختارة" : "Handpicked Luxury Brands"}
          </span>
          <h2 className={cn("text-3xl md:text-5xl font-display text-burgundy tracking-wide uppercase mb-4", isAr && "font-arabic")}>
            {isAr ? "تميز منتقى" : "Curated Excellence"}
          </h2>
          <div className={cn("w-16 h-[2px] bg-polished-gold", isAr ? "mr-0 ml-auto" : "mx-auto")}></div>
        </motion.div>

        {/* Featured Hero Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="mb-12"
        >
          <Link to={featuredBrand.href} className="group block cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:ring-1 group-hover:ring-polished-gold group-hover:ring-offset-4 group-hover:ring-offset-asper-stone">
              {/* Hero image — appears second in RTL so the text panel sits on the right */}
              <div className={cn("relative overflow-hidden aspect-[16/9] lg:aspect-auto lg:min-h-[420px]", isAr && "lg:order-2")}>
                <img
                  src={featuredBrand.imageUrl}
                  alt={`${featuredBrand.name} showcase`}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              {/* Hero brand info — appears first in RTL */}
              <div className={cn("bg-card flex flex-col justify-center px-10 py-12 lg:px-14", isAr && "text-right lg:order-1")}>
                <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-4 block">
                  {isAr ? "العلامة المميزة" : "Featured Brand"}
                </span>
                <h3 className={cn("text-4xl lg:text-5xl font-display text-burgundy tracking-widest uppercase mb-3", isAr && "font-arabic")}>
                  {isAr ? featuredBrand.labelAr : featuredBrand.name}
                </h3>
                <p className="font-body text-sm text-polished-gold/80 italic mb-6">
                  — {isAr ? featuredBrand.taglineAr : featuredBrand.tagline}
                </p>
                <span className={cn("inline-flex items-center gap-2 text-sm text-asper-ink uppercase tracking-[0.2em] font-body transition-colors duration-300 group-hover:text-burgundy", isAr && "flex-row-reverse")}>
                  {isAr ? "اكتشف المجموعة" : "Explore Collection"}
                  <ArrowRight className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-1", dir === "rtl" && "rotate-180 group-hover:-translate-x-1")} />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {gridBrands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className={cn(i === 0 && "md:col-span-2 lg:col-span-2")}
            >
              <Link to={brand.href} className="group block cursor-pointer h-full">
                <div className={cn("relative overflow-hidden w-full bg-asper-stone shadow-sm transition-all duration-700 ease-in-out group-hover:shadow-2xl group-hover:ring-1 group-hover:ring-polished-gold group-hover:ring-offset-4 group-hover:ring-offset-asper-stone", i === 0 ? "aspect-[4/3]" : "aspect-[4/5]")}>
                  <img
                    src={brand.imageUrl}
                    alt={`${brand.name} showcase`}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                {/* Brand Typography */}
                <div className={cn("mt-5 transition-transform duration-500 transform group-hover:-translate-y-1", isAr ? "text-right" : "text-center")}>
                  <h3 className={cn("text-base md:text-lg font-display text-burgundy tracking-widest uppercase", isAr && "font-arabic")}>
                    {isAr ? brand.labelAr : brand.name}
                  </h3>
                  <p className="mt-1 text-xs text-asper-ink-muted font-body italic opacity-80">
                    {isAr ? brand.taglineAr : brand.tagline}
                  </p>
                  <span className="block mt-2 text-xs text-polished-gold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-body">
                    {isAr ? "اكتشف المجموعة" : "Explore Collection"}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link to="/shop">
            <Button
              size="lg"
              className="group bg-burgundy text-primary-foreground hover:bg-burgundy-light border border-transparent hover:border-polished-gold text-sm uppercase tracking-widest px-10 h-12 font-semibold transition-all duration-400"
            >
              {isAr ? "استكشف جميع العلامات الفاخرة" : "Discover All Elite Brands"}
              <ArrowRight
                className={cn(
                  "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                  dir === "rtl"
                    ? "mr-2 rotate-180 group-hover:-translate-x-1"
                    : "ml-2"
                )}
              />
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
