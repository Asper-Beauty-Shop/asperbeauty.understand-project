import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SplashScreen from "@/components/SplashScreen";
import { useIncognitoStore } from "./stores/incognitoStore";
import AIConcierge from "./components/AIConcierge";

// Lazy-load route pages to reduce initial bundle & main-thread work
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const BrandShowcase = lazy(() => import("./pages/BrandShowcase"));
const LabTools = lazy(() => import("./pages/LabTools"));
const Intelligence = lazy(() => import("./pages/Intelligence"));
const AdminEnrichment = lazy(() => import("./pages/AdminEnrichment"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/Contact"));
const Shop = lazy(() => import("./pages/Shop"));
const Health = lazy(() => import("./pages/Health"));
const MomBaby = lazy(() => import("./pages/MomBaby"));

const queryClient = new QueryClient();

/** Scroll restoration: save/restore scroll position per route */
function ScrollRestoration() {
  const location = useLocation();
  useEffect(() => {
    // Restore saved position for this path
    const saved = sessionStorage.getItem(`scroll-${location.pathname}`);
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
    } else {
      window.scrollTo(0, 0);
    }
    // Save position on leave
    return () => {
      sessionStorage.setItem(`scroll-${location.pathname}`, String(window.scrollY));
    };
  }, [location.pathname]);
  return null;
}

function AppContent() {
  useCartSync();
  const incognito = useIncognitoStore((s) => s.enabled);
  
  useEffect(() => {
    document.body.classList.toggle("incognito-mode", incognito);
  }, [incognito]);

  return (
    <>
      <ScrollRestoration />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/brand" element={<BrandShowcase />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/lab" element={<LabTools />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/enrichment" element={<AdminEnrichment />} />
          <Route path="/health" element={<Health />} />
          <Route path="/mom-baby" element={<MomBaby />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <AIConcierge />
    </>
  );
}

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash once per session
    if (sessionStorage.getItem("asper-splash-seen")) return false;
    return true;
  });

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem("asper-splash-seen", "true");
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;