import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import pdpHowToUse from "@/assets/pdp-how-to-use.jpg";
import pdpIngredients from "@/assets/pdp-ingredients.jpg";
import pdpRegulatory from "@/assets/pdp-regulatory.jpg";
import { supabase } from "@/integrations/supabase/client";
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
    toast.success(isArabic ? "ØªÙ…Øª Ø§Ù„Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ø­Ù‚ÙŠØ¨Ø©" : "Added to your ritual", { description: product.title, position: "top-center" });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleItem({ node: buildShopifyNode(product) });
    if (!isInWishlist(product.id)) {
      toast.success(isArabic ? "ØªÙ…Øª Ø§Ù„Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ù…ÙØ¶Ù„Ø©" : "Added to wishlist", { description: product.title, position: "top-center" });
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
  const galleryImages = product.image_url ? [product.image_url] : ["/editorial-showcase-2.jpg"];
  const seoDescription = product.pharmacist_note || `Buy ${product.title} by ${brandName} at Asper Beauty Shop. Authorized retailer in Jordan for clinical skincare and dermocosmetics.`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.title} | {brandName} | Asper Beauty Shop</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={`${product.title} - ${brandName}`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={product.image_url || "/hero-banner.jpg"} />
      </Helmet>
      <Header />
      <div className="grid lg:grid-cols-2 min-h-screen pt-20">
        {/* LEFT: Hero Image Gallery â€” Above the Fold Priority */}
        <div className="bg-muted/30 lg:overflow-y-auto">
          <div className="space-y-1">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/5] overflow-hidden">
                <img src={img} alt={`${product.title} - View ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Clean PDP â€” Price + Cart Above Fold, Clinical Data in Accordions */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-background">
          <div className="p-8 lg:p-16 flex flex-col justify-center min-h-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">{isArabic ? "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" : "Home"}</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">{isArabic ? "Ø§Ù„Ù…ØªØ¬Ø±" : "Shop"}</Link>
            </nav>

            {/* Above the Fold: Brand, Title, Price */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3 block">{brandName}</span>
              <h1 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight mb-6">{product.title}</h1>
              <SplitPrice amount={currentPrice} />
            </div>

            {/* Pharmacist Note (brief) */}
            {product.pharmacist_note && (
              <div className="mb-8 p-6 bg-[#F8F8FF] border-l-4 border-[#800020] rounded-r-xl shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-[#800020]">
                  <Stethoscope className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">{isArabic ? "Ù…Ù„Ø§Ø­Ø¸Ø© Ø§Ù„ØµÙŠØ¯Ù„Ø§Ù†ÙŠ" : "Pharmacist Clinical Note"}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed font-light italic">"{product.pharmacist_note}"</p>
              </div>
            )}

            {/* Clinical Badge */}
            {product.clinical_badge && (
              <div className="mb-6 px-4 py-3 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-accent" />
                  {product.clinical_badge}
                </div>
              </div>
            )}

            {/* Gold Divider */}
            <div className="w-16 h-px bg-polished-gold mb-10" />

            {/* Add to Cart â€” Primary CTA */}
            <div ref={ctaRef} className="space-y-6 mb-10">
              <div className="flex items-center justify-center gap-8 py-4 border border-polished-gold/30">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-burgundy transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="text-lg font-body font-medium w-8 text-center text-asper-ink">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-burgundy transition-colors"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddToCart} variant="luxury" size="luxury-lg" className="flex-1">
                  <ShoppingBag className="w-5 h-5 me-3" />
                  {isArabic ? "Ø£Ø¶Ù Ø¥Ù„Ù‰ Ø§Ù„Ø­Ù‚ÙŠØ¨Ø©" : "Add to Ritual"} â€” {formatJODSimple(currentPrice * quantity)}
                </Button>
                <button onClick={handleWishlistToggle} className={`w-14 h-14 flex items-center justify-center border transition-all ${isWishlisted ? "bg-primary border-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"}`}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {isArabic ? "Ù…ÙˆØ²Ø¹ Ù…Ø¹ØªÙ…Ø¯ â€¢ Ù…Ù†ØªØ¬ Ø£ØµÙ„ÙŠ 100%" : "Authorized Retailer â€¢ 100% Authentic"}
              </div>

              <SafetyBadges product={product} className="justify-center" />
              <ShareButtons url={window.location.href} title={`${isArabic ? "Ø§ÙƒØªØ´Ù" : "Check out"} ${product.title}`} />
            </div>

            {/* â”€â”€â”€ Clean PDP Accordions: Clinical data below the fold â”€â”€â”€ */}
            <Accordion type="multiple" className="w-full border-t border-polished-gold/30">
              {/* How to Use */}
              <AccordionItem value="how-to-use" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline py-5">
                  <span className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-primary" />
                    {isArabic ? "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…" : "How to Use"}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                      <img src={pdpHowToUse} alt="Skincare application ritual" className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/30 to-transparent" />
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                      <p>{isArabic ? "Ù†Ø¸ÙÙŠ Ø§Ù„Ø¨Ø´Ø±Ø© Ø¬ÙŠØ¯Ø§Ù‹ ÙˆØ¬ÙÙÙŠÙ‡Ø§ Ø¨Ù„Ø·Ù." : "Cleanse skin thoroughly and pat dry."}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                      <p>{isArabic ? "Ø¶Ø¹ÙŠ ÙƒÙ…ÙŠØ© Ù…Ù†Ø§Ø³Ø¨Ø© Ø¹Ù„Ù‰ Ø§Ù„ÙˆØ¬Ù‡ ÙˆØ§Ù„Ø±Ù‚Ø¨Ø©." : "Apply an appropriate amount to face and neck."}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                      <p>{isArabic ? "Ø¯Ù„ÙƒÙŠ Ø¨Ù„Ø·Ù Ø¨Ø­Ø±ÙƒØ§Øª Ø¯Ø§Ø¦Ø±ÙŠØ© Ø­ØªÙ‰ ÙŠÙ…ØªØµ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„." : "Massage gently in circular motions until fully absorbed."}</p>
                    </div>
                    {product.regimen_step && (
                      <div className="mt-3 px-3 py-2 bg-accent/10 rounded text-xs">
                        <span className="font-semibold text-foreground">{isArabic ? "Ø®Ø·ÙˆØ© Ø§Ù„Ø±ÙˆØªÙŠÙ†:" : "Regimen Step:"}</span>{" "}
                        {product.regimen_step.replace(/_/g, " ")}
                      </div>
                    )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Ingredients (INCI) */}
              <AccordionItem value="ingredients" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline py-5">
                  <span className="flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-primary" />
                    {isArabic ? "Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª (INCI)" : "Ingredients (INCI)"}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                      <img src={pdpIngredients} alt="Clinical botanical ingredients" className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/30 to-transparent" />
                    </div>
                    {product.key_ingredients && product.key_ingredients.length > 0 ? (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
                          {isArabic ? "Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„ÙØ¹Ø§Ù„Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" : "Key Active Ingredients"}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.key_ingredients.map((ing) => (
                            <span key={ing} className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-xs text-foreground font-medium">{ing}</span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          {isArabic
                            ? "Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ù‚Ø§Ø¦Ù…Ø© INCI Ø§Ù„ÙƒØ§Ù…Ù„Ø©ØŒ ÙŠØ±Ø¬Ù‰ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¹Ø¨ÙˆØ© Ø§Ù„Ù…Ù†ØªØ¬."
                            : "For the full INCI list, please refer to the product packaging."}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {isArabic
                          ? "ÙŠØ±Ø¬Ù‰ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¹Ø¨ÙˆØ© Ø§Ù„Ù…Ù†ØªØ¬ Ù„Ù…Ø¹Ø±ÙØ© Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„ÙƒØ§Ù…Ù„Ø© Ù„Ù„Ù…ÙƒÙˆÙ†Ø§Øª."
                          : "Please refer to the product packaging for the complete ingredient list."}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Regulatory Warnings */}
              <AccordionItem value="regulatory" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline py-5">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                    {isArabic ? "Ø§Ù„ØªØ­Ø°ÙŠØ±Ø§Øª Ø§Ù„ØªÙ†Ø¸ÙŠÙ…ÙŠØ©" : "Regulatory Warnings"}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2 space-y-4">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                      <img src={pdpRegulatory} alt="Certification and authenticity seal" className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-asper-ink/30 to-transparent" />
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
                    <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <p className="font-medium text-foreground text-xs uppercase tracking-wider mb-2">
                        {isArabic ? "ØªØ­Ø°ÙŠØ±Ø§Øª Ù…Ù‡Ù…Ø©" : "Important Warnings"}
                      </p>
                      <ul className="space-y-1.5 text-xs">
                        <li>â€¢ {isArabic ? "Ù„Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ø®Ø§Ø±Ø¬ÙŠ ÙÙ‚Ø·. ØªØ¬Ù†Ø¨ÙŠ Ù…Ù„Ø§Ù…Ø³Ø© Ø§Ù„Ø¹ÙŠÙ†ÙŠÙ†." : "For external use only. Avoid contact with eyes."}</li>
                        <li>â€¢ {isArabic ? "ØªÙˆÙ‚ÙÙŠ Ø¹Ù† Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… ÙÙŠ Ø­Ø§Ù„ Ø­Ø¯ÙˆØ« ØªÙ‡ÙŠØ¬." : "Discontinue use if irritation occurs."}</li>
                        <li>â€¢ {isArabic ? "ÙŠÙØ­ÙØ¸ Ø¨Ø¹ÙŠØ¯Ø§Ù‹ Ø¹Ù† Ù…ØªÙ†Ø§ÙˆÙ„ Ø§Ù„Ø£Ø·ÙØ§Ù„." : "Keep out of reach of children."}</li>
                        <li>â€¢ {isArabic ? "ÙŠÙØ®Ø²Ù† ÙÙŠ Ø¯Ø±Ø¬Ø© Ø­Ø±Ø§Ø±Ø© Ø£Ù‚Ù„ Ù…Ù† 25 Ø¯Ø±Ø¬Ø© Ù…Ø¦ÙˆÙŠØ©." : "Store below 25Â°C. Protect from direct sunlight."}</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{isArabic ? "Ù…Ù„Ø§Ø­Ø¸Ø©:" : "Note:"} </span>
                        {isArabic
                          ? "Ù‚Ø¯ ÙŠØ®ØªÙ„Ù ØªØµÙ…ÙŠÙ… Ø§Ù„Ø¹Ø¨ÙˆØ© Ø¹Ù† Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„Ù…Ø¹Ø±ÙˆØ¶Ø© Ø¨Ø³Ø¨Ø¨ ØªØ­Ø¯ÙŠØ«Ø§Øª Ø§Ù„Ø´Ø±ÙƒØ© Ø§Ù„Ù…ØµÙ†Ø¹Ø©. Ø§Ù„Ù…Ù†ØªØ¬ ÙˆØ§Ù„Ù…ÙƒÙˆÙ†Ø§Øª ØªØ¨Ù‚Ù‰ ÙƒÙ…Ø§ Ù‡ÙŠ."
                          : "Packaging design may vary from the image shown due to manufacturer updates. The product and ingredients remain the same."}
                      </p>
                    </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Reviews with Contextual Social Proof */}
              <AccordionItem value="reviews" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline py-5">
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-polished-gold" />
                    {isArabic ? "Ø§Ù„ØªÙ‚ÙŠÙŠÙ…Ø§Øª" : "Reviews"}
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-muted/20 border-t border-border/40" data-testid="related-products-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-burgundy font-bold block mb-2">
                {isArabic ? "المزيد من البروتوكول" : "Extend Your Protocol"}
              </span>
              <h2 className="font-display text-3xl text-foreground tracking-tight">
                {isArabic ? "قد يعجبك أيضاً" : "Complementary Clinical Pairs"}
              </h2>
            </header>

            {/* 1. CSS Grid Implementation (Strict Mandate) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {relatedProducts.map((rp) => (
                <Link 
                  key={rp.id} 
                  to={`/product/${rp.handle}`} 
                  className="group block p-6 bg-white border border-border/40 transition-all duration-500 hover:shadow-[0_15px_40px_-10px_rgba(128,0,32,0.1)] hover:border-polished-gold/30"
                  data-testid={`related-product-${rp.id}`}
                >
                  <div className="aspect-[4/5] bg-asper-stone overflow-hidden mb-6 relative">
                    <img 
                      src={rp.image_url || "/editorial-showcase-2.jpg"} 
                      alt={rp.title} 
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/5 transition-colors duration-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[9px] text-polished-gold uppercase tracking-[0.2em] font-bold truncate">
                      {rp.brand}
                    </p>
                    <p className="font-display text-sm font-semibold text-asper-ink line-clamp-2 min-h-[2.5rem] leading-tight">
                      {rp.title}
                    </p>
                    <SplitPrice amount={rp.price ?? 0} className="mt-2 block" />
                  </div>
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

