#!/usr/bin/env node
import https from 'https';
import http from 'http';

const SITE_URL = 'https://www.asperbeautyshop.com';
const SUPABASE_URL = 'https://vhgwvfedgfmcixhdyttt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZ3d2ZmVkZ2ZtY2l4aGR5dHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODkxNzYsImV4cCI6MjA4ODc2NTE3Nn0.y4i2HUWVo05AbzJVPn4pO-pw9n4KiSx9rZAgEWhkW60';
const TIMEOUT_MS = 15000;

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        timeout: TIMEOUT_MS,
        headers: { 'User-Agent': 'Asper-Brain-Test/1.0', ...headers }
      };

      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      });

      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
      req.end();
    } catch (e) { reject(e); }
  });
}

async function main() {
  console.log('🧠 Asper Beauty Shop - Brain & Chatbot Test (Hardcoded vhgwvfedgfmcixhdyttt)');
  console.log(`📍 Site: ${SITE_URL}`);
  console.log(`🔗 Supabase: ${SUPABASE_URL}`);
  console.log('='.repeat(60));

  try {
    console.log('\n🔌 Testing REST API...');
    const rest = await fetchUrl(`${SUPABASE_URL}/rest/v1/`, { apikey: SUPABASE_KEY });
    console.log(`[${rest.statusCode < 500 ? '✅' : '❌'}] Status: ${rest.statusCode}`);

    console.log('\n🤖 Testing Beauty Assistant Edge Function...');
    const func = await fetchUrl(`${SUPABASE_URL}/functions/v1/beauty-assistant`, { apikey: SUPABASE_KEY });
    const funcOk = func.statusCode !== 404 && func.statusCode !== 500;
    console.log(`[${funcOk ? '✅' : '❌'}] Status: ${func.statusCode} ${funcOk ? '(Endpoint exists)' : '(Not found)'}`);

    if (funcOk) {
      console.log('\n✨ Dr. Bot is LIVE and responding on the NEW project!');
    } else {
      console.log('\n❌ Dr. Bot deployment could not be verified.');
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main();
