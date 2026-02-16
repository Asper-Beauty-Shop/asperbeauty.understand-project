-- Fix search_path on event_trigger_fn
CREATE OR REPLACE FUNCTION public.event_trigger_fn()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  -- Add logic here
END;
$function$;

-- Fix search_path on has_role (SECURITY DEFINER, preserve existing behavior)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;