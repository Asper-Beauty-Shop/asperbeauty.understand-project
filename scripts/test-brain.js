#!/usr/bin/env node
/**
 * Brain & Beauty Assistant test script
 * Tests the AI chatbot functionality and integration
 * 
 * Usage:
 *   node scripts/test-brain.js
 *   npm run test:brain
 */

import https from 'https';
import http from 'http';

const SITE_URL = process.env.SITE_URL || 'https://asperbeautyshop-com.lovable.app';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qqceibvalkoytafynwoc.supabase.co';
const TIMEOUT_MS = 15000;

/**
 * Makes an HTTP GET request
 */
function fetchUrl(url, headers = {}) {
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
        'User-Agent': 'Asper-Brain-Test/1.0',
        ...headers
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
 * Test Supabase connectivity
 */
async function testSupabaseConnection() {
  console.log('\n🔌 Testing Supabase Connection...');
  
  try {
    const url = `${SUPABASE_URL}/rest/v1/`;
    const response = await fetchUrl(url, {
      'apikey': process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
    });
    
    const success = response.statusCode === 200 || response.statusCode === 401; // 401 is OK (means endpoint exists)
    console.log(`[${success ? '✓' : '✗'}] Supabase REST API`);
    console.log(`    URL: ${SUPABASE_URL}`);
    console.log(`    Status: ${response.statusCode}`);
    
    return { success, name: 'Supabase Connection' };
  } catch (error) {
    console.log(`[✗] Supabase REST API`);
    console.log(`    Error: ${error.message}`);
    return { success: false, name: 'Supabase Connection', error: error.message };
  }
}

/**
 * Test Beauty Assistant edge function exists
 */
async function testBeautyAssistantEndpoint() {
  console.log('\n🤖 Testing Beauty Assistant Endpoint...');
  
  try {
    // Test if the edge function endpoint exists (we expect 401/400 without auth, not 404)
    const url = `${SUPABASE_URL}/functions/v1/beauty-assistant`;
    const response = await fetchUrl(url, {
      'apikey': process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
    });
    
    // 400, 401, 403 are OK - means endpoint exists but requires auth/valid payload
    // 404 means endpoint doesn't exist
    const success = response.statusCode !== 404;
    console.log(`[${success ? '✓' : '✗'}] Beauty Assistant Edge Function`);
    console.log(`    URL: ${url}`);
    console.log(`    Status: ${response.statusCode} ${success ? '(Endpoint exists)' : '(Not found)'}`);
    
    return { success, name: 'Beauty Assistant Endpoint' };
  } catch (error) {
    console.log(`[✗] Beauty Assistant Edge Function`);
    console.log(`    Error: ${error.message}`);
    return { success: false, name: 'Beauty Assistant Endpoint', error: error.message };
  }
}

/**
 * Test that the main site has the AI Concierge component
 */
async function testConciergePresence() {
  console.log('\n💬 Testing AI Concierge Presence on Site...');
  
  try {
    const response = await fetchUrl(SITE_URL);
    
    if (response.statusCode !== 200) {
      console.log(`[✗] Site not accessible`);
      return { success: false, name: 'AI Concierge Presence' };
    }

    // Check if the page likely has the chatbot (look for common indicators in HTML)
    const hasIndicators = 
      response.body.includes('concierge') || 
      response.body.includes('assistant') ||
      response.body.includes('chat');
    
    console.log(`[${hasIndicators ? '✓' : '⚠'}] AI Concierge ${hasIndicators ? 'likely present' : 'not detected'}`);
    console.log(`    Note: Full verification requires browser test`);
    
    return { success: true, name: 'AI Concierge Presence', warning: !hasIndicators };
  } catch (error) {
    console.log(`[✗] Could not check site`);
    console.log(`    Error: ${error.message}`);
    return { success: false, name: 'AI Concierge Presence', error: error.message };
  }
}

/**
 * Main test routine
 */
async function main() {
  console.log('🧠 Asper Beauty Shop - Brain & Chatbot Test');
  console.log(`📍 Site: ${SITE_URL}`);
  console.log(`🔗 Supabase: ${SUPABASE_URL}`);
  console.log('=' .repeat(60));

  const tests = [];

  // Run tests
  tests.push(await testSupabaseConnection());
  tests.push(await testBeautyAssistantEndpoint());
  tests.push(await testConciergePresence());

  // Summary
  console.log('\n' + '=' .repeat(60));
  const passed = tests.filter(t => t.success).length;
  const total = tests.length;
  const allPassed = passed === total;
  const hasWarnings = tests.some(t => t.warning);

  console.log(`\n${allPassed ? (hasWarnings ? '⚠️' : '✅') : '❌'} Brain Test ${allPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`   ${passed}/${total} tests passed`);

  if (!allPassed) {
    console.log('\n❌ Failed tests:');
    tests.filter(t => !t.success).forEach(t => {
      console.log(`   - ${t.name}: ${t.error || 'Failed'}`);
    });
  }

  if (hasWarnings) {
    console.log('\n⚠️  Warnings:');
    tests.filter(t => t.warning).forEach(t => {
      console.log(`   - ${t.name}: Requires browser test for full verification`);
    });
  }

  console.log('\n💡 For complete chatbot testing:');
  console.log('   1. Open https://asperbeautyshop-com.lovable.app/');
  console.log('   2. Look for the AI Concierge/Beauty Assistant widget');
  console.log('   3. Send a test message like "Help me with acne"');
  console.log('   4. Verify you get a relevant AI response');

  process.exit(allPassed ? 0 : 1);
}

// Run if called directly
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { testSupabaseConnection, testBeautyAssistantEndpoint, testConciergePresence };
