-- Add enrichment columns from AI-Powered Architecture Implementation Plan
-- Run after 20260303000000_digital_tray_products.sql

ALTER TABLE public.digital_tray_products
  ADD COLUMN IF NOT EXISTS spf_value INTEGER,
  ADD COLUMN IF NOT EXISTS ai_clinical_reasoning TEXT,
  ADD COLUMN IF NOT EXISTS review_reason TEXT;

-- Optional: if ai_confidence_score was 0-1 decimal, uncomment to migrate to 0-100 integer:
-- ALTER TABLE public.digital_tray_products
--   ALTER COLUMN ai_confidence_score TYPE INTEGER USING (LEAST(100, GREATEST(0, ROUND((ai_confidence_score * 100)::numeric)::integer)));
-- ALTER TABLE public.digital_tray_products DROP CONSTRAINT IF EXISTS digital_tray_products_ai_confidence_score_check;
-- ALTER TABLE public.digital_tray_products ADD CONSTRAINT digital_tray_products_ai_confidence_score_check CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 100);
-- For now: keep existing column as-is (pipeline stores 0-1 for backward compat unless you run the above).

-- Pipeline run audit log
CREATE TABLE IF NOT EXISTS public.enrichment_pipeline_runs (
  run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  products_scanned INTEGER DEFAULT 0,
  products_enriched INTEGER DEFAULT 0,
  products_skipped INTEGER DEFAULT 0,
  products_failed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'partial')),
  enrichment_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.enrichment_pipeline_runs IS 'Audit log for catalog enrichment pipeline runs.';
