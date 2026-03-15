
-- 1. Add user_id column to cod_orders (nullable for guest/edge-function orders)
ALTER TABLE public.cod_orders ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2. Drop duplicate INSERT policies
DROP POLICY IF EXISTS "Authenticated can create COD orders" ON public.cod_orders;
DROP POLICY IF EXISTS "Authenticated users can create own COD orders" ON public.cod_orders;

-- 3. Create single INSERT policy enforcing ownership when user is authenticated
CREATE POLICY "Users can create own COD orders"
ON public.cod_orders
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
