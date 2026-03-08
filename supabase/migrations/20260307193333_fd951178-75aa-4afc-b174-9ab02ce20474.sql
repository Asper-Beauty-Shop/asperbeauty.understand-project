-- Add admin write policies for access_links table
CREATE POLICY "Admins can insert access_links"
ON public.access_links FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update access_links"
ON public.access_links FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete access_links"
ON public.access_links FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add storage policies for product-images bucket
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');