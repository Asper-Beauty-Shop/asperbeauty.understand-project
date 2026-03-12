import { supabase } from '@/integrations/supabase/client';

export interface RecommendedProduct {
  id: string;
  handle: string;
  title: string;
  brand: string | null;
  price: number;
  image_url: string | null;
  dr_rose_recommended: boolean;
}

/**
 * Fetches products specifically flagged as 'Dr. Rose Recommended'.
 * Optimizes performance by selecting only necessary columns to prevent over-fetching.
 */
export async function fetchDrRoseRecommendedProducts(): Promise<RecommendedProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      handle,
      title,
      brand,
      price,
      image_url,
      dr_rose_recommended
    `)
    .eq('dr_rose_recommended', true)
    .gt('inventory_total', 0) // Only fetch in-stock items
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching Dr. Rose recommendations:', error.message);
    throw error;
  }

  return data as RecommendedProduct[];
}
