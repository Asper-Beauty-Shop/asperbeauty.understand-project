-- Allow service role to insert telemetry events (for cron/system events with null user_id)
CREATE POLICY "Service role can insert telemetry"
ON public.telemetry_events
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role'::text);

-- Allow service role to read telemetry (for monitoring)
CREATE POLICY "Service role can read telemetry"
ON public.telemetry_events
FOR SELECT
TO public
USING (auth.role() = 'service_role'::text);