
-- Merge review SELECT policies into one that covers both own reviews and admin access
DROP POLICY IF EXISTS "Admins can read all reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can read own reviews" ON public.product_reviews;

CREATE POLICY "Users read own reviews, admins read all"
ON public.product_reviews
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));
