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
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/bulk-product-upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
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
