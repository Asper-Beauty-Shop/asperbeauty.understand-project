-- ============================================================
-- 1. Create cod_orders table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cod_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text NOT NULL,
  city text NOT NULL DEFAULT 'Amman',
  notes text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  shipping_cost numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  driver_id uuid,
  assigned_at timestamptz,
  delivered_at timestamptz,
  delivery_notes text,
  customer_lat numeric,
  customer_lng numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cod_orders ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins full access on cod_orders"
  ON public.cod_orders FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Drivers can read their assigned orders
CREATE POLICY "Drivers can read assigned orders"
  ON public.cod_orders FOR SELECT
  USING (driver_id = auth.uid());

-- Drivers can update their assigned orders (status, delivery_notes, delivered_at)
CREATE POLICY "Drivers can update assigned orders"
  ON public.cod_orders FOR UPDATE
  USING (driver_id = auth.uid());

-- Auto-update updated_at
CREATE TRIGGER set_cod_orders_updated_at
  BEFORE UPDATE ON public.cod_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. Fix get_tray_by_concern to use products table (not broken view)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_tray_by_concern(concern_tag skin_concern)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  step1_product JSONB;
  step2_product JSONB;
  step3_product JSONB;
  result JSONB;
BEGIN
  -- Step 1: Cleanser
  SELECT jsonb_build_object(
    'id', p.id,
    'handle', p.handle,
    'title', p.title,
    'brand', p.brand,
    'price', p.price,
    'image_url', p.image_url,
    'step', p.regimen_step,
    'is_hero', p.is_hero,
    'is_bestseller', p.is_bestseller,
    'inventory_total', p.inventory_total
  ) INTO step1_product
  FROM public.products p
  WHERE p.primary_concern = concern_tag
    AND p.regimen_step IN ('Step_1', 'Step_1_Cleanser')
    AND p.inventory_total > 0
  ORDER BY p.is_hero DESC, p.is_bestseller DESC, p.bestseller_rank ASC NULLS LAST, p.inventory_total DESC
  LIMIT 1;

  -- Step 2: Treatment
  SELECT jsonb_build_object(
    'id', p.id,
    'handle', p.handle,
    'title', p.title,
    'brand', p.brand,
    'price', p.price,
    'image_url', p.image_url,
    'step', p.regimen_step,
    'is_hero', p.is_hero,
    'is_bestseller', p.is_bestseller,
    'inventory_total', p.inventory_total
  ) INTO step2_product
  FROM public.products p
  WHERE p.primary_concern = concern_tag
    AND p.regimen_step IN ('Step_2', 'Step_2_Treatment')
    AND p.inventory_total > 0
  ORDER BY p.is_hero DESC, p.is_bestseller DESC, p.bestseller_rank ASC NULLS LAST, p.inventory_total DESC
  LIMIT 1;

  -- Step 3: Protection
  SELECT jsonb_build_object(
    'id', p.id,
    'handle', p.handle,
    'title', p.title,
    'brand', p.brand,
    'price', p.price,
    'image_url', p.image_url,
    'step', p.regimen_step,
    'is_hero', p.is_hero,
    'is_bestseller', p.is_bestseller,
    'inventory_total', p.inventory_total
  ) INTO step3_product
  FROM public.products p
  WHERE p.primary_concern = concern_tag
    AND p.regimen_step IN ('Step_3', 'Step_3_Protection')
    AND p.inventory_total > 0
  ORDER BY p.is_hero DESC, p.is_bestseller DESC, p.bestseller_rank ASC NULLS LAST, p.inventory_total DESC
  LIMIT 1;

  result := jsonb_build_object(
    'concern', concern_tag,
    'step_1', COALESCE(step1_product, 'null'::jsonb),
    'step_2', COALESCE(step2_product, 'null'::jsonb),
    'step_3', COALESCE(step3_product, 'null'::jsonb),
    'generated_at', NOW()
  );

  RETURN result;
END;
$function$;

-- Refresh PostgREST cache
NOTIFY pgrst, 'reload schema';