-- Fix mutable search_path on functions that are missing it
ALTER FUNCTION public.enforce_rate_limit(text, integer) SET search_path = 'public';
ALTER FUNCTION public.requeue_failed_skus(uuid, text, integer) SET search_path = 'public';
ALTER FUNCTION public.event_trigger_fn() SET search_path = 'public';
ALTER FUNCTION public.set_timestamps() SET search_path = 'public';
ALTER FUNCTION public.upsert_concierge_profile(uuid, text, text, jsonb) SET search_path = 'public';

-- Fix RLS enabled no policy: add policies for access_links table
CREATE POLICY "admin_manage_access_links" ON public.access_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public_read_active_links" ON public.access_links
  FOR SELECT TO authenticated
  USING (is_active = true);