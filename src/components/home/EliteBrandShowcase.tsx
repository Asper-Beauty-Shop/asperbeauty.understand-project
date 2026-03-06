import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const eliteBrands = [
  {
    id: '1',
    name: 'La Mer',
    imageUrl: 'https://images.unsplash.com/photo-1615397323194-cefbe81cb878?q=80&w=2000&auto=format&fit=crop', 
    href: '/shop?brand=La%20Mer',
    labelAr: 'لا مير'
  },
  {
    id: '2',
    name: 'Augustinus Bader',
    imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=2000&auto=format&fit=crop',
    href: '/shop?brand=Augustinus%20Bader',
    labelAr: 'أوغستينوس بادر'
  },
  {
    id: '3',
    name: 'Dr. Barbara Sturm',
    imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000&auto=format&fit=crop',
    href: '/shop?brand=Dr.%20Barbara%20Sturm',
    labelAr: 'د. باربرا ستورم'
  }
];

export default function EliteBrandShowcase() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="bg-[#FFFBF2] py-24 px-6 md:px-12 lg:px-24 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display text-[#800020] tracking-wide uppercase mb-4">
            {isAr ? "تميز منتقى" : "Curated Excellence"}
          </h2>
          <div className="w-16 h-[2px] bg-[#C5A028] mx-auto"></div>
        </motion.div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {eliteBrands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={brand.href} className="group block cursor-pointer">
                <div className="relative overflow-hidden w-full aspect-[4/5] bg-asper-stone shadow-sm transition-all duration-700 ease-in-out group-hover:shadow-2xl group-hover:ring-1 group-hover:ring-[#C5A028] group-hover:ring-offset-4 group-hover:ring-offset-[#FFFBF2]">
                  
                  {/* Editorial Image */}
                  <img
                    src={brand.imageUrl}
                    alt={`${brand.name} showcase`}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                {/* Brand Typography */}
                <div className="mt-8 text-center transition-transform duration-500 transform group-hover:-translate-y-1">
                  <h3 className="text-xl md:text-2xl font-display text-[#800020] tracking-widest uppercase">
                    {isAr ? brand.labelAr : brand.name}
                  </h3>
                  <span className="block mt-2 text-sm text-[#C5A028] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-body">
                    {isAr ? "اكتشف المجموعة" : "Explore Collection"}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
