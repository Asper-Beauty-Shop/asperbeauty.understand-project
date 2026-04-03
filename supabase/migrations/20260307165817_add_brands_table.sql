-- Create brands table for EliteBrandShowcase
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  hero_image_url TEXT,
  is_elite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Elite 15 Brands placeholders
INSERT INTO public.brands (name, slug, is_elite, hero_image_url) VALUES
('La Roche-Posay', 'la-roche-posay', true, 'https://images.unsplash.com/photo-1615397323194-cefbe81cb878?q=80&w=2000'),
('Eucerin', 'eucerin', true, 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=2000'),
('Vichy', 'vichy', true, 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000'),
('Bioderma', 'bioderma', true, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2000'),
('CeraVe', 'cerave', true, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2000'),
('COSRX', 'cosrx', true, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=2000'),
('Skin1004', 'skin1004', true, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=2000')
ON CONFLICT (slug) DO NOTHING;
