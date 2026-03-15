-- Fix overly permissive COD orders INSERT policy
DROP POLICY IF EXISTS "Authenticated can create COD orders" ON public.cod_orders;

CREATE POLICY "Authenticated can create COD orders" ON public.cod_orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);