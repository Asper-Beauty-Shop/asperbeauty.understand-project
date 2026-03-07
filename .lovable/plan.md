

# Plan: Sync Shopify Products into Supabase

## Current State
- **Shopify**: 4,329 products (fragrances, skincare, body care, baby, etc.)
- **Supabase `products` table**: 36 hand-curated dermo-cosmetics with proper `primary_concern` and `regimen_step` enums

## Challenge
The `products` table requires NOT NULL enum values for `primary_concern` (12 values like `Concern_Acne`, `Concern_Hydration`) and `regimen_step` (6 values like `Step_1_Cleanser`, `Step_2_Treatment`). Bulk-syncing 4,329 products means we need intelligent mapping from Shopify product titles, descriptions, tags, and types to these clinical enums.

## Approach: Edge Function `sync-shopify-catalog`

Build a Supabase Edge Function that:

1. **Fetches products from Shopify Storefront API** in paginated batches (50 at a time, cursor-based)
2. **Maps each product** to `primary_concern` and `regimen_step` using keyword analysis of title, description, tags, and product type
3. **Upserts into `products` table** by handle (existing 36 products are preserved)
4. **Returns a summary** of synced/skipped/failed counts

### Mapping Logic (keyword-based heuristics)

```text
Title/Description keywords → primary_concern:
  cleanser/wash/foam/micellar    → Concern_Hydration + Step_1_Cleanser
  serum/treatment/ampoule        → Step_2_Treatment
  SPF/sunscreen/UV               → Concern_SunProtection + Step_3_Protection
  moisturizer/cream/lotion       → Step_3_Protection
  acne/blemish/salicylic         → Concern_Acne
  brightening/vitamin c/glow     → Concern_Brightening
  retinol/anti-aging/wrinkle     → Concern_AntiAging
  hydra/hydrating/hyaluronic     → Concern_Hydration
  pigment/dark spot/melasma      → Concern_Pigmentation
  redness/rosacea/calming        → Concern_Redness
  oil control/mattify/oily       → Concern_Oiliness
  fallback                       → Concern_Hydration + Step_2_Treatment
```

### Price Handling
Shopify prices are stored with the known 10x factor. The edge function will divide by 10 before inserting (matching the existing `normalizePrice` convention).

### Filtering
- Only sync products with at least one image
- Only sync products with `status: ACTIVE`
- Skip products already in Supabase (upsert by handle, preserving manually curated fields)

## Implementation Steps

1. **Create edge function** `supabase/functions/sync-shopify-catalog/index.ts`
   - Accepts optional query params: `limit` (default 200), `product_type` filter, `dry_run`
   - Uses Shopify Storefront API with pagination
   - Maps products to clinical enums
   - Upserts into `products` table using service role key
   - Returns JSON summary

2. **Add admin-only invocation** — the function checks for an admin bearer token or uses the service role key internally

3. **No schema changes needed** — the existing `products` table structure supports all fields

## What Gets Synced Per Product
- `handle`, `title`, `brand` (from vendor), `price` (normalized /10)
- `image_url` (first image)
- `primary_concern` and `regimen_step` (auto-mapped)
- `inventory_total` (from Shopify)
- `tags` (from Shopify tags array)
- Existing manually curated fields (`pharmacist_note`, `key_benefit`, etc.) are NOT overwritten on conflict

## Scope
- Initial sync targets beauty/skincare product types (~200-500 relevant products)
- Non-beauty items (sterilizers, nipple shields, sanitary pads) are skipped by product type filter
- Can be re-run incrementally as new products are added to Shopify

