import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatJOD, getProductImage } from '@/lib/productImageUtils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

import type { Tables } from '@/integrations/supabase/types';

const PAGE_SIZE = 48;

type Product = Tables<'products'>;

export default function ShopAllOrganized() {
  const { language } = useLanguage();

  const [categories, setCategories] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<string>('All');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Load distinct categories once on mount
  useEffect(() => {
    supabase
      .from('products')
      .select('asper_category')
      .eq('available', true)
      .not('asper_category', 'is', null)
      .then(({ data }) => {
        if (!data) return;
        const unique = Array.from(
          new Set(data.map((r) => r.asper_category as string).filter(Boolean))
        ).sort();
        setCategories(unique);
      });
  }, []);

  // Build query for the active category
  const buildQuery = (start: number) => {
    let q = supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('bestseller_rank', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);

    if (activeType !== 'All') {
      q = q.eq('asper_category', activeType);
    }
    return q;
  };

  // Reload when tab changes
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setOffset(0);
    setProducts([]);
    buildQuery(0).then(({ data, error }) => {
      if (cancelled) return;
      if (error) console.error(error);
      setProducts(data ?? []);
      setHasMore((data?.length ?? 0) === PAGE_SIZE);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = offset + PAGE_SIZE;
    const { data, error } = await buildQuery(next);
    if (!error) {
      setProducts((prev) => [...prev, ...(data ?? [])]);
      setOffset(next);
      setHasMore((data?.length ?? 0) === PAGE_SIZE);
    }
    setLoadingMore(false);
  };

  // When showing All, group products by their asper_category
  const groupedProducts = useMemo(() => {
    if (activeType !== 'All') return null;
    return products.reduce<Record<string, Product[]>>((acc, p) => {
      const key = (p.asper_category as string) || 'Other';
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    }, {});
  }, [products, activeType]);

  const tabs = ['All', ...categories];

  return (
    <div className="min-h-screen bg-soft-ivory">
      <Header />

      <section className="min-h-screen pt-20 pb-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-sans text-sm text-maroon/70 hover:text-maroon tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة إلى المتجر' : 'Back to Shop'}
          </Link>
        </div>

        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl text-maroon">
            {language === 'ar' ? 'المجموعة' : 'The Collection'}
          </h1>
          <p className="font-sans text-maroon/70 tracking-wide uppercase text-sm">
            {language === 'ar'
              ? 'جودة أصيلة • فخامة سريرية'
              : 'Authentic Quality • Clinical Luxury'}
          </p>
        </div>

        {/* Category tabs — built from live database */}
        <div className="flex justify-center gap-3 md:gap-5 mb-10 md:mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveType(tab)}
              className={`
                font-sans text-sm tracking-widest uppercase px-4 md:px-6 py-2 border transition-all duration-300
                ${activeType === tab
                  ? 'border-shiny-gold text-maroon bg-white shadow-sm'
                  : 'border-transparent text-maroon/60 hover:text-maroon hover:border-maroon/20'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-maroon animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="font-sans text-maroon/70 tracking-wide">
              {language === 'ar' ? 'لا توجد منتجات في هذه الفئة.' : 'No products in this category.'}
            </p>
            <button
              type="button"
              onClick={() => setActiveType('All')}
              className="mt-4 font-sans text-sm text-shiny-gold hover:underline"
            >
              {language === 'ar' ? 'عرض الكل' : 'View all'}
            </button>
          </div>
        ) : groupedProducts ? (
          // All tab — grouped by category
          <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
            {Object.entries(groupedProducts).sort(([a], [b]) => a.localeCompare(b)).map(([cat, items]) => (
              <div key={cat}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-serif text-2xl md:text-3xl text-maroon whitespace-nowrap">{cat}</h2>
                  <div className="h-px w-full bg-shiny-gold/30" />
                  <button
                    type="button"
                    onClick={() => setActiveType(cat)}
                    className="font-sans text-xs tracking-widest uppercase text-shiny-gold whitespace-nowrap hover:underline"
                  >
                    {language === 'ar' ? 'عرض الكل' : 'See all'}
                  </button>
                </div>
                <ProductGrid products={items.slice(0, 8)} />
              </div>
            ))}
          </div>
        ) : (
          // Single category tab — flat grid
          <div className="max-w-7xl mx-auto">
            <ProductGrid products={products} />
          </div>
        )}

        {!isLoading && hasMore && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="font-sans text-sm tracking-widest uppercase px-8 py-3 border border-maroon text-maroon hover:bg-maroon hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </span>
              ) : (
                language === 'ar' ? 'تحميل المزيد' : 'Load more'
              )}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12">
      {products.map((product) => {
        const imageUrl = getProductImage(
          product.image_url,
          (product.asper_category as string) ?? (product.category as string) ?? '',
          product.title,
        );
        return (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="group block cursor-pointer"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-white border border-maroon/5 mb-4 shadow-sm group-hover:shadow-md transition-all duration-500">
              <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/5 transition-colors z-10" />
              <img
                src={imageUrl}
                alt={product.title ?? ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="font-sans text-[10px] uppercase tracking-widest text-shiny-gold">
                {(product.asper_category as string) ?? (product.category as string)}
              </p>
              <h3 className="font-serif text-lg text-maroon group-hover:text-shiny-gold transition-colors line-clamp-2">
                {product.title}
              </h3>
              <p className="font-sans text-sm text-maroon">
                {formatJOD(product.price)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
