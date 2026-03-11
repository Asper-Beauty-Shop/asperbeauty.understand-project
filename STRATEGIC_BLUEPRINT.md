# Strategic Architecture & CRO Blueprint — Asper Beauty Shop

**Medical luxury e-commerce ecosystem.** Single source of truth for brand identity, technical architecture, CRO, and omnichannel strategy. All execution targets the **main project**: [asperbeautyshop-com.lovable.app](https://asperbeautyshop-com.lovable.app/). See **MAIN_PROJECT.md** for repo, Lovable, and live-site lock.

---

## 1. Core Identity & Service (Who We Are & What We Do)

| Pillar | Definition |
|--------|------------|
| **Positioning** | Medical elite, clean, clinical, premium, feminine, trust-driven. Not a retailer—a **pharmacist-curated sanctuary of science**. |
| **Philosophy** | **"Refining the Roughness"** — dual meaning: (1) physical restoration of stressed skin, (2) psychological restoration via a seamless, frictionless shopping experience. |
| **Mission** | High-performance, true beauty solutions that turn rough days and stressed skin into confidence and calm. Rigorous science meets premium self-care. |
| **Brand promise** | Guaranteed authenticity; every product perceived through a lens of pharmaceutical authority. 100% original, temperature-controlled, no grey market. |

**Visual values (four pillars governing all UI and assets):**

- **Resilience** — Beauty as strength and barrier protection; stable architecture and authoritative clinical copy.
- **Transparency** — No hidden harshness: clear ingredients, straightforward pricing, no dark patterns or obscured shipping.
- **Refinement** — "Smoothing" the journey from overwhelm to guided flow; smooth transitions, optimized rendering, elegant micro-interactions.
- **Empathy** — Accessible support, empathetic AI, non-judgmental language (e.g. severe acne, rosacea).

**Target demographic (Asper Woman/Man):** Urban professionals and busy parents, 25–45. Time-poor, discerning; seek relief, resilience, immediate efficacy. Digital experience must eliminate decision fatigue via expert-led curation, not endless catalog scrolling.

---

## 2. Strategic Purpose (Why We Are Building This)

- **Paradigm shift:** From superficial visual merchandising to **scientifically validated digital environments** that communicate pharmaceutical authority and foster deep trust.
- **Scale challenge:** Streamline the user journey for **5,000+ medical and cosmetic SKUs** without overwhelming the customer—replace browsing with guided, AI-led discovery.
- **Project DNA:** Aligns with transition from a **5,000-product Shopify store** into a **broader SaaS-ready ecosystem**: headless frontend, centralized AI brain, omnichannel touchpoints.
- **Market fit:** MENA (especially Jordan): skin-first philosophy, clinical efficacy demand, COD reliance, BNPL growth, ethical/local supply-chain preference. Architecture must support COD + BNPL, RTL, and agile catalog/category shifts.
- **Commercial goals:** Maximize conversion via the **3-Click Solution** (Analyze → Recommend → Add regimen to cart), elevate AOV (e.g. 50 JOD free shipping), and reduce cart abandonment with transparent costs and prominent COD.

---

## 3. Tech Stack & Corporate Tools

### 3.1 Infrastructure overview

| Layer | Technology | Role |
|-------|------------|------|
| **Frontend** | React 18, Vite, Tailwind CSS, shadcn/ui | UI, RTL, cart state; LCP &lt;2.5s, near-zero CLS |
| **Commerce** | Shopify (Storefront API GraphQL, e.g. 2025-07) | Checkout, inventory; headless backend (lovable-project-milns.myshopify.com) |
| **Middleware / AI** | Supabase (PostgreSQL, Deno Edge Functions) | COD validation, AI routing, audit logs, bulk upload, Beauty Assistant |
| **Hosting** | Vercel / Lovable | Edge CDN, CI/CD, preview builds |
| **State / data** | Zustand, TanStack Query, localStorage | Cart, wishlist, minimal blocking server round-trips |

### 3.2 Design system (locked)

| Element | Spec | Purpose |
|--------|------|---------|
| **Canvas** | Asper Stone (warm light gray / soft ivory) | Clinic-like, reduces eye strain; lets SKU packaging colors harmonize |
| **Feminine accent** | Rose Clay (muted pink / terracotta) | Soften clinical rigidity |
| **Authority / CTA** | Deep Burgundy / Maroon | Headers, primary conversion buttons |
| **Trust accent** | Polished Gold (sparing: 1px borders, hover “Midas Touch,” SVG icons) | Seal of authenticity |
| **Headings** | Playfair Display or Cinzel (serif) | Timeless refinement |
| **Body / UI** | Lato or Montserrat (sans-serif) | “Voice of Science” |
| **Arabic** | Tajawal | RTL, premium, legible |

**Logo:** Primary = Golden Lotus (horizontal layout in header). Variants: circular “Pharmacist’s Stamp,” minimal flat gold (dark BG), one-color burgundy (print/mono), ornate luxury (VIP/unboxing).

### 3.3 Integrations and data flow

| System | Integration point | Data flow |
|--------|--------------------|-----------|
| **Shopify Admin API** | Bulk sync script (Node/TS, PapaParse) | CSV/JSON → productCreate / productUpdate / productVariantsBulkUpdate; idempotent by handle/SKU |
| **Shopify Storefront API** | React app (GraphQL) | Precise queries per view (e.g. grid: title, price, thumbnail only); full PDP on demand |
| **Supabase** | Edge Functions + PostgreSQL | COD orders, chat_logs, beauty_assistant_audit, concierge_profiles; RLS for cod_orders (anonymous insert only) |
| **Gorgias** | Chat widget in `index.html`; AI Agent (Dr. Sami) | Chat, Email, SMS; knowledge synced to store; CSP allowlist: config.gorgias.chat, assets.gorgias.chat, etc. |
| **ManyChat** | Webhook POST → Supabase `beauty-assistant?route=manychat` | IG, Messenger, WhatsApp → same central brain (Gemini) |
| **Beauty Assistant (AI)** | Supabase `beauty-assistant` (Gemini 2.5 Flash) | Single brain for site widget, Gorgias webhook, ManyChat; live inventory check before recommendations |
| **Resend** | Supabase `create-cod-order` | Order confirmation emails post HCAPTCHA |

---

## 4. Phased Breakdown & Clean Data Structures

### Phase 1: Core commerce and catalog

**Objective:** Headless storefront live; 5,000+ SKUs synced; normalized categories and tags; Storefront API only fetches needed fields.

**Clean data structures:**

- **Product (Shopify + sync script):**
  - `handle` (slug from title if missing), `title`, `descriptionHtml`, `productType` (e.g. "Skin Care"), `tags` (e.g. `["skincare","Concern_Acne","Step_Cleanse"]`), `variants[].price`, `variants[].sku`, `images[]` (source URLs; script skips 404/5xx, logs dead URLs).
- **Sync idempotency:** Resolve by `handle` or fallback `sku`; then `productUpdate` or `productCreate` + mandatory `productVariantsBulkUpdate` for price/SKU.
- **Rate limits:** On HTTP 429, read `Retry-After`; exponential backoff (e.g. 500–1000 ms) between bulk ops.

### Phase 2: AI protocol and 3-Click Solution

**Objective:** Dual-persona AI (Dr. Sami / Ms. Zain) with shared context; 3-Click (Analyze → Recommend → Regimen to cart); live inventory check; no hallucinated or out-of-stock recommendations.

**Clean data structures:**

- **Conversation context (Supabase):**
  - `chat_logs`: session id, channel (website | gorgias | manychat), messages[], timestamps.
  - `beauty_assistant_audit`: user intent, persona used, products recommended, inventory_check_result.
  - `concierge_profiles`: anonymized skin/goals for personalization (Layered Consent UX).
- **Persona routing:** Clinical keywords / safety questions → Dr. Sami; aesthetic / “glow,” “routine,” gifting → Ms. Zain. Shared memory so handoff (e.g. “Is this safe while breastfeeding?”) uses same product context.
- **Guardrail:** System prompt: “I provide wellness guidance, not medical diagnosis.”
- **Regimen output:** Only after live Storefront API check; substitute clinically comparable in-stock alternative if preferred item OOS.

**Optional advanced modules:** Gemini Vision — (1) Ingredient Safety Shield: OCR label → Safety Grade A–F; (2) Batch Auditor: batch/barcode image → expiry, origin, authenticity check.

### Phase 3: CRO and checkout

**Objective:** Intent-based filtering, transparent shipping/costs, 50 JOD free-shipping threshold, prominent COD, minimal form fields, guest checkout.

**Clean data structures:**

- **Cart (frontend + Shopify):**
  - Persistent cart (Zustand/localStorage); line items with variantId, quantity; shipping threshold 50 JOD computed in slide-out drawer before checkout.
- **COD (Supabase):**
  - `cod_orders`: customer name, phone, address, order_id (Shopify), HCAPTCHA token, created_at; RLS: insert allowed, no unauthorized read/update.
- **Search:** Predictive autocomplete with thumbnails; typo-tolerant (e.g. “hylaronic” → hyaluronic). Zero-results → CTA to AI concierge with search intent.

### Phase 4: Omnichannel and unified brain

**Objective:** Gorgias (Chat, Email, SMS) + Dr. Sami on chat; ManyChat (IG, Messenger, WhatsApp) via webhook to same `beauty-assistant`; deep links to main project with pre-filled intent.

**Clean data structures:**

- **Deep link (main project):** `https://asperbeautyshop-com.lovable.app/?intent={concern}&source={ig|wa|fb}` → parse on load, open chat, pre-fill AI context.
- **Webhooks:**
  - Gorgias: POST to `beauty-assistant?route=gorgias`; response `reply` mapped to reply action.
  - ManyChat: POST to `beauty-assistant?route=manychat`; same request/response contract.
- **CSP:** Allowlist Gorgias domains so widget loads on main site without console errors.

---

## 5. CRO Summary Table

| Strategy | Implementation | Outcome |
|----------|----------------|--------|
| Intent-based filtering | Tags by ambition (e.g. Rosacea Safe, Pregnancy Safe) | Lower cognitive load; faster discovery |
| Visual autocomplete | Search + thumbnails + spell tolerance | Capture high-intent queries; fewer dead ends |
| Layered Consent UX | Plain-language data use before AI quizzes | Trust for sensitive skin/health data |
| Strategic bundling | 50 JOD free shipping in cart UI | Higher AOV (clinical + daily essentials) |
| Prominent COD | Prioritized at payment step | Lower mobile cart abandonment in MENA |
| 3-Click Solution | Analyze → Recommend → Add regimen | Shorter time-to-purchase; higher confidence |

---

## 6. Main project alignment

- **Live site:** [asperbeautyshop-com.lovable.app](https://asperbeautyshop-com.lovable.app/)
- **Repo:** asperpharma/understand-project (see **MAIN_PROJECT.md**)
- All channels (Gorgias, ManyChat, social/ads), data (catalog, Dr. Sami, concierge), and updates apply to **this** project. This blueprint describes the architecture and CRO for that single ecosystem.

---

*Last updated: Feb 2026. Strategic canon for Medical Luxury E-Commerce; use with MAIN_PROJECT.md and RUNBOOK.md.*
