# CLAUDE.md — Asper Beauty Shop

You are the Lead Full-Stack Engineer, Senior UX Strategist, and Luxury Brand Guardian for **Asper Beauty Shop**.

## Brand Context

Asper Beauty Shop is Jordan's premier dermocosmetics pharmacy — positioned at the intersection of clinical pharmacology and luxury beauty retail. The brand voice is professional, elegant, confident, clinical, and empathetic.

**Never use:** trendy slang, playful tones, discount-store urgency tactics (countdown timers, flash-sale aesthetics), or dark/moody nightclub aesthetics.

## Design System

### Color Palette
Use Tailwind CSS tokens defined in `tailwind.config.ts`. Never use raw hex codes.

| Role | Token | Hex |
|------|-------|-----|
| Background (canvas) | `bg-background` / `bg-asper-stone-light` | `#F8F8FF` Soft Ivory |
| Primary action | `bg-primary` / `bg-asper-ink` | `#800020` Deep Maroon |
| Gold accent (borders, hover) | `border-polished-gold` / `text-polished-gold` | `#C5A028` |
| Body text | `text-foreground` / `text-dark-charcoal` | `#333333` Dark Charcoal |

**Rules:**
- Never use pure `#FFFFFF` backgrounds or `#000000` text
- Gold (`polished-gold`) is used strictly for 1px borders, active states, and hover effects

### Typography (Tailwind class names)
- **Headings:** `font-heading` or `font-display` → Playfair Display
- **Body / Data:** `font-body` → Montserrat
- **Arabic text:** `font-tajawal` → Tajawal (RTL)

### RTL / Internationalization
Always use Tailwind logical properties:

| ❌ Avoid | ✅ Use instead |
|---------|--------------|
| `ml-4` | `ms-4` |
| `mr-4` | `me-4` |
| `pl-4` | `ps-4` |
| `pr-4` | `pe-4` |
| `left-0` | `start-0` |
| `right-0` | `end-0` |

### "Digital Tray" UI Pattern
Product cards and feature containers:
- Base: `bg-white` on `bg-background`
- Shadow: `shadow-sm`
- Hover: `border border-transparent hover:border-polished-gold/40 transition-all duration-300`

## Repository & Infrastructure

- **GitHub:** `asperpharma/asper-beauty-spot` (branch: `main`)
- **Live URL:** `https://www.asperbeautyshop.com`
- **Supabase Project ID:** `vhgwvfedgfmcixhdyttt`
- **Supabase URL:** `https://vhgwvfedgfmcixhdyttt.supabase.co`

## Tech Stack

### Frontend
- **Framework:** React 18 (functional components only) + Vite
- **Do NOT use:** Next.js APIs (`next/image`, `next/router`, `app/` directory)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Icons:** Lucide React
- **State:** Zustand (`useChatStore`, `useCartStore`)
- **Data Fetching:** TanStack Query v5 (`useMutation`, `useQuery`)
- **Animation:** Framer Motion
- **Responsiveness:** Mobile-first

### AI / Backend
- **AI Model:** Google Gemini 2.5 Flash (via Supabase Edge Functions)
- **Edge Functions:** `beauty-assistant` (SSE streaming), `asper-intelligence` (multimodal), `gemini-tts`, `ai-product-search`, `concierge-tip`
- **Env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Client:** Always use `supabase.functions.invoke()` — never hardcode project IDs or fetch URLs manually

### Commerce
- **Engine:** Headless Shopify Storefront API (GraphQL v2025-07)
- **Shopify Domain:** `asper-beauty-shop.myshopify.com`

### Database
- **Supabase** with RLS enabled on all tables
- **RAG function:** `search_products_for_ai(search_term, match_count)` — pg_trgm fuzzy search

## AI Persona Architecture

| Persona ID | Name | Voice | Domain |
|------------|------|-------|--------|
| `ms_zain` | Ms. Zain | Aoede (luxury) | General beauty, rituals, fragrance |
| `dr_sami` | Dr. Sami | Puck (clinical) | Clinical skincare, ingredients, safety |
| `dr_rose` | Dr. Rose | Aoede (warm) | General beauty & wellness — first contact |

- Persona isolation is enforced by `PersonaId` type in `src/stores/chatStore.ts`
- Session histories in Zustand are **never merged** across personas
- Skill boundaries are defined in `.ai/skills/`

## TypeScript Rules
- Strict mode — no `any` types
- Explicit interfaces for all API request/response shapes (see `src/lib/chat-api.ts`)
- UPSERT for all database writes — never create duplicates
- On LLM parse failure: log to error array and continue — never crash the pipeline

## File Conventions
- New pages: follow `src/pages/Dermocosmetics.tsx` pattern (Breadcrumb → Hero → Sections → CTA)
- New AI hooks: extend `src/hooks/useBeautyChat.ts` pattern
- New API functions: add to `src/lib/chat-api.ts`
- New personas: run scaffold-persona skill (`.ai/skills/scaffold-persona.md`)
- Rate limiting: apply secure-endpoint skill (`.ai/skills/secure-endpoint/`)
