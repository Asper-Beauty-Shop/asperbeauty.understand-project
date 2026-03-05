#!/usr/bin/env node
/**
 * Asper Beauty Shop — Sync check (frontend + brain connectivity).
 * Run: npm run sync:check
 */

const FRONTEND_HEALTH = "https://asperbeautyshop-com.lovable.app/health";
const BRAIN_URL =
  "https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant";

async function fetchStatus(name, url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return { name, status: res.status, ok: res.ok };
  } catch (err) {
    return { name, status: null, ok: false, error: err.message };
  }
}

async function main() {
  console.log("Asper Beauty Shop — Sync check\n");

  const [frontend, brain] = await Promise.all([
    fetchStatus("Frontend /health", FRONTEND_HEALTH),
    fetchStatus("Beauty Assistant (brain)", BRAIN_URL),
  ]);

  let failed = false;

  if (frontend.status === 200) {
    console.log(`  ✓ ${frontend.name}: ${frontend.status}`);
  } else {
    console.log(`  ✗ ${frontend.name}: ${frontend.status || frontend.error}`);
    failed = true;
  }

  if (brain.status === 200) {
    console.log(`  ✓ ${brain.name}: ${brain.status}`);
  } else {
    console.log(`  ✗ ${brain.name}: ${brain.status || brain.error} (expect 200)`);
    failed = true;
  }

  console.log("");
  process.exit(failed ? 1 : 0);
}

main();
