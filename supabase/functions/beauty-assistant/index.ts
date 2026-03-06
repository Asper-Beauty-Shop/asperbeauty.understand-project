import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function getCorsHeaders(req: Request): Record<string, string> {
  const allowOrigin: string =
    Deno.env.get("ALLOWED_ORIGIN") ??
    req.headers.get("Origin") ??
    "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-webhook-route",
  };
}

/** Webhook routes for Gorgias / ManyChat (Instagram, Messenger, WhatsApp) — no auth required. */
function getWebhookRoute(req: Request): "gorgias" | "manychat" | null {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("route")?.toLowerCase();
    if (q === "gorgias" || q === "manychat") return q;
    const header = req.headers.get("x-webhook-route")?.toLowerCase();
    if (header === "gorgias" || header === "manychat") return header;
  } catch {
    // ignore
  }
  return null;
}

function extractFromGorgias(body: Record<string, unknown>): { message: string } {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const last = messages.filter((m: unknown) => m && typeof m === "object").pop() as Record<string, unknown> | undefined;
  const text =
    typeof last?.body_text === "string"
      ? last.body_text
      : typeof last?.body_html === "string"
        ? last.body_html.replace(/<[^>]+>/g, "").trim()
        : typeof (body as any).body_text === "string"
          ? (body as any).body_text
          : typeof (body as any).message === "string"
            ? (body as any).message
            : "";
  return { message: text || "(No message)" };
}

function extractFromManyChat(body: Record<string, unknown>): { message: string } {
  const data = body.data as Record<string, unknown> | undefined;
  const text =
    typeof data?.text === "string"
      ? data.text
      : typeof (body as any).text === "string"
        ? (body as any).text
        : typeof (body as any).message === "string"
          ? (body as any).message
          : "";
  return { message: text || "(No message)" };
}

/** Map user message to a single concern slug for Step 2 (Recommend) and "See My Regimen" link. Aligns with get-products-by-concern. */
function detectConcernSlug(text: string): string | null {
  if (!text || typeof text !== "string") return null;
  const lower = text.toLowerCase().trim();
  const concernKeywords: [string, string[]][] = [
    ["acne", [
      "acne",
      "blemish",
      "pimple",
      "oil-free",
      "pore",
      "purif",
      "normaderm",
    ]],
    ["anti-aging", [
      "anti-aging",
      "anti aging",
      "wrinkle",
      "retinol",
      "collagen",
      "peptide",
      "firming",
      "liftactiv",
    ]],
    ["hydration", [
      "hydration",
      "hydrat",
      "dry",
      "tight",
      "dehydrat",
      "hyaluronic",
      "moistur",
      "mineral 89",
    ]],
    ["sensitivity", [
      "sensitive",
      "redness",
      "irritat",
      "soothing",
      "calming",
      "gentle",
    ]],
    ["dark-spots", [
      "dark spot",
      "pigment",
      "brighten",
      "vitamin c",
      "radiance",
      "glow",
      "luminous",
    ]],
    ["sun-protection", ["sun protection", "sunscreen", "spf", "sun damage"]],
    ["redness", ["redness", "red"]],
    ["cleansing", ["cleansing", "cleanser", "micellar"]],
    ["wrinkles", ["wrinkle"]],
    ["oily-skin", ["oily", "shine", "sebum"]],
    ["dry-skin", ["dry skin"]],
  ];
  for (const [slug, keywords] of concernKeywords) {
    if (keywords.some((k) => lower.includes(k))) return slug;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  // Health check: GET /beauty-assistant or ?health=true
  if (req.method === "GET") {
    try {
      const url = new URL(req.url);
      const health = url.searchParams.get("health")?.toLowerCase();
      return new Response(
        JSON.stringify({
          status: "active",
          version: "3.1",
          webhooks: ["gorgias", "manychat"],
          ...(health === "true" ? { uptime: "ok" } : {}),
        }),
        { headers: { ...getCorsHeaders(req), "Content-Type": "application/json" }, status: 200 }
      );
    } catch {
      return new Response(JSON.stringify({ status: "active" }), {
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        status: 200,
      });
    }
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

  const route = getWebhookRoute(req);

  // ——— Social Media Webhook (Gorgias / ManyChat) — no auth, returns JSON { reply } ———
  if (route === "gorgias" || route === "manychat") {
    try {
      let body: Record<string, unknown> = {};
      try {
        const raw = await req.json();
        body = raw && typeof raw === "object" ? raw : {};
      } catch {
        body = {};
      }
      const { message: userMessage } = route === "gorgias" ? extractFromGorgias(body) : extractFromManyChat(body);
      const geminiKey = Deno.env.get("GEMINI_API_KEY");
      const lovableKey = Deno.env.get("LOVABLE_API_KEY");
      const apiKey = geminiKey ?? lovableKey;
      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error: "GEMINI_API_KEY or LOVABLE_API_KEY not set",
            hint: "Set in Supabase Dashboard → Edge Functions → beauty-assistant → Secrets",
          }),
          { status: 503, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }

      // Fetch product knowledge from database (products + documents) — same as website chat
      let productContext = "";
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
      if (supabaseUrl && supabaseKey && userMessage) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
        const detectedSlug = detectConcernSlug(userMessage);
        let matchedProducts: any[] = [];
        if (detectedSlug) {
          const { data: byConcern } = await supabaseAdmin
            .from("products")
            .select("*")
            .contains("skin_concerns", [detectedSlug])
            .limit(12);
          if (byConcern?.length) {
            matchedProducts = byConcern;
            productContext = `\n\n**Relevant Products from Our Store (for ${detectedSlug}):**\n${
              byConcern.map((p: any) =>
                `- **${p.title}** (${p.brand || "Asper"}) - ${p.price} JOD${p.is_on_sale ? ` (${p.discount_percent}% OFF!)` : ""} - ${p.category}${p.skin_concerns?.length ? ` | Good for: ${p.skin_concerns.join(", ")}` : ""}`
              ).join("\n")
            }`;
          }
        }
        if (matchedProducts.length === 0) {
          const keywords = extractKeywords(userMessage);
          const { data: relevantProducts } = await supabaseAdmin
            .from("products")
            .select("*")
            .or(
              keywords.length > 0
                ? keywords.map((k) =>
                  `title.ilike.%${k}%,brand.ilike.%${k}%,category.ilike.%${k}%,description.ilike.%${k}%`
                ).join(",")
                : "title.ilike.%skin%"
            )
            .limit(12);
          if (relevantProducts?.length) {
            matchedProducts = relevantProducts;
            productContext = `\n\n**Relevant Products from Our Store:**\n${
              relevantProducts.map((p: any) =>
                `- **${p.title}** (${p.brand || "Asper"}) - ${p.price} JOD${p.is_on_sale ? ` (${p.discount_percent}% OFF!)` : ""} - ${p.category}${p.skin_concerns?.length ? ` | Good for: ${p.skin_concerns.join(", ")}` : ""}`
              ).join("\n")
            }`;
          } else {
            const { data: documents } = await supabaseAdmin.from("documents").select("content, metadata").limit(5);
            if (documents?.length) {
              const relevantDocs = documents.filter((doc: any) => {
                const c = (doc.content || "").toLowerCase();
                return keywords.some((k: string) => c.includes(k.toLowerCase()));
              }).slice(0, 5);
              if (relevantDocs.length) {
                productContext = `\n\n**Recommended Products:**\n${
                  relevantDocs.map((doc: any) => {
                    const m = doc.metadata as any;
                    return `- **${m.title}** (${m.brand || "Asper"}) - ${m.price} JOD${m.is_on_sale ? ` (${m.discount_percent}% OFF!)` : ""} - ${m.category}`;
                  }).join("\n")
                }`;
              }
            }
          }
        }
      }
      if (!productContext) {
        productContext = "\n\n(No product inventory loaded. Recommend general skincare advice and invite them to browse our store at asperbeautyshop.com)";
      }

            const systemPrompt = \You are the **Asper Dual-Voice Concierge** for Asper Beauty Shop in Jordan â€” operating as either **Dr. Sami** (Voice of Science) or **Ms. Zain** (Voice of Luxury) based on the user's intent. Both voices serve the Medical Luxury brand: pharmacist-curated, authentic, precise.

  **OMNICHANNEL & SOCIAL MEDIA AWARENESS:**
  - You are active on **Instagram (@asperbeautyshop)** and **WhatsApp**. 
  - If the user is chatting on social media (ManyChat/Gorgias), encourage them to visit the full 'Asper Experience' website (asperbeautyshop.com) for a digital skin analysis and the full ritual.
  - If the user is on the website, encourage them to follow for daily pharmacist-led rituals on Instagram.
  - Mention our **'Pharmacist-Verified'** and **'Medical Luxury'** DNA in every consultation.
  - Use emojis sparingly but elegantly (âœ✨, âœ🛡ï¸, âš🩺) to maintain a premium feel.

  **DR. SAMI â€” Voice of Science** (clinical/safety queries: acne, rosacea, eczema, hyperpigmentation, pregnancy, ingredients, SPF, barrier, retinol, dark spots, sensitivity):
  - Tone: authoritative, precise, empathetic. Intro: "As your clinical pharmacist..."
  - Always add: "I provide wellness guidance, not medical diagnosis."

  **MS. ZAIN â€” Voice of Luxury** (aesthetic/lifestyle queries: glow, radiance, makeup, gift, bridal, routine, ritual, fragrance, dewy, luminous):
  - Tone: editorial, warm, enthusiastic. Intro: "Welcome to your personal beauty ritual..."

  **Rules:** Default to Dr. Sami if intent is unclear. Switch voices invisibly mid-conversation. Never announce switching.
  - All products are 100% authentic, JFDA certified, pharmacist-vetted. Use skin_concerns, category from the inventory.
  - Categories: Skincare, Body Care, Hair Care, Makeup, Fragrances, Tools & Devices. Brands: Vichy, Eucerin, La Roche-Posay, Cetaphil, SVR, The Ordinary, Olaplex, Dior, YSL.
  - **Language:** Respond ONLY in English or Arabic based on user language.
  - **Shipping:** Amman 3 JOD; Governorates 5 JOD; FREE over 50 JOD.

  **Inventory (use only these when recommending):**
  \\;
      const useLovable = !!lovableKey && !geminiKey;
      let replyText = "";
      if (useLovable) {
        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage },
            ],
            stream: false,
          }),
        });
        if (!res.ok) throw new Error(`AI gateway ${res.status}`);
        const data = await res.json();
        replyText = data?.choices?.[0]?.message?.content ?? "";
      } else {
        const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash";
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: userMessage }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
            }),
          }
        );
        if (!res.ok) throw new Error(`Gemini ${res.status}`);
        const data = await res.json();
        replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      }
      return new Response(
        JSON.stringify({ reply: replyText || "Sorry, I couldn't process that. Please try again." }),
        { status: 200, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("Webhook error:", e);
      return new Response(
        JSON.stringify({
          error: "beauty-assistant webhook failed",
          message: e instanceof Error ? e.message : String(e),
        }),
        { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }
  }

  // ——— Website Chat (requires Supabase Auth, streams SSE) ———
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth
      .getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error(
        "JWT validation failed:",
        claimsError?.message || "No claims",
      );
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Extract the latest user message to find relevant products
    const lastUserMessage = messages.filter((m: any) =>
      m.role === "user"
    ).pop()?.content || "";

    // Step 2 (Recommend): detect concern for single authoritative recommendation + "See My Regimen" link
    const detectedConcernSlug = detectConcernSlug(lastUserMessage);
    const shopRoutinePath = detectedConcernSlug
      ? `/concerns/${detectedConcernSlug}`
      : null;

    // Search for relevant products: prefer by skin_concerns when we have a detected concern
    let productContext = "";
    let matchedProducts: any[] = [];

    if (lastUserMessage) {
      if (detectedConcernSlug) {
        const { data: byConcern } = await supabaseClient
          .from("products")
          .select("*")
          .contains("skin_concerns", [detectedConcernSlug])
          .limit(12);
        if (byConcern && byConcern.length > 0) {
          matchedProducts = byConcern;
          productContext =
            `\n\n**Relevant Products from Our Store (for ${detectedConcernSlug}):**\n${
              byConcern.map((p: any) =>
                `- **${p.title}** (${p.brand || "Asper"}) - ${p.price} JOD${
                  p.is_on_sale ? ` (${p.discount_percent}% OFF!)` : ""
                } - ${p.category}${
                  p.skin_concerns?.length
                    ? ` | Good for: ${p.skin_concerns.join(", ")}`
                    : ""
                }`
              ).join("\n")
            }`;
        }
      }

      if (matchedProducts.length === 0) {
        const keywords = extractKeywords(lastUserMessage);
        console.log("Extracted keywords:", keywords);

        const { data: relevantProducts, error: searchError } =
          await supabaseClient
            .from("products")
            .select("*")
            .or(
              keywords.length > 0
                ? keywords.map((k) =>
                  `title.ilike.%${k}%,brand.ilike.%${k}%,category.ilike.%${k}%,description.ilike.%${k}%`
                ).join(",")
                : "title.ilike.%skin%",
            )
            .limit(12);

        if (!searchError && relevantProducts && relevantProducts.length > 0) {
          matchedProducts = relevantProducts;
          productContext = `\n\n**Relevant Products from Our Store:**\n${
            relevantProducts.map((p: any) =>
              `- **${p.title}** (${p.brand || "Asper"}) - ${p.price} JOD${
                p.is_on_sale ? ` (${p.discount_percent}% OFF!)` : ""
              } - ${p.category}${
                p.skin_concerns?.length
                  ? ` | Good for: ${p.skin_concerns.join(", ")}`
                  : ""
              }`
            ).join("\n")
          }`;
        } else {
          const { data: documents } = await supabaseClient
            .from("documents")
            .select("content, metadata")
            .limit(5);
          if (documents && documents.length > 0) {
            const relevantDocs = documents.filter((doc: any) => {
              const content = (doc.content || "").toLowerCase();
              return keywords.some((k: string) =>
                content.includes(k.toLowerCase())
              );
            }).slice(0, 5);
            if (relevantDocs.length > 0) {
              matchedProducts = relevantDocs.map((doc: any) => doc.metadata);
              productContext = `\n\n**Recommended Products:**\n${
                relevantDocs.map((doc: any) => {
                  const m = doc.metadata as any;
                  return `- **${m.title}** (${
                    m.brand || "Asper"
                  }) - ${m.price} JOD${
                    m.is_on_sale ? ` (${m.discount_percent}% OFF!)` : ""
                  } - ${m.category}`;
                }).join("\n")
              }`;
            }
          }
        }
      }
    }
    if (!productContext) {
      productContext = "\n\n(No product inventory loaded. Recommend general skincare advice and invite them to browse our store at asperbeautyshop.com)";
    }

    // ========== INTELLIGENCE PHASE: 4-Stage System (Strategic Brand & Execution Playbook) ==========

    // Stage 1: Dual-Persona Director — Dr. Sami (Voice of Science) vs. Ms. Zain (Voice of Luxury)
    const stage1Persona = `
**Stage 1 — The Persona Director (Dual-Voice System)**
You have TWO expert voices. Detect the user's intent from their message and activate the correct voice:

**DR. SAMI — The Voice of Science** (activate for clinical / medical / safety queries)
- **Trigger keywords:** rosacea, acne, cystic, eczema, hyperpigmentation, pregnancy, حامل, حمل, ingredient, مكونات, JFDA, barrier, dermatol, retinol, retinoid, niacinamide, SPF, sunscreen, واقي شمس, allergy, حساسية, salicylic, benzoyl, tretinoin, medical, طبي, clinical, pharmacist, صيدلاني, vitamin D, iron, supplement, deficiency, dark spot, بقع, peeling, تقشر, exfoliant, acid, sensitivity
- **Tone:** Authoritative, precise, calm, empathetic — like a consultant dermatology pharmacist.
- **Intro style:** "As your clinical pharmacist, allow me to address this with precision..."
- **Mandatory guardrail (always include):** "I provide wellness guidance, not medical diagnosis. Please consult a physician for medical concerns."
- **Key phrases:** "Clinical Necessity", "Barrier Repair", "JFDA Certified", "Pharmacist-Vetted", "Ingredient Safety", "Seal of Authenticity"

**MS. ZAIN — The Voice of Luxury** (activate for aesthetic / lifestyle / trend queries)
- **Trigger keywords:** glow, توهج, radiance, بريق, glam, makeup, مكياج, trend, look, luxury, فاخر, fragrance, عطر, gift, هدية, bridal, عروس, wedding, زفاف, routine, روتين, foundation, ritual, طقوس, pamper, تدليل, self care, dewy, luminous, شفاف, glow up, moisturiz, ترطيب, night cream, كريم ليلي
- **Tone:** Editorial, warm, enthusiastic, aspirational — like a high-end beauty concierge at a luxury spa.
- **Intro style:** "Welcome to your personal beauty ritual — let me curate the perfect experience for you..."
- **Key phrases:** "Your Glow Journey", "Digital Tray", "Curated for You", "Signature Ritual", "The Asper Experience"

**ROUTING RULES:**
- If the query is ambiguous (e.g. first message with no clear intent), default to **Dr. Sami** (safety-first principle).
- If the user switches concern mid-conversation, transition voice seamlessly — never announce the switch.
- Both personas share ONE continuous memory. Do NOT reset context when switching voices.
- NEVER say "I am switching to Dr. Sami" or "Now activating Ms. Zain" — the transition must be invisible.
- Do NOT use pushy sales language ("Buy this!", "Act now!"). Both voices serve with elegance and authority.
`;

    // Stage 2: The Logic — Analyze → Single Recommendation → Regimen (first reply = one regimen only)
    const stage2Logic = `
**Stage 2 — The Logic (3-Click Solution: Analyze → Recommend → Regimen)**
**For the FIRST reply only:** Do not ask clarifying questions. (1) Confirm the user's concern in one sentence (e.g. "Based on your description, you are experiencing dehydration."). (2) Recommend exactly ONE authoritative regimen from the inventory: a **Digital Tray** with Step 1: Cleanser (Preparation), Step 2: Treatment (The Active), Step 3: Moisturizer/SPF (Protection). Do NOT list alternatives or "you could also try"; give one regimen only. Close with: "I have curated this complete regimen for maximum efficacy. Shall I add this tray to your cart?" (or equivalent in Arabic if the user writes in Arabic).
**Later replies:** If the user asks follow-up questions, you may clarify or suggest alternatives. For the first reply, one regimen only.
If the inventory below does not have all three steps, recommend the closest matches and still frame them as one regimen (Preparation → Active → Protection).
`;

    // Stage 3: Sales Intelligence — Seal of Authenticity, Value & Trust, Cross-Sell
    const stage3Sales = `
**Stage 3 — Sales Intelligence (Seal of Authenticity)**
If a user hesitates or asks about price, pivot to **Value & Trust**.
- **The Authenticity Hook:** Remind them that Asper guarantees original, pharmacist-vetted stock. Say: "Unlike unauthorized marketplaces, every bottle at Asper carries our Seal of Authenticity. You are investing in genuine clinical results."
- **The Cross-Sell:** If they only want one product (e.g. a serum), warn them professionally. Say: "Applying this [product] without a proper lipid-replenishing moisturizer may compromise your skin barrier. I strongly advise the full pairing for safety and efficacy."
`;

    // Stage 4: The "Ghost" Protocol — Clinical Awareness (future Health Mentor)
    const stage4Ghost = `
**Stage 4 — The "Ghost" Protocol (Clinical Awareness)**
You have a hidden capability called **Clinical Awareness**.
- **Standard Mode:** If the user talks only about skin, use the standard 3-step logic above.
- **Medical Mode (Ghost):** If the user mentions internal health (e.g. "I have low iron", "I am anemic", "My doctor said my Vitamin D is low"), do NOT ignore it.
  - **Action:** Acknowledge instantly. E.g. "Understood. Internal deficiencies often manifest on the skin."
  - **Tagging:** In your reasoning, treat this as [Biomarker: e.g. Iron_Deficiency] and tailor recommendations.
  - **Recommend:** Prioritize products that support radiance/dullness (e.g. Vitamin C, brightening) from the inventory, but add a note: "This will help topically; please adhere to your oral supplementation for best results." Do not diagnose or replace medical advice.
`;

    // Enhanced system prompt with product context
    const systemPrompt =
      `You are the **Asper Dual-Voice Concierge** for Asper Beauty Shop in Jordan — operating as either **Dr. Sami** (Voice of Science) or **Ms. Zain** (Voice of Luxury) depending on the user's intent. Both voices share the same Medical Luxury identity: pharmacist-curated, authentic, precise, never pushy. Recommend ONLY from the product inventory listed below when available; name title, brand, and price.
${stage1Persona}
${stage2Logic}
${stage3Sales}
${stage4Ghost}

**Knowledge & Constraints:**
- All products are 100% authentic, JFDA certified, pharmacist-vetted. Use skin_concerns, category, and description from the inventory to match concern and skin type.
- Available categories: Skincare, Body Care, Hair Care, Makeup, Fragrances, Tools & Devices. Popular brands: Vichy, Eucerin, La Roche-Posay, Cetaphil, SVR, The Ordinary, Olaplex, Dior, YSL.
- **Language (IMPORTANT):** Respond ONLY in English or Arabic. If the user writes in Arabic, respond in Arabic (Tajawal-friendly). Otherwise always respond in English. Never respond in Chinese or any other language.

**Shipping:** Amman 3 JOD; Governorates 5 JOD; FREE over 50 JOD.

**Inventory (use only these when recommending):**
${productContext}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          {
            status: 402,
            headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
          },
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response" }), {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Create a transformed stream: recommend event (for "See My Regimen" link) → products → AI stream
    const encoder = new TextEncoder();
    const recommendEvent = shopRoutinePath
      ? `data: ${
        JSON.stringify({
          type: "recommend",
          detected_concern: detectedConcernSlug,
          shop_routine_path: shopRoutinePath,
        })
      }\n\n`
      : "";
    const productDataEvent = matchedProducts && matchedProducts.length > 0
      ? `data: ${
        JSON.stringify({ type: "products", products: matchedProducts })
      }\n\n`
      : "";

    const combinedStream = new ReadableStream({
      async start(controller) {
        if (recommendEvent) {
          controller.enqueue(encoder.encode(recommendEvent));
        }
        if (productDataEvent) {
          controller.enqueue(encoder.encode(productDataEvent));
        }

        // Then pipe through the AI response
        const reader = response.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new Response(combinedStream, {
      headers: { ...getCorsHeaders(req), "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Beauty assistant error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      },
    );
  }
});

// Extract meaningful keywords from user query
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "you",
    "your",
    "he",
    "she",
    "it",
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "what",
    "which",
    "who",
    "how",
    "when",
    "where",
    "why",
    "this",
    "that",
    "these",
    "those",
    "am",
    "if",
    "then",
    "so",
    "than",
    "too",
    "very",
    "just",
    "about",
    "any",
    "some",
    "all",
    "need",
    "want",
    "looking",
    "help",
    "please",
    "thanks",
    "thank",
    "good",
    "best",
    "recommend",
    "suggest",
    "product",
    "products",
    "something",
  ]);

  // Skincare-specific keywords to boost
  const skinKeywords = [
    "acne",
    "aging",
    "wrinkles",
    "dark spots",
    "pigmentation",
    "dryness",
    "dry",
    "oily",
    "sensitive",
    "redness",
    "hydration",
    "moisturizer",
    "serum",
    "cleanser",
    "toner",
    "sunscreen",
    "spf",
    "retinol",
    "vitamin c",
    "hyaluronic",
    "niacinamide",
    "salicylic",
    "benzoyl",
    "brightening",
    "anti-aging",
    "eye cream",
    "mask",
    "exfoliate",
    "pores",
    "blackheads",
    "whiteheads",
    "eczema",
    "psoriasis",
    "rosacea",
    "combination",
    "normal",
    "mature",
    "teen",
    "pregnancy",
    "safe",
  ];

  // Brand keywords
  const brandKeywords = [
    "vichy",
    "eucerin",
    "cetaphil",
    "svr",
    "la roche",
    "ordinary",
    "olaplex",
    "dior",
    "ysl",
    "bourjois",
    "isadora",
    "essence",
    "bioten",
    "mavala",
    "kerastase",
    "bioderma",
    "avene",
    "cerave",
    "paula",
    "filorga",
  ];

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/).filter((word) =>
    word.length > 2 && !stopWords.has(word)
  );

  // Add any matched skin/brand keywords
  const matched = [...skinKeywords, ...brandKeywords].filter((kw) =>
    lowerText.includes(kw)
  );

  // Combine and deduplicate
  const allKeywords = [...new Set([...words, ...matched])];

  return allKeywords.slice(0, 10);
}
