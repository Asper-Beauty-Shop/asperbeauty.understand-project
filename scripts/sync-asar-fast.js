import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// NEW PROJECT CONFIGURATION
const SUPABASE_URL = 'https://vhgwvfedgfmcixhdyttt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZ3d2ZmVkZ2ZtY2l4aGR5dHR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzE4OTE3NiwiZXhwIjoyMDg4NzY1MTc2fQ.D51XRE2UlrFZQ4PYlizxloTi5yUSeoSDEvLEUcF8X5E';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function getTaxonomy(title, type) {
  const s = `${title} ${type}`.toLowerCase();
  
  // Filter Logic: Check if it belongs to Cosmetics, Beauty, or Supplements
  const isCosmetic = s.includes('makeup') || s.includes('lipstick') || s.includes('foundation') || s.includes('mascara') || s.includes('concealer') || s.includes('palette');
  const isBeauty = s.includes('skin') || s.includes('serum') || s.includes('cream') || s.includes('cleanser') || s.includes('shampoo') || s.includes('hair') || s.includes('mask') || s.includes('lotion');
  const isSupplement = s.includes('vitamin') || s.includes('supplement') || s.includes('capsule') || s.includes('biotic') || s.includes('collagen') || s.includes('omega');

  if (!isCosmetic && !isBeauty && !isSupplement) return null; // Reject other products

  let pillar = "Clinical Skincare";
  let secondary = "Barrier Repair";
  let icon = "icon-flask";

  if (isSupplement) {
    pillar = "Nutraceuticals & Supplements";
    secondary = "Daily Complex";
    icon = "icon-leaf";
  } else if (isCosmetic) {
    pillar = "Advanced Cosmetics";
    secondary = "Enhancement";
    icon = "icon-lotus";
  } else if (s.includes('hair') || s.includes('shampoo') || s.includes('scalp')) {
    pillar = "Dermatological Haircare";
    secondary = "Strand Repair";
    icon = "icon-shield";
  } else {
    // Specific Skincare categories
    if (s.includes('serum') || s.includes('active')) secondary = "Targeted Serums";
    else if (s.includes('cleanser') || s.includes('wash')) secondary = "Clinical Cleansers";
    else if (s.includes('spf') || s.includes('sun')) secondary = "SPF & Protection";
  }

  return { pillar, secondary, icon };
}

async function run() {
  console.log('🚀 Filtering and Syncing curated catalog...');
  
  const csvPath = path.resolve(process.cwd(), 'data/shopify-import-3.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, { columns: true, skip_empty_lines: true, relax_column_count: true });

  const curatedProducts = records.map(record => {
    const title = record.Title || record.title;
    const type = record['Type'] || '';
    if (!title) return null;

    const taxonomy = getTaxonomy(title, type);
    if (!taxonomy) return null; // Filtered out

    return {
      handle: record.Handle || record.handle,
      title: title,
      brand: record.Vendor || record.vendor || '',
      price: parseFloat(record['Variant Price']) || 0,
      image_url: record['Image Src'] || '',
      asper_category: taxonomy.pillar,
      primary_pillar: taxonomy.pillar,
      secondary_category: taxonomy.secondary,
      primary_icon_tag: taxonomy.icon,
      inventory_total: parseInt(record['Variant Inventory Qty']) || 0,
      updated_at: new Date().toISOString()
    };
  }).filter(p => p !== null);

  console.log(`✅ Filtered catalog down to ${curatedProducts.length} premium products.`);

  const CHUNK_SIZE = 100;
  for (let i = 0; i < curatedProducts.length; i += CHUNK_SIZE) {
    const chunk = curatedProducts.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'handle' });
    if (error) console.error(`❌ Error at ${i}:`, error.message);
    else process.stdout.write(`✔ Curated & Synced ${Math.min(i + CHUNK_SIZE, curatedProducts.length)} products...\r`);
  }

  console.log('\n🏁 Curated Catalog Sync Complete!');
}

run();
