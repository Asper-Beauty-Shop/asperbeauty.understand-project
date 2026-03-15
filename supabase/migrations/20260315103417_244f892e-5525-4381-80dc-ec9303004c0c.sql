
CREATE INDEX IF NOT EXISTS idx_products_brand_availability ON public.products (brand, availability_status);
CREATE INDEX IF NOT EXISTS idx_products_concern_step ON public.products (primary_concern, regimen_step);
CREATE INDEX IF NOT EXISTS idx_products_concern_availability_rank ON public.products (primary_concern, availability_status, bestseller_rank);
CREATE INDEX IF NOT EXISTS idx_products_category_availability ON public.products (category, availability_status);
CREATE INDEX IF NOT EXISTS idx_products_asper_category_persona ON public.products (asper_category, ai_persona_lead);
CREATE INDEX IF NOT EXISTS idx_products_availability_rank ON public.products (availability_status, bestseller_rank);
