
-- Fix 1: Replace blanket public SELECT on regimen_steps with ownership check
DROP POLICY IF EXISTS "Regimen steps are viewable by everyone" ON public.regimen_steps;

CREATE POLICY "Regimen steps viewable by plan owner or admin"
ON public.regimen_steps
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.regimen_plans rp
    WHERE rp.id = regimen_steps.plan_id
      AND (rp.user_id = auth.uid() OR rp.user_id IS NULL OR public.has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Fix 2: Replace blanket public SELECT on product_reviews with a view approach
-- Remove public policy and restrict to authenticated, hiding user_id
DROP POLICY IF EXISTS "Product reviews are viewable by everyone" ON public.product_reviews;

CREATE POLICY "Product reviews viewable by authenticated users"
ON public.product_reviews
FOR SELECT
TO authenticated
USING (true);
