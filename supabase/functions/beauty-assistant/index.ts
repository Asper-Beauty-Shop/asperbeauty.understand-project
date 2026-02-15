import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Expose-Headers": "X-Persona, X-Safety-Flags",
};

// ─── SAFETY INTERLOCK: Ingredient Guardrails ────────────────────────────────
// These ingredients trigger automatic medical safety warnings when detected
// in conversation context, especially when user has vulnerability tags.

interface SafetyRule {
  ingredient: string;
  keywords: string[];
  // Vulnerability tags that escalate this to a hard warning
  contraindicated_for: string[];
  warning: string;
  alternative: string;
}

const SAFETY_RULES: SafetyRule[] = [
  {
    ingredient: "Retinol",
    keywords: ["retinol", "retinoid", "retin-a", "tretinoin", "vitamin a", "retinal", "adapalene"],
    contraindicated_for: ["pregnant", "pregnancy", "breastfeeding", "nursing", "trying to conceive", "first trimester", "second trimester", "third trimester"],
    warning: "⚠️ SAFETY ALERT: Retinol and all vitamin A derivatives are CONTRAINDICATED during pregnancy and breastfeeding due to teratogenic risks. This is a non-negotiable medical guideline.",
    alternative: "Recommend bakuchiol (plant-based retinol alternative), azelaic acid (safe in pregnancy, Category B), or niacinamide for anti-aging benefits without retinoid risk.",
  },
  {
    ingredient: "Salicylic Acid",
    keywords: ["salicylic acid", "bha", "beta hydroxy", "salicylate"],
    contraindicated_for: ["pregnant", "pregnancy", "breastfeeding", "sensitive skin", "rosacea", "eczema", "dermatitis", "compromised barrier"],
    warning: "⚠️ SAFETY ALERT: Salicylic acid (BHA) should be used with caution. For pregnancy: only low concentrations (<2%) in wash-off products are considered acceptable. For sensitive/rosacea skin: BHA can worsen barrier disruption.",
    alternative: "For acne during pregnancy: use azelaic acid (15-20%). For sensitive skin: use PHAs (polyhydroxy acids like gluconolactone) which are gentler. La Roche-Posay Effaclar Duo+ or Cicaplast are safer alternatives.",
  },
  {
    ingredient: "Hydroquinone",
    keywords: ["hydroquinone"],
    contraindicated_for: ["pregnant", "pregnancy", "breastfeeding", "sensitive skin", "dark skin", "fitzpatrick v", "fitzpatrick vi"],
    warning: "⚠️ SAFETY ALERT: Hydroquinone is contraindicated during pregnancy (systemic absorption ~35-45%). Prolonged use risks ochronosis (paradoxical darkening).",
    alternative: "Use alpha arbutin, tranexamic acid, or vitamin C (L-ascorbic acid 10-20%) as safer depigmenting agents.",
  },
  {
    ingredient: "AHA (Glycolic/Lactic Acid)",
    keywords: ["glycolic acid", "lactic acid", "aha", "alpha hydroxy", "mandelic acid"],
    contraindicated_for: ["sensitive skin", "rosacea", "sunburn", "compromised barrier"],
    warning: "⚠️ CAUTION: AHA exfoliants can cause irritation on compromised or sensitive skin. Always pair with SPF 30+ as AHAs increase photosensitivity by up to 18%.",
    alternative: "Use PHAs (gluconolactone, lactobionic acid) for gentle exfoliation without barrier disruption. Enzyme exfoliants (papain, bromelain) are also gentler alternatives.",
  },
  {
    ingredient: "Benzoyl Peroxide",
    keywords: ["benzoyl peroxide", "bp", "benzac"],
    contraindicated_for: ["sensitive skin", "rosacea", "eczema", "dry skin"],
    warning: "⚠️ CAUTION: Benzoyl peroxide is a potent antimicrobial but causes significant dryness and irritation, especially on sensitive or compromised skin. It also bleaches fabrics.",
    alternative: "For sensitive acne-prone skin: use azelaic acid (15%) or sulfur-based treatments. Short-contact therapy (apply BP for 5-10 min then rinse) reduces irritation while maintaining efficacy.",
  },
  {
    ingredient: "Supplements / Ingestibles",
    keywords: ["rigenforte", "supplement", "hair loss pill", "biotin", "collagen pill", "ingestible", "oral supplement"],
    contraindicated_for: ["pregnant", "pregnancy", "breastfeeding", "medication", "blood thinner", "on medication"],
    warning: "⚠️ PHARMACY ALERT: Oral supplements require dosage awareness. Check for drug interactions, especially with blood thinners, hormonal medications, or prenatal vitamins. Always disclose current medications.",
    alternative: "Consult your physician before starting any new supplement regimen. Topical alternatives may be safer during pregnancy or while on medication.",
  },
];

interface UserMedicalContext {
  skin_type?: string | null;
  skin_concern?: string | null;
  tags?: string[];  // e.g. ["pregnant", "rosacea"]
}

/**
 * Scans the conversation for flagged ingredients and cross-references
 * against user vulnerability tags. Returns safety warnings to inject.
 */
function runSafetyInterlock(
  messages: any[],
  userContext: UserMedicalContext | null
): { warnings: string[]; triggered: string[] } {
  // Collect all text from conversation
  const allText = messages
    .map((m: any) => {
      if (typeof m.content === "string") return m.content;
      if (Array.isArray(m.content)) {
        return m.content
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join(" ");
      }
      return "";
    })
    .join(" ")
    .toLowerCase();

  // Build vulnerability set from user context + conversation mentions
  const vulnerabilities = new Set<string>();

  // From user profile tags
  if (userContext?.tags) {
    userContext.tags.forEach((t) => vulnerabilities.add(t.toLowerCase()));
  }
  if (userContext?.skin_type) vulnerabilities.add(userContext.skin_type.toLowerCase());
  if (userContext?.skin_concern) vulnerabilities.add(userContext.skin_concern.toLowerCase());

  // Scan conversation for vulnerability mentions
  const vulnerabilityKeywords = [
    "pregnant", "pregnancy", "breastfeeding", "nursing", "trying to conceive",
    "first trimester", "second trimester", "third trimester",
    "sensitive skin", "rosacea", "eczema", "dermatitis", "compromised barrier",
    "on medication", "blood thinner",
  ];
  for (const vk of vulnerabilityKeywords) {
    if (allText.includes(vk)) vulnerabilities.add(vk);
  }

  const warnings: string[] = [];
  const triggered: string[] = [];

  for (const rule of SAFETY_RULES) {
    // Check if this ingredient is mentioned in conversation
    const ingredientMentioned = rule.keywords.some((k) => allText.includes(k));
    if (!ingredientMentioned) continue;

    // Check if user has a contraindication
    const hasContraindication = rule.contraindicated_for.some((c) =>
      vulnerabilities.has(c) || allText.includes(c)
    );

    if (hasContraindication) {
      warnings.push(
        `\n\n---\n**🛡️ SAFETY INTERLOCK — ${rule.ingredient}**\n${rule.warning}\n**Safer Alternative:** ${rule.alternative}\n---\n`
      );
      triggered.push(rule.ingredient);
    }
  }

  return { warnings, triggered };
}

// ─── PERSONA PROMPTS ────────────────────────────────────────────────────────

const DR_SAMI_PROMPT = `You are Dr. Sami — the Clinical Authority at Asper Beauty Shop, "The Sanctuary of Science."

PERSONALITY: Authoritative yet warm. You speak with the precision of a licensed pharmacist but never talk down to customers. You are reassuring, knowledgeable, and direct.

EXPERTISE: Dermocosmetics (La Roche-Posay, Vichy, CeraVe, Bioderma), supplements, dosage & safety, ingredient analysis, skin conditions (acne, rosacea, eczema, hyperpigmentation), drug-cosmetic interactions.

TONE: Clinical, precise, evidence-based. Use medical terminology but always explain it simply.

PHARMACIST LOGIC — ADVANCED REGIMEN COMPOSER:
When recommending a regimen, you MUST follow this structured reasoning framework:
1. **Concern Diagnosis**: State the identified concern clearly.
2. **Ingredient Rationale**: For EACH recommended product, explain WHY the key active was chosen.
3. **Regimen Architecture**: Always structure as Cleanser → Treatment → Protection, explaining the ORDER logic.
4. **Interaction Warnings**: Flag any ingredient conflicts.
5. **Expected Timeline**: Give realistic expectations.

SAFETY INTERLOCK PROTOCOL:
You are the SAFETY AUDITOR for all recommendations. When the system injects a SAFETY INTERLOCK warning:
- You MUST honor it absolutely — never recommend a contraindicated ingredient.
- Explain the medical reasoning behind the contraindication clearly.
- Provide the safer alternative with full Pharmacist Logic rationale.
- If Ms. Zain's domain triggers a safety concern, YOU override with clinical authority.

RULES:
- Always recommend products from the Asper catalog when relevant.
- Never diagnose medical conditions — advise consulting a dermatologist for serious concerns.
- When recommending products, ALWAYS include the Pharmacist Logic reasoning above.
- Keep responses concise but thorough (3-5 paragraphs max).
- If asked about beauty/makeup/fragrance topics, gently redirect to your colleague Ms. Zain.
- Always include a medical disclaimer: "I provide wellness guidance, not medical diagnosis. For persistent concerns, consult a board-certified dermatologist."

OPENING: If this is the first message, introduce yourself briefly: "Hello! I'm Dr. Sami, your pharmacist consultant at Asper. How can I help with your skin health today?"

VISUAL SKIN DIAGNOSTIC:
When the user provides an image of their skin, analyze it carefully:
1. **Visual Assessment**: Describe what you observe (texture, tone, visible concerns).
2. **Preliminary Identification**: Identify likely skin concerns based on visual cues.
3. **Personalized Regimen**: Provide a full regimen using the Pharmacist Logic framework.
4. **Important Caveat**: Always remind: "Visual analysis has limitations. For a definitive assessment, please visit a dermatologist."`;

const MS_ZAIN_PROMPT = `You are Ms. Zain — the Beauty Concierge at Asper Beauty Shop, "The Sanctuary of Science."

PERSONALITY: Warm, enthusiastic, editorial. You speak like a trusted beauty editor friend.

EXPERTISE: Makeup (Maybelline, L'Oréal, NYX), luxury & niche fragrances, skincare routines for beauty goals, gift recommendations, beauty trends, color matching, application techniques.

TONE: Enthusiastic, elegant, conversational.

BEAUTY COMPOSER — ADVANCED RECOMMENDATION LOGIC:
1. **Style Profiling**: Acknowledge the customer's aesthetic goal.
2. **Product Rationale**: For EACH recommendation, explain the "why."
3. **Layering Logic**: Explain the ORDER of application and WHY.
4. **Pro Tips**: Include at least one insider technique.
5. **Occasion Matching**: Tailor to their lifestyle.

SAFETY INTERLOCK PROTOCOL:
You share a "Medical Chart" with Dr. Sami. When the system injects a SAFETY INTERLOCK warning:
- You MUST respect it. Do NOT recommend products containing the flagged ingredient.
- Acknowledge the safety concern warmly: "I see from your profile that [concern] — let me make sure everything I recommend is safe for you! 💛"
- Seamlessly incorporate the safer alternative into your beauty recommendation.
- If you're unsure about ingredient safety, defer to Dr. Sami: "For this specific concern, let me hand you over to my colleague Dr. Sami who can give you the precise clinical guidance."

RULES:
- Always recommend products from the Asper catalog when relevant.
- Help with routine building, product layering, shade matching, and gift ideas.
- When recommending products, ALWAYS include the Beauty Composer reasoning above.
- Keep responses concise but thorough (3-5 paragraphs max).
- If asked about medical/clinical skin concerns, gently redirect to your colleague Dr. Sami.

OPENING: If this is the first message, introduce yourself briefly: "Hi there! ✨ I'm Ms. Zain, your beauty concierge at Asper. What are we shopping for today?"

VISUAL ANALYSIS:
When the user provides an image, analyze it for beauty-related guidance:
1. **Skin Tone & Undertone**: Identify warm, cool, or neutral undertones.
2. **Current Look Assessment**: Comment on what you see and suggest enhancements.
3. **Product Recommendations**: Recommend products tailored to what you observe.`;

function selectPersona(messages: any[]): { persona: string; systemPrompt: string } {
  const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
  const textContent = typeof lastUserMsg?.content === "string"
    ? lastUserMsg.content
    : Array.isArray(lastUserMsg?.content)
      ? lastUserMsg.content.filter((p: any) => p.type === "text").map((p: any) => p.text).join(" ")
      : "";
  const lower = textContent.toLowerCase();

  const hasImage = Array.isArray(lastUserMsg?.content) && lastUserMsg.content.some((p: any) => p.type === "image_url");

  const clinicalKeywords = [
    "acne", "rosacea", "eczema", "dermatitis", "spf", "sunscreen", "retinol",
    "salicylic", "benzoyl", "niacinamide", "hyaluronic", "ceramide", "prescription",
    "sensitive skin", "irritation", "allergy", "reaction", "ingredient", "dosage",
    "supplement", "vitamin", "medication", "treatment", "clinical", "medical",
    "oily skin", "dry skin", "combination skin", "barrier", "ph", "exfoliate",
    "chemical peel", "pigmentation", "melasma", "dark spots", "anti-aging", "wrinkle",
    "dr sami", "doctor", "pharmacist", "dermocosmetic",
    "la roche", "vichy", "cerave", "bioderma", "avene",
    "skin concern", "diagnose", "analyze my skin", "what's wrong",
    "pregnant", "pregnancy", "breastfeeding",
  ];

  const beautyKeywords = [
    "makeup", "lipstick", "foundation", "mascara", "eyeshadow", "blush", "contour",
    "highlight", "primer", "concealer", "perfume", "fragrance", "cologne", "scent",
    "gift", "occasion", "date night", "wedding", "party", "look", "style",
    "trend", "color", "shade", "palette", "nail", "hair", "styling",
    "ms zain", "beauty", "gorgeous", "glam", "routine morning", "routine evening",
    "maybelline", "loreal", "nyx", "mac", "recommend me",
    "undertone", "shade match",
  ];

  const clinicalScore = clinicalKeywords.filter(k => lower.includes(k)).length + (hasImage ? 2 : 0);
  const beautyScore = beautyKeywords.filter(k => lower.includes(k)).length;

  if (clinicalScore > beautyScore) {
    return { persona: "dr_sami", systemPrompt: DR_SAMI_PROMPT };
  }
  if (beautyScore > clinicalScore) {
    return { persona: "ms_zain", systemPrompt: MS_ZAIN_PROMPT };
  }

  return { persona: "ms_zain", systemPrompt: MS_ZAIN_PROMPT };
}

// ─── MAIN HANDLER ───────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ─── Authentication ───
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const { messages, forcePersona, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch user profile from Supabase for safety interlock
    let medicalContext: UserMedicalContext | null = userProfile || null;

    if (!medicalContext) {
      try {
        const { data: profile } = await supabase
          .from("concierge_profiles")
          .select("skin_type, skin_concern")
          .eq("user_id", userId)
          .maybeSingle();
        if (profile) {
          medicalContext = {
            skin_type: profile.skin_type,
            skin_concern: profile.skin_concern,
            tags: [],
          };
        }
      } catch (e) {
        console.warn("Could not fetch user profile for safety interlock:", e);
      }
    }

    // Select persona
    let selected;
    if (forcePersona === "dr_sami") {
      selected = { persona: "dr_sami", systemPrompt: DR_SAMI_PROMPT };
    } else if (forcePersona === "ms_zain") {
      selected = { persona: "ms_zain", systemPrompt: MS_ZAIN_PROMPT };
    } else {
      selected = selectPersona(messages);
    }

    // ─── Run Safety Interlock ───
    const { warnings, triggered } = runSafetyInterlock(messages, medicalContext);

    // If safety warnings exist and current persona is ms_zain with severe flags, escalate to Dr. Sami
    const severeIngredients = ["Retinol", "Hydroquinone", "Supplements / Ingestibles"];
    const hasSevereFlag = triggered.some((t) => severeIngredients.includes(t));
    if (hasSevereFlag && selected.persona === "ms_zain") {
      // Escalate to Dr. Sami for safety override
      selected = { persona: "dr_sami", systemPrompt: DR_SAMI_PROMPT };
    }

    // Inject safety context into system prompt
    let systemPrompt = selected.systemPrompt;
    if (warnings.length > 0) {
      systemPrompt += `\n\n=== ACTIVE SAFETY INTERLOCKS ===\nThe following safety warnings are ACTIVE for this user. You MUST honor these in your response:\n${warnings.join("\n")}`;
    }
    if (medicalContext) {
      const profileParts: string[] = [];
      if (medicalContext.skin_type) profileParts.push(`Skin Type: ${medicalContext.skin_type}`);
      if (medicalContext.skin_concern) profileParts.push(`Primary Concern: ${medicalContext.skin_concern}`);
      if (medicalContext.tags?.length) profileParts.push(`Medical Tags: ${medicalContext.tags.join(", ")}`);
      if (profileParts.length > 0) {
        systemPrompt += `\n\n=== USER MEDICAL PROFILE ===\n${profileParts.join("\n")}\nUse this context to personalize recommendations and check for contraindications.`;
      }
    }

    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Persona": selected.persona,
        "X-Safety-Flags": triggered.length > 0 ? triggered.join(",") : "none",
      },
    });
  } catch (e) {
    console.error("beauty-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
