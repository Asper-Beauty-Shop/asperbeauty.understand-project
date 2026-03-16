/**
 * meta-bot — Single webhook handler for WhatsApp, Facebook Messenger, and Instagram DMs.
 * All three use the Meta Graph API webhook format.
 *
 * Secrets required (Supabase Edge Function Secrets):
 *   META_VERIFY_TOKEN      — any random string you choose (used for webhook verification)
 *   META_PAGE_ACCESS_TOKEN — from Meta Business Suite > App > Token
 *   WHATSAPP_PHONE_NUMBER_ID — from Meta Business Suite > WhatsApp > Phone Number ID
 */

const VERIFY_TOKEN = Deno.env.get("META_VERIFY_TOKEN")!;
const PAGE_ACCESS_TOKEN = Deno.env.get("META_PAGE_ACCESS_TOKEN")!;
const WA_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;
const BEAUTY_ASSISTANT_URL = "https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant";

// Per-user conversation history (resets on cold start)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

// ── Send helpers ──────────────────────────────────────────────────────────────

async function sendWhatsApp(to: string, text: string) {
  await fetch(`https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
}

async function sendMessenger(recipientId: string, text: string) {
  await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });
}

// Instagram uses the same endpoint as Messenger
const sendInstagram = sendMessenger;

// ── Ask Dr. Bot ───────────────────────────────────────────────────────────────

async function askDrBot(userId: string, userMessage: string): Promise<string> {
  const history = conversations.get(userId) || [];
  history.push({ role: "user", content: userMessage });
  if (history.length > 10) history.splice(0, history.length - 10);

  try {
    const res = await fetch(BEAUTY_ASSISTANT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    if (res.ok) {
      const data = await res.json();
      const reply = data.reply || "I'm having trouble right now. Please try again shortly.";
      history.push({ role: "assistant", content: reply });
      conversations.set(userId, history);
      // Strip markdown for plain-text platforms
      return reply.replace(/\*\*/g, "*").replace(/#{1,3} /g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    }
  } catch (err) {
    console.error("beauty-assistant error:", err);
  }
  return "I'm having trouble connecting right now. Please try again in a moment.";
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // ── Webhook verification (GET) ──
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (req.method !== "POST") return new Response("OK", { status: 200 });

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return new Response("Bad request", { status: 400 }); }

  const object = body.object as string;
  const entries = (body.entry as Record<string, unknown>[]) || [];

  // ── WhatsApp ──
  if (object === "whatsapp_business_account") {
    for (const entry of entries) {
      const changes = (entry.changes as Record<string, unknown>[]) || [];
      for (const change of changes) {
        const value = change.value as Record<string, unknown>;
        const messages = (value.messages as Record<string, unknown>[]) || [];
        for (const msg of messages) {
          if (msg.type !== "text") continue;
          const from = msg.from as string;
          const text = (msg.text as Record<string, unknown>)?.body as string;
          if (!text) continue;
          const reply = await askDrBot(`wa_${from}`, text);
          await sendWhatsApp(from, reply);
        }
      }
    }
    return new Response("OK", { status: 200 });
  }

  // ── Facebook Messenger ──
  if (object === "page") {
    for (const entry of entries) {
      const messaging = (entry.messaging as Record<string, unknown>[]) || [];
      for (const event of messaging) {
        const senderId = (event.sender as Record<string, unknown>)?.id as string;
        const message = event.message as Record<string, unknown> | undefined;
        if (!senderId || !message || message.is_echo) continue;
        const text = message.text as string;
        if (!text) continue;
        const reply = await askDrBot(`fb_${senderId}`, text);
        await sendMessenger(senderId, reply);
      }
    }
    return new Response("OK", { status: 200 });
  }

  // ── Instagram DMs ──
  if (object === "instagram") {
    for (const entry of entries) {
      const messaging = (entry.messaging as Record<string, unknown>[]) || [];
      for (const event of messaging) {
        const senderId = (event.sender as Record<string, unknown>)?.id as string;
        const message = event.message as Record<string, unknown> | undefined;
        if (!senderId || !message || message.is_echo) continue;
        const text = message.text as string;
        if (!text) continue;
        const reply = await askDrBot(`ig_${senderId}`, text);
        await sendInstagram(senderId, reply);
      }
    }
    return new Response("OK", { status: 200 });
  }

  return new Response("OK", { status: 200 });
});
