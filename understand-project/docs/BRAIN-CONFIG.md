# Brain & Project Configuration (Official)

**Enforced Brain ID:** `qqceibvalkoytafynwoc`  
**GitHub repo:** [asperpharma/understand-project](https://github.com/asperpharma/understand-project)

Legacy staging IDs are overridden; all configs use the live Supabase Brain and this repository.

---

## 1. Cursor Workspace Environment (`.env`)

Create a `.env` file at the project root and paste the block below. These variables are safe for the frontend build and connect Cursor to the live Shopify catalog and Supabase backend.

```env
# The Centralized Brain (Supabase)
VITE_SUPABASE_PROJECT_ID="qqceibvalkoytafynwoc"
VITE_SUPABASE_URL="https://qqceibvalkoytafynwoc.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_XYH3MdZyiulOKUcAD5f6_w_MQIhHLru"

# The Commerce Engine (Shopify)
VITE_SHOPIFY_STORE_DOMAIN="lovable-project-milns.myshopify.com"
VITE_SHOPIFY_STOREFRONT_TOKEN="79d7870bb2e8b940752bdee2af19edbb"
VITE_SHOPIFY_API_VERSION="2025-07"
SHOP_ID="98006860068"
PUBLIC_STOREFRONT_ID="1000093759"
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="5c42cfb6-7c05-49b2-9f02-bd9554a3ced3"

# Routing and Domains
VITE_SITE_URL="https://www.asperbeautyshop.com/"
VITE_LOVABLE_URL="www.asperbeautyshop.com"
```

---

## 2. High-Security Backend Secrets (Vault)

**Do not put these in `.env` or commit them to GitHub.**

Store them only in **Supabase Dashboard** â†’ Project **qqceibvalkoytafynwoc** â†’ **Project Settings** â†’ **Edge Functions** â†’ **Secrets**.

| Secret | Purpose |
|--------|--------|
| Supabase Service Role | Backend bypass (e.g. admin operations) |
| Shopify Private Storefront Token 1 & 2 | Server-side Storefront API |
| Shopify Admin Access Token | Bulk catalog ingestion |
| Gemini / Lovable API Key | Dr. Bot clinical logic |
| hCaptcha Secret Key | COD order validation |

---

## 3. Direct Database & Cursor OAuth

- **Direct DB (PostgreSQL):**  
  `postgresql://postgres:[YOUR-PASSWORD]@db.qqceibvalkoytafynwoc.supabase.co:5432/postgres`  
  Use your project DB password from Supabase Dashboard.

- **Supabase Auth callback (e.g. Cursor OAuth):**  
  `https://qqceibvalkoytafynwoc.supabase.co/auth/v1/callback`

- **Cursor consent:**  
  `https://cursor.com/oauth/consent`

---

## 4. Webhooks (Omnichannel â†’ Dr. Bot)

All endpoints use Brain **qqceibvalkoytafynwoc**. POST only.

| Use | URL |
|-----|-----|
| Gorgias (Unified Helpdesk) | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| ManyChat (WhatsApp & Instagram) | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=manychat` |
| Bulk Inventory Uploader | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload` |
| Frontend / Brain health check | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true` |

---

## 5. Master Administration Links

| Resource | Link |
|----------|------|
| GitHub repository | https://github.com/asperpharma/understand-project |
| GitHub clone (SSH) | `git@github.com:asperpharma/understand-project.git` |
| Lovable deployment | Project ID: `657fb572-13a5-4a3e-bac9-184d39fdf7e6` |
| Live staging frontend | https://www.asperbeautyshop.com/ |
| Production domain (pending DNS) | https://www.asperbeautyshop.com |
| Shopify Admin | https://admin.shopify.com/store/lovable-project-milns |

