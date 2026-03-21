/**
 * cleanup-rate-limits — Scheduled cron job to purge expired rate_limit_entries.
 * Called every 5 minutes by pg_cron via pg_net.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

Deno.serve(async (req) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Validate authorization — must be service role or anon key from cron
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (token !== anonKey && token !== serviceKey) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const { data, error } = await supabaseAdmin.rpc("cleanup_rate_limit_entries", {
      older_than_seconds: 120,
    });

    if (error) {
      console.error("Cleanup error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Cleaned up ${data} expired rate limit entries`);

    // Log to telemetry for monitoring
    await supabaseAdmin.from("telemetry_events").insert({
      event: "rate_limit_cleanup",
      source: "cron",
      payload: { deleted_count: data, run_at: new Date().toISOString() },
    });

    return new Response(JSON.stringify({ deleted: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Cleanup exception:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
