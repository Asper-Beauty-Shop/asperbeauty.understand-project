import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { CountdownBanner } from "@/components/offers/CountdownBanner";
import { SaleSignupForm } from "@/components/offers/SaleSignupForm";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Loader2,
  Package,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Tag,
  Timer,
  Zap,
} from "lucide-react";
import { ProductQuickView } from "@/components/ProductQuickView";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

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

const SaleProductCard = ({ product, onQuickView, isFlashDeal }: { product: Product; onQuickView: (p: Product) => void; isFlashDeal?: boolean }) => {
  const { locale } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const imageUrl = product.image_url || "/editorial-showcase-2.webp";
  const discountPct = product.discount_percent ?? (product.original_price
    ? Math.round((1 - (product.price ?? 0) / product.original_price) * 100)
    : 0);

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
    toast.success(locale === "ar" ? "تمت الإضافة" : "Added to cart", {
      description: product.title,
      position: "top-center",
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-card rounded-lg overflow-hidden border border-border/50 hover:border-accent/40 shadow-maroon-glow hover:shadow-maroon-deep transition-all duration-500 cursor-pointer flex flex-col product-card-hover"
      onClick={() => onQuickView(product)}
    >
      {/* Gold Stitch corners */}
      <div className="absolute inset-0 rounded-lg border-2 border-accent/0 group-hover:border-accent/50 transition-all duration-700 pointer-events-none z-10">
        <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
        <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-lg shadow-accent/40" />
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-background flex items-center justify-center p-4">
        {imageUrl && imageUrl !== "/editorial-showcase-2.webp" ? (
          <img src={imageUrl} alt={product.title} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <Package className="h-16 w-16 text-muted-foreground/30" />
        )}
        {/* Flash Deal badge */}
        {isFlashDeal && (
          <span className="absolute top-3 right-14 z-20 flex items-center gap-1 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold text-destructive-foreground shadow-md animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
            <Zap className="w-3 h-3" />
            Flash Deal
          </span>
        )}
        {/* Sale badge */}
        {discountPct > 0 && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-polished-gold text-[10px] font-bold px-2.5 py-1 text-dark-charcoal shadow-sm">
            -{discountPct}%
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

        {/* Price */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <LuxuryPrice amount={product.price} />
            {product.original_price && (
              <span className="text-xs line-through text-muted-foreground font-body">
                {product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          {discountPct > 0 && (
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">
              Save {discountPct}%
            </Badge>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wide btn-ripple"
        >
          <ShoppingBag className="w-3.5 h-3.5 me-1.5" />
          {locale === "ar" ? "أضف للسلة" : "Add to Cart"}
        </Button>
      </div>
    </motion.article>
  );
};

export default function Offers() {
  const { language, locale } = useLanguage();
  const isAr = language === "ar";
  const { data: allProducts, isLoading } = useProducts(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"discount" | "price-asc" | "price-desc">("discount");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  usePageMeta({
    title: isAr ? "العروض والتخفيضات | أسبر بيوتي" : "Offers & Deals | Asper Beauty",
    description: isAr
      ? "اكتشفي أحدث عروض وتخفيضات أسبر بيوتي على منتجات العناية بالبشرة والجمال."
      : "Explore the latest deals and discounts on premium skincare and beauty products at Asper Beauty.",
    canonical: "/offers",
  });

  const saleProducts = useMemo(() => {
    if (!allProducts) return [];
    let filtered = allProducts.filter((p) => p.is_on_sale);

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "discount") {
      filtered.sort((a, b) => (b.discount_percent ?? 0) - (a.discount_percent ?? 0));
    } else if (sortBy === "price-asc") {
      filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else {
      filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return filtered;
  }, [allProducts, search, sortBy]);

  const totalSavings = useMemo(() => {
    return saleProducts.reduce((acc, p) => {
      if (p.original_price && p.price) return acc + (p.original_price - p.price);
      return acc;
    }, 0);
  }, [saleProducts]);

  const flashDealIds = useMemo(() => {
    const sorted = [...saleProducts].sort((a, b) => (b.discount_percent ?? 0) - (a.discount_percent ?? 0));
    return new Set(sorted.slice(0, 3).map((p) => p.id));
  }, [saleProducts]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-burgundy-dark pt-32 pb-16 md:pt-40 md:pb-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full" />
        </div>

        <div className="luxury-container relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-4"
            >
              <Tag className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs uppercase tracking-[0.25em] font-body font-semibold">
                {isAr ? "عروض حصرية" : "Exclusive Deals"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl text-primary-foreground mb-4 leading-tight"
            >
              {isAr ? (
                <>عروض <span className="text-accent">خاصة</span></>
              ) : (
                <>Special <span className="text-accent">Offers</span></>
              )}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mb-6"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-body text-primary-foreground/70 max-w-xl mx-auto text-sm md:text-base mb-8"
            >
              {isAr
                ? "استمتعي بأفضل العروض على منتجات التجميل الفاخرة. عروض محدودة الوقت على العلامات التجارية المفضلة لديك."
                : "Enjoy the best deals on premium beauty products. Limited-time offers on your favorite clinical brands."}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-6 md:gap-10"
            >
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-display text-accent">{saleProducts.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-primary-foreground/50 font-body mt-1">
                  {isAr ? "منتج بالعرض" : "Products on Sale"}
                </p>
              </div>
              <div className="w-px h-10 bg-primary-foreground/20" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-display text-accent">
                  {totalSavings > 0 ? `${totalSavings.toFixed(0)}` : "—"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-primary-foreground/50 font-body mt-1">
                  {isAr ? "وفّري (د.أ)" : "Total Savings (JOD)"}
                </p>
              </div>
              <div className="w-px h-10 bg-primary-foreground/20" />
              <div className="text-center flex flex-col items-center">
                <Timer className="w-5 h-5 text-accent mb-0.5" />
                <p className="text-[10px] uppercase tracking-widest text-primary-foreground/50 font-body mt-1">
                  {isAr ? "لفترة محدودة" : "Limited Time"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Countdown Banner */}
      {saleProducts.length > 0 && <CountdownBanner isAr={isAr} />}

      {/* Filters & Content */}
      <main className="py-10 md:py-16">
        <div className="luxury-container">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isAr ? "ابحثي في العروض..." : "Search offers..."}
                className="pl-9 bg-card border-border/50"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-body">
                {saleProducts.length} {isAr ? "منتج" : "products"}
              </span>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-44 bg-card border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">{isAr ? "الأعلى خصماً" : "Biggest Discount"}</SelectItem>
                  <SelectItem value="price-asc">{isAr ? "السعر: الأقل" : "Price: Low → High"}</SelectItem>
                  <SelectItem value="price-desc">{isAr ? "السعر: الأعلى" : "Price: High → Low"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : saleProducts.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-border/50">
              <Sparkles className="w-12 h-12 text-accent/30 mx-auto mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">
                {isAr ? "لا توجد عروض حالياً" : "No Active Offers"}
              </h3>
              <p className="text-muted-foreground font-body text-sm mb-6 max-w-md mx-auto">
                {isAr
                  ? "تابعينا للحصول على أحدث العروض والتخفيضات الحصرية."
                  : "Check back soon for exclusive deals and discounts on premium beauty products."}
              </p>
              <Button asChild variant="luxury-outline" size="luxury">
                <Link to="/shop">{isAr ? "تسوقي الآن" : "Browse All Products"}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {saleProducts.map((product) => (
                <SaleProductCard key={product.id} product={product} onQuickView={handleQuickView} isFlashDeal={flashDealIds.has(product.id)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Sale signup form */}
      <SaleSignupForm isAr={isAr} />

      <Footer />

      <ProductQuickView
        product={
          selectedProduct
            ? {
                id: selectedProduct.id,
                title: selectedProduct.title,
                price: selectedProduct.price ?? 0,
                description: selectedProduct.pharmacist_note,
                category: selectedProduct.primary_concern?.replace("Concern_", "") ?? "General",
                image_url: selectedProduct.image_url,
                brand: selectedProduct.brand,
                volume_ml: null,
                is_on_sale: selectedProduct.is_on_sale ?? null,
                original_price: selectedProduct.original_price ?? null,
                discount_percent: selectedProduct.discount_percent ?? null,
                created_at: selectedProduct.created_at,
                updated_at: selectedProduct.updated_at,
              }
            : null
        }
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setTimeout(() => setSelectedProduct(null), 300);
        }}
      />
    </div>
  );
}
