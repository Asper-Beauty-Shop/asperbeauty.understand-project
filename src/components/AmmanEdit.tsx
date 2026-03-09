import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { LazyImage } from "./LazyImage";

const anthelios = "/assets/luxury-asset-6.png";
const olaplex = "/assets/luxury-asset-7.png";
const eucerin = "/assets/luxury-asset-8.png";
const diorSauvage = "/assets/luxury-asset-9.png";

const products = [
  {
    id: "anthelios",
    name: "La Roche-Posay Anthelios UVMune 400",
    nameAr: "Ù„Ø§Ø±ÙˆØ´ Ø¨ÙˆØ²ÙŠÙ‡ Ø£Ù†Ø«ÙŠÙ„ÙŠÙˆØ³",
    label: "The Invisible Shield",
    labelAr: "Ø§Ù„Ø¯Ø±Ø¹ ØºÙŠØ± Ø§Ù„Ù…Ø±Ø¦ÙŠ",
    image: anthelios,
    href: "/collections/skin-care",
  },
  {
    id: "olaplex",
    name: "Olaplex No. 3 Hair Perfector",
    nameAr: "Ø£ÙˆÙ„Ø§Ø¨Ù„ÙŠÙƒØ³ Ø±Ù‚Ù… Ù£",
    label: "The Bond Builder",
    labelAr: "Ø¨Ø§Ù†ÙŠ Ø§Ù„Ø±ÙˆØ§Ø¨Ø·",
    image: olaplex,
    href: "/collections/hair-care",
  },
  {
    id: "eucerin",
    name: "Eucerin Anti-Pigment Dual Serum",
    nameAr: "ÙŠÙˆØ³ÙŠØ±ÙŠÙ† Ø³ÙŠØ±ÙˆÙ… Ù…Ø²Ø¯ÙˆØ¬",
    label: "Radiance Restored",
    labelAr: "Ø¥Ø´Ø±Ø§Ù‚Ø© Ù…ØªØ¬Ø¯Ø¯Ø©",
    image: eucerin,
    href: "/collections/skin-care",
  },
  {
    id: "dior",
    name: "Dior Sauvage Elixir",
    nameAr: "Ø¯ÙŠÙˆØ± Ø³ÙˆÙØ§Ø¬ Ø¥Ù„ÙŠÙƒØ³ÙŠØ±",
    label: "The Modern Signature",
    labelAr: "Ø§Ù„ØªÙˆÙ‚ÙŠØ¹ Ø§Ù„Ø¹ØµØ±ÙŠ",
    image: diorSauvage,
    href: "/collections/fragrances",
  },
];

export const AmmanEdit = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="luxury-container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {isArabic ? "Ø§Ø®ØªÙŠØ§Ø±Ø§Øª Ø¹Ù…Ù‘Ø§Ù†" : "The Amman Edit"}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </AnimatedSection>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {products.map((product, index) => (
            <AnimatedSection
              key={product.id}
              animation="fade-up"
              delay={index * 100}
            >
              <Link
                to={product.href}
                className="group block"
              >
                {/* Product Card */}
                <div className="relative overflow-hidden rounded-lg transition-all duration-500">
                  {/* Image Container with hover effect */}
                  <div className="aspect-[3/4] bg-[#f5f5f5] group-hover:bg-[#D4AF37] transition-colors duration-500 p-6">
                    <LazyImage
                      src={product.image}
                      alt={isArabic ? product.nameAr : product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      width={640}
                      height={960}
                      skeletonClassName="rounded-lg"
                    />
                  </div>

                  {/* Label Badge */}
                  <div className="absolute top-4 left-4 bg-burgundy/90 text-cream px-3 py-1 rounded-full">
                    <span className="font-body text-xs uppercase tracking-wider">
                      {isArabic ? product.labelAr : product.label}
                    </span>
                  </div>

                  {/* Shop Link - appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="font-display text-sm uppercase tracking-widest text-burgundy bg-cream/90 px-6 py-3 rounded-full shadow-lg">
                      {isArabic ? "ØªØ³ÙˆÙ‚" : "Shop"}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div
                  className={`mt-4 ${isArabic ? "text-right" : "text-left"}`}
                >
                  <h3 className="font-display text-sm lg:text-base text-foreground leading-tight mb-1 line-clamp-2">
                    {isArabic ? product.nameAr : product.name}
                  </h3>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

