# Monitor — Where to Check

Quick reference for daily/weekly monitoring. All URLs use **Supabase project qqceibvalkoytafynwoc** and **main site https://asperbeautyshop-com.lovable.app**.

---

## Your URLs

| Service | Your URL |
|---------|----------|
| **Shopify Admin** | https://admin.shopify.com/store/lovable-project-milns |
| **Shopify Store** | https://lovable-project-milns.myshopify.com |
| **Main site (Lovable)** | https://asperbeautyshop-com.lovable.app |
| **Gorgias (Asper Beauty)** | https://asper-beauty-shop.gorgias.com |
| **Gorgias AI Agent** | https://asper-beauty-shop.gorgias.com/app/ai-agent/shopify/lovable-project-milns |
| **Bulk Upload health** | https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload |
| **Beauty Assistant health** | https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true |
| **Supabase** | https://supabase.com/dashboard/project/qqceibvalkoytafynwoc |

---

## 1. Shopify Orders

| Item | Where |
|------|-------|
| **Admin** | Shopify Admin → Orders |
| **Orders direct** | https://admin.shopify.com/store/lovable-project-milns/orders |
| **Unfulfilled** | Admin → Orders → Filter: Unfulfilled |
| **Recent** | Admin → Orders → Sort by date |

---

## 2. Gorgias

| Item | Where |
|------|-------|
| **Dashboard** | https://asper-beauty-shop.gorgias.com |
| **Inbox / Tickets** | https://asper-beauty-shop.gorgias.com/app/views |
| **AI Agent** | Link above (AI Agent row) |
| **Channels (Chat, Email, SMS)** | Settings → Channels |

---

## 3. Health URLs

| Endpoint | URL | Expected |
|----------|-----|----------|
| **Frontend** | https://asperbeautyshop-com.lovable.app/health | 200; body `{"status":"ok", ...}` |
| **Bulk Upload** | https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload | 200 |
| **Beauty Assistant** | https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true | 200, e.g. `{"status":"active"}` |

---

## 4. Chatbot — connect all channels

Same backend (Beauty Assistant) for website + Gorgias + ManyChat.

| Channel | Webhook or link | Setup |
|---------|-----------------|--------|
| **Website** | Floating “Ask the Pharmacist” + Header + Footer | Already on every page. |
| **Deep links** | `https://asperbeautyshop-com.lovable.app/?intent=acne&source=ig` | Use in posts/bios. |
| **Gorgias** | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=gorgias` | Gorgias → Integrations → POST to URL. |
| **ManyChat** (IG, Messenger, WhatsApp) | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=manychat` | Flow → Webhook POST → send reply. |

---

## Quick checklist

- [ ] Shopify: New orders, unfulfilled, refunds
- [ ] Gorgias: Open tickets, response time
- [ ] Frontend /health: 200, `{"status":"ok"}`
- [ ] Bulk Upload health: 200
- [ ] Beauty Assistant health: 200, `{"status":"active"}`
- [ ] Chatbot: Website widget live; Gorgias/ManyChat webhooks configured if used

---

*See docs/ASPER_WEBSITE_DATA_AND_LINKS.md for full data and links. Last updated: Mar 2026.*
