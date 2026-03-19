
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_on_sale boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS original_price numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS discount_percent integer DEFAULT NULL;
