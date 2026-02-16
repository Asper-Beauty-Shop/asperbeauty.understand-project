-- Fix overly permissive chat_logs UPDATE policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.chat_logs;

CREATE POLICY "Users can update own chat logs"
ON public.chat_logs
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());