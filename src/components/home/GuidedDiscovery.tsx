import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

const AMBITIONS = [
  { key: "Concern_Acne", en: "Clear Skin", ar: "بشرة صافية", emoji: "✨" },
  { key: "Concern_Hydration", en: "Deep Hydration", ar: "ترطيب عميق", emoji: "💧" },
  { key: "Concern_Aging", en: "Anti-Aging", ar: "مكافحة الشيخوخة", emoji: "🌟" },
  { key: "Concern_Sensitivity", en: "Calm & Soothe", ar: "تهدئة البشرة", emoji: "🌿" },
  { key: "Concern_Pigmentation", en: "Even Tone", ar: "توحيد اللون", emoji: "🌸" },
  { key: "Concern_Brightening", en: "Bright Glow", ar: "إشراقة مضيئة", emoji: "☀️" },
  { key: "Concern_SunProtection", en: "Sun Shield", ar: "حماية من الشمس", emoji: "🛡️" },
  { key: "Concern_Redness", en: "Reduce Redness", ar: "تقليل الاحمرار", emoji: "🩹" },
  { key: "Concern_DarkCircles", en: "Bright Eyes", ar: "عيون مشرقة", emoji: "👁️" },
  { key: "Concern_Oiliness", en: "Oil Control", ar: "التحكم بالدهون", emoji: "🧴" },
] as const;

type AmbitionKey = (typeof AMBITIONS)[number]["key"];

/* Ms. Zain's personalized recommendation copy per concern */
const ZAIN_INSIGHTS: Record<string, { en: string; ar: string }> = {
  Concern_Acne: {
    en: "Ms. Zain recommends a gentle, non-comedogenic approach. These products are selected for their clinically-proven ability to reduce breakouts without stripping your skin's natural moisture barrier.",
    ar: "تنصح الآنسة زين بنهج لطيف وغير مسبب للبثور. هذه المنتجات مختارة لقدرتها المثبتة سريرياً على تقليل البثور دون إزالة حاجز الرطوبة الطبيعي لبشرتك.",
  },
  Concern_Hydration: {
    en: "Your skin is craving deep, lasting moisture. Ms. Zain has curated hyaluronic acid-rich formulas that lock in hydration for up to 72 hours — pharmacy-grade, elegantly delivered.",
    ar: "بشرتك تتوق إلى ترطيب عميق ومستدام. اختارت الآنسة زين تركيبات غنية بحمض الهيالورونيك تحبس الرطوبة لمدة 72 ساعة — بجودة صيدلانية وتقديم أنيق.",
  },
  Concern_Aging: {
    en: "Time-defying isn't just a promise — it's a regimen. These retinol and peptide formulas are Ms. Zain's personal favourites for visible firmness within 4 weeks.",
    ar: "تحدي الزمن ليس مجرد وعد — إنه نظام عناية. تركيبات الريتينول والببتيد هذه هي المفضلة لدى الآنسة زين للحصول على شد مرئي خلال 4 أسابيع.",
  },
  Concern_Sensitivity: {
    en: "Sensitive skin deserves clinical gentleness. These dermatologist-tested formulas calm irritation while strengthening your skin's resilience — zero fragrance, pure comfort.",
    ar: "البشرة الحساسة تستحق لطفاً سريرياً. هذه التركيبات المختبرة من أطباء الجلد تهدئ التهيج وتقوي مرونة بشرتك — بدون عطور، راحة تامة.",
  },
  Concern_Pigmentation: {
    en: "Uneven tone meets its match. Ms. Zain's selection features vitamin C and niacinamide powerhouses that visibly fade dark spots while protecting against future discoloration.",
    ar: "لون البشرة غير الموحد يجد علاجه. اختيارات الآنسة زين تتضمن تركيبات قوية من فيتامين سي والنياسيناميد التي تخفف البقع الداكنة وتحمي من التصبغ المستقبلي.",
  },
  Concern_Brightening: {
    en: "Luminosity starts from within. These antioxidant-rich serums and treatments are chosen to reveal your skin's natural radiance — the Morning Spa glow, bottled.",
    ar: "الإشراقة تبدأ من الداخل. هذه الأمصال والعلاجات الغنية بمضادات الأكسدة مختارة للكشف عن إشراقة بشرتك الطبيعية — توهج سبا الصباح في زجاجة.",
  },
  Concern_SunProtection: {
    en: "Protection is the ultimate luxury. Invisible, weightless SPF50+ formulas that never leave a white cast — because shielding your skin should feel effortless.",
    ar: "الحماية هي الرفاهية المطلقة. تركيبات واقية SPF50+ غير مرئية وخفيفة الوزن بدون أثر أبيض — لأن حماية بشرتك يجب أن تكون بلا جهد.",
  },
  Concern_Redness: {
    en: "Redness fades when your barrier is strong. These anti-redness heroes use thermal water and centella to visibly calm inflammation within minutes.",
    ar: "يتلاشى الاحمرار عندما يكون حاجزك قوياً. أبطال مكافحة الاحمرار هؤلاء يستخدمون المياه الحرارية والسنتيلا لتهدئة الالتهاب بشكل مرئي في دقائق.",
  },
  Concern_DarkCircles: {
    en: "Tired eyes? These caffeine and peptide eye treatments are Ms. Zain's secret to a refreshed, wide-awake look — even on your busiest mornings.",
    ar: "عيون متعبة؟ علاجات العين بالكافيين والببتيد هذه هي سر الآنسة زين لمظهر منتعش ومستيقظ — حتى في أكثر صباحاتك ازدحاماً.",
  },
  Concern_Oiliness: {
    en: "Shine-free doesn't mean stripped. These mattifying formulas balance oil production while keeping skin comfortably hydrated — the clinical approach to all-day freshness.",
    ar: "بدون لمعان لا يعني بدون رطوبة. هذه التركيبات المطفأة للمعان توازن إنتاج الزيت مع الحفاظ على ترطيب البشرة براحة — النهج السريري للانتعاش طوال اليوم.",
  },
};

export function GuidedDiscovery() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [activeConcern, setActiveConcern] = useState<AmbitionKey>(AMBITIONS[0].key);

  const { data: matchedProducts = [] } = useQuery({
    queryKey: ["guided-discovery", activeConcern],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("primary_concern", activeConcern)
        .order("bestseller_rank", { ascending: true, nullsFirst: false })
        .limit(6);
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });

  const insight = ZAIN_INSIGHTS[activeConcern] || ZAIN_INSIGHTS.Concern_Hydration;
  const activeAmbition = AMBITIONS.find((a) => a.key === activeConcern)!;

  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: LUXURY_EASE }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent font-semibold">
              {isAr ? "الاكتشاف الموجّه بالذكاء" : "AI-Guided Discovery"}
            </span>
          </div>
          <h2 className={cn("font-display text-3xl md:text-4xl lg:text-5xl text-primary mb-3", isAr && "font-arabic")}>
            {isAr ? "ما هو طموحك للبشرة؟" : "What's Your Skin Ambition?"}
          </h2>
          <p className={cn("font-body text-sm text-muted-foreground max-w-xl mx-auto", isAr && "font-arabic")}>
            {isAr
              ? "اختاري هدفك وستقوم الآنسة زين باختيار نظام مخصص لك"
              : "Choose your goal and Ms. Zain will curate a personalized regimen for you."}
          </p>
        </motion.div>

        {/* Ambition strip */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-14">
          {AMBITIONS.map((ambition) => (
            <button
              key={ambition.key}
              onClick={() => setActiveConcern(ambition.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 font-body text-[11px] uppercase tracking-[0.1em] border transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                activeConcern === ambition.key
                  ? "border-accent bg-accent/10 text-accent font-bold shadow-sm"
                  : "border-border/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
              )}
            >
              <span>{ambition.emoji}</span>
              {isAr ? ambition.ar : ambition.en}
            </button>
          ))}
        </div>

        {/* Result area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeConcern}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: LUXURY_EASE }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            {/* Ms. Zain's insight card */}
            <div className="lg:col-span-1 flex flex-col justify-center">
              <div className="bg-card border border-border/30 p-8 md:p-10 relative">
                {/* Gold accent top */}
                <div className="absolute top-0 left-6 right-6 h-px bg-accent/40" />

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
                    {isAr ? "توصية الآنسة زين" : "Ms. Zain's Recommendation"}
                  </span>
                </div>

                <h3 className={cn(
                  "font-display text-xl md:text-2xl text-primary mb-4",
                  isAr && "font-arabic"
                )}>
                  {activeAmbition.emoji} {isAr ? activeAmbition.ar : activeAmbition.en}
                </h3>

                <p className={cn(
                  "font-body text-sm text-muted-foreground leading-relaxed mb-6",
                  isAr && "font-arabic text-right"
                )}>
                  {isAr ? insight.ar : insight.en}
                </p>

                <Link
                  to={`/skin-concerns`}
                  className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors duration-300"
                >
                  {isAr ? "ابدئي استشارتك" : "Start Your Consultation"}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Product grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {matchedProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.handle || p.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-card mb-3 border border-transparent group-hover:border-accent/30 transition-all duration-[400ms]">
                      {/* Shimmer */}
                      <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-[20deg] pointer-events-none z-20 group-hover:left-[150%] transition-all duration-700" />
                      <img
                        src={p.image_url || "/editorial-showcase-2.webp"}
                        alt={p.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1">
                      {p.brand && (
                        <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-body font-semibold">
                          {p.brand}
                        </p>
                      )}
                      <h4 className="font-display text-xs text-foreground line-clamp-2 leading-snug font-semibold">
                        {p.title}
                      </h4>
                      {p.price != null && (
                        <p className="font-body text-xs text-primary font-bold">
                          {Number(p.price).toFixed(2)} JOD
                        </p>
                      )}
                    </div>
                  </Link>
                ))}

                {matchedProducts.length === 0 &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/5] bg-muted mb-3" />
                      <div className="h-2 bg-muted w-12 mb-1.5" />
                      <div className="h-3 bg-muted w-full" />
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
}
