/**
 * Route prefetching — triggers lazy import on hover so the JS chunk
 * is already cached when the user clicks.
 *
 * Usage: <Link onMouseEnter={() => prefetch('/shop')} to="/shop">
 */

const routeImports: Record<string, () => Promise<unknown>> = {
  "/shop": () => import("@/pages/Shop"),
  "/products": () => import("@/pages/Shop"),
  "/brands": () => import("@/pages/Brands"),
  "/brands/vichy": () => import("@/pages/BrandVichy"),
  "/best-sellers": () => import("@/pages/BestSellers"),
  "/offers": () => import("@/pages/Offers"),
  "/skin-concerns": () => import("@/pages/SkinConcerns"),
  "/collections": () => import("@/pages/Collections"),
  "/contact": () => import("@/pages/Contact"),
  "/wishlist": () => import("@/pages/Wishlist"),
  "/philosophy": () => import("@/pages/Philosophy"),
  "/track-order": () => import("@/pages/TrackOrder"),
  "/auth": () => import("@/pages/Auth"),
};

const prefetched = new Set<string>();

export function prefetchRoute(path: string) {
  // Normalise: strip query/hash, match prefix for dynamic routes
  const clean = path.split("?")[0].split("#")[0];

  if (prefetched.has(clean)) return;

  // Exact match
  if (routeImports[clean]) {
    prefetched.add(clean);
    routeImports[clean]();
    return;
  }

  // Prefix match for dynamic routes like /brands/:slug
  for (const key of Object.keys(routeImports)) {
    if (clean.startsWith(key + "/") || clean.startsWith(key)) {
      prefetched.add(clean);
      routeImports[key]();
      return;
    }
  }
}
