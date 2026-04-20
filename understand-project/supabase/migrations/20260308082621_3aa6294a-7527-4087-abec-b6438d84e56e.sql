-- Fix: product_reviews_public view - recreate with SECURITY INVOKER so it respects base table RLS
DROP VIEW IF EXISTS public.product_reviews_public;
CREATE VIEW public.product_reviews_public
WITH (security_invoker = true)
AS
SELECT
  id, product_id, rating, title, body,
  skin_type, primary_concern, age_range,
  verified_purchase, helpful_count, created_at
FROM public.product_reviews;

-- Fix: notes table - remove overly permissive anon policy, restrict to authenticated
DROP POLICY IF EXISTS "public can read notes" ON public.notes;
CREATE POLICY "authenticated_can_read_notes" ON public.notes
  FOR SELECT TO authenticated USING (true);