import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import { verifyBrandDNA } from "@/lib/verifyBrandDNA";
import { RequireAdmin } from "./components/RequireAdmin";

// ── Critical above-the-fold pages (eager) ──────────────────────────────────
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// ── All other pages (lazy-loaded) ──────────────────────────────────────────
const Shop                    = lazy(() => import("./pages/Shop"));
const ProductDetail           = lazy(() => import("./pages/ProductDetail"));
const Collections             = lazy(() => import("./pages/Collections"));
const CollectionDetail        = lazy(() => import("./pages/CollectionDetail"));
const Brands                  = lazy(() => import("./pages/Brands"));
const BrandVichy              = lazy(() => import("./pages/BrandVichy"));
const BrandDetail             = lazy(() => import("./pages/BrandDetail"));
const BestSellers             = lazy(() => import("./pages/BestSellers"));
const Offers                  = lazy(() => import("./pages/Offers"));
const Contact                 = lazy(() => import("./pages/Contact"));
const SkinConcerns            = lazy(() => import("./pages/SkinConcerns"));
const ConcernCollection       = lazy(() => import("./pages/ConcernCollection"));
const Wishlist                = lazy(() => import("./pages/Wishlist"));
const Auth                    = lazy(() => import("./pages/Auth"));
const Account                 = lazy(() => import("./pages/Account"));
const Profile                 = lazy(() => import("./pages/Profile"));
const Philosophy              = lazy(() => import("./pages/Philosophy"));
const AsperIntelligence       = lazy(() => import("./pages/AsperIntelligence"));
const Health                  = lazy(() => import("./pages/Health"));
const RegimenPortal           = lazy(() => import("./pages/RegimenPortal"));
const TrackOrder              = lazy(() => import("./pages/TrackOrder"));
const ShopAllOrganized        = lazy(() => import("./components/ShopAllOrganized"));

// ── Admin pages (laziest — only load when admin navigates there) ────────────
const BulkUpload              = lazy(() => import("./pages/BulkUpload"));
const AdminOrders             = lazy(() => import("./pages/AdminOrders"));
const ManageProducts          = lazy(() => import("./pages/ManageProducts"));
const DriverDashboard         = lazy(() => import("./pages/DriverDashboard"));
const AdminAuditLogs          = lazy(() => import("./pages/AdminAuditLogs"));
const PurgeReview             = lazy(() => import("./pages/PurgeReview"));
const BrandIntelligenceDashboard = lazy(() => import("./pages/BrandIntelligenceDashboard"));

// ── Floating widgets ────────────────────────────────────────────────────────
const BeautyAssistant = lazy(() =>
  import("@/components/BeautyAssistant").then((m) => ({ default: m.BeautyAssistant })),
);
const FloatingConciergeWidget = lazy(() =>
  import("@/components/FloatingConciergeWidget").then((m) => ({ default: m.FloatingConciergeWidget })),
);

const queryClient = new QueryClient();

function CartSyncProvider({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}

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
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/"                    element={<Index />} />
                  <Route path="/chat"                element={<Index />} />
                  <Route path="/shop"                element={<Shop />} />
                  <Route path="/products"            element={<Shop />} />
                  <Route path="/shop/organized"      element={<ShopAllOrganized />} />
                  <Route path="/product/:handle"     element={<ProductDetail />} />
                  <Route path="/collections"         element={<Collections />} />
                  <Route path="/collections/:slug"   element={<CollectionDetail />} />
                  <Route path="/brands"              element={<Brands />} />
                  <Route path="/brands/vichy"        element={<BrandVichy />} />
                  <Route path="/brands/:slug"        element={<BrandDetail />} />
                  <Route path="/best-sellers"        element={<BestSellers />} />
                  <Route path="/offers"              element={<Offers />} />
                  <Route path="/contact"             element={<Contact />} />
                  <Route path="/skin-concerns"       element={<SkinConcerns />} />
                  <Route path="/concerns/:concernSlug" element={<ConcernCollection />} />
                  <Route path="/wishlist"            element={<Wishlist />} />
                  <Route path="/auth"                element={<Auth />} />
                  <Route path="/account"             element={<Account />} />
                  <Route path="/profile"             element={<Profile />} />
                  <Route path="/philosophy"          element={<Philosophy />} />
                  <Route path="/intelligence"        element={<AsperIntelligence />} />
                  <Route path="/health"              element={<Health />} />
                  <Route path="/portal/regimen/:id"  element={<RegimenPortal />} />
                  <Route path="/track-order"         element={<TrackOrder />} />
                  <Route path="/tracking"            element={<Navigate to="/track-order" replace />} />
                  <Route path="/shipping"            element={<Navigate to="/contact" replace />} />
                  <Route path="/returns"             element={<Navigate to="/contact" replace />} />
                  <Route path="/consultation"        element={<Navigate to="/skin-concerns" replace />} />
                  <Route path="/driver"              element={<DriverDashboard />} />
                  <Route path="/admin/bulk-upload"   element={<BulkUpload />} />
                  <Route path="/admin/orders"        element={<AdminOrders />} />
                  <Route path="/admin/products"      element={<ManageProducts />} />
                  <Route path="/admin/audit-logs"    element={<AdminAuditLogs />} />
                  <Route path="/admin/purge-review"  element={<PurgeReview />} />
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
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </CartSyncProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
