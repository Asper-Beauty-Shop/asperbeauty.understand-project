/** Bilingual clinical benefit descriptions for common active ingredients. */
export const INGREDIENT_BENEFITS: Record<string, { en: string; ar: string }> = {
  "niacinamide": { en: "Visibly fades discolorations & refines pores.", ar: "يقلل التصبغات ويصقل المسام بشكل واضح." },
  "retinol": { en: "Accelerates cell turnover to reduce fine lines & wrinkles.", ar: "يسرّع تجدد الخلايا لتقليل الخطوط الدقيقة والتجاعيد." },
  "hyaluronic acid": { en: "Retains up to 1000x its weight in moisture for deep hydration.", ar: "يحتفظ بـ 1000 ضعف وزنه من الرطوبة لترطيب عميق." },
  "vitamin c": { en: "Potent antioxidant that brightens and evens skin tone.", ar: "مضاد أكسدة قوي يُفتّح البشرة ويوحّد لونها." },
  "salicylic acid": { en: "Penetrates pores to clear acne & prevent breakouts.", ar: "يخترق المسام لتنظيف حب الشباب ومنع البثور." },
  "ceramide": { en: "Restores the skin barrier & locks in essential moisture.", ar: "يعيد بناء حاجز البشرة ويحبس الرطوبة الأساسية." },
  "ceramide-3": { en: "Retains moisture & maintains a healthy skin barrier.", ar: "يحافظ على الرطوبة وصحة حاجز البشرة." },
  "glycerin": { en: "Humectant that draws moisture into the skin for lasting softness.", ar: "مرطب يجذب الرطوبة إلى البشرة لنعومة دائمة." },
  "zinc oxide": { en: "Mineral UV filter providing broad-spectrum sun protection.", ar: "فلتر معدني للأشعة فوق البنفسجية يوفر حماية واسعة الطيف." },
  "spf": { en: "Shields skin from UVA/UVB damage & prevents premature aging.", ar: "يحمي البشرة من أضرار الأشعة ويمنع الشيخوخة المبكرة." },
  "azelaic acid": { en: "Reduces redness and hyperpigmentation with gentle exfoliation.", ar: "يقلل الاحمرار وفرط التصبغ مع تقشير لطيف." },
  "peptides": { en: "Signal collagen production for firmer, more resilient skin.", ar: "يحفّز إنتاج الكولاجين لبشرة أكثر مرونة وشباباً." },
  "squalane": { en: "Lightweight emollient that nourishes without clogging pores.", ar: "مطرّي خفيف يغذي البشرة دون سد المسام." },
  "panthenol": { en: "Provitamin B5 that soothes irritation and strengthens the barrier.", ar: "بروفيتامين ب5 يهدئ التهيج ويقوي حاجز البشرة." },
  "centella asiatica": { en: "Calms inflammation and accelerates wound healing.", ar: "يهدئ الالتهاب ويسرّع التئام الجروح." },
  "thermal water": { en: "Mineral-rich soothing water that calms and protects.", ar: "ماء معدني مهدئ يحمي البشرة ويلطفها." },
  "prebiotic thermal water": { en: "Soothes, strengthens the skin microbiome & protects.", ar: "يهدئ ويقوي ميكروبيوم البشرة ويحميها." },
  "alpha arbutin": { en: "Targets dark spots and evens skin tone safely.", ar: "يستهدف البقع الداكنة ويوحّد لون البشرة بأمان." },
  "benzoyl peroxide": { en: "Kills acne-causing bacteria and clears existing blemishes.", ar: "يقتل البكتيريا المسببة لحب الشباب ويزيل الشوائب." },
  "kojic acid": { en: "Inhibits melanin production for a brighter complexion.", ar: "يثبط إنتاج الميلانين لبشرة أكثر إشراقاً." },
  "lactic acid": { en: "Gentle AHA that exfoliates and boosts hydration.", ar: "حمض ألفا هيدروكسي لطيف يقشر ويعزز الترطيب." },
  "glycolic acid": { en: "Exfoliates dead cells for smoother, more radiant skin.", ar: "يقشر الخلايا الميتة لبشرة أنعم وأكثر إشراقاً." },
  "tea tree oil": { en: "Natural antimicrobial that helps control acne and blemishes.", ar: "مضاد طبيعي للميكروبات يساعد في السيطرة على حب الشباب." },
  "collagen": { en: "Supports skin elasticity and plumpness for a youthful look.", ar: "يدعم مرونة البشرة وامتلاءها لمظهر شبابي." },
  "biotin": { en: "B-vitamin essential for healthy hair, skin & nails.", ar: "فيتامين ب ضروري لصحة الشعر والبشرة والأظافر." },
  "minoxidil": { en: "Stimulates hair follicles to promote regrowth.", ar: "يحفز بصيلات الشعر لتعزيز إعادة النمو." },
  "caffeine": { en: "Constricts blood vessels to reduce puffiness & dark circles.", ar: "يقبض الأوعية الدموية لتقليل الانتفاخ والهالات السوداء." },
  "shea butter": { en: "Rich emollient that deeply nourishes and softens dry skin.", ar: "مطرّي غني يغذي البشرة الجافة وينعمها بعمق." },
  "allantoin": { en: "Soothes and promotes cell regeneration for smoother skin.", ar: "يهدئ ويعزز تجدد الخلايا لبشرة أنعم." },
  "urea": { en: "Hydrates intensely and gently softens rough, cracked skin.", ar: "يرطب بشكل مكثف ويلطف البشرة الجافة والمتشققة." },
};

/** Look up a clinical benefit for an ingredient name (fuzzy match). */
export function getIngredientBenefit(ingredient: string, isArabic: boolean): string {
  const key = ingredient.toLowerCase().trim();
  const match = INGREDIENT_BENEFITS[key];
  if (match) return isArabic ? match.ar : match.en;
  for (const [k, v] of Object.entries(INGREDIENT_BENEFITS)) {
    if (key.includes(k) || k.includes(key)) return isArabic ? v.ar : v.en;
  }
  return isArabic ? "مكون فعال سريرياً" : "Clinically active ingredient";
}

/** Format all benefits as a plain-text block (useful for AI system prompts). */
export function ingredientBenefitsContext(): string {
  return Object.entries(INGREDIENT_BENEFITS)
    .map(([name, { en }]) => `- ${name}: ${en}`)
    .join("\n");
}
