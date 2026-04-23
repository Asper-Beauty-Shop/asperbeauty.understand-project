
-- Add asper_category column for strict taxonomy routing
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS asper_category text DEFAULT NULL;

-- Phase 1: Intelligent categorization based on title + tags keywords
-- 1. Sun Protection
UPDATE public.products SET asper_category = 'Sun Protection (SPF)'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND (title ~* '(sunscreen|spf|sunblock|\buv\b|sun protect|solar)' OR tags && ARRAY['Sunscreen']);

-- 2. Cleansers & Toners
UPDATE public.products SET asper_category = 'Cleansers & Toners'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND (title ~* '(cleanser|wash|micellar|toner|astringent|cleansing|foam wash|gel wash)' OR tags && ARRAY['Cleanser', 'Micellar', 'Toner']);

-- 3. Clinical Serums & Actives
UPDATE public.products SET asper_category = 'Clinical Serums & Actives'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND title ~* '(serum|retinol|retinal|vitamin\s*c|ascorbic|niacinamide|glycolic|salicylic|lactic|aha|bha|peel|acid|ampoule|booster|concentrate)';

-- 4. Daily Hydration & Barrier
UPDATE public.products SET asper_category = 'Daily Hydration & Barrier'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND title ~* '(moisturiz|cream|lotion|ceramide|balm|emulsion|hydrat|barrier|butter|emollient)';

-- 5. Evening Radiance & Glamour
UPDATE public.products SET asper_category = 'Evening Radiance & Glamour'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND (title ~* '(foundation|concealer|highlighter|makeup|primer|blush|bronzer|contour|powder|lipstick|lip gloss|mascara|eyeliner|eyeshadow|nail|rouge|compact|palette)' OR tags && ARRAY['Makeup', 'Foundation', 'Concealer', 'Eyeshadow', 'Eyeliner', 'Blusher', 'Powder', 'Lip Gloss', 'Lip Balm', 'Kohl', 'Eyebrow']);

-- 6. Targeted Treatments
UPDATE public.products SET asper_category = 'Targeted Treatments'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND title ~* '(eye cream|eye contour|spot treatment|mask|patch|peel-off|exfoliat|scrub|dark circle|anti.?age|wrinkle|firming|lifting)';

-- 7. Hair Care
UPDATE public.products SET asper_category = 'Hair Care'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND (title ~* '(shampoo|conditioner|hair\s|scalp|keratin|olaplex)' OR tags && ARRAY['Hair Care']);

-- 8. Fragrance
UPDATE public.products SET asper_category = 'Fragrance'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND (title ~* '(eau de|edp|edt|parfum|cologne|fragrance|perfume)' OR tags && ARRAY['Fragrance']);

-- 9. Body Care
UPDATE public.products SET asper_category = 'Body Care'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge'
  AND (title ~* '(body|deodorant|antiperspirant|shower|bath|hand cream|foot)' OR tags && ARRAY['Body Care', 'Deodorant & Antiperspirant Roll', 'Deodorant Roll']);

-- 10. Fallback: flag uncategorized active products for manual review
UPDATE public.products SET asper_category = 'Requires_Manual_Review'
WHERE asper_category IS NULL
  AND availability_status IS DISTINCT FROM 'Pending_Purge';

-- Index for fast category queries
CREATE INDEX IF NOT EXISTS idx_products_asper_category ON public.products(asper_category);
