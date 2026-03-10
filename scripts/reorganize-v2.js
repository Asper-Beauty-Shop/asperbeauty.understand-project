import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Use provided credentials
const SUPABASE_URL = 'https://qqceibvalkoytafynwoc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2VpYnZhbGtveXRhZnlud29jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMzNzU5NSwiZXhwIjoyMDg1OTEzNTk1fQ.bMm74y-fjlz11_pkayGyo5ho2Mgzqfrh-ZNgPTFYxGY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function mapCategory(originalCategory, title) {
  const searchStr = `${originalCategory} ${title}`.toLowerCase();
  
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

function mapConcern(title, category) {
  const s = `${title} ${category}`.toLowerCase();
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

function mapStep(title, category) {
  const s = `${title} ${category}`.toLowerCase();
  if (s.includes('cleanser') || s.includes('wash') || s.includes('toner') || s.includes('soap')) return 'Step_1_Cleanser';
  if (s.includes('serum') || s.includes('active') || s.includes('treatment') || s.includes('ampoule') || s.includes('mask')) return 'Step_2_Treatment';
  if (s.includes('spf') || s.includes('sunscreen') || s.includes('cream') || s.includes('moisturizer') || s.includes('lotion')) return 'Step_3_Protection';
  return 'Step_2_Treatment'; // Default
}

// Manual robust splitting for malformed CSVs
function manualSplit(line) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim().replace(/^"|"$/g, ''));
  return parts;
}

async function run() {
  console.log('🚀 Starting Catalog Re-organization V2 (Manual Parser)...');
  
  const csvPath = path.resolve(process.cwd(), 'Orgnized Products/1-4000 00.csv');
  const fileStream = fs.readFileSync(csvPath, 'utf8');
  const lines = fileStream.split('\n');

  console.log(`📦 Read ${lines.length} lines from CSV.`);

  const products = [];
  const seenHandles = new Set();

  // Skip header (line 0)
  for (let i = 1; i < lines.length; i++) {
    const row = manualSplit(lines[i]);
    if (row.length < 10) continue;

    // Based on manual inspection:
    // row[0] often contains Brand,Category,Description merged if quotes failed
    // But let's look at the sample: 'Baby Vichy,Serum,"<p>...</p>'
    // It seems the delimiter might be just a comma but with bad quoting.
    
    // Attempt to extract title and other fields from the row
    // We'll search for 'InStock' or other markers to find the right columns
    const stockIdx = row.findIndex(v => v === 'InStock' || v === 'OutOfStock');
    if (stockIdx === -1) continue;

    const price = parseFloat(row[stockIdx - 2]) || 0;
    const title = row[stockIdx - 5] || '';
    const brand = row[0].split(',')[0] || '';
    const category = row[0].split(',')[1] || '';
    const image_url = row[6] || '';

    if (!title || title.length < 3) continue;

    let handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!handle || seenHandles.has(handle)) continue;
    seenHandles.add(handle);

    products.push({
      handle,
      title,
      brand,
      price,
      image_url,
      asper_category: mapCategory(category, title),
      primary_concern: mapConcern(title, category),
      regimen_step: mapStep(title, category),
      inventory_total: row[stockIdx] === 'InStock' ? 100 : 0,
      updated_at: new Date().toISOString()
    });
  }

  console.log(`✅ Processed ${products.length} unique products. Updating Supabase...`);

  if (products.length === 0) {
      console.log('❌ Manual parsing failed to find products.');
      return;
  }

  const CHUNK_SIZE = 50;
  for (let i = 0; i < products.length; i += CHUNK_SIZE) {
    const chunk = products.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase
      .from('products')
      .upsert(chunk, { onConflict: 'handle' });

    if (error) {
      console.error(`❌ Error in chunk ${i / CHUNK_SIZE + 1}:`, error.message);
    } else {
      process.stdout.write(`✔ Updated ${Math.min(i + CHUNK_SIZE, products.length)} / ${products.length} products...\r`);
    }
  }

  console.log('\n🏁 Re-organization V2 complete!');
}

run();
