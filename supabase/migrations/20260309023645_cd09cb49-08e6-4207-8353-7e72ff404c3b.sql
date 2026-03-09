-- Remove duplicate RLS policies on concierge_profiles (keep the shorter-named originals)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.concierge_profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.concierge_profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.concierge_profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.concierge_profiles;