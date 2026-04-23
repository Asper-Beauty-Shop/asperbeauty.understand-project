#!/usr/bin/env node
/**
 * Asper Beauty Shop â€” Production health check.
 * Run: npm run health
 */

const FRONTEND_HEALTH = "https://www.asperbeautyshop.com/health";
const BRAIN_URL =
  "https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant";

async function check(name, url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return { name, ok: res.ok, status: res.status, url };
  } catch (err) {
    return { name, ok: false, status: null, error: err.message, url };
  }
}

async function main() {
  console.log("Asper Beauty Shop â€” Health Check\n");

  const frontend = await check("Frontend /health", FRONTEND_HEALTH);
  const brain = await check("Beauty Assistant (brain)", BRAIN_URL);

  let failed = false;

  if (frontend.status === 200) {
    console.log(`  âœ“ ${frontend.name}: ${frontend.status}`);
  } else {
    console.log(`  âœ— ${frontend.name}: ${frontend.status || frontend.error}`);
    failed = true;
  }

  if (brain.status === 200) {
    console.log(`  âœ“ ${brain.name}: ${brain.status}`);
  } else {
    console.log(`  âœ— ${brain.name}: ${brain.status || brain.error} (expect 200)`);
    failed = true;
  }

  console.log("");
  process.exit(failed ? 1 : 0);
}

main();

