/**
 * shopify-webhooks — Receives Shopify webhook events, verifies HMAC,
 * logs to shopify_webhook_log, and processes events.
 *
 * Supported topics:
 *   orders/create, orders/updated, orders/paid, orders/fulfilled
 *   products/create, products/update, products/delete
 *   customers/create, customers/update
 *   collections/create, collections/update, collections/delete
 *   inventory_items/create, inventory_items/update, inventory_items/delete
 *   inventory_levels/update, inventory_levels/connect
 *   discounts/create, discounts/update, discounts/delete
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

    // ── Inventory Level Events ──
    if (topic === "inventory_levels/update" || topic === "inventory_levels/connect") {
      await handleInventoryLevelEvent(supabase, payload);
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

async function handleInventoryLevelEvent(
  supabase: ReturnType<typeof createClient>,
  payload: Record<string, unknown>,
) {
  const inventoryItemId = payload.inventory_item_id;
  const available = Number(payload.available ?? 0);
  console.log(`Inventory level update: item=${inventoryItemId}, available=${available}`);

  // Shopify inventory_levels/update only gives inventory_item_id, not the product handle.
  // We need to look up the product via the Shopify Admin API.
  const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!SHOPIFY_ACCESS_TOKEN || !inventoryItemId) return;

  try {
    // Get the inventory item to find the variant
    const itemRes = await fetch(
      `https://asper-beauty-shop-7.myshopify.com/admin/api/2025-07/inventory_items/${inventoryItemId}.json`,
      { headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN } },
    );
    if (!itemRes.ok) {
      console.error(`Failed to fetch inventory item ${inventoryItemId}: ${itemRes.status}`);
      return;
    }
    const itemData = await itemRes.json();
    const sku = itemData.inventory_item?.sku;

    // Get the variant to find the product
    const variantRes = await fetch(
      `https://asper-beauty-shop-7.myshopify.com/admin/api/2025-07/variants.json?fields=id,product_id,inventory_quantity&limit=1`,
      { headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN } },
    );

    // Alternative approach: get the product directly via inventory_item_id
    // Search for the product by looking up all products and matching
    const prodSearchRes = await fetch(
      `https://asper-beauty-shop-7.myshopify.com/admin/api/2025-07/products.json?limit=250&fields=id,handle,variants`,
      { headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN } },
    );

    if (!prodSearchRes.ok) {
      // Consume unused response
      await variantRes.text();
      console.error("Failed to fetch products for inventory sync");
      return;
    }
    // Consume the variant response we don't need
    await variantRes.text();

    const prodData = await prodSearchRes.json();
    const products = Array.isArray(prodData.products) ? prodData.products : [];

    // Find the product that contains a variant with this inventory_item_id
    let matchedHandle: string | null = null;
    let totalProductInventory = 0;

    for (const p of products) {
      const variants = Array.isArray(p.variants) ? p.variants : [];
      const match = variants.find(
        (v: Record<string, unknown>) => Number(v.inventory_item_id) === Number(inventoryItemId),
      );
      if (match) {
        matchedHandle = p.handle;
        totalProductInventory = variants.reduce(
          (sum: number, v: Record<string, unknown>) => sum + Number(v.inventory_quantity || 0),
          0,
        );
        break;
      }
    }

    if (!matchedHandle) {
      console.log(`No matching product found for inventory_item_id=${inventoryItemId}, sku=${sku}`);
      return;
    }

    const inStock = totalProductInventory > 0;
    console.log(`Syncing inventory for handle=${matchedHandle}: total=${totalProductInventory}, inStock=${inStock}`);

    await supabase
      .from("products")
      .update({
        inventory_total: totalProductInventory,
        in_stock: inStock,
        availability_status: inStock ? "in_stock" : "out_of_stock",
      })
      .eq("handle", matchedHandle);
  } catch (err) {
    console.error("Inventory level sync error:", err);
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

  const phone = customer.phone as string || (customer.default_address as Record<string, unknown>)?.phone as string || null;
  console.log(`Customer sync: ${email}, phone: ${phone}`);
}
