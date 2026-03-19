/**
 * telegram-notify — sends formatted alerts to the Asper admin Telegram channel.
 * Called by pg_net database triggers for: new orders, new leads, new subscribers.
 */

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;

async function sendMessage(text: string) {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API error: ${err}`);
  }
}

function formatOrder(record: Record<string, unknown>): string {
  const items = Array.isArray(record.items)
    ? record.items
        .map((i: Record<string, unknown>) => `  • ${i.title} × ${i.quantity}`)
        .join("\n")
    : "—";
  return (
    `🛍️ <b>New Order #${record.order_number ?? "—"}</b>\n` +
    `👤 ${record.customer_name ?? "—"}\n` +
    `📞 ${record.customer_phone ?? "—"}\n` +
    `📍 ${record.city ?? "—"} — ${record.delivery_address ?? ""}\n` +
    `\n<b>Items:</b>\n${items}\n` +
    `\n💰 Total: <b>${Number(record.total ?? 0).toFixed(3)} JD</b>\n` +
    `🚚 Status: ${record.status ?? "pending"}`
  );
}

function formatLead(record: Record<string, unknown>): string {
  return (
    `🌸 <b>New Lead</b> via ${record.source ?? "website"}\n` +
    `📧 ${record.email ?? "—"}\n` +
    `📞 ${record.phone ?? "—"}\n` +
    `🧴 Concern: ${record.skin_concern ?? "—"}\n` +
    (record.chat_summary ? `💬 "${record.chat_summary}"` : "")
  );
}

function formatSubscriber(record: Record<string, unknown>): string {
  return (
    `📬 <b>New Newsletter Subscriber</b>\n` +
    `📧 ${record.email ?? "—"}`
  );
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Verify the caller is the Supabase service role (pg_net triggers use service_role key)
  const authHeader = req.headers.get("Authorization");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (
    !serviceRoleKey ||
    !authHeader ||
    authHeader !== `Bearer ${serviceRoleKey}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { event, table, record } = body as {
    event: string;
    table: string;
    record: Record<string, unknown>;
  };

  if (event !== "INSERT" || !record) {
    return new Response("Ignored", { status: 200 });
  }

  let message: string;
  if (table === "cod_orders") {
    message = formatOrder(record);
  } else if (table === "customer_leads") {
    message = formatLead(record);
  } else if (table === "newsletter_subscribers") {
    message = formatSubscriber(record);
  } else {
    return new Response("Unknown table", { status: 200 });
  }

  try {
    await sendMessage(message);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Telegram send failed:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
