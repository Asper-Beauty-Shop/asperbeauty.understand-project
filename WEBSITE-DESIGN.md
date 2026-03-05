# Website Design — Asper Beauty Shop

Design handoff for website design work. Run **SNC** before design sessions: `npm run sync`.

---

## Stack & URLs

| Item | Value |
|------|--------|
| **Site** | https://www.asperbeautyshop.com |
| **Frontend** | Vite, TypeScript, React |
| **UI** | shadcn-ui, Tailwind CSS |
| **Fonts** | Google Fonts: Playfair Display, Montserrat, Great Vibes, Tajawal (Arabic) |
| **Health** | `npm run health` \| **Brain** | `npm run brain` \| **Sync** | `npm run sync` |

See [README.md](README.md) for full scripts and SNC.

---

## Design Identity

- **Clinical-luxury:** Pharmacist-curated, authentic, precise, never pushy.
- **Dual voice:** Dr. Sami (science/safety) + Ms. Zain (luxury); single AI persona (Dr. Bot).
- **Bilingual:** English + Arabic (RTL); respect local dialects.
- **Trust:** Seal of Authenticity, JFDA, Gold Standard; use in trust badges and copy.

---

## Design Tokens

### Where they live

- **CSS variables (light/dark):** `src/index.css` — `:root` and `.dark`
- **Tailwind theme:** `tailwind.config.ts` — colors, fonts, radius, keyframes

### Palette (Quiet Luxury)

| Token | Hex / use |
|-------|-----------|
| **Cream** | `#F3E5DC` — global background |
| **Gold** | `#D4AF37` — accents, borders, ring |
| **Burgundy / Maroon** | `#4A0E19` — header, footer, primary surfaces |
| **Warm brown** | `#2C1A1D` — text |
| **Legacy** | `asper.merlot`, `asper.gold`, `maroon`, `soft-ivory`, `shiny-gold`, `dark-charcoal` in Tailwind |

### Typography

- **Display:** Playfair Display (serif)
- **Body:** Montserrat, Inter
- **Script:** Great Vibes
- **Arabic / RTL:** Tajawal — applied when `dir="rtl"` (see `LanguageContext`)

### Radius & motion

- `--radius: 0.5rem`; Tailwind: `rounded-lg`, `rounded-md`, `rounded-sm`
- Keyframes: `fade-in-up`, `fade-up`, `fade-in`, `shimmer`, `spin-slow`
- Utility classes: `.luxury-container`, `.luxury-heading`, `.luxury-subheading`, `.luxury-script`, `.luxury-divider`, `.gold-accent-line*`, `.section-gold-top`

### Gradients

- `celestial-gradient`: deep burgundy vertical
- `gold-shimmer`: gold highlight

---

## Component Map

| Area | Path | Notes |
|------|------|--------|
| **Primitives** | `src/components/ui/` | shadcn: button, card, input, dialog, sheet, etc. |
| **Brand** | `src/components/brand/` | AsperLogo, ClinicalIcons, TrustBadges, SocialLinks, CategoryIcons |
| **Home** | `src/components/home/` | Hero, SearchBar, BrandStory, VIPConcierge, PharmacistPicks, PromoBanner, etc. |
| **Chat / Dr. Bot** | `src/components/BeautyAssistant.tsx`, `chat/` | Concierge UI, DigitalTray, ChatProductCard |
| **Product** | `src/components/` | ProductCard, ProductGrid, ProductCatalog, LuxuryProductCard, GlassGoldProductCard, SafetyBadges |
| **Layout** | `src/components/` | Header, Footer, MegaMenu, MobileNav, MobileBottomNav |
| **Concierge entry** | — | Dispatch `open-beauty-assistant` or use Consult / concierge CTAs |

Extend existing primitives and brand components; add new ones only when necessary (see project rules).

---

## RTL & i18n

- **Context:** `src/contexts/LanguageContext.tsx` — `Language` = `"en" | "ar"`, translations object.
- **Direction:** Set `dir="rtl"` on document/html when language is Arabic; `index.css` applies `font-arabic` and RTL heading fonts.
- **Copy:** Add strings to the context translations; keep Arabic culturally appropriate.

---

## Dr. Bot / Beauty Assistant

- **Persona & copy:** `supabase/functions/beauty-assistant/index.ts` — `buildSystemPrompt()`.
- **Frontend:** `BeautyAssistant` (lazy in `App.tsx`), chat components in `src/components/chat/`.
- **Entry points:** "Consult", "Talk to Dr. Bot", or any CTA that should open the concierge → trigger `open-beauty-assistant` or open the same UI.

---

## Key Files for Design Changes

| Goal | File(s) |
|------|--------|
| Global colors, type, layout base | `src/index.css`, `tailwind.config.ts` |
| Brand colors & components | `src/components/brand/*`, Tailwind `asper.*` |
| Page layout / shell | `src/App.tsx`, `src/pages/Index.tsx`, Header, Footer |
| Homepage sections | `src/components/home/*`, `src/pages/Index.tsx` |
| Product cards & grids | `src/components/ProductCard.tsx`, LuxuryProductCard, GlassGoldProductCard, ProductGrid |
| Chat/concierge UI | `src/components/BeautyAssistant.tsx`, `src/components/chat/*` |

---

## Pre–design checklist

1. **SNC:** `npm run sync` (frontend + brain OK).
2. **Docs:** README.md (scripts, SNC), PUSH-BLOCKER.md (branch/PR), CURSOR-SETTINGS-FIX.md if using Cursor settings.
3. **Figma → code:** Use Code Connect skill when mapping Figma components to repo (Figma URL with `node-id`).

---

*Last updated for website design handoff. SNC and scripts: see README.*
