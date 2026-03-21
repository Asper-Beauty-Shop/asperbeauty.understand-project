/**
 * cleanup-rate-limits — Scheduled cron job to purge expired rate_limit_entries.
 * Called every 5 minutes by pg_cron via pg_net.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data, error } = await supabaseAdmin.rpc("cleanup_rate_limit_entries", {
      older_than_seconds: 120,
    });

    if (error) {
      console.error("Cleanup error:", JSON.stringify(error));
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedCount = data ?? 0;
    console.log(`Cleaned up ${deletedCount} expired rate limit entries`);

    const { error: telError } = await supabaseAdmin.from("telemetry_events").insert({
      event: "rate_limit_cleanup",
      source: "cron",
      user_id: null,
      payload: { deleted_count: deletedCount, run_at: new Date().toISOString() },
    });

    if (telError) {
      console.error("Telemetry insert error:", JSON.stringify(telError));
    }

    return new Response(JSON.stringify({ deleted: deletedCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Cleanup exception:", String(err));
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
