CREATE OR REPLACE FUNCTION public.remove_purge_tag_bulk(product_ids UUID[])
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET 
    tags = array_remove(tags, 'Pending_Purge'),
    status = 'active'
  WHERE id = ANY(product_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
