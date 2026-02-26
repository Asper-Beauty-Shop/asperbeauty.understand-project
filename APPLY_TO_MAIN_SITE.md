# Apply All Updates, Brain & Everything to Main Website

**Main site:** https://asperbeautyshop-com.lovable.app/  
**Repo:** asperpharma/understand-project  
**Lovable:** https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings

Use this checklist to run all updates and apply the brain, social media, Google Merchant Center, and every page to the main Asper Beauty Shop website.

---

## 1. Lovable — Environment variables (Brain + Shopify + URL)

In **Lovable** → your project → **Settings** → **Environment variables**, set (or confirm) these so the built app has the brain and catalog:

| Variable | Value | Purpose |
|----------|--------|----------|
| `VITE_SUPABASE_PROJECT_ID` | `rgehleqcubtmcwyipyvi` | Brain / Beauty Assistant project |
| `VITE_SUPABASE_URL` | `https://rgehleqcubtmcwyipyvi.supabase.co` | Supabase API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | *(your anon/public key)* | Frontend auth & Edge Function calls |
| `VITE_SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` | 5000+ SKU catalog |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | *(your Storefront API token)* | Storefront API |
| `VITE_SHOPIFY_API_VERSION` | `2025-07` | API version |
| `VITE_SITE_URL` | `https://asperbeautyshop-com.lovable.app/` | Canonical site URL |
| `VITE_LOVABLE_URL` | `asperbeautyshop-com.lovable.app` | Lovable subdomain |

Reference: `env.main-site.example` in this folder (copy names from there; never commit real keys).

- [ ] All Lovable env vars set and saved  
- [ ] Trigger a redeploy in Lovable (or push to `main`) so the build uses the new values  

---

## 2. Supabase — Redirect URLs (login on main site)

So users can log in on https://asperbeautyshop-com.lovable.app/:

1. Open **Supabase Dashboard** → project **rgehleqcubtmcwyipyvi**  
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

So COD/confirmation emails and any links in Edge Functions point to the main site:

1. **Supabase** → **Project Settings** → **Edge Functions** (or **Secrets**)  
2. Set (or update) secret: **`SITE_URL`** = `https://asperbeautyshop-com.lovable.app/`  
3. If you have **create-cod-order** or other functions that send emails, ensure they use `SITE_URL` for links in the email body  

- [ ] `SITE_URL` secret set in Supabase  
- [ ] COD/email functions use it for links  

---

## 4. Social media platforms (all point to main site)

All "Velvet Rope" and campaign links should open the main site.

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

- [ ] Instagram, WhatsApp, Facebook, X, TikTok, Pinterest, YouTube links point to main site  
- [ ] ManyChat / Meta flows use main site URLs  
- [ ] No old/staging URLs on any social platform  

---

## 5. Google Merchant Center & storefront

Products and storefront in Google must use the **same** Shopify store as the main site; all links must go to the main website.

| Step | Action |
|------|--------|
| **Feed** | Shopify (lovable-project-milns) connected to Google Merchant Center; product feed syncs (e.g. ID 5717495012 if used). |
| **Landing pages** | In Merchant Center / Google Ads, set website and product link domain to `https://asperbeautyshop-com.lovable.app` (or custom domain). |
| **Storefront URL** | "Visit store" / brand link in Google Business or Ads points to main site. |

- [ ] Merchant Center feed uses same Shopify store as main site  
- [ ] Product and storefront links in Google point to main site domain  
- [ ] Google Ads / Shopping landing URLs use main site  

---

## 6. All pages (main site verification)

After deploy, confirm these pages on **https://asperbeautyshop-com.lovable.app/**:

| Page / route | Check |
|--------------|--------|
| **Home** | `/` — hero, nav, featured products, footer |
| **Products** | `/products` — listing, filters, e.g. `?category=skincare` |
| **Product detail** | `/products/[handle]` — images, price, Add to cart |
| **Collections** | Category/collection pages — correct products |
| **Cart** | Cart drawer/page — items, checkout CTA |
| **Checkout** | Shopify checkout in main site context |
| **Account / Login** | Auth redirects back to main site |
| **Find My Ritual / Concierge** | AI flow (Analyze → Recommend → Cart) |
| **Beauty Assistant** | Chat widget loads and responds |
| **Health** | `/health` returns 200 |

- [ ] Home, products, product detail, collections load  
- [ ] Cart and checkout work; login redirects to main site  
- [ ] Find My Ritual and Beauty Assistant work; `/health` returns 200  

---

## 7. understand-project repo — config and workflows

Do this in the **understand-project** repo (clone if needed: `gh repo clone asperpharma/understand-project`).

**A) Local `.env` (for local dev)**  
- Copy from `env.main-site.example` (in this repo) into `.env`  
- Fill in real values; keep `.env` in `.gitignore`  

**B) Design system (optional but recommended)**  
- Copy the Tailwind color tokens from **DESIGN_SYSTEM.md** (Asper Stone, Rose Clay, Burgundy, Polished Gold, Asper Ink) into `tailwind.config.js` so the live site matches the "Morning Spa" / Medical Luxury look  

**C) GitHub Actions**  
- Use workflows in `.github/workflows/`: `deploy-health-check.yml`, `sync-file-changes-to-lovable.yml`, `sync-issues-prs-to-lovable.yml`  
- In repo **Settings → Secrets and variables → Actions**, add **`LOVABLE_WEBHOOK_URL`** if Lovable provides a webhook  

- [ ] `.env` from example, not committed  
- [ ] Tailwind tokens applied (if desired)  
- [ ] Workflows in place; `LOVABLE_WEBHOOK_URL` set if needed  

---

## 8. Deploy and verify

1. **Push to `main`** (or trigger deploy in Lovable) so the latest code and env are live.  
2. **Health check** (from VIP folder or run against main site):  
   ```bash
   node scripts/health-check.js
   ```  
   Confirms: main site, `/health`, Bulk Upload, Beauty Assistant, Shopify.  
3. **Manual smoke test:**  
   - Open https://asperbeautyshop-com.lovable.app/  
   - Open a product page and a collection (e.g. `/products?category=skincare`)  
   - Open the Beauty Assistant / AI Concierge and send a test message  
   - If you have login: test sign-in redirect back to the main site  

- [ ] Deploy triggered and successful  
- [ ] Health check passes  
- [ ] Homepage, products, and chatbot work on main URL  

---

## 9. Optional — Catalog sync (CSV → Shopify)

If you have a new or updated CSV catalog to push to the store that feeds the main site:

1. In the VIP folder (or where the sync script lives), set in `.env`: `SHOPIFY_STORE`, `SHOPIFY_ACCESS_TOKEN`, and optionally `CSV_PATH`.  
2. Dry-run: `node scripts/sync-shopify-catalog.js --dry-run --limit 5`  
3. Full sync: `node scripts/sync-shopify-catalog.js`  
4. In Shopify Admin, confirm products/variants; then on the main site check `/products` and category filters.  

- [ ] Sync run (if needed); products visible on main site  

---

## Quick reference

| What | Where |
|------|--------|
| Main site | https://asperbeautyshop-com.lovable.app/ |
| Lovable settings | https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings |
| GitHub repo | https://github.com/asperpharma/understand-project |
| Supabase project | rgehleqcubtmcwyipyvi |
| Env template | `env.main-site.example` (this repo) |
| Single source of truth | MAIN_PROJECT.md (in VIP folder) |

---

*Last updated: Feb 2026. Run this checklist whenever you want to "run all updates and apply all brain and everything" to the main website.*
