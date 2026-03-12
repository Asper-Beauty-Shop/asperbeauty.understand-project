import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ASAR BEAUTY SHOP - AI Data Enrichment Pipeline (Fixed Model)
 */

// 1. Infrastructure Config
const SUPABASE_URL = 'https://vhgwvfedgfmcixhdyttt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 2. Structured Output Schema
const enrichmentSchema = {
  type: SchemaType.OBJECT,
  properties: {
    clinical_description: { 
      type: SchemaType.STRING,
      description: "A professional, medically accurate 2-sentence description focusing on efficacy."
    },
    health_specs: {
      type: SchemaType.OBJECT,
      properties: {
        key_ingredients: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "List of active ingredients only"
        },
        usage: { type: SchemaType.STRING, description: "Professional application protocol" },
        precautions: { 
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "Contraindications or warnings"
        },
        ph_level: { type: SchemaType.STRING, description: "e.g., 5.5 (if applicable, else null)", nullable: true }
      },
      required: ["key_ingredients", "usage", "precautions"]
    },
    dr_sami_approved_badge: { type: SchemaType.BOOLEAN, description: "True if clinical efficacy is clear" }
  },
  required: ["clinical_description", "health_specs", "dr_sami_approved_badge"],
};

// 3. Initialize AI Model (Fixing model ID to gemini-1.5-flash-latest)
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: enrichmentSchema,
  }
});

async function enrichProduct(title, brand) {
  try {
    const prompt = `Generate clinical metadata for: ${title} by ${brand}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (e) {
    console.error(`AI Error for ${title}:`, e.message);
    return null;
  }
}

async function run() {
  console.log('🚀 Starting ASAR AI Enrichment (Stable Mode)...');
  
  const csvPath = path.resolve(process.cwd(), 'data/shopify-import-3.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, { columns: true, skip_empty_lines: true, relax_column_count: true });

  console.log(`📦 Processing ${records.length} products...`);

  const BATCH_SIZE = 5; 
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const enrichedBatch = [];

    for (const record of batch) {
      const title = record.Title || record.title;
      const brand = record.Vendor || record.vendor || '';
      if (!title) continue;

      console.log(`🧠 Taxonomizing: ${title.substring(0, 30)}...`);
      const aiData = await enrichProduct(title, brand);

      if (aiData) {
        enrichedBatch.push({
          handle: record.Handle || record.handle,
          title: title,
          name: title,
          brand: brand,
          price: parseFloat(record['Variant Price']) || 0,
          image_url: record['Image Src'] || '',
          clinical_description: aiData.clinical_description,
          health_specs: aiData.health_specs,
          dr_sami_approved: aiData.dr_sami_approved_badge,
          inventory_total: parseInt(record['Variant Inventory Qty']) || 0,
          updated_at: new Date().toISOString()
        });
      }
    }

    if (enrichedBatch.length > 0) {
      const { error } = await supabase.from('products').upsert(enrichedBatch, { onConflict: 'handle' });
      if (error) console.error('❌ Supabase Error:', error.message);
      else process.stdout.write(`✔ Batch synced. Total: ${i + enrichedBatch.length}/${records.length}\r`);
    }
  }

  console.log('\n🏁 Enrichment Complete!');
}

run();
