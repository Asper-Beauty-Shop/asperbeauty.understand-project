import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const collections = [
  {
    name: "Hair Care",
    nameAr: "العناية بالشعر",
    slug: "hair-care",
    description: "Luxurious treatments for every hair type",
    descriptionAr: "علاجات فاخرة لجميع أنواع الشعر",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
  },
  {
    name: "Body Care",
    nameAr: "العناية بالجسم",
    slug: "body-care",
    description: "Nourish and pamper your skin",
    descriptionAr: "غذي ودللي بشرتك",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=600",
  },
  {
    name: "Make Up",
    nameAr: "المكياج",
    slug: "make-up",
    description: "Enhance your natural beauty",
    descriptionAr: "عززي جمالك الطبيعي",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600",
  },
  {
    name: "Skincare",
    nameAr: "العناية بالبشرة",
    slug: "skincare",
    description: "Premium skincare solutions",
    descriptionAr: "حلول متميزة للعناية بالبشرة",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600",
  },
  {
    name: "Fragrances",
    nameAr: "العطور",
    slug: "fragrances",
    description: "Captivating scents for every occasion",
    descriptionAr: "روائح آسرة لكل مناسبة",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
  },
  {
    name: "Tools & Devices",
    nameAr: "الأدوات والأجهزة",
    slug: "tools-devices",
    description: "Professional-grade beauty tools",
    descriptionAr: "أدوات تجميل بجودة احترافية",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
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
                    مجموعاتنا <span className="text-gold">الفاخرة</span>
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
                ? "اكتشفي مجموعتنا المختارة من منتجات التجميل الفاخرة، المختارة بعناية للعميل المميز."
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
                      {isAr ? "استكشف ←" : "EXPLORE →"}
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
