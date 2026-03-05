# Asper Beauty Shop — Website Data & Links (Master Reference)

**Single source of truth for domain, project ID, and public links.**  
No API keys or secrets in this file. Use for config, dashboards, link-in-bio, and team alignment.

**Main project rule:** All work, updates, and integrations default to this repo and live site. All channels connect here.

---

## Project in one sentence

Asper Beauty Shop is a **Medical Luxury** e-commerce platform: **"Authentic Quality"** and **"Sanctuary of Science"** — 5,000+ SKUs (Vichy, La Roche-Posay, Maybelline, Rimmel) with a **3-Click Solution** (Analyze → Recommend → Cart) and **Dual-Persona AI** (Dr. Sami = Voice of Science; Ms. Zain = Voice of Luxury), powered by Google Gemini. **Morning Spa** aesthetic (Soft Ivory, Maroon, Shiny Gold); headless React + Shopify + Supabase; omnichannel Brain on website, WhatsApp, Instagram, Facebook. *"Curated by Pharmacists. Powered by Intelligence."*

---

## 1. Identity & Domains

| Item | Value |
|------|--------|
| **Production website (Lovable)** | https://asperbeautyshop-com.lovable.app |
| **Custom domain** | asperbeautyshop.com |
| **Supabase project ID (production)** | `qqceibvalkoytafynwoc` |
| **Supabase base URL** | https://qqceibvalkoytafynwoc.supabase.co |
| **Lovable project** | https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6 |
| **Lovable (GitHub tab)** | https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6/settings?tab=github |
| **GitHub repo** | asperpharma/understand-project |
| **Working branch** | understand-project |

---

## 2. Social & Contact (9 platforms)

Use for link-in-bio, ads, ManyChat/Gorgias.

| Platform | Handle | Link |
|----------|--------|------|
| **WhatsApp** | 00962790656666 / +962 79 065 6666 | https://wa.me/962790656666 |
| **Instagram** | @asper.beauty.shop | https://www.instagram.com/asper.beauty.shop/ |
| **Facebook** | Page | https://www.facebook.com/robu.sweileh |
| **TikTok** | @asper.beauty.shop | https://tiktok.com/@asper.beauty.shop |
| **X (Twitter)** | @asperbeautyshop | https://x.com/asperbeautyshop |
| **YouTube** | @asperbeautyshop | https://youtube.com/@asperbeautyshop |
| **LinkedIn** | company/asper-beauty-shop | https://linkedin.com/company/asper-beauty-shop |
| **Snapchat** | @asperbeautyshop | https://snapchat.com/add/asperbeautyshop |
| **Pinterest** | asperbeautyshop | https://pinterest.com/asperbeautyshop |

**Support:** asperpharma@gmail.com · +962 79 065 6666 · Amman, Jordan.

---

## 3. Commerce & Admin

| Item | Value |
|------|--------|
| **Shopify store** | lovable-project-milns.myshopify.com |
| **Shopify Admin** | https://admin.shopify.com/store/lovable-project-milns |
| **Google Merchant Center** | https://merchants.google.com/mc/overview?a=5717495012 |
| **Merchant Center ID** | 5717495012 |
| **Comparison Shopping Service** | Google Shopping (google.com/shopping) |
| **Google store (search)** | https://www.google.com/search?q=Asper+Beauty+Shop |
| **Google share link** | https://share.google/Zn49LB2qW8pD5owtN |

---

## 4. AI Brain (Beauty Assistant)

**Supabase project (correct):** `qqceibvalkoytafynwoc`

| Purpose | URL |
|---------|-----|
| **ManyChat webhook** | `POST https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=manychat` |
| **Gorgias webhook** | `POST https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| **Health check** | https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true |
| **Bulk Upload health** | https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload |

**Deep links (ads & bios):** Open site and can start 3-Click / Concierge with pre-filled concern.  
Example: `https://asperbeautyshop-com.lovable.app/?intent=acne&source=ig`  
Use `?intent=` and `?source=` for other concerns and platforms.

---

## 5. Architecture (Catalog Sync)

- **Single source of truth:** Shopify. Script writes only to Shopify; Lovable and GMC consume from it.
- **Flow:** CSV → sync script → Shopify Admin API → Storefront API (Lovable) + product feed (GMC).
- **Idempotency:** Lookup by Handle (and optionally SKU); CREATE or UPDATE per product. No duplicates.
- **Sync script:** `scripts/sync-shopify-catalog.ts`  
  Env: `SHOPIFY_ADMIN_ACCESS_TOKEN`, `SHOPIFY_STORE_DOMAIN`, optional `CSV_PATH`.  
  Run: `npx ts-node scripts/sync-shopify-catalog.ts [--dry-run] [--limit N] [path/to/file.csv]`  
  Example CSV names: `products_export.csv`, `Asper_Catalog_FINAL_READY.csv`, or `data/shopify-import-2.csv` (default).

---

## 6. Frontend Verification

- Lovable app loads products from **Shopify Storefront API** (not hardcoded).
- Category filters (e.g. `/products?category=skincare`) rely on `productType` and `tags` from Shopify.
- Sync script must set `productType` and tags consistently (e.g. "Skin Care", tag `skincare`) so filters work.

---

## 7. Monitor (quick ref)

| Service | URL |
|---------|-----|
| **Main site** | https://asperbeautyshop-com.lovable.app |
| **Frontend health** | https://asperbeautyshop-com.lovable.app/health |
| **Gorgias (Asper Beauty)** | https://asper-beauty-shop.gorgias.com |
| **Gorgias AI Agent** | https://asper-beauty-shop.gorgias.com/app/ai-agent/shopify/lovable-project-milns |
| **Supabase** | https://supabase.com/dashboard/project/qqceibvalkoytafynwoc |

---

*Do not add secrets or tokens to this file. For env vars and backend secrets, see SUPABASE_MASTER_PROFILE.md and .env.example.*  
*Last updated: Mar 2026.*
