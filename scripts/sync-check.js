#!/usr/bin/env node
/**
 * Asper Beauty Shop — Sync check (frontend + brain connectivity).
 * Run: npm run sync:check
 */

const FRONTEND_HEALTH = "https://www.asperbeautyshop.com/health";
const BRAIN_URL =
  "https://vhgwvfedgfmcixhdyttt.supabase.co/functions/v1/beauty-assistant";

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

  const frontendOk = frontend.ok;
  const brainOk = brain.ok;

  console.log(
    frontendOk ? "  ✓" : "  ✗",
    frontend.name + ":",
    frontend.status || frontend.error
  );
  console.log(
    brainOk ? "  ✓" : "  ✗",
    brain.name + ":",
    brain.status || brain.error
  );
  console.log("");

  process.exit(frontendOk && brainOk ? 0 : 1);
}

main();


