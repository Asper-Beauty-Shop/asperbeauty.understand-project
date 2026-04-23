const fs = require('fs');
const csvPath = 'C:\\Users\\C-R\\Desktop\\ABS\\Asper All form Productts\\Asper_Catalog_CLEANED.csv';
const outputPath = 'C:\\Users\\C-R\\Desktop\\ABS\\understand-project\\catalog-sync.sql';

const CLINICAL_BRANDS = ['Vichy', 'La Roche-Posay', 'Eucerin', 'Bioderma', 'CeraVe', 'Sesderma', 'Heliocare', 'Avène', 'ISDIN', 'Uriage', 'Filorga', 'Ducray', 'Aderma', 'Mustela'];
const AESTHETIC_TYPES = ['Concealer', 'Foundation', 'Mascara', 'Lipstick', 'Makeup', 'Fragrance', 'Perfume'];

function getPersona(brand, type) {
  if (!brand) return 'ms_zain';
  if (CLINICAL_BRANDS.some(b => brand.toLowerCase().includes(b.toLowerCase()))) return 'dr_sami';
  if (AESTHETIC_TYPES.some(t => type && type.toLowerCase().includes(t.toLowerCase()))) return 'ms_zain';
  return 'ms_zain';
}

function getConcern(title, type) {
  const t = (title + ' ' + (type || '')).toLowerCase();
  if (t.match(/acne|pimple|blemish|breakout|pore|oily/)) return 'Concern_Acne';
  if (t.match(/aging|wrinkle|anti-age|retinol|lift|firm|collagen/)) return 'Concern_Aging';
  if (t.match(/hydrat|moistur|dry|thirst|water/)) return 'Concern_Hydration';
  if (t.match(/sensitive|red|irritat|calm|soothe|rosacea/)) return 'Concern_Sensitivity';
  if (t.match(/pigment|dark spot|brighten|vit c|glow|whitening/)) return 'Concern_Pigmentation';
  if (t.match(/sun|spf|uv|solar/)) return 'Concern_SunProtection';
  return 'Concern_Hydration';
}

function getRegimenStep(title, type) {
  const t = (title + ' ' + (type || '')).toLowerCase();
  if (t.match(/cleanser|wash|micellar|soap|foam|toner/)) return 'Step_1_Cleanser';
  if (t.match(/serum|treatment|acid|ampoule|essence|oil/)) return 'Step_2_Treatment';
  if (t.match(/spf|sun|protector|moisturizer|cream|balm|lotion/)) return 'Step_3_Protection';
  return 'Step_3_Protection';
}

try {
  const data = fs.readFileSync(csvPath, 'utf8');
  const lines = data.split('\n');
  const headerLine = lines[0];
  const headers = headerLine.substring(1, headerLine.length - 1).split('","');

  const vendorIdx = headers.indexOf('vendor');
  const titleIdx = headers.indexOf('title');
  const priceIdx = headers.indexOf('variants/0/price');
  const handleIdx = headers.indexOf('handle');
  const imageIdx = headers.indexOf('images/0/src');
  const typeIdx = headers.indexOf('productType');
  const inventoryIdx = headers.indexOf('variants/0/inventoryQuantity');

  let sql = 'INSERT INTO public.products (id, title, brand, price, handle, image_url, ai_persona_lead, primary_concern, regimen_step, inventory_total) VALUES\n';
  let values = [];

  for (let i = 1; i < Math.min(lines.length, 5001); i++) {
    if (!lines[i]) continue;
    const row = lines[i].substring(1, lines[i].length - 1).split('","');
    if (row.length < headers.length) continue;

    const title = row[titleIdx] || '';
    const brand = row[vendorIdx] || 'Generic';
    const price = parseFloat(row[priceIdx]) || 0;
    const handle = row[handleIdx] || 'sku-' + i;
    const imageUrl = row[imageIdx] || '';
    const type = row[typeIdx] || '';
    const inventory = parseInt(row[inventoryIdx]) || 0;

    const persona = getPersona(brand, type);
    const concern = getConcern(title, type);
    const step = getRegimenStep(title, type);

    const safeTitle = title.replace(/'/g, "''");
    const safeBrand = brand.replace(/'/g, "''");

    values.push(`('${handle}', '${safeTitle}', '${safeBrand}', ${price}, '${handle}', '${imageUrl}', '${persona}', '${concern}', '${step}', ${inventory})`);
  }

  sql += values.join(',\n') + ' ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, inventory_total = EXCLUDED.inventory_total;';
  fs.writeFileSync(outputPath, sql);
  console.log('Processed ' + values.length + ' products.');
} catch (e) {
  console.error(e);
}