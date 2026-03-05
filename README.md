# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/asperpharma/understand-project.git

# Step 2: Navigate to the project directory.
cd understand-project

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

**Use Claude Code**

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is an agentic coding tool from Anthropic that lets you work with Claude directly from your terminal or IDE.

Install the extension:

```sh
npm install -g @anthropic-ai/claude-code
```

Then start a session in your project directory:

```sh
cd understand-project
claude
```

Claude Code can read, edit, and create files, run terminal commands, and assist with complex multi-step coding tasks — all while keeping you in control.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Production-Ready Checklist

### Quick Deploy

Simply open [Lovable](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6) and click on Share -> Publish.

### Required Setup

⚠️ **Before workflows can run successfully, you must configure GitHub Secrets:**
- **LOVABLE_WEBHOOK_URL** (Required) - Enables file and issue sync with Lovable
- **DISCORD_WEBHOOK_URL** (Optional) - Enables deployment notifications

📖 **See [docs/GITHUB_SECRETS_SETUP.md](./docs/GITHUB_SECRETS_SETUP.md) for step-by-step instructions**

### Automated Deployment Flow

This project uses an automated deployment pipeline:

1. **Push to Main**: When code is merged to the `main` branch, Lovable automatically deploys the changes
2. **Health Check**: GitHub Actions runs a post-deployment health check after 120 seconds
3. **Verification**: The workflow pings the `/health` endpoint to verify the deployment succeeded
4. **Notifications**: Optional Discord notifications for deployment status

### GitHub Actions Secrets Setup

The sync workflows require the following secret to be configured in GitHub repository settings
(**Settings → Secrets and variables → Actions → New repository secret**):

| Secret | Required | Description |
|--------|----------|-------------|
| `LOVABLE_WEBHOOK_URL` | Optional | Webhook URL for syncing file changes and issue/PR events to Lovable. If not set, the sync steps are skipped gracefully. |
| `DISCORD_WEBHOOK_URL` | Optional | Discord webhook for deployment status notifications. |

**How to get `LOVABLE_WEBHOOK_URL`:**
1. Open your Lovable project at https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6
2. Go to **Settings → Integrations** (or **Settings → GitHub**)
3. Copy the webhook URL shown there
4. Add it as a repository secret named `LOVABLE_WEBHOOK_URL`

> If the webhook URL is not visible in the Lovable UI, contact Lovable support with project ID `657fb572-13a5-4a3e-bac9-184d39fdf7e6`.

### Deployment Documentation

For comprehensive deployment guides and best practices, see:
- [docs/GITHUB_SECRETS_SETUP.md](./docs/GITHUB_SECRETS_SETUP.md) - **START HERE**: Configure required GitHub secrets
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Quick reference for deployment flow and next steps
- [docs/DEPLOYMENT_TEMPLATE.md](./docs/DEPLOYMENT_TEMPLATE.md) - Complete deployment guide with checklists
- [APPLY_TO_MAIN_SITE.md](./APPLY_TO_MAIN_SITE.md) - Pre-deployment verification checklist

### Monitoring

After deployment, monitor:
- **Live Site**: https://asperbeautyshop-com.lovable.app/
- **GitHub Actions**: Check workflow runs for health check results
- **Lovable Dashboard**: https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6

## Can I connect a custom domain to my Lovable project?

- [ ] ✅ Development environment configured
- [ ] ✅ Database and tables created
- [ ] ✅ Third-party integrations tested (Shopify, Supabase)
- [ ] ✅ Edge functions deployed
- [ ] ⭐ **Critical:** Secrets configured correctly (see [§5](docs/PRE_LAUNCH_CHECKLIST.md#5-verify-secrets-configuration))
- [ ] ✅ Health checks passing (all return 200, not 503)
- [ ] ✅ Security review completed
- [ ] ✅ Documentation updated

## Deployment

### Quick Deployment via Lovable

For simple deployments, open [Lovable](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6) and click Share → Publish.

### Production Deployment Workflow

For production deployments with health checks and verification, follow this workflow:

```
Health Checks → Fix 503 Errors → Create PR → Deploy → DNS Setup → Verify
```

#### Step 1: Run Health Checks

Before deploying, verify all systems are operational:

```bash
# 1. Check frontend health endpoint
curl https://asperbeautyshop-com.lovable.app/health

# Expected: {"status":"ok","version":"1.0.0","checks":{"supabase":true,"shopify":true}}

# 2. Check bulk product upload health (Shopify integration)
curl https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/bulk-product-upload

# Expected: {"status":"ok","message":"Shopify secrets configured"}
# If you get 503, see "Fix 503 Errors" below

# 3. Run automated health check script
SITE_URL=https://asperbeautyshop-com.lovable.app node scripts/health-check.js
```

See [NEXT_STEPS.md](NEXT_STEPS.md) for detailed health check steps 1-5.

#### Step 2: Fix 503 Errors

If the bulk-product-upload health check returns **503 Service Unavailable**, you need to configure Shopify secrets:

```bash
# Set Shopify secrets in Supabase
supabase secrets set SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
supabase secrets set SHOPIFY_ACCESS_TOKEN=shpat_your_token_here

# Redeploy the function
supabase functions deploy bulk-product-upload

# Test again (should now return 200)
curl https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/bulk-product-upload
```

For detailed troubleshooting, see [PRE_LAUNCH_CHECKLIST.md §5](docs/PRE_LAUNCH_CHECKLIST.md#5-verify-secrets-configuration).

#### Step 3: Create Pull Request

Once health checks pass, create a PR for your changes:

```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "feat: your feature description"
git push -u origin feature/your-feature-name

# Create PR via GitHub CLI
gh pr create --base main --head feature/your-feature-name \
  --title "feat: Your Feature Title" \
  --body "Description of changes"
```

The GitHub Actions workflow (`.github/workflows/deploy-health-check.yml`) will automatically run health checks on merge to main.

#### Step 4: Deploy via Lovable

After merging to main:

1. Open [Lovable](https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6)
2. Click **Share** → **Publish**
3. Wait for deployment to complete (~2-3 minutes)
4. Verify deployment at https://asperbeautyshop-com.lovable.app

#### Step 5: DNS Setup (Optional)

To use a custom domain:

1. Navigate to **Project** → **Settings** → **Domains**
2. Click **Connect Domain**
3. Follow instructions to add DNS records
4. Wait for DNS propagation (~24-48 hours)

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

#### Step 6: Verify Production

Final verification checklist:

```bash
# Check all endpoints are responding
curl -I https://your-production-domain.com/
curl https://your-production-domain.com/health

# Run full health check suite
SITE_URL=https://your-production-domain.com node scripts/health-check.js

# Test bulk product upload with sample data
curl -X POST https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/bulk-product-upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "categorize",
    "products": [
      {
        "sku": "TEST-001",
        "name": "Moisturizing Face Cream",
        "costPrice": 15.00,
        "sellingPrice": 29.99
      }
    ]
  }'
```

### Bulk Product Upload Example

Test the bulk product upload endpoint with this sample curl command:

```bash
curl -X POST https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/bulk-product-upload \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "categorize",
    "products": [
      {
        "sku": "ASPER-CREAM-001",
        "name": "Hydrating Face Cream with Hyaluronic Acid",
        "costPrice": 15.50,
        "sellingPrice": 34.99
      },
      {
        "sku": "ASPER-SERUM-002",
        "name": "Anti-Aging Vitamin C Serum",
        "costPrice": 22.00,
        "sellingPrice": 49.99
      }
    ]
  }'
```

For more bulk product upload examples and complete payload structures, see [docs/DEPLOYMENT_TEMPLATE.md](docs/DEPLOYMENT_TEMPLATE.md).

## Deployment Documentation

- **[NEXT_STEPS.md](NEXT_STEPS.md)** - Complete deployment flow with health checks 1-5, PR process, DNS setup, and verification steps
- **[docs/DEPLOYMENT_TEMPLATE.md](docs/DEPLOYMENT_TEMPLATE.md)** - Deployment templates, environment variables, concrete bulk-product-upload sample payloads
- **[docs/PRE_LAUNCH_CHECKLIST.md](docs/PRE_LAUNCH_CHECKLIST.md)** - Pre-deployment checklist including §5 secrets configuration and POST response interpretation
- **[.github/workflows/deploy-health-check.yml](.github/workflows/deploy-health-check.yml)** - Automated health checks on deployment

## Health & Connectivity Scripts

Quickly verify that the frontend and the Beauty Assistant edge function are reachable:

| Command | What it checks |
|---------|----------------|
| `npm run health` | Frontend `/health` endpoint |
| `npm run brain` | Beauty Assistant (edge function) |
| `npm run sync:check` | Frontend + Beauty Assistant together |

```sh
# Full connectivity check
npm run sync:check
```

## Development Environment

**applyToAllProfiles** — Cursor/VS Code user setting so chosen options apply to every profile. In **User** `settings.json` (File → Preferences → Settings → Open Settings JSON), add:

```json
"workbench.settings.applyToAllProfiles": [
  "workbench.editorAssociations",
  "chat.mcp.access",
  "npm.scriptExplorerAction",
  "update.channel"
]
```

Include `update.channel` if you want the same update channel (e.g. stable) across all profiles.

**commitDirectlyWarning** — Avoid committing directly to the default branch when branch protection applies; use a feature branch and PR instead.

## Available Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run check` | Lint + typecheck |
| `npm run check:all` | Lint + typecheck + build |
| `npm run preview` | Serve production build |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Vitest watch mode |
| `npm run health` | Frontend `/health` check |
| `npm run brain` | Beauty Assistant connectivity check |
| `npm run sync:check` | Frontend + brain sync check |
| `npm run sync` | Sync Shopify product catalog to Supabase |
| `npm run sync:dry` | Sync dry-run (no writes) |
| `npm run sync:publish` | Sync + publish |
