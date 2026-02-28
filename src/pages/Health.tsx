import { useEffect, useState } from "react";

interface HealthStatus {
  status: "ok" | "degraded";
  version: string;
  timestamp: string;
  checks: {
    supabase: boolean;
    shopify: boolean;
  };
}

const Health = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const shopifyDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;

    const checks = { supabase: !!supabaseUrl, shopify: !!shopifyDomain };

    setHealth({
      status: checks.supabase ? "ok" : "degraded",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      checks,
    });
  }, []);

  if (!health) return null;

  return (
    <pre style={{ fontFamily: "monospace", padding: "2rem" }}>
      {JSON.stringify(health, null, 2)}
    </pre>
  );
};

export default Health;
