ALTER TABLE public.products ADD COLUMN hover_image_url text;

COMMENT ON COLUMN public.products.hover_image_url IS 'Secondary image displayed on hover in the product grid for cross-fade effect';