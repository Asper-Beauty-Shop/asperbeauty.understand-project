# Pre-Launch Checklist

> **Important:** Replace all placeholders in this documentation with your actual values:
> - `REPLACE_WITH_PROJECT_ID` â†’ Your Lovable project ID
> - `YOUR_PROJECT` / `YOUR_SUPABASE_PROJECT` / `YOUR_PROJECT_REF` â†’ Your Supabase project reference ID
> - `YOUR_JWT_TOKEN` / `YOUR_SUPABASE_JWT_TOKEN` â†’ Your JWT token from `supabase auth token`
> - `YOUR_HEALTH_CHECKS_SECRET` â†’ Your configured health checks secret (min 32 characters)
> - `YOUR_SHOPIFY_ACCESS_TOKEN` â†’ Your Shopify Admin API access token
> - `your-store.myshopify.com` â†’ Your Shopify store domain
> - `YOUR_ANON_KEY` â†’ Your Supabase anon key

This checklist ensures all systems are configured and tested before launching the Asper Beauty Shop to production.

## Checklist Overview

- [ ] Â§1. Development Environment Setup
- [ ] Â§2. Database Configuration
- [ ] Â§3. Third-Party Integrations
- [ ] Â§4. Edge Functions Deployment
- [ ] Â§5. Verify Secrets Configuration â­
- [ ] Â§6. Health Checks and Monitoring
- [ ] Â§7. Security and Performance
- [ ] Â§8. Documentation and Handoff

---

## Â§1. Development Environment Setup

### Local Development

- [ ] Node.js (v18+) and npm installed
- [ ] Git configured with proper credentials
- [ ] Code editor set up (VS Code recommended)
- [ ] Repository cloned: `git clone https://github.com/asperpharma/understand-project`
- [ ] Dependencies installed: `npm install`
- [ ] Local dev server runs: `npm run dev`

### Environment Files

- [ ] `.env` file created from `env.main-site.example`
- [ ] All required environment variables populated
- [ ] `.env` added to `.gitignore` (verify not committed)

---

## Â§2. Database Configuration

### Supabase Setup

- [ ] Supabase project created
- [ ] Database URL and anon key obtained
- [ ] Tables created (products, orders, users, etc.)
- [ ] Row Level Security (RLS) policies configured
- [ ] Database migrations applied
- [ ] Service role key secured (never committed to repo)

### Required Tables

- [ ] `products` - Product catalog
- [ ] `orders` - Customer orders
- [ ] `users` - User authentication
- [ ] `deployment_health_checks` - Health check logs
- [ ] `checklist_progress` - Deployment progress tracking

### Test Database Access

```bash
# Verify connection with Supabase CLI
supabase db ping

# Or test with a simple query
curl https://YOUR_PROJECT.supabase.co/rest/v1/products?select=count \
  -H "apikey: YOUR_ANON_KEY"
```

---

## Â§3. Third-Party Integrations

### Shopify Integration

- [ ] Shopify store created or accessed
- [ ] Admin API access token generated
- [ ] Store domain noted (format: `your-store.myshopify.com`)
- [ ] API version confirmed (currently using 2025-01)
- [ ] Test API call successful

**Test Shopify Connection:**
```bash
curl -X GET "https://your-store.myshopify.com/admin/api/2025-01/products.json" \
  -H "X-Shopify-Access-Token: YOUR_SHOPIFY_ACCESS_TOKEN"
```

### Lovable Integration

- [ ] Lovable project created
- [ ] API key obtained (if applicable)
- [ ] Project connected to GitHub repository
- [ ] Auto-deployment configured

### Other Integrations

- [ ] Payment gateway configured (if applicable)
- [ ] Email service configured (if applicable)
- [ ] Analytics set up (if applicable)
- [ ] CDN configured (if applicable)

---

## Â§4. Edge Functions Deployment

### Supabase CLI Setup

- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] Logged in: `supabase login`
- [ ] Project linked: `supabase link --project-ref YOUR_PROJECT_REF`

### Deploy Functions

- [ ] `bulk-product-upload` deployed
- [ ] `health-checks-ingest` deployed
- [ ] `beauty-assistant` deployed (if applicable)
- [ ] All other required functions deployed

```bash
# Deploy all functions
supabase functions deploy

# Verify deployment
supabase functions list
```

### Function Testing

- [ ] Each function responds to requests
- [ ] Authentication works correctly
- [ ] Error handling tested
- [ ] Logs are accessible

---

## Â§5. Verify Secrets Configuration â­

This section is critical for a successful deployment. All secrets must be configured correctly.

### Required Secrets

Configure these secrets in Supabase Dashboard â†’ Edge Functions â†’ [Function Name] â†’ Secrets:

#### For `bulk-product-upload` Function

- [ ] `SHOPIFY_STORE_DOMAIN` - Your Shopify store domain (format: `your-store.myshopify.com`, **NO `https://`**)
- [ ] `SHOPIFY_ACCESS_TOKEN` - Shopify Admin API access token (format: `shpat_xxxxxxxxxxxxx`)
- [ ] `LOVABLE_API_KEY` - Lovable API key for image generation (if using Lovable API)

#### For `health-checks-ingest` Function

- [ ] `HEALTH_CHECKS_SECRET` - Random secret string (minimum 32 characters, use a password generator)

#### General Secrets (Auto-configured by Supabase)

- [ ] `SUPABASE_URL` - Auto-configured âœ…
- [ ] `SUPABASE_ANON_KEY` - Auto-configured âœ…
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Auto-configured âœ…

### Setting Secrets via CLI

```bash
# Set Shopify secrets
supabase secrets set SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
supabase secrets set SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Set Lovable API key
supabase secrets set LOVABLE_API_KEY=your_lovable_api_key_here

# Set health checks secret (generate a random 32+ char string)
supabase secrets set HEALTH_CHECKS_SECRET=$(openssl rand -base64 32)

# List all secrets (values are hidden for security)
supabase secrets list
```

### Setting Secrets via Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** in the sidebar
4. Click on the function name (e.g., `bulk-product-upload`)
5. Click the **Secrets** tab
6. Click **Add Secret**
7. Enter name and value
8. Click **Save**

### Verify Secrets Configuration

After setting secrets, verify they work correctly:

#### Test 1: Bulk Product Upload Health Check

```bash
curl -v https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload
```

**Expected Response (HTTP 200):**
```json
{
  "status": "ok",
  "message": "Shopify secrets configured"
}
```

**If you get HTTP 503:**
```json
{
  "status": "unavailable",
  "message": "Shopify secrets missing or invalid",
  "missing": ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_ACCESS_TOKEN"],
  "hint": "SHOPIFY_STORE_DOMAIN must be myshopify domain only (no https://)"
}
```

**Actions if 503:**
1. Verify secret names are exactly as specified (case-sensitive)
2. Check `SHOPIFY_STORE_DOMAIN` has no `https://` prefix
3. Confirm `SHOPIFY_ACCESS_TOKEN` is valid and not expired
4. Redeploy the function: `supabase functions deploy bulk-product-upload`
5. Wait 30 seconds for changes to propagate
6. Test again

#### Test 2: Health Checks Ingest

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/health-checks-ingest \
  -H "Content-Type: application/json" \
  -H "x-health-checks-secret: YOUR_CONFIGURED_SECRET" \
  -d '{
    "health_check": {
      "branch": "main",
      "job_name": "pre-launch-test",
      "status": "success"
    }
  }'
```

**Expected Response (HTTP 201):**
```json
{
  "ok": true,
  "health_check": {
    "id": 123
  }
}
```

**If you get HTTP 401:**
```json
{
  "error": "Unauthorized"
}
```

**Actions if 401:**
1. Verify `HEALTH_CHECKS_SECRET` is set in Supabase secrets
2. Confirm the header name is `x-health-checks-secret` (with dashes, all lowercase)
3. Check the secret value matches exactly (no extra spaces)
4. Redeploy function and test again

### Common Secret Configuration Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 503 on bulk-product-upload | Shopify secrets missing | Set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` |
| "invalidDomain" hint | Domain includes `https://` | Remove protocol, use only `your-store.myshopify.com` |
| 401 on health-checks-ingest | Wrong or missing secret | Set `HEALTH_CHECKS_SECRET` and use correct header |
| Secrets not taking effect | Stale deployment | Redeploy function: `supabase functions deploy <name>` |

---

## Â§6. Health Checks and Monitoring

### GitHub Actions Secrets

Configure these secrets in GitHub repository **Settings â†’ Secrets and variables â†’ Actions**:

- [ ] `LOVABLE_WEBHOOK_URL` - Webhook URL for syncing file/issue/PR events to Lovable *(optional; workflows skip gracefully if absent)*
  - **How to get it:** Open https://lovable.dev/projects/657fb572-13a5-4a3e-bac9-184d39fdf7e6 â†’ **Settings â†’ Integrations** (or **Settings â†’ GitHub**) â†’ copy the webhook URL
  - If not visible in the Lovable UI, contact Lovable support with project ID `657fb572-13a5-4a3e-bac9-184d39fdf7e6`
- [ ] `DISCORD_WEBHOOK_URL` - Discord webhook for deployment notifications *(optional)*

### Automated Health Checks

- [ ] `.github/workflows/deploy-health-check.yml` configured
- [ ] Workflow runs successfully on push to main
- [ ] Discord webhook configured (optional)
- [ ] Health check script tested: `node scripts/health-check.js`

### Manual Health Checks

Run all health checks from [NEXT_STEPS.md](../NEXT_STEPS.md):

- [ ] Frontend health check (Step 1)
- [ ] Health endpoint check (Step 2)
- [ ] Bulk product upload health check (Step 3) - **Should return 200, not 503**
- [ ] API integration tests (Step 4)
- [ ] Database connectivity (Step 5)

### Monitoring Setup

- [ ] Supabase logs accessible
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Uptime monitoring set up (optional)
- [ ] Performance monitoring configured (optional)

---

## Â§7. Security and Performance

### Security Checklist

- [ ] Environment variables not committed to Git
- [ ] Secrets stored securely in Supabase
- [ ] API keys rotated if previously exposed
- [ ] HTTPS enforced on all endpoints
- [ ] CORS properly configured
- [ ] Authentication required for admin endpoints
- [ ] Rate limiting configured (if applicable)
- [ ] Input validation in place

### Performance Checklist

- [ ] Assets optimized (images, CSS, JS)
- [ ] Lazy loading implemented
- [ ] Database queries optimized
- [ ] CDN configured (if applicable)
- [ ] Caching strategy in place
- [ ] Build optimized for production: `npm run build`

---

## Â§8. Documentation and Handoff

### Documentation Complete

- [ ] README.md updated with deployment section
- [ ] NEXT_STEPS.md created with deployment flow
- [ ] docs/DEPLOYMENT_TEMPLATE.md created with examples
- [ ] docs/PRE_LAUNCH_CHECKLIST.md (this file) completed
- [ ] API documentation up to date
- [ ] Environment variables documented

### Team Handoff

- [ ] Team trained on deployment process
- [ ] Access credentials shared securely
- [ ] Support contacts documented
- [ ] Escalation procedures defined
- [ ] Post-launch monitoring plan in place

---

## POST Response Interpretation

Understanding responses from health checks and API endpoints is critical for troubleshooting.

### Health Check Responses

#### Frontend Health (`/health`)

**Success (200 OK):**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "checks": {
    "supabase": true,
    "shopify": true
  }
}
```
**Interpretation:** All systems operational, ready for production.

**Partial Failure (200 OK with failed checks):**
```json
{
  "status": "degraded",
  "version": "1.0.0",
  "checks": {
    "supabase": true,
    "shopify": false
  }
}
```
**Interpretation:** Shopify integration down, investigate Shopify API or credentials.

#### Bulk Product Upload Health (`GET /bulk-product-upload`)

**Success (200 OK):**
```json
{
  "status": "ok",
  "message": "Shopify secrets configured"
}
```
**Interpretation:** âœ… Shopify integration ready, can proceed with deployment.

**Failure (503 Service Unavailable):**
```json
{
  "status": "unavailable",
  "message": "Shopify secrets missing or invalid",
  "missing": ["SHOPIFY_STORE_DOMAIN"],
  "hint": "SHOPIFY_STORE_DOMAIN must be myshopify domain only (no https://)"
}
```
**Interpretation:** âš ï¸ Configuration incomplete, follow Â§5 to set missing secrets.

#### Health Checks Ingest (`POST /health-checks-ingest`)

**Success (201 Created):**
```json
{
  "ok": true,
  "health_check": {
    "id": 456
  }
}
```
**Interpretation:** âœ… Health check logged successfully in database.

**Authentication Failure (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```
**Interpretation:** âš ï¸ Missing or incorrect `x-health-checks-secret` header, verify secret.

**Bad Request (400):**
```json
{
  "error": "health_check.branch and health_check.job_name required"
}
```
**Interpretation:** âš ï¸ Malformed request, check payload structure.

### Troubleshooting Decision Tree

```
Health Check Fails
â”‚
â”œâ”€ 200 OK but "status": "degraded"
â”‚  â””â”€ Check which integration failed (supabase/shopify)
â”‚     â””â”€ Test integration separately
â”‚
â”œâ”€ 503 Service Unavailable
â”‚  â””â”€ Missing configuration
â”‚     â””â”€ Go to Â§5 and configure secrets
â”‚     â””â”€ Redeploy function
â”‚     â””â”€ Test again
â”‚
â”œâ”€ 401 Unauthorized
â”‚  â””â”€ Authentication issue
â”‚     â””â”€ Verify JWT token or secret header
â”‚     â””â”€ Check secret configuration
â”‚
â”œâ”€ 500 Internal Server Error
â”‚  â””â”€ Application error
â”‚     â””â”€ Check Supabase function logs
â”‚     â””â”€ Review code for bugs
â”‚     â””â”€ Check database connectivity
â”‚
â””â”€ Timeout or Network Error
   â””â”€ Infrastructure issue
      â””â”€ Check deployment status
      â””â”€ Verify DNS/routing
      â””â”€ Contact support if needed
```

---

## Final Verification

Before marking this checklist complete and launching to production:

### Critical Path Items

- [ ] All secrets configured correctly (Â§5) â­
- [ ] Health checks return 200 OK (not 503)
- [ ] Database accessible and populated
- [ ] Shopify integration tested end-to-end
- [ ] Edge functions deployed and responding
- [ ] Frontend loads correctly
- [ ] No errors in browser console
- [ ] No errors in Supabase logs

### Launch Day Checklist

```bash
# Run this script on launch day
#!/bin/bash

echo "ðŸš€ Pre-Launch Final Verification"
echo "================================="

# 1. Health checks
echo "1. Running health checks..."
curl -f https://www.asperbeautyshop.com/health || exit 1

# 2. Bulk upload health
echo "2. Checking bulk upload (should be 200, not 503)..."
curl -f https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload || exit 1

# 3. Database
echo "3. Testing database connectivity..."
node scripts/health-check.js || exit 1

echo "âœ… All pre-launch checks passed!"
echo "ðŸŽ‰ Ready to launch!"
```

---

## Post-Launch Monitoring

After launch, monitor these metrics:

- [ ] Health endpoint status (every 5 minutes)
- [ ] Error rates in Supabase logs
- [ ] Response times
- [ ] User sign-ups and orders
- [ ] Third-party API usage and rate limits

Set up alerts for:
- Health check failures
- Error rate spikes
- Slow response times
- API rate limit warnings

---

## Support and Resources

- **Project Repository:** https://github.com/asperpharma/understand-project
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Lovable Dashboard:** https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
- **Shopify Admin:** https://your-store.myshopify.com/admin

For questions or issues:
1. Check [NEXT_STEPS.md](../NEXT_STEPS.md) for deployment flow
2. Review [DEPLOYMENT_TEMPLATE.md](DEPLOYMENT_TEMPLATE.md) for examples
3. Search Supabase logs for error messages
4. Contact development team

---

**Checklist completed on:** _____________  
**Completed by:** _____________  
**Production launch date:** _____________

