# ASPER BEAUTY SHOP — SUPABASE MASTER PROJECT PROFILE (OFFICIAL 2026)

**Locked production environment. Single source of truth.**

---

## 1. PROJECT IDENTITY

| Item | Value |
|------|--------|
| **Backend Platform** | Supabase |
| **Project ID (Production)** | `qqceibvalkoytafynwoc` |
| **Project Base URL** | `https://qqceibvalkoytafynwoc.supabase.co` |
| **GitHub Repository** | `asperpharma/understand-project` |
| **Working Branch** | `understand-project` |

This branch is the official development and deployment source connected to Supabase Edge Functions and frontend sync.

**No secondary project IDs. No confusion.**

---

## 2. PROJECT PURPOSE

This Supabase project is the core intelligence infrastructure of Asper Beauty Shop. It powers:

- **Dr. Bot** AI engine
- Consultation storage
- Recommendation tracking
- Shopify middleware validation
- Webhook intake (ManyChat / WhatsApp)
- Event logging & analytics
- Future personalization system

This is the digital brain of the business.

---

## 3. SYSTEM ARCHITECTURE

### A. PostgreSQL Database Layer

Stores structured data for:

- consultations
- session tracking
- recommendation logs
- AI events
- future customer profiles
- behavioral analytics

### B. Edge Functions Layer (Critical Execution Engine)

**Primary Production Function:** `beauty-assistant`

- Receives frontend request
- Validates schema
- Applies guardrails
- Calls AI model
- Queries Shopify Storefront API
- Filters available products
- Formats Digital Tray output
- Returns structured JSON

**Endpoint:** `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant`

Optional routing: `?source=web` \| `?source=manychat` \| `?source=whatsapp`

### C. Secret Management (Vault)

Secrets are stored in Supabase (Project Settings → Edge Functions → Secrets). Never expose in frontend, never commit to GitHub, never paste in prompts. Only accessed inside Edge Functions.

### D. Webhook Gateway

All automation flows use the same base URL with optional `?source=` for routing.

### E. Authentication

If enabled: `anon` \| `authenticated` \| `service_role`. Service role is backend-only.

---

## 4. DATABASE STRUCTURE (OFFICIAL TABLES)

| Table | Purpose |
|-------|---------|
| **consultations** | `id`, `session_id`, `concern_type`, `skin_type`, `sensitivity_level`, `ai_response`, `created_at` — each Dr. Bot consultation |
| **recommendation_logs** | `id`, `consultation_id`, `product_id`, `product_title`, `availability_status`, `timestamp` — suggested products & stock |
| **ai_events** | `id`, `model_used`, `tokens_input`, `tokens_output`, `latency_ms`, `error_flag`, `created_at` — cost & performance |
| **customer_profiles** (Phase 2) | `id`, `email`, `skin_type`, `recurring_concern`, `last_recommendation`, `lifetime_value_score` — personalization |

---

## 5. DR. BOT EXECUTION FLOW (LOCKED)

```
User → Lovable React Frontend
  → API call to Supabase Edge Function (beauty-assistant)
  → Validate request → Apply guardrails → Call AI model
  → Query Shopify → Confirm product availability
  → Format response → Save consultation → Return Digital Tray
```

- No hallucinated products.
- No inventory guessing.
- No bypassing availability check.

---

## 6. SECURITY

- **RLS:** Enabled on `consultations`, `recommendation_logs`, `ai_events`, `customer_profiles`.
- **Policies:** Public insert (limited fields); no public read; authenticated restricted; service_role full access.
- **Environment:** Production only = `qqceibvalkoytafynwoc`. Staging = separate Supabase project; never mix.

---

## 7. MONITORING

Track: AI latency, token usage per session, recommendation conversion rate, error frequency, session drop-off, AOV after AI suggestion.

Use: Edge logs, function error alerts, database monitoring.

---

## 8. BACKUP & RESILIENCE

- Daily automatic backups
- Weekly snapshot export
- Quarterly restore test
- Document restore procedure in internal wiki

---

## 9. GITHUB + BRANCH

| Item | Value |
|------|--------|
| **Primary Repository** | `asperpharma/understand-project` |
| **Active Branch** | `understand-project` |

Rules:

- All Supabase function updates pushed from this branch.
- No direct production editing in dashboard for schema/function logic.
- No secrets committed; no `.env` files committed.
- Before merge: validate no keys exposed, test staging (if exists), validate Dr. Bot response, confirm Shopify integration.

---

## 10. FRONTEND ENVIRONMENT VARIABLES

Set in Lovable / local `.env` (see `.env.example`):

| Variable | Value (production) |
|----------|--------------------|
| `VITE_SUPABASE_PROJECT_ID` | `qqceibvalkoytafynwoc` |
| `VITE_SUPABASE_URL` | `https://qqceibvalkoytafynwoc.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | *(anon key from Supabase Dashboard)* |

---

## FINAL STATUS

- **One Supabase Project:** `qqceibvalkoytafynwoc`
- **One AI:** Dr. Bot
- **One Working Branch:** `understand-project`
- **One Backend Brain:** Supabase Edge Function → `beauty-assistant`

**This is the locked official backend infrastructure.**
