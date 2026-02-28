# Asper Beauty Shop — Main Project Documentation

> **Single Source of Truth** for the Asper Beauty Shop e-commerce platform  
> **Live Site:** https://asperbeautyshop-com.lovable.app/  
> **Repository:** https://github.com/asperpharma/understand-project  
> **Lovable Project:** https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6

---

## Project Overview

**Asper Beauty Shop** is a full-stack e-commerce platform for an Egyptian pharmaceutical beauty brand, featuring:

- **5,000+ SKU catalog** from Shopify (lovable-project-milns.myshopify.com)
- **AI-powered Beauty Assistant** ("Brain") via Supabase Edge Functions
- **Personalized product recommendations** based on skin concerns
- **Multi-channel integration** (social media, Google Merchant Center, WhatsApp)
- **Clinical luxury design** ("Morning Spa" aesthetic)
- **Bilingual support** (English/Arabic)

---

## Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS with custom design tokens
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Routing:** React Router v6
- **State:** Zustand for global state, React Query for server state
- **Hosting:** Lovable (auto-deploy from GitHub main branch)

### Backend & Services
- **Database & Auth:** Supabase (project: `qqceibvalkoytafynwoc`)
- **AI/Brain:** Supabase Edge Functions (beauty-assistant, lab-tools)
- **E-commerce:** Shopify Storefront API (v2025-07)
- **Analytics:** (Optional) Google Analytics, Meta Pixel
- **Email:** Supabase Edge Functions with Resend/SendGrid

### Infrastructure
- **Version Control:** GitHub (asperpharma/understand-project)
- **CI/CD:** GitHub Actions + Lovable auto-deploy
- **Environment:** Lovable environment variables (see `env.main-site.example`)

---

## Key Features

### 1. Product Catalog & Shopping
- Browse 5,000+ products from Shopify
- Filter by category (Skincare, Haircare, Makeup, Mom & Baby, etc.)
- Search with real-time results
- Product detail pages with images, descriptions, variants, and pricing
- Add to cart and checkout via Shopify

### 2. AI Beauty Assistant (Brain)
- Chat widget powered by Supabase Edge Function (`beauty-assistant`)
- Personalized product recommendations
- Skin concern analysis (acne, aging, hyperpigmentation, etc.)
- Conversational UI with markdown support
- Context-aware responses based on user profile and chat history

### 3. Concierge Flow ("Find My Ritual")
- Multi-step guided flow: Analyze → Recommend → Add to Cart
- AI-driven product suggestions based on skin concerns
- Seamless transition from consultation to purchase

### 4. Lab Tools (Admin/Internal)
- Product enrichment utilities
- Bulk operations on catalog data
- Admin-only features for content management

### 5. User Accounts & Profiles
- Supabase Authentication (email/password, magic links)
- User profiles with preferences and order history
- Secure session management

### 6. Multi-Channel Integration
- **Social media:** Deep links for Instagram, WhatsApp, TikTok, etc.
- **Google Merchant Center:** Product feed synced from Shopify
- **ManyChat/Meta:** Webhook integrations for conversational commerce

---

## Project Structure

```
understand-project/
├── .github/
│   └── workflows/          # CI/CD workflows (health checks, sync to Lovable)
├── public/                 # Static assets (images, icons, fonts)
├── scripts/                # Utility scripts (health-check.js, test-brain.js)
├── src/
│   ├── components/         # React components
│   │   ├── home/          # Homepage-specific components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AIConcierge.tsx
│   │   ├── CartDrawer.tsx
│   │   └── ...
│   ├── contexts/          # React contexts (LanguageContext, etc.)
│   ├── hooks/             # Custom React hooks (useCartSync, etc.)
│   ├── integrations/      # API clients (Supabase, Shopify)
│   ├── lib/               # Utilities and helpers
│   ├── pages/             # Route pages (Index, Products, Health, etc.)
│   ├── stores/            # Zustand stores (cart, incognito mode, etc.)
│   ├── test/              # Test files
│   ├── App.tsx            # Main app component with routes
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles & CSS variables
├── supabase/
│   ├── functions/         # Edge Functions (beauty-assistant, lab-tools, etc.)
│   ├── migrations/        # Database migrations
│   └── config.toml        # Supabase project config
├── APPLY_TO_MAIN_SITE.md  # Deployment checklist
├── DESIGN_SYSTEM.md       # Design tokens & component guide
├── env.main-site.example  # Environment variable template
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind configuration (design system colors)
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite build config
└── README.md              # Generic Lovable project readme
```

---

## Environment Variables

All environment variables are managed in **Lovable Project Settings** and optionally in a local `.env` file for development.

**Required Variables:**

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_PROJECT_ID` | `qqceibvalkoytafynwoc` | Supabase project identifier |
| `VITE_SUPABASE_URL` | `https://qqceibvalkoytafynwoc.supabase.co` | Supabase API endpoint |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | (anon/public key) | Frontend authentication |
| `VITE_SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` | Shopify store |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | (storefront API token) | Shopify Storefront API access |
| `VITE_SHOPIFY_API_VERSION` | `2025-07` | Shopify API version |
| `VITE_SITE_URL` | `https://asperbeautyshop-com.lovable.app/` | Canonical site URL |
| `VITE_LOVABLE_URL` | `asperbeautyshop-com.lovable.app` | Lovable subdomain |

**See:** `env.main-site.example` for a complete template.

**Supabase Edge Function Secrets:**
- `SITE_URL` (set in Supabase Dashboard → Settings → Edge Functions → Secrets)

---

## Development Workflow

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/asperpharma/understand-project.git
   cd understand-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `env.main-site.example` to `.env`
   - Fill in real values (get keys from Lovable/Supabase/Shopify dashboards)

4. **Start dev server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

5. **Run tests:**
   ```bash
   npm test              # Run unit tests
   npm run health        # Check deployed site health
   npm run test:brain    # Test AI assistant integration
   ```

### Deployment

**Automatic Deployment:**
- Push to `main` branch → Lovable automatically builds and deploys
- Deployment URL: https://asperbeautyshop-com.lovable.app/
- Build time: ~2-3 minutes

**Manual Deployment:**
- Open [Lovable Deployments](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6) → click "Redeploy"

**Post-Deploy Verification:**
```bash
npm run health             # Automated health check
curl https://asperbeautyshop-com.lovable.app/health | jq
```

### CI/CD

GitHub Actions workflows (`.github/workflows/`):
- **deploy-health-check.yml** — Runs health check after every push to main
- **sync-file-changes-to-lovable.yml** — Syncs file changes to Lovable (optional)
- **sync-issues-prs-to-lovable.yml** — Syncs GitHub issues/PRs to Lovable (optional)

---

## Testing

### Unit Tests
```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode for development
```

### Integration Tests
```bash
npm run health        # Test deployed site & endpoints
npm run test:brain    # Test AI assistant & Supabase connectivity
```

### Manual Testing Checklist
- [ ] Homepage loads with hero, featured products, and footer
- [ ] Products page shows catalog with filters
- [ ] Product detail page displays correctly with Add to Cart
- [ ] Cart drawer opens and shows items
- [ ] Checkout redirects to Shopify
- [ ] AI Beauty Assistant widget appears and responds
- [ ] Find My Ritual flow completes (Analyze → Recommend → Cart)
- [ ] Login/signup works and redirects back to site
- [ ] `/health` endpoint returns 200 with valid JSON

---

## Key Integrations

### Supabase
- **Authentication:** Email/password, magic links
- **Database:** User profiles, chat logs, enrichment data
- **Edge Functions:** beauty-assistant, lab-tools, create-cod-order
- **Storage:** (Optional) Product images, user uploads

**Project Dashboard:** https://supabase.com/dashboard/project/qqceibvalkoytafynwoc

### Shopify
- **Store:** lovable-project-milns.myshopify.com
- **API:** Storefront API v2025-07
- **Products:** 5,000+ SKUs synced to Google Merchant Center
- **Checkout:** Hosted by Shopify

**Admin:** https://lovable-project-milns.myshopify.com/admin

### Google Merchant Center
- **Merchant ID:** 5717495012
- **Feed:** Shopify product feed
- **Usage:** Google Shopping ads, product rich results

### Social Media
- **Instagram:** Bio link, story links, shoppable posts
- **WhatsApp:** Catalog links, ManyChat bot
- **Facebook:** Shop link, Messenger bot
- **TikTok, Pinterest, YouTube:** Deep links to main site

---

## Deployment Checklist

Before going live or after major updates, follow **APPLY_TO_MAIN_SITE.md**:

1. ✅ Set all Lovable environment variables
2. ✅ Configure Supabase Auth redirect URLs
3. ✅ Set Supabase Edge Function `SITE_URL` secret
4. ✅ Update all social media platform links
5. ✅ Verify Google Merchant Center feed
6. ✅ Test all key pages (home, products, cart, checkout, health)
7. ✅ Run `npm run health` and `npm run test:brain`
8. ✅ Deploy to main branch and verify

---

## Troubleshooting

### Health check fails
- Verify environment variables in Lovable
- Check Supabase project is online
- Ensure Shopify store is accessible
- Review browser console for errors

### AI Assistant not responding
- Check Supabase Edge Function logs
- Verify `VITE_SUPABASE_PUBLISHABLE_KEY` is set
- Test with `npm run test:brain`
- Check user authentication status

### Products not loading
- Verify Shopify Storefront API token
- Check `VITE_SHOPIFY_STORE_DOMAIN` is correct
- Test Shopify API directly with GraphQL query

### Build fails
- Run `npm install` to update dependencies
- Check TypeScript errors with `npm run lint`
- Review Lovable build logs

---

## Team & Support

- **Development Team:** Asper Pharma
- **Lovable Project:** https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6
- **GitHub Repository:** https://github.com/asperpharma/understand-project
- **Design System:** See `DESIGN_SYSTEM.md`
- **Deployment Guide:** See `APPLY_TO_MAIN_SITE.md`

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Status:** ✅ Production
