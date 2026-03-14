import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;

export const SKIN_CONCERNS = [
  { value: "Concern_Acne", label: "Acne" },
  { value: "Concern_Hydration", label: "Hydration" },
  { value: "Concern_Aging", label: "Aging" },
  { value: "Concern_Sensitivity", label: "Sensitivity" },
  { value: "Concern_Pigmentation", label: "Pigmentation" },
  { value: "Concern_Redness", label: "Redness" },
  { value: "Concern_Oiliness", label: "Oiliness" },
] as const;

export function useProducts(concern: string | null) {
  return useQuery({
    queryKey: ["products", concern],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .neq("availability_status", "Pending_Purge")
        .order("bestseller_rank", { ascending: true, nullsFirst: false });

      if (concern) {
        query = query.eq(
          "primary_concern",
          concern
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
