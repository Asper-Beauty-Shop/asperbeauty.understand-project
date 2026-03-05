/**
 * Asper Beauty Shop — Shopify product extractor for catalog enrichment.
 * Supports Storefront API (requiresEnrichment by metafield/tags) or Admin API (tag filter).
 */

import type { ShopifyProduct } from "./types.js";

const STOREFRONT_QUERY = `
  query GetProducts($cursor: String, $first: Int!) {
    products(first: $first, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
          descriptionHtml
          tags
          variants(first: 5) {
            edges {
              node {
                id
                sku
                price
                title
              }
            }
          }
          metafield_skin_concerns: metafield(namespace: "clinical", key: "skin_concerns") {
            namespace
            key
            value
          }
          metafield_ingredients: metafield(namespace: "skincare", key: "ingredients") {
            namespace
            key
            value
          }
          metafield_skin_type: metafield(namespace: "skincare", key: "skin_type") {
            namespace
            key
            value
          }
        }
      }
    }
  }
`;

const ADMIN_QUERY = `
  query GetUnenrichedProducts($cursor: String) {
    products(first: 50, after: $cursor, query: "NOT tag:enriched_v1") {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
          description
          tags
          variants(first: 5) {
            edges {
              node {
                id
                sku
                price
                title
              }
            }
          }
          metafield_ingredients: metafield(namespace: "skincare", key: "ingredients") {
            namespace
            key
            value
          }
          metafield_skin_type: metafield(namespace: "skincare", key: "skin_type") {
            namespace
            key
            value
          }
          metafield_skin_concerns: metafield(namespace: "clinical", key: "skin_concerns") {
            namespace
            key
            value
          }
        }
      }
    }
  }
`;

export type ExtractorMode = "storefront" | "admin";

export class ShopifyExtractor {
  private readonly endpoint: string;
  private readonly headers: Record<string, string>;
  private readonly mode: ExtractorMode;

  constructor(
    storeDomain: string,
    accessToken: string,
    mode: ExtractorMode = "admin"
  ) {
    this.mode = mode;
    const base =
      mode === "storefront"
        ? `https://${storeDomain}/api/2024-01/graphql.json`
        : `https://${storeDomain}/admin/api/2024-01/graphql.json`;
    this.endpoint = base;
    this.headers = {
      "Content-Type": "application/json",
      ...(mode === "storefront"
        ? { "X-Shopify-Storefront-Access-Token": accessToken }
        : { "X-Shopify-Access-Token": accessToken }),
    };
  }

  /**
   * Fetches products requiring enrichment.
   * Storefront: fetches all in pages and filters by requiresEnrichment().
   * Admin: uses query NOT tag:enriched_v1.
   */
  async extractUnenrichedProducts(
    batchSize = 50
  ): Promise<ShopifyProduct[]> {
    const unenriched: ShopifyProduct[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;
    let pageCount = 0;

    console.log(
      `🔍 Beginning Shopify catalog extraction (${this.mode})...`
    );

    while (hasNextPage) {
      pageCount++;
      const response = await this.fetchPage(batchSize, cursor);

      for (const edge of response.edges ?? []) {
        const product = this.normalizeProduct(edge.node as Record<string, unknown>);
        if (this.mode === "admin" || this.requiresEnrichment(product)) {
          unenriched.push(product);
        }
      }

      hasNextPage = response.pageInfo?.hasNextPage ?? false;
      cursor = response.pageInfo?.endCursor ?? null;

      if (hasNextPage) await this.delay(200);
    }

    console.log(
      `✅ Extraction complete. Found ${unenriched.length} products requiring enrichment.`
    );
    return unenriched;
  }

  /** AsyncGenerator for backward compat: yields chunks of the full list. */
  async *extractUnenrichedProductsStream(
    batchSize = 50,
    yieldChunkSize = 50
  ): AsyncGenerator<ShopifyProduct[]> {
    const all = await this.extractUnenrichedProducts(batchSize);
    for (let i = 0; i < all.length; i += yieldChunkSize) {
      yield all.slice(i, i + yieldChunkSize);
    }
  }

  private async fetchPage(
    first: number,
    cursor: string | null
  ): Promise<{
    pageInfo: { hasNextPage: boolean; endCursor: string };
    edges: { node: unknown }[];
  }> {
    const body =
      this.mode === "storefront"
        ? { query: STOREFRONT_QUERY, variables: { first, cursor } }
        : { query: ADMIN_QUERY, variables: { cursor } };

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);

    const json = (await res.json()) as {
      data?: { products?: { pageInfo?: unknown; edges?: unknown[] } };
      errors?: { message: string }[];
    };
    if (json.errors?.length)
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);

    const products = json.data?.products;
    if (!products)
      return { pageInfo: { hasNextPage: false, endCursor: "" }, edges: [] };

    return {
      pageInfo: (products.pageInfo as { hasNextPage: boolean; endCursor: string }) ?? {
        hasNextPage: false,
        endCursor: "",
      },
      edges: (products.edges ?? []) as { node: unknown }[],
    };
  }

  private normalizeProduct(raw: Record<string, unknown>): ShopifyProduct {
    const variantEdges =
      (raw.variants as { edges?: { node: Record<string, unknown> }[] })?.edges ?? [];
    const descHtml = String(raw.descriptionHtml ?? raw.description ?? "");
    const desc = descHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    const metafields = [
      raw.metafield_skin_concerns,
      raw.metafield_ingredients,
      raw.metafield_skin_type,
    ]
      .filter(Boolean)
      .map((m: unknown) => {
        const x = m as Record<string, string>;
        return {
          namespace: x?.namespace ?? "",
          key: x?.key ?? "",
          value: x?.value ?? "",
        };
      });

    return {
      id: String(raw.id ?? ""),
      handle: String(raw.handle ?? ""),
      title: String(raw.title ?? ""),
      description: desc,
      descriptionHtml: descHtml,
      tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
      variants: variantEdges.map((e) => {
        const n = e.node;
        return {
          id: n?.id as string | undefined,
          sku: String(n?.sku ?? ""),
          price: String(n?.price ?? ""),
          title: n?.title as string | undefined,
        };
      }),
      metafields,
    };
  }

  /**
   * Product requires enrichment if it lacks clinical.skin_concerns metafield
   * and has no concern: legacy tag.
   */
  private requiresEnrichment(product: ShopifyProduct): boolean {
    const hasClinical =
      product.metafields.some(
        (m) => m.namespace === "clinical" && m.key === "skin_concerns"
      );
    const hasConcernTag = product.tags.some((t) => t.startsWith("concern:"));
    return !hasClinical && !hasConcernTag;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
