import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import Hero from "@/components/home/HeroSlider";
import { USPBar } from "@/components/home/USPBar";
import { ProductSlider } from "@/components/home/ProductSlider";
import { Footer } from "@/components/Footer";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load below-the-fold components for better initial load performance
const EditorialSpotlight = lazy(() =>
  import("@/components/home/EditorialSpotlight").then((m) => ({
    default: m.EditorialSpotlight,
  }))
);
const BrandOfTheWeek = lazy(() =>
  import("@/components/home/BrandOfTheWeek").then((m) => ({
    default: m.BrandOfTheWeek,
  }))
);
const ShopByCategory = lazy(() =>
  import("@/components/home/ShopByCategory").then((m) => ({
    default: m.ShopByCategory,
  }))
);
const CelestialFeaturedCollection = lazy(() =>
  import("@/components/CelestialFeaturedCollection")
);
const FeaturedBrands = lazy(() =>
  import("@/components/FeaturedBrands").then((m) => ({
    default: m.FeaturedBrands,
  }))
);
const Newsletter = lazy(() =>
  import("@/components/Newsletter").then((m) => ({ default: m.Newsletter }))
);
const NPSSurvey = lazy(() =>
  import("@/components/home/NPSSurvey").then((m) => ({
    default: m.NPSSurvey,
  }))
);
const TrustBanner = lazy(() =>
  import("@/components/TrustBanner").then((m) => ({ default: m.TrustBanner }))
);
const ScrollToTop = lazy(() =>
  import("@/components/ScrollToTop").then((m) => ({ default: m.ScrollToTop }))
);
const FloatingSocials = lazy(() =>
  import("@/components/FloatingSocials").then((m) => ({
    default: m.FloatingSocials,
  }))
);

// Lightweight skeleton for lazy sections
const SectionSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} bg-asper-stone animate-pulse`}>
    <div className="luxury-container py-12">
      <Skeleton className="h-8 w-48 mx-auto mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

// Sample product data for sliders
const NEW_ARRIVALS = [
  { id: "1", handle: "cosmic-dealer-lip-oil", title: "Crystal Lip Oil — Rose Quartz", brand: "Cosmic Dealer", image: "https://placehold.co/400x533/FAF7F2/800020?text=Crystal+Lip+Oil", tag: "Just In" },
  { id: "2", handle: "moussse-cloud-cream", title: "Cloud Cream Moisturizer", brand: "Moussse", image: "https://placehold.co/400x533/FAF7F2/800020?text=Cloud+Cream", tag: "Clean Product" },
  { id: "3", handle: "mirror-water-botanical-mist", title: "Botanical Facial Mist", brand: "Mirror Water", image: "https://placehold.co/400x533/FAF7F2/800020?text=Botanical+Mist", tag: "Just In" },
  { id: "4", handle: "phlur-missing-person", title: "Missing Person Eau de Parfum", brand: "Phlur", image: "https://placehold.co/400x533/FAF7F2/800020?text=Missing+Person" },
  { id: "5", handle: "summer-fridays-jet-lag", title: "Jet Lag Mask — Hydrating", brand: "Summer Fridays", image: "https://placehold.co/400x533/FAF7F2/800020?text=Jet+Lag+Mask", tag: "Clean Product" },
  { id: "6", handle: "kosas-revealer-concealer", title: "Revealer Skin-Improving Concealer", brand: "Kosas", image: "https://placehold.co/400x533/FAF7F2/800020?text=Revealer" },
];

const BESTSELLERS = [
  { id: "7", handle: "augustinus-bader-rich-cream", title: "The Rich Cream", brand: "Augustinus Bader", image: "https://placehold.co/400x533/FAF7F2/800020?text=The+Rich+Cream", tag: "Bestseller" },
  { id: "8", handle: "westman-atelier-contour", title: "Face Trace Contour Stick", brand: "Westman Atelier", image: "https://placehold.co/400x533/FAF7F2/800020?text=Contour+Stick", tag: "Bestseller" },
  { id: "9", handle: "drunk-elephant-protini", title: "Protini Polypeptide Cream", brand: "Drunk Elephant", image: "https://placehold.co/400x533/FAF7F2/800020?text=Protini" },
  { id: "10", handle: "tatcha-dewy-skin-cream", title: "The Dewy Skin Cream", brand: "Tatcha", image: "https://placehold.co/400x533/FAF7F2/800020?text=Dewy+Skin", tag: "Bestseller" },
  { id: "11", handle: "merit-flush-balm", title: "Flush Balm Cheek Color", brand: "Merit", image: "https://placehold.co/400x533/FAF7F2/800020?text=Flush+Balm" },
  { id: "12", handle: "ilia-super-serum", title: "Super Serum Skin Tint SPF 40", brand: "ILIA", image: "https://placehold.co/400x533/FAF7F2/800020?text=Super+Serum", tag: "Bestseller" },
];

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch new arrivals
  const { data: newArrivals = [] } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return (data || []).map((p) => ({
        id: p.id,
        title: p.title,
        brand: p.brand,
        price: p.price ?? 0,
        image_url: p.image_url || "/placeholder.svg",
        category: p.primary_concern,
        tags: [] as string[],
        is_new: true,
      }));
    },
  });

  // Fetch bestsellers
  const { data: bestsellers = [] } = useQuery({
    queryKey: ["bestsellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(8);

      if (error) throw error;
      return (data || []).map((p) => ({
        id: p.id,
        title: p.title,
        brand: p.brand,
        price: p.price ?? 0,
        image_url: p.image_url || "/placeholder.svg",
        category: p.primary_concern,
        is_on_sale: false,
      }));
    },
  });

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    window.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main>
        {/* 1. Hero Banner — Wonder Women Edit / Female Founders */}
        <Hero />

        {/* 2. USP Bar — Trust Signals */}
        <USPBar />

        {/* 3. Product Slider — Just Landed / What's New */}
        <ProductSlider
          title={{ en: "Just Landed! What's New", ar: "وصل حديثاً! الجديد لدينا" }}
          subtitle={{ en: "New Arrivals", ar: "وصل حديثاً" }}
          products={NEW_ARRIVALS}
        />

        {/* 4. Product Slider — Bestsellers */}
        <ProductSlider
          title={{ en: "Bestsellers — Niche Approved", ar: "الأكثر مبيعاً — اختيار الخبراء" }}
          subtitle={{ en: "Most Loved", ar: "الأكثر حباً" }}
          products={BESTSELLERS}
        />

        {/* 5. Editorial Spotlight — WANTED! Hero Products */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <EditorialSpotlight />
        </Suspense>

        {/* 6. Brand of the Week */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <BrandOfTheWeek />
        </Suspense>

        {/* 7. Shop by Category Grid */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <ShopByCategory />
        </Suspense>

        {/* 8. Digital Tray — Clinical Routine */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <CelestialFeaturedCollection />
        </Suspense>

        {/* 9. Featured Brands Carousel */}
        <Suspense fallback={<SectionSkeleton height="h-32" />}>
          <FeaturedBrands />
        </Suspense>

        {/* 10. Newsletter — 15% Off for Beauty Insiders */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <Newsletter />
        </Suspense>
      </LazySection>

      {/* Footer — Deep Maroon */}
      <footer className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={asperLogo} alt="Asper" className="h-8 w-auto brightness-0 invert opacity-90" />
                <span className="text-xs font-body uppercase tracking-[0.25em] text-primary-foreground/70">Beauty Shop</span>
              </div>
              <p className={`text-sm text-primary-foreground/70 leading-relaxed ${locale === "ar" ? "font-arabic" : "font-body"}`}>
                {t("footer.tagline")}
              </p>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold mb-4 text-primary-foreground/90">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <Link to="/products" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">Shop All</Link>
                <Link to="/intelligence" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">AI Intelligence</Link>
                <Link to="/brand" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">Our Story</Link>
              </div>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold mb-4 text-primary-foreground/90">Connect</h4>
              <div className="flex flex-col gap-3">
                <a href="https://wa.me/962790656666" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">
                  WhatsApp: +962 79 065 6666
                </a>
                <a href="https://www.instagram.com/asper.beauty.shop/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">
                  @asper.beauty.shop
                </a>
                <IncognitoToggle className="mt-1 border-primary-foreground/20 text-primary-foreground/60 hover:text-primary-foreground hover:border-primary-foreground/40" />
              </div>
            </div>
          </div>

          {/* Social Icons — All 9 Platforms */}
          <div className="mb-6">
            <h4 className="font-heading text-xs font-semibold mb-3 text-primary-foreground/70 uppercase tracking-[0.2em]">Follow Us</h4>
            <SocialIconsRow variant="footer" />
          </div>

        {/* 11. NPS Survey */}
        <Suspense fallback={<SectionSkeleton height="h-20" />}>
          <NPSSurvey />
        </Suspense>

        {/* 12. Trust Banner */}
        <Suspense fallback={<SectionSkeleton height="h-24" />}>
          <TrustBanner />
        </Suspense>
      </main>
      <Footer />

      {/* Lazy-loaded floating components (BeautyAssistant is global in App) */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingSocials />
      </Suspense>
    </div>
  );
};

export default Index;
