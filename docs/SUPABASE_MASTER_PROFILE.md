# Supabase Master Project Profile

> Official backend infrastructure profile for Asper Beauty Shop.
> **Active Project ID:** `vhgwvfedgfmcixhdyttt`
> Last updated: 2026-03-04.

---

## 1. Project Identity

| Field | Value |
|---|---|
| Backend platform | Supabase |
| Project ID (production) | `vhgwvfedgfmcixhdyttt` |
| Project base URL | `https://vhgwvfedgfmcixhdyttt.supabase.co` |
| Dashboard | `https://supabase.com/dashboard/project/vhgwvfedgfmcixhdyttt` |
| GitHub repository | `asperpharma/understand-project` |
| Primary branch | `main` |

**Deprecated ID:** `rgehleqcubtmcwyipyvi` — do NOT use. All references must point to `vhgwvfedgfmcixhdyttt`.

---

## 2. Project Purpose

This Supabase project is the **core intelligence infrastructure** of Asper Beauty Shop. It powers:

- Dr. Bot AI engine
- Consultation storage
- Recommendation tracking
- Shopify middleware validation
- Webhook intake (ManyChat / WhatsApp / Gorgias)
- Event logging and analytics
- Future personalization system

This is not optional backend. This is the **digital brain** of the business.

---

## 3. System Architecture (Five Layers)

### A. PostgreSQL Database Layer

Stores structured data for:

- Consultations
- Session tracking
- Recommendation logs
- AI events
- Customer profiles (future)
- Behavioral analytics

All customer interactions flow through this layer.

### B. Edge Functions Layer (Critical Execution Engine)

Primary production function: **`beauty-assistant`**

Execution flow:

1. Receive frontend request
2. Validate schema
3. Apply guardrails
4. Call AI model
5. Query Shopify Storefront API
6. Filter available products
7. Format Digital Tray output
8. Return structured JSON

This function is Dr. Bot's execution environment. See `supabase/functions/` for all 20+ edge functions.

### C. Secret Management (Vault)

Stored securely inside Supabase project settings:

- AI API key
- Shopify private token
- Service role key
- Session secret
- Webhook validation tokens

**Rules:**

- Never expose in frontend code
- Never commit to GitHub
- Never paste in AI prompts or chat
- Only accessed inside Edge Functions via `Deno.env.get()`

### D. Webhook Gateway Layer

Supabase receives external automation triggers at:

```
https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant
```

Routing parameters:

| Parameter | Source |
|---|---|
| `?source=web` | Website frontend |
| `?source=manychat` or `?route=manychat` | ManyChat automation |
| `?source=whatsapp` | WhatsApp Business |
| `?route=gorgias` | Gorgias helpdesk |
| `?health=true` | Health check probe |

### E. Authentication Layer

Supabase Auth is configured with these roles:

| Role | Scope |
|---|---|
| `anon` | Public read, limited insert |
| `authenticated` | Logged-in customer access |
| `service_role` | Backend-only, full access |

**`service_role` must never be exposed client-side.**

---

## 4. Database Structure (Official Tables)

### `consultations`

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid (PK) | Unique consultation ID |
| `session_id` | text | Browser/device session |
| `concern_type` | text | Acne, pigmentation, aging, etc. |
| `skin_type` | text | Oily, dry, combination, sensitive |
| `sensitivity_level` | text | Low, moderate, high |
| `ai_response` | jsonb | Full AI response payload |
| `created_at` | timestamptz | Timestamp |

### `recommendation_logs`

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid (PK) | Unique log ID |
| `consultation_id` | uuid (FK) | Links to consultation |
| `product_id` | text | Shopify product ID |
| `product_title` | text | Product name |
| `availability_status` | boolean | Was product in stock |
| `timestamp` | timestamptz | When recommended |

### `ai_events`

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid (PK) | Unique event ID |
| `model_used` | text | Model identifier |
| `tokens_input` | integer | Input token count |
| `tokens_output` | integer | Output token count |
| `latency_ms` | integer | Response time |
| `error_flag` | boolean | Whether an error occurred |
| `created_at` | timestamptz | Timestamp |

### `customer_profiles` (Phase 2)

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid (PK) | User ID |
| `email` | text | Customer email |
| `skin_type` | text | Stored preference |
| `recurring_concern` | text | Most frequent concern |
| `last_recommendation` | timestamptz | Last AI interaction |
| `lifetime_value_score` | numeric | Engagement metric |

---

## 5. Dr. Bot Execution Flow (Locked)

```
User
  → Lovable React Frontend
    → API call to Supabase Edge Function
      → Validate request
      → Apply guardrails (asperProtocol.ts rules)
      → Call AI model
      → Query Shopify Storefront API
      → Confirm product availability
      → Format response
      → Save consultation
    → Return Digital Tray to frontend
```

**No hallucinated products. No inventory guessing. No bypassing availability check.**

---

## 6. Security Configuration

### Row Level Security (RLS)

Must be enabled on all tables:

| Table | Public Insert | Public Read | Auth Read/Write | Service Role |
|---|---|---|---|---|
| `consultations` | Limited fields | No | Restricted | Full |
| `recommendation_logs` | No | No | Restricted | Full |
| `ai_events` | No | No | No | Full |
| `customer_profiles` | No | No | Own row only | Full |

### Environment Separation

- **Production:** `vhgwvfedgfmcixhdyttt`
- **Staging:** Create a separate Supabase project if needed — never mix environments

---

## 7. Monitoring and Analytics

Track:

| Metric | Purpose |
|---|---|
| AI latency | Response time optimization |
| Token usage per session | Cost control |
| Recommendation conversion rate | Business value |
| Error frequency | Reliability |
| Session drop-off | UX improvement |
| AOV after AI suggestion | Revenue attribution |

Enable:

- Edge function logs (Supabase dashboard)
- Function error alerts
- Database monitoring

---

## 8. Backup and Resilience

- Daily automatic backups (Supabase managed)
- Weekly snapshot export
- Quarterly restore test

---

## 9. Branch and Deployment Rules

| Rule | Detail |
|---|---|
| All Supabase function updates | Pushed from `main` branch |
| No direct production editing | Always through git workflow |
| No secrets committed | `.env` is gitignored |
| No `.env` files committed | Use `env.main-site.example` as template |

**Before merge to main:**

1. Validate no keys exposed in diff
2. Test staging (if exists)
3. Validate Dr. Bot response
4. Confirm Shopify integration works

---

## 10. Final Architecture Status

| Component | Value |
|---|---|
| Supabase Project | `vhgwvfedgfmcixhdyttt` |
| AI Engine | Dr. Bot (beauty-assistant edge function) |
| Working Branch | `main` |
| Backend Brain | `https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant` |

**This is the official backend infrastructure. Locked.**

---

*This document is the single source of truth for Supabase project configuration in the Asper Beauty Shop platform.*

