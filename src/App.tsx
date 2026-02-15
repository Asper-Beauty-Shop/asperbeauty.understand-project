import { useState, useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import BrandShowcase from "./pages/BrandShowcase";
import LabTools from "./pages/LabTools";
import Intelligence from "./pages/Intelligence";
import AdminEnrichment from "./pages/AdminEnrichment";
import Checkout from "./pages/Checkout";
import AIConcierge from "./components/AIConcierge";

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
  return (
    <>
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/brand" element={<BrandShowcase />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/intelligence" element={<Intelligence />} />
        <Route path="/lab" element={<LabTools />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/enrichment" element={<AdminEnrichment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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