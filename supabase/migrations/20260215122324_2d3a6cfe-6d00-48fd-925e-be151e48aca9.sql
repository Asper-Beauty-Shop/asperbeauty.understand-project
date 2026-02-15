
-- Add product_highlights array to the products enrichment table
ALTER TABLE public.products
ADD COLUMN product_highlights text[] DEFAULT ARRAY[]::text[];

-- Add a comment for clarity
COMMENT ON COLUMN public.products.product_highlights IS 'Google Merchant Center style product highlights, e.g. Dermatologist Tested, SPF 50+';
