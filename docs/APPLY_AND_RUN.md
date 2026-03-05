# Apply to Main Site & Run — All Sites & Social Media

**Single source:** [BRAIN-CONFIG.md](./BRAIN-CONFIG.md) (Brain `qqceibvalkoytafynwoc`)  
**Full checklist:** [APPLY_TO_MAIN_SITE.md](../APPLY_TO_MAIN_SITE.md)  
**Role & mandate:** [ROLE_AND_MANDATE.md](./ROLE_AND_MANDATE.md)

This doc ties the Brain, main site, and **all sites and social media accounts** into one apply-and-run flow so everything functions from one deployment.

---

## 1. Run it (local commands)

From **understand-project** root:

```bash
git pull origin main
npm install
npm run sync
npm run health
```

- **`npm run sync`** — Frontend + Brain (Beauty Assistant) sync check.  
- **`npm run health`** — Frontend + Brain health check (hits `/health` and edge function).

If both pass, deploy:

```bash
git add .
git commit -m "feat: apply to main site and all channels"
git push origin main
```

Lovable builds and deploys; main site updates in a few minutes.

---

## 2. All sites (URLs that must point to main)

| Site / channel        | URL / config |
|-----------------------|--------------|
| **Main site (Lovable)** | https://asperbeautyshop-com.lovable.app/ |
| **Production domain**   | https://www.asperbeautyshop.com (when DNS live) |
| **Health endpoint**     | https://asperbeautyshop-com.lovable.app/health → 200 |

Ensure Lovable env has `VITE_SITE_URL` and `VITE_LOVABLE_URL` per [APPLY_TO_MAIN_SITE.md](../APPLY_TO_MAIN_SITE.md). Supabase Auth redirects and `SITE_URL` secret must use the main site URL.

---

## 3. Omnichannel webhooks (Brain — all use main site context)

From [BRAIN-CONFIG.md](./BRAIN-CONFIG.md). All POST to Brain **qqceibvalkoytafynwoc**; responses and links should reference the main site.

| Channel | Webhook / config |
|---------|-------------------|
| **Gorgias** (Unified Helpdesk) | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| **ManyChat** (WhatsApp & Instagram) | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?route=manychat` |
| **Bulk upload** | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/bulk-product-upload` |
| **Health check** | `https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant?health=true` |

Configure Gorgias and ManyChat so CTAs and links point to **https://asperbeautyshop-com.lovable.app/** (or production domain when live).

---

## 4. Social media accounts (all point to main site)

Base URL: **https://asperbeautyshop-com.lovable.app/** (or https://www.asperbeautyshop.com when DNS is live).

| Platform | What to update |
|----------|----------------|
| **Instagram** | Bio link, story links, shoppable posts → main site; deep links e.g. `?intent=acne&source=ig` |
| **WhatsApp** | CTA links, catalog links; ManyChat flows → main site |
| **Facebook** | Page link, shop link, ads landing URL, Messenger bot links |
| **X (Twitter)** | Bio link, pinned post, ads landing URL; e.g. `?source=twitter` |
| **TikTok** | Bio link, link in bio; ads landing URL |
| **Pinterest** | Profile link, product pins → main site product pages |
| **YouTube** | Description link, end screen, Community posts |
| **ManyChat / Meta** | All flow buttons and quick replies → main site or deep link |

- [ ] All social platform links point to main site  
- [ ] No old or staging URLs on any social platform  

---

## 5. Post-deploy verification

1. **Health:** `npm run health` (from repo root).  
2. **Browser:** Open https://asperbeautyshop-com.lovable.app/ and https://asperbeautyshop-com.lovable.app/health → expect 200.  
3. **Smoke:** Home, Products, Cart, Beauty Assistant (chat), Login redirect.  
4. **Channels:** Confirm Gorgias/ManyChat webhooks still resolve and any CTAs open the main site.

---

## Quick reference

| What | Where |
|------|--------|
| Brain ID | `qqceibvalkoytafynwoc` |
| Main site | https://asperbeautyshop-com.lovable.app/ |
| Full apply checklist | [APPLY_TO_MAIN_SITE.md](../APPLY_TO_MAIN_SITE.md) |
| Brain & webhooks | [BRAIN-CONFIG.md](./BRAIN-CONFIG.md) |

---

*Ensures one deploy applies to the main site and all sites and social media accounts (webhooks + social links).*
