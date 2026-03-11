import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const SUPABASE_URL = 'https://utdthjxnrva.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZHRoanhucnZhY2dqdGZ1anJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzExNzcxNCwiZXhwIjoyMDg4NjkzNzE0fQ.3hKSVSKJESrOBxqxuCS13sx-rzwPTJxjJLZBiYE-et4';
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Use 'gemini-pro' as a fallback
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const ASAR_PROMPT = `
[SYSTEM COMMAND: ASAR CLINICAL TAXONOMY ENGINE]
ROLE: Lead Clinical Data Architect.
MANDATE: Categorize raw product data into "Premium Pharmacy" taxonomy.

APPROVED TAXONOMY MATRIX:
1. Pillars: ["Clinical Skincare", "Nutraceuticals & Supplements", "Advanced Cosmetics", "Dermatological Haircare"]
2. Secondary:
   - Skincare: ["Targeted Serums", "Barrier Repair", "Clinical Cleansers", "SPF & Protection"]
   - Nutraceuticals: ["Cellular Health", "Skin & Hair Vitality", "Daily Complex", "Digestive Biotics"]
   - Cosmetics: ["Mineral Complexion", "Enhancement", "Lip Treatment"]
   - Haircare: ["Scalp Therapy", "Follicle Stimulation", "Strand Repair"]
3. Concerns: ["Hyperpigmentation", "Collagen Depletion", "Acne & Congestion", "Inflammation & Rosacea", "Dehydration", "Micronutrient Deficiency", "Oxidative Stress"]

BRAND ICON MATRIX:
1. Clinical Lab (icon-flask): Synthetic actives, peptides.
2. Botanical Purity (icon-leaf): Natural, organic.
3. Derma-Shield (icon-shield): Doctor created, hypoallergenic.
4. Morning Spa (icon-lotus): Wellness, ritual.

INPUT: Product Name: {TITLE}, Brand: {BRAND}

RETURN ONLY JSON:
{
  "primary_pillar": "string",
  "secondary_category": "string",
  "clinical_concerns": ["string"],
  "key_actives": ["string"],
  "dr_sami_approved": boolean,
  "primary_icon_tag": "string",
  "secondary_icon_tag": "string"
}
`;

async function getAICategorization(title, brand) {
  try {
    const prompt = ASAR_PROMPT.replace('{TITLE}', title).replace('{BRAND}', brand);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error(`AI Error for ${title}:`, e.message);
    return null;
  }
}

async function run() {
  console.log('🚀 Starting ASAR V3 AI-Powered Sync (Gemini-Pro Fallback)...');
  
  const csvPath = path.resolve(process.cwd(), 'data/shopify-import-3.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    return;
  }

  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, { columns: true, skip_empty_lines: true, relax_column_count: true });

  console.log(`📦 Processing ${records.length} products with AI...`);

  const CHUNK_SIZE = 5;
  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);
    const productsToUpsert = [];

    for (const record of chunk) {
      const title = record.Title || record.title;
      const brand = record.Vendor || record.vendor || '';
      
      if (!title) continue;

      console.log(`🧠 AI Analyzing (${i + productsToUpsert.length + 1}/${records.length}): ${title.substring(0, 30)}...`);
      const aiData = await getAICategorization(title, brand);

      if (aiData) {
        productsToUpsert.push({
          handle: record.Handle || record.handle,
          title: title,
          brand: brand,
          price: parseFloat(record['Variant Price']) || 0,
          image_url: record['Image Src'] || '',
          asper_category: record['Type'] || 'Uncategorized',
          
          primary_pillar: aiData.primary_pillar,
          secondary_category: aiData.secondary_category,
          clinical_concerns: aiData.clinical_concerns,
          key_actives: aiData.key_actives,
          dr_sami_approved: aiData.dr_sami_approved,
          primary_icon_tag: aiData.primary_icon_tag,
          secondary_icon_tag: aiData.secondary_icon_tag,

          inventory_total: parseInt(record['Variant Inventory Qty']) || 0,
          updated_at: new Date().toISOString()
        });
      }
    }

    if (productsToUpsert.length > 0) {
      const { error } = await supabase.from('products').upsert(productsToUpsert, { onConflict: 'handle' });
      if (error) console.error('Supabase Error:', error.message);
      else console.log(`✔ Synced ${i + chunk.length} products`);
    }
  }

  console.log('🏁 ASAR V3 Sync Complete!');
}

run();
