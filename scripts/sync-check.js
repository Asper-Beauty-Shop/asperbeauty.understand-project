#!/usr/bin/env node
/**
 * Sync check script for Asper Beauty Shop
 * Verifies Supabase and Shopify integration connectivity for catalog sync
 *
 * Usage:
 *   node scripts/sync-check.js
 *   npm run sync:check
 *
 * Exits 0 when all reachable integrations respond correctly, or when
 * credentials are not configured (CI-safe — skips gracefully).
 * Exits 1 only when a configured integration is unreachable.
 */

import https from 'https';
import http from 'http';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qqceibvalkoytafynwoc.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const SHOPIFY_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'lovable-project-milns.myshopify.com';
const SHOPIFY_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const SHOPIFY_API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-07';
const TIMEOUT_MS = 10000;

/**
 * Makes an HTTP GET request and returns response data
 */
function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || undefined,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      timeout: TIMEOUT_MS,
      headers: {
        'User-Agent': 'Asper-Sync-Check/1.0',
        ...headers,
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Check Supabase REST API is reachable
 */
async function checkSupabase() {
  console.log('\n🗄️  Checking Supabase Connectivity...');

  try {
    const url = `${SUPABASE_URL}/rest/v1/`;
    const headers = SUPABASE_KEY ? { apikey: SUPABASE_KEY } : {};
    const response = await fetchUrl(url, headers);

    // 200 = OK with key, 401 = endpoint exists but no key — both mean server is up
    const reachable = response.statusCode === 200 || response.statusCode === 401;
    console.log(`[${reachable ? '✓' : '✗'}] Supabase REST API`);
    console.log(`    URL: ${SUPABASE_URL}`);
    console.log(`    Status: ${response.statusCode}${reachable ? ' (reachable)' : ' (unreachable)'}`);

    if (!SUPABASE_KEY) {
      console.log('    ℹ️  VITE_SUPABASE_PUBLISHABLE_KEY not set — skipping auth check');
    }

    return { name: 'Supabase REST API', success: reachable };
  } catch (error) {
    console.log(`[✗] Supabase REST API`);
    console.log(`    Error: ${error.message}`);
    return { name: 'Supabase REST API', success: false, error: error.message };
  }
}

/**
 * Check Supabase Edge Functions are reachable (beauty-assistant health endpoint)
 */
async function checkSupabaseEdgeFunctions() {
  console.log('\n⚡ Checking Supabase Edge Functions...');

  try {
    const url = `${SUPABASE_URL}/functions/v1/beauty-assistant`;
    const headers = SUPABASE_KEY ? { apikey: SUPABASE_KEY } : {};
    const response = await fetchUrl(url, headers);

    // 404 means function is not deployed; 400/401/403/500 mean it exists
    const deployed = response.statusCode !== 404;
    console.log(`[${deployed ? '✓' : '✗'}] Beauty Assistant Edge Function`);
    console.log(`    URL: ${url}`);
    console.log(`    Status: ${response.statusCode} ${deployed ? '(deployed)' : '(not found)'}`);

    return { name: 'Edge Functions', success: deployed };
  } catch (error) {
    console.log(`[✗] Edge Functions`);
    console.log(`    Error: ${error.message}`);
    return { name: 'Edge Functions', success: false, error: error.message };
  }
}

/**
 * Check Shopify Storefront API is reachable
 */
async function checkShopify() {
  console.log('\n🛒 Checking Shopify Storefront API...');

  if (!SHOPIFY_TOKEN) {
    console.log('    ℹ️  VITE_SHOPIFY_STOREFRONT_TOKEN not set — skipping Shopify check');
    return { name: 'Shopify Storefront API', success: true, skipped: true };
  }

  try {
    const url = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
    // Minimal introspection query to verify API connectivity
    const body = JSON.stringify({ query: '{ shop { name } }' });
    const response = await new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
        method: 'POST',
        timeout: TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
          'User-Agent': 'Asper-Sync-Check/1.0',
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      });

      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
      req.write(body);
      req.end();
    });

    const success = response.statusCode === 200;
    console.log(`[${success ? '✓' : '✗'}] Shopify Storefront API`);
    console.log(`    Domain: ${SHOPIFY_DOMAIN}`);
    console.log(`    Status: ${response.statusCode}`);

    if (success) {
      try {
        const json = JSON.parse(response.body);
        if (json.data?.shop?.name) {
          console.log(`    Shop: ${json.data.shop.name}`);
        }
      } catch (_) { /* ignore parse errors */ }
    }

    return { name: 'Shopify Storefront API', success };
  } catch (error) {
    console.log(`[✗] Shopify Storefront API`);
    console.log(`    Error: ${error.message}`);
    return { name: 'Shopify Storefront API', success: false, error: error.message };
  }
}

/**
 * Main sync check routine
 */
async function main() {
  console.log('🔄 Asper Beauty Shop — Sync Check');
  console.log(`🗄️  Supabase: ${SUPABASE_URL}`);
  console.log(`🛒 Shopify:  ${SHOPIFY_DOMAIN}`);
  console.log('='.repeat(60));

  const checks = [];

  checks.push(await checkSupabase());
  checks.push(await checkSupabaseEdgeFunctions());
  checks.push(await checkShopify());

  // Summary
  console.log('\n' + '='.repeat(60));
  const skipped = checks.filter((c) => c.skipped).length;
  const active = checks.filter((c) => !c.skipped);
  const passed = active.filter((c) => c.success).length;
  const total = active.length;
  const allPassed = passed === total;

  console.log(`\n${allPassed ? '✅' : '❌'} Sync Check ${allPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`   ${passed}/${total} checks passed${skipped > 0 ? `, ${skipped} skipped` : ''}`);

  if (!allPassed) {
    console.log('\n⚠️  Failed checks:');
    active
      .filter((c) => !c.success)
      .forEach((c) => {
        console.log(`   - ${c.name}: ${c.error || `HTTP ${c.statusCode}`}`);
      });
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { checkSupabase, checkSupabaseEdgeFunctions, checkShopify };
