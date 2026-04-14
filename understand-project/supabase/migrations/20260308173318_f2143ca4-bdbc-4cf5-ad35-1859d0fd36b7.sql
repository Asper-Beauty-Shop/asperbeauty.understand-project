
-- RPC to safely remove 'Pending_Purge' tag and restore products
CREATE OR REPLACE FUNCTION public.bulk_restore_purged(p_ids uuid[])
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  affected integer;
BEGIN
  UPDATE public.products
  SET availability_status = 'in_stock',
      asper_category = 'Requires_Manual_Review',
      tags = array_remove(tags, 'Pending_Purge'),
      updated_at = now()
  WHERE id = ANY(p_ids)
    AND availability_status = 'Pending_Purge';
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

-- RPC to hard-delete purged products (admin only, uses security definer)
CREATE OR REPLACE FUNCTION public.bulk_delete_purged(p_ids uuid[])
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  affected integer;
BEGIN
  -- Only delete items that are already flagged as Pending_Purge
  DELETE FROM public.products
  WHERE id = ANY(p_ids)
    AND availability_status = 'Pending_Purge';
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;
