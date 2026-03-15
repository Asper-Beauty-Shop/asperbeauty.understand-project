import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const LOCAL_ELITE_BRANDS = [
  { id: '1', name: 'La Roche-Posay', imageUrl: '/brands/laroche-posay.png', slug: 'la-roche-posay' },
  { id: '2', name: 'Vichy', imageUrl: '/brands/vichy.png', slug: 'vichy' },
  { id: '3', name: 'Eucerin', imageUrl: '/brands/eucerin.png', slug: 'eucerin' }
];

export default function EliteBrandShowcase() {
  const [brands, setBrands] = useState<Record<string, unknown>[]>(LOCAL_ELITE_BRANDS as Record<string, unknown>[]);

  useEffect(() => {
    const fetchEliteBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_elite', true)
        .limit(3);
      
      if (!error && data && data.length > 0) {
        setBrands(data);
      }
    };
    fetchEliteBrands();
  }, []);

  return (
    <section className="bg-asper-stone-light py-24 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display text-burgundy tracking-wide uppercase mb-4">
            Curated Excellence
          </h2>
          <div className="w-16 h-[2px] bg-polished-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {brands.map((brand) => (
            <Link to={`/brands/${brand.slug || brand.id}`} key={brand.id} className="group block cursor-pointer">
              <div className="relative overflow-hidden w-full aspect-[4/5] bg-white shadow-sm transition-all duration-700 ease-in-out group-hover:shadow-xl group-hover:ring-1 group-hover:ring-polished-gold group-hover:ring-offset-4 group-hover:ring-offset-asper-stone-light">
                <img
                  src={brand.hero_image_url || brand.imageUrl}
                  alt={`${brand.name} showcase`}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Clinical Shimmer Beam — no dark overlays */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(197, 160, 40, 0.12) 45%, rgba(255, 255, 255, 0.18) 50%, rgba(197, 160, 40, 0.12) 55%, transparent 60%)',
                  }}
                />
              </div>

              <div className="mt-8 text-center transition-transform duration-500 transform group-hover:-translate-y-1">
                <h3 className="text-xl md:text-2xl font-display text-burgundy tracking-widest uppercase">
                  {brand.name}
                </h3>
                <span className="block mt-2 text-sm text-polished-gold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Explore Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

