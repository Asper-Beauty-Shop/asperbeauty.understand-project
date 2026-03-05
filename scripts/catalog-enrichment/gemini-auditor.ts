/**
 * Asper Beauty Shop — Gemini clinical auditor (per-product).
 * Aligned with AI-Powered Architecture Implementation Plan.
 */

import {
  APPROVED_SKIN_CONCERNS,
  APPROVED_SKIN_TYPES,
  CONFIDENCE_THRESHOLD,
  GEMINI_MODEL,
} from "./config.js";
import {
  validateSkinConcerns,
  validateSkinTypes,
  validateKeyIngredients,
  validateConfidenceScore,
} from "./schema-validator.js";
import type {
  GeminiAuditResult,
  ShopifyProduct,
  SkinConcern,
  SkinType,
} from "./types.js";

const CLINICAL_AUDITOR_SYSTEM_PROMPT = `
You are a board-certified clinical dermatologist and cosmetic chemist with 20 years of experience.
Your role is to analyze skincare product data and categorize products with medical precision.

CRITICAL RULES:
1. You MUST only return valid JSON. No markdown, no explanations outside the JSON structure.
2. You MUST use ONLY the approved skin_concerns values (exactly 8). No other concern names.
3. You MUST only use the approved skin_types values provided.
4. Confidence scores must be integers between 0 and 100.
5. If you cannot confidently categorize a product (confidence < 60), set requires_human_review to true.
6. Be clinically precise. A moisturizer with SPF is BOTH "dryness" AND "sun_protection".
7. Vitamin C = "brightening" + "anti_aging" (antioxidant). Never mislabel.
8. Retinol/Retinoids = "anti_aging" + "acne" (cell turnover). Be precise.
9. Caffeine/Peptides around eye area = "dark_circles" + "anti_aging".
10. Hyaluronic Acid alone = "dryness". Not anti_aging unless combined with actives.

APPROVED SKIN_CONCERNS (use ONLY these 8 exact strings, underscores not hyphens):
${APPROVED_SKIN_CONCERNS.join(", ")}

APPROVED SKIN_TYPES (use only these exact strings):
${APPROVED_SKIN_TYPES.join(", ")}

OUTPUT FORMAT (single product):
{
  "skin_concerns": ["concern1", "concern2"],
  "skin_types": ["type1", "type2"],
  "key_ingredients": ["Ingredient1", "Ingredient2"],
  "confidence_score": 85,
  "clinical_reasoning": "Brief clinical explanation of categorization",
  "spf_value": null,
  "requires_human_review": false,
  "review_reason": null
}

For BATCH requests you will receive multiple products. Return a JSON array of objects in the SAME ORDER as the products, one object per product, using the exact format above.
`;

function geminiEndpoint(): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export class GeminiClinicalAuditor {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async auditProduct(product: ShopifyProduct): Promise<GeminiAuditResult> {
    const primarySku =
      product.variants[0]?.sku ||
      product.id.replace("gid://shopify/Product/", "SKU-");
    const cleanDescription = stripHtml(
      product.descriptionHtml || product.description || ""
    );

    const userPrompt = `
PRODUCT AUDIT REQUEST:

Product Title: ${product.title}
SKU: ${primarySku}
Shopify ID: ${product.id}
Existing Tags: ${product.tags?.join(", ") || "None"}

Product Description:
${cleanDescription.substring(0, 2000)}

Please analyze this product and return the JSON categorization.
`.trim();

    const rawResponse = await this.callGemini(userPrompt);
    const parsed = this.parseAndValidate(rawResponse);

    return this.toAuditResult(product, primarySku, parsed);
  }

  private buildBatchPrompt(products: ShopifyProduct[]): string {
    const blocks = products
      .map((p, i) => {
        const sku = p.variants[0]?.sku || p.id.replace("gid://shopify/Product/", "SKU-");
        const desc = stripHtml(p.descriptionHtml || p.description || "").substring(0, 1500);
        return `
--- PRODUCT ${i + 1} (order must match in your response) ---
Product Title: ${p.title}
SKU: ${sku}
Shopify ID: ${p.id}
Existing Tags: ${p.tags?.join(", ") || "None"}

Product Description:
${desc}
`;
      })
      .join("\n");

    return `
BATCH PRODUCT AUDIT REQUEST:
Analyze each product below and return a JSON array of exactly ${products.length} objects, in the same order as the products (product 1 = first object, product 2 = second object, etc.).
Each object must use the exact OUTPUT FORMAT from the system prompt (skin_concerns, skin_types, key_ingredients, confidence_score, clinical_reasoning, spf_value, requires_human_review, review_reason).
${blocks}

Return ONLY the JSON array, no other text.
`.trim();
  }

  private toAuditResult(
    product: ShopifyProduct,
    primarySku: string,
    parsed: {
      skin_concerns: SkinConcern[];
      skin_types: SkinType[];
      key_ingredients: string[];
      confidence_score: number;
      clinical_reasoning: string;
      spf_value: number | null;
      requires_human_review: boolean;
      review_reason: string | null;
    }
  ): GeminiAuditResult {
    return {
      sku: primarySku,
      shopify_product_id: product.id,
      handle: product.handle,
      title: product.title,
      confidence_score: parsed.confidence_score,
      skin_concerns: parsed.skin_concerns,
      skin_types: parsed.skin_types,
      key_ingredients: parsed.key_ingredients,
      clinical_reasoning: parsed.clinical_reasoning,
      spf_value: parsed.spf_value,
      requires_human_review: parsed.requires_human_review,
      review_reason: parsed.review_reason,
    };
  }

  private parseAndValidateBatch(
    rawResponse: string,
    products: ShopifyProduct[]
  ): GeminiAuditResult[] {
    let arr: unknown[];
    try {
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawResponse;
      arr = JSON.parse(jsonString);
    } catch {
      throw new Error(
        `Failed to parse Gemini batch JSON (expected array of ${products.length}): ${rawResponse.slice(0, 300)}`
      );
    }
    if (!Array.isArray(arr) || arr.length !== products.length) {
      throw new Error(
        `Gemini batch returned ${arr.length} items, expected ${products.length}`
      );
    }
    const results: GeminiAuditResult[] = [];
    for (let i = 0; i < products.length; i++) {
      const parsed = this.validateOneItem(arr[i] as Record<string, unknown>);
      const primarySku =
        products[i].variants[0]?.sku ||
        products[i].id.replace("gid://shopify/Product/", "SKU-");
      results.push(
        this.toAuditResult(products[i], primarySku, parsed)
      );
    }
    return results;
  }

  private validateOneItem(parsed: Record<string, unknown>): {
    skin_concerns: SkinConcern[];
    skin_types: SkinType[];
    key_ingredients: string[];
    confidence_score: number;
    clinical_reasoning: string;
    spf_value: number | null;
    requires_human_review: boolean;
    review_reason: string | null;
  } {
    const rawConcerns = (parsed.skin_concerns as string[]) ?? [];
    const rawTypes = (parsed.skin_types as string[]) ?? [];
    const validConcerns = validateSkinConcerns(rawConcerns);
    const validTypes = validateSkinTypes(rawTypes);
    const confidenceScore = validateConfidenceScore(parsed.confidence_score);
    const wasStripped =
      rawConcerns.length !== validConcerns.length ||
      rawTypes.length !== validTypes.length;

    return {
      skin_concerns: validConcerns,
      skin_types: validTypes,
      key_ingredients: validateKeyIngredients(parsed.key_ingredients),
      confidence_score: confidenceScore,
      clinical_reasoning: String(parsed.clinical_reasoning ?? ""),
      spf_value:
        parsed.spf_value != null ? Number(parsed.spf_value) || null : null,
      requires_human_review:
        Boolean(parsed.requires_human_review) ||
        wasStripped ||
        confidenceScore < CONFIDENCE_THRESHOLD,
      review_reason: wasStripped
        ? "AI returned invalid categories that were stripped during validation"
        : (parsed.review_reason as string | null) ?? null,
    };
  }

  /**
   * Batch audit: one Gemini call for up to N products. Returns results in same order as input.
   * Use for self-healing pipeline (orchestrator retries failed batches, logs per-product failures).
   */
  async auditBatch(products: ShopifyProduct[]): Promise<GeminiAuditResult[]> {
    if (products.length === 0) return [];
    if (products.length === 1) return [await this.auditProduct(products[0])];

    const userPrompt = this.buildBatchPrompt(products);
    const rawResponse = await this.callGemini(userPrompt);
    const parsed = this.parseAndValidateBatch(rawResponse, products);
    return parsed;
  }

  private async callGemini(userPrompt: string): Promise<string> {
    const res = await fetch(`${geminiEndpoint()}?key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: CLINICAL_AUDITOR_SYSTEM_PROMPT }],
        },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${text}`);
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }[] };
    };
    const content = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("Gemini returned empty response");
    return content;
  }

  private parseAndValidate(rawResponse: string): {
    skin_concerns: SkinConcern[];
    skin_types: SkinType[];
    key_ingredients: string[];
    confidence_score: number;
    clinical_reasoning: string;
    spf_value: number | null;
    requires_human_review: boolean;
    review_reason: string | null;
  } {
    let parsed: Record<string, unknown>;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawResponse;
      parsed = JSON.parse(jsonString);
    } catch {
      throw new Error(`Failed to parse Gemini JSON: ${rawResponse.slice(0, 200)}`);
    }
    return this.validateOneItem(parsed);
  }
}
