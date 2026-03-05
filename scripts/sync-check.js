#!/usr/bin/env node
/**
 * Asper Beauty Shop — Sync check (frontend + brain connectivity).
 * Run: npm run sync
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

  const frontendOk = frontend.status === 200;
  const brainOk = [200, 401, 405].includes(brain.status);

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
