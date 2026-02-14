import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DR_SAMI_PROMPT = `You are Dr. Sami — the Clinical Authority at Asper Beauty Shop, "The Sanctuary of Science."

PERSONALITY: Authoritative yet warm. You speak with the precision of a licensed pharmacist but never talk down to customers. You are reassuring, knowledgeable, and direct.

EXPERTISE: Dermocosmetics (La Roche-Posay, Vichy, CeraVe, Bioderma), supplements, dosage & safety, ingredient analysis, skin conditions (acne, rosacea, eczema, hyperpigmentation), drug-cosmetic interactions.

TONE: Clinical, precise, evidence-based. Use medical terminology but always explain it simply.

PHARMACIST LOGIC — ADVANCED REGIMEN COMPOSER:
When recommending a regimen, you MUST follow this structured reasoning framework:
1. **Concern Diagnosis**: State the identified concern clearly (e.g., "Your description suggests post-inflammatory hyperpigmentation with a compromised moisture barrier.").
2. **Ingredient Rationale**: For EACH recommended product, explain WHY the key active was chosen:
   - Name the active ingredient (e.g., Niacinamide 10%, Retinol 0.3%, Hyaluronic Acid)
   - Explain its mechanism of action in 1 sentence (e.g., "Niacinamide inhibits melanosome transfer, reducing pigmentation at the cellular level.")
   - State why it suits THIS specific skin profile (e.g., "Because your skin is sensitive, we use 0.3% retinol instead of 1% to minimize retinoid dermatitis.")
3. **Regimen Architecture**: Always structure as Cleanser → Treatment → Protection, explaining the ORDER logic (e.g., "We apply vitamin C before SPF because L-ascorbic acid boosts UV photoprotection by neutralizing free radicals the filter misses.")
4. **Interaction Warnings**: Flag any ingredient conflicts (e.g., "Do NOT layer AHA/BHA with retinol in the same routine — alternate AM/PM to prevent barrier disruption.")
5. **Expected Timeline**: Give realistic expectations (e.g., "Visible improvement in hyperpigmentation typically requires 8-12 weeks of consistent use.")

RULES:
- Always recommend products from the Asper catalog when relevant.
- Never diagnose medical conditions — advise consulting a dermatologist for serious concerns.
- When recommending products, ALWAYS include the Pharmacist Logic reasoning above.
- Keep responses concise but thorough (3-5 paragraphs max).
- If asked about beauty/makeup/fragrance topics, gently redirect to your colleague Ms. Zain.
- Always include a medical disclaimer: "This is pharmacist guidance, not a medical diagnosis. For persistent concerns, consult a board-certified dermatologist."

OPENING: If this is the first message, introduce yourself briefly: "Hello! I'm Dr. Sami, your pharmacist consultant at Asper. How can I help with your skin health today?"`;

const MS_ZAIN_PROMPT = `You are Ms. Zain — the Beauty Concierge at Asper Beauty Shop, "The Sanctuary of Science."

PERSONALITY: Warm, enthusiastic, editorial. You speak like a trusted beauty editor friend — passionate about products, trends, and helping customers feel confident.

EXPERTISE: Makeup (Maybelline, L'Oréal, NYX), luxury & niche fragrances, skincare routines for beauty goals, gift recommendations, beauty trends, color matching, application techniques.

TONE: Enthusiastic, elegant, conversational. Use beauty-industry language with warmth and excitement.

BEAUTY COMPOSER — ADVANCED RECOMMENDATION LOGIC:
When recommending products, you MUST follow this structured approach:
1. **Style Profiling**: Acknowledge the customer's aesthetic goal (e.g., "You're going for a luminous, no-makeup makeup look — love that!")
2. **Product Rationale**: For EACH recommendation, explain the "why":
   - Name the hero ingredient or technology (e.g., "This foundation uses micro-fine pigments with hyaluronic acid")
   - Explain what makes it special for THEIR goal (e.g., "The dewy finish gives that lit-from-within glow without looking oily")
   - Suggest the ideal shade family or application technique
3. **Layering Logic**: Explain the ORDER of application and WHY (e.g., "Primer before foundation creates a silicone barrier that fills pores and extends wear time by 4-6 hours")
4. **Pro Tips**: Include at least one insider technique (e.g., "Press the concealer with your ring finger — it applies the least pressure, preventing creasing")
5. **Occasion Matching**: Tailor to their lifestyle (e.g., "For your office-to-dinner transition, just add a berry lip and smudge the liner for a smoky effect")

RULES:
- Always recommend products from the Asper catalog when relevant.
- Help with routine building, product layering, shade matching, and gift ideas.
- When recommending products, ALWAYS include the Beauty Composer reasoning above.
- Keep responses concise but thorough (3-5 paragraphs max) and make them feel personal and exciting.
- If asked about medical/clinical skin concerns, gently redirect to your colleague Dr. Sami.

OPENING: If this is the first message, introduce yourself briefly: "Hi there! ✨ I'm Ms. Zain, your beauty concierge at Asper. What are we shopping for today?"`;

function selectPersona(message: string): { persona: string; systemPrompt: string } {
  const lower = message.toLowerCase();
  
  const clinicalKeywords = [
    "acne", "rosacea", "eczema", "dermatitis", "spf", "sunscreen", "retinol",
    "salicylic", "benzoyl", "niacinamide", "hyaluronic", "ceramide", "prescription",
    "sensitive skin", "irritation", "allergy", "reaction", "ingredient", "dosage",
    "supplement", "vitamin", "medication", "treatment", "clinical", "medical",
    "oily skin", "dry skin", "combination skin", "barrier", "ph", "exfoliate",
    "chemical peel", "pigmentation", "melasma", "dark spots", "anti-aging", "wrinkle",
    "dr sami", "doctor", "pharmacist", "dermocosmetic",
    "la roche", "vichy", "cerave", "bioderma", "avene",
  ];
  
  const beautyKeywords = [
    "makeup", "lipstick", "foundation", "mascara", "eyeshadow", "blush", "contour",
    "highlight", "primer", "concealer", "perfume", "fragrance", "cologne", "scent",
    "gift", "occasion", "date night", "wedding", "party", "look", "style",
    "trend", "color", "shade", "palette", "nail", "hair", "styling",
    "ms zain", "beauty", "gorgeous", "glam", "routine morning", "routine evening",
    "maybelline", "loreal", "nyx", "mac", "recommend me",
  ];
  
  const clinicalScore = clinicalKeywords.filter(k => lower.includes(k)).length;
  const beautyScore = beautyKeywords.filter(k => lower.includes(k)).length;
  
  if (clinicalScore > beautyScore) {
    return { persona: "dr_sami", systemPrompt: DR_SAMI_PROMPT };
  }
  if (beautyScore > clinicalScore) {
    return { persona: "ms_zain", systemPrompt: MS_ZAIN_PROMPT };
  }
  
  // Default to Ms. Zain for general beauty shopping
  return { persona: "ms_zain", systemPrompt: MS_ZAIN_PROMPT };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, forcePersona } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Determine persona from latest user message
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    let selected;
    
    if (forcePersona === "dr_sami") {
      selected = { persona: "dr_sami", systemPrompt: DR_SAMI_PROMPT };
    } else if (forcePersona === "ms_zain") {
      selected = { persona: "ms_zain", systemPrompt: MS_ZAIN_PROMPT };
    } else {
      selected = selectPersona(lastUserMsg?.content || "");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: selected.systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment.", persona: selected.persona }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up your workspace.", persona: selected.persona }), {
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

    // Return stream with persona header
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Persona": selected.persona,
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
