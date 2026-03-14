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

/** Luxury pricing display */
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

// ——— Product Card with Gold Stitch ———————————————
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
          handle: product.handle ?? "",
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
    toast.success(locale === "ar" ? "\u062A\u0645\u062A \u0627\u0644\u0625\u0636\u0627\u0641\u0629" : "Excellent choice", {
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
              {locale === "ar" ? "\u0625\u0636\u0627\u0641\u0629" : "Add"}
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
          {locale === "ar" ? "\u0623\u0636\u0641 \u0644\u0644\u0633\u0644\u0629" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
};

// ——— Asper Category Sidebar ———————————————————
const ASPER_CATEGORIES = [
  "All Curation",
  "Clinical Serums & Actives",
  "Daily Hydration & Barrier",
  "Cleansers & Toners",
  "Sun Protection (SPF)",
  "Evening Radiance & Glamour",
  "Targeted Treatments",
  "Hair Care",
  "Fragrance",
  "Body Care",
] as const;

const CategorySidebar = ({
  activeCategory,
  onSelect,
  categoryCounts,
}: {
  activeCategory: string;
  onSelect: (cat: string) => void;
  categoryCounts: Record<string, number>;
}) => (
  <div className="sticky top-24 space-y-1">
    <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
      Filter by Regimen
    </h3>
    {ASPER_CATEGORIES.map((cat) => {
      const isActive = activeCategory === cat;
      const count = cat === "All Curation" ? undefined : categoryCounts[cat];
      return (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            "w-full text-left px-3 py-2 text-sm font-body transition-all duration-300 border-l-2 flex items-center justify-between",
            isActive
              ? "border-accent text-foreground font-semibold pl-4"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-accent/40 hover:pl-4"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}
        >
          <span>{cat}</span>
          {count !== undefined && (
            <span className={cn("text-[10px] tabular-nums", isActive ? "text-accent" : "text-muted-foreground/60")}>
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

// ——— Concern Ambition Pills ———————————————————
const AMBITION_PILLS = [
  { id: "Concern_Acne", icon: "\u{1F48A}", labelEn: "Acne Care", labelAr: "\u0639\u0644\u0627\u062C \u062D\u0628 \u0627\u0644\u0634\u0628\u0627\u0628" },
  { id: "Concern_AntiAging", icon: "\u23F0", labelEn: "Anti-Aging", labelAr: "\u0645\u0643\u0627\u0641\u062D\u0629 \u0627\u0644\u0634\u064A\u062E\u0648\u062E\u0629" },
  { id: "Concern_Hydration", icon: "\u{1F4A7}", labelEn: "Hydration", labelAr: "\u062A\u0631\u0637\u064A\u0628" },
  { id: "Concern_Sensitivity", icon: "\u{1F33F}", labelEn: "Sensitive Skin", labelAr: "\u0628\u0634\u0631\u0629 \u062D\u0633\u0627\u0633\u0629" },
  { id: "Concern_Pigmentation", icon: "\u{1F31F}", labelEn: "Dark Spots", labelAr: "\u0627\u0644\u0628\u0642\u0639 \u0627\u0644\u062F\u0627\u0643\u0646\u0629" },
  { id: "Concern_SunProtection", icon: "\u2600\uFE0F", labelEn: "Sun Protection", labelAr: "\u062D\u0645\u0627\u064A\u0629 \u0645\u0646 \u0627\u0644\u0634\u0645\u0633" },
  { id: "Concern_Brightening", icon: "\u2728", labelEn: "Brightening", labelAr: "\u0625\u0634\u0631\u0627\u0642\u0629" },
  { id: "Concern_Dryness", icon: "\u{1F6E1}\uFE0F", labelEn: "Dryness", labelAr: "\u062C\u0641\u0627\u0641" },
];

// ——— Shop Page ————————————————————————————————
export default function Shop() {
  const { locale } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const concernParam = searchParams.get("concern") ?? "";

  // Active asper_category from URL or sidebar
  const categoryParam = searchParams.get("category") ?? "All Curation";
  const setActiveCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === "All Curation") {
      next.delete("category");
    } else {
      next.set("category", cat);
    }
    setSearchParams(next, { replace: true });
  };

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

  // Compute category counts for sidebar badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      const cat = (p as any).asper_category;
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by asper_category sidebar
      if (categoryParam && categoryParam !== "All Curation" && (product as any).asper_category !== categoryParam) return false;

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches = product.title.toLowerCase().includes(q) || product.brand?.toLowerCase().includes(q) || product.pharmacist_note?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.brands.length > 0 && (!product.brand || !filters.brands.includes(product.brand))) return false;
      
      // Unify Categories and Concerns
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

  // Empty state for search with Dr. Sami recommendation
  const renderEmptyState = () => (
    <div className="text-center py-20 bg-card rounded-xl border border-border">
      <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
      {filters.searchQuery ? (
        <>
          <p className="text-muted-foreground mb-2 font-body">
            {locale === "ar"
              ? `\u0644\u0645 \u0646\u062C\u062F \u0646\u062A\u0627\u0626\u062C \u0644\u0640 "${filters.searchQuery}"`
              : `We couldn't find matches for "${filters.searchQuery}"`}
          </p>
          <p className="text-sm text-muted-foreground/70 font-body mb-4">
            {locale === "ar"
              ? "\u064A\u0648\u0635\u064A \u062F. \u0633\u0627\u0645\u064A \u0628\u0627\u0633\u062A\u0643\u0634\u0627\u0641 \u0627\u0644\u0633\u064A\u0631\u0648\u0645\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629"
              : "Dr. Sami recommends exploring our Clinical Serums & Actives."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="border-accent text-accent hover:bg-accent/10"
              onClick={() => { setActiveCategory("Clinical Serums & Actives"); setFilters(f => ({ ...f, searchQuery: "" })); }}
            >
              Clinical Serums
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-muted"
              onClick={() => setFilters({ searchQuery: "", categories: [], subcategories: [], brands: [], skinConcerns: [], priceRange: [0, 200], onSaleOnly: false })}
            >
              {locale === "ar" ? "\u0645\u0633\u062D \u0627\u0644\u0641\u0644\u0627\u062A\u0631" : "Clear Filters"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-4 font-body">
            {locale === "ar" ? "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u0641\u0644\u0627\u062A\u0631" : "No products match your filters"}
          </p>
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent/10"
            onClick={() => {
              setActiveCategory("All Curation");
              setFilters({ searchQuery: "", categories: [], subcategories: [], brands: [], skinConcerns: [], priceRange: [0, 200], onSaleOnly: false });
            }}
          >
            {locale === "ar" ? "\u0645\u0633\u062D \u0627\u0644\u0641\u0644\u0627\u062A\u0631" : "Clear Filters"}
          </Button>
        </>
      )}
    </div>
  );

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
              {locale === "ar" ? "\u062A\u0633\u0648\u0642 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" : "Shop All Products"}
            </h1>
            <p className="text-primary-foreground/70 text-sm md:text-base font-body max-w-lg mx-auto">
              {locale === "ar" ? "\u0627\u0643\u062A\u0634\u0641 \u0623\u0641\u0636\u0644 \u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0639\u0646\u0627\u064A\u0629 \u0628\u0627\u0644\u0628\u0634\u0631\u0629 \u0648\u0627\u0644\u062C\u0645\u0627\u0644" : "Pharmacist-curated skincare and beauty, guaranteed authentic."}
            </p>
          </div>
        </div>

        {/* Ambition Pills */}
        <div className="bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4 max-w-7xl py-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body">
                {locale === "ar" ? "\u062A\u0633\u0648\u0651\u0642\u064A \u062D\u0633\u0628 \u0647\u062F\u0641\u0643" : "Shop by Concern"}
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
          <div className="lg:flex lg:gap-10">
            {/* Category Sidebar (desktop) */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <CategorySidebar
                activeCategory={categoryParam}
                onSelect={setActiveCategory}
                categoryCounts={categoryCounts}
              />
            </aside>

            {/* Main content area */}
            <div className="flex-1 min-w-0">
              {/* Mobile category pills — sticky, scroll-snap, 44px touch targets */}
              <div className="lg:hidden sticky top-16 z-30 bg-background -mx-4 px-4 py-3 border-b border-border/50">
                <div
                  className="flex gap-3 overflow-x-auto pb-1"
                  style={{
                    scrollSnapType: "x mandatory",
                    overscrollBehaviorX: "contain",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {ASPER_CATEGORIES.map((cat) => {
                    const isActive = categoryParam === cat;
                    const count = cat === "All Curation" ? undefined : categoryCounts[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "flex-shrink-0 min-h-[44px] px-5 rounded-full border text-sm font-body font-medium transition-all duration-300 flex items-center gap-1.5",
                          isActive
                            ? "bg-card text-primary border-accent shadow-sm"
                            : "bg-transparent text-muted-foreground border-border/40"
                        )}
                        style={{
                          scrollSnapAlign: "start",
                          transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
                        }}
                      >
                        <span className="whitespace-nowrap">{cat}</span>
                        {count !== undefined && (
                          <span className={cn("text-[10px] tabular-nums", isActive ? "text-accent" : "text-muted-foreground/50")}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground font-body">
                  {locale === "ar" ? `${filteredProducts.length} \u0645\u0646\u062A\u062C` : `${filteredProducts.length} products`}
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

              {!isLoading && filteredProducts.length === 0 && renderEmptyState()}

              {!isLoading && filteredProducts.length > 0 && (
                <div
                  key={categoryParam}
                  className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : "space-y-4"}
                >
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="staggered-reveal-card"
                      style={{ animationDelay: `${index * 0.06}s` }}
                    >
                      <ShopProductCard
                        product={product}
                        onQuickView={(p) => { setSelectedProduct(p); setIsQuickViewOpen(true); }}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ProductQuickView
        product={selectedProduct ? { ...selectedProduct, category: selectedProduct.primary_concern?.replace("Concern_","") ?? "General", description: selectedProduct.pharmacist_note } : null}
        isOpen={isQuickViewOpen}
        onClose={() => { setIsQuickViewOpen(false); setTimeout(() => setSelectedProduct(null), 300); }}
      />
    </div>
  );
}
