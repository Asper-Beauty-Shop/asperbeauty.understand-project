import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ShopifyProduct } from '@/lib/shopify';

interface WishlistStore {
  items: ShopifyProduct[];
  toggleItem: (product: ShopifyProduct) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const exists = get().items.some(i => i.node.id === product.node.id);
        set({ items: exists ? get().items.filter(i => i.node.id !== product.node.id) : [...get().items, product] });
      },
      isInWishlist: (id) => get().items.some(i => i.node.id === id),
    }),
    { name: 'asper-wishlist', storage: createJSONStorage(() => localStorage) }
  )
);
