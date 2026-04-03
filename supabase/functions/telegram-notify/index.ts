/**
 * Telegram Notify — Push alerts to your phone.
 * Call this from other edge functions or database triggers.
 *
 * POST body: { message: string }
 */

declare const Deno: { env: { get(key: string): string | undefined } };
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

serve(async (req) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    return new Response(JSON.stringify({ error: "Bot not configured" }), { status: 500 });
  }

  try {
    const { message } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: "No message" }), { status: 400 });

    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.ok ? 200 : 500 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
