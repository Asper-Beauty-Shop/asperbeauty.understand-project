
-- Remove overly permissive policies that conflict with scoped tenant/owner policies
DROP POLICY "auth_can_insert_shopify_pub" ON public."Shopify pub";
DROP POLICY "auth_can_read_shopify_pub" ON public."Shopify pub";
DROP POLICY "auth_can_update_shopify_pub" ON public."Shopify pub";
