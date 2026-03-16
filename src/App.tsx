import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import { verifyBrandDNA } from "@/lib/verifyBrandDNA";

import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Brands from "./pages/Brands";
import BrandVichy from "./pages/BrandVichy";
import BrandDetail from "./pages/BrandDetail";
import BestSellers from "./pages/BestSellers";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import SkinConcerns from "./pages/SkinConcerns";
import ConcernCollection from "./pages/ConcernCollection";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Philosophy from "./pages/Philosophy";
const BulkUpload = lazy(() => import("./pages/BulkUpload"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const ManageProducts = lazy(() => import("./pages/ManageProducts"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
import Shop from "./pages/Shop";
import ShopAllOrganized from "./components/ShopAllOrganized";
import DriverDashboard from "./pages/DriverDashboard";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AsperIntelligence from "./pages/AsperIntelligence";
import PurgeReview from "./pages/PurgeReview";
import BrandIntelligenceDashboard from "./pages/BrandIntelligenceDashboard";
import Health from "./pages/Health";
import RegimenPortal from "./pages/RegimenPortal";
import { RequireAdmin } from "./components/RequireAdmin";

const BeautyAssistant = lazy(() =>
  import("@/components/BeautyAssistant").then((m) => ({ default: m.BeautyAssistant })),
);
const FloatingConciergeWidget = lazy(() =>
  import("@/components/FloatingConciergeWidget").then((m) => ({ default: m.FloatingConciergeWidget })),
);


const queryClient = new QueryClient();

// Cart sync wrapper component
function CartSyncProvider({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}

// Clinical DNA verification: runs once on load to ensure brand tokens are active (see docs/LAUNCH_DAY_PROTOCOL.md)
function useBrandDNAGuard() {
  useEffect(() => {
    const t = setTimeout(verifyBrandDNA, 100);
    return () => clearTimeout(t);
  }, []);
}

const App = () => {
  useBrandDNAGuard();
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CartSyncProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-center" />
            <BrowserRouter>
              <Suspense fallback={null}>
                <BeautyAssistant />
                <FloatingConciergeWidget />
              </Suspense>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products" element={<Shop />} />
                <Route path="/shop/organized" element={<ShopAllOrganized />} />
                <Route path="/product/:handle" element={<ProductDetail />} />
                <Route path="/collections" element={<Collections />} />
                <Route
                  path="/collections/:slug"
                  element={<CollectionDetail />}
                />
                <Route path="/brands" element={<Brands />} />
                <Route path="/brands/vichy" element={<BrandVichy />} />
                <Route path="/brands/:slug" element={<BrandDetail />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/skin-concerns" element={<SkinConcerns />} />
                <Route
                  path="/concerns/:concernSlug"
                  element={<ConcernCollection />}
                />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account" element={<Account />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/philosophy" element={<Philosophy />} />
                <Route path="/intelligence" element={<AsperIntelligence />} />
                <Route path="/health" element={<Health />} />
                <Route path="/portal/regimen/:id" element={<RegimenPortal />} />
                <Route path="/admin/bulk-upload" element={<BulkUpload />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<ManageProducts />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/tracking" element={<Navigate to="/track-order" replace />} />
                <Route path="/shipping" element={<Navigate to="/contact" replace />} />
                <Route path="/returns" element={<Navigate to="/contact" replace />} />
                <Route path="/consultation" element={<Navigate to="/skin-concerns" replace />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                <Route path="/admin/purge-review" element={<PurgeReview />} />
                <Route
                  path="/brand-intelligence"
                  element={
                    <RequireAdmin>
                      <BrandIntelligenceDashboard />
                    </RequireAdmin>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartSyncProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
