
-- chat_logs: tighten INSERT
DROP POLICY "Service role can insert logs" ON public.chat_logs;
CREATE POLICY "Authenticated users insert own logs"
ON public.chat_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ai_message_audit: tighten INSERT
DROP POLICY "ai_audit_insert_all" ON public.ai_message_audit;
CREATE POLICY "Authenticated users insert own audit"
ON public.ai_message_audit FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- prompt_audit_logs: tighten INSERT
DROP POLICY "insert_logs" ON public.prompt_audit_logs;
CREATE POLICY "Authenticated users insert own prompt audit"
ON public.prompt_audit_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- telemetry_events: tighten INSERT
DROP POLICY "Service role can insert telemetry" ON public.telemetry_events;
CREATE POLICY "Authenticated users insert own telemetry"
ON public.telemetry_events FOR INSERT
WITH CHECK (auth.uid() = user_id);
