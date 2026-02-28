
-- Admin-only SELECT on events table
CREATE POLICY "Admins can read events"
ON public.events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
