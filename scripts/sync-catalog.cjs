const fs = require('fs');
const path = require('path');

const cleanedCsvPath = 'C:\\Users\\C-R\\Desktop\\ABS\\Asper All form Productts\\Asper_Catalog_CLEANED.csv';
const perfCsvPath = 'C:\\Users\\C-R\\Desktop\\shopify-import Perf.csv';
const outputPath = 'C:\\Users\\C-R\\Desktop\\ABS\\understand-project\\catalog-sync.sql';
const assetsDir = 'C:\\Users\\C-R\\Desktop\\ABS\\understand-project\\public\\assets';

const CLINICAL_BRANDS = ['Vichy', 'La Roche-Posay', 'Eucerin', 'Bioderma', 'CeraVe', 'Sesderma', 'Heliocare', 'Avène', 'ISDIN', 'Uriage', 'Filorga', 'Ducray', 'Aderma', 'Mustela'];

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
  console.log('Synchronizing absolute realistic imagery across 4,400+ products...');
  
  // Load local luxury assets for fallback
  const localAssets = fs.readdirSync(assetsDir).filter(f => f.startsWith('luxury-asset-'));
  let assetIdx = 0;

  // Build Price & Image Map from Perf CSV
  const perfMap = new Map();
  if (fs.existsSync(perfCsvPath)) {
    const perfData = fs.readFileSync(perfCsvPath, 'utf8');
    const perfLines = perfData.split('\n');
    const perfHeaders = parseCSVLine(perfLines[0].trim());
    const hIdx = perfHeaders.indexOf('Handle');
    const iIdx = perfHeaders.indexOf('Image Src');
    const pIdx = perfHeaders.indexOf('Variant Price');

    for (let i = 1; i < perfLines.length; i++) {
      const line = perfLines[i].trim();
      if (!line) continue;
      const row = parseCSVLine(line);
      if (row[hIdx]) {
        let price = parseFloat(row[pIdx]) || 0;
        if (price > 300 && Number.isInteger(price)) price = price / 100;
        perfMap.set(row[hIdx], { image: row[iIdx], price: price });
      }
    }
  }

  // Process Master Catalog
  const data = fs.readFileSync(cleanedCsvPath, 'utf8');
  const lines = data.split('\n');
  const headers = parseCSVLine(lines[0].trim());

  const handleIdx = headers.indexOf('handle');
  const titleIdx = headers.indexOf('title');
  const vendorIdx = headers.indexOf('vendor');
  const inventoryIdx = headers.indexOf('variants/0/inventoryQuantity');
  const priceIdx = headers.indexOf('variants/0/price');
  const imageIdx = headers.indexOf('images/0/src');

  let sql = 'INSERT INTO public.products (id, title, brand, price, handle, image_url, ai_persona_lead, primary_concern, regimen_step, inventory_total) VALUES\n';
  let values = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const row = parseCSVLine(line);
    if (row.length < 10) continue;

    const handle = row[handleIdx];
    const perfData = perfMap.get(handle) || {};
    const title = row[titleIdx] || '';
    const brand = row[vendorIdx] || 'Generic';
    
    let price = perfData.price || parseFloat(row[priceIdx]) || 0;
    if (price > 300 && Number.isInteger(price)) price = price / 100;

    // ULTIMATE IMAGE LOGIC: 
    // 1. Perf CSV Original
    // 2. Cleaned CSV Original
    // 3. "Super Beautiful" Local Asset (Rotating)
    let imageUrl = perfData.image || row[imageIdx];
    if (!imageUrl || imageUrl === '' || imageUrl === 'null') {
        imageUrl = `/assets/${localAssets[assetIdx]}`;
        assetIdx = (assetIdx + 1) % localAssets.length;
    }

    const inventory = parseInt(row[inventoryIdx]) || 0;
    const persona = CLINICAL_BRANDS.some(cb => brand.toLowerCase().includes(cb.toLowerCase())) ? 'dr_sami' : 'ms_zain';

    const safeTitle = title.replace(/'/g, "''").replace(/\\/g, "");
    const safeBrand = brand.replace(/'/g, "''").replace(/\\/g, "");

    values.push(`('${handle}', '${safeTitle}', '${safeBrand}', ${price}, '${handle}', '${imageUrl}', '${persona}', 'Concern_Hydration', 'Step_3_Protection', ${inventory})`);
    if (values.length >= 5000) break;
  }

  const conflictClause = ' ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, title = EXCLUDED.title, inventory_total = EXCLUDED.inventory_total, image_url = EXCLUDED.image_url;';
  sql += values.join(',\n') + conflictClause;
  fs.writeFileSync(outputPath, sql);
  console.log(`✅ ABSOLUTE IMAGE SYNC COMPLETE: ${values.length} products mapped with original or luxury assets.`);
} catch (e) {
  console.error(e);
}