// Log telemetry events into public.telemetry_events. Server-side only; requires TELEMETRY_INGEST_SECRET.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-telemetry-secret, x-concierge-events-secret",
};

const ALLOWED_SOURCES = ["quiz", "api", "sync", "concierge"];
const MAX_PAYLOAD_KEYS = 20;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const secret = req.headers.get("x-telemetry-secret");
  const expected = Deno.env.get("TELEMETRY_INGEST_SECRET");
  if (!expected || secret !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: {
    source?: string;
    event?: string;
    user_id?: string | null;
    correlation_id?: string | null;
    payload?: Record<string, unknown>;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const source = typeof body.source === "string" ? body.source.trim() : "";
  const event = typeof body.event === "string" ? body.event.trim() : "";
  if (!source || !event) {
    return new Response(
      JSON.stringify({ error: "source and event are required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (!ALLOWED_SOURCES.includes(source)) {
    return new Response(
      JSON.stringify({
        error: `source must be one of: ${ALLOWED_SOURCES.join(", ")}`,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const payload = body.payload && typeof body.payload === "object" &&
      !Array.isArray(body.payload)
    ? body.payload
    : {};
  const keys = Object.keys(payload);
  if (keys.length > MAX_PAYLOAD_KEYS) {
    return new Response(
      JSON.stringify({
        error: `payload may have at most ${MAX_PAYLOAD_KEYS} keys`,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase.from("telemetry_events").insert({
    source,
    event,
    user_id: body.user_id || null,
    correlation_id: body.correlation_id || null,
    payload,
  }).select("id, occurred_at").single();

  if (error) {
    console.error("telemetry insert error:", error);
    return new Response(JSON.stringify({ error: "Insert failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ ok: true, id: data.id, occurred_at: data.occurred_at }),
    {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
