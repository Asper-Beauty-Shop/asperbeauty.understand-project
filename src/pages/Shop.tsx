import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Grid3X3,
  LayoutList,
  Loader2,
  ShoppingBag,
  Sparkles,
  Shield,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductQuickView } from "@/components/ProductQuickView";
import { ProductSearchFilters, type FilterState } from "@/components/ProductSearchFilters";
import { cn } from "@/lib/utils";
import { mapCategoryToConcerns } from "@/lib/categoryHierarchy";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

/** Luxury pricing display â€” currency small & top-aligned, integer large in maroon, decimals small */
const LuxuryPrice = ({ amount, currency = "JOD" }: { amount: number | null; currency?: string }) => {
  const val = (amount ?? 0).toFixed(2);
  const [integer, decimal] = val.split(".");
  return (
    <span className="font-body text-foreground">
      <span className="text-[10px] align-top font-medium text-muted-foreground">{currency}</span>
      <span className="text-lg font-semibold text-primary mx-0.5">{integer}</span>
      <span className="text-[10px] align-top font-medium text-muted-foreground">.{decimal}</span>
    </span>
  );
};

// â”€â”€â”€ Product Card with Gold Stitch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ShopProductCard = ({
  product,
  onQuickView,
  viewMode,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
  viewMode: "grid" | "list";
}) => {
  const { locale } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const imageUrl = product.image_url || "/editorial-showcase-2.jpg";

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
    toast.success(locale === "ar" ? "ØªÙ…Øª Ø§Ù„Ø¥Ø¶Ø§ÙØ©" : "Excellent choice", {
      description: product.title,
      position: "top-center",
    });
  };

  if (viewMode === "list") {
    return (
      <article
        className="group bg-card rounded-lg overflow-hidden border border-border/50 hover:border-accent/40 shadow-maroon-glow hover:shadow-maroon-deep transition-all duration-300 cursor-pointer flex product-card-hover"
        onClick={() => onQuickView(product)}
      >
        <div className="relative w-40 md:w-48 flex-shrink-0 bg-background">
          <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 p-4 flex flex-col">
          {product.brand && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent mb-1">{product.brand}</p>
          )}
          <h3 className="font-heading text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.pharmacist_note && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow font-body italic">
              {product.pharmacist_note}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <LuxuryPrice amount={product.price} />
            <Button onClick={handleAddToCart} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs btn-ripple">
              <ShoppingBag className="w-3.5 h-3.5 me-1" />
              {locale === "ar" ? "Ø¥Ø¶Ø§ÙØ©" : "Add"}
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="group relative bg-card rounded-lg overflow-hidden border border-border/50 hover:border-accent/40 shadow-maroon-glow hover:shadow-maroon-deep transition-all duration-500 cursor-pointer flex flex-col product-card-hover animate-fade-in"
      onClick={() => onQuickView(product)}
    >
      {/* Gold Stitch animated border corners */}
      <div className="absolute inset-0 rounded-lg border-2 border-accent/0 group-hover:border-accent/50 transition-all duration-700 pointer-events-none z-10">
        <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
        <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-background flex items-center justify-center p-4">
        {imageUrl && imageUrl !== "/editorial-showcase-2.jpg" ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Package className="h-16 w-16 text-muted-foreground/30" />
        )}
        {product.clinical_badge && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
            <Shield className="h-3 w-3 text-primary" />
            {product.clinical_badge}
          </span>
        )}
        {/* Authenticity star */}
        <div className="absolute top-3 right-3 z-10 h-6 w-6 flex items-center justify-center border border-accent bg-card/80 backdrop-blur-sm rounded-sm p-0.5" title="Guaranteed Authenticity">
          <svg viewBox="0 0 24 24" fill="none" className="text-accent h-full w-full">
            <path d="M12 2L14.5 7.5L20 9L15.5 13L17 18.5L12 15.5L7 18.5L8.5 13L4 9L9.5 7.5L12 2Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow space-y-2">
        {product.brand && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">{product.brand}</p>
        )}
        <h3 className="font-heading text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors flex-grow">
          {product.title}
        </h3>

        {/* Key Ingredients */}
        {product.key_ingredients && product.key_ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.key_ingredients.slice(0, 2).map((ing) => (
              <span key={ing} className="px-2 py-0.5 rounded-full bg-secondary border border-border/50 text-[10px] text-muted-foreground font-medium">
                {ing}
              </span>
            ))}
          </div>
        )}

        {/* Price + Type */}
        <div className="flex items-center justify-between pt-1">
          <LuxuryPrice amount={product.price} />
          {product.primary_concern && (
            <Badge variant="secondary" className="text-[10px]">
              {product.primary_concern.replace("Concern_", "")}
            </Badge>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wide btn-ripple"
        >
          <ShoppingBag className="w-3.5 h-3.5 me-1.5" />
          {locale === "ar" ? "Ø£Ø¶Ù Ù„Ù„Ø³Ù„Ø©" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
};

// â”€â”€â”€ Concern Ambition Pills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AMBITION_PILLS = [
  { id: "Concern_Acne", icon: "ðŸ’Š", labelEn: "Acne Care", labelAr: "Ø¹Ù„Ø§Ø¬ Ø­Ø¨ Ø§Ù„Ø´Ø¨Ø§Ø¨" },
  { id: "Concern_AntiAging", icon: "â°", labelEn: "Anti-Aging", labelAr: "Ù…ÙƒØ§ÙØ­Ø© Ø§Ù„Ø´ÙŠØ®ÙˆØ®Ø©" },
  { id: "Concern_Hydration", icon: "ðŸ’§", labelEn: "Hydration", labelAr: "ØªØ±Ø·ÙŠØ¨" },
  { id: "Concern_Sensitivity", icon: "ðŸŒ¿", labelEn: "Sensitive Skin", labelAr: "Ø¨Ø´Ø±Ø© Ø­Ø³Ø§Ø³Ø©" },
  { id: "Concern_Pigmentation", icon: "ðŸŒŸ", labelEn: "Dark Spots", labelAr: "Ø§Ù„Ø¨Ù‚Ø¹ Ø§Ù„Ø¯Ø§ÙƒÙ†Ø©" },
  { id: "Concern_SunProtection", icon: "â˜€ï¸", labelEn: "Sun Protection", labelAr: "Ø­Ù…Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø´Ù…Ø³" },
  { id: "Concern_Brightening", icon: "âœ¨", labelEn: "Brightening", labelAr: "Ø¥Ø´Ø±Ø§Ù‚Ø©" },
  { id: "Concern_Dryness", icon: "ðŸ›¡ï¸", labelEn: "Dryness", labelAr: "Ø¬ÙØ§Ù" },
];

// â”€â”€â”€ Shop Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
          .neq("availability_status", "Pending_Purge")
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

  // Support ?category= URL param for asper_category filtering
  const categoryParam = searchParams.get("category");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by asper_category URL param
      if (categoryParam && (product as any).asper_category !== categoryParam) return false;

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches = product.title.toLowerCase().includes(q) || product.brand?.toLowerCase().includes(q) || product.pharmacist_note?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.brands.length > 0 && (!product.brand || !filters.brands.includes(product.brand))) return false;
      
      // Unify Categories and Concerns: Map global categories to their medical concern tags
      const activeConcerns = [...filters.skinConcerns];
      filters.categories.forEach(catId => {
        activeConcerns.push(...mapCategoryToConcerns(catId));
      });

      if (activeConcerns.length > 0 && (!product.primary_concern || !activeConcerns.includes(product.primary_concern))) return false;
      const price = product.price ?? 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      return true;
    });
  }, [products, filters, categoryParam]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Banner */}
        <div className="bg-primary text-primary-foreground py-10 md:py-14">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <Badge variant="outline" className="mb-3 border-accent/40 text-accent font-body text-xs tracking-[0.2em] px-4 py-1">
              CURATED CATALOG
            </Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
              {locale === "ar" ? "ØªØ³ÙˆÙ‚ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª" : "Shop All Products"}
            </h1>
            <p className="text-primary-foreground/70 text-sm md:text-base font-body max-w-lg mx-auto">
              {locale === "ar" ? "Ø§ÙƒØªØ´Ù Ø£ÙØ¶Ù„ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ§Ù„Ø¬Ù…Ø§Ù„" : "Pharmacist-curated skincare and beauty, guaranteed authentic."}
            </p>
          </div>
        </div>

        {/* Ambition Pills */}
        <div className="bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4 max-w-7xl py-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body">
                {locale === "ar" ? "ØªØ³ÙˆÙ‘Ù‚ÙŠ Ø­Ø³Ø¨ Ù‡Ø¯ÙÙƒ" : "Shop by Concern"}
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
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 font-body",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-maroon-glow"
                        : "bg-card text-foreground/70 border-border hover:border-accent hover:text-foreground"
                    )}
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
              <ProductSearchFilters filters={filters} onFiltersChange={setFilters} productCount={filteredProducts.length} />
            </aside>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground font-body">
                  {locale === "ar" ? `${filteredProducts.length} Ù…Ù†ØªØ¬` : `${filteredProducts.length} products`}
                </p>
                <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded transition-colors",
                      viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded transition-colors",
                      viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
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
                  <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4 font-body">
                    {locale === "ar" ? "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù†ØªØ¬Ø§Øª Ù…Ø·Ø§Ø¨Ù‚Ø© Ù„Ù„ÙÙ„Ø§ØªØ±" : "No products match your filters"}
                  </p>
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent/10" onClick={() => setFilters({ searchQuery: "", categories: [], subcategories: [], brands: [], skinConcerns: [], priceRange: [0, 200], onSaleOnly: false })}>
                    {locale === "ar" ? "Ù…Ø³Ø­ Ø§Ù„ÙÙ„Ø§ØªØ±" : "Clear Filters"}
                  </Button>
                </div>
              )}

              {!isLoading && filteredProducts.length > 0 && (
                <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : "space-y-4"}>
                  {filteredProducts.map((product) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => { setSelectedProduct(p); setIsQuickViewOpen(true); }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ProductQuickView
        product={selectedProduct ? { id: selectedProduct.id, title: selectedProduct.title, price: selectedProduct.price ?? 0, description: selectedProduct.pharmacist_note, category: selectedProduct.primary_concern?.replace("Concern_","") ?? "General", image_url: selectedProduct.image_url, brand: selectedProduct.brand, volume_ml: null, is_on_sale: null, original_price: null, discount_percent: null, created_at: selectedProduct.created_at, updated_at: selectedProduct.updated_at } : null}
        isOpen={isQuickViewOpen}
        onClose={() => { setIsQuickViewOpen(false); setTimeout(() => setSelectedProduct(null), 300); }}
      />
    </div>
  );
}
