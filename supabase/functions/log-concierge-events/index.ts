// Log concierge analytics: skin_concern_click (Top Skin Concern) and add_to_cart_from_prescription (Prescription Conversion).
// Writes to telemetry_events (source='concierge').
// Optional: set CONCIERGE_EVENTS_SECRET and send header x-concierge-events-secret.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-concierge-events-secret",
};

const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute per IP

const ALLOWED_EVENTS = [
  "skin_concern_click",
  "add_to_cart_from_prescription",
] as const;

const store = new Map<string, { count: number; resetAt: number }>();

function getClientIP(req: Request): string {
  const x = req.headers.get("x-forwarded-for");
  if (x) return x.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `concierge:${ip}`;
  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

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

  const secret = Deno.env.get("CONCIERGE_EVENTS_SECRET");
  if (secret && req.headers.get("x-concierge-events-secret") !== secret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = getClientIP(req);
  if (!rateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: {
    event?: string;
    concern_id?: string;
    concern_slug?: string;
    product_id?: string;
    source?: string;
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const event =
    ALLOWED_EVENTS.includes(body.event as (typeof ALLOWED_EVENTS)[number])
      ? body.event
      : "skin_concern_click";

  let payload: Record<string, unknown>;

  if (event === "add_to_cart_from_prescription") {
    const product_id = typeof body.product_id === "string"
      ? body.product_id.trim()
      : "";
    if (!product_id) {
      return new Response(
        JSON.stringify({
          error: "product_id is required for add_to_cart_from_prescription",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    payload = {
      product_id,
      source: typeof body.source === "string"
        ? body.source.trim() || "quick_view"
        : "quick_view",
    };
  } else {
    const concern_id = typeof body.concern_id === "string"
      ? body.concern_id.trim()
      : "";
    if (!concern_id) {
      return new Response(JSON.stringify({ error: "concern_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const concern_slug = typeof body.concern_slug === "string"
      ? body.concern_slug.trim()
      : concern_id;
    payload = { concern_id, concern_slug };
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("telemetry_events")
    .insert({
      source: "concierge",
      event,
      user_id: null,
      correlation_id: null,
      payload,
    })
    .select("id, occurred_at")
    .single();

  if (error) {
    console.error("log-concierge-events insert error:", error);
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
