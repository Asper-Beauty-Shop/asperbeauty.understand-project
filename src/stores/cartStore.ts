import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ShopifyProduct } from "@/lib/shopify";

/** Product shape from bot / prescription (Supabase products or bot response). */
export interface PrescriptionProduct {
  id: string;
  title: string;
  price: number;
  image_url?: string | null;
  brand?: string | null;
  category?: string | null;
  original_price?: number | null;
  description?: string | null;
}

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;

  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  addMultipleFromPrescription: (products: PrescriptionProduct[]) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

function prescriptionToCartItem(p: PrescriptionProduct): Omit<CartItem, "lineId"> {
  const cartProduct: ShopifyProduct = {
    node: {
      id: p.id,
      title: p.title,
      handle: p.id,
      description: p.description || "",
      vendor: p.brand || "",
      productType: p.category || "",
      images: {
        edges: p.image_url ? [{ node: { url: p.image_url, altText: p.title } }] : [],
      },
      priceRange: {
        minVariantPrice: { amount: String(p.price), currencyCode: "JOD" },
      },
      variants: {
        edges: [{
          node: {
            id: `${p.id}-default`,
            title: "Default",
            price: { amount: String(p.price), currencyCode: "JOD" },
            compareAtPrice: p.original_price
              ? { amount: String(p.original_price), currencyCode: "JOD" }
              : null,
            availableForSale: true,
            selectedOptions: [],
          },
        }],
      },
      options: [],
    },
  };
  return {
    product: cartProduct,
    variantId: `${p.id}-default`,
    variantTitle: "Default",
    price: { amount: String(p.price), currencyCode: "JOD" },
    quantity: 1,
    selectedOptions: [],
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,

      addItem: async (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, lineId: item.variantId }] });
        }
      },

      addMultipleFromPrescription: async (products) => {
        if (!products.length) return;
        set({ isLoading: true });
        try {
          for (const p of products) {
            await get().addItem(prescriptionToCartItem(p));
          }
          set({ isOpen: true });
        } catch (error) {
          console.error("Failed to add routine to cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        });
      },

      removeItem: async (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setOpen: (isOpen) => set({ isOpen }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + (parseFloat(item.price.amount) * item.quantity),
          0,
        );
      },
    }),
    {
      name: "asper-beauty-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
