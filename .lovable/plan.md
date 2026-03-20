

## Problem

Your 20 products are stored in the database and do load on the `/shop` page. However, they appear missing or replaced by placeholder data in several places due to filtering logic:

1. **Homepage "Curated for You" and "New Arrivals" grids**: These sections query the database but then filter results through `isHomepageBrand()`, which only allows premium brands (La Roche-Posay, Vichy, CeraVe, etc.). Your products use brands like "AgelessSkin", "GlowLab", "AquaDerm" which don't match, so the homepage falls back to hardcoded placeholder images.

2. **Expert-Curated Picks (DualPersonaBestsellers)**: This section queries by `asper_category` — your products do have these values set, so this section should work.

3. **Product Sliders**: Same `isHomepageBrand` filter issue as #1.

## Plan

### Step 1: Remove the premium brand filter from homepage queries
In `src/pages/Index.tsx`, remove the `.filter((p) => isHomepageBrand(p.brand))` calls from both the `new-arrivals-premium` and `bestsellers-premium` queries (lines 178 and 203). This will let your actual database products appear instead of being filtered out.

### Step 2: Remove hardcoded fallback product arrays
Remove or deprecate the `NEW_ARRIVALS` and `BESTSELLERS` hardcoded arrays (lines 125-144) and their associated static image imports (lines 20-32). The components will always use database products instead of falling back to placeholder data that doesn't exist in the catalog.

### Step 3: Order homepage bestsellers by bestseller_rank
Change the `bestsellers-premium` query to order by `bestseller_rank` ascending (instead of `created_at` ascending) so the homepage shows your top-ranked products first.

### Technical Details
- Files modified: `src/pages/Index.tsx`, potentially `src/constants/premiumBrands.ts` (can keep for future use)
- No database changes needed — products are already stored and accessible
- The `/shop` page, skin concerns page, and DualPersonaBestsellers already work with your products

