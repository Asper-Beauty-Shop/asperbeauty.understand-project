import { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";

/**
 * Syncs the local cart with Shopify on page load and when the user
 * returns to the tab (e.g. after completing checkout in another tab).
 * Clears the local cart if the Shopify cart is empty / completed.
 */
export function useCartSync() {
  const syncCart = useCartStore((state) => state.syncCart);

  useEffect(() => {
    syncCart();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncCart();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [syncCart]);
}
