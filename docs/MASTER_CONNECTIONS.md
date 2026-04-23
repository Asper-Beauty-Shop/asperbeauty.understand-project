# Asper Beauty Shop — Master Connections & Integration Map

> Single source of truth for every project ID, URL, handle, endpoint, and integration point.
> Copy-paste this into any AI tool, CI/CD system, or developer onboarding to fully connect to the project.
> Last updated: 2026-03-04.

---

## 1. Project Identifiers

| System | ID / Domain |
|---|---|
| **Supabase Project ID** | `vhgwvfedgfmcixhdyttt` |
| **Lovable Project ID** | `657fb572-13a5-4a3e-bac9-184d39fdf7e6` |
| **Shopify Store Domain** | `lovable-project-milns.myshopify.com` |
| **Shopify API Version** | `2025-07` |
| **Google Merchant Center ID** | `5717495012` |
| **GitHub Repository** | `asperpharma/understand-project` |
| **Primary Branch** | `main` |

---

## 2. Live URLs & Domains

| Purpose | URL |
|---|---|
| **Production Website** | `https://www.asperbeautyshop.com` |
| **Staging (Lovable)** | `https://www.asperbeautyshop.com` |
| **Health Check** | `https://www.asperbeautyshop.com/health` |

---

## 3. Dashboard URLs

| Dashboard | URL |
|---|---|
| **GitHub Repo** | `https://github.com/asperpharma/understand-project` |
| **Supabase Dashboard** | `https://supabase.com/dashboard/project/vhgwvfedgfmcixhdyttt` |
| **Lovable Dashboard** | `https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6` |
| **Lovable Settings** | `https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings` |
| **Shopify Admin** | `https://admin.shopify.com/store/lovable-project-milns` |
| **Gorgias Helpdesk** | `https://asper-beauty-shop.gorgias.com` |
| **Gorgias AI Agent** | `https://asper-beauty-shop.gorgias.com/app/ai-agent/shopify/lovable-project-milns` |
| **ManyChat** | `https://manychat.com/` |
| **Google Merchant Center** | `https://merchants.google.com/mc/overview?a=5717495012` |

---

## 4. API Endpoints

### Supabase Base URL

```
https://vhgwvfedgfmcixhdyttt.supabase.co
```

### Shopify Storefront GraphQL

```
https://lovable-project-milns.myshopify.com/api/2025-07/graphql.json
```

### Edge Function Base

```
https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/{function_name}
```

---

## 5. Edge Functions (All 20+)

All deployed at `https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/`

| Function | Purpose |
|---|---|
| `beauty-assistant` | Dr. Bot AI engine (primary) |
| `bulk-product-upload` | Shopify catalog sync |
| `create-cod-order` | Cash-on-delivery order creation |
| `get-order-status` | Order tracking |
| `delete-account` | Account deletion |
| `enrich-products` | AI product metadata enrichment |
| `scrape-product` | Web scraping utility |
| `generate-product-images` | AI image generation |
| `remove-background` | Image background removal |
| `verify-captcha` | hCaptcha verification |
| `generate-embeddings` | Vector embeddings |
| `capture-bot-lead` | Lead capture webhook |
| `get-products-by-concern` | Concern-filtered products |
| `get-digital-tray` | Personalized product tray |
| `health-checks-ingest` | Health metrics ingestion |
| `log-concierge-events` | Concierge analytics |
| `log-telemetry` | General telemetry |
| `prescription-bridge` | AI output to product list |
| `shopify-best-sellers` | Top products sync |
| `tray` | Digital routine builder |
| `gemini-tts` | Google Gemini TTS proxy |
| `gorgias` | Gorgias webhook handler |
| `manychat` | ManyChat webhook handler |

---

## 6. Webhook Routes (Dr. Bot Gateway)

Base endpoint:
```
https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant
```

| Route Parameter | Source | Full URL |
|---|---|---|
| `?source=web` | Website frontend | `…/beauty-assistant?source=web` |
| `?route=manychat` | ManyChat automation | `…/beauty-assistant?route=manychat` |
| `?source=whatsapp` | WhatsApp Business | `…/beauty-assistant?source=whatsapp` |
| `?route=gorgias` | Gorgias helpdesk | `…/beauty-assistant?route=gorgias` |
| `?health=true` | Health probe | `…/beauty-assistant?health=true` |

---

## 7. Social Media (9 Channels)

| Platform | Handle | URL |
|---|---|---|
| **Instagram** | `@asper.beauty.shop` | `https://www.instagram.com/asper.beauty.shop/` |
| **Facebook** | `AsperBeautyShop` | `https://www.facebook.com/AsperBeautyShop` |
| **WhatsApp** | `+962 79 065 6666` | `https://wa.me/962790656666` |
| **TikTok** | `@asper.beauty.shop` | `https://www.tiktok.com/@asper.beauty.shop` |
| **X (Twitter)** | `@asperbeautyshop` | `https://x.com/asperbeautyshop` |
| **YouTube** | `@asperbeautyshop` | `https://www.youtube.com/@asperbeautyshop` |
| **LinkedIn** | `asper-beauty-shop` | `https://www.linkedin.com/company/asper-beauty-shop` |
| **Snapchat** | `@asperbeautyshop` | `https://www.snapchat.com/add/asperbeautyshop` |
| **Pinterest** | `asperbeautyshop` | `https://www.pinterest.com/asperbeautyshop` |

---

## 8. Contact Information

| Type | Value |
|---|---|
| **Phone** | `+962 79 065 6666` |
| **Phone (URL)** | `tel:+962790656666` |
| **WhatsApp (URL)** | `https://wa.me/962790656666` |
| **Email** | `asperpharma@gmail.com` |
| **Location** | Amman, Jordan |
| **Languages** | English, Arabic (RTL) |

---

## 9. Environment Variables

### Frontend (Lovable / .env)

| Variable | Value |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | `vhgwvfedgfmcixhdyttt` |
| `VITE_SUPABASE_URL` | `https://vhgwvfedgfmcixhdyttt.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | *(Supabase anon key — get from dashboard)* |
| `VITE_SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | *(Storefront API token — get from Shopify)* |
| `VITE_SHOPIFY_API_VERSION` | `2025-07` |
| `VITE_SITE_URL` | `https://www.asperbeautyshop.com/` |
| `VITE_LOVABLE_URL` | `www.asperbeautyshop.com` |

### Sync Scripts (Local / CI only)

| Variable | Value |
|---|---|
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | *(Admin API token — never expose client-side)* |
| `SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` |
| `CSV_PATH` | `./data/shopify-import-2.csv` |

### Supabase Edge Function Secrets

| Secret | Value |
|---|---|
| `SITE_URL` | `https://www.asperbeautyshop.com/` |
| *(AI API key)* | *(set in Supabase dashboard)* |
| *(Shopify private token)* | *(set in Supabase dashboard)* |

### GitHub Actions Secrets

| Secret | Purpose |
|---|---|
| `LOVABLE_WEBHOOK_URL` | File sync with Lovable |
| `DISCORD_WEBHOOK_URL` | Deploy notifications (optional) |

---

## 10. Authentication Configuration

### Supabase Auth

| Setting | Value |
|---|---|
| Site URL | `https://www.asperbeautyshop.com/` |
| Redirect URLs | `https://www.asperbeautyshop.com/**` |
| Redirect URLs (staging) | `https://www.asperbeautyshop.com/**` |

### Auth Roles

| Role | Scope |
|---|---|
| `anon` | Public read, limited insert |
| `authenticated` | Logged-in customer access |
| `service_role` | Backend-only (never expose client-side) |

---

## 11. Content Security Policy Domains

These domains are allowed in the CSP header (`index.html`):

| Category | Domains |
|---|---|
| **Supabase** | `https://*.supabase.co` |
| **Shopify** | `https://cdn.shopify.com`, `https://lovable-project-milns.myshopify.com` |
| **Gorgias** | `https://config.gorgias.io`, `https://config.gorgias.chat`, `https://assets.gorgias.chat`, `https://us-east1-898b.gorgias.chat`, `wss://*.gorgias.chat` |
| **Google** | `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://storage.googleapis.com`, `https://generativelanguage.googleapis.com`, `https://www.google.com`, `https://www.gstatic.com` |
| **hCaptcha** | `https://js.hcaptcha.com`, `https://newassets.hcaptcha.com` |
| **Lovable** | `https://*.lovable.app`, `https://ai.gateway.lovable.dev` |
| **Site** | `https://www.asperbeautyshop.com` |

---

## 12. GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `deploy-health-check.yml` | Push to `main` | Wait 120s, GET `/health`, expect 200 |
| `sync-file-changes-to-lovable.yml` | Push | Two-way file sync with Lovable |
| `sync-issues-prs-to-lovable.yml` | Issue/PR events | Sync issues/PRs to Lovable |

---

## 13. Third-Party Integrations Summary

| Integration | Status | Connection Point |
|---|---|---|
| **Supabase** (DB + Auth + Edge Functions) | Active | `vhgwvfedgfmcixhdyttt` |
| **Shopify** (5,000+ SKU catalog) | Active | Storefront API + Admin API |
| **Gorgias** (Customer support) | Active | CSP + webhook via `beauty-assistant` |
| **ManyChat** (Conversational commerce) | Active | Webhook via `beauty-assistant` |
| **WhatsApp Business** | Active | `+962790656666` + webhook |
| **Google Merchant Center** | Active | Feed ID `5717495012` |
| **Google Gemini** (AI / TTS) | Active | `gemini-tts` edge function |
| **hCaptcha** | Active | `verify-captcha` edge function |
| **Lovable** (Deployment) | Active | Auto-deploy on push to `main` |
| **Discord** (Notifications) | Optional | `DISCORD_WEBHOOK_URL` secret |

---

## 14. Deprecated / Do Not Use

| Item | Old Value | Correct Value |
|---|---|---|
| Supabase Project ID | ~~`rgehleqcubtmcwyipyvi`~~ | `vhgwvfedgfmcixhdyttt` |
| Facebook Page URL | ~~`facebook.com/robu.sweileh`~~ | `facebook.com/AsperBeautyShop` |
| Twitter Handle | ~~`@AsperBeauty`~~ | `@asperbeautyshop` |

---

*This document is the complete integration map. Hand it to any tool, developer, or AI assistant to achieve full project connectivity.*



## 10. Connection Health Audit (March 2026)
- [x] Website (Production): LIVE
- [x] Dr. Bot (AI Brain): ACTIVE
- [x] WhatsApp/ManyChat: CONNECTED
- [x] Instagram/Facebook: CONNECTED
- [x] Shopify Catalog: SYNCED (4,311 Items)
- [x] GoDaddy Domain: SECURED
- [x] Real-Image Lab: ONLINE

## 16. Google Cloud / Gemini Project Info
*   **Project Name:** Asper Beauty Shop
*   **Project Number:** 745216919925
*   **Project ID:** gen-lang-client-0600937774


