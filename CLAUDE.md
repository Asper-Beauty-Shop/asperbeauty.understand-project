# CLAUDE.md — Asper Beauty Shop

> AI assistant guide for the `asperpharma/understand-project` repository.
> Last updated: 2026-03-03.

---

## Project Overview

**Asper Beauty Shop** is a headless "Medical Luxury" e-commerce platform for beauty and dermatology products. It connects a React/TypeScript SPA to a Shopify product catalog (5,000+ SKUs) and a Supabase AI backend. The live site is deployed via Lovable at **https://asperbeautyshop-com.lovable.app/**.

- **Repo:** `asperpharma/understand-project`
- **Lovable project ID:** `657fb572-13a5-4a3e-bac9-184d39fdf7e6`
- **Supabase project:** `qqceibvalkoytafynwoc`
- **Shopify store:** `lovable-project-milns.myshopify.com` (API v2025-07)

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3.1 + TypeScript 5.8.3 |
| Build tool | Vite 7.3.1 (SWC transpiler) |
| Styling | Tailwind CSS 3.4.17 + shadcn/ui (Radix UI) |
| Routing | React Router DOM 6.30.3 |
| Server state | TanStack React Query 5.83.0 |
| Global state | Zustand 5.0.11 |
| Forms | React Hook Form 7.61.1 + Zod validation |
| Animation | Framer Motion 12.34.0 |
| Charts | Recharts 2.15.4 |
| Backend | Supabase (Postgres, Auth, Edge Functions on Deno) |
| E-commerce | Shopify Storefront API (GraphQL) |
| Deployment | Lovable (auto-deploy on push to `main`) |
| CI/CD | GitHub Actions |

---

## Repository Structure

```
understand-project/
├── src/
│   ├── components/       # 170+ React components (UI + feature)
│   ├── pages/            # 33 route-level page components
│   ├── hooks/            # 14 custom React hooks
│   ├── stores/           # 3 Zustand stores (cart, wishlist, incognito)
│   ├── contexts/         # LanguageContext (EN/AR i18n)
│   ├── integrations/     # Supabase client + auto-generated types
│   ├── lib/              # 17 utility/library modules
│   ├── assets/           # Static images, fonts, icons
│   ├── test/             # Test setup (setup.ts)
│   ├── App.tsx           # Root router + global providers
│   └── main.tsx          # React entry point
├── supabase/
│   ├── functions/        # 20 Edge Functions (Deno runtime)
│   ├── migrations/       # 20+ database migration SQL files
│   └── config.toml       # Supabase project config
├── scripts/              # Shopify sync + health-check utilities
├── .github/workflows/    # CI/CD: health-check, Lovable sync
├── docs/                 # Deployment guides, pre-launch checklist
├── public/               # Static assets served at root
├── index.html            # HTML entry point (CSP, JSON-LD, meta)
├── vite.config.ts        # Vite config (port 8080, manual chunks)
├── tailwind.config.ts    # Custom design tokens
├── tsconfig.json         # TypeScript config (path alias @/*)
├── eslint.config.js      # ESLint (TS + React hooks)
├── vitest.config.ts      # Test runner config
├── components.json       # shadcn/ui config
├── env.main-site.example # Environment variable template
└── .cursorrules          # Detailed AI developer guidelines (1000+ lines)
```

---

## Development Workflow

### Setup

```bash
npm install
cp env.main-site.example .env          # fill in real values
npm run dev                             # starts on http://localhost:8080
```

### Available Scripts

```bash
npm run dev          # Vite dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Development-mode build
npm run preview      # Preview the production build locally

npm run lint         # ESLint check
npm run lint:fix     # Auto-fix linting issues
npm run typecheck    # tsc --noEmit
npm run check        # lint + typecheck
npm run check:all    # lint + typecheck + build (full pre-push validation)

npm run test         # Vitest single run
npm run test:watch   # Vitest watch mode

npm run sync         # Sync Shopify product catalog to Supabase
npm run sync:dry     # Dry-run (no writes)
npm run sync:publish # Sync + publish
```

### Pre-Push Checklist

Always run before pushing to `main`:

```bash
npm run check:all    # must pass with zero errors
npm run test         # must pass
```

---

## Routing

All routes are defined in `src/App.tsx`. The `BeautyAssistant` chat widget is globally mounted via lazy-load and appears on every page.

| Path | Component | Notes |
|---|---|---|
| `/` | `Index` | Homepage |
| `/chat` | `Index` | Redirects to homepage with chat open |
| `/shop`, `/products` | `Shop` | Product catalog |
| `/shop/organized` | `ShopAllOrganized` | Organized product grid |
| `/product/:handle` | `ProductDetail` | Product detail page |
| `/collections` | `Collections` | All collections |
| `/collections/:slug` | `CollectionDetail` | Single collection |
| `/brands` | `Brands` | Brand listing |
| `/brands/vichy` | `BrandVichy` | Vichy brand page |
| `/best-sellers` | `BestSellers` | Top products |
| `/offers` | `Offers` | Promotions |
| `/contact` | `Contact` | Contact page |
| `/skin-concerns` | `SkinConcerns` | Dermatology-focused hub |
| `/concerns/:concernSlug` | `ConcernCollection` | Concern-filtered products |
| `/wishlist` | `Wishlist` | Saved items |
| `/auth` | `Auth` | Login / signup |
| `/account` | `Account` | User profile |
| `/philosophy` | `Philosophy` | Brand philosophy |
| `/intelligence` | `AsperIntelligence` | Analytics dashboard |
| `/health` | `Health` | Health-check endpoint (returns JSON) |
| `/admin/bulk-upload` | `BulkUpload` | CSV product upload |
| `/admin/orders` | `AdminOrders` | Order management |
| `/admin/products` | `ManageProducts` | Product management |
| `/admin/audit-logs` | `AdminAuditLogs` | Change audit trail |
| `/track-order` | `TrackOrder` | Order tracking |
| `/driver` | `DriverDashboard` | Delivery driver view |
| `/brand-intelligence` | `BrandIntelligenceDashboard` | Admin-only analytics |
| `/tracking` | redirect → `/track-order` | |
| `/shipping`, `/returns` | redirect → `/contact` | |
| `/consultation` | redirect → `/skin-concerns` | |

---

## Global Providers (src/App.tsx)

Providers wrap the app in this order (outermost first):

1. `QueryClientProvider` — React Query
2. `LanguageProvider` — EN/AR i18n context
3. `CartSyncProvider` — Syncs Zustand cart with Shopify
4. `TooltipProvider` — Radix UI tooltips
5. `BrowserRouter` — React Router
6. `BeautyAssistant` — AI chat widget (lazy-loaded, global)

The `useBrandDNAGuard()` hook runs once on mount to verify Tailwind design tokens are active.

---

## State Management

### Zustand Stores (`src/stores/`)

| Store | Purpose |
|---|---|
| `cartStore.ts` | Cart items, checkout URL, Shopify sync state |
| `wishlistStore.ts` | Wishlisted product handles |
| `incognitoStore.ts` | Incognito/guest recommendation mode flag |

### React Query

Used for all async server data fetching (products, orders, user data). The single `QueryClient` instance is created in `App.tsx`.

### Language Context (`src/contexts/LanguageContext.tsx`)

Provides `language` (`'en' | 'ar'`) and `setLanguage`. Arabic uses RTL layout — always test both directions when modifying layout components.

---

## Key Library Modules (`src/lib/`)

| File | Purpose |
|---|---|
| `shopify.ts` | Shopify Storefront GraphQL queries + cart mutations |
| `prescriptionBridge.ts` | Convert AI recommendations → cart items |
| `asperProtocol.ts` | AI persona rules and messaging guidelines |
| `categoryHierarchy.ts` | Product taxonomy tree |
| `concernMapping.ts` | Skin concern → product mapping |
| `verifyBrandDNA.ts` | Brand token compliance check (runs on app load) |
| `productImageUtils.ts` | Image optimization helpers |
| `validationSchemas.ts` | Zod schemas for all forms |
| `quizFunnelAnalytics.ts` | Conversion tracking events |

---

## Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `useAuth.ts` | Supabase Auth (sign in, sign up, session) |
| `useAdminRole.ts` | Check if current user has admin role |
| `useProducts.ts` | Fetch product catalog with React Query |
| `useProductFilter.ts` | Client-side filtering and sorting |
| `useCartSync.ts` | Keep Zustand cart in sync with Shopify |
| `useRateLimiter.ts` | Debounce/throttle API calls |
| `useGeminiTTS.ts` | Google Gemini text-to-speech integration |
| `useProductEnrichment.ts` | Call AI enrichment edge function |
| `useScrollAnimation.ts` | Intersection Observer scroll animations |

---

## Backend: Supabase Edge Functions (`supabase/functions/`)

All 20 edge functions run on the Deno runtime and are configured with `verify_jwt = false` (public endpoints with internal auth logic where needed).

| Function | Purpose |
|---|---|
| `beauty-assistant` | AI chatbot and product recommendations |
| `bulk-product-upload` | Shopify product catalog sync |
| `create-cod-order` | Cash-on-delivery order creation |
| `get-order-status` | Order tracking |
| `delete-account` | Account deletion flow |
| `enrich-products` | AI-powered product metadata enrichment |
| `scrape-product` | Web scraping utility |
| `generate-product-images` | AI image generation |
| `remove-background` | Image background removal |
| `verify-captcha` | hCaptcha verification |
| `generate-embeddings` | Vector embeddings for similarity search |
| `capture-bot-lead` | Lead capture webhook |
| `get-products-by-concern` | Skin concern-filtered product retrieval |
| `get-digital-tray` | Personalized product tray |
| `health-checks-ingest` | Health metrics ingestion |
| `log-concierge-events` | Concierge analytics |
| `log-telemetry` | General telemetry |
| `prescription-bridge` | AI output → product list |
| `shopify-best-sellers` | Top products sync |
| `tray` | Digital routine builder |
| `gemini-tts` | Google Gemini TTS proxy |
| `gorgias` (webhook) | Live chat integration |
| `manychat` (webhook) | Conversational commerce |

---

## Design System

### "Morning Spa" Aesthetic

The brand uses a warm, medical-luxury palette defined in `tailwind.config.ts`. Always use these tokens — never raw hex values.

| Token | Colour | Use |
|---|---|---|
| `asper-stone` | Warm ivory | Backgrounds, cards |
| `rose-clay` | Muted pink/terracotta | Accents, highlights |
| `burgundy` | Deep red | Primary CTAs, buttons |
| `polished-gold` | Warm gold | Premium accents, icons |
| `asper-ink` | Near-black | Body text |

### Typography

| Font | Variable | Use |
|---|---|---|
| Playfair Display | `font-playfair` | Headings, display text |
| Montserrat | `font-montserrat` | Body text, UI |
| Tajawal | `font-tajawal` | Arabic/RTL content |

### Custom Animations

- `fade-in-up` — Entrance animations
- `skeleton-breathe` — Loading skeletons
- `shimmer` — Shimmer loading effects

### Component Conventions

- All UI primitives live in `src/components/ui/` (shadcn/ui wrappers)
- Feature components go in `src/components/` (not `ui/`)
- Use `cn()` from `src/lib/utils.ts` for conditional class merging
- Prefer `tailwind-merge` over raw string concatenation for classes

---

## TypeScript Conventions

- Path alias `@/` maps to `src/` (configured in `tsconfig.json` and `vite.config.ts`)
- `strictNullChecks` is **off** — be careful with null/undefined
- Auto-generated Supabase types live in `src/integrations/supabase/types.ts` — **never edit manually**; regenerate with Supabase CLI
- Zod schemas for all form validation are in `src/lib/validationSchemas.ts`

---

## Environment Variables

Copy `env.main-site.example` to `.env`. Required variables:

```bash
VITE_SUPABASE_URL=https://qqceibvalkoytafynwoc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon key>
VITE_SUPABASE_PROJECT_ID=qqceibvalkoytafynwoc
VITE_SHOPIFY_STORE_DOMAIN=lovable-project-milns.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=<storefront token>
VITE_SHOPIFY_API_VERSION=2025-07
VITE_SITE_URL=https://asperbeautyshop-com.lovable.app/
VITE_LOVABLE_URL=asperbeautyshop-com.lovable.app
```

Never commit `.env` files. The `.gitignore` already excludes them.

---

## Testing

- **Framework:** Vitest 3.2.4
- **DOM:** jsdom
- **Matchers:** @testing-library/jest-dom (loaded in `src/test/setup.ts`)
- **Test files:** `src/**/*.{test,spec}.{ts,tsx}`

```bash
npm run test          # single run
npm run test:watch    # watch mode
```

Standard pattern for component tests:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders the expected content", () => {
    render(<MyComponent />);
    expect(screen.getByText("expected text")).toBeInTheDocument();
  });
});
```

---

## CI/CD and Deployment

### Deployment Flow

```
Feature branch → PR → Merge to main
       ↓
Lovable auto-builds and deploys
       ↓
GitHub Action: wait 120s → GET /health → expect 200
       ↓
Optional: Discord webhook notification
```

### GitHub Actions Workflows (`.github/workflows/`)

| Workflow | Trigger | Purpose |
|---|---|---|
| `deploy-health-check.yml` | Push to `main` | Verify deployment succeeded (checks `/health`) |
| `sync-file-changes-to-lovable.yml` | Push | Two-way file sync with Lovable |
| `sync-issues-prs-to-lovable.yml` | Issue/PR events | Sync GitHub issues/PRs to Lovable |

### Health Endpoint

`GET /health` (via the `Health` React page) returns JSON:

```json
{ "status": "ok", "timestamp": "...", "integrations": { ... } }
```

Verify it is `200` after any production deployment.

### Production Deployment Checklist (see `APPLY_TO_MAIN_SITE.md` for full details)

1. Configure Lovable env vars (Supabase, Shopify, site URL)
2. Add Lovable URL to Supabase Auth allowed redirect URLs
3. Set `SITE_URL` secret in Supabase Edge Functions
4. Verify social media links point to main site
5. Confirm Google Merchant Center feed is syncing
6. Smoke-test all critical routes
7. Push to `main` → Lovable deploys automatically
8. Confirm `/health` returns `200`
9. (Optional) Run Shopify catalog sync if catalog changed

---

## Internationalization (i18n)

The app is bilingual: **English** and **Arabic**. Arabic uses RTL layout.

- Language state lives in `LanguageProvider` (`src/contexts/LanguageContext.tsx`)
- Access via `useLanguage()` hook
- When modifying layout components, test both `ltr` and `rtl` directions
- The `Tajawal` font is loaded for Arabic text

---

## Admin and Protected Routes

- `/brand-intelligence` is wrapped with `<RequireAdmin>` — only accessible to admin-role users
- Admin role is checked via the `useAdminRole` hook (queries Supabase)
- Admin pages: `/admin/bulk-upload`, `/admin/orders`, `/admin/products`, `/admin/audit-logs`
- These pages do NOT use `RequireAdmin` in the router — they implement their own auth checks internally

---

## Common Gotchas

1. **Port 8080** — Dev server runs on `8080`, not the Vite default `5173`.
2. **`strictNullChecks` is off** — the TypeScript config is relaxed; don't assume null safety.
3. **Auto-generated types** — `src/integrations/supabase/types.ts` is generated. Never edit it manually; run `supabase gen types typescript` to regenerate.
4. **Lovable tagger plugin** — `lovable-tagger` in `vite.config.ts` is required for Lovable's component inspector. Do not remove it.
5. **RTL layout** — Any layout change must be tested in Arabic mode.
6. **Chunk size warning** — Vite is configured with a 1700KB chunk size warning limit. Manual chunks are already set for `vendor-react`, `vendor-ui`, and `vendor-data`.
7. **Edge Functions** — All Supabase Edge Functions have `verify_jwt = false`; auth is handled per-function. Changes to edge functions require `supabase functions deploy <name>`.
8. **Brand tokens** — `verifyBrandDNA()` runs on app load and warns in the console if custom Tailwind tokens are missing. Always use token names, not raw hex values.
9. **BeautyAssistant** — The chat widget is mounted globally (outside `<Routes>`) so it persists across navigation. It is lazy-loaded to avoid blocking the initial render.
10. **Shopify Storefront token** — This is a read-only public token. The Admin API token (for catalog sync scripts) is separate and must never be exposed client-side.

---

## Key Documentation Files

| File | Contents |
|---|---|
| `README.md` | Project overview, setup, deployment guide |
| `MAIN_PROJECT.md` | Full project vision, features, architecture |
| `DESIGN_SYSTEM.md` | Brand identity, colour palette, typography, component guidelines |
| `APPLY_TO_MAIN_SITE.md` | 9-step production deployment checklist |
| `NEXT_STEPS.md` | Deployment workflow and Discord notification setup |
| `.cursorrules` | Detailed AI developer guidelines (1000+ lines) |
| `docs/DEPLOYMENT_TEMPLATE.md` | Full deployment guide with examples |
| `docs/PRE_LAUNCH_CHECKLIST.md` | Security and configuration checks |
| `docs/ROLE_AND_MANDATE.md` | Developer role guidelines |
| `docs/COMMAND_PROTOCOL.md` | Slash command protocol (`/breakdown`, `/status`, `/pre-launch`, `/scaffold`, `/debug`) |
| `docs/PROJECT_DNA.md` | Digital flagship strategy, product organization, visual language, SaaS vision |
| `docs/DR_BOT_BLUEPRINT.md` | Dr. Bot architecture, operation rules, behavioral flows, deployment phases |
| `env.main-site.example` | Environment variable template |
