/**
 * shopify-webhooks — Receives Shopify webhook events, verifies HMAC,
 * logs to shopify_webhook_log, and processes order/product/customer events.
 *
 * Supported topics:
 *   orders/create, orders/updated, orders/paid, orders/fulfilled
 *   products/create, products/update, products/delete
 *   customers/create, customers/update
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-shopify-topic, x-shopify-hmac-sha256, x-shopify-shop-domain",
};

async function verifyHmac(body: string, hmacHeader: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computed = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return computed === hmacHeader;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const SHOPIFY_WEBHOOK_SECRET = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");

  const topic = req.headers.get("x-shopify-topic") || "unknown";
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256") || "";

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return new Response("Invalid body", { status: 400, headers: corsHeaders });
  }

  // Verify HMAC if secret is configured
  if (SHOPIFY_WEBHOOK_SECRET && hmacHeader) {
    const valid = await verifyHmac(rawBody, hmacHeader, SHOPIFY_WEBHOOK_SECRET);
    if (!valid) {
      console.error("HMAC verification failed for topic:", topic);
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const shopifyId = String(payload.id || payload.admin_graphql_api_id || "");

  // Log the webhook
  const { error: logError } = await supabase.from("shopify_webhook_log").insert({
    topic,
    shopify_id: shopifyId,
    payload,
  });
  if (logError) console.error("Failed to log webhook:", logError.message);

  try {
    // ── Order Events ──
    if (topic.startsWith("orders/")) {
      await handleOrderEvent(supabase, topic, payload);
    }

    // ── Product Events ──
    if (topic.startsWith("products/")) {
      await handleProductEvent(supabase, topic, payload);
    }

    // ── Customer Events ──
    if (topic.startsWith("customers/")) {
      await handleCustomerEvent(supabase, topic, payload);
    }

    // Mark as processed
    if (shopifyId) {
      await supabase
        .from("shopify_webhook_log")
        .update({ processed: true })
        .eq("shopify_id", shopifyId)
        .eq("topic", topic);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Error processing ${topic}:`, err);

    if (shopifyId) {
      await supabase
        .from("shopify_webhook_log")
        .update({ error_message: String(err) })
        .eq("shopify_id", shopifyId)
        .eq("topic", topic);
    }

    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ── Handlers ──

async function handleOrderEvent(
  supabase: ReturnType<typeof createClient>,
  topic: string,
  order: Record<string, unknown>,
) {
  console.log(`Processing ${topic} for order #${order.order_number || order.name || order.id}`);

  // Send Telegram notification for new orders
  if (topic === "orders/create") {
    const lineItems = Array.isArray(order.line_items) ? order.line_items : [];
    const items = lineItems.map((li: Record<string, unknown>) => ({
      title: li.title,
      quantity: li.quantity,
    }));

    const customer = (order.customer || {}) as Record<string, unknown>;
    const shippingAddress = (order.shipping_address || {}) as Record<string, unknown>;

    const telegramPayload = {
      event: "INSERT",
      table: "cod_orders",
      record: {
        order_number: order.name || order.order_number,
        customer_name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Shopify Customer",
        customer_phone: customer.phone || shippingAddress.phone || "—",
        city: shippingAddress.city || "—",
        delivery_address: `${shippingAddress.address1 || ""} ${shippingAddress.address2 || ""}`.trim() || "—",
        items,
        total: Number(order.total_price || 0),
        status: order.financial_status || "pending",
      },
    };

    try {
      await supabase.functions.invoke("telegram-notify", { body: telegramPayload });
    } catch (e) {
      console.error("Telegram notify failed:", e);
    }
  }
}

async function handleProductEvent(
  supabase: ReturnType<typeof createClient>,
  topic: string,
  product: Record<string, unknown>,
) {
  console.log(`Processing ${topic} for product: ${product.title}`);

  const handle = product.handle as string;
  if (!handle) return;

  if (topic === "products/delete") {
    // Mark as out of stock in our catalog
    await supabase
      .from("products")
      .update({ availability_status: "out_of_stock", in_stock: false })
      .eq("handle", handle);
    return;
  }

  // products/create or products/update — sync inventory
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const totalInventory = variants.reduce(
    (sum: number, v: Record<string, unknown>) => sum + Number(v.inventory_quantity || 0),
    0,
  );
  const inStock = totalInventory > 0;

  const firstVariant = variants[0] as Record<string, unknown> | undefined;
  const price = firstVariant ? Number(firstVariant.price || 0) : 0;
  const compareAtPrice = firstVariant ? Number(firstVariant.compare_at_price || 0) : 0;

  const images = Array.isArray(product.images) ? product.images : [];
  const imageUrl = images.length > 0 ? (images[0] as Record<string, unknown>).src : null;

  // Upsert by handle
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("handle", handle)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("products")
      .update({
        name: product.title as string,
        title: product.title as string,
        price,
        original_price: compareAtPrice > price ? compareAtPrice : null,
        is_on_sale: compareAtPrice > price,
        discount_percent: compareAtPrice > price ? Math.round((1 - price / compareAtPrice) * 100) : null,
        inventory_total: totalInventory,
        in_stock: inStock,
        availability_status: inStock ? "in_stock" : "out_of_stock",
        image_url: imageUrl as string | null,
      })
      .eq("id", existing.id);
  }
}

async function handleCustomerEvent(
  supabase: ReturnType<typeof createClient>,
  _topic: string,
  customer: Record<string, unknown>,
) {
  const email = customer.email as string;
  if (!email) return;

  console.log(`Processing customer event for: ${email}`);

  // Log the customer data for reference — we don't auto-create Supabase users
  // but we can capture lead data
  const phone = customer.phone as string || (customer.default_address as Record<string, unknown>)?.phone as string || null;

  // Check if there's a profile with matching email (via auth)
  // This is informational — actual user linking happens through auth flows
  console.log(`Customer sync: ${email}, phone: ${phone}`);
}
