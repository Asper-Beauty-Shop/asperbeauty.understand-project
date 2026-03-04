
-- Webhook audit log: captures routing metadata without PII
CREATE TABLE public.webhook_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL,           -- 'gorgias' | 'manychat'
  event_type text NOT NULL DEFAULT 'message',
  status text NOT NULL,             -- 'success' | 'hmac_failed' | 'rate_limited' | 'error'
  concern_detected text,            -- concern slug if detected, NULL otherwise
  response_ms integer,              -- round-trip time in ms
  error_message text,               -- truncated error (no PII)
  received_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read webhook_audit_logs"
  ON public.webhook_audit_logs
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role
  ));

-- Edge functions insert via service role (no user-level INSERT policy needed)

-- Index for time-range queries
CREATE INDEX idx_webhook_audit_received_at ON public.webhook_audit_logs (received_at DESC);

-- Index for provider filtering
CREATE INDEX idx_webhook_audit_provider ON public.webhook_audit_logs (provider);

-- Add to cleanup allowlist for automated retention
INSERT INTO public.cleanup_allowlist (table_schema, table_name, timestamp_column)
VALUES ('public', 'webhook_audit_logs', 'received_at');
