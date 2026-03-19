import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import pdpHowToUse from "@/assets/pdp-how-to-use.jpg";
import pdpIngredients from "@/assets/pdp-ingredients.jpg";
import pdpRegulatory from "@/assets/pdp-regulatory.jpg";
import { supabase } from "@/integrations/supabase/client";
import { getIngredientBenefit } from "@/lib/ingredientBenefits";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  AlertTriangle,
  Beaker,
  Droplets,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import { StickyAddToCart } from "@/components/StickyAddToCart";
import { ProductReviews } from "@/components/ProductReviews";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SafetyBadges } from "@/components/product/SafetyBadges";
import type { Tables } from "@/integrations/supabase/types";

type DbProduct = Tables<"products">;

/** Split-render JOD price: large integer, small currency + decimals */
const SplitPrice = ({ amount, className = "" }: { amount: number; className?: string }) => {
  const formatted = amount.toFixed(3);
  const [integer, decimals] = formatted.split(".");
  return (
    <span className={className}>
      <span className="text-2xl font-medium text-burgundy">{integer}</span>
      <span className="text-xs text-burgundy/70 align-top ms-0.5">.{decimals} JD</span>
    </span>
  );
};

const formatJODSimple = (n: number) => `${n.toFixed(3)} JD`;


const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const ctaRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("handle", handle)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setProduct(data);
          const { data: related } = await supabase
            .from("products")
            .select("*")
            .eq("primary_concern", data.primary_concern)
            .neq("id", data.id)
            .limit(4);
          setRelatedProducts(related || []);
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [handle]);

  const buildShopifyNode = (p: DbProduct) => ({
    id: p.id,
    title: p.title,
    description: p.pharmacist_note || "",
    handle: p.handle,
    vendor: p.brand || "",
    productType: p.primary_concern || "",
    priceRange: { minVariantPrice: { amount: String(p.price ?? 0), currencyCode: "JOD" } },
    images: { edges: [{ node: { url: p.image_url || "", altText: p.title } }] },
    variants: { edges: [] as Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; compareAtPrice?: { amount: string; currencyCode: string } | null; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> } }> },
    options: [] as Array<{ name: string; values: string[] }>,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      product: { node: buildShopifyNode(product) },
      variantId: product.id,
      variantTitle: "Default",
      price: { amount: String(product.price ?? 0), currencyCode: "JOD" },
      quantity,
      selectedOptions: [],
    });
    toast.success(isArabic ? "تمت الإضافة إلى الحقيبة" : "Added to your ritual", { description: product.title, position: "top-center" });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleItem({ node: buildShopifyNode(product) });
    if (!isInWishlist(product.id)) {
      toast.success(isArabic ? "تمت الإضافة إلى المفضلة" : "Added to wishlist", { description: product.title, position: "top-center" });
    }
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const currentPrice = product?.price ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="grid lg:grid-cols-2 min-h-screen pt-20">
          <div className="bg-muted/30 aspect-[4/5] animate-pulse" />
          <div className="p-8 lg:p-16 space-y-6">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            <div className="h-20 w-full bg-muted rounded animate-pulse" />
            <div className="h-14 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-36">
          <h1 className="font-serif text-2xl text-foreground mb-4">
            {isArabic ? "المنتج غير موجود" : "Product Not Found"}
          </h1>
          <Link to="/" className="text-primary hover:underline text-sm">
            {isArabic ? "العودة للمتجر" : "Return to Shop"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const brandName = product.brand || (isArabic ? "مجموعة حصرية" : "Exclusive Collection");
  const galleryImages = product.image_url ? [product.image_url] : ["/editorial-showcase-2.webp"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-ivory to-white">
      <Header />
      <div className="grid lg:grid-cols-2 min-h-screen pt-20">
        {/* LEFT: Hero Image Gallery */}
        <div className="bg-asper-stone/20 lg:overflow-y-auto">
          <div className="space-y-1">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={img}
                  alt={`${product.title} - View ${idx + 1}`}
                  className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Frosted Glass PDP Panel */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div
            className="p-8 lg:p-16 flex flex-col justify-center min-h-full backdrop-blur-sm md:backdrop-blur-md"
            style={{ backgroundColor: "hsl(240 20% 99% / 0.7)" }}
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-burgundy transition-colors">{isArabic ? "الرئيسية" : "Home"}</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/shop" className="text-muted-foreground hover:text-burgundy transition-colors">{isArabic ? "المتجر" : "Shop"}</Link>
            </nav>

            {/* Above the Fold: Brand, Title, Price */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-polished-gold/70 mb-3 block font-body">{brandName}</span>
              <h1 className="font-serif text-3xl lg:text-4xl text-asper-ink leading-tight mb-6">{product.title}</h1>
              <SplitPrice amount={currentPrice} />
            </div>

            {/* Pharmacist Note — Frosted Glass Panel */}
            {product.pharmacist_note && (
              <div
                className="mb-8 p-6 rounded-sm backdrop-blur-sm"
                style={{
                  backgroundColor: "hsl(240 20% 99% / 0.6)",
                  borderLeft: "4px solid hsl(var(--burgundy))",
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex items-center gap-2 mb-3 text-burgundy">
                  <Stethoscope className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest font-body">{isArabic ? "ملاحظة الصيدلاني" : "Pharmacist Clinical Note"}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed font-light italic font-body">"{product.pharmacist_note}"</p>
              </div>
            )}

            {/* Clinical Badge */}
            {product.clinical_badge && (
              <div
                className="mb-6 px-4 py-3 rounded-sm"
                style={{
                  backgroundColor: "hsl(var(--polished-gold) / 0.08)",
                  border: "1px solid hsl(var(--polished-gold) / 0.3)",
                }}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-asper-ink">
                  <Sparkles className="w-4 h-4 text-polished-gold" />
                  {product.clinical_badge}
                </div>
              </div>
            )}

            {/* Gold Divider */}
            <div className="w-16 h-px bg-polished-gold mb-10" />

            {/* Add to Cart — Primary CTA */}
            <div ref={ctaRef} className="space-y-6 mb-10">
              {/* Quantity Selector — Gold bordered */}
              <div
                className="flex items-center justify-center gap-8 py-4 rounded-sm"
                style={{ border: "1px solid hsl(var(--polished-gold) / 0.3)" }}
              >
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-burgundy transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="text-lg font-body font-medium w-8 text-center text-asper-ink">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-burgundy transition-colors"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  variant="luxury"
                  size="luxury-lg"
                  className="flex-1 transition-all duration-200 hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-5 h-5 me-3" />
                  {isArabic ? "أضف إلى الحقيبة" : "Add to Ritual"} — {formatJODSimple(currentPrice * quantity)}
                </Button>
                <button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 flex items-center justify-center transition-all duration-300 rounded-sm ${
                    isWishlisted
                      ? "bg-burgundy border-burgundy text-white"
                      : "border text-asper-ink hover:border-burgundy"
                  }`}
                  style={{ borderColor: isWishlisted ? undefined : "hsl(var(--polished-gold) / 0.3)" }}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Secondary CTA: Digital Concierge Integration */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-beauty-assistant"))}
                className="w-full h-14 clinical-glass rounded-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-foreground hover:border-accent/40"
                style={{ border: "1px solid hsl(var(--polished-gold) / 0.3)" }}
              >
                <Sparkles className="w-5 h-5 text-polished-gold" />
                {isArabic ? "غير متأكد؟ اسألي د. روز عن هذا المنتج" : "Unsure? Ask Dr. Rose about this formula"}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-burgundy" />
                {isArabic ? "موزع معتمد • منتج أصلي 100%" : "Authorized Retailer • 100% Authentic"}
              </div>

              <SafetyBadges product={product} className="justify-center" />
              <ShareButtons url={window.location.href} title={`${isArabic ? "اكتشف" : "Check out"} ${product.title}`} />
            </div>

            {/* ─── Key Clinical Actives — Frosted Glass Cards ─── */}
            {product.key_ingredients && product.key_ingredients.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Beaker className="w-4 h-4 text-burgundy" />
                  <h3 className="font-serif text-lg text-asper-ink">
                    {isArabic ? "المكونات السريرية الفعالة" : "Key Clinical Actives"}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.key_ingredients.map((ingredient) => {
                    const benefit = getIngredientBenefit(ingredient, isArabic);
                    return (
                      <div
                        key={ingredient}
                        className="clinical-glass rounded-sm p-5 transition-colors duration-300 hover:-translate-y-0.5"
                        style={{
                          border: "1px solid hsl(var(--polished-gold) / 0.2)",
                        }}
                      >
                        <h4 className="font-body font-bold text-sm text-asper-ink mb-1">{ingredient}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-body">
                          {benefit}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── Clinical Accordions — Gold dividers ─── */}
            <Accordion type="multiple" className="w-full" style={{ borderTop: "1px solid hsl(var(--polished-gold) / 0.2)" }}>
              {/* How to Use */}
              <AccordionItem value="how-to-use" style={{ borderBottom: "1px solid hsl(var(--polished-gold) / 0.15)" }}>
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline py-5">
                  <span className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-burgundy" />
                    {isArabic ? "طريقة الاستخدام" : "How to Use"}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-4">
                      <img src={pdpHowToUse} alt="Skincare application ritual" className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/20 to-transparent" />
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center text-xs font-bold">1</span>
                        <p>{isArabic ? "نظفي البشرة جيداً وجففيها بلطف." : "Cleanse skin thoroughly and pat dry."}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center text-xs font-bold">2</span>
                        <p>{isArabic ? "ضعي كمية مناسبة على الوجه والرقبة." : "Apply an appropriate amount to face and neck."}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center text-xs font-bold">3</span>
                        <p>{isArabic ? "دلكي بلطف بحركات دائرية حتى يمتص بالكامل." : "Massage gently in circular motions until fully absorbed."}</p>
                      </div>
                      {product.regimen_step && (
                        <div className="mt-3 px-3 py-2 rounded-sm text-xs" style={{ backgroundColor: "hsl(var(--polished-gold) / 0.08)" }}>
                          <span className="font-semibold text-asper-ink">{isArabic ? "خطوة الروتين:" : "Regimen Step:"}</span>{" "}
                          {product.regimen_step.replace(/_/g, " ")}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Ingredients (INCI) */}
              <AccordionItem value="ingredients" style={{ borderBottom: "1px solid hsl(var(--polished-gold) / 0.15)" }}>
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline py-5">
                  <span className="flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-burgundy" />
                    {isArabic ? "المكونات (INCI)" : "Ingredients (INCI)"}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2">
                    <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-4">
                      <img src={pdpIngredients} alt="Clinical botanical ingredients" className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/20 to-transparent" />
                    </div>
                    {product.key_ingredients && product.key_ingredients.length > 0 ? (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3 font-body">
                          {isArabic ? "المكونات الفعالة الرئيسية" : "Key Active Ingredients"}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.key_ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-3 py-1.5 rounded-full text-xs text-asper-ink font-medium font-body"
                              style={{
                                backgroundColor: "hsl(var(--polished-gold) / 0.08)",
                                border: "1px solid hsl(var(--polished-gold) / 0.3)",
                              }}
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground italic font-body">
                          {isArabic
                            ? "للحصول على قائمة INCI الكاملة، يرجى مراجعة عبوة المنتج."
                            : "For the full INCI list, please refer to the product packaging."}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground font-body">
                        {isArabic
                          ? "يرجى مراجعة عبوة المنتج لمعرفة القائمة الكاملة للمكونات."
                          : "Please refer to the product packaging for the complete ingredient list."}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Regulatory Warnings */}
              <AccordionItem value="regulatory" style={{ borderBottom: "1px solid hsl(var(--polished-gold) / 0.15)" }}>
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline py-5">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-burgundy" />
                    {isArabic ? "التحذيرات التنظيمية" : "Regulatory Warnings"}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2 space-y-4">
                    <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-4">
                      <img src={pdpRegulatory} alt="Certification and authenticity seal" className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/20 to-transparent" />
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
                      <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-sm">
                        <p className="font-medium text-asper-ink text-xs uppercase tracking-wider mb-2 font-body">
                          {isArabic ? "تحذيرات مهمة" : "Important Warnings"}
                        </p>
                        <ul className="space-y-1.5 text-xs font-body">
                          <li>• {isArabic ? "للاستخدام الخارجي فقط. تجنبي ملامسة العينين." : "For external use only. Avoid contact with eyes."}</li>
                          <li>• {isArabic ? "توقفي عن الاستخدام في حال حدوث تهيج." : "Discontinue use if irritation occurs."}</li>
                          <li>• {isArabic ? "يُحفظ بعيداً عن متناول الأطفال." : "Keep out of reach of children."}</li>
                          <li>• {isArabic ? "يُخزن في درجة حرارة أقل من 25 درجة مئوية." : "Store below 25°C. Protect from direct sunlight."}</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-sm" style={{ backgroundColor: "hsl(var(--asper-stone) / 0.3)" }}>
                        <p className="text-xs text-muted-foreground font-body">
                          <span className="font-semibold text-asper-ink">{isArabic ? "ملاحظة:" : "Note:"} </span>
                          {isArabic
                            ? "قد يختلف تصميم العبوة عن الصورة المعروضة بسبب تحديثات الشركة المصنعة. المنتج والمكونات تبقى كما هي."
                            : "Packaging design may vary from the image shown due to manufacturer updates. The product and ingredients remain the same."}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Reviews */}
              <AccordionItem value="reviews" style={{ borderBottom: "1px solid hsl(var(--polished-gold) / 0.15)" }}>
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline py-5">
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-polished-gold" />
                    {isArabic ? "التقييمات" : "Reviews"}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ProductReviews productId={product.id} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related Products — Frosted Glass Cards */}
      {relatedProducts.length > 0 && (
        <section className="py-16" style={{ background: "linear-gradient(to bottom right, hsl(240 20% 99%), white)" }}>
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="font-serif text-2xl text-asper-ink mb-8">{isArabic ? "قد يعجبك أيضاً" : "You May Also Like"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} to={`/product/${rp.handle}`} className="group">
                  <div
                    className="aspect-square overflow-hidden mb-3 rounded-sm transition-all duration-[400ms] group-hover:border-polished-gold group-hover:-translate-y-1"
                    style={{
                      backgroundColor: "hsl(var(--asper-stone) / 0.3)",
                      border: "1px solid hsl(var(--polished-gold) / 0.2)",
                    }}
                  >
                    <img
                      src={rp.image_url || "/editorial-showcase-2.webp"}
                      alt={rp.title}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs text-polished-gold/70 uppercase tracking-widest font-body">{rp.brand}</p>
                  <p className="text-sm font-medium text-asper-ink line-clamp-2 font-body">{rp.title}</p>
                  <SplitPrice amount={rp.price ?? 0} className="mt-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Sticky Add-to-Cart Bar */}
      <StickyAddToCart
        productTitle={product.title}
        price={currentPrice}
        onAddToCart={handleAddToCart}
        triggerRef={ctaRef as React.RefObject<HTMLElement>}
      />
    </div>
  );
};

export default ProductDetail;
