import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import Hero from "@/components/home/MixedMediaHero";
import ThreeClickOnboarding from "@/components/home/ThreeClickOnboarding";
import DualPersonaTriage from "@/components/home/DualPersonaTriage";
import { USPBar } from "@/components/home/USPBar";
import { ProductSlider } from "@/components/home/ProductSlider";
import { ShopByProtocol } from "@/components/home/ShopByProtocol";
import { Footer } from "@/components/Footer";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { isHomepageBrand } from "@/constants/premiumBrands";
import ceraveCleanserImg from "@/assets/products/cerave-foaming-cleanser.png";
import vichyAmpoulesImg from "@/assets/products/vichy-liftactiv-ampoules.png";
import biodermaSensibioImg from "@/assets/products/bioderma-sensibio-h2o.png";
import lrpTolerianeMoisturizerImg from "@/assets/products/lrp-toleriane-ultra.png";
import biodermaSensibioArImg from "@/assets/products/bioderma-sensibio-ar.png";
import lrpTolerianewashImg from "@/assets/products/lrp-toleriane-wash.png";
import vichyCapitalSoleilImg from "@/assets/products/vichy-capital-soleil.png";
import vichyNormadermImg from "@/assets/products/vichy-normaderm.png";

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
const ScienceMeetsStyle = lazy(() =>
  import("@/components/home/ScienceMeetsStyle").then((m) => ({
    default: m.ScienceMeetsStyle,
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
  { id: "1", handle: "lumiere-bio-active-ceramide", title: "LumiÃ¨re Bio-Active Ceramide Â· Barrier Repair Serum", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", tag: "Dermat-Tested" },
  { id: "2", handle: "botanical-barrier-recovery", title: "Botanical Barrier Recovery Â· Deep Hydration Cream", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1608248593842-8021c6475a6c?auto=format&fit=crop&w=800&q=80", tag: "Clinical" },
  { id: "3", handle: "phyto-retinol-elixir", title: "Phyto-Retinol Evening Elixir Â· Anti-Aging Treatment", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80", tag: "Just In" },
  { id: "4", handle: "niacinamide-clarifying-fluid", title: "Niacinamide 10% Clarifying Fluid Â· Pore-Refining Serum", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80" },
  { id: "5", handle: "marine-collagen-mask", title: "Marine Collagen Mask Â· 72-Hour Hydration Treatment", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1615397323758-1f196ebbaeb5?auto=format&fit=crop&w=800&q=80", tag: "Clinical" },
  { id: "6", handle: "aha-bha-resurfacing-peel", title: "AHA/BHA Resurfacing Peel Â· Brightening Exfoliant", brand: "Asper Clinical", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80" },
];

const BESTSELLERS = [
  { id: "7", handle: "cerave-foaming-facial-cleanser", title: "Foaming Facial Cleanser", brand: "CeraVe", image: ceraveCleanserImg, tag: "Bestseller" },
  { id: "8", handle: "vichy-liftactiv-peptide-c-ampoules", title: "LiftActiv Peptide-C Ampoules", brand: "Vichy", image: vichyAmpoulesImg, tag: "Bestseller" },
  { id: "9", handle: "bioderma-sensibio-h2o", title: "Sensibio H2O Micellar Water", brand: "Bioderma", image: biodermaSensibioImg },
  { id: "10", handle: "lrp-toleriane-ultra-moisturizer", title: "Toleriane Ultra Soothing Repair Moisturizer", brand: "La Roche-Posay", image: lrpTolerianeMoisturizerImg, tag: "Bestseller" },
  { id: "11", handle: "bioderma-sensibio-ar-cream", title: "Sensibio AR Anti-Redness Cream SPF 30", brand: "Bioderma", image: biodermaSensibioArImg },
  { id: "12", handle: "lrp-toleriane-hydrating-wash", title: "Toleriane Hydrating Gentle Face Wash", brand: "La Roche-Posay", image: lrpTolerianewashImg, tag: "Bestseller" },
  { id: "13", handle: "vichy-capital-soleil-uv-age", title: "Capital Soleil UV-Age Daily SPF 50+", brand: "Vichy", image: vichyCapitalSoleilImg },
  { id: "14", handle: "vichy-normaderm-phytosolution", title: "Normaderm Phytosolution Double-Correction Care", brand: "Vichy", image: vichyNormadermImg, tag: "Bestseller" },
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
        {/* â•â•â• ZONE 1: Split Editorial Hero (Magazine Cover) â•â•â• */}
        <Hero />
        <ThreeClickOnboarding />

        {/* â•â•â• DermoBrands Bar â€” Right below hero â•â•â• */}
        <Suspense fallback={<SectionSkeleton height="h-16" />}>
          <DermoBrands />
        </Suspense>

        {/* â•â•â• Science Meets Style Split Showcase â•â•â• */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <ScienceMeetsStyle />
        </Suspense>

        {/* â•â•â• ZONE 2: Dual-Persona Triage (AI Gatekeeper) â•â•â• */}
        <DualPersonaTriage />

        {/* â•â•â• ZONE 3: Shop by Protocol (Editorial Navigation) â•â•â• */}
        <ShopByProtocol />

        {/* â•â•â• ZONE 4: Product Sliders (Bestsellers + New Arrivals) â•â•â• */}
        <ProductSlider
          title={{ en: "Bestsellers â€” Niche Approved", ar: "Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹ â€” Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø®Ø¨Ø±Ø§Ø¡" }}
          subtitle={{ en: "Most Loved", ar: "Ø§Ù„Ø£ÙƒØ«Ø± Ø­Ø¨Ø§Ù‹" }}
          products={bestsellers.length > 0 ? bestsellers : BESTSELLERS}
        />
        <ProductSlider
          title={{ en: "Just Landed! What's New", ar: "ÙˆØµÙ„ Ø­Ø¯ÙŠØ«Ø§Ù‹! Ø§Ù„Ø¬Ø¯ÙŠØ¯ Ù„Ø¯ÙŠÙ†Ø§" }}
          subtitle={{ en: "New Arrivals", ar: "ÙˆØµÙ„ Ø­Ø¯ÙŠØ«Ø§Ù‹" }}
          products={newArrivals.length > 0 ? newArrivals : NEW_ARRIVALS}
        />

        {/* â•â•â• ZONE 5: EliteBrandShowcase (Authority) â•â•â• */}
        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          <EliteBrandShowcase />
        </Suspense>

        {/* â•â•â• ZONE 6: Clinical Dispatch (Editorial) â•â•â• */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <EditorialSpotlight />
        </Suspense>

        {/* â•â•â• ZONE 7: Clinical Truth + Social Proof â•â•â• */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <ClinicalTruthBanner />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <ContextualSocialProof />
        </Suspense>

        {/* â•â•â• ZONE 8: Conversion Close â•â•â• */}
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


