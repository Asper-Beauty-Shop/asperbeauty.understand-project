

## Fix Plan: Resolve All TypeScript Build Errors

The site is currently broken due to multiple TypeScript errors. Here's the fix plan organized by file:

### Critical Blocker (Build Crash)

1. **`src/pages/BrandVichy.tsx`** — Replace the entire file with a simple redirect component. The file imports a missing asset `@/assets/brands/vichy-hero.jpg` that doesn't exist. Replace with `Navigate to="/brands"`.

### Type Mismatches

2. **`src/components/ProductQuickView.tsx`** — Change `price: number` to `price: number | null` in the `Product` interface (line 30) to match what `ProductCatalog` passes.

3. **`src/components/LuxurySearch.tsx`** — The `SearchResult` interface at line 24 doesn't have `category`. The error at line 171 says `Property 'category' does not exist`. Current code at line 171 uses `product.primary_concern` which is correct. This error may already be resolved — will verify, but if `category` is referenced elsewhere in the file, replace with `primary_concern`.

4. **`src/pages/ManageProducts.tsx`** — The `Product` interface is missing properties the DB returns, and `insert` call is missing required fields:
   - Add `brand?: string | null`, `clinical_badge?: string | null`, `pharmacist_note?: string | null` to form data insert object
   - Add `handle`, `primary_concern`, `regimen_step` as required fields in the insert payload (they're already in `formData`)
   - Cast `setProducts` data with `as Product[]` or add index signature

5. **`src/pages/BulkUpload.tsx`** — Status mapping mismatch: queue uses `"done"`/`"error"` but type expects `"completed"`/`"failed"`. The current fix at lines 128-132 maps these correctly. Verify this is still present.

6. **`src/hooks/useProductFilter.ts`** — Type casting at line 134 needs `as unknown as ShopifyProduct[]` pattern. Currently uses a partial cast. Fix the generic type assertion.

7. **`src/pages/ConcernCollection.tsx`** — Same `filterProductsByConcern` casting issue. Currently uses `as any` + `as unknown as ShopifyProduct[]` which should work. Verify.

8. **`src/pages/AdminAuditLogs.tsx`** — Lines 214/217: "excessively deep" type instantiation with `cod_orders`. Replace with `(supabase as any).from("cod_orders")` pattern consistently.

### Component Props

9. **`src/components/FloatingSocials.tsx`** — Line 129: SVG `Icon` component rendered as `<Icon />` but something passes `className`. Check if `<Icon className="..." />` exists — if so, use a wrapper `<span className="..."><Icon /></span>`.

### Technical Details

- The `BrandVichy.tsx` fix is the critical path — everything else fails to build because Vite stops on this missing import
- The `ManageProducts.tsx` insert needs to include `handle`, `primary_concern`, and `regimen_step` which are NOT NULL columns in the DB
- The `AdminAuditLogs.tsx` deep instantiation error is because `cod_orders` table isn't in the generated types — use `any` assertion
- Most `useProductFilter`/`ConcernCollection` errors are about `ShopifyProduct.node.tags` being `string | string[]` vs `string[]` — fix with type assertion

