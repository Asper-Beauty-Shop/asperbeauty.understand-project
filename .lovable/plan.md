

## Plan: Set Bestseller Ranks for Top Products

### Current State
- All products have `bestseller_rank` set to `null` or `999` (default)
- The catalog has ~10,000+ products across diverse categories (Perfume, Watches, Baby, Skincare, etc.)
- The **Best Sellers** homepage section fetches 4 products ordered by `created_at ASC` — not using `bestseller_rank` at all
- The **DualPersonaBestsellers** component orders by `bestseller_rank ASC` but all ranks are equal, so results are arbitrary

### What We'll Do

**Step 1 — Assign bestseller_rank to top products per key category**

Run UPDATE statements to rank products 1-10 within each storefront-relevant category, using price and brand diversity as a heuristic (since there's no sales data):

Categories to rank:
- **Skincare**: Serum, Cleanser, Moisturizer, Sunscreen, Cream, Toner
- **Makeup**: Mascara, Foundation, Concealer, Lipstick, Eyeshadow, Primer
- **Fragrance**: Perfume
- **Hair**: Shampoo, Conditioner, Hair Mask
- **Body**: Body Lotion, Shower Gel, Body Wash

For each category, we'll assign ranks 1-10 to products with the best combination of having a non-null image, reasonable price, and brand variety.

**Step 2 — Fix BestSellersSection query**

Update `BestSellersSection.tsx` to order by `bestseller_rank ASC` instead of `created_at ASC`, and filter out products where `bestseller_rank` is null or 999, so only intentionally ranked products appear.

### Technical Details

- Data updates via the insert/execute tool (not migrations — this is data, not schema)
- SQL will use window functions: `ROW_NUMBER() OVER (PARTITION BY asper_category ORDER BY random())` to pick diverse top products per category
- Approximately 100-150 products will get ranks assigned across all categories

