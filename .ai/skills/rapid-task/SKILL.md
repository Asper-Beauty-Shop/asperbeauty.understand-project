---
name: rapid-task
description: Admin task runner for Asper Beauty Shop operational tasks via Supabase Edge Function.
allowed-tools: Read, Write, Edit
---

`rapid-task` is an **authenticated, admin-only** Supabase Edge Function that executes operational tasks without requiring a full deployment cycle.

**Endpoint:** `POST /functions/v1/rapid-task`
**Auth:** Supabase JWT required (`verify_jwt: true`) + `user_roles.role = 'admin'`

## Available Tasks

| Task | Payload | Description |
|------|---------|-------------|
| `health` | — | Row counts for products, brands, cod_orders + latency |
| `stats` | — | Row counts for ALL key tables |
| `clear-rate-limits` | — | Delete stale `rate_limits` rows (older than 60s) |
| `sync-tray` | `{ concern: "Concern_Hydration" }` | Rebuild digital_tray_products via `build_digital_tray` RPC |

## How to Add a New Task

1. Read `supabase/functions/rapid-task/index.ts`
2. Add a new `case "your-task-name":` block in the switch dispatcher
3. Use `supabaseAdmin` (service role) for DB operations — never `supabaseUser`
4. Always return `json({ task, ms: Date.now() - t0, ... })`
5. Update the `available` array in the `default:` case
6. Deploy via `mcp__claude_ai_Supabase__deploy_edge_function`

## Rules

- Only use `supabaseAdmin` for mutations — `supabaseUser` is only for auth
- All tasks MUST return within 10 seconds (Supabase Edge Function timeout)
- Log errors to the `default:` fallback response — never throw unhandled
- Tasks that call external APIs must pass `GEMINI_API_KEY` from env

## Frontend Hook

Use `src/hooks/useRapidTask.ts` to call this function from admin pages.

```ts
const { mutate: runTask, isPending, data } = useRapidTask();
runTask({ task: "health" });
runTask({ task: "sync-tray", payload: { concern: "Concern_Acne" } });
```

## Security Notes

- `verify_jwt: true` — Supabase validates the JWT before the function runs
- Role check: `user_roles` table with `role = 'admin'` is verified inside the function
- Uses service role key for admin DB ops — never expose this to the client
