
-- Fix has_role search_path using CREATE OR REPLACE (no DROP needed)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Fix event_trigger_fn search_path
CREATE OR REPLACE FUNCTION public.event_trigger_fn()
RETURNS event_trigger
LANGUAGE plpgsql
SET search_path TO public
AS $function$
BEGIN
  -- Add logic here
END;
$function$;
