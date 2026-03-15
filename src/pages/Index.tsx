import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Footer } from "@/components/Footer";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { isHomepageBrand } from "@/constants/premiumBrands";
// Fallback product images — lazy-loaded only when DB query returns empty
const productImageImports = {
  cerave: () => import("@/assets/products/cerave-foaming-cleanser.png"),
  vichy: () => import("@/assets/products/vichy-liftactiv-ampoules.png"),
  bioderma: () => import("@/assets/products/bioderma-sensibio-h2o.png"),
  lrpMoisturizer: () => import("@/assets/products/lrp-toleriane-ultra.png"),
  biodermaAr: () => import("@/assets/products/bioderma-sensibio-ar.png"),
  lrpWash: () => import("@/assets/products/lrp-toleriane-wash.png"),
  vichySoleil: () => import("@/assets/products/vichy-capital-soleil.png"),
  vichyNormaderm: () => import("@/assets/products/vichy-normaderm.png"),
  ceraveCream: () => import("@/assets/products/cerave-moisturizing-cream.png"),
  olaplex: () => import("@/assets/products/olaplex-no7-bonding-oil.png"),
  neocell: () => import("@/assets/products/neocell-collagen-c.png"),
  eucerin: () => import("@/assets/products/eucerin-sun-hydro-spf50.png"),
  aminas: () => import("@/assets/products/aminas-calendula-cream.png"),
};
void productImageImports; // suppress unused warning — used as lazy fallback reference

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

// Placeholder fallback image for when DB is empty (no eager imports)
const PLACEHOLDER_IMG = "/editorial-showcase-2.jpg";

// Sample product data for sliders — using placeholder; DB data takes priority
const NEW_ARRIVALS = [
  { id: "1", handle: "cerave-moisturizing-cream", title: "Moisturizing Cream", brand: "CeraVe", image: PLACEHOLDER_IMG, tag: "Dermat-Tested" },
  { id: "2", handle: "olaplex-no7-bonding-oil", title: "No.7 Bonding Oil", brand: "Olaplex", image: PLACEHOLDER_IMG, tag: "Just In" },
  { id: "3", handle: "neocell-super-collagen-c", title: "Super Collagen + C", brand: "NeoCell", image: PLACEHOLDER_IMG, tag: "Wellness" },
  { id: "4", handle: "eucerin-sun-hydro-protect-spf50", title: "Sun Hydro Protect Ultra-Light Fluid SPF50+", brand: "Eucerin", image: PLACEHOLDER_IMG, tag: "Clinical" },
  { id: "5", handle: "vichy-capital-soleil-uv-age", title: "Capital Soleil UV-Age Daily SPF 50+", brand: "Vichy", image: PLACEHOLDER_IMG },
  { id: "6", handle: "bioderma-sensibio-h2o", title: "Sensibio H2O Micellar Water", brand: "Bioderma", image: PLACEHOLDER_IMG, tag: "Bestseller" },
];

const BESTSELLERS = [
  { id: "7", handle: "cerave-foaming-facial-cleanser", title: "Foaming Facial Cleanser", brand: "CeraVe", image: PLACEHOLDER_IMG, tag: "Bestseller" },
  { id: "8", handle: "vichy-liftactiv-peptide-c-ampoules", title: "LiftActiv Peptide-C Ampoules", brand: "Vichy", image: PLACEHOLDER_IMG, tag: "Bestseller" },
  { id: "9", handle: "bioderma-sensibio-h2o", title: "Sensibio H2O Micellar Water", brand: "Bioderma", image: PLACEHOLDER_IMG },
  { id: "10", handle: "lrp-toleriane-ultra-moisturizer", title: "Toleriane Ultra Soothing Repair Moisturizer", brand: "La Roche-Posay", image: PLACEHOLDER_IMG, tag: "Bestseller" },
  { id: "11", handle: "bioderma-sensibio-ar-cream", title: "Sensibio AR Anti-Redness Cream SPF 30", brand: "Bioderma", image: PLACEHOLDER_IMG },
  { id: "12", handle: "lrp-toleriane-hydrating-wash", title: "Toleriane Hydrating Gentle Face Wash", brand: "La Roche-Posay", image: PLACEHOLDER_IMG, tag: "Bestseller" },
  { id: "13", handle: "vichy-capital-soleil-uv-age", title: "Capital Soleil UV-Age Daily SPF 50+", brand: "Vichy", image: PLACEHOLDER_IMG },
  { id: "14", handle: "vichy-normaderm-phytosolution", title: "Normaderm Phytosolution Double-Correction Care", brand: "Vichy", image: PLACEHOLDER_IMG, tag: "Bestseller" },
  { id: "15", handle: "aminas-calendula-face-body-cream", title: "Calendula Face & Body Cream", brand: "Amina's Natural Skincare", image: PLACEHOLDER_IMG, tag: "Jordanian Heritage" },
];

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { data: newArrivals = [] } = useQuery({
    queryKey: ["new-arrivals-premium"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data || [])
        .filter((p) => isHomepageBrand(p.brand))
        .slice(0, 8)
        .map((p) => ({
          id: p.id,
          title: p.title,
          brand: p.brand,
          price: p.price ?? 0,
          image_url: p.image_url || "/editorial-showcase-2.jpg",
          category: p.primary_concern,
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
        .order("created_at", { ascending: true })
        .limit(30);
      if (error) throw error;
      return (data || [])
        .filter((p) => isHomepageBrand(p.brand))
        .slice(0, 8)
        .map((p) => ({
          id: p.id,
          title: p.title,
          brand: p.brand,
          price: p.price ?? 0,
          image_url: p.image_url || "/editorial-showcase-2.jpg",
          category: p.primary_concern,
          is_on_sale: false,
        }));
    },
  });

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    const timer = setTimeout(() => setIsLoading(false), 300);
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
