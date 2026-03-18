import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Wedding() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <div className="luxury-container">
          {/* Editorial Banner */}
          <div className="relative mb-16 overflow-hidden">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="py-12 px-6 md:px-12 text-center bg-rose-950">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center">
                  <span className="text-gold text-xl">✦</span>
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 tracking-wide text-rose-50">
                {isAr ? (
                  <>
                    جمال <span className="text-gold">العروس</span>
                  </>
                ) : (
                  <>
                    Bridal <span className="text-gold">Beauty</span>
                  </>
                )}
              </h1>

              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />

              <p className="font-display text-lg md:text-xl text-gold italic mb-6 max-w-2xl mx-auto">
                {isAr
                  ? '"إشراقة العروس: كل ما تحتاجينه ليوم لا يُنسى"'
                  : '"The bridal glow begins here — curated beauty for your most unforgettable day."'}
              </p>

              <p className="font-body max-w-3xl mx-auto leading-relaxed text-rose-50">
                {isAr
                  ? "اكتشفي مجموعتنا المختارة من منتجات التجميل الفاخرة المصممة لإطلالة العروس المثالية. من العناية بالبشرة إلى العطور الساحرة، نقدم لك كل ما تحتاجينه للتألق في يومك الخاص."
                  : "Discover our curated selection of luxury beauty products designed for the perfect bridal look. From radiant skincare to captivating fragrances, we have everything you need to glow on your special day."}
              </p>
            </div>
          </div>

          <ProductGrid showFilters />
        </div>
      </main>

      <Footer />
    </div>
  );
}
