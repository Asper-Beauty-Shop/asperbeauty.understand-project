# Deployment Template & Guide

## Purpose

This template provides a comprehensive guide for deploying the Asper Beauty Shop application, including pre-deployment checks, deployment procedures, and post-deployment verification.

## Pre-Deployment Checklist

Before deploying to production, ensure all items are completed:

### Code Quality
- [ ] All tests pass locally
- [ ] Linting passes with no errors
- [ ] Build completes successfully
- [ ] No console errors or warnings
- [ ] Code review completed and approved

### Design System Compliance
- [ ] All UI changes follow [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)
- [ ] Color palette matches brand guidelines (no pure #FFF or #000)
- [ ] Typography uses approved fonts (Playfair Display, Montserrat, Tajawal)
- [ ] Spacing and layout follow clinical luxury aesthetic

### Functionality
- [ ] All new features tested manually
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness checked
- [ ] Performance impact assessed
- [ ] Accessibility standards met

### Integration Points
- [ ] Supabase connections tested
- [ ] Shopify catalog integration verified
- [ ] External API calls functional
- [ ] Environment variables configured

### Documentation
- [ ] README updated if needed
- [ ] API documentation current
- [ ] Component documentation added
- [ ] CHANGELOG updated

## Deployment Process

### Step 1: Prepare Release Branch

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create release branch (optional, for staging review)
git checkout -b release/YYYY-MM-DD-description
```

### Step 2: Final Verification

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Step 3: Merge to Main

```bash
# If using release branch, create PR to main
# Once approved, merge to main
git checkout main
git merge release/YYYY-MM-DD-description
git push origin main
```

### Step 4: Monitor Deployment

1. **Lovable Auto-Deploy**
   - Lovable automatically detects push to `main`
   - Deployment begins immediately
   - Monitor at: https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6

2. **GitHub Actions**
   - Go to repository → Actions tab
   - Watch "Deploy health check" workflow
   - Verify all steps complete successfully

## Post-Deployment Verification

### Automated Health Check

The `deploy-health-check.yml` workflow automatically:
1. Waits 120 seconds for deployment
2. Pings `https://asperbeautyshop-com.lovable.app/health`
3. Verifies 200 response
4. Sends Discord notification (if configured)

### Manual Verification Checklist

Verify the following on the live site:

#### Critical Paths
- [ ] Homepage loads correctly
- [ ] Navigation works across all pages
- [ ] Product catalog displays properly
- [ ] Search functionality works
- [ ] Cart operations function
- [ ] Checkout process completes

#### User Experience
- [ ] No visual regressions
- [ ] Animations and transitions smooth
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Loading states work

#### Performance
- [ ] Page load time acceptable (< 3s)
- [ ] No JavaScript errors in console
- [ ] Images load and display correctly
- [ ] API calls complete successfully

#### Brand & Design
- [ ] Color scheme matches brand guidelines
- [ ] Fonts load and display correctly
- [ ] Spacing and layout proper
- [ ] Clinical luxury aesthetic maintained

## Rollback Procedure

If critical issues are discovered post-deployment:

### Quick Rollback via Lovable

1. Go to Lovable project dashboard
2. Navigate to deployment history
3. Select previous stable deployment
4. Click "Redeploy" or "Rollback"

### Rollback via Git

```bash
# Identify the last good commit
git log --oneline

# Create revert commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

### Hotfix Process

For urgent fixes without full rollback:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/description

# Make minimal fix
# Test thoroughly
# Create PR with "HOTFIX" label

# After approval, merge immediately
git checkout main
git merge hotfix/description
git push origin main
```

## Environment Configuration

### Required Secrets

Ensure these are configured in GitHub repository settings:

#### Lovable Integration
- `LOVABLE_WEBHOOK_URL` - For file change synchronization
- Lovable project URL: https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6

#### Optional Notifications
- `DISCORD_WEBHOOK_URL` - For deployment notifications

### Environment Variables

Production environment variables should be configured in:
- Lovable project settings (for build-time variables)
- Supabase dashboard (for database configuration)

Key variables to verify:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Any Shopify API credentials
- External service endpoints

## Monitoring & Observability

### Health Endpoint

Implement a `/health` endpoint that returns:

```json
{
  "status": "ok",
  "timestamp": "2026-03-02T05:56:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "api": "available"
  }
}
```

### Deployment History

Track deployments in:
1. GitHub Actions workflow runs
2. Lovable deployment dashboard
3. Internal deployment log (if maintained)

### Error Monitoring

Monitor for:
- 404 errors (broken links)
- 500 errors (server issues)
- JavaScript console errors
- Failed API calls
- Performance degradation

## Best Practices

### Deployment Timing
- **Recommended**: Deploy during low-traffic periods
- **Avoid**: Peak shopping hours, major promotions
- **Coordinate**: Notify team before major deployments

### Communication
- Announce deployments in team channels
- Document changes in deployment notes
- Share rollback plan if deploying risky changes

### Testing
- Never deploy without testing
- Use staging environment when available
- Perform smoke tests after deployment

### Documentation
- Keep CHANGELOG updated
- Document breaking changes
- Update API documentation
- Record lessons learned

## Deployment Cadence

### Recommended Schedule
- **Daily**: Minor updates, bug fixes
- **Weekly**: Feature releases
- **Monthly**: Major updates, refactors

### Emergency Deployments
- Critical security fixes: Deploy immediately
- Data loss prevention: Deploy ASAP
- Minor bugs: Can wait for next scheduled deployment

## Support & Escalation

### During Deployment Issues

1. **Check Logs**
   - GitHub Actions workflow logs
   - Lovable deployment logs
   - Browser console errors

2. **Verify Services**
   - Supabase status
   - Shopify API availability
   - External dependencies

3. **Escalation Path**
   - Level 1: Developer who deployed
   - Level 2: Senior team member
   - Level 3: Project lead
   - Level 4: External support (Lovable, Supabase)

## Additional Resources

- [APPLY_TO_MAIN_SITE.md](../APPLY_TO_MAIN_SITE.md) - Main site deployment checklist
- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Design guidelines
- [MAIN_PROJECT.md](../MAIN_PROJECT.md) - Project overview and integrations
- [NEXT_STEPS.md](../NEXT_STEPS.md) - Quick deployment flow reference

---

**Last Updated**: March 2026  
**Maintained By**: Asper Beauty Shop Development Team  
**Contact**: See [MAIN_PROJECT.md](../MAIN_PROJECT.md) for team contacts
# Deployment Template

This document provides deployment templates, configuration examples, and sample payloads for the Asper Beauty Shop deployment process.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Supabase Edge Function Configuration](#supabase-edge-function-configuration)
3. [Health Check Endpoints](#health-check-endpoints)
4. [Bulk Product Upload Examples](#bulk-product-upload-examples)
5. [Deployment Workflow Commands](#deployment-workflow-commands)

---

## Environment Variables

### Required Environment Variables

Create a `.env` file in your project root (use `env.main-site.example` as a template):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Shopify Configuration (Edge Functions)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_access_token

# Lovable Configuration (Optional)
LOVABLE_API_KEY=your_lovable_api_key

# Health Checks Secret
HEALTH_CHECKS_SECRET=your_random_secret_string

# Site Configuration
SITE_URL=https://asperbeautyshop-com.lovable.app
```

### Supabase Edge Function Secrets

Set these secrets in Supabase Dashboard → Edge Functions → [Function Name] → Secrets:

```bash
# For bulk-product-upload function
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LOVABLE_API_KEY=your_lovable_api_key

# For health-checks-ingest function
HEALTH_CHECKS_SECRET=your_random_secret_string_min_32_chars
```

---

## Supabase Edge Function Configuration

### Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy bulk-product-upload
supabase functions deploy health-checks-ingest
```

### Set Function Secrets

```bash
# Set secrets for bulk-product-upload
supabase secrets set SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
supabase secrets set SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
supabase secrets set LOVABLE_API_KEY=your_api_key

# Set secrets for health-checks-ingest
supabase secrets set HEALTH_CHECKS_SECRET=your_random_secret

# List all secrets (values are hidden)
supabase secrets list
```

---

## Health Check Endpoints

### 1. Frontend Health Check

**Endpoint:** `GET https://asperbeautyshop-com.lovable.app/health`

**cURL Example:**
```bash
curl -v https://asperbeautyshop-com.lovable.app/health
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-03-02T05:52:16.285Z",
  "checks": {
    "supabase": true,
    "shopify": true
  }
}
```

### 2. Bulk Product Upload Health Check

**Endpoint:** `GET https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload`

**cURL Example:**
```bash
curl -v https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload
```

**Success Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Shopify secrets configured"
}
```

**Error Response (503 Service Unavailable):**
```json
{
  "status": "unavailable",
  "message": "Shopify secrets missing or invalid",
  "missing": ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_ACCESS_TOKEN"],
  "hint": "SHOPIFY_STORE_DOMAIN must be myshopify domain only (no https://)"
}
```

### 3. Health Checks Ingest

**Endpoint:** `POST https://YOUR_PROJECT.supabase.co/functions/v1/health-checks-ingest`

**Headers:**
- `Content-Type: application/json`
- `x-health-checks-secret: YOUR_HEALTH_CHECKS_SECRET`

**cURL Example:**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/health-checks-ingest \
  -H "Content-Type: application/json" \
  -H "x-health-checks-secret: YOUR_HEALTH_CHECKS_SECRET" \
  -d '{
    "health_check": {
      "branch": "main",
      "job_name": "post-deploy-verification",
      "status": "success",
      "run_id": "12345",
      "run_url": "https://github.com/asperpharma/understand-project/actions/runs/12345"
    }
  }'
```

**Success Response (201 Created):**
```json
{
  "ok": true,
  "health_check": {
    "id": 123
  }
}
```

---

## Bulk Product Upload Examples

### Concrete Sample Payload

This section provides real-world examples for the bulk-product-upload endpoint.

### Example 1: Categorize Products

**Endpoint:** `POST https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload`

**Headers:**
- `Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN`
- `Content-Type: application/json`

**Payload:**
```json
{
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
    },
    {
      "sku": "ASPER-SHAMPOO-003",
      "name": "Argan Oil Repair Shampoo for Damaged Hair",
      "costPrice": 8.75,
      "sellingPrice": 19.99
    },
    {
      "sku": "ASPER-PERFUME-004",
      "name": "Rose Garden Eau de Parfum Spray 50ml",
      "costPrice": 35.00,
      "sellingPrice": 79.99
    }
  ]
}
```

**cURL Example:**
```bash
# Note: Replace YOUR_SUPABASE_JWT_TOKEN with your actual JWT token (starts with "eyJ...")
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload \
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

**Expected Response:**
```json
{
  "processedProducts": [
    {
      "sku": "ASPER-CREAM-001",
      "name": "Hydrating Face Cream with Hyaluronic Acid",
      "category": "Skin Care",
      "brand": "Asper",
      "price": 34.99,
      "costPrice": 15.50,
      "imagePrompt": "Professional Hydrating Face Cream with Hyaluronic Acid product photo on white background...",
      "status": "pending"
    },
    {
      "sku": "ASPER-SERUM-002",
      "name": "Anti-Aging Vitamin C Serum",
      "category": "Skin Care",
      "brand": "Asper",
      "price": 49.99,
      "costPrice": 22.00,
      "imagePrompt": "Professional Anti-Aging Vitamin C Serum product photo on white background...",
      "status": "pending"
    }
  ]
}
```

### Example 2: Single Product Test

**Minimal test payload for quick validation:**

```json
{
  "action": "categorize",
  "products": [
    {
      "sku": "TEST-001",
      "name": "Test Product Moisturizer",
      "costPrice": 10.00,
      "sellingPrice": 25.00
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"categorize","products":[{"sku":"TEST-001","name":"Test Product Moisturizer","costPrice":10.00,"sellingPrice":25.00}]}'
```

### Example 3: Full Upload Workflow

**Step 1:** Categorize products (returns processed products)
**Step 2:** Use the "upload" action to create products in Shopify (not shown, requires processed products from step 1)

---

## Deployment Workflow Commands

### Complete Deployment Checklist

```bash
#!/bin/bash
# Asper Beauty Shop Deployment Script

echo "🚀 Starting deployment process..."

# 1. Check health endpoints
echo "📍 Step 1: Health Check"
curl -f https://asperbeautyshop-com.lovable.app/health || { echo "❌ Frontend health check failed"; exit 1; }
curl -f https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload || echo "⚠️  Bulk upload health check returned non-200 (may need secrets)"

# 2. Run automated health checks
echo "📍 Step 2: Running automated health checks"
SITE_URL=https://asperbeautyshop-com.lovable.app node scripts/health-check.js

# 3. Verify Supabase functions
echo "📍 Step 3: Verifying Supabase functions"
supabase functions list

# 4. Check deployment
echo "📍 Step 4: Deployment successful"
echo "✅ All checks passed!"
echo "🌐 Site URL: https://asperbeautyshop-com.lovable.app"
```

### Manual Verification Steps

```bash
# 1. Check frontend
open https://asperbeautyshop-com.lovable.app

# 2. Check health endpoint
curl https://asperbeautyshop-com.lovable.app/health | jq

# 3. Check bulk upload health
curl https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload | jq

# 4. Test bulk upload with sample data (requires auth token)
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload \
  -H "Authorization: Bearer $(supabase auth token)" \
  -H "Content-Type: application/json" \
  -d @sample-products.json | jq
```

---

## Troubleshooting

### Common Issues

#### 1. 503 Error on Bulk Upload Health Check

**Problem:** `GET /bulk-product-upload` returns 503

**Solution:**
1. Go to Supabase Dashboard → Edge Functions → bulk-product-upload
2. Click "Secrets" tab
3. Add missing secrets:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_ACCESS_TOKEN`
   - `LOVABLE_API_KEY`
4. Redeploy the function if needed: `supabase functions deploy bulk-product-upload`

#### 2. Unauthorized Error (401)

**Problem:** API calls return 401 Unauthorized

**Solution:**
- Verify JWT token is valid: `supabase auth token`
- Check Authorization header format: `Bearer <token>`
- Ensure user has admin privileges in the database

#### 3. CORS Errors

**Problem:** Browser shows CORS policy errors

**Solution:**
- Edge functions already include CORS headers
- Ensure OPTIONS requests are handled
- Check browser console for specific error details

---

## Response Interpretation

### Health Check Response Status

| Status Code | Meaning | Action Required |
|------------|---------|-----------------|
| 200 | OK - Service is healthy | ✅ No action needed |
| 503 | Service Unavailable - Missing configuration | ⚠️ Configure secrets |
| 401 | Unauthorized - Invalid or missing auth | ⚠️ Check authorization |
| 500 | Internal Server Error | 🔴 Check logs and debug |

### Bulk Product Upload Response

**Success Indicators:**
- `status: "ok"` in health check
- `processedProducts` array in categorize response
- Each product has `category`, `brand`, and `imagePrompt`

**Failure Indicators:**
- `status: "unavailable"` in health check
- `missing` array lists missing secrets
- `error` field in response body

See [PRE_LAUNCH_CHECKLIST.md §5](PRE_LAUNCH_CHECKLIST.md#5-verify-secrets-configuration) for detailed secrets configuration steps.

---

## Related Documentation

- [NEXT_STEPS.md](../NEXT_STEPS.md) - Deployment flow and step-by-step guide
- [PRE_LAUNCH_CHECKLIST.md](PRE_LAUNCH_CHECKLIST.md) - Pre-deployment checklist
- [README.md](../README.md) - Project overview and quick start

---

## Placeholders Reference

When using this template, replace the following placeholders:

- `YOUR_PROJECT` → Your Supabase project reference ID
- `YOUR_SUPABASE_JWT_TOKEN` → Your actual JWT token from `supabase auth token`
- `YOUR_HEALTH_CHECKS_SECRET` → Your configured health checks secret (min 32 chars)
- `YOUR_PROJECT.supabase.co` → Your actual Supabase project URL
- `your-store.myshopify.com` → Your Shopify store domain
- `shpat_xxxxxxxxxxxxx` → Your Shopify Admin API access token
- `REPLACE_WITH_PROJECT_ID` → Your Lovable project ID
