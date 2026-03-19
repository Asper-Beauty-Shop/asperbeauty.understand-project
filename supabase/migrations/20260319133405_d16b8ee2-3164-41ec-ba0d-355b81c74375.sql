
CREATE OR REPLACE FUNCTION public.bulk_delete_purged(p_ids uuid[])
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  affected_count integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: admin only';
  END IF;

  DELETE FROM public.products
  WHERE id = ANY(p_ids)
    AND availability_status = 'Pending_Purge';

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.bulk_restore_purged(p_ids uuid[])
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  affected_count integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: admin only';
  END IF;

  UPDATE public.products
  SET availability_status = 'in_stock'
  WHERE id = ANY(p_ids)
    AND availability_status = 'Pending_Purge';

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$function$;
