const fetch = require('node-fetch');
async function verify() {
  const url = 'https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/bulk-product-upload';
  console.log('--- Checking Supabase Clinical Vault ---');
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      console.log('? Connection Flawless: Shopify & Supabase are synced.');
    } else if (res.status === 503) {
      console.log('? 503 Error: Shopify secrets are missing in Supabase.');
      console.log('Action: Add SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN to Supabase Secrets.');
    } else {
      console.log('?? Status ' + res.status + ': Unexpected response.');
    }
  } catch (e) {
    console.log('? Connection Failed: ' + e.message);
  }
}
verify();

