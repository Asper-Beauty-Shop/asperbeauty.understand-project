import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Offers() {
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
                    عروض <span className="text-gold">خاصة</span>
                  </>
                )
                : (
                  <>
                    Special <span className="text-gold">Offers</span>
                  </>
                )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-body text-cream/60 max-w-2xl mx-auto">
              {isAr
                ? "عروض حصرية على منتجات التجميل الفاخرة. لفترة محدودة فقط."
                : "Exclusive deals on premium beauty products. Limited time only."}
            </p>
          </div>

          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
