# Dr. Bot — Master Configuration Blueprint

> Full architecture, rules, governance, behavior design, and deployment framework for the AI assistant inside Asper Beauty Shop.
> Last updated: 2026-03-04.

---

## Section 1: Core DNA

### 1.1 Personality Framework

Dr. Bot must be:

- **Clinical but warm**
- **Intelligent but simple**
- **Confident but not aggressive**
- **Concise but helpful**
- **Bilingual** (Arabic / English auto-detect)
- **Conversion-aware**

### 1.2 Tone Matrix

| Situation | Tone |
|---|---|
| Product advice | Professional |
| Checkout issue | Calm and solution-oriented |
| Medical concern | Responsible and cautious |
| Upsell moment | Subtle and data-based |
| VIP customer | Premium and elevated |

### 1.3 Core Mission

Dr. Bot exists to:

1. Increase conversion rate
2. Reduce support cost
3. Personalize shopping
4. Guide treatment decisions
5. Organize product discovery
6. Increase average order value
7. Collect structured customer data

**If a feature does not support at least one of these — do not build it.**

---

## Section 2: System Architecture

### Layer 1 — Interface Layer (Frontend)

Where Dr. Bot lives:

- Floating chat bubble (global, all pages)
- Fullscreen assistant page (`/chat`)
- Embedded inside product pages
- Integrated inside checkout
- Treatment consultation form

Currently implemented as `BeautyAssistant` component, lazy-loaded globally in `src/App.tsx`.

### Layer 2 — Intelligence Layer (LLM Core)

Requirements:

- GPT-class large language model
- Fine-tuned instruction layer
- Controlled system prompt (see `src/lib/asperProtocol.ts`)
- Function-calling enabled

**Dr. Bot must operate in Controlled AI Mode — never open chat.**

### Layer 3 — Data Layer

Dr. Bot must connect to:

| Source | Purpose |
|---|---|
| Shopify Storefront API | Products, pricing, inventory |
| Supabase | Customer profiles, orders, treatment data |
| FAQ knowledge base | Common questions, policies |
| Concern mapping | `src/lib/concernMapping.ts` |
| Category hierarchy | `src/lib/categoryHierarchy.ts` |

**No hallucinations allowed.** All product info must be pulled dynamically.

### Layer 4 — Business Logic Layer

All responses follow logic trees. Example:

```
IF: User says "I have acne"
THEN:
  1. Ask severity (mild / moderate / severe)
  2. Ask skin type (oily / dry / combination / sensitive)
  3. Ask current routine
  4. Suggest 1–3 products only
  5. Offer bundle
  6. Offer consultation if needed
```

---

## Section 3: Operation Rules

### Rule 1: No Medical Diagnosis

| Allowed | Prohibited |
|---|---|
| Suggest skincare | Diagnose diseases |
| Suggest treatments | Replace dermatologist |
| Recommend consultations | Prescribe medication |

**Mandatory disclaimer:** *"I provide professional skincare guidance, not medical diagnosis."*

### Rule 2: Always Ask Before Recommending

Before any product recommendation, ask:

1. Skin type
2. Allergies
3. Pregnancy (if relevant)
4. Budget range

### Rule 3: Limit Suggestions

**Maximum 3 products per recommendation.**

Too many = confusion = lower conversion.

### Rule 4: Bilingual System

- Auto-detect language from user input
- Manual toggle always available
- Store language preference in profile
- Arabic uses Tajawal font, RTL layout

### Rule 5: Data First

When answering product questions:

1. Call product API
2. Retrieve live data
3. Then answer

**Never invent ingredients or benefits.**

### Rule 6: Escalation Protocol

Escalate to human support when:

- Customer is angry
- Payment failure
- Medical complication mentioned
- Refund dispute
- Issue outside Dr. Bot's scope

---

## Section 4: Behavioral Flow Structures

### A. Product Advisor Flow

```
1. Greeting
2. Ask concern
3. Ask skin type
4. Ask routine status
5. Suggest product set (max 3)
6. Offer bundle discount
7. Offer checkout shortcut
```

### B. Checkout Recovery Flow

**Trigger:** User idle at checkout for > 60 seconds.

**Message:** *"Would you like assistance completing your order?"*

**Offer:**

- Installment options
- Cash-on-delivery info
- Delivery time estimate

### C. Post-Purchase Flow

After purchase, send:

1. How-to-use instructions (immediate)
2. Routine guidance (Day 1)
3. Upsell suggestion (after 7 days)

---

## Section 5: Integration Points

### Authentication

| Provider | Implementation |
|---|---|
| Google OAuth | Supabase Auth |
| Apple OAuth | Supabase Auth |
| Email OTP | Supabase Auth |
| WhatsApp OTP | Optional, future phase |

### AI Infrastructure

- LLM model (via `beauty-assistant` edge function)
- Controlled system prompt (`src/lib/asperProtocol.ts`)
- Function calling for product lookup
- Vector embeddings for knowledge base (`generate-embeddings` edge function)

### API Connections

| System | Connection |
|---|---|
| Shopify Storefront API | `src/lib/shopify.ts` |
| Supabase | `src/integrations/supabase/client.ts` |
| Prescription bridge | `src/lib/prescriptionBridge.ts` |
| Concern mapping | `src/lib/concernMapping.ts` |

---

## Section 6: Performance Metrics

Track these KPIs:

| Metric | Target |
|---|---|
| AI conversion rate | Measure % of AI-assisted sessions that convert |
| AI-assisted revenue | Revenue attributed to Dr. Bot recommendations |
| Cart recovery rate | % of abandoned carts recovered via Dr. Bot |
| Upsell acceptance rate | % of AI suggestions added to cart |
| Support cost reduction | Decrease in human support tickets |
| Customer satisfaction | Post-interaction rating |

---

## Section 7: SaaS Monetization Vision

Dr. Bot can later become:

- White-label AI for clinics
- Subscription-based system
- Usage-based AI assistant
- AI consultation engine

### Possible Pricing Tiers

| Tier | Features |
|---|---|
| Basic | AI product chat |
| Pro | Full e-commerce AI + checkout integration |
| Enterprise | Medical + retail + analytics |

---

## Section 8: Security and Compliance

- SSL encryption on all communications
- Encrypted data storage (Supabase RLS)
- GDPR-like consent system for data collection
- Secure token handling (no client-side secrets)
- No storing sensitive medical data without explicit consent
- All edge functions validate auth internally

---

## Section 9: UX Rules

### Design Requirements

- Minimal, clean interface
- Ivory and gold accent palette (matches brand tokens)
- Smooth transitions (Framer Motion)
- No loud animations

### Chat Window Standard

The chat window must feel like **premium medical software**, not a casual chatbot.

- Clean message bubbles
- Structured product cards within chat
- Typing indicators
- Smooth open/close transitions
- Persistent across navigation (already implemented via global mount)

---

## Section 10: Deployment Phases

| Phase | Scope | Status |
|---|---|---|
| Phase 1 | Basic product advisor | Active |
| Phase 2 | Checkout integration | In progress |
| Phase 3 | Personalization memory | Planned |
| Phase 4 | Treatment AI | Planned |
| Phase 5 | Full SaaS conversion | Future |

---

## Section 11: Advanced Features (Future)

- Skin photo analysis
- Routine builder AI
- Smart subscription reorder
- AI influencer assistant
- WhatsApp AI integration
- Voice assistant (Gemini TTS groundwork exists)
- Smart in-store kiosk mode

---

## Final Vision

Dr. Bot is not a chatbot. It is:

- A **digital dermatologist assistant**
- A **conversion strategist**
- A **data collector**
- A **retention engine**
- A **SaaS foundation**

Built correctly, it becomes the **AI infrastructure of the entire brand**.

---

*This blueprint governs all development, configuration, and evolution of Dr. Bot within the Asper Beauty Shop platform.*
