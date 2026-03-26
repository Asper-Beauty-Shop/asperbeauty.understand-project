# Asper Beauty Shop — Claude Code Guide

## Project Overview

**Asper Beauty Shop** is a medical-luxury e-commerce platform blending clinical authority with a premium boutique experience. Stack: React 18 + TypeScript + Vite + Tailwind CSS on the frontend, Supabase (Auth, PostgreSQL, Edge Functions) on the backend, Shopify Storefront API for commerce, and Google Gemini for AI.

- **Production URL:** https://www.asperbeautyshop.com
- **Supabase Project:** `vhgwvfedgfmcixhdyttt` → `https://vhgwvfedgfmcixhdyttt.supabase.co`

---

## Supabase MCP Setup

This project ships with `.mcp.json` that auto-loads the Supabase MCP server when you open it in Claude Code. To activate it, export your Supabase personal access token:

```bash
export SUPABASE_ACCESS_TOKEN="your-supabase-pat"
```

You can then use MCP tools to run SQL queries, inspect tables, apply migrations, and manage edge functions directly from the session.

---

## Development Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript validation |
| `npm run test` | Run unit tests (Vitest) |
| `npm run sync` | Sync Shopify catalog to Supabase |
| `npm run sync:dry` | Dry-run catalog sync |

---

## Coding Conventions

- **TypeScript strict** — no `any`, no unchecked casts
- **Tailwind CSS only** — no inline styles or external CSS files
- **shadcn/ui + Radix UI** — use existing primitives before creating new components
- **React Query** for server state; **Zustand** for client state (cart, wishlist)
- **Typography:** Playfair Display (headings), Montserrat (body), Tajawal (Arabic)
- **Colors:** Ivory `#F8F8FF`, Gold `#C5A028`, Burgundy `#4A0404`, Emerald `#005C45`
- **No placeholders** — always use real brand imagery (La Roche-Posay, Vichy, etc.)
- **RLS mandatory** — every new table must have Row Level Security enabled

---

## Database Schema (44 tables, all with RLS)

### Catalog
| Table | Description |
|---|---|
| `products` | 10,000+ SKUs with pricing, images, AI persona, regimen step, concern tags |
| `brands` | 350+ brands with slug, hero image, logo, elite flag |
| `product_clinical_metadata` | Clinical/dermatologist notes per product |
| `digital_tray_products` | Featured "digital tray" curation (19 active items) |
| `regimen_plans` | 3-step regimen plan definitions |
| `regimen_steps` | Individual steps (Cleanser / Treatment / Protection) |
| `user_regimen_choices` | Per-user regimen selections |

### Users & Auth
| Table | Description |
|---|---|
| `profiles` | Supabase auth user profiles |
| `user_profiles` | Extended user preferences and skin type data |
| `concierge_profiles` | Dr. Bot consultation profiles |
| `user_roles` | RBAC role assignments (`admin`, `driver`, etc.) |
| `user_tenants` | Multi-tenant support |

### Orders & Commerce
| Table | Description |
|---|---|
| `cod_orders` | Cash-on-delivery orders with driver assignment |
| `customer_leads` | Pre-checkout lead capture |
| `sale_subscribers` | Sale alert opt-ins |
| `newsletter_subscribers` | Email newsletter subscribers |

### AI & Concierge
| Table | Description |
|---|---|
| `concierge_brains` | AI brain configuration per persona |
| `concierge_brain_rules` | Rules engine for Dr. Bot responses |
| `conversations` | Chat session containers |
| `messages` | Individual chat messages |
| `chat_logs` | Full chat transcript logs |
| `chat_transcripts` | Archived transcripts |
| `consultations` | Formal consultation records |
| `ai_message_audit` | Audit trail for AI-generated messages |

### Prompts & Experimentation
| Table | Description |
|---|---|
| `prompts` | Prompt templates for edge functions |
| `prompt_experiments` | A/B prompt testing configs |
| `prompt_audit_logs` | Prompt change history |

### Analytics & Telemetry
| Table | Description |
|---|---|
| `telemetry_events` | Frontend event tracking |
| `quiz_funnel_events` | Skin quiz conversion funnel |
| `events` | Generic event store |

### Operations & Admin
| Table | Description |
|---|---|
| `audit_logs` | Admin action audit trail |
| `webhook_audit_logs` | Gorgias / ManyChat webhook logs |
| `access_links` | Token-based access links (e.g., driver links) |
| `rate_limits` | API rate limiting state |
| `site_config` | Runtime site configuration key-value store |
| `cleanup_allowlist` | Safe-to-purge data allowlist |
| `pipeline_error_log` | Background pipeline error tracking |
| `pipeline_requeue_queue` | Failed pipeline job retry queue |

### UI Testing
| Table | Description |
|---|---|
| `ui_checks` | Automated UI check definitions |
| `ui_check_runs` | UI check execution history |
| `ui_check_artifacts` | Screenshots / diffs from UI checks |

### Email
| Table | Description |
|---|---|
| `email_send_log` | Outbound email delivery log |

---

## Edge Functions (Deno/TypeScript)

Located in `supabase/functions/`:

| Function | Description |
|---|---|
| `beauty-assistant` | Dr. Bot AI concierge — bilingual, dual-persona (Dr. Sami / Ms. Zain), Gorgias + ManyChat webhooks |
| `ai-product-search` | Semantic product search over 10,000+ SKUs using Gemini via Lovable Gateway |
| `asper-intelligence` | Brand intelligence & analytics with Gemini 2.5-Flash |
| `concierge-tip` | Personalized 3-step regimen recommendations |
| `sync-shopify-catalog` | Bulk product sync from Shopify Storefront API |

---

## Migration Workflow

Migrations live in `supabase/migrations/`. To add a new migration:

```bash
# Create a new migration file (timestamp prefix required)
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_describe_change.sql
```

Then write your SQL. All new tables must include:
- UUID primary key
- `created_at TIMESTAMPTZ DEFAULT now()`
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
- At minimum one RLS policy

---

## Key Integrations

| Service | Env Variable | Purpose |
|---|---|---|
| Supabase | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Auth, DB, Edge Functions |
| Shopify | `VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN` | Product catalog, checkout |
| Google Gemini | `GEMINI_API_KEY` | AI search, TTS, consultations |
| Lovable Gateway | `LOVABLE_API_KEY` | Gemini model access proxy |

---

## Security Notes

- Customer skin history is **highly sensitive** — always enforce RLS
- Admin-only tables (`concierge_brains`, `prompt_experiments`, `notes`) require `has_role(auth.uid(), 'admin')` check
- The Supabase publishable (anon) key in `src/integrations/supabase/client.ts` is safe to commit — it is not a secret
- Never commit `SUPABASE_ACCESS_TOKEN` or service role keys
