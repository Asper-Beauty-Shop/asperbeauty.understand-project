import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BestSellers() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              {isAr
                ? (
                  <>
                    Ø§Ù„Ø£ÙƒØ«Ø± <span className="text-gold">Ù…Ø¨ÙŠØ¹Ø§Ù‹</span>
                  </>
                )
                : (
                  <>
                    Best <span className="text-gold">Sellers</span>
                  </>
                )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-body text-cream/60 max-w-2xl mx-auto">
              {isAr
                ? "Ø§ÙƒØªØ´ÙÙŠ Ù…Ù†ØªØ¬Ø§ØªÙ†Ø§ Ø§Ù„Ø£ÙƒØ«Ø± Ø´Ø¹Ø¨ÙŠØ©ØŒ Ø§Ù„Ù…Ø®ØªØ§Ø±Ø© Ø¨Ø¹Ù†Ø§ÙŠØ© Ù…Ù† Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§ Ø§Ù„Ù…Ù…ÙŠØ²ÙŠÙ†."
                : "Discover our most loved products, handpicked favorites from our discerning customers."}
            </p>
          </div>

          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
