/**
 * Asper Beauty Shop — Idempotent Supabase upsert + pipeline run logging.
 * Aligned with AI-Powered Architecture Implementation Plan.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENRICHMENT_VERSION } from "./config.js";
import type {
  EnrichmentRecord,
  GeminiAuditResult,
  PipelineError,
  PipelineRun,
} from "./types.js";

const SUB_BATCH_SIZE = 50;

function mapToEnrichmentRecord(
  result: GeminiAuditResult,
  version: string
): EnrichmentRecord {
  return {
    shopify_product_id: result.shopify_product_id,
    sku: result.sku,
    handle: result.handle,
    title: result.title,
    skin_concerns: result.skin_concerns,
    skin_types: result.skin_types,
    key_ingredients: result.key_ingredients,
    spf_value: result.spf_value,
    ai_confidence_score: result.confidence_score,
    ai_clinical_reasoning: result.clinical_reasoning,
    requires_human_review: result.requires_human_review,
    review_reason: result.review_reason,
    enriched_at: new Date().toISOString(),
    enrichment_version: version,
  };
}

export class SupabaseUpserter {
  private readonly client: SupabaseClient;

  constructor(supabaseUrl: string, serviceRoleKey: string) {
    this.client = createClient(supabaseUrl, serviceRoleKey);
  }

  async upsertBatch(
    results: GeminiAuditResult[],
    enrichmentVersion: string = ENRICHMENT_VERSION
  ): Promise<{ succeeded: number; failed: PipelineError[] }> {
    const records = results.map((r) =>
      mapToEnrichmentRecord(r, enrichmentVersion)
    );
    const errors: PipelineError[] = [];
    let succeeded = 0;

    for (let i = 0; i < records.length; i += SUB_BATCH_SIZE) {
      const subBatch = records.slice(i, i + SUB_BATCH_SIZE);
      const rows = subBatch.map((rec) => ({
        shopify_product_id: rec.shopify_product_id,
        sku: rec.sku,
        handle: rec.handle ?? "",
        title: rec.title ?? "",
        skin_concerns: rec.skin_concerns,
        skin_types: rec.skin_types,
        key_ingredients: rec.key_ingredients,
        spf_value: rec.spf_value,
        ai_confidence_score: rec.ai_confidence_score / 100, // store 0-1 for existing DECIMAL column
        clinical_justification: rec.ai_clinical_reasoning,
        ai_clinical_reasoning: rec.ai_clinical_reasoning,
        requires_human_review: rec.requires_human_review,
        review_reason: rec.review_reason,
        enriched_at: rec.enriched_at,
        enrichment_version: rec.enrichment_version,
      }));

      try {
        const { error } = await this.client
          .from("digital_tray_products")
          .upsert(rows, {
            onConflict: "shopify_product_id",
            ignoreDuplicates: false,
          });
        if (error) throw new Error(error.message);
        succeeded += subBatch.length;
        console.log(
          `  ✅ Upserted records ${i + 1}–${i + subBatch.length}`
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        for (const rec of subBatch) {
          errors.push({
            sku: rec.sku,
            shopify_product_id: rec.shopify_product_id,
            error_message: msg,
            stage: "upsert",
            timestamp: new Date().toISOString(),
          });
        }
        console.warn(
          `  ⚠️ Sub-batch ${i + 1}–${i + subBatch.length} failed: ${msg}`
        );
      }
    }

    return { succeeded, failed: errors };
  }

  async logPipelineRun(run: PipelineRun): Promise<void> {
    try {
      await this.client.from("enrichment_pipeline_runs").insert({
        run_id: run.run_id,
        started_at: run.started_at,
        completed_at: run.completed_at,
        products_scanned: run.products_scanned,
        products_enriched: run.products_enriched,
        products_skipped: run.products_skipped,
        products_failed: run.products_failed,
        errors: run.errors,
        status: run.status,
        enrichment_version: run.enrichment_version,
      });
    } catch (e) {
      console.warn("Failed to log pipeline run (non-critical):", e);
    }
  }

  async getEnrichmentStats(): Promise<{
    total: number;
    byConcern: Record<string, number>;
    flaggedForReview: number;
    avgConfidence: number;
  }> {
    const { data, error } = await this.client
      .from("digital_tray_products")
      .select("skin_concerns, ai_confidence_score, requires_human_review")
      .eq("enrichment_version", ENRICHMENT_VERSION);

    if (error) throw new Error(error.message);
    if (!data?.length)
      return { total: 0, byConcern: {}, flaggedForReview: 0, avgConfidence: 0 };

    const byConcern: Record<string, number> = {};
    let flagged = 0;
    let sumConf = 0;
    for (const row of data) {
      for (const c of row.skin_concerns ?? []) {
        byConcern[c] = (byConcern[c] ?? 0) + 1;
      }
      if (row.requires_human_review) flagged++;
      const score = Number(row.ai_confidence_score);
      sumConf += score <= 1 ? score * 100 : score;
    }
    return {
      total: data.length,
      byConcern,
      flaggedForReview: flagged,
      avgConfidence: data.length ? sumConf / data.length : 0,
    };
  }
}
