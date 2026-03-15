
-- The "Admins can manage COD orders" policy already exists, just drop and recreate the INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create own COD orders" ON public.cod_orders;

CREATE POLICY "Authenticated users can create own COD orders"
ON public.cod_orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
