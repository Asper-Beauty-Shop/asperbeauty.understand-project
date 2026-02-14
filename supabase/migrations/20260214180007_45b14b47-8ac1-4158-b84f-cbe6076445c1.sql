
-- Add enriched product columns for "Sanctuary of Science" strategy
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS clinical_badge text,
  ADD COLUMN IF NOT EXISTS ai_persona_lead public.persona_type,
  ADD COLUMN IF NOT EXISTS key_ingredients text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS texture_profile text,
  ADD COLUMN IF NOT EXISTS hex_swatch text,
  ADD COLUMN IF NOT EXISTS gold_stitch_tier boolean NOT NULL DEFAULT false;

-- Add index for persona-based queries
CREATE INDEX IF NOT EXISTS idx_products_persona ON public.products (ai_persona_lead);

-- Add index for gold stitch tier filtering
CREATE INDEX IF NOT EXISTS idx_products_gold_tier ON public.products (gold_stitch_tier) WHERE gold_stitch_tier = true;

-- Add GIN index for key_ingredients array searches
CREATE INDEX IF NOT EXISTS idx_products_ingredients ON public.products USING GIN (key_ingredients);
