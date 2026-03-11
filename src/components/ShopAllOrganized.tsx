import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatJOD, getProductImage } from '@/lib/productImageUtils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const PAGE_SIZE = 48;

interface Product {
  id: string;
  title: string;
  price: number | null;
  handle: string;
  primary_concern: string;
  image_url: string | null;
  brand: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  // Compat aliases
  category?: string;
  subcategory?: string | null;
  description?: string | null;
  volume_ml?: string | null;
  is_on_sale?: boolean | null;
  original_price?: number | null;
  discount_percent?: number | null;
  skin_concerns?: string[] | null;
}

function groupByCollection(items: Product[]): Record<string, Product[]> {
  return items.reduce((acc, product) => {
    const key = (product.primary_concern as string)?.replace('Concern_', '') || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
}

export default function ShopAllOrganized() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeType, setActiveType] = useState<string>('All');

  const fetchPage = async (offset: number, append: boolean) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) throw error;
    if (append) {
      setProducts((prev) => [...prev, ...(data || [])]);
    } else {
      setProducts(data || []);
    }
    setHasMore((data?.length ?? 0) === PAGE_SIZE);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        await fetchPage(0, false);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      await fetchPage(products.length, true);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (activeType === 'All') return products;
    return products.filter((p) => p.category === activeType);
  }, [products, activeType]);

  const groupedProducts = useMemo(
    () => groupByCollection(filteredProducts),
    [filteredProducts],
  );

  const uniqueTypes = useMemo(() => {
    const types = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(types).sort()];
  }, [products]);

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

        {/* Type filter bar */}
        <div className="flex justify-center gap-4 md:gap-6 mb-10 md:mb-12 flex-wrap">
          {uniqueTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`
                font-sans text-sm tracking-widest uppercase px-4 md:px-6 py-2 border transition-all duration-300
                ${
                  activeType === type
                    ? 'border-shiny-gold text-maroon bg-white shadow-sm'
                    : 'border-transparent text-maroon/60 hover:text-maroon hover:border-maroon/20'
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-maroon animate-spin" />
          </div>
        ) : Object.keys(groupedProducts).length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="font-sans text-maroon/70 tracking-wide">
              {language === 'ar'
                ? 'لا توجد منتجات في هذه الفئة.'
                : 'No products in this category.'}
            </p>
            <button
              type="button"
              onClick={() => setActiveType('All')}
              className="mt-4 font-sans text-sm text-shiny-gold hover:underline"
            >
              {language === 'ar' ? 'عرض الكل' : 'View all'}
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
            {Object.entries(groupedProducts).map(([collectionName, items]) => (
              <div key={collectionName} className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-serif text-2xl md:text-3xl text-maroon whitespace-nowrap">
                    {collectionName}
                  </h2>
                  <div className="h-px w-full bg-shiny-gold/30" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12">
                  {items.map((product) => {
                    const imageUrl = getProductImage(
                      product.image_url,
                      product.category,
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
                            alt={product.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-sans text-[10px] uppercase tracking-widest text-shiny-gold">
                            {product.category}
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
              </div>
            ))}
          </div>
        )}

        {!isLoading && hasMore && products.length > 0 && (
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

