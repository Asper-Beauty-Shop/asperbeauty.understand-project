import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductByHandle } from "@/lib/shopify";

export function useShopifyProducts(searchQuery?: string, first = 24, after?: string) {
  return useQuery({
    queryKey: ["shopify-products", searchQuery, first, after],
    queryFn: () => fetchProducts(first, searchQuery),
  });
}

export function useShopifyProduct(handle: string) {
  return useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
  });
}
