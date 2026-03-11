import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Brand extraction ─────────────────────────────────────────────────

/** Known brands sorted longest-first so "La Roche-Posay" matches before "La" */
const KNOWN_BRANDS: string[] = [
  // Clinical Dermocosmetics
  "La Roche-Posay", "La Roche Posay",
  "CeraVe", "Bioderma", "Vichy", "Eucerin", "Sesderma", "COSRX", "SVR",
  "Avene", "Avène", "Uriage", "Ducray", "Noreva", "ACM", "Isdin",
  "The NewLab", "NewLab", "Rilastil", "Exuviance", "Cetaphil",
  "Acnecinamide", "Bio Balance",
  // L'Oréal Group
  "Lancôme", "Lancome", "Kérastase", "Kerastase", "YSL",
  "Yves Saint Laurent", "Giorgio Armani", "Armani",
  "L'Oréal", "L'Oreal", "Garnier", "Maybelline", "NYX",
  // Luxury Fragrance Houses
  "Carolina Herrera", "Memo Paris", "Van Cleef & Arpels", "Van Cleef",
  "Valentino", "Versace", "Prada", "Gucci", "Dolce & Gabbana", "Dolce Gabbana",
  "Burberry", "Calvin Klein", "Ralph Lauren", "Hugo Boss",
  "Mont Blanc", "Montblanc", "Coach", "Bvlgari", "Bulgari",
  "Narciso Rodriguez", "Jimmy Choo", "Azzaro",
  "Mancera", "Mercedes-Benz", "Mercedes Benz", "Boucheron",
  "Paco Rabanne", "Jean Paul Gaultier",
  // Premium Care
  "Clarins", "Guerlain", "Nuxe", "Dior", "Olaplex", "NeoCell",
  "Estée Lauder", "Estee Lauder", "Clinique", "Origins",
  "Anastasia Beverly Hills",
  // Regional & Jordanian
  "Beesline", "Amina's", "Aminas", "Natalifé", "Natalife",
  // Mid-range
  "Babaria", "Revlon", "Rimmel", "Bourjois", "Max Factor",
  "Essence", "Catrice", "Seventeen", "Eveline", "Pastel",
  // Baby & Mom
  "Medela", "Chicco", "Mustela", "Bepanthen", "Sudocrem",
  "Philips Avent", "NUK", "MAM", "Baby Safe",
  // Hair
  "Tresemme", "TRESemmé", "Schwarzkopf", "Wella",
  // Supplements
  "Solgar", "Nature's Bounty", "Centrum", "Vitabiotics",
].sort((a, b) => b.length - a.length);

/** Product-type keywords that should NOT be captured as brand names */
const PRODUCT_TERM_PATTERN = /^(serum|cream|lotion|gel|foam|wash|cleanser|moistur|mask|oil|spray|toner|peel|scrub|sunscreen|spf|balm|mist|essence|ampoule|eye|lip|hand|body|foot|hair|nail|baby|anti|ultra|hydra|aqua|vitamin|retinol|hyaluronic|salicylic|glycolic|niacin|collagen|peptide|ceramide|whitening|brightening|matte|glow|peeling|exfoli)/i;

function extractBrand(title: string, vendor: string): string {
  const titleLower = title.toLowerCase();
  // 1. Check known brands list (longest match first)
  for (const brand of KNOWN_BRANDS) {
    if (titleLower.startsWith(brand.toLowerCase())) {
      return brand;
    }
  }
  // 2. Try first word only — but reject if it looks like a product term
  const words = title.split(/\s+/);
  const firstWord = words[0] || "";
  if (firstWord && !PRODUCT_TERM_PATTERN.test(firstWord) && firstWord.length > 2) {
    // If vendor is generic "Asper Beauty", use first word as brand
    if (vendor === "Asper Beauty" || !vendor) {
      return firstWord;
    }
  }
  // 3. Use vendor if it's not the generic store name
  if (vendor && vendor !== "Asper Beauty") {
    return vendor;
  }
  return firstWord || "Unknown";
}

// ── Brand-tier price normalization ───────────────────────────────────

/** Budget/mid-range brands whose CSV prices are in fils (÷100 to get JOD) */
const BUDGET_BRANDS = new Set([
  "essence", "rimmel", "seventeen", "catrice", "bourjois",
  "acnecinamide", "bio balance", "cetaphil", "eveline",
  "pastel", "baby safe",
  "chicco", "mustela", "medela", "philips avent", "nuk", "mam",
  "sudocrem", "bepanthen",
]);

/** Mid-range brands: fils if price > 50 */
const MID_BRANDS = new Set([
  "maybelline", "babaria", "beesline", "revlon", "max factor",
  "garnier", "nyx", "l'oréal", "l'oreal",
]);

/**
 * Smart price normalization.
 * 
 * CSV data has mixed conventions:
 * - Budget brands: prices in piasters (300 = 3.00 JOD) → ÷100
 * - Premium brands: prices in JOD (125.00 = 125 JOD) → keep as-is
 * - Some mid-range items already in JOD (12.30) → detect by decimal or low value
 */
function normalizeShopifyPrice(rawPrice: number, brand: string): number {
  const brandLower = brand.toLowerCase();

  // Prices that are clearly already in JOD (have meaningful decimals like 12.30, 10.80)
  // These are typically < 50 and have non-zero decimal parts
  const decimalPart = rawPrice % 1;
  const hasSignificantDecimal = decimalPart > 0.01 && decimalPart < 0.99;

  // If raw price has significant decimals (like 12.30, 10.80) → already JOD
  if (hasSignificantDecimal && rawPrice < 100) {
    return rawPrice;
  }

  // Budget brands: if price >= 100, it's in fils → ÷100
  if (BUDGET_BRANDS.has(brandLower)) {
    return rawPrice >= 100 ? rawPrice / 100 : rawPrice;
  }

  // Mid-range brands: if price >= 100 and looks like fils pattern
  if (MID_BRANDS.has(brandLower)) {
    return rawPrice >= 100 ? rawPrice / 100 : rawPrice;
  }

  // Premium/luxury/clinical: keep as-is (prices are real JOD)
  // Lancôme 125 JOD, Van Cleef 142 JOD, etc. are legitimate
  return rawPrice;
}

// ── Clinical mapping heuristics ──────────────────────────────────────

type SkinConcern =
  | "Concern_Acne"
  | "Concern_Hydration"
  | "Concern_Aging"
  | "Concern_Sensitivity"
  | "Concern_Pigmentation"
  | "Concern_Redness"
  | "Concern_Oiliness"
  | "Concern_Brightening"
  | "Concern_SunProtection"
  | "Concern_DarkCircles"
  | "Concern_AntiAging"
  | "Concern_Dryness";

type RegimenStep =
  | "Step_1_Cleanser"
  | "Step_2_Treatment"
  | "Step_3_Protection"
  | "Step_1"
  | "Step_2"
  | "Step_3";

interface MappingResult {
  primary_concern: SkinConcern;
  regimen_step: RegimenStep;
}

const CONCERN_RULES: Array<{ pattern: RegExp; concern: SkinConcern }> = [
  { pattern: /acne|blemish|salicylic|anti.?blemish|pimple/i, concern: "Concern_Acne" },
  { pattern: /spf|sunscreen|sun\s*protect|uv\s*protect|solar/i, concern: "Concern_SunProtection" },
  { pattern: /retinol|anti.?aging|anti.?age|wrinkle|firming|lift|renergie|absolue/i, concern: "Concern_AntiAging" },
  { pattern: /bright|vitamin\s*c|glow|radiance|luminous|clarifique/i, concern: "Concern_Brightening" },
  { pattern: /pigment|dark\s*spot|melasma|even\s*tone|whitening/i, concern: "Concern_Pigmentation" },
  { pattern: /dark\s*circle|eye\s*contour|under.?eye|age\s*rewind/i, concern: "Concern_DarkCircles" },
  { pattern: /redness|rosacea|calming|anti.?redness/i, concern: "Concern_Redness" },
  { pattern: /oil\s*control|mattif|oily|sebum|shine.?free|matte.*pore/i, concern: "Concern_Oiliness" },
  { pattern: /sensitiv|sooth|gentle|irritat|atopic|sensibio/i, concern: "Concern_Sensitivity" },
  { pattern: /dry|dehydrat/i, concern: "Concern_Dryness" },
  { pattern: /hydra|hyaluronic|moistur|aqua|h\.a\./i, concern: "Concern_Hydration" },
];

const STEP_RULES: Array<{ pattern: RegExp; step: RegimenStep }> = [
  { pattern: /cleanser|wash|foam|micellar|makeup\s*remov|cleansing/i, step: "Step_1_Cleanser" },
  { pattern: /spf|sunscreen|sun\s*protect|solar/i, step: "Step_3_Protection" },
  { pattern: /moistur|cream|lotion|balm|emulsion|day\s*cream|night\s*cream/i, step: "Step_3_Protection" },
  { pattern: /serum|treatment|ampoule|booster|concentrate|essence|oil|mask|peel|exfoli|toner|tonic/i, step: "Step_2_Treatment" },
];

/**
 * Non-skincare categories that should NOT be mapped to clinical concerns.
 * These get a neutral default mapping.
 */
const NON_CLINICAL_PATTERNS: Array<{ pattern: RegExp; category: string }> = [
  // Baby & Mom
  { pattern: /breast\s*pump|nursing\s*pad|nipple\s*shield|baby\s*cup|bustier|feeder|breastmilk|diaper|pacifier|teether/i, category: "baby_mom" },
  { pattern: /medela|chicco|mustela|philips\s*avent|nuk\b|mam\b/i, category: "baby_mom" },
  // Fragrances
  { pattern: /eau\s*de\s*(parfum|toilette)|edp|edt|cologne|fragrance|perfume|oud/i, category: "fragrance" },
  // Hair Care (non-clinical)
  { pattern: /shampoo|conditioner|hair\s*mask|hair\s*spray|hair\s*oil|hair\s*serum|curl|straighten|keratin/i, category: "hair_care" },
  // Deodorant
  { pattern: /deodorant|antiperspirant|deo\s*roll/i, category: "deodorant" },
  // Makeup (pure cosmetics, non-treatment)
  { pattern: /mascara|lipstick|lip\s*gloss|eyeshadow|eyeliner|blush|bronzer|highlighter|concealer|foundation|powder|primer|brow\s*pencil|brow\s*mascara|nail\s*polish/i, category: "makeup" },
];

function mapProduct(text: string, productType: string): MappingResult & { is_clinical: boolean } {
  const combined = `${text} ${productType}`;

  // Check if this is a non-clinical product first
  for (const rule of NON_CLINICAL_PATTERNS) {
    if (rule.pattern.test(combined)) {
      // Non-clinical products get default mapping
      // Makeup with SPF still gets SunProtection
      if (rule.category === "makeup" && /spf|sunscreen/i.test(combined)) {
        return { primary_concern: "Concern_SunProtection", regimen_step: "Step_3_Protection", is_clinical: false };
      }
      // Deodorant with whitening gets Pigmentation
      if (rule.category === "deodorant" && /whitening/i.test(combined)) {
        return { primary_concern: "Concern_Pigmentation", regimen_step: "Step_2_Treatment", is_clinical: false };
      }
      return { primary_concern: "Concern_Hydration", regimen_step: "Step_2_Treatment", is_clinical: false };
    }
  }

  // Clinical product mapping
  let concern: SkinConcern = "Concern_Hydration";
  for (const rule of CONCERN_RULES) {
    if (rule.pattern.test(combined)) { concern = rule.concern; break; }
  }

  let step: RegimenStep = "Step_2_Treatment";
  for (const rule of STEP_RULES) {
    if (rule.pattern.test(combined)) { step = rule.step; break; }
  }

  return { primary_concern: concern, regimen_step: step, is_clinical: true };
}

// ── Shopify Storefront API fetch ─────────────────────────────────────

const SHOPIFY_DOMAIN = "lovable-project-milns.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

const PRODUCTS_QUERY = `
query($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    edges {
      node {
        id handle title vendor productType tags
        availableForSale
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 1) { edges { node { url } } }
      }
    }
  }
}`;

interface ShopifyNode {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string } }> };
}

async function fetchShopifyPage(
  token: string,
  first: number,
  after?: string,
): Promise<{
  products: ShopifyNode[];
  hasNext: boolean;
  endCursor: string | null;
}> {
  const url = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: { first, after: after ?? null },
    }),
  });

  if (!res.ok) throw new Error(`Shopify ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e: { message: string }) => e.message).join("; "));

  const data = json.data.products;
  return {
    products: data.edges.map((e: { node: unknown }) => e.node),
    hasNext: data.pageInfo.hasNextPage,
    endCursor: data.pageInfo.endCursor,
  };
}

// ── Main handler ─────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const storefrontToken = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN")!;

    const authHeader = req.headers.get("authorization") ?? "";
    const bearerToken = authHeader.replace("Bearer ", "").trim();

    const supabase = createClient(supabaseUrl, serviceKey);

    // Validate caller
    if (bearerToken && bearerToken !== serviceKey) {
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${bearerToken}` } },
      });
      const { data: { user }, error: authErr } = await userClient.auth.getUser();
      if (authErr || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin"]);
      if (!roles?.length) {
        return new Response(JSON.stringify({ error: "Admin role required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Parse params
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "200"), 1000);
    const dryRun = url.searchParams.get("dry_run") === "true";
    const batchSize = 50;

    let synced = 0, skipped = 0, failed = 0;
    const errors: string[] = [];
    const priceAudit: Array<{ handle: string; rawPrice: number; normalizedPrice: number; brand: string }> = [];
    let cursor: string | undefined = url.searchParams.get("after") ?? undefined;
    let fetched = 0;

    while (fetched < limit) {
      const pageSize = Math.min(batchSize, limit - fetched);
      const page = await fetchShopifyPage(storefrontToken, pageSize, cursor);
      fetched += page.products.length;

      for (const p of page.products) {
        try {
          if (!p.images.edges.length) { skipped++; continue; }

          // 1. Extract real brand from title
          const brand = extractBrand(p.title, p.vendor);

          // 2. Smart price normalization
          const rawPrice = parseFloat(p.priceRange.minVariantPrice.amount);
          const price = normalizeShopifyPrice(rawPrice, brand);

          // 3. Enhanced clinical tagging
          const combinedText = `${p.title} ${p.productType} ${p.tags.join(" ")}`;
          const { primary_concern, regimen_step } = mapProduct(combinedText, p.productType);

          const row = {
            handle: p.handle,
            title: p.title,
            brand: brand || null,
            price,
            image_url: p.images.edges[0].node.url,
            primary_concern,
            regimen_step,
            inventory_total: p.availableForSale ? 10 : 0,
            tags: p.tags,
          };

          // Track price audit for dry runs
          if (dryRun) {
            priceAudit.push({ handle: p.handle, rawPrice, normalizedPrice: price, brand });
            synced++;
            continue;
          }

          const { error: upsertErr } = await supabase
            .from("products")
            .upsert(row, { onConflict: "handle", ignoreDuplicates: false })
            .select("id");

          if (upsertErr) {
            failed++;
            errors.push(`${p.handle}: ${upsertErr.message}`);
          } else {
            synced++;
          }
        } catch (e) {
          failed++;
          errors.push(`${p.handle}: ${(e as Error).message}`);
        }
      }

      if (!page.hasNext || page.products.length === 0) break;
      cursor = page.endCursor ?? undefined;
    }

    const result = {
      status: "complete",
      dry_run: dryRun,
      fetched,
      synced,
      skipped,
      failed,
      next_cursor: cursor ?? null,
      errors: errors.slice(0, 20),
      ...(dryRun ? { price_audit_sample: priceAudit.slice(0, 30) } : {}),
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
