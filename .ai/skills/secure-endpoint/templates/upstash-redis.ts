/**
 * Upstash Redis Rate Limiting — Supabase Edge Function (Deno) Template
 * Adapted for Deno runtime. Do NOT use npm: imports.
 *
 * Required Supabase secrets:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */
import { Redis } from "https://esm.sh/@upstash/redis";
import { Ratelimit } from "https://esm.sh/@upstash/ratelimit";

declare const Deno: { env: { get(key: string): string | undefined } };

// ── Initialization (place at module level, outside serve()) ──────────────────
const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "asper_chat",
});

// ── Usage inside serve() handler ─────────────────────────────────────────────
// Place this block AFTER OPTIONS check, BEFORE any DB or AI calls.

/*
  // Extract identifier: JWT sub (auth user) or IP (anonymous)
  const authHeader = req.headers.get("Authorization") ?? "";
  let identifier = req.headers.get("x-forwarded-for") ?? "anonymous";
  if (authHeader.startsWith("Bearer ")) {
    try {
      // Supabase JWT payload is base64url encoded in the second segment
      const payload = JSON.parse(atob(authHeader.split(".")[1]));
      if (payload?.sub) identifier = payload.sub;
    } catch { }
  }

  const { success, limit, reset, remaining } = await ratelimit.limit(`chat_${identifier}`);

  if (!success) {
    return new Response(
      JSON.stringify({
        error: "Consultation limit reached. Please wait a moment before asking another question.",
        retryAfter: reset,
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      }
    );
  }
*/
