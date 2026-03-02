# Next Steps: Deployment Flow

## Flow at a Glance

This document outlines the deployment workflow for the Asper Beauty Shop from local development to production. Follow these steps to ensure a smooth deployment process.

```
Health Checks (1-5) → Fix 503 Errors → Create PR → DNS Setup → Verify Production
```

## Health Check Steps

### 1. Frontend Health Check

Verify the main application is responsive:

```bash
# Check the homepage
curl -I https://asperbeautyshop-com.lovable.app/

# Expected: HTTP 200
```

### 2. Health Endpoint Check

Verify the dedicated health endpoint returns system status:

```bash
# Check health endpoint
curl https://asperbeautyshop-com.lovable.app/health

# Expected response:
# {
#   "status": "ok",
#   "version": "1.0.0",
#   "checks": {
#     "supabase": true,
#     "shopify": true
#   }
# }
```

### 3. Bulk Product Upload Health Check

Verify Shopify integration secrets are configured:

```bash
# GET request to check Shopify configuration
curl -X GET https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/bulk-product-upload

# Expected when configured (HTTP 200):
# {"status":"ok","message":"Shopify secrets configured"}

# Expected when NOT configured (HTTP 503):
# {
#   "status": "unavailable",
#   "message": "Shopify secrets missing or invalid",
#   "missing": ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_ACCESS_TOKEN"],
#   "hint": "SHOPIFY_STORE_DOMAIN must be myshopify domain only (no https://)"
# }
```

**If you get HTTP 503:** Follow the instructions in [PRE_LAUNCH_CHECKLIST.md §5](docs/PRE_LAUNCH_CHECKLIST.md#5-verify-secrets-configuration) to configure Shopify secrets.

### 4. API Integration Tests

Test key API endpoints with authentication:

```bash
# Test bulk product upload (requires admin auth)
curl -X POST https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/bulk-product-upload \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN" \
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

# Expected: categorized product with assigned category and image prompt
```

See [docs/DEPLOYMENT_TEMPLATE.md](docs/DEPLOYMENT_TEMPLATE.md) for complete payload examples.

### 5. Database Connectivity

Verify Supabase database is accessible and tables are created:

```bash
# Use Supabase CLI or dashboard to verify tables exist:
# - products
# - orders
# - users
# - deployment_health_checks
# - checklist_progress

# Check via health-checks-ingest function (requires HEALTH_CHECKS_SECRET header)
curl -X POST https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/health-checks-ingest \
  -H "Content-Type: application/json" \
  -H "x-health-checks-secret: YOUR_HEALTH_CHECKS_SECRET" \
  -d '{
    "health_check": {
      "branch": "main",
      "job_name": "manual-test",
      "status": "success"
    }
  }'

# Expected (HTTP 201): {"ok":true,"health_check":{"id":123}}
```

## Fixing 503 Errors

If any health check returns HTTP 503, follow these steps:

1. **Bulk Product Upload 503**: Missing Shopify secrets
   - Go to Supabase Dashboard → Edge Functions → bulk-product-upload → Secrets
   - Add `SHOPIFY_STORE_DOMAIN` (e.g., `your-store.myshopify.com`)
   - Add `SHOPIFY_ACCESS_TOKEN` (Admin API access token)
   - See [PRE_LAUNCH_CHECKLIST.md §5](docs/PRE_LAUNCH_CHECKLIST.md#5-verify-secrets-configuration)

2. **General 503**: Service unavailable
   - Check deployment status in Lovable dashboard
   - Verify environment variables are set correctly
   - Check logs for specific error messages

## Create Pull Request

Once all health checks pass:

1. Create a feature branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   ```

3. Push to origin:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Open a PR in GitHub:
   ```bash
   gh pr create --base main --head feature/your-feature-name \
     --title "feat: Your Feature Title" \
     --body "Description of changes"
   ```

5. Wait for automated checks to pass (see `.github/workflows/deploy-health-check.yml`)

## DNS Setup

After merging to main and deploying via Lovable:

1. **Lovable Deployment**:
   - Open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
   - Click Share → Publish
   - Wait for deployment to complete

2. **Custom Domain** (Optional):
   - Navigate to Project → Settings → Domains
   - Click "Connect Domain"
   - Follow instructions to add DNS records
   - See [Lovable Docs: Custom Domain](https://docs.lovable.dev/features/custom-domain)

## Verify Production

Final verification checklist:

- [ ] Frontend loads at production URL
- [ ] Health endpoint returns 200 OK
- [ ] Bulk product upload returns 200 (not 503)
- [ ] Database queries work correctly
- [ ] Shopify integration is functional
- [ ] SSL certificate is valid
- [ ] Custom domain resolves correctly (if configured)

Run the automated health check script:

```bash
# Set your production URL
export SITE_URL=https://your-production-domain.com

# Run health check
node scripts/health-check.js
```

## Related Documentation

- [README.md](README.md) - Production-ready checklist and overview
- [docs/DEPLOYMENT_TEMPLATE.md](docs/DEPLOYMENT_TEMPLATE.md) - Deployment templates and examples
- [docs/PRE_LAUNCH_CHECKLIST.md](docs/PRE_LAUNCH_CHECKLIST.md) - §5 secrets configuration
- [.github/workflows/deploy-health-check.yml](.github/workflows/deploy-health-check.yml) - Automated health checks

## PRE_LAUNCH Checklist Reference

Before going live, ensure all items in the [PRE_LAUNCH_CHECKLIST.md §5](docs/PRE_LAUNCH_CHECKLIST.md#5-verify-secrets-configuration) are completed, including:

- Environment variables configured
- Secrets properly set
- Database migrations applied
- Third-party integrations tested
- Monitoring and logging enabled
