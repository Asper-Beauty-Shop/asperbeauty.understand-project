ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_bestseller boolean NOT NULL DEFAULT false;

NOTIFY pgrst, 'reload schema';