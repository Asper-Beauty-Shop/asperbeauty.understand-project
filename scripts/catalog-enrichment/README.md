# Catalog Enrichment Pipeline

**Asper Beauty Shop** — AI catalog enrichment for the 3-Click funnel.

Flow: **Shopify (unenriched) → Gemini 2.5 Flash Clinical Auditor (batched, self-healing) → Supabase `digital_tray_products`** + **`enrichment_pipeline_runs`** audit log. Single source of truth: no secondary LLM, no `product_clinical_metadata` table.

## Usage

```bash
# From project root (loads .env automatically)
npm run catalog-enrich
# or
npx tsx scripts/catalog-enrichment/index.ts
```

## Required environment variables

Set in `.env` (or export before running). **Do not commit secrets.**

| Variable | Description |
|----------|-------------|
| `SHOPIFY_STORE_DOMAIN` | e.g. `lovable-project-milns.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` **or** `SHOPIFY_ADMIN_ACCESS_TOKEN` | Storefront API token (Storefront mode) or Admin API token (Admin mode) |
| `GEMINI_API_KEY` | Google AI Studio / Gemini API key |
| `GEMINI_MODEL` | (Optional) Model id, default `gemini-2.5-flash` |
| `SUPABASE_URL` | e.g. `https://qqceibvalkoytafynwoc.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS for upsert) |

- **Storefront mode:** set `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Products are considered unenriched if they lack the `clinical.skin_concerns` metafield and have no `concern:` tag.
- **Admin mode:** set `SHOPIFY_ADMIN_ACCESS_TOKEN`. Products are fetched with query `NOT tag:enriched_v1`.

## Prerequisites

1. **Supabase migrations** applied (in order):
   - `20260303000000_digital_tray_products.sql`
   - `20260303100000_digital_tray_products_enrichment_columns.sql` (adds `spf_value`, `ai_clinical_reasoning`, `review_reason`, and table `enrichment_pipeline_runs`)
   ```bash
   supabase db push
   ```

## Behaviour

- Fetches products in pages (Storefront or Admin, see env above).
- **Batched Gemini 2.5 Flash** audit: products are sent in batches of 10; one API call per batch. **Self-healing:** if a batch fails after 3 retries, that batch’s products are logged as failed and the pipeline continues with the next batch.
- **Strict taxonomy:** Gemini is constrained to the 8 DB enums: `brightening`, `sun_protection`, `dark_circles`, `anti_aging`, `dryness`, `acne`, `sensitivity`, `hyperpigmentation`. Invalid categories are stripped via schema validation.
- Confidence 0–100, clinical_reasoning, spf_value, review_reason. Upserts into `digital_tray_products` in sub-batches of 50 (idempotent on `shopify_product_id`).
- Writes each run to `enrichment_pipeline_runs` (run_id, counts, status, errors).
- Confidence &lt; 60 or stripped categories set `requires_human_review = true`.

## Output

- Console: progress, summary (scanned, enriched, failed, status, duration, products per concern), and any errors.
- DB: `digital_tray_products` updated; `enrichment_pipeline_runs` row per run.

---

## External PDF catalog ingestion (Anthropic Files API)

For **supplier or brand PDFs** (e.g. Vichy, La Roche-Posay catalogs, clinical papers), use the Files API script to upload once and get structured JSON (products, ingredients, skin concerns) without re-uploading the file each time:

```bash
# Requires: pip install anthropic; ANTHROPIC_API_KEY in env
python scripts/anthropic-pdf-catalog-analyze.py /path/to/catalog.pdf --output extracted.json
```

The script maps extractions to the same taxonomies as `digital_tray_products` (skin_concerns, skin_types, key_ingredients). Use the JSON as input to a one-off import or a separate pipeline step into Supabase.
