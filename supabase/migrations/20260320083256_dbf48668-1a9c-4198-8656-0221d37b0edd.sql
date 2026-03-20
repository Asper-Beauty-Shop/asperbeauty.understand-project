
-- Persistent rate limiting table
CREATE TABLE public.rate_limit_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast lookups by key + time window
CREATE INDEX idx_rate_limit_key_created ON public.rate_limit_entries (key, created_at DESC);

-- Enable RLS (only service role should access)
ALTER TABLE public.rate_limit_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage rate limits"
  ON public.rate_limit_entries
  FOR ALL
  TO public
  USING (auth.role() = 'service_role'::text)
  WITH CHECK (auth.role() = 'service_role'::text);

-- Cleanup function to purge old entries (call periodically or from edge function)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_entries(older_than_seconds integer DEFAULT 120)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  affected integer;
BEGIN
  DELETE FROM public.rate_limit_entries
  WHERE created_at < now() - (older_than_seconds || ' seconds')::interval;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

-- Rate check function: returns count of entries for a key within a window
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_window_seconds integer,
  p_max_requests integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  request_count integer;
BEGIN
  -- Count recent requests
  SELECT COUNT(*) INTO request_count
  FROM public.rate_limit_entries
  WHERE key = p_key
    AND created_at > now() - (p_window_seconds || ' seconds')::interval;

  -- If under limit, record this request and allow
  IF request_count < p_max_requests THEN
    INSERT INTO public.rate_limit_entries (key) VALUES (p_key);
    RETURN false; -- not rate limited
  END IF;

  RETURN true; -- rate limited
END;
$$;
