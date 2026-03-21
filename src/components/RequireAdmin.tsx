import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { saveReturnPath } from "@/lib/auth-redirect";
import { Loader2 } from "lucide-react";

/**
 * Protects admin routes: requires Supabase session + user_roles.role = 'admin'.
 * Redirects to /auth if not signed in, or / with toast if not admin.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/auth", { replace: true });
          return;
        }

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!roles) {
          toast.error("Access denied. Admin privileges required.");
          navigate("/", { replace: true });
          return;
        }

        setAllowed(true);
      } catch (error) {
        console.error("RequireAdmin check error:", error);
        toast.error("Something went wrong.");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-maroon animate-spin" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}

