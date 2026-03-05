/**
 * Asper Beauty Shop — Catalog Enrichment Pipeline
 * Shopify → Gemini Clinical Auditor → Supabase digital_tray_products + run log
 *
 * Usage:
 *   npx tsx scripts/catalog-enrichment/index.ts
 *
 * Env:
 *   SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN (Storefront mode) or SHOPIFY_ADMIN_ACCESS_TOKEN (Admin mode)
 *   GEMINI_API_KEY
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import "dotenv/config";
import { randomUUID } from "crypto";
import {
  BATCH_SIZE,
  ENRICHMENT_VERSION,
  GEMINI_BATCH_DELAY_MS,
  MAX_RETRIES,
} from "./config.js";
import { GeminiClinicalAuditor } from "./gemini-auditor.js";
import { ShopifyExtractor } from "./shopify-extractor.js";
import { SupabaseUpserter } from "./supabase-upserter.js";
import type { GeminiAuditResult, PipelineError, PipelineRun } from "./types.js";

const REQUIRED = [
  "SHOPIFY_STORE_DOMAIN",
  "GEMINI_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function durationMs(start: string, end: string | null): number {
  if (!end) return 0;
  return new Date(end).getTime() - new Date(start).getTime();
}

async function main() {
  for (const key of REQUIRED) getEnv(key);

  const storeDomain = getEnv("SHOPIFY_STORE_DOMAIN");
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const token = storefrontToken || adminToken;
  if (!token) {
    throw new Error(
      "Set either SHOPIFY_STOREFRONT_ACCESS_TOKEN or SHOPIFY_ADMIN_ACCESS_TOKEN"
    );
  }
  const extractor = new ShopifyExtractor(
    storeDomain,
    token,
    storefrontToken ? "storefront" : "admin"
  );
  const auditor = new GeminiClinicalAuditor(getEnv("GEMINI_API_KEY"));
  const writer = new SupabaseUpserter(
    getEnv("SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY")
  );

  const runId = randomUUID();
  const startedAt = new Date().toISOString();

  const pipelineRun: PipelineRun = {
    run_id: runId,
    started_at: startedAt,
    completed_at: null,
    products_scanned: 0,
    products_enriched: 0,
    products_skipped: 0,
    products_failed: 0,
    errors: [],
    status: "running",
    enrichment_version: ENRICHMENT_VERSION,
  };

  console.log("═══════════════════════════════════════════════════════════");
  console.log("🌿 ASPER BEAUTY — AI Catalog Enrichment Pipeline");
  console.log(`📋 Run ID: ${runId}`);
  console.log(`⏰ Started: ${startedAt}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  try {
    console.log("STAGE 1: Data Extraction\n" + "─".repeat(40));
    const products = await extractor.extractUnenrichedProducts();
    pipelineRun.products_scanned = products.length;

    if (products.length === 0) {
      console.log("✅ All products already enriched. Pipeline complete.\n");
      pipelineRun.status = "completed";
      pipelineRun.completed_at = new Date().toISOString();
      await writer.logPipelineRun(pipelineRun);
      return;
    }

    console.log("\nSTAGE 2: Gemini Clinical Analysis (batched, self-healing)\n" + "─".repeat(40));
    console.log(`🔬 Analyzing ${products.length} products in batches of ${BATCH_SIZE}...\n`);

    const auditResults: GeminiAuditResult[] = [];
    const analysisErrors: PipelineError[] = [];

    for (let offset = 0; offset < products.length; offset += BATCH_SIZE) {
      const batch = products.slice(offset, offset + BATCH_SIZE);
      const batchNum = Math.floor(offset / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(products.length / BATCH_SIZE);
      const progress = `[Batch ${batchNum}/${totalBatches}]`;

      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const batchResults = await auditor.auditBatch(batch);
          auditResults.push(...batchResults);
          const concernsSample = batchResults[0]?.skin_concerns?.join(", ") ?? "—";
          console.log(
            `${progress} ✅ ${batch.length} products | e.g. concerns: [${concernsSample}]`
          );
          break;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (attempt < MAX_RETRIES) {
            console.warn(
              `${progress} ⚠️ Attempt ${attempt} failed, retrying in ${2 * attempt}s...`
            );
            await sleep(2000 * attempt);
          }
        }
      }

      if (lastError && auditResults.length < offset + batch.length) {
        console.error(
          `${progress} ❌ Batch failed after ${MAX_RETRIES} attempts: ${lastError.message}`
        );
        for (const product of batch) {
          analysisErrors.push({
            sku: product.variants[0]?.sku ?? product.id,
            shopify_product_id: product.id,
            error_message: lastError!.message,
            stage: "analysis",
            timestamp: new Date().toISOString(),
          });
        }
      }

      if (offset + BATCH_SIZE < products.length) await sleep(GEMINI_BATCH_DELAY_MS);
    }

    console.log("\nSTAGE 3: Supabase Idempotent Upsert\n" + "─".repeat(40));
    console.log(`💾 Writing ${auditResults.length} records...`);

    const { succeeded, failed: upsertErrors } = await writer.upsertBatch(
      auditResults,
      ENRICHMENT_VERSION
    );

    const allErrors = [...analysisErrors, ...upsertErrors];
    pipelineRun.completed_at = new Date().toISOString();
    pipelineRun.products_enriched = succeeded;
    pipelineRun.products_failed = allErrors.length;
    pipelineRun.errors = allErrors;
    pipelineRun.status = allErrors.length === 0 ? "completed" : "partial";

    await writer.logPipelineRun(pipelineRun);

    const stats = await writer.getEnrichmentStats();

    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("📊 PIPELINE SUMMARY");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`  Run ID:              ${runId}`);
    console.log(`  Products Scanned:    ${pipelineRun.products_scanned}`);
    console.log(`  Successfully Enriched: ${pipelineRun.products_enriched}`);
    console.log(`  Failed:              ${pipelineRun.products_failed}`);
    console.log(`  Status:              ${pipelineRun.status.toUpperCase()}`);
    console.log(`  Duration:            ${durationMs(startedAt, pipelineRun.completed_at)}ms`);
    console.log(`  Avg AI Confidence:   ${stats.avgConfidence.toFixed(1)}%`);
    console.log("\n📈 Products per Concern:");
    for (const [concern, count] of Object.entries(stats.byConcern).sort(
      ([, a], [, b]) => b - a
    )) {
      console.log(`  ${concern.padEnd(22)} ${count}`);
    }
    if (allErrors.length > 0) {
      console.log("\n⚠️  ERRORS:");
      allErrors.forEach((e) =>
        console.log(`  • ${e.sku} [${e.stage}]: ${e.error_message}`)
      );
    }
    console.log("═══════════════════════════════════════════════════════════");
    console.log("✨ Pipeline complete.");
  } catch (fatal: unknown) {
    pipelineRun.status = "failed";
    pipelineRun.completed_at = new Date().toISOString();
    console.error("\n💥 FATAL PIPELINE ERROR:", fatal);
    await writer.logPipelineRun(pipelineRun).catch(() => {});
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
