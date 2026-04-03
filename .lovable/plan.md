

## Shopify Integration Plan

Your Shopify store (`asper-beauty-shop-7.myshopify.com`) is now connected with **17 products**. Here's the plan to integrate it into your website.

### Current State
- Products are fetched from the database (Supabase `products` table)
- Cart is local-only (Zustand with no Shopify sync)
- No Shopify checkout — you have a COD (cash-on-delivery) flow

### What Will Change

**Step 1: Add Shopify Storefront API client**
Create `src/lib/shopifyStorefront.ts` with:
- Storefront API helper using your token (`1ecc14ed...`) and domain (`asper-beauty-shop-7.myshopify.com`)
- Product fetching via GraphQL (the `STOREFRONT_QUERY`)
- Cart mutations (create, add line, update line, remove line)
- Proper 402 billing error handling with toast

**Step 2: Update cart store for Shopify checkout**
Rewrite `src/stores/cartStore.ts` to:
- Create a Shopify cart on first item add via `cartCreate` mutation
- Track `cartId`, `checkoutUrl`, and `lineId` per item
- Sync cart updates in real-time with Shopify API
- Open Shopify checkout in new tab with `channel=online_store` param
- Keep `addMultipleFromPrescription` working for the AI bot flow

**Step 3: Update `useCartSync` hook**
Replace the no-op hook with real cart sync:
- Query Shopify cart on page load and tab focus
- Clear local cart if Shopify cart is empty (post-checkout)

**Step 4: Add a Shopify products page/section**
Create a new route or tab on `/shop` that fetches products directly from Shopify Storefront API, displaying real Shopify product images, prices, variants, and availability. Your existing Supabase-backed `/shop` page stays intact so you can use both data sources.

**Step 5: Update product detail page**
When navigating to a Shopify product (by handle), fetch from Storefront API instead of Supabase. Add variant selection UI (size, color) and wire "Add to Cart" to the Shopify cart store.

**Step 6: Update CartDrawer checkout button**
Replace COD checkout with "Checkout with Shopify" button that opens `checkoutUrl` in a new tab.

### What Stays the Same
- All existing Supabase product pages and admin tools remain functional
- AI Beauty Assistant and prescription flow continue working
- Skin Concerns, Brands, Collections pages unchanged
- Database product management (admin) unchanged

### Technical Details
- API version: `2025-07`
- Store domain: `asper-beauty-shop-7.myshopify.com`
- Storefront token: `1ecc14ed9df843957873db89fbcbf6cb` (public, safe to embed in client code)
- Cart IDs use GraphQL format: `gid://shopify/ProductVariant/...`
- Files modified: `src/lib/shopifyStorefront.ts` (new), `src/stores/cartStore.ts`, `src/hooks/useCartSync.ts`, `src/pages/Shop.tsx`, `src/pages/ProductDetail.tsx`, cart drawer component

