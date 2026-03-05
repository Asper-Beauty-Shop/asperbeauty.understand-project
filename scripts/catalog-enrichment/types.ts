/**
 * Asper Beauty Shop — Catalog Enrichment Pipeline
 * Shared TypeScript types. Aligned with AI-Powered Architecture Implementation Plan.
 */

/** Exactly 8 DB enums for digital_tray_products — single source of truth. */
export const APPROVED_SKIN_CONCERNS = [
  "brightening",
  "sun_protection",
  "dark_circles",
  "anti_aging",
  "dryness",
  "acne",
  "sensitivity",
  "hyperpigmentation",
] as const;

export type SkinConcern = (typeof APPROVED_SKIN_CONCERNS)[number];

export const APPROVED_SKIN_TYPES = [
  "oily",
  "dry",
  "combination",
  "sensitive",
  "normal",
  "all",
] as const;

export type SkinType = (typeof APPROVED_SKIN_TYPES)[number];

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  variants: ShopifyVariant[];
  metafields: ShopifyMetafield[];
}

export interface ShopifyVariant {
  id?: string;
  sku: string;
  price: string;
  title?: string;
  availableForSale?: boolean;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
}

/** Result from Gemini clinical audit (single product). */
export interface GeminiAuditResult {
  sku: string;
  shopify_product_id: string;
  handle?: string;
  title?: string;
  confidence_score: number; // 0–100
  skin_concerns: SkinConcern[];
  skin_types: SkinType[];
  key_ingredients: string[];
  clinical_reasoning: string;
  spf_value: number | null;
  requires_human_review: boolean;
  review_reason: string | null;
}

/** Record written to digital_tray_products. */
export interface EnrichmentRecord {
  shopify_product_id: string;
  sku: string;
  handle?: string;
  title?: string;
  skin_concerns: SkinConcern[];
  skin_types: SkinType[];
  key_ingredients: string[];
  spf_value: number | null;
  ai_confidence_score: number; // 0–100 in API; stored 0–1 in DB for backward compat
  ai_clinical_reasoning: string;
  requires_human_review: boolean;
  review_reason: string | null;
  enriched_at: string;
  enrichment_version: string;
}

/** One pipeline run for audit log. */
export interface PipelineRun {
  run_id: string;
  started_at: string;
  completed_at: string | null;
  products_scanned: number;
  products_enriched: number;
  products_skipped: number;
  products_failed: number;
  errors: PipelineError[];
  status: "running" | "completed" | "failed" | "partial";
  enrichment_version?: string;
}

export interface PipelineError {
  sku: string;
  shopify_product_id: string;
  error_message: string;
  stage: "extraction" | "analysis" | "validation" | "upsert";
  timestamp: string;
}

/** Legacy / backward compat: same as GeminiAuditResult with snake_case where needed. */
export interface ClinicalAuditResult {
  shopify_id: string;
  sku: string;
  handle: string;
  title: string;
  skin_concerns: SkinConcern[];
  skin_types: SkinType[];
  key_ingredients: string[];
  clinical_justification: string;
  clinical_reasoning: string;
  confidence_score: number;
  spf_value: number | null;
  requires_human_review: boolean;
  review_reason: string | null;
}

/** Row shape for digital_tray_products (DB). */
export interface DigitalTrayProduct {
  shopify_product_id: string;
  sku: string;
  handle: string;
  title: string;
  skin_concerns: string[];
  skin_types: string[];
  key_ingredients: string[];
  clinical_justification?: string;
  ai_clinical_reasoning?: string;
  ai_confidence_score: number;
  spf_value?: number | null;
  requires_human_review: boolean;
  review_reason?: string | null;
  enriched_at: string;
  enrichment_version: string;
}
