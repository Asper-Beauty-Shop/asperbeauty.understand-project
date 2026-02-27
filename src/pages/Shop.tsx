import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Grid3X3,
  LayoutList,
  Loader2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductQuickView } from "@/components/ProductQuickView";
import { ProductSearchFilters, type FilterState } from "@/components/ProductSearchFilters";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const formatJOD = (n: number | null) => `${(n ?? 0).toFixed(2)} JOD`;

// Product Card
const ShopProductCard = ({ product, onQuickView, viewMode }: { product: Product; onQuickView: (p: Product) => void; viewMode: "grid" | "list" }) => {
  const { locale } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const imageUrl = product.image_url || "/placeholder.svg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      product: {
        node: {
          id: product.id,
          title: product.title,
          description: product.pharmacist_note || "",
          handle: product.handle,
          vendor: product.brand || "",
          productType: product.primary_concern || "",
          priceRange: { minVariantPrice: { amount: String(product.price ?? 0), currencyCode: "JOD" } },
          images: { edges: [{ node: { url: imageUrl, altText: product.title } }] },
          variants: { edges: [{ node: { id: product.id, title: "Default", price: { amount: String(product.price ?? 0), currencyCode: "JOD" }, availableForSale: true, selectedOptions: [] } }] },
          options: [],
        },
      },
      variantId: product.id,
      variantTitle: "Default",
      price: { amount: String(product.price ?? 0), currencyCode: "JOD" },
      quantity: 1,
      selectedOptions: [],
    });
    toast.success(locale === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart", { description: product.title, position: "top-center" });
  };

  if (viewMode === "list") {
    return (
      <article className="group bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex" onClick={() => onQuickView(product)}>
        <div className="relative w-40 md:w-48 flex-shrink-0 bg-muted/30">
          <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 p-4 flex flex-col">
          {product.brand && <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{product.brand}</p>}
          <h3 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow">{product.pharmacist_note}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-base font-bold text-foreground">{formatJOD(product.price)}</span>
            <Button onClick={handleAddToCart} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              <ShoppingBag className="w-4 h-4 me-1" />
              {locale === "ar" ? "إضافة" : "Add"}
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 cursor-pointer flex flex-col animate-fade-in" onClick={() => onQuickView(product)}>
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {product.clinical_badge && (
          <div className="absolute top-2 left-2 z-10 bg-accent/90 text-accent-foreground px-2 py-1 rounded text-[10px] font-semibold">
            {product.clinical_badge}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        {product.brand && <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-medium">{product.brand}</p>}
        <h3 className="text-sm font-medium text-foreground leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors flex-grow">{product.title}</h3>
        {product.key_ingredients && product.key_ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.key_ingredients.slice(0, 2).map((ing) => (
              <span key={ing} className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-[10px] text-foreground/70 font-medium">{ing}</span>
            ))}
          </div>
        )}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-foreground">{formatJOD(product.price)}</span>
          </div>
          <Button onClick={handleAddToCart} size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wide py-2.5">
            <ShoppingBag className="w-4 h-4 me-2" />
            {locale === "ar" ? "أضف للسلة" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
};

const AMBITION_PILLS = [
  { id: "Concern_Acne", icon: "💊", labelEn: "Acne Care", labelAr: "علاج حب الشباب" },
  { id: "Concern_AntiAging", icon: "⏰", labelEn: "Anti-Aging", labelAr: "مكافحة الشيخوخة" },
  { id: "Concern_Hydration", icon: "💧", labelEn: "Hydration", labelAr: "ترطيب" },
  { id: "Concern_Sensitivity", icon: "🌿", labelEn: "Sensitive Skin", labelAr: "بشرة حساسة" },
  { id: "Concern_Pigmentation", icon: "🌟", labelEn: "Dark Spots", labelAr: "البقع الداكنة" },
  { id: "Concern_SunProtection", icon: "☀️", labelEn: "Sun Protection", labelAr: "حماية من الشمس" },
  { id: "Concern_Brightening", icon: "✨", labelEn: "Brightening", labelAr: "إشراقة" },
  { id: "Concern_Dryness", icon: "🛡️", labelEn: "Dryness", labelAr: "جفاف" },
];

export default function Shop() {
  const { locale } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams] = useSearchParams();
  const concernParam = searchParams.get("concern") ?? "";

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    categories: [],
    subcategories: [],
    brands: [],
    skinConcerns: concernParam ? [concernParam] : [],
    priceRange: [0, 200],
    onSaleOnly: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches = product.title.toLowerCase().includes(q) || product.brand?.toLowerCase().includes(q) || product.pharmacist_note?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.brands.length > 0 && (!product.brand || !filters.brands.includes(product.brand))) return false;
      if (filters.skinConcerns.length > 0 && !filters.skinConcerns.includes(product.primary_concern)) return false;
      const price = product.price ?? 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      return true;
    });
  }, [products, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        {/* Hero */}
        <div className="bg-primary text-primary-foreground py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h1 className="text-2xl md:text-4xl font-serif font-semibold mb-2">
              {locale === "ar" ? "تسوق جميع المنتجات" : "Shop All Products"}
            </h1>
            <p className="text-primary-foreground/70 text-sm md:text-base">
              {locale === "ar" ? "اكتشف أفضل منتجات العناية بالبشرة والجمال" : "Discover premium skincare and beauty products"}
            </p>
          </div>
        </div>

        {/* Ambition Pills */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 max-w-7xl py-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {locale === "ar" ? "تسوّقي حسب هدفك" : "Shop by Concern"}
              </span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {AMBITION_PILLS.map((pill) => {
                const isActive = filters.skinConcerns.includes(pill.id);
                return (
                  <button
                    key={pill.id}
                    onClick={() => {
                      const updated = isActive ? filters.skinConcerns.filter((c) => c !== pill.id) : [...filters.skinConcerns, pill.id];
                      setFilters({ ...filters, skinConcerns: updated });
                    }}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 ${
                      isActive ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card text-foreground/70 border-border hover:border-accent hover:text-foreground"
                    }`}
                  >
                    <span role="img" aria-hidden="true">{pill.icon}</span>
                    <span>{locale === "ar" ? pill.labelAr : pill.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="lg:flex lg:gap-8">
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <ProductSearchFilters filters={filters} onFilterChange={setFilters} products={filteredProducts} />
            </aside>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {locale === "ar" ? `${filteredProducts.length} منتج` : `${filteredProducts.length} products`}
                </p>
                <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              )}

              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground mb-4">
                    {locale === "ar" ? "لا توجد منتجات مطابقة للفلاتر" : "No products match your filters"}
                  </p>
                  <Button variant="outline" onClick={() => setFilters({ searchQuery: "", categories: [], subcategories: [], brands: [], skinConcerns: [], priceRange: [0, 200], onSaleOnly: false })}>
                    {locale === "ar" ? "مسح الفلاتر" : "Clear Filters"}
                  </Button>
                </div>
              )}

              {!isLoading && filteredProducts.length > 0 && (
                <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : "space-y-4"}>
                  {filteredProducts.map((product) => (
                    <ShopProductCard key={product.id} product={product} onQuickView={(p) => { setSelectedProduct(p); setIsQuickViewOpen(true); }} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ProductQuickView
        product={selectedProduct ? { id: selectedProduct.id, title: selectedProduct.title, price: selectedProduct.price ?? 0, description: selectedProduct.pharmacist_note, image_url: selectedProduct.image_url, brand: selectedProduct.brand } : null}
        open={isQuickViewOpen}
        onOpenChange={(open) => { setIsQuickViewOpen(open); if (!open) setTimeout(() => setSelectedProduct(null), 300); }}
      />
    </div>
  );
}
