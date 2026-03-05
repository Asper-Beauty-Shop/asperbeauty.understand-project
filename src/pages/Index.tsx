import { lazy, Suspense, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CelestialFeaturedCollection from "@/components/CelestialFeaturedCollection";
import BrandStory from "@/components/BrandStory";
import ShopByConcern from "@/components/home/ShopByConcern";
import ConciergeShowcase from "@/components/home/ConciergeShowcase";
import { Footer } from "@/components/Footer";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-load below-the-fold sections
const FeaturedBrands = lazy(() =>
  import("@/components/FeaturedBrands").then((m) => ({ default: m.FeaturedBrands }))
);
const Testimonials = lazy(() =>
  import("@/components/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const Newsletter = lazy(() =>
  import("@/components/Newsletter").then((m) => ({ default: m.Newsletter }))
);
const TrustBanner = lazy(() =>
  import("@/components/TrustBanner").then((m) => ({ default: m.TrustBanner }))
);
const ScrollToTop = lazy(() =>
  import("@/components/ScrollToTop").then((m) => ({ default: m.ScrollToTop }))
);
const FloatingSocials = lazy(() =>
  import("@/components/FloatingSocials").then((m) => ({ default: m.FloatingSocials }))
);

const SectionSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} bg-background animate-pulse`}>
    <div className="max-w-7xl mx-auto px-6 py-12">
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    const handleLoad = () => setIsLoading(false);
    window.addEventListener("load", handleLoad);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (isLoading) return <PageLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      <main>
        {/* 1 — HERO: Split editorial, video right */}
        <HeroSection />

        {/* 2 — SHOP BY CONCERN: Conversion-first, direct to categories */}
        <ShopByConcern />

        {/* 3 — FEATURED COLLECTION: Live Shopify products */}
        <CelestialFeaturedCollection />

        {/* 4 — AI CONCIERGE SHOWCASE: Dr. Sami / Ms. Zain demo */}
        <ConciergeShowcase />

        {/* 5 — BRAND STORY: Credibility & trust */}
        <BrandStory />

        {/* 6 — FEATURED BRANDS: Brand logos & marquee (lazy) */}
        <Suspense fallback={<SectionSkeleton height="h-32" />}>
          <FeaturedBrands />
        </Suspense>

        {/* 7 — TESTIMONIALS: Social proof (lazy) */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <Testimonials />
        </Suspense>

        {/* 8 — NEWSLETTER: Email capture (lazy) */}
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <Newsletter />
        </Suspense>

        {/* 9 — TRUST BANNER: Final conversion anchor (lazy) */}
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
