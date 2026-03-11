import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Configuration
const SUPABASE_URL = 'https://utdthjxnrva.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZHRoanhucnZhY2dqdGZ1anJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzExNzcxNCwiZXhwIjoyMDg4NjkzNzE0fQ.3hKSVSKJESrOBxqxuCS13sx-rzwPTJxjJLZBiYE-et4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function mapASARTaxonomy(title, type) {
  const s = `${title} ${type}`.toLowerCase();
  
  let primary_pillar = "Clinical Skincare";
  let secondary_category = "Targeted Serums";
  let clinical_concerns = ["Dehydration"];
  let primary_icon_tag = "icon-flask";
  let primary_icon_meaning = "Clinically Formulated & Lab Tested";

  // Pillar & Secondary Logic
  if (s.includes('shampoo') || s.includes('hair') || s.includes('scalp') || s.includes('conditioner')) {
    primary_pillar = "Dermatological Haircare";
    secondary_category = s.includes('scalp') ? "Scalp Therapy" : "Strand Repair";
    primary_icon_tag = "icon-shield";
  } else if (s.includes('supplement') || s.includes('vitamin') || s.includes('capsule') || s.includes('biotic')) {
    primary_pillar = "Nutraceuticals & Supplements";
    secondary_category = "Daily Complex";
    primary_icon_tag = "icon-leaf";
  } else if (s.includes('makeup') || s.includes('foundation') || s.includes('lipstick') || s.includes('concealer')) {
    primary_pillar = "Advanced Cosmetics";
    secondary_category = "Enhancement";
    primary_icon_tag = "icon-lotus";
  } else {
    // Default to Skincare
    if (s.includes('serum') || s.includes('active') || s.includes('ampoule')) secondary_category = "Targeted Serums";
    else if (s.includes('cleanser') || s.includes('wash') || s.includes('soap')) secondary_category = "Clinical Cleansers";
    else if (s.includes('spf') || s.includes('sunscreen') || s.includes('protection')) secondary_category = "SPF & Protection";
    else secondary_category = "Barrier Repair";
  }

  // Concern Logic
  if (s.includes('pigment') || s.includes('dark spot') || s.includes('bright')) clinical_concerns = ["Hyperpigmentation"];
  if (s.includes('age') || s.includes('wrinkle') || s.includes('firm')) clinical_concerns = ["Collagen Depletion"];
  if (s.includes('acne') || s.includes('blemish') || s.includes('pore')) clinical_concerns = ["Acne & Congestion"];
  if (s.includes('sensitive') || s.includes('red') || s.includes('inflammation')) clinical_concerns = ["Inflammation & Rosacea"];
  if (s.includes('dry') || s.includes('hydrate') || s.includes('moist')) clinical_concerns = ["Dehydration"];

  return { primary_pillar, secondary_category, clinical_concerns, primary_icon_tag };
}

async function run() {
  console.log('🚀 Starting ASAR High-Speed Heuristic Sync...');
  
  const csvPath = path.resolve(process.cwd(), 'data/shopify-import-3.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, { columns: true, skip_empty_lines: true, relax_column_count: true });

  console.log(`📦 Categorizing ${records.length} products...`);

  const productsToUpsert = records.map(record => {
    const title = record.Title || record.title;
    const type = record['Type'] || '';
    if (!title) return null;

    const taxonomy = mapASARTaxonomy(title, type);

    return {
      handle: record.Handle || record.handle,
      title: title,
      brand: record.Vendor || record.vendor || '',
      price: parseFloat(record['Variant Price']) || 0,
      image_url: record['Image Src'] || '',
      asper_category: type || 'Uncategorized',
      
      primary_pillar: taxonomy.primary_pillar,
      secondary_category: taxonomy.secondary_category,
      clinical_concerns: taxonomy.clinical_concerns,
      primary_icon_tag: taxonomy.primary_icon_tag,
      dr_sami_approved: title.toLowerCase().includes('clinical') || title.toLowerCase().includes('dermatologist'),

      inventory_total: parseInt(record['Variant Inventory Qty']) || 0,
      updated_at: new Date().toISOString()
    };
  }).filter(p => p !== null);

  console.log(`✅ Categorization complete. Uploading to Supabase (${productsToUpsert.length} products)...`);

  const CHUNK_SIZE = 100;
  for (let i = 0; i < productsToUpsert.length; i += CHUNK_SIZE) {
    const chunk = productsToUpsert.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'handle' });
    if (error) {
      console.error(`❌ Error in chunk ${i/CHUNK_SIZE}:`, error.message);
    } else {
      process.stdout.write(`✔ Synced ${Math.min(i + CHUNK_SIZE, productsToUpsert.length)} products...\r`);
    }
  }

  console.log('\n🏁 ASAR High-Speed Sync Complete!');
}

run();
