import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Droplets, Heart, Sparkles, Sun } from "lucide-react";

const FEATURED_BRANDS = [
  {
    id: "vichy",
    name: "Vichy",
    description:
      "French pharmacy skincare powered by Volcanic Mineralizing Water",
    descriptionAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ø¨Ù‚ÙˆØ© Ù…ÙŠØ§Ù‡ ÙÙŠØ´ÙŠ Ø§Ù„Ø¨Ø±ÙƒØ§Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ø¯Ù†ÙŠØ©",
    icon: Droplets,
    color: "from-cyan-500/20 to-cyan-700/20",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    href: "/brands/vichy",
    productCount: 13,
    featured: true,
  },
  {
    id: "eucerin",
    name: "Eucerin",
    description: "Dermatological skincare for sensitive and problem skin",
    descriptionAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø­Ø³Ø§Ø³Ø© ÙˆØ§Ù„Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¬Ù„Ø¯ÙŠØ©",
    icon: Heart,
    color: "from-blue-500/20 to-blue-700/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    href: "/collections/skin-care",
    productCount: 2,
    featured: false,
  },
  {
    id: "cetaphil",
    name: "Cetaphil",
    description: "Gentle skincare trusted by dermatologists worldwide",
    descriptionAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ù„Ø·ÙŠÙØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ù…ÙˆØ«ÙˆÙ‚Ø© Ø¹Ø§Ù„Ù…ÙŠØ§Ù‹",
    icon: Sparkles,
    color: "from-emerald-500/20 to-emerald-700/20",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    href: "/collections/skin-care",
    productCount: 1,
    featured: false,
  },
  {
    id: "bioten",
    name: "Bioten",
    description: "Anti-aging skincare with innovative formulations",
    descriptionAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ù…Ø¶Ø§Ø¯Ø© Ù„Ù„Ø´ÙŠØ®ÙˆØ®Ø© Ø¨ØªØ±ÙƒÙŠØ¨Ø§Øª Ù…Ø¨ØªÙƒØ±Ø©",
    icon: Sun,
    color: "from-amber-500/20 to-amber-700/20",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    href: "/collections/skin-care",
    productCount: 2,
    featured: false,
  },
];

export default function Brands() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <div className="luxury-container">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
              {isAr ? "Ø´Ø±ÙƒØ§Ø¤Ù†Ø§" : "Our Partners"}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              {isAr
                ? (
                  <>
                    Ø¹Ù„Ø§Ù…Ø§ØªÙ†Ø§ <span className="text-gold">Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©</span>
                  </>
                )
                : (
                  <>
                    Our <span className="text-gold">Brands</span>
                  </>
                )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-body text-cream/60 max-w-2xl mx-auto">
              {isAr
                ? "Ù†ØªØ¹Ø§ÙˆÙ† Ù…Ø¹ Ø£Ø±Ù‚Ù‰ Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ© Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠØ© Ù„Ù„Ø¬Ù…Ø§Ù„ Ù„Ù†Ù‚Ø¯Ù… Ù„Ùƒ Ø¬ÙˆØ¯Ø© Ø§Ø³ØªØ«Ù†Ø§Ø¦ÙŠØ©."
                : "We partner with the world's most prestigious beauty brands to bring you exceptional quality."}
            </p>
          </div>

          {/* Featured Brand - Vichy */}
          {FEATURED_BRANDS.filter((b) => b.featured).map((brand) => {
            const Icon = brand.icon;
            return (
              <Link
                key={brand.id}
                to={brand.href}
                className="block mb-12 group"
              >
                <div
                  className={`
                  relative overflow-hidden rounded-2xl p-8 md:p-12
                  bg-gradient-to-r ${brand.color}
                  border ${brand.borderColor}
                  transition-all duration-500
                  hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10
                `}
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div
                      className={`
                      w-24 h-24 rounded-2xl flex items-center justify-center
                      bg-gradient-to-br ${brand.color}
                      border ${brand.borderColor}
                    `}
                    >
                      <Icon className={`w-12 h-12 ${brand.iconColor}`} />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <Badge className="mb-3 bg-gold/20 text-gold border-gold/30">
                        {isAr ? "Ø¹Ù„Ø§Ù…Ø© Ù…Ù…ÙŠØ²Ø©" : "Featured Brand"}
                      </Badge>
                      <h2 className="font-display text-4xl md:text-5xl text-cream mb-3">
                        {brand.name}
                      </h2>
                      <p className="text-cream/70 text-lg max-w-xl">
                        {isAr ? brand.descriptionAr : brand.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl">
                        <div className="font-display text-3xl text-gold">
                          {brand.productCount}
                        </div>
                        <div className="text-cream/60 text-sm">
                          {isAr ? "Ù…Ù†ØªØ¬" : "Products"}
                        </div>
                      </div>
                      <div
                        className={`
                        flex items-center gap-2 ${brand.iconColor}
                        group-hover:translate-x-2 transition-transform duration-300
                      `}
                      >
                        <span>
                          {isAr ? "ØªØµÙØ­ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª" : "Browse Products"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Other Brands Grid */}
          <h3 className="font-display text-2xl text-cream mb-8">
            {isAr ? "Ø§Ù„Ù…Ø²ÙŠØ¯ Ù…Ù† Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" : "More Brands"}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_BRANDS.filter((b) => !b.featured).map((brand) => {
              const Icon = brand.icon;
              return (
                <Link
                  key={brand.id}
                  to={brand.href}
                  className="group"
                >
                  <div
                    className={`
                    relative overflow-hidden rounded-xl p-6
                    bg-gradient-to-br ${brand.color}
                    border ${brand.borderColor}
                    transition-all duration-300
                    hover:scale-[1.02] hover:shadow-lg
                  `}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                        w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                        bg-white/10 backdrop-blur-sm
                      `}
                      >
                        <Icon className={`w-7 h-7 ${brand.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl text-cream mb-1">
                          {brand.name}
                        </h3>
                        <p className="text-cream/60 text-sm line-clamp-2">
                          {isAr ? brand.descriptionAr : brand.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <span className="text-cream/50 text-sm">
                        {brand.productCount} {isAr ? "Ù…Ù†ØªØ¬" : "products"}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 ${brand.iconColor} group-hover:translate-x-1 transition-transform`}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
