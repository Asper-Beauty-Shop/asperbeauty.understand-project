import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

dotenv.config();

// CONFIG
const SUPABASE_URL = 'https://vhgwvfedgfmcixhdyttt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function generateHeuristicData(title, type) {
  const s = `${title} ${type}`.toLowerCase();
  
  let tier_1_category = "Skincare";
  let tier_2_category = "Clinical Serums & Treatments";
  let concern_tags = [];
  let clinical_description = "Advanced dermatological formulation designed for optimal efficacy and skin compatibility. Professionally curated for the Medical Luxury collection.";
  let key_ingredients = ["Dermatologist Approved Actives"];
  let dr_sami_approved = false;

  // Tier 1 & 2 Logic
  if (s.includes('shampoo') || s.includes('hair') || s.includes('scalp')) {
    tier_1_category = "Hair & Body Care";
    tier_2_category = "Shampoos & Conditioners";
  } else if (s.includes('supplement') || s.includes('vitamin') || s.includes('capsule')) {
    tier_1_category = "Supplements & Wellness";
    tier_2_category = "Vitamins & Minerals";
  } else if (s.includes('makeup') || s.includes('foundation') || s.includes('concealer')) {
    tier_1_category = "Cosmetics";
    tier_2_category = "Face";
  }

  // Concern Logic
  if (s.includes('pigment') || s.includes('dark spot')) concern_tags.push("Pigmentation & Brightening");
  if (s.includes('age') || s.includes('wrinkle')) concern_tags.push("Anti-Aging & Renewal");
  if (s.includes('acne') || s.includes('blemish')) concern_tags.push("Acne & Blemish Control");
  
  if (concern_tags.length === 0) concern_tags.push("Barrier Repair");

  if (s.includes('clinical') || s.includes('dermatologist')) dr_sami_approved = true;

  return {
    tier_1_category,
    tier_2_category,
    concern_tags: concern_tags.slice(0, 3),
    clinical_description,
    health_specs: { key_ingredients, usage: "Apply as directed.", precautions: ["External use only."] },
    dr_sami_approved
  };
}

async function run() {
  console.log('🚀 Starting High-Speed Master Taxonomy Sync...');
  
  const csvPath = path.resolve(process.cwd(), 'data/shopify-import-3.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, { columns: true, skip_empty_lines: true, relax_column_count: true });

  const BATCH_SIZE = 100; 
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const productsToUpsert = batch.map(record => {
      const title = record.Title || record.title;
      const type = record['Type'] || '';
      if (!title) return null;

      const data = generateHeuristicData(title, type);

      return {
        handle: record.Handle || record.handle,
        title: title,
        name: title,
        brand: record.Vendor || record.vendor || '',
        price: parseFloat(record['Variant Price']) || 0,
        image_url: record['Image Src'] || '',
        tier_1_category: data.tier_1_category,
        tier_2_category: data.tier_2_category,
        concern_tags: data.concern_tags,
        clinical_description: data.clinical_description,
        health_specs: data.health_specs,
        dr_sami_approved: data.dr_sami_approved,
        inventory_total: parseInt(record['Variant Inventory Qty']) || 0,
        updated_at: new Date().toISOString()
      };
    }).filter(p => p !== null);

    const { error } = await supabase.from('products').upsert(productsToUpsert, { onConflict: 'handle' });
    if (error) console.error('Supabase Error:', error.message);
    else process.stdout.write(`✔ Synced ${Math.min(i + BATCH_SIZE, records.length)} products...\r`);
  }

  console.log('\n🏁 High-Speed Sync Complete!');
}

run();
