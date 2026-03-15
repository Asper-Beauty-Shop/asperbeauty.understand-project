
-- Allow authenticated users to view their own COD orders
CREATE POLICY "Users can view own COD orders"
ON public.cod_orders
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
