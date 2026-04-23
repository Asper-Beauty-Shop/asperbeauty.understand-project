-- 1. product_reviews_public view: add public read policy
ALTER VIEW public.product_reviews_public SET (security_invoker = on);

-- 2. digital_tray_products_v view: use security invoker to respect underlying RLS
ALTER VIEW public.digital_tray_products_v SET (security_invoker = on);

-- 3. Restrict concierge_brains SELECT to admins only
DROP POLICY IF EXISTS "Authenticated read concierge_brains" ON public.concierge_brains;
CREATE POLICY "admin_read_concierge_brains" ON public.concierge_brains
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Restrict concierge_brain_rules SELECT to admins only
DROP POLICY IF EXISTS "Authenticated read concierge_brain_rules" ON public.concierge_brain_rules;
CREATE POLICY "admin_read_concierge_brain_rules" ON public.concierge_brain_rules
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Restrict notes SELECT to admins only (internal operational table)
DROP POLICY IF EXISTS "authenticated_can_read_notes" ON public.notes;
CREATE POLICY "admin_read_notes" ON public.notes
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Restrict prompt_experiments SELECT to admins only
DROP POLICY IF EXISTS "read_active_experiments" ON public.prompt_experiments;
CREATE POLICY "admin_read_prompt_experiments" ON public.prompt_experiments
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));