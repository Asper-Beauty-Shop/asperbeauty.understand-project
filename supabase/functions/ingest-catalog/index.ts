import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ─── Brand Normalization Dictionary ─── */
const BRAND_CORRECTIONS: Record<string, string> = {
  "vichy labs": "Vichy",
  "vichy laboratories": "Vichy",
  "la roche posay": "La Roche-Posay",
  "laroche-posay": "La Roche-Posay",
  "laroche posay": "La Roche-Posay",
  "la roche-posay": "La Roche-Posay",
  bioderma: "Bioderma",
  eucerin: "Eucerin",
  cerave: "CeraVe",
  "sesderma": "Sesderma",
  "avene": "Avène",
  "svr": "SVR",
  "uriage": "Uriage",
  "ducray": "Ducray",
  "nuxe": "Nuxe",
  "the ordinary": "The Ordinary",
  "ordinary": "The Ordinary",
};

function normalizeBrand(raw: string): string {
  const key = raw.trim().toLowerCase();
  return BRAND_CORRECTIONS[key] || raw.trim();
}

/* ─── Valid Enumerations ─── */
const VALID_CONCERNS = new Set([
  "Concern_Hydration", "Concern_Acne", "Concern_AntiAging", "Concern_Sensitivity",
  "Concern_Pigmentation", "Concern_Brightening", "Concern_Dryness",
  "Concern_SunProtection", "Concern_DarkCircles", "Concern_Redness",
  "Concern_Oiliness", "Concern_Aging",
]);

const VALID_REGIMEN_STEPS = new Set([
  "Step_1_Cleanser", "Step_2_Treatment", "Step_3_Protection",
  "Step_1_Wash", "Step_2_Serum", "Step_3_Moisturizer", "Step_3_Sunscreen",
]);

const VALID_CATEGORIES = new Set([
  "Skincare", "Haircare", "Body Care", "Sun Care", "Makeup",
  "Fragrance", "Supplements", "Baby Care", "Men's Care", "Oral Care",
  "Medical Devices", "Dermocosmetics",
]);

/* ─── CSV Parser (handles quoted fields, commas inside quotes) ─── */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });
}

/* ─── Validation & Transform ─── */
interface ValidProduct {
  name: string;
  title: string | null;
  brand: string;
  category: string;
  description: string;
  price: number;
  image_url: string | null;
  handle: string | null;
  primary_concern: string | null;
  regimen_step: string | null;
  tags: string[];
  key_ingredients: string[];
  pharmacist_note: string | null;
  clinical_badge: string | null;
  availability_status: string;
  in_stock: boolean;
  is_hero: boolean;
  is_bestseller: boolean;
}

interface QuarantinedItem {
  row: number;
  raw: Record<string, string>;
  errors: string[];
}

function transformRow(raw: Record<string, string>, rowNum: number): { product?: ValidProduct; quarantine?: QuarantinedItem } {
  const errors: string[] = [];

  // Required fields
  const name = raw.name?.trim();
  if (!name) errors.push("Missing required field: name");

  const brand = normalizeBrand(raw.brand || raw.vendor || "");
  if (!brand) errors.push("Missing required field: brand");

  const category = raw.category?.trim() || "";
  if (!category) {
    errors.push("Missing required field: category");
  } else if (!VALID_CATEGORIES.has(category)) {
    errors.push(`Invalid category: "${category}". Must be one of: ${[...VALID_CATEGORIES].join(", ")}`);
  }

  const priceStr = raw.price?.trim();
  const price = priceStr ? parseFloat(priceStr) : NaN;
  if (isNaN(price) || price < 0) errors.push(`Invalid price: "${priceStr}"`);

  const description = raw.description?.trim() || `${brand} ${name || ""}`.trim();

  // Optional fields with validation
  const primaryConcern = raw.primary_concern?.trim() || null;
  if (primaryConcern && !VALID_CONCERNS.has(primaryConcern)) {
    errors.push(`Invalid primary_concern: "${primaryConcern}". Must be one of: ${[...VALID_CONCERNS].join(", ")}`);
  }

  const regimenStep = raw.regimen_step?.trim() || null;
  if (regimenStep && !VALID_REGIMEN_STEPS.has(regimenStep)) {
    errors.push(`Invalid regimen_step: "${regimenStep}"`);
  }

  // Tags — max 5
  const tags = (raw.tags || "")
    .split(/[;|,]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5);

  // Key ingredients — max 8
  const keyIngredients = (raw.key_ingredients || "")
    .split(/[;|,]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (errors.length > 0) {
    return { quarantine: { row: rowNum, raw, errors } };
  }

  // Generate handle from name if missing
  const handle = raw.handle?.trim() || name!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return {
    product: {
      name: name!,
      title: raw.title?.trim() || name!,
      brand,
      category,
      description,
      price,
      image_url: raw.image_url?.trim() || null,
      handle,
      primary_concern: primaryConcern,
      regimen_step: regimenStep,
      tags,
      key_ingredients: keyIngredients,
      pharmacist_note: raw.pharmacist_note?.trim() || null,
      clinical_badge: raw.clinical_badge?.trim() || null,
      availability_status: raw.availability_status?.trim() || "in_stock",
      in_stock: raw.in_stock?.toLowerCase() !== "false",
      is_hero: raw.is_hero?.toLowerCase() === "true",
      is_bestseller: raw.is_bestseller?.toLowerCase() === "true",
    },
  };
}

/* ─── Main Handler ─── */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check — admin only
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.claims.sub;

    // Check admin role using service client
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: roleCheck } = await serviceClient.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!roleCheck) {
      return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: corsHeaders });
    }

    // Parse input — support JSON array or CSV text
    const contentType = req.headers.get("content-type") || "";
    let rawRows: Record<string, string>[];

    if (contentType.includes("application/json")) {
      const body = await req.json();
      rawRows = Array.isArray(body.products) ? body.products : Array.isArray(body) ? body : [];
    } else if (contentType.includes("text/csv") || contentType.includes("text/plain")) {
      const csvText = await req.text();
      rawRows = parseCSV(csvText);
    } else {
      // Try JSON first, fallback to CSV
      const text = await req.text();
      try {
        const parsed = JSON.parse(text);
        rawRows = Array.isArray(parsed.products) ? parsed.products : Array.isArray(parsed) ? parsed : [];
      } catch {
        rawRows = parseCSV(text);
      }
    }

    if (!rawRows.length) {
      return new Response(
        JSON.stringify({ error: "No products found in payload. Send JSON array or CSV." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Transform & validate
    const validProducts: ValidProduct[] = [];
    const quarantined: QuarantinedItem[] = [];

    rawRows.forEach((raw, idx) => {
      const result = transformRow(raw, idx + 1);
      if (result.product) validProducts.push(result.product);
      if (result.quarantine) quarantined.push(result.quarantine);
    });

    // Batch upsert (50 per batch)
    const BATCH_SIZE = 50;
    let insertedCount = 0;
    const updatedCount = 0; // placeholder for future update tracking
    const batchErrors: string[] = [];

    for (let i = 0; i < validProducts.length; i += BATCH_SIZE) {
      const batch = validProducts.slice(i, i + BATCH_SIZE);

      const { data, error } = await serviceClient
        .from("products")
        .upsert(batch, { onConflict: "handle", ignoreDuplicates: false })
        .select("id");

      if (error) {
        batchErrors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
      } else {
        insertedCount += data?.length || 0;
      }
    }

    const result = {
      total_received: rawRows.length,
      valid: validProducts.length,
      quarantined: quarantined.length,
      inserted: insertedCount,
      batch_errors: batchErrors,
      quarantine_details: quarantined.slice(0, 100), // Cap response size
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Ingestion error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
