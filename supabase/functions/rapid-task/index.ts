/**
 * rapid-task — Asper Beauty Shop Admin Task Runner
 *
 * Authenticated admin-only endpoint for quick operational tasks.
 * POST { "task": "<task_name>", "payload": { ... } }
 *
 * Available tasks:
 *   health           — System health snapshot
 *   clear-rate-limits — Flush stale rate_limit windows
 *   sync-tray        — Rebuild digital_tray_products from products table
 *   stats            — Row counts for all key tables
 */

declare const Deno: { env: { get(key: string): string | undefined } };
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.asperbeautyshop.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // ── Auth guard — require valid admin session ──────────────────────────────
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  const supabaseUser = createClient(SUPABASE_URL, token, {
    auth: { persistSession: false },
  });
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const { data: { user }, error: authErr } = await supabaseUser.auth.getUser();
  if (authErr || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  // Verify admin role
  const { data: roleRow } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleRow) {
    return json({ error: "Forbidden — admin role required" }, 403);
  }

  // ── Parse request ─────────────────────────────────────────────────────────
  let body: { task?: string; payload?: Record<string, unknown> } = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const task = (body.task ?? "").toLowerCase().trim();
  const t0 = Date.now();

  // ── Task dispatcher ───────────────────────────────────────────────────────
  switch (task) {

    // -- Health snapshot ------------------------------------------------------
    case "health": {
      const checks: Record<string, string> = {};

      const { count: productCount } = await supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true });
      checks.products = productCount != null ? `${productCount} rows` : "error";

      const { count: brandCount } = await supabaseAdmin
        .from("brands")
        .select("*", { count: "exact", head: true });
      checks.brands = brandCount != null ? `${brandCount} rows` : "error";

      const { count: orderCount } = await supabaseAdmin
        .from("cod_orders")
        .select("*", { count: "exact", head: true });
      checks.cod_orders = orderCount != null ? `${orderCount} rows` : "error";

      return json({
        task: "health",
        status: "ok",
        checks,
        ms: Date.now() - t0,
        ts: new Date().toISOString(),
      });
    }

    // -- Stats ----------------------------------------------------------------
    case "stats": {
      const tables = [
        "products", "brands", "cod_orders", "concierge_profiles",
        "consultations", "product_reviews", "regimen_plans",
        "customer_leads", "telemetry_events", "user_roles",
      ];

      const counts: Record<string, number | string> = {};
      await Promise.all(
        tables.map(async (t) => {
          const { count, error } = await supabaseAdmin
            .from(t)
            .select("*", { count: "exact", head: true });
          counts[t] = error ? "error" : (count ?? 0);
        }),
      );

      return json({ task: "stats", counts, ms: Date.now() - t0 });
    }

    // -- Clear stale rate-limit windows ---------------------------------------
    case "clear-rate-limits": {
      const { error, count } = await supabaseAdmin
        .from("rate_limits")
        .delete({ count: "exact" })
        .lt("window_start", new Date(Date.now() - 60_000).toISOString());

      if (error) return json({ error: error.message }, 500);
      return json({ task: "clear-rate-limits", deleted: count, ms: Date.now() - t0 });
    }

    // -- Sync digital tray from products table --------------------------------
    case "sync-tray": {
      const { error } = await supabaseAdmin.rpc("build_digital_tray", {
        in_concern: body.payload?.concern ?? "Concern_Hydration",
      });
      if (error) return json({ error: error.message }, 500);
      return json({ task: "sync-tray", status: "rebuilt", ms: Date.now() - t0 });
    }

    // -- Unknown task ---------------------------------------------------------
    default:
      return json({
        error: `Unknown task: "${task}"`,
        available: ["health", "stats", "clear-rate-limits", "sync-tray"],
      }, 400);
  }
});
