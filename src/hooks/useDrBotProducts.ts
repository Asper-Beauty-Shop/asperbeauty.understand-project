/**
 * Fetches products from Supabase for Dr. Bot knowledge base.
 * Classifies as Clinical (Dr. Sami) vs Cosmetic (Ms. Zain) for persona-aware recommendations.
 * Backend (beauty-assistant Edge Function) should perform similar ingestion.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  classifyProductAsClinical,
  type ProductRecord,
} from "@/lib/drBotPersona";

export type ClassifiedProduct = ProductRecord & {
  id: string;
  title: string;
  price?: number;
  image_url?: string | null;
  isClinical: boolean;
};

export function useDrBotProducts(options?: { limit?: number }) {
  const limit = options?.limit ?? 500;

  return useQuery({
    queryKey: ["dr-bot-products", limit],
    queryFn: async (): Promise<{ clinical: ClassifiedProduct[]; cosmetic: ClassifiedProduct[] }> => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, price, image_url, category, subcategory, skin_concerns, tags")
        .limit(limit);

      if (error) throw error;

      const clinical: ClassifiedProduct[] = [];
      const cosmetic: ClassifiedProduct[] = [];

      (data ?? []).forEach((row) => {
        const record: ProductRecord = {
          category: row.category,
          subcategory: row.subcategory,
          skin_concerns: row.skin_concerns,
          tags: row.tags,
          title: row.title,
        };
        const isClinical = classifyProductAsClinical(record);
        const item: ClassifiedProduct = {
          ...row,
          ...record,
          isClinical,
        };
        if (isClinical) clinical.push(item);
        else cosmetic.push(item);
      });

      return { clinical, cosmetic };
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}
