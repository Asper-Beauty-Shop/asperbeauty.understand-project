-- Asper Beauty Shop: digital_tray_products for 3-Click funnel (AI catalog enrichment)
-- Single source of truth: Master Implementation Plan — Phase 1

-- 1. Enums for approved taxonomies (create only if not present)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dtp_skin_concern') THEN
    CREATE TYPE public.dtp_skin_concern AS ENUM (
      'brightening', 'sun_protection', 'dark_circles', 'anti_aging',
      'dryness', 'acne', 'sensitivity', 'hyperpigmentation'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dtp_skin_type') THEN
    CREATE TYPE public.dtp_skin_type AS ENUM (
      'oily', 'dry', 'combination', 'sensitive', 'normal', 'all'
    );
  END IF;
END $$;

-- 2. digital_tray_products table
CREATE TABLE IF NOT EXISTS public.digital_tray_products (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_product_id    TEXT NOT NULL UNIQUE,
  sku                   TEXT NOT NULL,
  handle                TEXT NOT NULL,
  title                 TEXT NOT NULL,

  -- AI-enriched fields
  skin_concerns         public.dtp_skin_concern[] NOT NULL DEFAULT '{}',
  skin_types            public.dtp_skin_type[] NOT NULL DEFAULT '{}',
  key_ingredients       TEXT[] NOT NULL DEFAULT '{}',
  clinical_justification TEXT,
  ai_confidence_score   DECIMAL(3,2) CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 1),
  requires_human_review  BOOLEAN NOT NULL DEFAULT FALSE,
  enrichment_version    TEXT,
  enriched_at            TIMESTAMPTZ,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for 3-Click funnel queries
CREATE INDEX IF NOT EXISTS idx_dtp_skin_concerns
  ON public.digital_tray_products USING GIN (skin_concerns);

CREATE INDEX IF NOT EXISTS idx_dtp_skin_types
  ON public.digital_tray_products USING GIN (skin_types);

CREATE INDEX IF NOT EXISTS idx_dtp_review_queue
  ON public.digital_tray_products (requires_human_review)
  WHERE requires_human_review = TRUE;

-- Auto-update updated_at (use existing trigger function if present)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    DROP TRIGGER IF EXISTS update_dtp_updated_at ON public.digital_tray_products;
    CREATE TRIGGER update_dtp_updated_at
      BEFORE UPDATE ON public.digital_tray_products
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- RLS: Public read for non-flagged; service role full access
ALTER TABLE public.digital_tray_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read enriched products" ON public.digital_tray_products;
CREATE POLICY "Public can read enriched products"
  ON public.digital_tray_products FOR SELECT
  USING (requires_human_review = FALSE);

DROP POLICY IF EXISTS "Service role has full access" ON public.digital_tray_products;
CREATE POLICY "Service role has full access"
  ON public.digital_tray_products FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE public.digital_tray_products IS 'AI-enriched catalog for Dr. Bot 3-Click funnel; populated by catalog-enrichment pipeline.';
