#!/usr/bin/env node
/**
 * Health check script for Asper Beauty Shop
 * Verifies the main site, /health endpoint, and key integrations
 * 
 * Usage:
 *   node scripts/health-check.js
 *   npm run health
 */

import https from 'https';
import http from 'http';

const SITE_URL = process.env.SITE_URL || 'https://asperbeautyshop-com.lovable.app';
const TIMEOUT_MS = 10000;

/**
 * Makes an HTTP GET request and returns response data
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      timeout: TIMEOUT_MS,
      headers: {
        'User-Agent': 'Asper-Health-Check/1.0'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
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
 * Check a single endpoint
 */
async function checkEndpoint(name, url, expectedStatus = 200) {
  try {
    const response = await fetchUrl(url);
    const success = response.statusCode === expectedStatus;
    
    console.log(`[${success ? '✓' : '✗'}] ${name}`);
    console.log(`    URL: ${url}`);
    console.log(`    Status: ${response.statusCode} ${success ? '(OK)' : `(Expected ${expectedStatus})`}`);
    
    if (!success) {
      console.log(`    Body preview: ${response.body.substring(0, 200)}`);
    }
    
    return { name, url, success, statusCode: response.statusCode };
  } catch (error) {
    console.log(`[✗] ${name}`);
    console.log(`    URL: ${url}`);
    console.log(`    Error: ${error.message}`);
    return { name, url, success: false, error: error.message };
  }
}

/**
 * Check health endpoint and parse JSON response
 */
async function checkHealthEndpoint() {
  const url = `${SITE_URL}/health`;
  console.log('\n🏥 Checking Health Endpoint...');
  
  try {
    const response = await fetchUrl(url);
    
    if (response.statusCode !== 200) {
      console.log(`[✗] Health endpoint`);
      console.log(`    Status: ${response.statusCode}`);
      return { success: false, statusCode: response.statusCode };
    }

    let healthData;
    try {
      healthData = JSON.parse(response.body);
    } catch (e) {
      console.log(`[✗] Health endpoint - Invalid JSON`);
      return { success: false, error: 'Invalid JSON response' };
    }

    console.log(`[✓] Health endpoint`);
    console.log(`    Status: ${healthData.status}`);
    console.log(`    Version: ${healthData.version}`);
    console.log(`    Supabase: ${healthData.checks?.supabase ? '✓' : '✗'}`);
    console.log(`    Shopify: ${healthData.checks?.shopify ? '✓' : '✗'}`);

    return {
      success: healthData.status === 'ok',
      data: healthData
    };
  } catch (error) {
    console.log(`[✗] Health endpoint`);
    console.log(`    Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main health check routine
 */
async function main() {
  console.log('🔍 Asper Beauty Shop - Health Check');
  console.log(`📍 Site: ${SITE_URL}`);
  console.log(`⏱️  Timeout: ${TIMEOUT_MS}ms`);
  console.log('=' .repeat(60));

  const checks = [];

  // Check main site homepage
  console.log('\n🏠 Checking Main Site...');
  checks.push(await checkEndpoint('Homepage', SITE_URL, 200));

  // Check health endpoint with detailed parsing
  const healthCheck = await checkHealthEndpoint();
  checks.push({ name: 'Health Endpoint', success: healthCheck.success });

  // Check products page
  console.log('\n🛍️  Checking Products Page...');
  checks.push(await checkEndpoint('Products', `${SITE_URL}/products`, 200));

  // Summary
  console.log('\n' + '=' .repeat(60));
  const passed = checks.filter(c => c.success).length;
  const total = checks.length;
  const allPassed = passed === total;

  console.log(`\n${allPassed ? '✅' : '❌'} Health Check ${allPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`   ${passed}/${total} checks passed`);

  if (!allPassed) {
    console.log('\n⚠️  Failed checks:');
    checks.filter(c => !c.success).forEach(c => {
      console.log(`   - ${c.name}: ${c.error || `HTTP ${c.statusCode}`}`);
    });
  }

  process.exit(allPassed ? 0 : 1);
}

// Run if called directly
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { checkEndpoint, checkHealthEndpoint };
