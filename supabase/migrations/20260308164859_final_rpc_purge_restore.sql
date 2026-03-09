-- Final Spec-Compliant Purge Restoration with AI-Proofing
CREATE OR REPLACE FUNCTION public.remove_purge_tag_bulk(product_ids UUID[])
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET 
    tags = array_remove(tags, 'Pending_Purge'),
    availability_status = 'active',
    clinical_badge = 'Requires_Manual_Review',
    pharmacist_note = 'Restored from purge. Requires manual review.'
  WHERE id = ANY(product_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
