import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Droplets,
  Heart,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
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

const formatJOD = (n: number) => `${n.toFixed(2)} JOD`;

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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
    variants: { edges: [] as any[] },
    options: [] as { name: string; values: string[] }[],
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
  const galleryImages = product.image_url ? [product.image_url] : ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="grid lg:grid-cols-2 min-h-screen pt-20">
        {/* LEFT: Gallery */}
        <div className="bg-muted/30 lg:overflow-y-auto">
          <div className="space-y-1">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/5] overflow-hidden">
                <img src={img} alt={`${product.title} - View ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-background">
          <div className="p-8 lg:p-16 flex flex-col justify-center min-h-full">
            <nav className="flex items-center gap-2 text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">{isArabic ? "الرئيسية" : "Home"}</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">{isArabic ? "المتجر" : "Shop"}</Link>
            </nav>

            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3 block">{brandName}</span>
              <h1 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight mb-6">{product.title}</h1>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-light text-foreground">{formatJOD(currentPrice)}</span>
              </div>
            </div>

            {product.pharmacist_note && (
              <p className="text-muted-foreground leading-relaxed mb-8 font-light">{product.pharmacist_note}</p>
            )}

            {product.key_ingredients && product.key_ingredients.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">{isArabic ? "المكونات الرئيسية" : "Key Ingredients"}</p>
                <div className="flex flex-wrap gap-2">
                  {product.key_ingredients.map((ing) => (
                    <span key={ing} className="px-3 py-1 rounded-full bg-accent/10 border border-accent/40 text-xs text-foreground font-medium">{ing}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-center gap-8 py-4 border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddToCart} className="flex-1 py-6 text-base font-medium tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground rounded-none">
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  {isArabic ? "أضف إلى الحقيبة" : "Add to Ritual"} — {formatJOD(currentPrice * quantity)}
                </Button>
                <button onClick={handleWishlistToggle} className={`w-14 h-14 flex items-center justify-center border transition-all ${isWishlisted ? "bg-primary border-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"}`}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {isArabic ? "موزع معتمد • منتج أصلي 100%" : "Authorized Retailer • 100% Authentic"}
              </div>

              <SafetyBadges product={product} className="justify-center" />

              <ShareButtons url={window.location.href} title={`${isArabic ? "اكتشف" : "Check out"} ${product.title}`} />
            </div>

            {product.clinical_badge && (
              <div className="mb-6 px-4 py-3 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-accent" />
                  {product.clinical_badge}
                </div>
              </div>
            )}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ritual" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline">
                  {isArabic ? "طريقة الاستخدام" : "The Ritual"}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-start gap-3 py-2">
                    <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isArabic ? "ضعيه صباحاً ومساءً على بشرة نظيفة." : "Apply AM and PM on clean skin before your moisturizer."}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="font-serif text-2xl text-foreground mb-8">{isArabic ? "قد يعجبك أيضاً" : "You May Also Like"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} to={`/product/${rp.handle}`} className="group">
                  <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden mb-3">
                    <img src={rp.image_url || "/placeholder.svg"} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{rp.brand}</p>
                  <p className="text-sm font-medium text-foreground line-clamp-2">{rp.title}</p>
                  <p className="text-sm text-foreground mt-1">{formatJOD(rp.price ?? 0)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
