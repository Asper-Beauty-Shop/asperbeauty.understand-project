-- Drop public read policies on concierge tables and replace with authenticated-only
DROP POLICY IF EXISTS "Public read access for concierge_brain_rules" ON public.concierge_brain_rules;
DROP POLICY IF EXISTS "Public read access for concierge_brains" ON public.concierge_brains;

CREATE POLICY "Authenticated read concierge_brain_rules"
ON public.concierge_brain_rules FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated read concierge_brains"
ON public.concierge_brains FOR SELECT
TO authenticated
USING (true);

-- Restrict prompts to admin-only
DROP POLICY IF EXISTS "read_active_prompts" ON public.prompts;

CREATE POLICY "Admins can read prompts"
ON public.prompts FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));