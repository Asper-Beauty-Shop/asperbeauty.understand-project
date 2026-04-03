/**
 * Telegram Bot — Asper Beauty Shop Command Center
 * Receive commands from phone and execute actions.
 *
 * Supported commands:
 *   /start   — Welcome message
 *   /orders  — Today's orders from Supabase
 *   /stats   — Sales summary
 *   /products — Top 5 bestselling products
 *   /sync    — Trigger Shopify catalog sync
 *   /help    — List all commands
 */

declare const Deno: { env: { get(key: string): string | undefined } };
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const ALLOWED_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId: string, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
}

async function handleCommand(command: string, chatId: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (command === "/start" || command === "/help") {
    await sendMessage(chatId, `👋 *Asper Beauty Shop — Command Center*\n\nAvailable commands:\n\n/orders — Today's orders\n/stats — Sales summary\n/products — Top products\n/sync — Sync Shopify catalog\n/help — This message`);
    return;
  }

  if (command === "/orders") {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, total_price, created_at")
      .gte("created_at", `${today}T00:00:00Z`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !data?.length) {
      await sendMessage(chatId, `📦 *Today's Orders*\n\nNo orders yet today.`);
      return;
    }

    const lines = data.map((o, i) =>
      `${i + 1}. #${o.id?.toString().slice(-6)} — ${o.status} — ${o.total_price} JOD`
    ).join("\n");
    await sendMessage(chatId, `📦 *Today's Orders (${data.length})*\n\n${lines}`);
    return;
  }

  if (command === "/stats") {
    const today = new Date().toISOString().split("T")[0];
    const { data: orders } = await supabase
      .from("orders")
      .select("total_price, status")
      .gte("created_at", `${today}T00:00:00Z`);

    const { count: productCount } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("available", true);

    const total = (orders || []).reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
    const orderCount = orders?.length ?? 0;

    await sendMessage(chatId,
      `📊 *Today's Stats*\n\n` +
      `🛒 Orders: ${orderCount}\n` +
      `💰 Revenue: ${total.toFixed(2)} JOD\n` +
      `🏷 Active Products: ${productCount ?? "—"}`
    );
    return;
  }

  if (command === "/products") {
    const { data } = await supabase
      .from("products")
      .select("title, brand, price, asper_category")
      .eq("available", true)
      .eq("is_bestseller", true)
      .order("bestseller_rank", { ascending: true, nullsFirst: false })
      .limit(5);

    if (!data?.length) {
      await sendMessage(chatId, `🏆 No bestsellers found.`);
      return;
    }

    const lines = data.map((p, i) =>
      `${i + 1}. *${p.title}* (${p.brand}) — ${p.price} JOD`
    ).join("\n");
    await sendMessage(chatId, `🏆 *Top Bestsellers*\n\n${lines}`);
    return;
  }

  if (command === "/sync") {
    await sendMessage(chatId, `🔄 Triggering Shopify catalog sync...`);
    const syncRes = await fetch(`${SUPABASE_URL}/functions/v1/sync-shopify-catalog`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trigger: "telegram" }),
    });
    const status = syncRes.ok ? "✅ Sync started successfully!" : "❌ Sync failed. Check logs.";
    await sendMessage(chatId, status);
    return;
  }

  await sendMessage(chatId, `❓ Unknown command. Send /help for the list.`);
}

serve(async (req) => {
  if (!BOT_TOKEN) {
    return new Response("Bot not configured", { status: 500 });
  }

  try {
    const update = await req.json();
    const message = update?.message;
    if (!message) return new Response("ok");

    const chatId = message.chat?.id?.toString();
    const text = (message.text ?? "").trim();

    // Security: only respond to authorized chat
    if (ALLOWED_CHAT_ID && chatId !== ALLOWED_CHAT_ID) {
      await sendMessage(chatId, "❌ Unauthorized.");
      return new Response("ok");
    }

    const command = text.split(" ")[0].toLowerCase();
    await handleCommand(command, chatId!);
  } catch (err) {
    console.error("Telegram bot error:", err);
  }

  return new Response("ok");
});
