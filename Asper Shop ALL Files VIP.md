# Monitor — Where to Check

Quick reference for daily/weekly monitoring.

---

## Your URLs

See **Asper-Beauty-Shop/SHOP_CONNECTION.md** for env vars and Shopify/Supabase wiring.

| Service | Your URL |
|---------|----------|
| **Shopify Admin** | <https://admin.shopify.com/store/lovable-project-milns> |
| **Shopify Store** | <https://lovable-project-milns.myshopify.com> |
| **Main site (Lovable live)** | <https://asperbeautyshop-com.lovable.app/> |
| **Gorgias (Asper Beauty)** | <https://asper-beauty-shop.gorgias.com> |
| **Gorgias AI Agent** | <https://asper-beauty-shop.gorgias.com/app/ai-agent/shopify/lovable-project-milns> |
| **Bulk Upload health** | <https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload> |
| **Beauty Assistant health** | <https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true> |
| **Supabase** | <https://qqceibvalkoytafynwoc.supabase.co> |

---

## 1. Shopify Orders

| Item | Where |
|------|-------|
| **Admin** | [Shopify Admin](<https://admin.shopify.com/store/lovable-project-milns>) → Orders |
| **Orders direct** | <https://admin.shopify.com/store/lovable-project-milns/orders> |
| **API** | `GET /admin/api/{version}/orders.json` |
| **Unfulfilled** | Admin → Orders → Filter: Unfulfilled |
| **Recent** | Admin → Orders → Sort by date |

---

## 2. Gorgias

| Item | Where |
|------|-------|
| **Dashboard** | [Asper Beauty Gorgias](<https://asper-beauty-shop.gorgias.com>) |
| **Inbox / Tickets** | <https://asper-beauty-shop.gorgias.com/app/views> |
| **AI Agent** | <https://asper-beauty-shop.gorgias.com/app/ai-agent/shopify/lovable-project-milns> |
| **Tickets** | Inbox / Tickets view |
| **Conversations** | Customer chat history |
| **Analytics** | Reports / Analytics section |
| **Channels (Chat, Email, SMS)** | Settings (gear) → Channels. See **GORGIAS_OMNICHANNEL.md** for full checklist. |

---

## 3. chat_logs

| Item | Where |
|------|-------|
| **Database** | Table: `chat_logs` (or equivalent in your schema) |
| **Log files** | Check `logs/`, `chat_logs/`, or app logging path |
| **Backend** | Your app’s logging service or admin panel |

---

## 4. beauty_assistant_audit

| Item | Where |
|------|-------|
| **Database** | Table: `beauty_assistant_audit` |
| **Admin/App** | Audit or analytics view in your app |
| **Reports** | Internal reporting dashboard |

---

## 5. Health URLs

| Endpoint | URL | Expected |
|----------|-----|----------|
| **Frontend (SPA)** | <https://asperbeautyshop-com.lovable.app/health> | 200; page body contains `{"status":"ok", "ts":"..."}` (SPA route, not a raw JSON API). |
| **Bulk Upload** | <https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload> | 200 |
| **Beauty Assistant** | <https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true> | 200, JSON `{"status":"active"}` |

---

## 5b. Full health snapshot (run these four)

| Check | How to run | Good result | If not |
|-------|------------|-------------|--------|
| **Frontend** | `curl -s -o /dev/null -w "%{http_code}" "https://asperbeautyshop-com.lovable.app/"` or `npm run health` | 200 | See **Site not working?** |
| **Beauty Assistant** | `curl -s "https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true"` | 200, `{"status":"active",...}` | Check Supabase Edge Function logs and secrets. |
| **Bulk Upload** | `curl -s -o /dev/null -w "%{http_code}" "https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload"` | 200 | **503** = set **SHOPIFY_STORE_DOMAIN** and **SHOPIFY_ACCESS_TOKEN** in Supabase → Edge Functions → Secrets (see **Shopify secrets** below). |
| **Live bundle** | `curl -s "https://asperbeautyshop-com.lovable.app/" \| grep -oP 'assets/index-[^"]+\.js'` | New hash after a deploy | Old hash = Lovable not deploying (often **payment issue** in Lovable Settings). |

**Quick path:** From this VIP folder, `npm run health` covers frontend, Bulk Upload, and Beauty Assistant; add the bundle curl above if you care about deploy lag.

---

## 6. Chatbot — connect all channels

Same backend (Beauty Assistant) for website + Gorgias + ManyChat (Instagram, Messenger, WhatsApp).

| Channel | Webhook or link | Setup |
|---------|-----------------|--------|
| **Website** | Floating “Ask the Pharmacist” + Header + Footer | Already on every page. |
| **Deep links** | <https://asperbeautyshop-com.lovable.app/?intent=acne&source=ig> | Use in posts/bios; opens site + chat with pre-filled concern. |
| **Gorgias** | <https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=gorgias> | Gorgias → Settings → Integrations → HTTP → POST to this URL; map response `reply` to reply action. |
| **ManyChat** (IG, Messenger, WhatsApp) | <https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=manychat> | Flow: trigger on new message → Webhook POST to URL → send `reply` back. |

Full steps: **Asper-Beauty-Shop/CHATBOT_SOCIAL_MEDIA_SETUP.md**. Supabase secrets for beauty-assistant: `GEMINI_API_KEY` or `LOVABLE_API_KEY`; for HMAC verification set `GORGIAS_WEBHOOK_SECRET` and `MANYCHAT_WEBHOOK_SECRET` (match in each platform’s webhook settings). Strict CORS: set `ALLOWED_ORIGINS` (comma-separated). Rate limit: 30 req/min per IP per webhook (429 + Retry-After).

---

## Shopify secrets (live product availability)

For products and Bulk Upload to work, set:

| Where | Secret / variable | Value |
|-------|-------------------|--------|
| **Supabase** → Project Settings → Edge Functions → **Secrets** | `SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` |
| **Supabase** → Edge Functions → **Secrets** | `SHOPIFY_ACCESS_TOKEN` | *(Shopify Admin API token)* |
| **Lovable** → Settings → Environment variables | `VITE_SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` |

If **Bulk Upload health** returns **503**, these Supabase secrets are missing or wrong. Full steps: **APPLY_TO_MAIN_SITE.md** § 3b.

---

## Quick Checklist

- [ ] Shopify: New orders, unfulfilled, refunds
- [ ] Gorgias: Open tickets, response time
- [ ] **Shopify secrets:** `SHOPIFY_STORE_DOMAIN` (+ `SHOPIFY_ACCESS_TOKEN`) in Supabase; `VITE_SHOPIFY_STORE_DOMAIN` in Lovable
- [ ] chat_logs: Errors, anomalies
- [ ] beauty_assistant_audit: Recent entries, issues
- [ ] Frontend /health: Returns 200, `{"status":"ok"}`
- [ ] Bulk Upload health: Returns 200
- [ ] Beauty Assistant health: Returns 200, `{"status":"active"}`
- [ ] Chatbot channels: Website live; Gorgias/ManyChat webhooks configured if used

---

## Can't connect to https://www.asperbeautyshop.com?

**Custom domain not loading?** Use **[docs/CUSTOM_DOMAIN_AND_FULL_SITE_CHECKLIST.md](docs/CUSTOM_DOMAIN_AND_FULL_SITE_CHECKLIST.md)** — add domain in Lovable (Settings → Domains), set DNS (A + TXT from Lovable), then Supabase redirect URLs + SITE_URL. Full function checklist included.

---

## Site not working? (<https://asperbeautyshop-com.lovable.app/>)

If the main site is blank, broken, or not loading:

| Check | Action |
|-------|--------|
| **1. Lovable deploy** | [Lovable → Deployments](<https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6>) — Last build green? If red, open build logs and fix errors; trigger **Redeploy**. |
| **2. Env vars** | Lovable → Settings → Environment variables. Ensure **VITE_SUPABASE_URL**, **VITE_SUPABASE_PUBLISHABLE_KEY**, **VITE_SHOPIFY_STORE_DOMAIN**, **VITE_SHOPIFY_STOREFRONT_TOKEN** are set. Save and **redeploy**. |
| **3. Browser** | Hard refresh (Ctrl+Shift+R). Open DevTools (F12) → Console: any red errors? Network tab: failed requests (4xx/5xx)? |
| **4. Health** | From this VIP folder run `npm run health`. Main site and /health should be 200. If Bulk Upload is 503, set Supabase Edge Function secrets (see APPLY_TO_MAIN_SITE.md). |
| **5. Redeploy** | Push to `main` from **understand-project** or use Lovable “Redeploy” so the latest build goes live. |

---

## Lovable not deploying (old bundle after push)

**Symptom:** Pushed to `main` but live site still serves an old JS bundle (e.g. `index-CviLt_TA.js` instead of a newer hash); Lovable preview may show “Previewing last saved version”.

| Cause | Action |
|-------|--------|
| **Payment issue** | Lovable can pause auto-deploy: *“Payment issue detected. Your account remains active, but will revert to Free if not resolved.”* → [Lovable → Settings](<https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings>) and resolve payment method. Once fixed, auto-deploy from `main` resumes. |
| **Build failing** | Lovable → Deployments: check last build logs; fix errors and trigger **Redeploy**. |
| **GitHub not connected** | Lovable → Settings → GitHub: confirm repo linked and branch (e.g. `main`); re-authorize if needed. |

**Verify bundle:** `curl -s "https://asperbeautyshop-com.lovable.app/" | grep -oP 'assets/index-[^"]+\.js'` — compare hash to your local build (`npm run build` in understand-project shows e.g. `index-BSdIsDAp.js`).

---

## If something is unchecked

- **Shopify**: Log in to Admin, check Orders and unfulfilled; resolve refunds.
- **Gorgias**: Open tickets, reply or assign; check **GORGIAS_OMNICHANNEL.md** to reconnect Chat/Email/SMS or AI Agent.
- **chat_logs / beauty_assistant_audit**: Inspect in Supabase dashboard or your admin; fix any failing flows.
- **Health URLs**: If frontend or Supabase health fails, check deployment and Supabase project status; verify env and secrets.
- **Lovable not deploying**: If pushes to `main` don’t update the live bundle, see **Lovable not deploying** above (often payment issue in Lovable Settings).
- **Chatbot channels**: Website widget is in-app; for Gorgias/ManyChat see **Asper-Beauty-Shop/CHATBOT_SOCIAL_MEDIA_SETUP.md** and Gorgias Settings → Integrations.

---

## Related docs (Desktop)

- **docs/ALL_DOMAINS_AND_CHANNELS.md** — All domains & URLs: website, custom domain, Shopify, Gorgias, Supabase, social, health, webhooks, deep links.
- **docs/BEAUTY_ASSISTANT_PAYLOAD_SPEC.md** — Contract for website chat: POST payload (session_id, context.current_concern, messages), TypeScript interfaces for Lovable frontend AI.
- **docs/LOVABLE_SESSION_FEB28_2026.md** — Snapshot of Lovable Feb 28 session (design foundation, edge function auth, webhook HMAC, Bridal Bootcamp/Smart Shelf).
- **GORGIAS_OMNICHANNEL.md** — Gorgias channels (Chat, Email, SMS), AI Agent, website widget, Dr. Sami knowledge.
- **Gorgias-AI-Agent-Dr-Sami-Setup.md** — Dr. Sami data and AI Agent setup.
- **Asper-Beauty-Shop/CHATBOT_SOCIAL_MEDIA_SETUP.md** — Beauty Assistant webhooks for Gorgias + ManyChat.

---

*Last updated: Feb 28, 2026*
