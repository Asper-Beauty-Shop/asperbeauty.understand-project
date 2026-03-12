/**
 * Asper Beauty Shop — High-Integrity Bulk Supabase Ingestion (ETL)
 * 
 * Final Alignment Mode:
 *   - Maps CSV 'title' to both 'title' and 'name' (DB) to satisfy not-null constraints.
 *   - Maps CSV 'vendor' to 'brand' (DB).
 *   - Includes all clinical taxonomy fallbacks.
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Config & Setup
// ---------------------------------------------------------------------------

const envPath = path.resolve(process.cwd(), ".env");
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";
const getEnv = (key: string) => {
  const match = env.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].replace(/["']/g, "").trim() : process.env[key];
};

const SUPABASE_URL = getEnv("VITE_SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY") || "";
const CSV_PATH = process.argv[2] || path.resolve("data/shopify-import-3.csv");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const BATCH_SIZE = 50;

// ---------------------------------------------------------------------------
// Normalization & Mapping
// ---------------------------------------------------------------------------

const BRAND_MAP: Record<string, string> = {
  "vichy labs": "Vichy",
  "la roche posay": "La Roche-Posay",
  "cerave skincare": "CeraVe",
  "eucerin intensive": "Eucerin",
};

function normalizeBrand(raw: string): string {
  const lower = (raw || "").toLowerCase().trim();
  return BRAND_MAP[lower] || raw.trim() || "Asper Beauty";
}

function getTaxonomy(type: string, title: string) {
  const t = (type + " " + title).toLowerCase();
  if (t.includes("serum")) return { cat: "Clinical Serums & Treatments", concern: "Concern_Hydration", step: "Step_2_Treatment" };
  if (t.includes("cleanser")) return { cat: "Cleansers & Exfoliants", concern: "Concern_Acne", step: "Step_1_Cleanser" };
  if (t.includes("moisturizer")) return { cat: "Daily Hydration & Barrier", concern: "Concern_Hydration", step: "Step_2_Treatment" };
  if (t.includes("spf")) return { cat: "Sun Protection (SPF)", concern: "Concern_SunProtection", step: "Step_3_Protection" };
  if (t.includes("makeup") || t.includes("lipstick") || t.includes("concealer")) return { cat: "Color Cosmetics", concern: "Concern_Brightening", step: "Step_2_Treatment" };
  return { cat: "Daily Hydration & Barrier", concern: "Concern_Hydration", step: "Step_2_Treatment" };
}

// ---------------------------------------------------------------------------
// CSV Parser
// ---------------------------------------------------------------------------

function parseCSV(raw: string): Record<string, string>[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inQuotes) {
      if (ch === '"' && raw[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ",") { current.push(field); field = ""; }
      else if (ch === "\n" || (ch === "\r" && raw[i + 1] === "\n")) {
        current.push(field); field = "";
        if (current.length > 1) rows.push(current);
        current = [];
        if (ch === "\r") i++;
      } else { field += ch; }
    }
  }
  if (field || current.length) {
    current.push(field);
    if (current.length > 1) rows.push(current);
  }

  const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, ""));
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (row[i] || "").trim().replace(/^"|"$/g, "")));
    return obj;
  });
}

// ---------------------------------------------------------------------------
// ETL Logic
// ---------------------------------------------------------------------------

async function main() {
  console.log("🚀 Resuming Bulk Ingestion...");
  
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCSV(raw);
  console.log(`📊 Processing ${rows.length} products.`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const products: any[] = [];

    for (const row of batch) {
      const title = row["title"];
      if (!title) continue;

      const tax = getTaxonomy(row["productType"], title);
      const brand = normalizeBrand(row["vendor"]);

      products.push({
        name: title, // Satisfy NOT NULL name
        title: title,
        brand: brand,
        price: parseFloat(parseFloat(row["variants/0/price"] || "0").toFixed(2)),
        image_url: row["images/0/src"] || "",
        handle: row["handle"] || title.toLowerCase().replace(/\s+/g, "-"),
        inventory_total: parseInt(row["variants/0/inventoryQuantity"] || "0", 10),
        stock: parseInt(row["variants/0/inventoryQuantity"] || "0", 10),
        regimen_step: tax.step,
        asper_category: tax.cat,
        primary_concern: tax.concern,
        currency: "JOD",
        available: true,
        metadata: { 
          shopify_id: row["productId"],
          product_type: row["productType"]
        }
      });
    }

    if (products.length > 0) {
      const { data, error } = await supabase.from("products").upsert(products, { onConflict: 'handle' }).select();
      if (error) {
        console.error(`❌ Upsert Error at batch ${i}: ${error.message}`);
        errorCount += products.length;
      } else if (data) {
        successCount += data.length;
      }
    }

    const processed = i + batch.length;
    if (processed % 500 === 0 || processed === rows.length) {
      console.log(`📈 Progress: ${processed}/${rows.length} | Success: ${successCount}`);
    }
  }

  console.log(`\n✅ Ingestion Complete. Success: ${successCount}, Errors: ${errorCount}`);
}

main().catch(err => console.error("💥 Fatal:", err));
