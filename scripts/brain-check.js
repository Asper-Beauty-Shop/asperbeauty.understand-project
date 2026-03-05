#!/usr/bin/env node
/**
 * Asper Beauty Shop — Brain (Beauty Assistant) connectivity check.
 * Run: npm run brain
 */

const BRAIN_URL =
  "https://qqceibvalkoytafynwoc.supabase.co/functions/v1/beauty-assistant";

async function main() {
  console.log("Asper Beauty Shop — Brain connectivity check\n");
  try {
    const res = await fetch(BRAIN_URL, { method: "GET" });
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    if (res.ok) {
      console.log("  ✓ Beauty Assistant (Dr. Bot):", res.status);
      if (body && typeof body === "object") {
        console.log("  ", JSON.stringify(body, null, 2));
      } else if (text) {
        console.log("  ", text.slice(0, 200));
      }
      console.log("");
      process.exit(0);
    } else {
      console.log("  ✗ Beauty Assistant:", res.status, body || text);
      process.exit(1);
    }
  } catch (err) {
    console.log("  ✗ Error:", err.message);
    process.exit(1);
  }
}

main();
