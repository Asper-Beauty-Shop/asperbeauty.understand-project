# Asper Beauty Shop — Main Details & Pages We Work On

**Single source:** [MAIN_PROJECT.md](MAIN_PROJECT.md) | **Apply checklist:** [APPLY_TO_MAIN_SITE.md](APPLY_TO_MAIN_SITE.md)

---

## 1. Main project identity

| Item | Value |
|------|--------|
| **Name** | Asper Beauty Shop (main website) |
| **Live site (main)** | **https://asperbeautyshop-com.lovable.app/** |
| **Custom domain** | www.asperbeautyshop.com (when configured) |
| **GitHub repo** | **asperpharma/understand-project** |
| **Clone** | `gh repo clone asperpharma/understand-project` |
| **Lovable project** | https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings |
| **Lovable project ID** | `657fb572-13a5-4a3e-bac9-184d39fdf7e6` |

All customer-facing work and deployments target this project and repo.

---

## 2. Live site pages (main ones we work on)

These are the **main pages/routes on the live website** to build, update, and verify:

| Page / route | URL | What to check |
|--------------|-----|----------------|
| **Home** | https://asperbeautyshop-com.lovable.app/ | Hero, nav, featured products, footer |
| **Products** | https://asperbeautyshop-com.lovable.app/products | Listing, filters, e.g. `?category=skincare` |
| **Product detail** | https://asperbeautyshop-com.lovable.app/products/[handle] | Images, price, Add to cart |
| **Collections** | Category/collection pages | Correct products per category |
| **Cart** | Cart drawer or page | Items, checkout CTA |
| **Checkout** | Shopify checkout | In main site context |
| **Account / Login** | Auth flow | Redirects back to main site |
| **Find My Ritual / Concierge** | In-app flow | Analyze → Recommend → Cart (3-Click) |
| **Beauty Assistant** | Chat widget (all pages) | Loads and responds; same brain as Gorgias/ManyChat |
| **Health** | https://asperbeautyshop-com.lovable.app/health | Returns 200 (build/deploy check) |
| **Contact** | /contact (if present) | Contact & social links |

**Deep links (for social/ads):**

- Open site + chat with pre-filled concern:  
  `https://asperbeautyshop-com.lovable.app/?intent=acne&source=ig`

---

## 3. Docs & files in this VIP folder (main ones we work on)

These are the **main documents and assets** in **Asper Shop ALL Files VIP** that define and apply the project:

| Doc / file | Purpose |
|------------|---------|
| **MAIN_PROJECT.md** | Single source of truth: main project, repo, channels, env, CSV sync, Master Project Breakdown prompt |
| **APPLY_TO_MAIN_SITE.md** | Checklist to apply all updates, brain, social, and pages to the main site (9 steps + perfect update in 4 steps) |
| **PLAN_FULL_AND_CLEAN_DESIGN.md** | Full plan: CSV→Shopify sync, design application, Master Project Breakdown reference |
| **DESIGN_SYSTEM.md** | Four pillars (Resilience, Transparency, Refinement, Empathy), Clinical Luxury palette, Tailwind tokens |
| **TEST_BRAIN_AND_CHATBOT.md** | How to test brain & chatbot (health, POST, website, Gorgias, ManyChat); run `npm run test:brain` |
| **INTEGRATIONS_AND_DEPLOY.md** | Notion/Discord/X sync, auto-deploy from main, workflows |
| **RUNBOOK.md** | Where to check and fix; points to main project |
| **.cursorrules** | Cursor/Claude: design system, apply checklist, Master Project Breakdown rule |
| **tailwind.asper-design.js** | Tailwind theme snippet (colors) to paste into understand-project |
| **scripts/sync-shopify-catalog.js** | CSV → Shopify catalog sync (idempotent) |
| **scripts/health-check.js** | Health check (site, /health, Bulk Upload, Beauty Assistant) |
| **scripts/test-brain-and-chatbot.js** | Brain + chatbot test script (`npm run test:brain`) |
| **.github/workflows/** | deploy-health-check, sync-issues-prs-to-lovable, files-to-lovable, etc. |

**Other referenced docs:** GORGIAS_OMNICHANNEL.md, Gorgias-AI-Agent-Dr-Sami-Setup.md, CHATBOT_SOCIAL_MEDIA_SETUP.md, STRATEGIC_BLUEPRINT.md, Asper Shop ALL Files VIP.md (monitor checklist).

---

## 4. Admin & external pages (main ones we use)

| What | URL / place |
|------|-------------|
| **Shopify Admin** | https://admin.shopify.com/store/lovable-project-milns |
| **Shopify Orders** | https://admin.shopify.com/store/lovable-project-milns/orders |
| **Gorgias (Asper Beauty)** | https://asper-beauty-shop.gorgias.com |
| **Gorgias Inbox / Tickets** | https://asper-beauty-shop.gorgias.com/app/views |
| **Gorgias AI Agent** | https://asper-beauty-shop.gorgias.com/app/ai-agent/shopify/lovable-project-milns |
| **Supabase project** | https://qqceibvalkoytafynwoc.supabase.co (project ID: qqceibvalkoytafynwoc) |
| **Beauty Assistant health** | https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true |
| **Bulk Upload health** | https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload |

---

## 5. Codebase we edit for the live site

| What | Where |
|------|--------|
| **Live site code** | **asperpharma/understand-project** (GitHub repo) |
| **Local clone** | Your machine: e.g. `…/understand-project` |
| **Deploy** | Push to `main` → Lovable builds and deploys to https://asperbeautyshop-com.lovable.app/ |

This VIP folder holds **docs, scripts, and workflows** that apply to understand-project; actual UI/code changes for the live site go in **understand-project**.

---

## 6. Quick checklist — main pages verified

After each deploy, confirm on **https://asperbeautyshop-com.lovable.app/**:

- [ ] **Home** (`/`) — hero, nav, footer
- [ ] **Products** (`/products`, `/products?category=skincare`) — listing and filters
- [ ] **Product detail** — one product page: images, price, Add to cart
- [ ] **Cart** — add item, open cart, checkout CTA
- [ ] **Beauty Assistant** — widget opens and replies
- [ ] **Find My Ritual / Concierge** — flow works (Analyze → Recommend → Cart)
- [ ] **/health** — returns 200

Then run from this VIP folder: `npm run health` and, for full brain/chatbot test: `npm run test:brain`.

---

*Last updated: Feb 2026. For full project rules and channels, see MAIN_PROJECT.md. For step-by-step apply flow, see APPLY_TO_MAIN_SITE.md.*
