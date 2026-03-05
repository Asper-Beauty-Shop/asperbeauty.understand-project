#!/usr/bin/env node
/**
 * Asper Beauty Shop — Production health check.
 * Run: npm run health
 */

const FRONTEND_HEALTH = "https://asperbeautyshop-com.lovable.app/health";
const BRAIN_URL =
  "https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant";

const ACCEPTABLE_BRAIN_STATUSES = [200, 401, 405];

async function check(name, url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return { name, ok: res.ok, status: res.status, url };
  } catch (err) {
    return { name, ok: false, status: null, error: err.message, url };
  }
}

async function main() {
  console.log("Asper Beauty Shop — Health Check\n");

  const frontend = await check("Frontend /health", FRONTEND_HEALTH);
  const brain = await check("Beauty Assistant (brain)", BRAIN_URL);

  let failed = false;

  if (frontend.status === 200) {
    console.log(`  ✓ ${frontend.name}: ${frontend.status}`);
  } else {
    console.log(`  ✗ ${frontend.name}: ${frontend.status || frontend.error}`);
    failed = true;
  }

  if (ACCEPTABLE_BRAIN_STATUSES.includes(brain.status)) {
    console.log(`  ✓ ${brain.name}: ${brain.status}`);
  } else {
    console.log(`  ✗ ${brain.name}: ${brain.status || brain.error} (expect 200, 401, or 405)`);
    failed = true;
  }

  console.log("");
  process.exit(failed ? 1 : 0);
}

main();
