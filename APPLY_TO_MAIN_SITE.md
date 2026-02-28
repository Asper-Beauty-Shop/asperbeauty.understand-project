# Apply All Updates, Brain & Everything to Main Website

**Main site:** https://asperbeautyshop-com.lovable.app/  
**Repo:** asperpharma/understand-project  
**Lovable:** https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings  
**Supabase project:** `qqceibvalkoytafynwoc`

---

## Perfect update in 4 steps (copy-paste)

Do this whenever you want the **latest code live** on the main site.

**1. Open a terminal in your understand-project folder.**  
If you don't have it yet:
```bash
gh repo clone asperpharma/understand-project
cd understand-project
```

**2. Get latest and install deps.**
```bash
git pull origin main
npm install
```

**3. Deploy to the live site.**  
(If you have no new changes, skip the commit; otherwise:)
```bash
git add .
git commit -m "Your message"
git push origin main
```
Lovable will build and deploy; the site updates in a few minutes at https://asperbeautyshop-com.lovable.app/

**4. Verify.**
```bash
# From this VIP folder (Asper Shop ALL Files VIP):
npm run health
```
Then open https://asperbeautyshop-com.lovable.app/ and spot-check: Home, Products, Cart, Beauty Assistant.

---

## ⚠️ Manual overrides to clear blockers (100% Production Ready)

Do these **in your dashboards** so the live site can use the Brain and Commerce Engine. Tick each when done.

### Step 1 — Lovable environment variables

**Where:** [Lovable → asper-beauty-shop → Settings → Environment variables](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings)

Set (or confirm) these production variables:

| Variable | Value to use |
|----------|----------------|
| `VITE_SUPABASE_URL` | `https://qqceibvalkoytafynwoc.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | *(your anon/public key from Supabase)* |
| `VITE_SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | *(your Storefront API token)* |
| `VITE_SHOPIFY_API_VERSION` | `2025-07` |

Also set if not already: `VITE_SUPABASE_PROJECT_ID` = `qqceibvalkoytafynwoc`, `VITE_SITE_URL` = `https://asperbeautyshop-com.lovable.app/`, `VITE_LOVABLE_URL` = `asperbeautyshop-com.lovable.app`.

- [ ] All Lovable env vars saved; redeploy or push to `main` so build uses them

### Step 2 — Supabase Auth redirects

**Where:** [Supabase Dashboard](https://supabase.com/dashboard/project/qqceibvalkoytafynwoc) → **Authentication** → **URL Configuration**

- Under **Redirect URLs**, add: `https://asperbeautyshop-com.lovable.app/**`
- Set **Site URL** to: `https://asperbeautyshop-com.lovable.app/`
- Save

- [ ] Redirect URLs include main site; Site URL points to main site

### Step 3 — Edge Function SITE_URL secret (COD emails)

**Where:** Supabase → **Project Settings** → **Edge Functions** → **Secrets**

- Add or update: **`SITE_URL`** = `https://asperbeautyshop-com.lovable.app/`

- [ ] `SITE_URL` secret set so COD/confirmation emails link to the live site

### Step 4 — Google Merchant Center

- Log into [Google Merchant Center](https://merchant.google.com/).
- Confirm your Shopify product feed (and new JSON-LD markup) is syncing 5,000+ SKUs without critical errors.
- Ensure product and storefront links point to `https://asperbeautyshop-com.lovable.app` (or your custom domain).

- [ ] Feed syncing; no critical errors; links point to main site

### Step 5 — Deploy and verify

**Deploy from the understand-project repo** (not this VIP folder):

```bash
cd path/to/understand-project
git add .
git commit -m "feat: complete apply_to_main_site checklist"
git push origin main
```

Lovable will build and deploy. Then **verify** (from this VIP folder):

```bash
npm run health
```

Then open https://asperbeautyshop-com.lovable.app/ and https://asperbeautyshop-com.lovable.app/health — expect 200.

- [ ] Pushed to `main` from understand-project; Lovable deploy successful
- [ ] `npm run health` passes; `/health` returns 200; site and Brain connected

---

## 1. Lovable — Environment variables (Brain + Shopify + URL)

In **Lovable** → your project → **Settings** → **Environment variables**, set (or confirm) these so the built app has the brain and catalog:

| Variable | Value | Purpose |
|----------|--------|----------|
| `VITE_SUPABASE_PROJECT_ID` | `qqceibvalkoytafynwoc` | Brain / Beauty Assistant project |
| `VITE_SUPABASE_URL` | `https://qqceibvalkoytafynwoc.supabase.co` | Supabase API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | *(your anon/public key)* | Frontend auth & Edge Function calls |
| `VITE_SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` | 5000+ SKU catalog |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | *(your Storefront API token)* | Storefront API |
| `VITE_SHOPIFY_API_VERSION` | `2025-07` | API version |
| `VITE_SITE_URL` | `https://asperbeautyshop-com.lovable.app/` | Canonical site URL |
| `VITE_LOVABLE_URL` | `asperbeautyshop-com.lovable.app` | Lovable subdomain |

- [ ] All Lovable env vars set and saved
- [ ] Trigger a redeploy in Lovable (or push to `main`) so the build uses the new values

---

## 2. Supabase — Redirect URLs (login on main site)

1. Open **Supabase Dashboard** → project **qqceibvalkoytafynwoc**
2. **Authentication** → **URL Configuration**
3. Add to **Redirect URLs**:
   - `https://asperbeautyshop-com.lovable.app/**`
   - `https://asperbeautyshop-com.lovable.app`
4. Set **Site URL** to: `https://asperbeautyshop-com.lovable.app/`
5. Save

- [ ] Redirect URLs include main site
- [ ] Site URL points to main site

---

## 3. Supabase Edge Functions — SITE_URL (emails & links)

1. **Supabase** → **Project Settings** → **Edge Functions** (or **Secrets**)
2. Set (or update) secret: **`SITE_URL`** = `https://asperbeautyshop-com.lovable.app/`
3. If you have **create-cod-order** or other functions that send emails, ensure they use `SITE_URL` for links in the email body

- [ ] `SITE_URL` secret set in Supabase
- [ ] COD/email functions use it for links

---

## 4. Social media platforms (all point to main site)

Base URL for all: **https://asperbeautyshop-com.lovable.app/** (or custom domain when live).

| Platform | What to update |
|----------|----------------|
| **Instagram** | Bio link, story links, shoppable posts landing URL, deep links e.g. `?intent=acne&source=ig` |
| **WhatsApp** | CTA links, catalog links; ManyChat/webhook deep links to main site |
| **Facebook** | Page link, shop link, ads landing URL, Messenger bot links |
| **X (Twitter)** | Bio link, pinned post, ads landing URL; deep links e.g. `?source=twitter` |
| **TikTok** | Bio link, link in bio; ads landing URL |
| **Pinterest** | Profile link, product pins (link to main site product pages) |
| **YouTube** | Description link, end screen, Community posts |
| **ManyChat / Meta** | All flow buttons and quick replies to main site or deep link |

- [ ] All social platform links point to main site
- [ ] No old/staging URLs on any social platform

---

## 5. Google Merchant Center & storefront

| Step | Action |
|------|--------|
| **Feed** | Shopify (lovable-project-milns) connected to Google Merchant Center; product feed syncs (e.g. ID 5717495012 if used). |
| **Landing pages** | In Merchant Center / Google Ads, set website and product link domain to `https://asperbeautyshop-com.lovable.app` (or custom domain). |
| **Storefront URL** | "Visit store" / brand link in Google Business or Ads points to main site. |

- [ ] Merchant Center feed uses same Shopify store as main site
- [ ] Product and storefront links in Google point to main site domain

---

## 6. All pages (main site verification)

After deploy, confirm these pages on **https://asperbeautyshop-com.lovable.app/**:

| Page / route | Check |
|--------------|--------|
| **Home** | `/` — hero, nav, featured products, footer |
| **Products** | `/products` — listing, filters, e.g. `?category=skincare` |
| **Product detail** | `/products/[handle]` — images, price, Add to cart |
| **Mom & Baby** | `/mom-baby` — lifecycle nav, real Shopify products, RTL support |
| **Cart** | Cart drawer/page — items, checkout CTA |
| **Checkout** | Shopify checkout in main site context |
| **Account / Login** | Auth redirects back to main site |
| **Beauty Assistant** | Chat widget loads and responds |
| **Health** | `/health` returns 200 |

- [ ] Home, products, product detail, mom-baby load
- [ ] Cart and checkout work; login redirects to main site
- [ ] Beauty Assistant works; `/health` returns 200

---

## 7. understand-project repo — config and workflows

**A) Local `.env` (for local dev)** — Copy from `env.main-site.example`, fill in real values, keep in `.gitignore`.

**B) Design system** — Copy Tailwind color tokens from **DESIGN_SYSTEM.md** into `tailwind.config.ts`.

**C) GitHub Actions** — Copy workflow files into `.github/workflows/`:
  - `deploy-health-check.yml`
  - `sync-file-changes-to-lovable.yml`
  - `sync-issues-prs-to-lovable.yml`

- [ ] `.env` in understand-project (from example), not committed
- [ ] Workflows copied; `LOVABLE_WEBHOOK_URL` set if needed

---

## 8. Deploy and verify

1. **Push to `main`** so the latest code and env are live.
2. **Health check:** `npm run health`
3. **Manual smoke test:** Home, products, cart, Beauty Assistant, login redirect.

- [ ] Deploy triggered and successful
- [ ] Homepage, products, and chatbot work on main URL

---

## 9. Optional — Catalog sync (CSV → Shopify)

See **docs/PLAN_AND_SPEC.md** for full spec.

```bash
node scripts/sync-shopify-catalog.js --dry-run --limit 5  # dry-run
node scripts/sync-shopify-catalog.js                       # full sync
```

- [ ] Sync run (if needed); products visible on main site

---

## Quick reference

| What | Where |
|------|--------|
| Main site | https://asperbeautyshop-com.lovable.app/ |
| Lovable settings | https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings |
| GitHub repo | https://github.com/asperpharma/understand-project |
| Supabase project | qqceibvalkoytafynwoc |
| Env template | `env.main-site.example` |
| Perfect update (4 steps) | See top of this file |

---

*Last updated: Feb 2026.*
