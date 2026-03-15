-- Drop and recreate with schema-qualified similarity calls
DROP FUNCTION IF EXISTS public.search_products(text, integer);

CREATE OR REPLACE FUNCTION public.search_products(search_query text, max_results integer DEFAULT 24)
 RETURNS TABLE(id uuid, name text, title text, brand text, category text, description text, price numeric, image_url text, handle text, in_stock boolean, availability_status text, tags text[], bestseller_rank integer, primary_concern text, regimen_step text, is_hero boolean, is_bestseller boolean, created_at timestamp with time zone, rank real)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
  SELECT
    p.id, p.name, p.title, p.brand, p.category, p.description,
    p.price, p.image_url, p.handle, p.in_stock, p.availability_status,
    p.tags, p.bestseller_rank, p.primary_concern, p.regimen_step,
    p.is_hero, p.is_bestseller, p.created_at,
    GREATEST(
      ts_rank(p.fts, websearch_to_tsquery('english', search_query)),
      similarity(p.name, search_query) * 0.8,
      similarity(p.brand, search_query) * 0.6
    )::real AS rank
  FROM public.products p
  WHERE
    COALESCE(p.availability_status, 'in_stock') <> 'Pending_Purge'
    AND (
      p.fts @@ websearch_to_tsquery('english', search_query)
      OR similarity(p.name, search_query) > 0.15
      OR similarity(p.brand, search_query) > 0.15
    )
  ORDER BY rank DESC, COALESCE(p.bestseller_rank, 999) ASC
  LIMIT max_results;
$function$;

GRANT EXECUTE ON FUNCTION public.search_products(text, integer) TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';