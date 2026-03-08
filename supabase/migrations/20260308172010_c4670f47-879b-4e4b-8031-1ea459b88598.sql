
-- Flag non-beauty products with Pending_Purge status for catalog cleanliness
UPDATE public.products 
SET availability_status = 'Pending_Purge', updated_at = now()
WHERE (
  brand IN ('Chicco', 'Pampers', 'Huggies', 'Thermos', 'Fossil', 'Junior', 'Pasito A', 'Neverti', 'AMK')
  OR tags && ARRAY['Bag', 'Earrings', 'Watch', 'Changing bag', 'Blanket', 'Tumbler', 'Toys', 'Diaper', 'Gloves', 'Bracelets', 'Diaper Bag', 'Cap', 'Sanitary Pads', 'Overblankets', 'Bibs', 'Baby Clothes', 'Pushing Toy', 'Rattle']
  OR title ~* '(diaper|nappy|pacifier|feeding bottle|stroller|car seat|teether|playmat|baby monitor)'
)
AND availability_status IS DISTINCT FROM 'Pending_Purge';
