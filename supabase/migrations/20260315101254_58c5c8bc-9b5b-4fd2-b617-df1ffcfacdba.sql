-- Lock down all SECURITY DEFINER functions: revoke PUBLIC, grant only to authenticated

-- Already done: has_role(uuid, app_role)

-- Email queue functions (service-role only, no public/anon access needed)
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO authenticated;

-- Product management functions (admin-only operations)
REVOKE EXECUTE ON FUNCTION public.bulk_delete_purged(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bulk_delete_purged(uuid[]) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.bulk_restore_purged(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bulk_restore_purged(uuid[]) TO authenticated;

-- Review retrieval (used by storefront, needs anon + authenticated)
REVOKE EXECUTE ON FUNCTION public.get_product_reviews(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_product_reviews(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_product_reviews(text) TO authenticated;

-- Tray retrieval (used by storefront, needs anon + authenticated)
REVOKE EXECUTE ON FUNCTION public.get_tray_by_concern(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_tray_by_concern(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_tray_by_concern(text) TO authenticated;

-- Search (used by storefront, needs anon + authenticated)
REVOKE EXECUTE ON FUNCTION public.search_products(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_products(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.search_products(text, integer) TO authenticated;