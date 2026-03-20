import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import CinematicHero from "@/components/home/CinematicHero";
import { ScienceMeetsEleganceSplit } from "@/components/home/ScienceMeetsEleganceSplit";
import ThreeClickOnboarding from "@/components/home/ThreeClickOnboarding";
import DualPersonaTriage from "@/components/home/DualPersonaTriage";
import { USPBar } from "@/components/home/USPBar";
import { ProductSlider } from "@/components/home/ProductSlider";
import { ShopByProtocol } from "@/components/home/ShopByProtocol";
import { ElegantProductGrid } from "@/components/ElegantProductGrid";
import { CuratedClinicalGrid } from "@/components/CuratedClinicalGrid";
import { Footer } from "@/components/Footer";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";



// Lazy load below-the-fold components
const MorningSpaRitualBanner = lazy(() =>
  import("@/components/home/MorningSpaRitualBanner").then((m) => ({
    default: m.MorningSpaRitualBanner,
  }))
);
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
const ScienceMeetsStyle = lazy(() =>
  import("@/components/home/ScienceMeetsStyle").then((m) => ({
    default: m.ScienceMeetsStyle,
  }))
);
const DualPersonaBestsellers = lazy(() =>
  import("@/components/home/DualPersonaBestsellers").then((m) => ({
    default: m.DualPersonaBestsellers,
  }))
);
const GuidedDiscovery = lazy(() =>
  import("@/components/home/GuidedDiscovery").then((m) => ({
    default: m.GuidedDiscovery,
  }))
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
const AsperExperience = lazy(() =>
  import("@/components/home/AsperExperience").then((m) => ({
    default: m.AsperExperience,
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




const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  usePageMeta({
    title: "Asper Beauty | Jordan's No.1 Pharmacy Beauty Destination",
    description: "Discover 10,000+ premium skincare, haircare and beauty products curated by pharmacists in Amman, Jordan. Vichy, CeraVe, La Roche-Posay, Eucerin & more.",
    canonical: "/",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Asper Beauty",
      url: "https://www.asperbeautyshop.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.asperbeautyshop.com/shop?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  });

  const { data: newArrivals = [] } = useQuery({
    queryKey: ["new-arrivals-premium"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data || []).map((p) => ({
        id: p.id,
        handle: p.handle || p.id,
        title: p.title || p.name,
        brand: p.brand,
        price: p.price ?? 0,
        image_url: p.image_url || "/editorial-showcase-2.webp",
        image: p.image_url || "/editorial-showcase-2.webp",
        category: p.primary_concern,
        tag: p.clinical_badge || (p.is_bestseller ? "Bestseller" : undefined),
        tags: [] as string[],
        is_new: true,
      }));
    },
  });

  const { data: bestsellers = [] } = useQuery({
    queryKey: ["bestsellers-premium"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("bestseller_rank", { ascending: true })
        .limit(8);
      if (error) throw error;
      return (data || []).map((p) => ({
        id: p.id,
        handle: p.handle || p.id,
        title: p.title || p.name,
        brand: p.brand,
        price: p.price ?? 0,
        image_url: p.image_url || "/editorial-showcase-2.webp",
        image: p.image_url || "/editorial-showcase-2.webp",
        category: p.primary_concern,
        tag: p.clinical_badge || (p.is_bestseller ? "Bestseller" : undefined),
        is_on_sale: p.is_on_sale,
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
        {/* ═══ ZONE 1: Cinematic Full-Screen Video Hero ═══ */}
        <CinematicHero />

        {/* ═══ ZONE 2: Science Meets Elegance 50/50 Split ═══ */}
        <ScienceMeetsEleganceSplit />

        <ThreeClickOnboarding />

        {/* ═══ DermoBrands Bar ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-16" />}>
          <DermoBrands />
        </Suspense>

        {/* ═══ Morning Spa Ritual Banner ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <MorningSpaRitualBanner />
        </Suspense>

        {/* ═══ Science Meets Style Brand Logos ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <ScienceMeetsStyle />
        </Suspense>

        {/* ═══ Dual-Persona Triage (AI Gatekeeper) ═══ */}
        <DualPersonaTriage />

        {/* ═══ Shop by Protocol (Editorial Navigation) ═══ */}
        <ShopByProtocol />

        {/* ═══ Elegant Editorial Product Grid ═══ */}
        <ElegantProductGrid
          products={bestsellers.map((p) => ({
            id: p.id,
            handle: p.handle,
            title: p.title,
            brand: p.brand,
            price: p.price,
            image_url: p.image_url,
            tag: p.tag,
            category: p.category,
            is_new: false,
          }))}
          title={{ en: "Curated for You", ar: "مختارة لكِ" }}
          subtitle={{ en: "Pharmacist Approved", ar: "بإشراف صيدلاني" }}
          showCategoryFilter={false}
        />

        {/* ═══ Curated Clinical Grid — Frosted Glass ═══ */}
        <CuratedClinicalGrid
          products={[
            ...(newArrivals.length > 0 ? newArrivals : NEW_ARRIVALS).map((p) => ({
              id: p.id,
              handle: "handle" in p ? (p as { handle: string }).handle : p.id,
              title: p.title,
              brand: p.brand,
              price: "price" in p ? (p as { price: number }).price : 0,
              image_url: "image_url" in p ? (p as { image_url: string }).image_url : ("image" in p ? String((p as { image: unknown }).image) : ""),
              tag: "tag" in p ? (p as { tag?: string }).tag : undefined,
              category: "category" in p ? (p as { category?: string }).category : undefined,
            })),
          ]}
        />

        {/* ═══ Dual-Persona Tabbed Bestsellers ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          <DualPersonaBestsellers />
        </Suspense>

        {/* ═══ AI-Guided Discovery (Ms. Zain's Shade Guide) ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          <GuidedDiscovery />
        </Suspense>

        {/* ═══ Product Sliders (Bestsellers + New Arrivals) ═══ */}
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

        {/* ═══ EliteBrandShowcase (Authority) ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          <EliteBrandShowcase />
        </Suspense>

        {/* ═══ Clinical Dispatch (Editorial) ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <EditorialSpotlight />
        </Suspense>

        {/* ═══ Clinical Truth + Social Proof ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <ClinicalTruthBanner />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <ContextualSocialProof />
        </Suspense>

        {/* ═══ Conversion Close ═══ */}
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

        {/* ═══ The Asper Experience — Old video carousel relocated here ═══ */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <AsperExperience />
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
