---
name: secure-endpoint
description: Apply Upstash Redis rate limiting to a Supabase Edge Function (Deno runtime).
allowed-tools: Read, Write, Edit
---

Apply rate limiting to the `$ARGUMENTS[0]` Supabase Edge Function to protect AI budget and database.

**IMPORTANT:** This project uses **Supabase Edge Functions (Deno)**, NOT Next.js API routes.
Use the Deno-compatible Upstash SDK. Read the template from `./templates/upstash-redis.ts`.

**Rules:**
- Import from `https://esm.sh/@upstash/redis` and `https://esm.sh/@upstash/ratelimit`
- Identify users by Supabase JWT `sub` claim if authenticated, or `x-forwarded-for` header if anonymous
- Sliding window: 10 requests per 10 seconds per user
- Reject excess requests with HTTP 429 and a brand-aligned JSON error body
- Add `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` response headers
- Required env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

**Steps:**
1. Read `./templates/upstash-redis.ts` for the exact import and initialization pattern
2. Add the rate limit check AFTER CORS OPTIONS handling but BEFORE any DB or AI calls
3. Extract the user identifier from the JWT (already decoded by Supabase if `verify_jwt: true`)
   OR fall back to IP from `req.headers.get("x-forwarded-for")`
4. Deploy the updated function via `mcp__claude_ai_Supabase__deploy_edge_function`
5. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as Supabase project secrets
