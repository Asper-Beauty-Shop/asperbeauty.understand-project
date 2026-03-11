import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Use provided credentials
const SUPABASE_URL = 'https://qqceibvalkoytafynwoc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2VpYnZhbGtveXRhZnlud29jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMzNzU5NSwiZXhwIjoyMDg1OTEzNTk1fQ.bMm74y-fjlz11_pkayGyo5ho2Mgzqfrh-ZNgPTFYxGY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function robustSplit(raw) {
  const parts = [];
  let currentPart = '';
  let inString = false;
  
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char === "'" && (i === 0 || raw[i-1] !== "\\")) {
      inString = !inString;
    }
    if (char === ',' && !inString) {
      parts.push(currentPart.trim());
      currentPart = '';
    } else {
      currentPart += char;
    }
  }
  parts.push(currentPart.trim());
  return parts;
}

async function sync() {
  console.log('🚀 Starting catalog sync to Supabase (Unique-Handle Mode)...');
  
  const sqlPath = path.resolve(process.cwd(), 'catalog-sync.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ catalog-sync.sql not found!');
    return;
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  const lines = sqlContent.split('\n');
  
  console.log('📦 Parsing SQL file lines...');
  
  const productsMap = new Map();
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('(') && (line.endsWith('),') || line.endsWith(');') || line.endsWith(')'))) {
      try {
        const startIdx = line.indexOf('(') + 1;
        const endIdx = line.lastIndexOf(')');
        const raw = line.substring(startIdx, endIdx);
        const parts = robustSplit(raw);

        if (parts.length >= 10) {
          const handle = parts[4].replace(/^'|'$/g, '').replace(/''/g, "'");
          productsMap.set(handle, {
            title: parts[1].replace(/^'|'$/g, '').replace(/''/g, "'"),
            brand: parts[2].replace(/^'|'$/g, '').replace(/''/g, "'"),
            price: parseFloat(parts[3]),
            handle: handle,
            image_url: parts[5].replace(/^'|'$/g, '').replace(/''/g, "'"),
            ai_persona_lead: parts[6].replace(/^'|'$/g, '').replace(/''/g, "'"),
            primary_concern: parts[7].replace(/^'|'$/g, '').replace(/''/g, "'"),
            regimen_step: parts[8].replace(/^'|'$/g, '').replace(/''/g, "'"),
            inventory_total: parseInt(parts[9]) || 0,
            updated_at: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn('⚠️ Skipping malformed line:', line.substring(0, 50) + '...');
      }
    }
  }

  const products = Array.from(productsMap.values());
  if (products.length === 0) {
    console.error('❌ No products parsed.');
    return;
  }

  console.log(`✅ Parsed ${products.length} unique products. Starting upload...`);

  const CHUNK_SIZE = 50; 
  for (let i = 0; i < products.length; i += CHUNK_SIZE) {
    const chunk = products.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase
      .from('products')
      .upsert(chunk, { onConflict: 'handle' });

    if (error) {
      console.error(`❌ Error uploading chunk ${i / CHUNK_SIZE + 1}:`, error.message);
      break; 
    } else {
      process.stdout.write(`✔ Synced ${Math.min(i + CHUNK_SIZE, products.length)} / ${products.length} products...\r`);
    }
  }

  console.log('\n🏁 Sync process finished.');
}

sync();
