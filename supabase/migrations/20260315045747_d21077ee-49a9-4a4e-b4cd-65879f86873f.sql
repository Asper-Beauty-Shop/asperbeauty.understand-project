
-- Fix privilege escalation: prevent users from self-assigning driver_id on INSERT
DROP POLICY IF EXISTS "Users can create own COD orders" ON public.cod_orders;

CREATE POLICY "Users can create own COD orders"
  ON public.cod_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND driver_id IS NULL
  );
