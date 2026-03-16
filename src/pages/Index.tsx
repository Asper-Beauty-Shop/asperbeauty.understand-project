import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import CinematicHero from "@/components/home/CinematicHero";
import { ScienceMeetsEleganceSplit } from "@/components/home/ScienceMeetsEleganceSplit";
import { USPBar } from "@/components/home/USPBar";
import { ProductSlider } from "@/components/home/ProductSlider";
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
import ceraveMoisturizingCreamImg from "@/assets/products/cerave-moisturizing-cream.png";
import olaplexNo7Img from "@/assets/products/olaplex-no7-bonding-oil.png";
import neocellCollagenImg from "@/assets/products/neocell-collagen-c.png";
import eucerinSunImg from "@/assets/products/eucerin-sun-hydro-spf50.png";
import aminasCalendulaImg from "@/assets/products/aminas-calendula-cream.png";

// Lazy load below-the-fold sections
const MorningSpaRitualBanner = lazy(() =>
  import("@/components/home/MorningSpaRitualBanner").then((m) => ({
    default: m.MorningSpaRitualBanner,
  }))
);
const ScienceMeetsStyle = lazy(() =>
  import("@/components/home/ScienceMeetsStyle").then((m) => ({
    default: m.ScienceMeetsStyle,
  }))
);
const EliteBrandShowcase = lazy(() =>
  import("@/components/home/EliteBrandShowcase")
);
const ContextualSocialProof = lazy(() =>
  import("@/components/home/ContextualSocialProof")
);
const Newsletter = lazy(() =>
  import("@/components/Newsletter").then((m) => ({ default: m.Newsletter }))
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

// Smooth section wrapper — fades in as it enters the viewport.
// Respects the OS-level "prefers-reduced-motion" setting by skipping
// the animation for users who have requested reduced motion.
const FadeInSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

// Sample product data for sliders
const NEW_ARRIVALS = [
  { id: "1", handle: "cerave-moisturizing-cream", title: "Moisturizing Cream", brand: "CeraVe", image: ceraveMoisturizingCreamImg, tag: "Dermat-Tested" },
  { id: "2", handle: "olaplex-no7-bonding-oil", title: "No.7 Bonding Oil", brand: "Olaplex", image: olaplexNo7Img, tag: "Just In" },
  { id: "3", handle: "neocell-super-collagen-c", title: "Super Collagen + C", brand: "NeoCell", image: neocellCollagenImg, tag: "Wellness" },
  { id: "4", handle: "eucerin-sun-hydro-protect-spf50", title: "Sun Hydro Protect Ultra-Light Fluid SPF50+", brand: "Eucerin", image: eucerinSunImg, tag: "Clinical" },
  { id: "5", handle: "vichy-capital-soleil-uv-age", title: "Capital Soleil UV-Age Daily SPF 50+", brand: "Vichy", image: vichyCapitalSoleilImg },
  { id: "6", handle: "bioderma-sensibio-h2o", title: "Sensibio H2O Micellar Water", brand: "Bioderma", image: biodermaSensibioImg, tag: "Bestseller" },
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
  { id: "15", handle: "aminas-calendula-face-body-cream", title: "Calendula Face & Body Cream", brand: "Amina's Natural Skincare", image: aminasCalendulaImg, tag: "Jordanian Heritage" },
];

const Index = () => {
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
        {/* ══════════════════════════════════════════════
            ZONE 1 — Full-Screen Cinematic Hero
        ══════════════════════════════════════════════ */}
        <CinematicHero />

        {/* ══════════════════════════════════════════════
            ZONE 2 — Trust Signals
        ══════════════════════════════════════════════ */}
        <USPBar />

        {/* ══════════════════════════════════════════════
            ZONE 3 — Clinical vs Luxury 50/50 Split
        ══════════════════════════════════════════════ */}
        <FadeInSection>
          <ScienceMeetsEleganceSplit />
        </FadeInSection>

        {/* ══════════════════════════════════════════════
            ZONE 4 — Bestselling Products Slider
        ══════════════════════════════════════════════ */}
        <FadeInSection>
          <ProductSlider
            title={{ en: "Bestsellers — Niche Approved", ar: "الأكثر مبيعاً — اختيار الخبراء" }}
            subtitle={{ en: "Most Loved", ar: "الأكثر حباً" }}
            products={bestsellers.length > 0 ? bestsellers : BESTSELLERS}
          />
        </FadeInSection>

        {/* ══════════════════════════════════════════════
            ZONE 5 — Morning Spa Editorial Banner
        ══════════════════════════════════════════════ */}
        <Suspense fallback={<SectionSkeleton height="h-[480px]" />}>
          <FadeInSection>
            <MorningSpaRitualBanner />
          </FadeInSection>
        </Suspense>

        {/* ══════════════════════════════════════════════
            ZONE 6 — New Arrivals Slider
        ══════════════════════════════════════════════ */}
        <FadeInSection>
          <ProductSlider
            title={{ en: "Just Landed! What's New", ar: "وصل حديثاً! الجديد لدينا" }}
            subtitle={{ en: "New Arrivals", ar: "وصل حديثاً" }}
            products={newArrivals.length > 0 ? newArrivals : NEW_ARRIVALS}
          />
        </FadeInSection>

        {/* ══════════════════════════════════════════════
            ZONE 7 — Brand Logo Showcase
        ══════════════════════════════════════════════ */}
        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <FadeInSection>
            <ScienceMeetsStyle />
          </FadeInSection>
        </Suspense>

        {/* ══════════════════════════════════════════════
            ZONE 8 — Elite Brand Showcase
        ══════════════════════════════════════════════ */}
        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          <FadeInSection>
            <EliteBrandShowcase />
          </FadeInSection>
        </Suspense>

        {/* ══════════════════════════════════════════════
            ZONE 9 — Social Proof / Reviews
        ══════════════════════════════════════════════ */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <FadeInSection>
            <ContextualSocialProof />
          </FadeInSection>
        </Suspense>

        {/* ══════════════════════════════════════════════
            ZONE 10 — Newsletter Sign-Up
        ══════════════════════════════════════════════ */}
        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <FadeInSection>
            <Newsletter />
          </FadeInSection>
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
