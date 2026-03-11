import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Use provided credentials
const SUPABASE_URL = 'https://qqceibvalkoytafynwoc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2VpYnZhbGtveXRhZnlud29jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMzNzU5NSwiZXhwIjoyMDg1OTEzNTk1fQ.bMm74y-fjlz11_pkayGyo5ho2Mgzqfrh-ZNgPTFYxGY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function mapCategory(productType, tags, title) {
  const searchStr = `${productType} ${tags} ${title}`.toLowerCase();
  
  if (searchStr.includes('sunscreen') || searchStr.includes('spf') || searchStr.includes('sun protection')) return 'Sun Protection (SPF)';
  if (searchStr.includes('cleanser') || searchStr.includes('toner') || searchStr.includes('wash')) return 'Cleansers & Toners';
  if (searchStr.includes('serum') || searchStr.includes('active') || searchStr.includes('ampoule')) return 'Clinical Serums & Actives';
  if (searchStr.includes('moisturizer') || searchStr.includes('cream') || searchStr.includes('barrier') || searchStr.includes('hydration')) return 'Daily Hydration & Barrier';
  if (searchStr.includes('makeup') || searchStr.includes('foundation') || searchStr.includes('concealer') || searchStr.includes('lipstick') || searchStr.includes('mascara') || searchStr.includes('primer')) return 'Evening Radiance & Glamour';
  if (searchStr.includes('treatment') || searchStr.includes('mask') || searchStr.includes('peel') || searchStr.includes('spot')) return 'Targeted Treatments';
  if (searchStr.includes('hair') || searchStr.includes('shampoo') || searchStr.includes('conditioner')) return 'Hair Care';
  if (searchStr.includes('fragrance') || searchStr.includes('perfume') || searchStr.includes('cologne')) return 'Fragrance';
  if (searchStr.includes('body') || searchStr.includes('lotion') || searchStr.includes('shower') || searchStr.includes('hand')) return 'Body Care';
  
  return 'Requires_Manual_Review';
}

function mapConcern(title, type) {
  const s = `${title} ${type}`.toLowerCase();
  if (s.includes('acne') || s.includes('blemish')) return 'Concern_Acne';
  if (s.includes('age') || s.includes('wrinkle') || s.includes('firming')) return 'Concern_Aging';
  if (s.includes('bright') || s.includes('whitening') || s.includes('glow')) return 'Concern_Brightening';
  if (s.includes('dry') || s.includes('hydrate') || s.includes('moist')) return 'Concern_Hydration';
  if (s.includes('sensitive') || s.includes('soothe') || s.includes('calm')) return 'Concern_Sensitivity';
  if (s.includes('oil') || s.includes('pore') || s.includes('matte')) return 'Concern_Oiliness';
  if (s.includes('sun') || s.includes('spf')) return 'Concern_SunProtection';
  if (s.includes('pigment') || s.includes('dark spot')) return 'Concern_Pigmentation';
  return 'Concern_Hydration'; // Default
}

function mapStep(title, type) {
  const s = `${title} ${type}`.toLowerCase();
  if (s.includes('cleanser') || s.includes('wash') || s.includes('toner') || s.includes('soap')) return 'Step_1_Cleanser';
  if (s.includes('serum') || s.includes('active') || s.includes('treatment') || s.includes('ampoule') || s.includes('mask')) return 'Step_2_Treatment';
  if (s.includes('spf') || s.includes('sunscreen') || s.includes('cream') || s.includes('moisturizer') || s.includes('lotion')) return 'Step_3_Protection';
  return 'Step_2_Treatment'; // Default
}

async function run() {
  console.log('🚀 Starting Catalog Re-organization (with required fields)...');
  
  const csvPath = path.resolve(process.cwd(), 'Orgnized Products/Asper_Catalog_FINAL_READY - Copy.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });

  const products = [];
  const seenHandles = new Set();

  for (const record of records) {
    const handle = record.handle;
    if (!handle || seenHandles.has(handle)) continue;
    seenHandles.add(handle);

    const title = record.title;
    const productType = record.productType || '';
    const tags = record['tags/0'] || '';
    const price = parseFloat(record['variants/0/price']) || 0;
    const brand = record.vendor || '';
    const image_url = record['images/0/src'] || '';

    products.push({
      handle,
      title,
      brand,
      price,
      image_url,
      asper_category: mapCategory(productType, tags, title),
      primary_concern: mapConcern(title, productType),
      regimen_step: mapStep(title, productType),
      inventory_total: parseInt(record['variants/0/inventoryQuantity']) || 0,
      updated_at: new Date().toISOString()
    });
  }

  console.log(`✅ Processed ${products.length} products. Updating Supabase...`);

  const CHUNK_SIZE = 50;
  for (let i = 0; i < products.length; i += CHUNK_SIZE) {
    const chunk = products.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase
      .from('products')
      .upsert(chunk, { onConflict: 'handle' });

    if (error) {
      console.error(`❌ Error in chunk ${i / CHUNK_SIZE + 1}:`, error.message);
      // break; // Uncomment to stop on first error
    } else {
      process.stdout.write(`✔ Updated ${Math.min(i + CHUNK_SIZE, products.length)} / ${products.length} products...\r`);
    }
  }

  console.log('\n🏁 Re-organization complete!');
}

run();
