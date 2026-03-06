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
const DermoBrands = lazy(() =>
  import("@/components/home/DermoBrands").then((m) => ({ default: m.DermoBrands }))
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

// Sample product data for sliders - Medical Luxury & Botanical Precision Aesthetic
const NEW_ARRIVALS = [
  { id: "1", handle: "lumiere-bio-active-ceramide", title: "Lumière Bio-Active Ceramide Serum", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", tag: "Dermat-Tested" },
  { id: "2", handle: "botanical-barrier-recovery", title: "Botanical Barrier Recovery Cream", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1608248593842-8021c6475a6c?auto=format&fit=crop&w=800&q=80", tag: "Clinical" },
  { id: "3", handle: "phyto-retinol-elixir", title: "Phyto-Retinol Evening Elixir", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80", tag: "Just In" },
  { id: "4", handle: "niacinamide-clarifying-fluid", title: "Niacinamide 10% Clarifying Fluid", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80" },
  { id: "5", handle: "marine-collagen-mask", title: "Marine Collagen Hydration Mask", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1615397323758-1f196ebbaeb5?auto=format&fit=crop&w=800&q=80", tag: "Clinical" },
  { id: "6", handle: "aha-bha-resurfacing-peel", title: "AHA/BHA Resurfacing Peel", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80" },
];

const BESTSELLERS = [
  { id: "7", handle: "hyaluronic-acid-booster", title: "Pure Hyaluronic Acid Booster", brand: "La Roche-Posay", image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
  { id: "8", handle: "lipid-replenishing-balm", title: "Lipid-Replenishing Daily Balm", brand: "CeraVe", image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
  { id: "9", handle: "mineral-uv-shield", title: "Mineral UV Shield SPF 50+", brand: "Vichy", image: "https://images.unsplash.com/photo-1629532587596-f94dd6d9de4c?auto=format&fit=crop&w=800&q=80" },
  { id: "10", handle: "peptide-firming-eye", title: "Peptide Firming Eye Concentrate", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
  { id: "11", handle: "thermal-spring-water", title: "Thermal Spring Water Mist", brand: "Vichy", image: "https://images.unsplash.com/photo-1556228720-1c27bef8b5e6?auto=format&fit=crop&w=800&q=80" },
  { id: "12", handle: "soothing-cleansing-milk", title: "Soothing Cleansing Milk", brand: "Eucerin", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
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

        {/* 2b. Dermocosmetic Brands Grid */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <DermoBrands />
        </Suspense>

        {/* 3. Product Slider — Just Landed / What's New */}
        <ProductSlider
          title={{ en: "Just Landed! What's New", ar: "وصل حديثاً! الجديد لدينا" }}
          subtitle={{ en: "New Arrivals", ar: "وصل حديثاً" }}
          products={newArrivals.length > 0 ? newArrivals : NEW_ARRIVALS}
        />

        {/* 4. Product Slider — Bestsellers */}
        <ProductSlider
          title={{ en: "Bestsellers — Niche Approved", ar: "الأكثر مبيعاً — اختيار الخبراء" }}
          subtitle={{ en: "Most Loved", ar: "الأكثر حباً" }}
          products={bestsellers.length > 0 ? bestsellers : BESTSELLERS}
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

