import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShopifyAdminRequest {
  action: string;
  resource: string;
  id?: string | number;
  payload?: unknown;
}

export function useShopifyAdmin() {
  const [loading, setLoading] = useState(false);

  const invoke = useCallback(async <T = unknown>(request: ShopifyAdminRequest): Promise<T | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("shopify-admin-api", {
        body: request,
      });

      if (error) {
        toast.error("Shopify API error", { description: error.message });
        return null;
      }

      return data as T;
    } catch (err) {
      toast.error("Failed to reach Shopify API");
      console.error("Shopify admin invoke error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const listProducts = useCallback(() => invoke<{ products: ShopifyAdminProduct[] }>({
    action: "list", resource: "products",
  }), [invoke]);

  const listOrders = useCallback(() => invoke<{ orders: ShopifyAdminOrder[] }>({
    action: "list", resource: "orders",
  }), [invoke]);

  const listCustomers = useCallback(() => invoke<{ customers: ShopifyAdminCustomer[] }>({
    action: "list", resource: "customers",
  }), [invoke]);

  const listWebhooks = useCallback(() => invoke<{ webhooks: ShopifyWebhook[] }>({
    action: "list", resource: "webhooks",
  }), [invoke]);

  const createWebhook = useCallback((topic: string, address: string) => invoke({
    action: "create", resource: "webhooks",
    payload: { topic, address, format: "json" },
  }), [invoke]);

  const deleteWebhook = useCallback((id: number) => invoke({
    action: "delete", resource: "webhooks", id,
  }), [invoke]);

  return {
    loading,
    invoke,
    listProducts,
    listOrders,
    listCustomers,
    listWebhooks,
    createWebhook,
    deleteWebhook,
  };
}

// ── Types ──

export interface ShopifyAdminProduct {
  id: number;
  title: string;
  handle: string;
  vendor: string;
  product_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    compare_at_price: string | null;
    inventory_quantity: number;
    sku: string;
  }>;
  images: Array<{ id: number; src: string; alt: string | null }>;
  tags: string;
}

export interface ShopifyAdminOrder {
  id: number;
  name: string;
  email: string;
  created_at: string;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: string;
  currency: string;
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
  }>;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  shipping_address: {
    city: string;
    country: string;
    address1: string;
  } | null;
}

export interface ShopifyAdminCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  orders_count: number;
  total_spent: string;
  created_at: string;
  addresses: Array<{
    city: string;
    country: string;
  }>;
}

export interface ShopifyWebhook {
  id: number;
  topic: string;
  address: string;
  created_at: string;
  format: string;
}
