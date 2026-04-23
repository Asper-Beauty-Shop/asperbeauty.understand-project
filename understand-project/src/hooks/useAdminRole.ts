import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useAdminRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["admin-role", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "editor"]);
      if (error) {
        console.warn("Role check failed:", error.message);
        return false;
      }
      return (data?.length ?? 0) > 0;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
