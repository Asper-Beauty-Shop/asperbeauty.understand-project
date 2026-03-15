
-- Revoke public execute on has_role and restrict to service_role + postgres
-- RLS policies use it internally (evaluated as the table owner), so this is safe
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;
