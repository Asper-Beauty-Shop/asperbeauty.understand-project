// Ingest deployment health checks and checklist progress. Requires HEALTH_CHECKS_SECRET header.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-health-checks-secret",
};

const VALID_STATUSES = ["success", "failure", "cancelled", "running"] as const;

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

  const secret = req.headers.get("x-health-checks-secret");
  const expected = Deno.env.get("HEALTH_CHECKS_SECRET");
  if (!expected || secret !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: {
    health_check?: {
      branch: string;
      job_name: string;
      status: string;
      run_id?: string;
      run_url?: string;
      payload?: Record<string, unknown>;
    };
    checklist_progress?: {
      checklist_slug: string;
      branch_or_context?: string;
      completed?: boolean;
      payload?: Record<string, unknown>;
    };
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const results: {
    health_check?: { id: number };
    checklist_progress?: { id: number };
  } = {};

  if (body.health_check) {
    const h = body.health_check;
    const branch = typeof h.branch === "string" ? h.branch.trim() : "";
    const job_name = typeof h.job_name === "string" ? h.job_name.trim() : "";
    const status =
      VALID_STATUSES.includes(h.status as (typeof VALID_STATUSES)[number])
        ? h.status
        : "running";

    if (!branch || !job_name) {
      return new Response(
        JSON.stringify({
          error: "health_check.branch and health_check.job_name required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const payload =
      h.payload && typeof h.payload === "object" && !Array.isArray(h.payload)
        ? h.payload
        : {};
    const { data, error } = await supabase
      .from("deployment_health_checks")
      .insert({
        branch,
        job_name,
        status,
        run_id: h.run_id ?? null,
        run_url: h.run_url ?? null,
        payload,
      })
      .select("id")
      .single();

    if (error) {
      console.error("deployment_health_checks insert error:", error);
      return new Response(
        JSON.stringify({ error: "Health check insert failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    results.health_check = { id: data.id };
  }

  if (body.checklist_progress) {
    const p = body.checklist_progress;
    const slug = typeof p.checklist_slug === "string"
      ? p.checklist_slug.trim()
      : "";
    if (!slug) {
      return new Response(
        JSON.stringify({ error: "checklist_progress.checklist_slug required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const payload =
      p.payload && typeof p.payload === "object" && !Array.isArray(p.payload)
        ? p.payload
        : {};
    const { data, error } = await supabase
      .from("checklist_progress")
      .insert({
        checklist_slug: slug,
        branch_or_context: p.branch_or_context ?? null,
        completed: p.completed !== false,
        payload,
      })
      .select("id")
      .single();

    if (error) {
      console.error("checklist_progress insert error:", error);
      return new Response(
        JSON.stringify({ error: "Checklist progress insert failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    results.checklist_progress = { id: data.id };
  }

  if (!body.health_check && !body.checklist_progress) {
    return new Response(
      JSON.stringify({
        error: "Provide health_check and/or checklist_progress",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ ok: true, ...results }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
