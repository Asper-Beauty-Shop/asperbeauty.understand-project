
-- Add Google Merchant Center fields to products enrichment table
ALTER TABLE public.products
ADD COLUMN condition text DEFAULT 'new',
ADD COLUMN availability_status text DEFAULT 'in_stock',
ADD COLUMN gtin text,
ADD COLUMN mpn text;

COMMENT ON COLUMN public.products.condition IS 'Product condition: new, refurbished, used';
COMMENT ON COLUMN public.products.availability_status IS 'Availability: in_stock, out_of_stock, preorder, backorder';
COMMENT ON COLUMN public.products.gtin IS 'Global Trade Item Number (UPC/EAN/ISBN)';
COMMENT ON COLUMN public.products.mpn IS 'Manufacturer Part Number';
