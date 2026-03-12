import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.PAGESPEED_API_KEY;
const SITE_URL = 'https://www.asperbeautyshop.com';

async function runAudit(strategy = 'MOBILE') {
  console.log(`🚀 Starting PageSpeed Audit for ${strategy}...`);
  
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL)}&key=${API_KEY}&strategy=${strategy}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('❌ Audit Error:', data.error.message);
      return;
    }

    const categories = data.lighthouseResult.categories;
    console.log(`\n--- 📊 ${strategy} Results ---`);
    console.log(`Performance:    ${Math.round(categories.performance.score * 100)}%`);
    console.log(`Accessibility:  ${Math.round(categories.accessibility.score * 100)}%`);
    console.log(`Best Practices: ${Math.round(categories['best-practices'].score * 100)}%`);
    console.log(`SEO:            ${Math.round(categories.seo.score * 100)}%`);
    
    const audits = data.lighthouseResult.audits;
    console.log('\n✨ Top Opportunities for Improvement:');
    const opportunities = Object.values(audits)
      .filter(a => a.details && a.details.type === 'opportunity' && a.score < 0.9)
      .sort((a, b) => (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0))
      .slice(0, 3);

    opportunities.forEach(o => {
      console.log(`- ${o.title}: Save approx ${Math.round(o.details.overallSavingsMs)}ms`);
    });

  } catch (e) {
    console.error('❌ Fetch Error:', e.message);
  }
}

async function main() {
  if (!API_KEY) {
    console.error('❌ Missing PAGESPEED_API_KEY in .env');
    return;
  }
  await runAudit('MOBILE');
  await runAudit('DESKTOP');
}

main();
