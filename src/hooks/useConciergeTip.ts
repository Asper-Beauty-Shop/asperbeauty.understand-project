import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ConciergeTipData } from "@/components/product/ConciergeTipCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseConciergeTipParams {
  productTitle: string;
  keyIngredients?: string[] | null;
  skinType?: string | null;
  skinConcerns?: string[] | null;
  enabled?: boolean;
}

export const useConciergeTip = ({
  productTitle,
  keyIngredients,
  skinType,
  skinConcerns,
  enabled = true,
}: UseConciergeTipParams) => {
  const { locale } = useLanguage();

  return useQuery<ConciergeTipData>({
    queryKey: ["concierge-tip", productTitle, keyIngredients, skinType, skinConcerns, locale],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("concierge-tip", {
        body: {
          product_title: productTitle,
          key_ingredients: keyIngredients ?? [],
          skin_type: skinType ?? null,
          skin_concerns: skinConcerns ?? [],
          locale,
        },
      });

      if (error) throw error;
      return data as ConciergeTipData;
    },
    enabled: enabled && !!productTitle,
    staleTime: 5 * 60 * 1000, // Cache for 5 min
    retry: 1,
  });
};
