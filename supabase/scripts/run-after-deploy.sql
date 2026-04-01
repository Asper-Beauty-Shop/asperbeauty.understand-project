-- ============================================================
-- Asper Beauty Shop — Post-Deploy Operations
-- Run these in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vhgwvfedgfmcixhdyttt/sql
-- ============================================================


-- ============================================================
-- STEP 1: List Cloudflare Pages projects (to find the one to delete)
-- Replace YOUR_CF_API_TOKEN with a valid Cloudflare API token
-- that has Pages:Edit permission.
-- ============================================================
SELECT net.http_get(
  url := 'https://api.cloudflare.com/client/v4/accounts/1b07d13d6b4443176934e16389de03fa/pages/projects',
  headers := jsonb_build_object(
    'Authorization', 'Bearer YOUR_CF_API_TOKEN',
    'Content-Type', 'application/json'
  )
) AS list_cf_pages_request_id;

-- Wait ~2 seconds then run this to see the response:
SELECT id, status_code, content::text
FROM net._http_response
ORDER BY created DESC
LIMIT 3;


-- ============================================================
-- STEP 2: Delete the conflicting Cloudflare Pages project
-- Replace PROJECT_NAME with the name from step 1 output
-- (look for the project serving "My SaaS")
-- ============================================================
SELECT net.http_delete(
  url := 'https://api.cloudflare.com/client/v4/accounts/1b07d13d6b4443176934e16389de03fa/pages/projects/PROJECT_NAME',
  headers := jsonb_build_object(
    'Authorization', 'Bearer YOUR_CF_API_TOKEN',
    'Content-Type', 'application/json'
  )
) AS delete_cf_pages_request_id;

-- Check deletion result:
SELECT id, status_code, content::text
FROM net._http_response
ORDER BY created DESC
LIMIT 1;


-- ============================================================
-- STEP 3: Verify Telegram webhook is set
-- ============================================================
SELECT net.http_get(
  url := 'https://api.telegram.org/bot' || decrypted_secret || '/getWebhookInfo'
) AS webhook_check_id
FROM vault.decrypted_secrets
WHERE name = 'TELEGRAM_BOT_TOKEN'
LIMIT 1;

-- Check result:
SELECT id, status_code, content::text
FROM net._http_response
ORDER BY created DESC
LIMIT 1;


-- ============================================================
-- STEP 4: Trigger Shopify catalog sync
-- ============================================================
SELECT net.http_post(
  url := 'https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/sync-shopify-catalog',
  headers := jsonb_build_object(
    'Authorization', 'Bearer ' || current_setting('app.service_role_key', true),
    'Content-Type', 'application/json'
  ),
  body := '{"trigger":"sql-manual"}'::jsonb
) AS sync_request_id;

-- If the above fails (service role key not in settings), use the anon key version:
-- The sync function should also accept anon key if not locked down.
-- Alternatively, go to: https://supabase.com/dashboard/project/vhgwvfedgfmcixhdyttt/functions
-- and invoke sync-shopify-catalog from the dashboard.


-- ============================================================
-- STEP 5: Check product count after sync
-- ============================================================
SELECT
  COUNT(*) AS total_products,
  COUNT(*) FILTER (WHERE available = true) AS available_products,
  COUNT(DISTINCT asper_category) AS categories,
  MAX(updated_at) AS last_updated
FROM products;
