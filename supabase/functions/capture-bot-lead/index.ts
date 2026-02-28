/**
 * Lead capture: "Save My Routine" / follow-up.
 * POST with email or whatsapp, optional concern, skin_type, recommended_product_ids.
 * Inserts into bot_leads (service role). Call from chat UI when user agrees to save routine.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

  let body: {
    contact_email?: string;
    contact_whatsapp?: string;
    concern?: string;
    skin_type?: string;
    recommended_product_ids?: string[];
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

  const email = typeof body.contact_email === "string"
    ? body.contact_email.trim()
    : "";
  const whatsapp = typeof body.contact_whatsapp === "string"
    ? body.contact_whatsapp.trim()
    : "";

  if (!email && !whatsapp) {
    return new Response(
      JSON.stringify({
        error: "contact_email or contact_whatsapp is required",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const concern = typeof body.concern === "string"
    ? body.concern.trim() || null
    : null;
  const skin_type = typeof body.skin_type === "string"
    ? body.skin_type.trim() || null
    : null;
  const source = typeof body.source === "string"
    ? body.source.trim() || "chatbot"
    : "chatbot";
  const ids = Array.isArray(body.recommended_product_ids)
    ? body.recommended_product_ids.filter(
      (id): id is string => typeof id === "string",
    )
    : [];

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("bot_leads")
    .insert({
      contact_email: email || null,
      contact_whatsapp: whatsapp || null,
      concern,
      skin_type,
      recommended_product_ids: ids.length ? ids : null,
      source,
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("capture-bot-lead insert error:", error);
    return new Response(JSON.stringify({ error: "Insert failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      id: data.id,
      message: "Routine saved. We'll send you the link shortly.",
    }),
    {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
