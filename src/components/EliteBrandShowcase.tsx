import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Brand {
  id: string;
  name: string;
  hero_image_url: string;
  slug: string;
  is_elite: boolean;
}

export default function EliteBrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEliteBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_elite', true)
        .limit(3);

      if (!error && data) {
        setBrands(data);
      }
      setLoading(false);
    };
    fetchEliteBrands();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center">Loading Excellence...</div>;

  return (
    <section className="bg-[#FFFBF2] py-24 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-[#6B2D30] tracking-wide uppercase mb-4">
            Curated Excellence
          </h2>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {brands.map((brand) => (
            <Link to={`/brands/${brand.slug}`} key={brand.id} className="group block cursor-pointer">
              <div className="relative overflow-hidden w-full aspect-[4/5] bg-white shadow-sm transition-all duration-700 ease-in-out group-hover:shadow-xl group-hover:ring-1 group-hover:ring-[#D4AF37] group-hover:ring-offset-4 group-hover:ring-offset-[#FFFBF2]">
                <img
                  src={brand.hero_image_url}
                  alt={`${brand.name} showcase`}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              <div className="mt-8 text-center transition-transform duration-500 transform group-hover:-translate-y-1">
                <h3 className="text-xl md:text-2xl font-serif text-[#6B2D30] tracking-widest uppercase">
                  {brand.name}
                </h3>
                <span className="block mt-2 text-sm text-[#D4AF37] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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
