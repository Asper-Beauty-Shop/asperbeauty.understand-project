/**
 * Asper Beauty Shop — Gemini clinical auditor (per-product).
 * Aligned with AI-Powered Architecture Implementation Plan.
 */

import {
  APPROVED_SKIN_CONCERNS,
  APPROVED_SKIN_TYPES,
  CONFIDENCE_THRESHOLD,
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
2. You MUST only use the approved skin_concerns values provided.
3. You MUST only use the approved skin_types values provided.
4. Confidence scores must be integers between 0 and 100.
5. If you cannot confidently categorize a product (confidence < 60), set requires_human_review to true.
6. Be clinically precise. A moisturizer with SPF is BOTH "dryness" AND "sun-protection".
7. Vitamin C = "brightening" + "anti-aging" (antioxidant). Never mislabel.
8. Retinol/Retinoids = "anti-aging" + "acne" (cell turnover). Be precise.
9. Caffeine/Peptides around eye area = "dark-circles" + "anti-aging".
10. Hyaluronic Acid alone = "dryness". Not anti-aging unless combined with actives.

APPROVED SKIN_CONCERNS (use only these exact strings):
${APPROVED_SKIN_CONCERNS.join(", ")}

APPROVED SKIN_TYPES (use only these exact strings):
${APPROVED_SKIN_TYPES.join(", ")}

OUTPUT FORMAT:
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
`;

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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

  /** Batch audit: runs one product at a time (plan specifies per-product with retries in orchestrator). */
  async auditBatch(products: ShopifyProduct[]): Promise<GeminiAuditResult[]> {
    const results: GeminiAuditResult[] = [];
    for (const p of products) {
      results.push(await this.auditProduct(p));
    }
    return results;
  }

  private async callGemini(userPrompt: string): Promise<string> {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${this.apiKey}`, {
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
}
