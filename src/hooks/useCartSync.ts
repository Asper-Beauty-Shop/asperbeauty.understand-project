import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";

/**
 * Hook to sync cart with Shopify when user returns from checkout
 * or switches back to the tab. Clears cart if checkout was completed.
 */
export function useCartSync() {
  const syncCart = useCartStore((state) => state.syncCart);

  useEffect(() => {
    // Sync on initial page load (handles browser refresh after checkout)
    syncCart();

    // Sync when user returns to the tab (handles return from checkout in new tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncCart();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [syncCart]);
}
