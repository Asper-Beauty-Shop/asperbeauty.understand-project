
CREATE TABLE public.shopify_webhook_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  shopify_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed boolean NOT NULL DEFAULT false,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shopify_webhook_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage webhook logs"
  ON public.shopify_webhook_log
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert webhook logs"
  ON public.shopify_webhook_log
  FOR INSERT
  TO public
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX idx_webhook_log_topic ON public.shopify_webhook_log(topic);
CREATE INDEX idx_webhook_log_created ON public.shopify_webhook_log(created_at DESC);
