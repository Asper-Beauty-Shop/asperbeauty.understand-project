/**
 * Shopify Storefront API client for Asper Beauty Shop.
 */

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN ?? "asper-beauty-shop.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN ?? "";
const API_VERSION = "2025-07";

// ── Types ────────────────────────────────────────────────────────────

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    vendor: string;
    productType: string;
    tags?: string[];
    createdAt?: string;
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
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
    options?: Array<{
      id?: string;
      name: string;
      values: string[];
    }>;
  };
}

export interface PaginatedProductsResponse {
  products: ShopifyProduct[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

// ── Core GraphQL helper ──────────────────────────────────────────────

export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
  const url = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status}`);
  }

  return res.json();
}

// ── Utility ──────────────────────────────────────────────────────────

export function normalizePrice(amount: string | number): number {
  if (typeof amount === "number") return amount;
  return parseFloat(amount.replace(",", ".").trim()) || 0;
}

// ── Product Queries ──────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  vendor
  productType
  tags
  images(first: 3) {
    edges {
      node {
        url
        altText
      }
    }
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 10) {
    edges {
      node {
        id
        title
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
  }
  options {
    id
    name
    values
  }
`;

export async function fetchProducts(
  first = 24,
  searchQuery?: string,
): Promise<ShopifyProduct[]> {
  const queryArg = searchQuery ? `, query: $query` : "";
  const varDef = searchQuery
    ? "($first: Int!, $query: String!)"
    : "($first: Int!)";

  const gql = `
    query ${varDef} {
      products(first: $first${queryArg}) {
        edges {
          node { ${PRODUCT_FIELDS} }
        }
      }
    }
  `;

  const variables: Record<string, unknown> = { first };
  if (searchQuery) variables.query = searchQuery;

  const data = (await storefrontApiRequest(gql, variables)) as {
    data?: { products?: { edges?: ShopifyProduct[] } };
  };

  return data?.data?.products?.edges ?? [];
}

export async function fetchProductsPaginated(
  first = 24,
  after?: string | null,
): Promise<PaginatedProductsResponse> {
  const gql = `
    query ($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node { ${PRODUCT_FIELDS} }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const variables: Record<string, unknown> = { first };
  if (after) variables.after = after;

  const data = (await storefrontApiRequest(gql, variables)) as {
    data?: {
      products?: {
        edges?: ShopifyProduct[];
        pageInfo?: PaginatedProductsResponse["pageInfo"];
      };
    };
  };

  return {
    products: data?.data?.products?.edges ?? [],
    pageInfo: data?.data?.products?.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

export async function fetchProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const gql = `
    query ($handle: String!) {
      productByHandle(handle: $handle) {
        ${PRODUCT_FIELDS}
      }
    }
  `;

  const data = (await storefrontApiRequest(gql, { handle })) as {
    data?: { productByHandle?: ShopifyProduct["node"] };
  };

  if (!data?.data?.productByHandle) return null;
  return { node: data.data.productByHandle };
}

export async function searchProducts(
  query: string,
  first = 12,
): Promise<ShopifyProduct[]> {
  return fetchProducts(first, query);
}

// ── Cart Mutations ───────────────────────────────────────────────────

interface CartCreateResult {
  cartId: string;
  checkoutUrl: string;
  lineId: string;
}

interface CartLineResult {
  success: boolean;
  cartNotFound?: boolean;
  lineId?: string;
}

interface CartFetchResult {
  exists: boolean;
  totalQuantity: number;
}

export async function createShopifyCart(
  item: { variantId: string; quantity: number },
): Promise<CartCreateResult | null> {
  const gql = `
    mutation ($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 1) {
            edges {
              node { id }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;

  const variables = {
    input: {
      lines: [{ merchandiseId: item.variantId, quantity: item.quantity }],
    },
  };

  const data = (await storefrontApiRequest(gql, variables)) as {
    data?: {
      cartCreate?: {
        cart?: {
          id: string;
          checkoutUrl: string;
          lines: { edges: Array<{ node: { id: string } }> };
        };
        userErrors?: Array<{ field: string[]; message: string }>;
      };
    };
  };

  const cart = data?.data?.cartCreate?.cart;
  if (!cart) return null;

  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lineId: cart.lines.edges[0]?.node.id ?? "",
  };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: { variantId: string; quantity: number },
): Promise<CartLineResult> {
  const gql = `
    mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                merchandise { ... on ProductVariant { id } }
              }
            }
          }
        }
        userErrors { field message code }
      }
    }
  `;

  try {
    const data = (await storefrontApiRequest(gql, {
      cartId,
      lines: [{ merchandiseId: item.variantId, quantity: item.quantity }],
    })) as {
      data?: {
        cartLinesAdd?: {
          cart?: {
            lines: {
              edges: Array<{
                node: { id: string; merchandise: { id: string } };
              }>;
            };
          };
          userErrors?: Array<{ code?: string; message: string }>;
        };
      };
    };

    const errors = data?.data?.cartLinesAdd?.userErrors ?? [];
    if (errors.some((e) => e.message?.toLowerCase().includes("cart"))) {
      return { success: false, cartNotFound: true };
    }

    const lines = data?.data?.cartLinesAdd?.cart?.lines.edges ?? [];
    const addedLine = lines.find(
      (l) => l.node.merchandise.id === item.variantId,
    );

    return { success: true, lineId: addedLine?.node.id };
  } catch {
    return { success: false, cartNotFound: true };
  }
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<CartLineResult> {
  const gql = `
    mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { id }
        userErrors { field message code }
      }
    }
  `;

  try {
    const data = (await storefrontApiRequest(gql, {
      cartId,
      lines: [{ id: lineId, quantity }],
    })) as {
      data?: {
        cartLinesUpdate?: {
          userErrors?: Array<{ code?: string; message: string }>;
        };
      };
    };

    const errors = data?.data?.cartLinesUpdate?.userErrors ?? [];
    if (errors.some((e) => e.message?.toLowerCase().includes("cart"))) {
      return { success: false, cartNotFound: true };
    }

    return { success: true };
  } catch {
    return { success: false, cartNotFound: true };
  }
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<CartLineResult> {
  const gql = `
    mutation ($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { id }
        userErrors { field message code }
      }
    }
  `;

  try {
    const data = (await storefrontApiRequest(gql, {
      cartId,
      lineIds: [lineId],
    })) as {
      data?: {
        cartLinesRemove?: {
          userErrors?: Array<{ code?: string; message: string }>;
        };
      };
    };

    const errors = data?.data?.cartLinesRemove?.userErrors ?? [];
    if (errors.some((e) => e.message?.toLowerCase().includes("cart"))) {
      return { success: false, cartNotFound: true };
    }

    return { success: true };
  } catch {
    return { success: false, cartNotFound: true };
  }
}

export async function fetchShopifyCart(
  cartId: string,
): Promise<CartFetchResult> {
  const gql = `
    query ($cartId: ID!) {
      cart(id: $cartId) {
        id
        totalQuantity
      }
    }
  `;

  try {
    const data = (await storefrontApiRequest(gql, { cartId })) as {
      data?: { cart?: { id: string; totalQuantity: number } | null };
    };

    if (!data?.data?.cart) return { exists: false, totalQuantity: 0 };
    return { exists: true, totalQuantity: data.data.cart.totalQuantity };
  } catch {
    return { exists: false, totalQuantity: 0 };
  }
}
