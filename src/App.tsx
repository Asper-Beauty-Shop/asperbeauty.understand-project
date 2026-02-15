import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import BrandShowcase from "./pages/BrandShowcase";
import LabTools from "./pages/LabTools";
import Intelligence from "./pages/Intelligence";
import AdminEnrichment from "./pages/AdminEnrichment";
import AIConcierge from "./components/AIConcierge";

const queryClient = new QueryClient();

function AppContent() {
  useCartSync();
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/brand" element={<BrandShowcase />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/intelligence" element={<Intelligence />} />
        <Route path="/lab" element={<LabTools />} />
        <Route path="/admin/enrichment" element={<AdminEnrichment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIConcierge />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
