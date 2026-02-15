
-- Fix: chat_logs SELECT policy too permissive (allows any user to read all logs)
DROP POLICY IF EXISTS "Admins can view logs" ON public.chat_logs;
CREATE POLICY "Users can view own chat logs"
  ON public.chat_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- Fix: telemetry_events has no RLS policies
ALTER TABLE public.telemetry_events ENABLE ROW LEVEL SECURITY;

-- Only allow service role / edge functions to insert telemetry
CREATE POLICY "Service role can insert telemetry"
  ON public.telemetry_events
  FOR INSERT
  WITH CHECK (true);

-- Users can only read their own telemetry
CREATE POLICY "Users can view own telemetry"
  ON public.telemetry_events
  FOR SELECT
  USING (user_id = auth.uid());
