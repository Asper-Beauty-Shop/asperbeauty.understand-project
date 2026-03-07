import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import Hero from "@/components/home/AmbientVideoHero";
import DualPersonaTriage from "@/components/home/DualPersonaTriage";
import { USPBar } from "@/components/home/USPBar";
import { ProductSlider } from "@/components/home/ProductSlider";
import { ShopByProtocol } from "@/components/home/ShopByProtocol";
import { Footer } from "@/components/Footer";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load below-the-fold components
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
const EliteBrandShowcase = lazy(() =>
  import("@/components/home/EliteBrandShowcase")
);
const ClinicalTruthBanner = lazy(() =>
  import("@/components/home/ClinicalTruthBanner")
);
const ContextualSocialProof = lazy(() =>
  import("@/components/home/ContextualSocialProof")
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
  { id: "1", handle: "lumiere-bio-active-ceramide", title: "Lumière Bio-Active Ceramide · Barrier Repair Serum", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", tag: "Dermat-Tested" },
  { id: "2", handle: "botanical-barrier-recovery", title: "Botanical Barrier Recovery · Deep Hydration Cream", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1608248593842-8021c6475a6c?auto=format&fit=crop&w=800&q=80", tag: "Clinical" },
  { id: "3", handle: "phyto-retinol-elixir", title: "Phyto-Retinol Evening Elixir · Anti-Aging Treatment", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80", tag: "Just In" },
  { id: "4", handle: "niacinamide-clarifying-fluid", title: "Niacinamide 10% Clarifying Fluid · Pore-Refining Serum", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80" },
  { id: "5", handle: "marine-collagen-mask", title: "Marine Collagen Mask · 72-Hour Hydration Treatment", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1615397323758-1f196ebbaeb5?auto=format&fit=crop&w=800&q=80", tag: "Clinical" },
  { id: "6", handle: "aha-bha-resurfacing-peel", title: "AHA/BHA Resurfacing Peel · Brightening Exfoliant", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80" },
];

const BESTSELLERS = [
  { id: "7", handle: "hyaluronic-acid-booster", title: "Pure Hyaluronic Acid Booster · Intense Moisture Surge", brand: "La Roche-Posay", image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
  { id: "8", handle: "lipid-replenishing-balm", title: "Lipid-Replenishing Balm · Daily Barrier Protectant", brand: "CeraVe", image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
  { id: "9", handle: "mineral-uv-shield", title: "Mineral UV Shield SPF 50+ · Broad Spectrum Protection", brand: "Vichy", image: "https://images.unsplash.com/photo-1629532587596-f94dd6d9de4c?auto=format&fit=crop&w=800&q=80" },
  { id: "10", handle: "peptide-firming-eye", title: "Peptide Firming Eye Concentrate · Dark Circle Treatment", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
  { id: "11", handle: "thermal-spring-water", title: "Thermal Spring Water Mist · Soothing Mineral Tonic", brand: "Vichy", image: "https://images.unsplash.com/photo-1556228720-1c27bef8b5e6?auto=format&fit=crop&w=800&q=80" },
  { id: "12", handle: "soothing-cleansing-milk", title: "Soothing Cleansing Milk · Gentle Daily Purifier", brand: "Eucerin", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80", tag: "Bestseller" },
];

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
    const timer = setTimeout(() => setIsLoading(false), 1200);
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
        {/* ═══ ZONE 1: Split Editorial Hero (Magazine Cover) ═══ */}
        <Hero />

        {/* ═══ ZONE 2: Dual-Persona Triage (AI Gatekeeper) ═══ */}
        <DualPersonaTriage />

        {/* ═══ ZONE 3: Shop by Protocol (Editorial Navigation) ═══ */}
        <ShopByProtocol />

        {/* ═══ ZONE 4: Product Sliders (Bestsellers + New Arrivals) ═══ */}
        <ProductSlider
          title={{ en: "Bestsellers — Niche Approved", ar: "الأكثر مبيعاً — اختيار الخبراء" }}
          subtitle={{ en: "Most Loved", ar: "الأكثر حباً" }}
          products={bestsellers.length > 0 ? bestsellers : BESTSELLERS}
        />
        <ProductSlider
          title={{ en: "Just Landed! What's New", ar: "وصل حديثاً! الجديد لدينا" }}
          subtitle={{ en: "New Arrivals", ar: "وصل حديثاً" }}
          products={newArrivals.length > 0 ? newArrivals : NEW_ARRIVALS}
        />

        {/* ═══ ZONE 5: DermoBrands + EliteBrandShowcase (Authority) ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <DermoBrands />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          <EliteBrandShowcase />
        </Suspense>

        {/* ═══ ZONE 6: Clinical Dispatch (Editorial) ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <EditorialSpotlight />
        </Suspense>

        {/* ═══ ZONE 7: Clinical Truth + Social Proof ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <ClinicalTruthBanner />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <ContextualSocialProof />
        </Suspense>

        {/* ═══ ZONE 8: Conversion Close ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <BrandOfTheWeek />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <CelestialFeaturedCollection />
        </Suspense>

        {/* USP Bar */}
        <USPBar />

        {/* Featured Brands */}
        <Suspense fallback={<SectionSkeleton height="h-32" />}>
          <FeaturedBrands />
        </Suspense>

        {/* Newsletter */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <Newsletter />
        </Suspense>

        {/* NPS Survey */}
        <Suspense fallback={<SectionSkeleton height="h-20" />}>
          <NPSSurvey />
        </Suspense>

        {/* Trust Banner */}
        <Suspense fallback={<SectionSkeleton height="h-24" />}>
          <TrustBanner />
        </Suspense>
      </main>
      <Footer />

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
