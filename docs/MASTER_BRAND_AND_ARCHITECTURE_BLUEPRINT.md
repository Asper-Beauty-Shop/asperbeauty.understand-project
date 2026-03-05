# Master Brand & Architecture Blueprint
# Asper Beauty Shop — Structural DNA & "Medical Luxury" Execution Standard
# Version: 2025.01 | Status: AUTHORITATIVE NARRATIVE
# Source: Unified from Gemini strategic output + PLAN_FULL_AND_CLEAN_DESIGN + SOCIAL_AND_BRAIN_MASTER
#
# For immutable design tokens, component specs, and RTL rules → see PLAN_FULL_AND_CLEAN_DESIGN.md.
# For brain/channel/session architecture → see SOCIAL_AND_BRAIN_MASTER.md.

---

## 1. Core Brand DNA & Strategic Vision

### The Philosophy
**"Authentic Quality"** and **"The Sanctuary of Science"**.

The Asper Beauty Shop has strategically pivoted away from an intimidating, moody **"Evening Gala"** aesthetic toward a highly trusted, bright, and clinical **"Morning Spa"** environment.

### The Mission
To bridge the gap between **high-end clinical dermocosmetics** (Vichy, La Roche-Posay, Bioderma) and **accessible daily essentials** (Maybelline, My Rose) under a single, unified umbrella of absolute trust.

### The Promise
**"Curated by Pharmacists. Powered by Intelligence."**  
Every item in the 5,000+ SKU catalog is guaranteed 100% authentic, temperature-controlled, and sourced from authorized distributors.

### The UX Strategy
Completely eliminate customer decision fatigue. Replace traditional, high-friction "endless scrolling" with an **AI-driven "3-Click Solution"**:

1. **Analyze** — User selects a primary concern (e.g. Dryness).
2. **Recommend** — AI filters the live 5,000+ Shopify catalog.
3. **Regimen** — AI outputs a ready-to-buy **Digital Tray** (Cleanser → Serum → Moisturizer).

The platform acts as a **digital concierge**, not a standard retail storefront.

---

## 2. The "Morning Spa" Design System

To communicate medical authority wrapped in refined elegance, all frontend development (React 18 / Tailwind CSS) must strictly adhere to the following. **Pure white (#FFFFFF) for main backgrounds and pure black (#000000) for text are strictly forbidden** to prevent digital eye strain and to preserve the Morning Spa aesthetic.

### Clinical Luxury Color Palette

| Role | Token | Hex | Usage |
|------|--------|-----|--------|
| **Global Canvas** | `--color-ivory` | **#F8F8FF** (Soft Ivory) | Main page background; replaces stark white. |
| **Primary Action & Authority** | `--color-maroon` | **#800020** (Deep Maroon) | Primary CTAs, headers, Architectural Seal. |
| **Seal of Authenticity** | `--color-gold` | **#C5A028** (Shiny Gold) | 1px borders, active/hover ("Midas Touch"); use sparingly. |
| **Readability** | `--color-charcoal` | **#333333** (Dark Charcoal) | Body text, ingredient lists, medical data. |
| **Card / Elevated Surface** | `--color-ivory-dark` or `--card` | **#F0F0F8** (or design-system token) | Product cards rest on Soft Ivory; card surface is ivory-derived, **not** pure white. |
| **Hover / Secondary** | `--color-maroon-light` / `--color-gold-muted` | **#A0002A** / **#D4B547** | Hover states; muted gold for disabled. |

### Typographic Architecture

- **Headings (Voice of Luxury):** **Playfair Display** — elegant, editorial serif.
- **Body & UI (Voice of Science):** **Montserrat** — geometric, clean sans-serif for product data, instructions, UI text.
- **Arabic (Cultural Bridge):** **Tajawal** — mandatory for all RTL; minimum line-height **1.9** for luxurious readability.

---

## 3. UI/UX Component Rules

Every interactive element must reinforce the concept of a **pharmacist handing a premium product to a patient**.

### The Digital Tray (Product Cards)

- **Base:** Cards use an **ivory-derived surface** (e.g. `bg-ivory-dark` or design-system `--card`) on the Soft Ivory canvas — **not** pure white (#FFFFFF). Soft shadow (`shadow-sm` or design-system equivalent).
- **The Gold Stitch:** Default transparent or subtle border; on hover (desktop) or tap (mobile), a **1px Shiny Gold** border appears (`hover:border-gold` or `border-[#C5A028]`) with smooth transition (e.g. `transition-all duration-300`). This confirms authenticity.
- **RTL:** All layout uses **logical properties** only (`ms-`, `pe-`, `inset-inline-*`). Physical properties (`margin-left`, `padding-right`) are **banned** so EN/AR mirror flawlessly.

### Logos & Iconography

- **The Architectural Seal:** Stylized, symmetrical golden lotus flower in a fine gold square. Standard branding.
- **The Molecular Bloom:** Faceted, geometric petal design resembling a chemical molecule in Deep Maroon. Used **only** for "Intelligence" and clinical audit tools.
- **The Nano Collection:** Category icons (Skincare, Vitamins) — minimalist, ultra-thin line art resembling scientific diagrams.

---

## 4. AI & Omnichannel (The Intelligence Layer)

The platform is governed by a **Centralised Brain** (Gemini 2.5 Flash via Supabase Edge Functions), dynamically switching between two personas that share a **single memory state** across Website, WhatsApp, and Instagram.

### The Dual-Persona Engine

| Persona | Role | Trigger | Tone | TTS Voice |
|---------|------|---------|------|-----------|
| **Dr. Sami** | Clinical Authority | Medical conditions (acne, rosacea), ingredients, pregnancy safety | Precise, authoritative | **Puck** |
| **Ms. Zain** | Beauty Concierge | Aesthetic intent (makeup, glow routines, gifting) | Warm, editorial, enthusiastic | **Aoede** |

**Guardrail:** *"I provide wellness guidance, not medical diagnosis."*  
Default to Dr. Sami when intent is unclear. Switch seamlessly; never announce the switch. Both share continuous memory.

### Core UI/UX Capabilities

- **3-Click Solution:** Analyze → Recommend → Digital Tray (Cleanser + Serum + Moisturizer). First reply: (1) Confirm concern in one sentence. (2) Recommend one regimen. (3) Close with *"Shall I add this tray to your cart?"*
- **Ingredient Safety Shield:** UI module where users input ingredients or upload label photos. AI cross-references clinical data (pregnancy, allergies) and outputs a pharmacist-grade **Safety Grade (A–F)**.
- **AudioWaveformReplay:** Custom component for Dr. Sami / Ms. Zain synthesized voice. Deep Maroon active progress bar over muted Gold track on Soft Ivory background.
- **Pharmacist Handoff:** If the AI detects a medical emergency or critical ingredient conflict, the UI escalates to a **human agent via Gorgias** so the user feels protected.

---

## 5. References (Technical Source of Truth)

- **Design tokens, component specs, RTL, accessibility:** `docs/PLAN_FULL_AND_CLEAN_DESIGN.md`
- **Brain, channels, sessions, memory schema:** `docs/SOCIAL_AND_BRAIN_MASTER.md`
- **Data links, sync, deep links:** `docs/ASPER_WEBSITE_DATA_AND_LINKS.md`
