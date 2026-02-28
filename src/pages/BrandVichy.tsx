import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, FlaskConical, Leaf, Sparkles } from "lucide-react";
import vichyHeroImage from "@/assets/brands/vichy-hero.jpg";

// Product range definitions
const PRODUCT_RANGES = [
  {
    id: "all",
    name: "All Products",
    nameAr: "جميع المنتجات",
    icon: Sparkles,
    color: "bg-primary",
  },
  {
    id: "mineral-89",
    name: "Mineral 89",
    nameAr: "مينرال 89",
    icon: Droplets,
    color: "bg-cyan-500",
    keywords: ["mineral 89", "mineral89", "m89"],
  },
  {
    id: "liftactiv",
    name: "Liftactiv",
    nameAr: "ليفت أكتيف",
    icon: Sparkles,
    color: "bg-amber-500",
    keywords: [
      "liftactiv",
      "lift activ",
      "collagen",
      "retinol",
      "vitamin c",
      "h.a.",
    ],
  },
  {
    id: "normaderm",
    name: "Normaderm",
    nameAr: "نورماديرم",
    icon: Leaf,
    color: "bg-emerald-500",
    keywords: ["normaderm", "phytosolution", "purifying"],
  },
  {
    id: "purete-thermale",
    name: "Pureté Thermale",
    nameAr: "بيوريتيه ثيرمال",
    icon: FlaskConical,
    color: "bg-sky-400",
    keywords: ["purete", "pureté", "thermale", "cleansing gel", "foam"],
  },
];

export default function BrandVichy() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRange, setActiveRange] = useState("all");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch all Vichy products
        const allProducts = await fetchProducts(50, "vendor:Vichy");
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching Vichy products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products by selected range
  const filteredProducts = useMemo(() => {
    if (activeRange === "all") return products;

    const range = PRODUCT_RANGES.find((r) => r.id === activeRange);
    if (!range || !range.keywords) return products;

    return products.filter((product) => {
      const title = product.node.title.toLowerCase();
      const tags = (product.node as { tags?: string }).tags?.toLowerCase() || "";
      return range.keywords!.some((keyword) =>
        title.includes(keyword.toLowerCase()) ||
        tags.includes(keyword.toLowerCase())
      );
    });
  }, [products, activeRange]);

  // Count products per range
  const rangeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };

    PRODUCT_RANGES.forEach((range) => {
      if (range.id === "all") return;
      counts[range.id] = products.filter((product) => {
        const title = product.node.title.toLowerCase();
        return range.keywords!.some((keyword) =>
          title.includes(keyword.toLowerCase())
        );
      }).length;
    });

    return counts;
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${vichyHeroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="luxury-container">
              <div className="max-w-2xl">
                <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  {isAr ? "علامة تجارية فرنسية مميزة" : "Premium French Brand"}
                </Badge>

                <h1 className="font-display text-5xl md:text-7xl text-cream mb-4">
                  VICHY
                </h1>

                <p className="font-body text-cream/80 text-lg md:text-xl mb-6 leading-relaxed">
                  {isAr
                    ? "اكتشفي قوة مياه فيشي البركانية المعدنية. للبشرة أكثر صحة وإشراقاً مع أكثر من 90 عاماً من الخبرة في العناية بالبشرة."
                    : "Discover the power of Vichy Volcanic Mineralizing Water. For healthier, more radiant skin with over 90 years of skincare expertise."}
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span className="text-cream/80 text-sm">
                      {isAr ? "مياه بركانية معدنية" : "Volcanic Mineral Water"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <FlaskConical className="w-4 h-4 text-cyan-400" />
                    <span className="text-cream/80 text-sm">
                      {isAr ? "مختبر طبياً" : "Dermatologist Tested"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Range Filter */}
        <section className="py-8 border-b border-gold/10 bg-secondary/30 sticky top-24 z-30 backdrop-blur-sm">
          <div className="luxury-container">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {PRODUCT_RANGES.map((range) => {
                const Icon = range.icon;
                const isActive = activeRange === range.id;
                const count = rangeCounts[range.id] || 0;

                return (
                  <Button
                    key={range.id}
                    variant={isActive ? "default" : "outline"}
                    className={`
                      flex-shrink-0 gap-2 transition-all duration-300
                      ${
                      isActive
                        ? "bg-gold text-background hover:bg-gold/90"
                        : "border-gold/30 text-cream hover:bg-gold/10 hover:border-gold/50"
                    }
                    `}
                    onClick={() => setActiveRange(range.id)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{isAr ? range.nameAr : range.name}</span>
                    <Badge
                      variant="secondary"
                      className={`
                        ml-1 text-xs
                        ${
                        isActive
                          ? "bg-background/20 text-background"
                          : "bg-gold/10 text-gold"
                      }
                      `}
                    >
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="luxury-container">
            {/* Active Range Info */}
            {activeRange !== "all" && (
              <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20">
                <h2 className="font-display text-2xl text-cream mb-2">
                  {isAr
                    ? PRODUCT_RANGES.find((r) => r.id === activeRange)?.nameAr
                    : PRODUCT_RANGES.find((r) => r.id === activeRange)?.name}
                </h2>
                <p className="text-cream/60">
                  {activeRange === "mineral-89" && (isAr
                    ? "تقوية وترطيب البشرة مع 89% من مياه فيشي المعدنية البركانية وحمض الهيالورونيك."
                    : "Skin strengthening hydration with 89% Vichy Volcanic Mineralizing Water and Hyaluronic Acid.")}
                  {activeRange === "liftactiv" && (isAr
                    ? "مجموعة متقدمة لمكافحة الشيخوخة مع الريتينول والكولاجين وفيتامين سي."
                    : "Advanced anti-aging range featuring Retinol, Collagen, and Vitamin C formulations.")}
                  {activeRange === "normaderm" && (isAr
                    ? "حلول للبشرة الدهنية والمعرضة لحب الشباب مع حمض الساليسيليك والزنك."
                    : "Solutions for oily and acne-prone skin with Salicylic Acid and Zinc.")}
                  {activeRange === "purete-thermale" && (isAr
                    ? "منظفات لطيفة مناسبة لجميع أنواع البشرة بما في ذلك البشرة الحساسة."
                    : "Gentle cleansers suitable for all skin types including sensitive skin.")}
                </p>
              </div>
            )}

            {isLoading
              ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-square rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              )
              : filteredProducts.length === 0
              ? (
                <div className="text-center py-20">
                  <Droplets className="w-16 h-16 text-cream/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl text-cream mb-2">
                    {isAr ? "لا توجد منتجات" : "No Products Found"}
                  </h3>
                  <p className="text-cream/60">
                    {isAr
                      ? "لا توجد منتجات في هذه المجموعة حالياً."
                      : "No products available in this range currently."}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-gold/30 text-cream"
                    onClick={() => setActiveRange("all")}
                  >
                    {isAr ? "عرض جميع المنتجات" : "View All Products"}
                  </Button>
                </div>
              )
              : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-cream/60">
                      {isAr
                        ? `عرض ${filteredProducts.length} منتج`
                        : `Showing ${filteredProducts.length} product${
                          filteredProducts.length !== 1 ? "s" : ""
                        }`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.node.id} product={product} />
                    ))}
                  </div>
                </>
              )}
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
          <div className="luxury-container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                  {isAr ? "قصة العلامة التجارية" : "Brand Story"}
                </Badge>
                <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
                  {isAr
                    ? (
                      <>
                        أكثر من <span className="text-gold">90 عاماً</span>{" "}
                        من الابتكار
                      </>
                    )
                    : (
                      <>
                        Over <span className="text-gold">90 Years</span>{" "}
                        of Innovation
                      </>
                    )}
                </h2>
                <p className="text-cream/70 leading-relaxed mb-6">
                  {isAr
                    ? "تأسست فيشي في عام 1931 في قلب فرنسا، وتستمد قوتها من مياه فيشي البركانية الفريدة. تجمع منتجاتنا بين العلم والطبيعة لتقديم حلول فعالة لجميع أنواع البشرة."
                    : "Founded in 1931 in the heart of France, Vichy draws its strength from the unique Vichy Volcanic Water. Our products combine science and nature to deliver effective solutions for all skin types."}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="font-display text-2xl text-gold mb-1">
                      15
                    </div>
                    <div className="text-cream/60 text-sm">
                      {isAr ? "معدن" : "Minerals"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="font-display text-2xl text-gold mb-1">
                      90+
                    </div>
                    <div className="text-cream/60 text-sm">
                      {isAr ? "سنة" : "Years"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="font-display text-2xl text-gold mb-1">
                      100%
                    </div>
                    <div className="text-cream/60 text-sm">
                      {isAr ? "مختبر" : "Tested"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-cyan-700/20 flex items-center justify-center">
                  <Droplets className="w-32 h-32 text-cyan-400/50" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/20 rounded-xl flex items-center justify-center">
                  <FlaskConical className="w-10 h-10 text-gold" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
