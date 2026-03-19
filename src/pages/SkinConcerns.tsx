import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  Droplets,
  Eye,
  Heart,
  Loader2,
  Shield,
  Sparkles,
  Sun,
  Umbrella,
} from "lucide-react";
import { logSkinConcernClick } from "@/lib/conciergeAnalytics";
const antiAgingImage = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80";
const hydrationImage = "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&q=80";
const acneImage = "https://images.unsplash.com/photo-1559181567-c3190ca9be8a?w=800&q=80";
const brighteningImage = "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80";
const sensitivityImage = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80";
const sunProtectionImage = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80";
const darkCirclesImage = "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80";
const skinConcerns = [{
  id: "anti-aging",
  nameEn: "Anti-Aging",
  nameAr: "مكافحة الشيخوخة",
  descriptionEn:
    "Turn back time with powerful anti-aging formulas featuring retinol, collagen, and peptides.",
  descriptionAr: "استعيدي شباب بشرتك مع تركيبات قوية لمكافحة الشيخوخة.",
  image: antiAgingImage,
  icon: Sparkles,
  keywords: [
    "anti-aging",
    "collagen",
    "retinol",
    "liftactiv",
    "wrinkle",
    "firming",
    "peptide",
  ],
  color: "from-amber-500/20 to-orange-500/20",
}, {
  id: "hydration",
  nameEn: "Hydration",
  nameAr: "الترطيب",
  descriptionEn:
    "Quench your skin's thirst with intense hydration boosters and hyaluronic acid.",
  descriptionAr: "رطبي بشرتك بعمق مع معززات الترطيب وحمض الهيالورونيك.",
  image: hydrationImage,
  icon: Droplets,
  keywords: [
    "hydration",
    "hyaluronic",
    "moistur",
    "mineral 89",
    "aqua",
    "h.a.",
    "booster",
  ],
  color: "from-cyan-500/20 to-blue-500/20",
}, {
  id: "acne",
  nameEn: "Acne & Blemishes",
  nameAr: "حب الشباب والبقع",
  descriptionEn:
    "Clear and purify your skin with targeted treatments for acne-prone skin.",
  descriptionAr: "نقي بشرتك مع علاجات مستهدفة للبشرة المعرضة لحب الشباب.",
  image: acneImage,
  icon: Shield,
  keywords: [
    "acne",
    "blemish",
    "purif",
    "normaderm",
    "cleanser",
    "pore",
    "oil-free",
    "mattif",
  ],
  color: "from-green-500/20 to-emerald-500/20",
}, {
  id: "brightening",
  nameEn: "Brightening",
  nameAr: "التفتيح والإشراق",
  descriptionEn:
    "Reveal radiant, glowing skin with vitamin C and brightening serums.",
  descriptionAr: "اكشفي عن بشرة مشرقة ومتألقة مع فيتامين سي وسيرومات التفتيح.",
  image: brighteningImage,
  icon: Sun,
  keywords: [
    "bright",
    "vitamin c",
    "radiance",
    "glow",
    "dark spot",
    "b3",
    "luminous",
  ],
  color: "from-yellow-500/20 to-orange-400/20",
}, {
  id: "sensitivity",
  nameEn: "Sensitivity",
  nameAr: "البشرة الحساسة",
  descriptionEn:
    "Gentle, soothing formulas designed for delicate and reactive skin types.",
  descriptionAr: "تركيبات لطيفة ومهدئة مصممة للبشرة الحساسة والمتفاعلة.",
  image: sensitivityImage,
  icon: Heart,
  keywords: [
    "sensitive",
    "soothing",
    "calming",
    "gentle",
    "redness",
    "irritat",
    "dermatolog",
  ],
  color: "from-pink-400/20 to-rose-400/20",
}, {
  id: "sun-protection",
  nameEn: "Sun Protection",
  nameAr: "الحماية من الشمس",
  descriptionEn:
    "Shield your skin from harmful UV rays with advanced SPF protection.",
  descriptionAr: "احمي بشرتك من أشعة الشمس الضارة مع حماية متقدمة.",
  image: sunProtectionImage,
  icon: Umbrella,
  keywords: ["spf", "sun", "uv", "protect", "sunscreen", "broad spectrum"],
  color: "from-yellow-400/20 to-amber-400/20",
}, {
  id: "dark-circles",
  nameEn: "Dark Circles",
  nameAr: "الهالات السوداء",
  descriptionEn:
    "Target under-eye concerns with specialized eye care treatments.",
  descriptionAr: "عالجي مشاكل منطقة العين مع علاجات متخصصة للعناية بالعين.",
  image: darkCirclesImage,
  icon: Eye,
  keywords: [
    "eye",
    "dark circle",
    "puff",
    "under-eye",
    "eye care",
    "eye cream",
  ],
  color: "from-purple-400/20 to-violet-400/20",
}];
export default function SkinConcerns() {
  const {
    language,
    isRTL,
  } = useLanguage();
  const isAr = language === "ar";

  usePageMeta({
    title: isAr ? "مشاكل البشرة | أسبر بيوتي" : "Skin Concerns | Asper Beauty",
    description: isAr
      ? "اكتشفي الحلول العلمية لمشاكل بشرتك: حب الشباب، الشيخوخة، الجفاف، والحساسية — بإشراف صيادلة متخصصين."
      : "Find science-backed solutions for your skin concerns: acne, aging, dryness, sensitivity — curated by pharmacists.",
    canonical: "/skin-concerns",
  });

  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts(50);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);
  const filterProductsByConcern = (concernId: string) => {
    const concern = skinConcerns.find((c) => c.id === concernId);
    if (!concern) return [];
    return products.filter((product) => {
      const title = product.node.title.toLowerCase();
      const description = product.node.description?.toLowerCase() || "";
      const combined = `${title} ${description}`;
      return concern.keywords.some((keyword) =>
        combined.includes(keyword.toLowerCase())
      );
    });
  };
  const filteredProducts = selectedConcern
    ? filterProductsByConcern(selectedConcern)
    : [];
  const activeConcern = skinConcerns.find((c) => c.id === selectedConcern);
  return (
    <div className="min-h-screen bg-soft-ivory" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      <main className="pt-32 lg:pt-40">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-b from-muted/50 to-soft-ivory overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-shiny-gold rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>

          <div className="luxury-container relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-shiny-gold/10 text-shiny-gold rounded-full text-sm font-medium mb-4 bg-gold text-rose-950">
                {language === "ar" ? "العناية المستهدفة" : "Targeted Care"}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark-charcoal mb-6">
                {language === "ar"
                  ? "تسوقي حسب مشكلة البشرة"
                  : "Shop by Skin Concern"}
              </h1>
              <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
                {language === "ar"
                  ? "اكتشفي المنتجات المثالية التي تستهدف احتياجات بشرتك الخاصة"
                  : "Discover the perfect products that target your specific skin needs"}
              </p>
            </div>
          </div>
        </section>

        {/* Skin Concerns Grid */}
        <section className="py-12 luxury-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skinConcerns.map((concern) => {
              const IconComponent = concern.icon;
              const isActive = selectedConcern === concern.id;
              return (
                <button
                  key={concern.id}
                  onClick={() => {
                    if (!isActive) {
                      logSkinConcernClick(concern.id, concern.id);
                    }
                    setSelectedConcern(isActive ? null : concern.id);
                  }}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                    isActive
                      ? "ring-4 ring-shiny-gold shadow-xl scale-[1.02]"
                      : "hover:shadow-lg hover:scale-[1.01]"
                  }`}
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={concern.image}
                      alt={language === "ar" ? concern.nameAr : concern.nameEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${concern.color} to-black/60 transition-opacity duration-300`}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                      <div
                        className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 transition-transform duration-300 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                      >
                        <IconComponent className="w-7 h-7 text-rose-950 bg-transparent" />
                      </div>
                      <h3 className="font-display text-xl text-center mb-2 md:text-4xl text-rose-950 bg-transparent font-extrabold">
                        {language === "ar" ? concern.nameAr : concern.nameEn}
                      </h3>
                      <p className="font-body text-sm text-center line-clamp-2 text-rose-950">
                        {language === "ar"
                          ? concern.descriptionAr
                          : concern.descriptionEn}
                      </p>
                    </div>
                    {isActive && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-shiny-gold rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-black"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Filtered Products Section */}
        {selectedConcern && (
          <section className="py-12 bg-white">
            <div className="luxury-container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-dark-charcoal">
                    {language === "ar"
                      ? `منتجات ${activeConcern?.nameAr}`
                      : `${activeConcern?.nameEn} Products`}
                  </h2>
                  <p className="font-body text-gray-600 mt-2">
                    {language === "ar"
                      ? `${filteredProducts.length} منتج`
                      : `${filteredProducts.length} products found`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedConcern(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-dark-charcoal border border-gray-300 rounded-full hover:border-shiny-gold transition-colors"
                >
                  {language === "ar" ? "مسح الفلتر" : "Clear Filter"}
                </button>
              </div>

              {loading
                ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-shiny-gold" />
                  </div>
                )
                : filteredProducts.length > 0
                ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.node.id} product={product} />
                    ))}
                  </div>
                )
                : (
                  <div className="text-center py-16">
                    <p className="font-body text-gray-500 text-lg">
                      {language === "ar"
                        ? "لم يتم العثور على منتجات لهذه الفئة"
                        : "No products found for this concern"}
                    </p>
                    <Link
                      to="/collections/skin-care"
                      className="inline-block mt-4 px-6 py-3 bg-shiny-gold text-black font-medium rounded-full hover:bg-shiny-gold/90 transition-colors"
                    >
                      {language === "ar"
                        ? "تصفحي جميع منتجات العناية بالبشرة"
                        : "Browse All Skin Care"}
                    </Link>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* CTA Section */}
        {!selectedConcern && (
          <section className="py-16 bg-gradient-to-r from-dark-charcoal to-gray-800">
            <div className="luxury-container text-center">
              <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
                {language === "ar"
                  ? "لم تجدي ما تبحثين عنه؟"
                  : "Didn't find what you're looking for?"}
              </h2>
              <p className="font-body text-gray-300 mb-8 max-w-xl mx-auto">
                {language === "ar"
                  ? "تصفحي مجموعتنا الكاملة من منتجات العناية بالبشرة"
                  : "Browse our complete collection of skincare products"}
              </p>
              <Link
                to="/collections/skin-care"
                className="inline-block px-8 py-4 bg-shiny-gold text-black font-display tracking-wide rounded-full hover:bg-white transition-colors"
              >
                {language === "ar"
                  ? "تصفحي جميع المنتجات"
                  : "View All Products"}
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
