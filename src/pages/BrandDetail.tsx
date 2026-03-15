import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type Brand = Tables<"brands">;
type Product = Tables<"products">;

const BrandDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLanguage();
  const isArabic = locale === "ar";
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data: b } = await supabase
        .from("brands")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (b) {
        setBrand(b);
        const { data: prods } = await supabase
          .from("products")
          .select("*")
          .ilike("brand", `%${b.name}%`)
          .neq("availability_status", "Pending_Purge")
          .order("is_bestseller", { ascending: false })
          .limit(20);
        setProducts(prods || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-16 container mx-auto max-w-7xl px-4 space-y-8">
          <div className="h-64 bg-muted/30 rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-muted/30 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-36">
          <h1 className="font-display text-2xl text-foreground mb-4">
            {isArabic ? "Ø§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©" : "Brand Not Found"}
          </h1>
          <Link to="/brands" className="text-primary hover:underline text-sm">
            {isArabic ? "ØªØµÙØ­ Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" : "Browse Brands"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    description: brand.description || `${brand.name} â€” Pharmacist-curated beauty at Asper Beauty Shop`,
    image: brand.image_url,
    url: `https://www.asperbeautyshop.com/brands/${brand.slug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Banner */}
      <section className="relative pt-20">
        <div className="relative h-[50vh] min-h-[320px] overflow-hidden bg-asper-stone">
          {brand.image_url && (
            <img
              src={brand.image_url}
              alt={`${brand.name} collection`}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {brand.logo_image_path && (
              <img
                src={brand.logo_image_path}
                alt={`${brand.name} logo`}
                className="h-16 md:h-20 object-contain mb-6"
              />
            )}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="font-body text-muted-foreground max-w-2xl text-lg leading-relaxed">
                {brand.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-6">
              <Badge variant="outline" className="border-polished-gold/50 text-polished-gold text-xs tracking-wider gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isArabic ? "Ù…ÙˆØ²Ø¹ Ù…Ø¹ØªÙ…Ø¯" : "Authorized Retailer"}
              </Badge>
              <Badge variant="outline" className="border-polished-gold/50 text-polished-gold text-xs tracking-wider gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {isArabic ? "Ø£ØµØ§Ù„Ø© Ù…Ø¶Ù…ÙˆÙ†Ø©" : "100% Authentic"}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            {isArabic ? "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" : "Home"}
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/brands" className="text-muted-foreground hover:text-primary transition-colors">
            {isArabic ? "Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©" : "Brands"}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{brand.name}</span>
        </nav>
      </div>

      {/* Product Grid */}
      <section className="container mx-auto max-w-7xl px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {isArabic ? `Ù…Ù†ØªØ¬Ø§Øª ${brand.name}` : `${brand.name} Products`}
          </h2>
          <span className="text-sm text-muted-foreground font-body">
            {products.length} {isArabic ? "Ù…Ù†ØªØ¬" : "products"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground font-body">
              {isArabic ? "Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù†ØªØ¬Ø§Øª Ù…ØªØ§Ø­Ø© Ø­Ø§Ù„ÙŠØ§Ù‹" : "No products available at this time"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} to={`/product/${p.handle}`} className="group">
                <div className="aspect-[4/5] bg-card rounded-none overflow-hidden mb-3 border border-border/30 group-hover:border-polished-gold/50 transition-all duration-300 relative">
                  <img
                    src={p.image_url || "/editorial-showcase-2.webp"}
                    alt={`${p.title} by ${brand.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {p.is_bestseller && (
                    <Badge className="absolute top-3 left-3 bg-polished-gold text-asper-ink text-[10px] tracking-wider">
                      {isArabic ? "Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹" : "Bestseller"}
                    </Badge>
                  )}
                  {/* Shimmer beam */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700" />
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-polished-gold font-body font-semibold">
                  {brand.name}
                </p>
                <p className="text-sm font-display font-semibold text-foreground line-clamp-2 mt-1">
                  {p.title}
                </p>
                <p className="text-sm font-body text-burgundy font-medium mt-1">
                  {(p.price ?? 0).toFixed(3)} JD
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* View all CTA */}
        {products.length >= 20 && (
          <div className="text-center mt-12">
            <Link
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="inline-flex items-center gap-2 text-sm font-body font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
            >
              {isArabic ? "ØªØµÙØ­ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª" : "View All Products"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default BrandDetail;

