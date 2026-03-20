/**
 * Product types and Supabase-backed data fetching.
 * Legacy "ShopifyProduct" type name is preserved for compatibility across 40+ files.
 */
import { supabase } from "@/integrations/supabase/client";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    vendor?: string;
    productType?: string;
    tags?: string[] | string;
    createdAt?: string | null;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange?: {
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    } | null;
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice?: {
            amount: string;
            currencyCode: string;
          } | null;
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface PaginatedProductsResponse {
  products: ShopifyProduct[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

// ── Supabase row → ShopifyProduct adapter ──

interface DbRow {
  id: string;
  title: string | null;
  name: string | null;
  description: string | null;
  handle: string | null;
  brand: string | null;
  category: string | null;
  price: number | null;
  image_url: string | null;
  tags: string[] | null;
  created_at: string | null;
  inventory_total?: number | null;
  availability_status: string | null;
  primary_concern: string | null;
  [key: string]: unknown;
}

function rowToProduct(row: DbRow): ShopifyProduct {
  const title = row.title || row.name || "Unnamed Product";
  const inStock = row.availability_status === "in_stock" || (row.inventory_total != null && row.inventory_total > 0);
  return {
    node: {
      id: row.id,
      title,
      description: row.description || "",
      handle: row.handle || row.id,
      vendor: row.brand || undefined,
      productType: row.category || undefined,
      tags: row.tags ?? [],
      createdAt: row.created_at,
      priceRange: {
        minVariantPrice: { amount: String(row.price ?? 0), currencyCode: "JOD" },
      },
      images: {
        edges: row.image_url
          ? [{ node: { url: row.image_url, altText: title } }]
          : [],
      },
      variants: {
        edges: [
          {
            node: {
              id: `${row.id}-default`,
              title: "Default",
              price: { amount: String(row.price ?? 0), currencyCode: "JOD" },
              compareAtPrice: null,
              availableForSale: inStock,
              selectedOptions: [],
            },
          },
        ],
      },
      options: [],
    },
  };
}

// ── Data fetching (Supabase-backed) ──

const PRODUCT_COLUMNS =
  "id, title, name, description, handle, brand, category, price, image_url, tags, created_at, inventory_total, availability_status, primary_concern, bestseller_rank";

export async function fetchProducts(
  first: number = 24,
  _query?: string,
): Promise<ShopifyProduct[]> {
  const q = supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("availability_status", "in_stock")
    .order("bestseller_rank", { ascending: true, nullsFirst: false })
    .limit(first);

  const { data, error } = await q;
  if (error) {
    console.error("fetchProducts error:", error);
    return [];
  }
  return (data ?? []).map(rowToProduct);
}

export async function fetchProductsPaginated(
  first: number = 24,
  after?: string | null,
  _query?: string,
): Promise<PaginatedProductsResponse> {
  const offset = after ? parseInt(after, 10) : 0;
  const { data, error, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("availability_status", "In_Stock")
    .order("bestseller_rank", { ascending: true, nullsFirst: false })
    .range(offset, offset + first - 1);

  if (error) {
    console.error("fetchProductsPaginated error:", error);
    return {
      products: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null },
    };
  }

  const products = (data ?? []).map(rowToProduct);
  const nextOffset = offset + first;
  const total = count ?? 0;

  return {
    products,
    pageInfo: {
      hasNextPage: nextOffset < total,
      hasPreviousPage: offset > 0,
      startCursor: String(offset),
      endCursor: String(nextOffset),
    },
  };
}

export async function searchProducts(
  searchTerm: string,
  first: number = 10,
): Promise<ShopifyProduct[]> {
  if (!searchTerm.trim()) return [];

  const { data, error } = await supabase
    .rpc("search_products", { search_query: searchTerm, max_results: first });

  if (error) {
    // Fallback to ilike text search if the RPC is unavailable.
    // Sanitize to remove characters that break the PostgREST filter syntax.
    const sanitized = searchTerm.replace(/[%_,()[\]]/g, " ").trim();
    const term = `%${sanitized}%`;
    const { data: fallback, error: fallbackError } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .or(`title.ilike.${term},name.ilike.${term},description.ilike.${term},brand.ilike.${term}`)
      .limit(first);

    if (fallbackError) {
      console.error("searchProducts error:", fallbackError);
      return [];
    }
    return (fallback ?? []).map((row: DbRow) => rowToProduct(row));
  }

  return (data ?? []).map((row: DbRow) => rowToProduct(row));
}

export async function fetchProductByHandle(handle: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`handle.eq.${handle},id.eq.${handle}`)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const p = rowToProduct(data as DbRow);
  return p.node;
}

/**
 * Normalize a price string to a number.
 */
export function normalizePrice(amount: string | number): number {
  if (typeof amount === "number") return amount;
  const parsed = parseFloat(amount);
  return isNaN(parsed) ? 0 : parsed;
}
