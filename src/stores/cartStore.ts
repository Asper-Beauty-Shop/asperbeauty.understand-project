import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  addLineToShopifyCart,
  createShopifyCart,
  fetchShopifyCart,
  removeLineFromShopifyCart,
  ShopifyProduct,
  updateShopifyCartLine,
} from "@/lib/shopify";

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
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isOpen: boolean;

  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  addMultipleFromPrescription: (
    products: PrescriptionProduct[],
  ) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  syncCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCheckoutUrl: () => string | null;
}

function prescriptionToCartItem(
  p: PrescriptionProduct,
): Omit<CartItem, "lineId"> {
  const cartProduct: ShopifyProduct = {
    node: {
      id: p.id,
      title: p.title,
      handle: p.id,
      description: p.description || "",
      vendor: p.brand || "",
      productType: p.category || "",
      images: {
        edges: p.image_url
          ? [{ node: { url: p.image_url, altText: p.title } }]
          : [],
      },
      priceRange: {
        minVariantPrice: {
          amount: String(p.price),
          currencyCode: "JOD",
        },
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
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      isOpen: false,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        set({ isLoading: true });
        try {
          if (!cartId) {
            // Create new cart with first item
            const result = await createShopifyCart(item);
            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
              });
            }
          } else if (existingItem) {
            // Update existing item quantity
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) {
              console.error(
                "Cannot update quantity for item without lineId:",
                existingItem,
              );
              return;
            }
            const result = await updateShopifyCartLine(
              cartId,
              existingItem.lineId,
              newQuantity,
            );
            if (result.success) {
              const currentItems = get().items;
              set({
                items: currentItems.map((i) =>
                  i.variantId === item.variantId
                    ? { ...i, quantity: newQuantity }
                    : i
                ),
              });
            } else if (result.cartNotFound) {
              clearCart();
              // Retry with new cart
              const newResult = await createShopifyCart(item);
              if (newResult) {
                set({
                  cartId: newResult.cartId,
                  checkoutUrl: newResult.checkoutUrl,
                  items: [{ ...item, lineId: newResult.lineId }],
                });
              }
            }
          } else {
            // Add new item to existing cart
            const result = await addLineToShopifyCart(cartId, item);
            if (result.success) {
              const currentItems = get().items;
              set({
                items: [...currentItems, {
                  ...item,
                  lineId: result.lineId ?? null,
                }],
              });
            } else if (result.cartNotFound) {
              clearCart();
              // Retry with new cart
              const newResult = await createShopifyCart(item);
              if (newResult) {
                set({
                  cartId: newResult.cartId,
                  checkoutUrl: newResult.checkoutUrl,
                  items: [{ ...item, lineId: newResult.lineId }],
                });
              }
            }
          }
        } catch (error) {
          console.error("Failed to add item:", error);
        } finally {
          set({ isLoading: false });
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

        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(
            cartId,
            item.lineId,
            quantity,
          );
          if (result.success) {
            const currentItems = get().items;
            set({
              items: currentItems.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i
              ),
            });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to update quantity:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) {
          // Just remove locally if no Shopify sync
          set({ items: items.filter((i) => i.variantId !== variantId) });
          return;
        }

        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const currentItems = get().items;
            const newItems = currentItems.filter((i) =>
              i.variantId !== variantId
            );
            if (newItems.length === 0) {
              clearCart();
            } else {
              set({ items: newItems });
            }
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to remove item:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setOpen: (isOpen) => set({ isOpen }),

      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;

        set({ isSyncing: true });
        try {
          const result = await fetchShopifyCart(cartId);
          if (!result.exists || result.totalQuantity === 0) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to sync cart with Shopify:", error);
        } finally {
          set({ isSyncing: false });
        }
      },

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
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    },
  ),
);
