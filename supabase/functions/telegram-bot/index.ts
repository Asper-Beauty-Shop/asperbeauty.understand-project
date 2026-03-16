/**
 * telegram-bot — Receives Telegram messages and routes them through Dr. Bot (beauty-assistant).
 * Register this as your Telegram webhook:
 *   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/telegram-bot
 */

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const BEAUTY_ASSISTANT_URL = "https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant";

// In-memory conversation history per chat (resets on cold start — acceptable for edge functions)
const conversations = new Map<number, Array<{ role: string; content: string }>>();

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });
}

async function sendTyping(chatId: number) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action: "typing" }),
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("OK", { status: 200 });
  }

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const message = update.message as Record<string, unknown> | undefined;
  if (!message) return new Response("OK", { status: 200 });

  const chatId = (message.chat as Record<string, unknown>)?.id as number;
  const text = message.text as string | undefined;
  const firstName = ((message.from as Record<string, unknown>)?.first_name as string) || "there";

  if (!chatId || !text) return new Response("OK", { status: 200 });

  // Handle /start command
  if (text.startsWith("/start")) {
    await sendMessage(
      chatId,
      `✨ *Welcome to Asper Beauty Shop, ${firstName}!*\n\nI'm your personal beauty concierge — combining the clinical expertise of *Dr. Sami* and the luxury guidance of *Ms. Zain*.\n\nTell me your skin concern and I'll recommend a personalized regimen from our 9,000+ product catalog.\n\n_Try: "I have dry skin" or "أحتاج كريم للبشرة الدهنية"_`,
    );
    return new Response("OK", { status: 200 });
  }

  // Handle /reset command
  if (text.startsWith("/reset")) {
    conversations.delete(chatId);
    await sendMessage(chatId, "✅ Conversation reset. How can I help you today?");
    return new Response("OK", { status: 200 });
  }

  // Show typing indicator
  await sendTyping(chatId);

  // Build conversation history (keep last 10 messages to stay within token limits)
  const history = conversations.get(chatId) || [];
  history.push({ role: "user", content: text });
  if (history.length > 10) history.splice(0, history.length - 10);

  // Call beauty-assistant
  let reply = "I'm having trouble connecting right now. Please try again in a moment.";
  try {
    const res = await fetch(BEAUTY_ASSISTANT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    if (res.ok) {
      const data = await res.json();
      reply = data.reply || reply;
      // Update history with assistant reply
      history.push({ role: "assistant", content: reply });
      conversations.set(chatId, history);
    }
  } catch (err) {
    console.error("beauty-assistant error:", err);
  }

  await sendMessage(chatId, reply);
  return new Response("OK", { status: 200 });
});
