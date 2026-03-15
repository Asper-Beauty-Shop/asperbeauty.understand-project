/**
 * sync-asar-catalog.cjs
 *
 * ASAR High-Speed Heuristic Sync
 * Reads data/shopify-import-3.csv → upserts into Supabase `products` table.
 *
 * CSV format: Shopify JSON-flattened export (variants/0/price, images/0/src …)
 *
 * Usage:
 *   node scripts/sync-asar-catalog.cjs [--dry-run] [--limit N] [path/to/file.csv]
 *
 * Required env vars (set in .env or export before running):
 *   SUPABASE_URL              e.g. https://vhgwvfedgfmcixhdyttt.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  service_role JWT (never commit this)
 *
 * NEVER hardcode credentials in this file.
 */

'use strict';

const { createClient } = require('@supabase/supabase-js');
const fs      = require('fs');
const path    = require('path');
const fastCsv = require('fast-csv');

// ── Env ───────────────────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const SUPABASE_URL             = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.');
  console.error('    Add them to .env or export before running this script.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── CLI args ──────────────────────────────────────────────────────────────────

const args     = process.argv.slice(2);
const DRY_RUN  = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const LIMIT    = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const csvArg   = args.find(a => !a.startsWith('--') && a !== String(LIMIT));
const CSV_PATH = csvArg
  ? path.resolve(process.cwd(), csvArg)
  : path.resolve(process.cwd(), 'data/shopify-import-3.csv');

// ── ASAR Taxonomy ─────────────────────────────────────────────────────────────

function mapASARTaxonomy(title, type) {
  const s = `${title} ${type}`.toLowerCase();

  let primary_pillar     = 'Clinical Skincare';
  let secondary_category = 'Barrier Repair';
  let clinical_concerns  = ['Dehydration'];
  let primary_icon_tag   = 'icon-flask';

  // Pillar
  if (s.includes('shampoo') || s.includes('hair') || s.includes('scalp') || s.includes('conditioner')) {
    primary_pillar     = 'Dermatological Haircare';
    secondary_category = s.includes('scalp') ? 'Scalp Therapy' : 'Strand Repair';
    primary_icon_tag   = 'icon-shield';
  } else if (s.includes('supplement') || s.includes('vitamin') || s.includes('capsule') || s.includes('biotic')) {
    primary_pillar     = 'Nutraceuticals & Supplements';
    secondary_category = 'Daily Complex';
    primary_icon_tag   = 'icon-leaf';
  } else if (s.includes('makeup') || s.includes('foundation') || s.includes('lipstick') || s.includes('concealer') || s.includes('mascara')) {
    primary_pillar     = 'Advanced Cosmetics';
    secondary_category = 'Enhancement';
    primary_icon_tag   = 'icon-lotus';
  } else {
    if      (s.includes('serum') || s.includes('active') || s.includes('ampoule')) secondary_category = 'Targeted Serums';
    else if (s.includes('cleanser') || s.includes('wash') || s.includes('soap'))   secondary_category = 'Clinical Cleansers';
    else if (s.includes('spf') || s.includes('sunscreen') || s.includes('protection')) secondary_category = 'SPF & Protection';
  }

  // Concern (last match wins — most specific)
  if (s.includes('dry')       || s.includes('hydrat') || s.includes('moist'))        clinical_concerns = ['Dehydration'];
  if (s.includes('sensitive') || s.includes('red')    || s.includes('inflammat'))     clinical_concerns = ['Inflammation & Rosacea'];
  if (s.includes('acne')      || s.includes('blemish') || s.includes('pore'))         clinical_concerns = ['Acne & Congestion'];
  if (s.includes('age')       || s.includes('wrinkle') || s.includes('firm'))         clinical_concerns = ['Collagen Depletion'];
  if (s.includes('pigment')   || s.includes('dark spot') || s.includes('bright'))     clinical_concerns = ['Hyperpigmentation'];

  return { primary_pillar, secondary_category, clinical_concerns, primary_icon_tag };
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

/**
 * Shopify JSON-flattened CSV uses "variants/0/price", "variants/1/price" …
 * Sum all variant inventoryQuantity values for inventory_total.
 */
function sumInventory(record) {
  let total = 0;
  for (let i = 0; i <= 25; i++) {
    const qty = parseInt(record[`variants/${i}/inventoryQuantity`], 10);
    if (!isNaN(qty)) total += qty;
  }
  return total;
}

/** Return the first non-empty variant price. */
function firstVariantPrice(record) {
  for (let i = 0; i <= 25; i++) {
    const raw = record[`variants/${i}/price`];
    if (raw && raw.trim()) return parseFloat(raw) || 0;
  }
  return 0;
}

/** Return the first non-empty variant compareAtPrice. */
function firstCompareAtPrice(record) {
  for (let i = 0; i <= 25; i++) {
    const raw = record[`variants/${i}/compareAtPrice`];
    if (raw && raw.trim()) return parseFloat(raw) || null;
  }
  return null;
}

/** Return the first product image src. */
function firstImageSrc(record) {
  for (let i = 0; i <= 26; i++) {
    const src = record[`images/${i}/src`];
    if (src && src.trim()) return src.trim();
  }
  return '';
}

/** Map Shopify status → availability_status enum used in Supabase */
function mapStatus(status) {
  if (!status) return 'In_Stock';
  const s = status.toLowerCase();
  if (s === 'active')   return 'In_Stock';
  if (s === 'draft')    return 'Pending_Purge';
  if (s === 'archived') return 'Discontinued';
  return 'In_Stock';
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`🚀  ASAR Heuristic Sync${DRY_RUN ? ' [DRY RUN]' : ''}`);
  console.log(`📂  CSV: ${CSV_PATH}`);

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌  File not found: ${CSV_PATH}`);
    process.exit(1);
  }

  /** Parse CSV via fast-csv into an array of row objects */
  const records = await new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(CSV_PATH)
      .pipe(fastCsv.parse({ headers: true, relax_column_count: true }))
      .on('data', row => rows.push(row))
      .on('error', reject)
      .on('end', () => resolve(rows));
  });

  const allRecords = Number.isFinite(LIMIT) ? records.slice(0, LIMIT) : records;
  console.log(`📦  Processing ${allRecords.length} rows…`);

  const products = [];

  for (const record of allRecords) {
    const title  = (record.title  || record.Title  || '').trim();
    const handle = (record.handle || record.Handle || '').trim();
    if (!title || !handle) continue;

    const type         = (record.productType || record['Type'] || '').trim();
    const vendor       = (record.vendor      || record.Vendor  || '').trim();
    const status       = (record.status      || '').trim();
    const price        = firstVariantPrice(record);
    const compareAt    = firstCompareAtPrice(record);
    const inventoryQty = sumInventory(record);
    const imageSrc     = firstImageSrc(record);
    const taxonomy     = mapASARTaxonomy(title, type);

    products.push({
      handle,
      title,
      name:                title,           // required non-nullable
      brand:               vendor,
      category:            type || 'Uncategorized', // required non-nullable
      description:         '',              // required non-nullable, enriched later
      price,
      compare_at_price:    compareAt,
      image_url:           imageSrc,
      asper_category:      type || 'Uncategorized',
      availability_status: mapStatus(status),
      inventory_total:     inventoryQty,

      // ASAR taxonomy fields
      primary_pillar:      taxonomy.primary_pillar,
      secondary_category:  taxonomy.secondary_category,
      clinical_concerns:   taxonomy.clinical_concerns,
      primary_icon_tag:    taxonomy.primary_icon_tag,
      dr_sami_approved:    title.toLowerCase().includes('clinical') ||
                           title.toLowerCase().includes('dermatologist'),
    });
  }

  console.log(`✅  Mapped ${products.length} products`);

  if (DRY_RUN) {
    console.log('🔍  Dry run — first 3 records:');
    console.dir(products.slice(0, 3), { depth: null });
    return;
  }

  // Upsert in batches of 100 to stay within Supabase payload limits
  const BATCH = 100;
  let upserted = 0;
  let errors   = 0;

  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    const { error } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'handle' });

    if (error) {
      console.error(`❌  Batch ${i / BATCH + 1} error:`, error.message);
      errors += batch.length;
    } else {
      upserted += batch.length;
      process.stdout.write(`\r   ${upserted}/${products.length} upserted…`);
    }
  }

  console.log(`\n🏁  Done — ${upserted} upserted, ${errors} errors`);
}

run().catch(err => {
  console.error('💥  Fatal:', err.message);
  process.exit(1);
});
