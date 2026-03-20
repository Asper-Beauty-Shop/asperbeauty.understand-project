import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ---------------------------------------------------------------------------
// Inline Zod-less validation (Edge Functions can't import from src/)
// ---------------------------------------------------------------------------
interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface CheckoutBody {
  items: CheckoutItem[];
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  area?: string;
  notes?: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PHONE_RE = /^07[789]\d{7}$/;
const NAME_RE = /^[a-zA-Z\u0600-\u06FF\s'-]+$/;

function validate(body: unknown): { data?: CheckoutBody; errors?: string[] } {
  const errors: string[] = [];
  if (!body || typeof body !== "object") return { errors: ["Invalid request body"] };

  const b = body as Record<string, unknown>;

  // items
  if (!Array.isArray(b.items) || b.items.length === 0) {
    errors.push("Cart cannot be empty");
  } else if (b.items.length > 50) {
    errors.push("Too many distinct items in cart");
  } else {
    for (const item of b.items) {
      if (!item || typeof item !== "object") { errors.push("Invalid item"); continue; }
      const it = item as Record<string, unknown>;
      if (typeof it.productId !== "string" || !UUID_RE.test(it.productId)) errors.push(`Invalid product ID: ${it.productId}`);
      if (typeof it.quantity !== "number" || !Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > 99) errors.push(`Invalid quantity for ${it.productId}`);
    }
  }

  // customerName
  if (typeof b.customerName !== "string" || b.customerName.trim().length < 2 || b.customerName.trim().length > 100 || !NAME_RE.test(b.customerName.trim()))
    errors.push("Invalid customer name");

  // customerPhone
  if (typeof b.customerPhone !== "string" || !PHONE_RE.test(b.customerPhone.trim()))
    errors.push("Invalid phone number format (07XXXXXXXX)");

  // deliveryAddress
  if (typeof b.deliveryAddress !== "string" || b.deliveryAddress.trim().length < 10 || b.deliveryAddress.trim().length > 500)
    errors.push("Invalid delivery address");

  // city
  if (typeof b.city !== "string" || b.city.trim().length === 0)
    errors.push("City is required");

  if (errors.length > 0) return { errors };

  return {
    data: {
      items: (b.items as CheckoutItem[]),
      customerName: (b.customerName as string).trim(),
      customerPhone: (b.customerPhone as string).trim(),
      deliveryAddress: (b.deliveryAddress as string).trim(),
      city: (b.city as string).trim(),
      area: typeof b.area === "string" ? b.area.trim() : undefined,
      notes: typeof b.notes === "string" ? b.notes.trim().slice(0, 500) : undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Generate order number: ASP-YYYYMMDD-XXXX
// ---------------------------------------------------------------------------
function generateOrderNumber(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ASP-${date}-${rand}`;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth (optional for guest checkout, but we try) ---
    const authHeader = req.headers.get("authorization") ?? "";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let userId: string | null = null;
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) userId = user.id;
    }

    // --- Parse & Validate ---
    const body = await req.json();
    const validation = validate(body);

    if (validation.errors) {
      return new Response(
        JSON.stringify({ error: { code: "VALIDATION_ERROR", details: validation.errors } }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const payload = validation.data!;
    const itemIds = payload.items.map((i) => i.productId);

    // --- Fetch canonical prices from DB (single IN query, O(1) map lookup) ---
    const { data: dbProducts, error: dbErr } = await supabaseAdmin
      .from("products")
      .select("id, name, price, in_stock, availability_status, inventory_total, image_url, brand")
      .in("id", itemIds);

    if (dbErr) {
      console.error("[DB_ERROR]", dbErr);
      return new Response(
        JSON.stringify({ error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch product data" } }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // O(1) lookup map
    const productMap = new Map((dbProducts ?? []).map((p) => [p.id, p]));

    const errors: string[] = [];
    const validatedItems: Array<{
      productId: string;
      name: string;
      brand: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      image_url: string | null;
    }> = [];
    let subtotal = 0;

    for (const reqItem of payload.items) {
      const dbProduct = productMap.get(reqItem.productId);

      // Defensive Check 1: exists & active
      if (!dbProduct || dbProduct.availability_status === "Pending_Purge") {
        errors.push(`Product ${reqItem.productId} is unavailable.`);
        continue;
      }

      // Defensive Check 2: in stock
      if (dbProduct.in_stock === false) {
        errors.push(`${dbProduct.name} is out of stock.`);
        continue;
      }

      // Defensive Check 3: inventory
      const inventory = dbProduct.inventory_total ?? 0;
      if (inventory > 0 && inventory < reqItem.quantity) {
        errors.push(`Only ${inventory} units available for ${dbProduct.name}.`);
        continue;
      }

      // Core Security: use DB price, ignore client
      // Use integer math (cents) to avoid floating point issues
      const unitPriceCents = Math.round(dbProduct.price * 100);
      const lineTotalCents = unitPriceCents * reqItem.quantity;

      validatedItems.push({
        productId: reqItem.productId,
        name: dbProduct.name,
        brand: dbProduct.brand,
        quantity: reqItem.quantity,
        unitPrice: unitPriceCents / 100,
        lineTotal: lineTotalCents / 100,
        image_url: dbProduct.image_url,
      });

      subtotal += lineTotalCents;
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: { code: "INVENTORY_CONFLICT", details: errors } }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- Calculate shipping (cents) ---
    const subtotalJOD = subtotal / 100;
    const shippingCostCents = subtotalJOD >= 50 ? 0 : 300; // 3 JOD in cents
    const totalCents = subtotal + shippingCostCents;

    // --- Create COD order ---
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("cod_orders")
      .insert({
        order_number: orderNumber,
        customer_name: payload.customerName,
        customer_phone: payload.customerPhone,
        delivery_address: payload.deliveryAddress,
        city: payload.city,
        notes: payload.notes || null,
        user_id: userId,
        items: validatedItems,
        subtotal: subtotalJOD,
        shipping_cost: shippingCostCents / 100,
        total: totalCents / 100,
        status: "pending",
      })
      .select("id, order_number, total, status")
      .single();

    if (orderErr) {
      console.error("[ORDER_INSERT_ERROR]", orderErr);
      return new Response(
        JSON.stringify({ error: { code: "ORDER_CREATION_FAILED", message: "Could not create your order. Please try again." } }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- Success response ---
    return new Response(
      JSON.stringify({
        data: {
          orderId: order.id,
          orderNumber: order.order_number,
          subtotal: subtotalJOD,
          shippingCost: shippingCostCents / 100,
          total: totalCents / 100,
          status: order.status,
          itemCount: validatedItems.length,
        },
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[CHECKOUT_ERROR]", err);
    return new Response(
      JSON.stringify({ error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred during checkout." } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
