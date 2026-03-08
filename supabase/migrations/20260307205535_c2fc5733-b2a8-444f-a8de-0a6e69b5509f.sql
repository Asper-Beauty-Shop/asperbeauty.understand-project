
-- =============================================
-- FIX 1: Tenant isolation bypass on "Shopify pub"
-- Replace current_setting('app.tenant_id') with user_tenants join
-- =============================================

-- Drop all existing vulnerable policies
DROP POLICY IF EXISTS "tenant_read" ON public."Shopify pub";
DROP POLICY IF EXISTS "tenant_insert" ON public."Shopify pub";
DROP POLICY IF EXISTS "tenant_update_own" ON public."Shopify pub";
DROP POLICY IF EXISTS "tenant_write" ON public."Shopify pub";
DROP POLICY IF EXISTS "owner_update" ON public."Shopify pub";

-- New secure policies using user_tenants join
CREATE POLICY "tenant_read_secure"
ON public."Shopify pub" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = "Shopify pub".tenant_id
  )
);

CREATE POLICY "tenant_insert_secure"
ON public."Shopify pub" FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = "Shopify pub".tenant_id
  )
);

CREATE POLICY "tenant_update_secure"
ON public."Shopify pub" FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.user_tenants ut
    WHERE ut.user_id = auth.uid()
      AND ut.tenant_id = "Shopify pub".tenant_id
  )
);

-- =============================================
-- FIX 2: Exposed health data in product_reviews
-- Create a public view that strips user_id, restrict base table
-- =============================================

-- Create public-safe view (no user_id exposed)
CREATE OR REPLACE VIEW public.product_reviews_public
WITH (security_invoker = on) AS
SELECT
  id,
  product_id,
  rating,
  title,
  body,
  skin_type,
  primary_concern,
  age_range,
  verified_purchase,
  helpful_count,
  created_at
FROM public.product_reviews;

-- Replace the public read policy on base table:
-- Only allow owners to read their own reviews directly
DROP POLICY IF EXISTS "public_read_reviews" ON public.product_reviews;

CREATE POLICY "users_read_own_reviews"
ON public.product_reviews FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow anon/public to read from the VIEW (which strips user_id)
-- The view uses security_invoker, so we need a service-level policy
-- that the view's invoker can use. We'll use a function instead.

-- Create a security definer function for the view to read through
CREATE OR REPLACE FUNCTION public.get_product_reviews(p_product_id uuid)
RETURNS TABLE (
  id uuid,
  product_id uuid,
  rating smallint,
  title text,
  body text,
  skin_type text,
  primary_concern text,
  age_range text,
  verified_purchase boolean,
  helpful_count integer,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pr.id, pr.product_id, pr.rating, pr.title, pr.body,
    pr.skin_type, pr.primary_concern, pr.age_range,
    pr.verified_purchase, pr.helpful_count, pr.created_at
  FROM public.product_reviews pr
  WHERE pr.product_id = p_product_id
  ORDER BY pr.created_at DESC
  LIMIT 20;
$$;
