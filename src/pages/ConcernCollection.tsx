import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  fetchProducts,
  type ShopifyProduct,
} from "@/lib/shopify";
import {
  filterProductsByConcern,
  CONCERN_CONFIG,
  normalizeConcernSlug,
} from "@/lib/concernMapping";
import { Loader2 } from "lucide-react";

const CONCERN_LABELS: Record<
  string,
  { en: string; ar: string; color: string }
> = {
  acne: { en: "Acne & Blemishes", ar: "Ø­Ø¨ Ø§Ù„Ø´Ø¨Ø§Ø¨ ÙˆØ§Ù„Ø¨Ù‚Ø¹", color: "from-green-500/20 to-emerald-500/20" },
  "anti-aging": { en: "Anti-Aging", ar: "Ù…ÙƒØ§ÙØ­Ø© Ø§Ù„Ø´ÙŠØ®ÙˆØ®Ø©", color: "from-amber-500/20 to-orange-500/20" },
  hydration: { en: "Hydration", ar: "Ø§Ù„ØªØ±Ø·ÙŠØ¨", color: "from-cyan-500/20 to-blue-500/20" },
  dryness: { en: "Dryness", ar: "Ø§Ù„Ø¬ÙØ§Ù", color: "from-cyan-500/20 to-blue-500/20" },
  sensitivity: { en: "Sensitivity", ar: "Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø­Ø³Ø§Ø³Ø©", color: "from-pink-400/20 to-rose-400/20" },
  brightening: { en: "Brightening", ar: "Ø§Ù„ØªÙØªÙŠØ­ ÙˆØ§Ù„Ø¥Ø´Ø±Ø§Ù‚", color: "from-yellow-500/20 to-orange-400/20" },
  pigmentation: { en: "Pigmentation", ar: "ØªØµØ¨ØºØ§Øª Ø§Ù„Ø¨Ø´Ø±Ø©", color: "from-yellow-500/20 to-orange-400/20" },
  "hair-loss": { en: "Hair Loss", ar: "ØªØ³Ø§Ù‚Ø· Ø§Ù„Ø´Ø¹Ø±", color: "from-purple-400/20 to-violet-400/20" },
  hair: { en: "Hair Care", ar: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±", color: "from-purple-400/20 to-violet-400/20" },
};

export default function ConcernCollection() {
  const { concernSlug } = useParams<{ concernSlug: string }>();
  const { language, isRTL } = useLanguage();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const normalized = concernSlug ? normalizeConcernSlug(concernSlug) : null;
  const config = normalized ? CONCERN_CONFIG[normalized] : null;
  const labels = normalized ? CONCERN_LABELS[normalized] : null;
  const title = labels
    ? language === "ar"
      ? labels.ar
      : labels.en
    : concernSlug || "";
  const colorClass = labels?.color ?? "from-shiny-gold/20 to-rose-500/20";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const all = await fetchProducts(100);
        if (normalized) {
          const normalized_products = (all as ShopifyProduct[]).map(p => ({
            ...p,
            node: { ...p.node, tags: Array.isArray(p.node.tags) ? p.node.tags : p.node.tags ? [p.node.tags] : [] }
          }));
          const filtered = filterProductsByConcern(normalized_products, normalized) as unknown as ShopifyProduct[];
          setProducts(filtered);
        } else {
          setProducts(all);
        }
      } catch (e) {
        console.error("Error loading products:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [normalized]);

  if (!concernSlug) {
    return (
      <div className="min-h-screen bg-soft-ivory" dir={isRTL ? "rtl" : "ltr"}>
        <Header />
        <main className="pt-32 pb-20 luxury-container text-center">
          <h1 className="font-display text-2xl text-dark-charcoal">
            {language === "ar" ? "Ø§Ù„Ø±Ø§Ø¨Ø· ØºÙŠØ± ØµØ§Ù„Ø­" : "Invalid link"}
          </h1>
          <Link
            to="/skin-concerns"
            className="mt-4 inline-block text-shiny-gold hover:underline"
          >
            {language === "ar" ? "Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¨Ø´Ø±Ø©" : "Back to Skin Concerns"}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!config && !loading) {
    return (
      <div className="min-h-screen bg-soft-ivory" dir={isRTL ? "rtl" : "ltr"}>
        <Header />
        <main className="pt-32 pb-20 luxury-container text-center">
          <h1 className="font-display text-2xl text-dark-charcoal">
            {language === "ar" ? "Ø§Ù„Ù…Ø´ÙƒÙ„Ø© ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙØ©" : "Unknown concern"}
          </h1>
          <Link
            to="/skin-concerns"
            className="mt-4 inline-block text-shiny-gold hover:underline"
          >
            {language === "ar" ? "Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¨Ø´Ø±Ø©" : "Back to Skin Concerns"}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-ivory" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      <main className="pt-32 lg:pt-40 pb-20">
        <section
          className={`relative py-12 bg-gradient-to-b ${colorClass} to-soft-ivory overflow-hidden`}
        >
          <div className="luxury-container relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-shiny-gold/10 text-shiny-gold rounded-full text-sm font-medium mb-4">
                {language === "ar" ? "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ù…Ø³ØªÙ‡Ø¯ÙØ©" : "Targeted Care"}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-dark-charcoal mb-4">
                {title}
              </h1>
              <Link
                to="/skin-concerns"
                className="text-shiny-gold hover:underline font-medium"
              >
                {language === "ar" ? "â† Ø¬Ù…ÙŠØ¹ Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¨Ø´Ø±Ø©" : "â† All Skin Concerns"}
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 luxury-container">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-shiny-gold" />
            </div>
          ) : products.length > 0 ? (
            <>
              <p className="font-body text-gray-600 mb-8">
                {language === "ar"
                  ? `${products.length} Ù…Ù†ØªØ¬`
                  : `${products.length} products`}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.node.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-gray-500 text-lg">
                {language === "ar"
                  ? "Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù…Ù†ØªØ¬Ø§Øª"
                  : "No products found for this concern"}
              </p>
              <Link
                to="/skin-concerns"
                className="inline-block mt-4 px-6 py-3 bg-shiny-gold text-black font-medium rounded-full hover:bg-shiny-gold/90 transition-colors"
              >
                {language === "ar" ? "ØªØµÙØ­ÙŠ Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ø¨Ø´Ø±Ø©" : "Browse Skin Concerns"}
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
