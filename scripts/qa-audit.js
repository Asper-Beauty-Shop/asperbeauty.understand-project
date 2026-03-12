import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = 'https://vhgwvfedgfmcixhdyttt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runAudit() {
  console.log('🔍 Starting Quality Assurance Audit (Orphan Check)...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, brand, tier_1_category, needs_manual_review');

  if (error) {
    console.error('❌ Database Error:', error.message);
    return;
  }

  console.log(`📦 Auditing ${products.length} products...`);

  const orphans = products.filter(p => !p.brand || !p.tier_1_category || p.needs_manual_review);

  if (orphans.length === 0) {
    console.log('✅ Success: No orphaned products found. Information Architecture is intact!');
  } else {
    console.log(`⚠️ Warning: Found ${orphans.length} products needing attention.`);
    
    // Group orphans by issue
    const missingBrand = orphans.filter(p => !p.brand);
    const missingTier1 = orphans.filter(p => !p.tier_1_category);
    const flagged = orphans.filter(p => p.needs_manual_review);

    console.log(`- Missing Brand: ${missingBrand.length}`);
    console.log(`- Missing Tier 1 Category: ${missingTier1.length}`);
    console.log(`- Flagged for Manual Review: ${flagged.length}`);

    if (flagged.length > 0) {
      console.log('\n📌 Sample of Flagged Products:');
      flagged.slice(0, 5).forEach(p => console.log(`  * ${p.title}`));
    }
  }

  console.log('\n🏁 Audit Complete!');
}

runAudit();
