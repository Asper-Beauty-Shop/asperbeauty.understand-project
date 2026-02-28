import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

  try {
    const { orderNumber, token } = await req.json();

    // Validate required fields
    if (!orderNumber || !token) {
      console.log("Missing required fields:", {
        orderNumber: !!orderNumber,
        token: !!token,
      });
      return new Response(
        JSON.stringify({
          error: "Order number and confirmation token are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate token format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(token)) {
      console.log("Invalid token format:", token);
      return new Response(
        JSON.stringify({ error: "Invalid confirmation token format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Lookup order by order number AND confirmation token (secure token-based verification)
    const { data: order, error } = await supabase
      .from("cod_orders")
      .select(
        "order_number, status, items, subtotal, shipping_cost, total, city, delivery_address, created_at, updated_at",
      )
      .eq("order_number", orderNumber.toUpperCase().trim())
      .eq("confirmation_token", token)
      .single();

    if (error || !order) {
      console.log("Order not found or token mismatch:", {
        orderNumber,
        error: error?.message,
      });
      return new Response(
        JSON.stringify({
          error:
            "Order not found. Please check your order number and confirmation token.",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Order found successfully:", order.order_number);

    return new Response(
      JSON.stringify({ order }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch order status" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
