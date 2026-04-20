const fs = require('fs');
const fullFixPath = 'C:\\Users\\C-R\\Desktop\\ABS\\Asper All form Productts\\Asper_Catalo with full fix.csv';
const cleanedPath = 'C:\\Users\\C-R\\Desktop\\ABS\\Asper All form Productts\\Asper_Catalog_CLEANED.csv';
const outputPath = 'C:\\Users\\C-R\\Desktop\\ABS\\understand-project\\catalog-sync.sql';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

try {
  console.log('Synchronizing prices using Correct Shopify Catalog (CSCSVC)...');
  
  // 1. Build Price Map from "Full Fix" CSV
  const priceMap = new Map();
  const fullFixData = fs.readFileSync(fullFixPath, 'utf8');
  const ffLines = fullFixData.split('\n');
  const ffHeaders = parseCSVLine(ffLines[0].trim());
  const ffHandleIdx = ffHeaders.indexOf('handle');
  const ffPriceIdx = ffHeaders.indexOf('variants/0/price');

  for (let i = 1; i < ffLines.length; i++) {
    const line = ffLines[i].trim();
    if (!line) continue;
    const row = parseCSVLine(line);
    if (row[ffHandleIdx]) {
      priceMap.set(row[ffHandleIdx], parseFloat(row[ffPriceIdx]) || 0);
    }
  }
  console.log(`Loaded ${priceMap.size} correct prices from Full Fix CSV.`);

  // 2. Process Cleaned Catalog and Inject Correct Prices
  const cleanedData = fs.readFileSync(cleanedPath, 'utf8');
  const cLines = cleanedData.split('\n');
  const cHeaders = parseCSVLine(cLines[0].trim());
  
  const hIdx = cHeaders.indexOf('handle');
  const tIdx = cHeaders.indexOf('title');
  const vIdx = cHeaders.indexOf('vendor');
  const iIdx = cHeaders.indexOf('images/0/src');
  const invIdx = cHeaders.indexOf('variants/0/inventoryQuantity');

  let sql = 'INSERT INTO public.products (id, title, brand, price, handle, image_url, ai_persona_lead, primary_concern, regimen_step, inventory_total) VALUES\n';
  let values = [];

  for (let i = 1; i < cLines.length; i++) {
    const line = cLines[i].trim();
    if (!line) continue;
    const row = parseCSVLine(line);
    if (row.length < 10) continue;

    const handle = row[hIdx];
    const correctPrice = priceMap.get(handle) || parseFloat(row[cHeaders.indexOf('variants/0/price')]) || 0;
    
    // Final logic: Ensure price is decimal-corrected
    let price = correctPrice;
    if (price > 300 && Number.isInteger(price)) price = price / 100;

    const title = row[tIdx] || '';
    const brand = row[vIdx] || 'Generic';
    const imageUrl = row[iIdx] || '';
    const inventory = parseInt(row[invIdx]) || 0;
    const persona = ['Vichy', 'La Roche-Posay', 'Eucerin', 'Bioderma', 'CeraVe'].some(cb => brand.includes(cb)) ? 'dr_sami' : 'ms_zain';

    const safeTitle = title.replace(/'/g, "''").replace(/\\/g, "");
    const safeBrand = brand.replace(/'/g, "''").replace(/\\/g, "");

    values.push(`('${handle}', '${safeTitle}', '${safeBrand}', ${price}, '${handle}', '${imageUrl}', '${persona}', 'Concern_Hydration', 'Step_3_Protection', ${inventory})`);
    if (values.length >= 5000) break;
  }

  const conflictClause = ' ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, title = EXCLUDED.title, inventory_total = EXCLUDED.inventory_total;';
  sql += values.join(',\n') + conflictClause;
  fs.writeFileSync(outputPath, sql);
  console.log(`✅ Absolute Price Fix Complete: ${values.length} products synchronized.`);
} catch (e) {
  console.error(e);
}