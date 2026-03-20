/**
 * shopify-admin-api — Proxy for Shopify Admin API operations.
 * Used by the admin dashboard to manage products, orders, and customers.
 * Protected by JWT + admin role check.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_STORE_DOMAIN = "asper-beauty-shop-7.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

async function shopifyAdminFetch(
  accessToken: string,
  endpoint: string,
  method = "GET",
  body?: unknown,
) {
  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Shopify Admin API [${res.status}]: ${errText}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify JWT + admin role
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");

  if (!SHOPIFY_ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: "SHOPIFY_ACCESS_TOKEN not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Check admin role
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roles) {
    return new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { action, resource, id, payload } = body as {
    action: string;
    resource: string;
    id?: string | number;
    payload?: unknown;
  };

  try {
    let result: unknown;

    switch (resource) {
      case "products": {
        switch (action) {
          case "list":
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, "products.json?limit=50&status=active");
            break;
          case "get":
            if (!id) throw new Error("Product ID required");
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, `products/${id}.json`);
            break;
          case "create":
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, "products.json", "POST", { product: payload });
            break;
          case "update":
            if (!id) throw new Error("Product ID required");
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, `products/${id}.json`, "PUT", { product: payload });
            break;
          case "delete":
            if (!id) throw new Error("Product ID required");
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, `products/${id}.json`, "DELETE");
            result = { deleted: true };
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        break;
      }

      case "orders": {
        switch (action) {
          case "list":
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, "orders.json?status=any&limit=50");
            break;
          case "get":
            if (!id) throw new Error("Order ID required");
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, `orders/${id}.json`);
            break;
          case "fulfill":
            if (!id) throw new Error("Order ID required");
            result = await shopifyAdminFetch(
              SHOPIFY_ACCESS_TOKEN,
              `orders/${id}/fulfillments.json`,
              "POST",
              { fulfillment: { ...(payload as object), notify_customer: true } },
            );
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        break;
      }

      case "customers": {
        switch (action) {
          case "list":
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, "customers.json?limit=50");
            break;
          case "get":
            if (!id) throw new Error("Customer ID required");
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, `customers/${id}.json`);
            break;
          case "search": {
            const query = (payload as Record<string, string>)?.query || "";
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, `customers/search.json?query=${encodeURIComponent(query)}`);
            break;
          }
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        break;
      }

      case "inventory": {
        switch (action) {
          case "levels": {
            const itemIds = (payload as Record<string, string>)?.inventory_item_ids || "";
            result = await shopifyAdminFetch(
              SHOPIFY_ACCESS_TOKEN,
              `inventory_levels.json?inventory_item_ids=${itemIds}`,
            );
            break;
          }
          case "adjust": {
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, "inventory_levels/adjust.json", "POST", payload);
            break;
          }
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        break;
      }

      case "webhooks": {
        switch (action) {
          case "list":
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, "webhooks.json");
            break;
          case "create":
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, "webhooks.json", "POST", { webhook: payload });
            break;
          case "delete":
            if (!id) throw new Error("Webhook ID required");
            result = await shopifyAdminFetch(SHOPIFY_ACCESS_TOKEN, `webhooks/${id}.json`, "DELETE");
            result = { deleted: true };
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        break;
      }

      default:
        throw new Error(`Unknown resource: ${resource}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("shopify-admin-api error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
