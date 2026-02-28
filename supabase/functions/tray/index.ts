/**
 * Digital Tray API: GET /functions/v1/tray?concern=Concern_Hydration
 * Returns JSON from get_tray_by_concern RPC (step_1_cleanser, step_2_treatment, step_3_moisturizer).
 * Null slots mean "Consult Pharmacist" in the UI.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_CONCERNS = new Set([
  "Concern_Acne",
  "Concern_AntiAging",
  "Concern_Brightening",
  "Concern_Dryness",
  "Concern_Hydration",
  "Concern_Sensitivity",
  "Concern_Pigmentation",
  "Concern_SunProtection",
  "Concern_Redness",
  "Concern_Cleansing",
  "Concern_Wrinkles",
  "Concern_OilySkin",
  "Concern_DrySkin",
  "Concern_HairLoss",
]);

function normalizeConcern(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (ALLOWED_CONCERNS.has(trimmed)) return trimmed;
  const capitalized = "Concern_" + trimmed.charAt(0).toUpperCase() +
    trimmed.slice(1).toLowerCase().replace(/\s+/g, "");
  if (ALLOWED_CONCERNS.has(capitalized)) return capitalized;
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const concernParam = url.searchParams.get("concern") ?? "";
  const concern = normalizeConcern(concernParam);

  if (!concern) {
    return new Response(
      JSON.stringify({
        error: "Invalid or missing concern",
        hint:
          "Use concern=Concern_Hydration | Concern_Acne | Concern_AntiAging | Concern_Sensitivity | Concern_Pigmentation | ...",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const { data, error } = await supabase.rpc("get_tray_by_concern", {
    p_concern: concern,
  });

  if (error) {
    console.error("tray get_tray_by_concern error:", error);
    return new Response(
      JSON.stringify({ error: "Tray query failed", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify(data ?? {}), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
