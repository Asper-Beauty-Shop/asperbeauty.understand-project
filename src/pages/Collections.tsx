import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const collections = [
  {
    name: "Hair Care",
    nameAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±",
    slug: "hair-care",
    description: "Luxurious treatments for every hair type",
    descriptionAr: "Ø¹Ù„Ø§Ø¬Ø§Øª ÙØ§Ø®Ø±Ø© Ù„Ø¬Ù…ÙŠØ¹ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø´Ø¹Ø±",
    image: "/assets/luxury-asset-23.png",
  },
  {
    name: "Body Care",
    nameAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¬Ø³Ù…",
    slug: "body-care",
    description: "Nourish and pamper your skin",
    descriptionAr: "ØºØ°ÙŠ ÙˆØ¯Ù„Ù„ÙŠ Ø¨Ø´Ø±ØªÙƒ",
    image: "/assets/luxury-asset-24.png",
  },
  {
    name: "Make Up",
    nameAr: "Ø§Ù„Ù…ÙƒÙŠØ§Ø¬",
    slug: "make-up",
    description: "Enhance your natural beauty",
    descriptionAr: "Ø¹Ø²Ø²ÙŠ Ø¬Ù…Ø§Ù„Ùƒ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ",
    image: "/assets/luxury-asset-25.png",
  },
  {
    name: "Skincare",
    nameAr: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©",
    slug: "skincare",
    description: "Premium skincare solutions",
    descriptionAr: "Ø­Ù„ÙˆÙ„ Ù…ØªÙ…ÙŠØ²Ø© Ù„Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©",
    image: "/assets/luxury-asset-26.png",
  },
  {
    name: "Fragrances",
    nameAr: "Ø§Ù„Ø¹Ø·ÙˆØ±",
    slug: "fragrances",
    description: "Captivating scents for every occasion",
    descriptionAr: "Ø±ÙˆØ§Ø¦Ø­ Ø¢Ø³Ø±Ø© Ù„ÙƒÙ„ Ù…Ù†Ø§Ø³Ø¨Ø©",
    image: "/assets/luxury-asset-27.png",
  },
  {
    name: "Tools & Devices",
    nameAr: "Ø§Ù„Ø£Ø¯ÙˆØ§Øª ÙˆØ§Ù„Ø£Ø¬Ù‡Ø²Ø©",
    slug: "tools-devices",
    description: "Professional-grade beauty tools",
    descriptionAr: "Ø£Ø¯ÙˆØ§Øª ØªØ¬Ù…ÙŠÙ„ Ø¨Ø¬ÙˆØ¯Ø© Ø§Ø­ØªØ±Ø§ÙÙŠØ©",
    image: "/assets/luxury-asset-28.png",
  },
];

export default function Collections() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <div className="luxury-container">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              {isAr
                ? (
                  <>
                    Ù…Ø¬Ù…ÙˆØ¹Ø§ØªÙ†Ø§ <span className="text-gold">Ø§Ù„ÙØ§Ø®Ø±Ø©</span>
                  </>
                )
                : (
                  <>
                    Our <span className="text-gold">Collections</span>
                  </>
                )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-body text-cream/60 max-w-2xl mx-auto">
              {isAr
                ? "Ø§ÙƒØªØ´ÙÙŠ Ù…Ø¬Ù…ÙˆØ¹ØªÙ†Ø§ Ø§Ù„Ù…Ø®ØªØ§Ø±Ø© Ù…Ù† Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„ Ø§Ù„ÙØ§Ø®Ø±Ø©ØŒ Ø§Ù„Ù…Ø®ØªØ§Ø±Ø© Ø¨Ø¹Ù†Ø§ÙŠØ© Ù„Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ù…Ù…ÙŠØ²."
                : "Discover our curated selection of premium beauty products, carefully chosen for the discerning customer."}
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                to={`/collections/${collection.slug}`}
                className="group relative overflow-hidden aspect-[4/5] border border-gold/20 hover:border-gold/50 transition-all duration-500"
              >
                <img
                  src={collection.image}
                  alt={isAr ? collection.nameAr : collection.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h2 className="font-display text-2xl text-cream mb-2 group-hover:text-gold transition-colors">
                    {isAr ? collection.nameAr : collection.name}
                  </h2>
                  <p className="font-body text-sm text-cream/70">
                    {isAr ? collection.descriptionAr : collection.description}
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-block px-6 py-2 border border-gold text-gold font-display text-xs tracking-wider">
                      {isAr ? "Ø§Ø³ØªÙƒØ´Ù â†" : "EXPLORE â†’"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
