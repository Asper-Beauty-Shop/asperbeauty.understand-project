import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Stethoscope, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

/* ── Clinical categories (Dr. Sami) ── */
const CLINICAL_TABS = [
  { key: "skincare", en: "Skincare", ar: "العناية بالبشرة" },
  { key: "supplements", en: "Supplements", ar: "المكملات" },
  { key: "sun-protection", en: "Sun Protection", ar: "الحماية من الشمس" },
  { key: "baby", en: "Baby & Mom", ar: "الأم والطفل" },
] as const;

/* ── Luxury categories (Ms. Zain) ── */
const LUXURY_TABS = [
  { key: "makeup", en: "Makeup", ar: "المكياج" },
  { key: "fragrance", en: "Fragrances", ar: "العطور" },
  { key: "hair", en: "Hair Care", ar: "العناية بالشعر" },
  { key: "body", en: "Body & Bath", ar: "الجسم والاستحمام" },
] as const;

/* ── Tab→asper_category mapping ── */
const TAB_FILTERS: Record<string, { concerns?: string[]; asper_categories?: string[] }> = {
  skincare: { asper_categories: ["Clinical Serums & Actives", "Daily Hydration & Barrier", "Targeted Treatments"] },
  supplements: { asper_categories: ["Requires_Manual_Review"] },
  "sun-protection": { asper_categories: ["Sun Protection (SPF)"] },
  baby: { asper_categories: [] },
  makeup: { asper_categories: ["Evening Radiance & Glamour"] },
  fragrance: { asper_categories: ["Fragrance"] },
  hair: { asper_categories: ["Hair Care"] },
  body: { asper_categories: ["Body Care"] },
};

type PersonaKey = "dr_sami" | "ms_zain";

interface TabItem {
  key: string;
  en: string;
  ar: string;
}

function ProductRow({ products, isArabic }: { products: any[]; isArabic: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Nav arrows */}
      <div className="hidden md:flex absolute -top-14 right-0 gap-3 z-10">
        <button
          onClick={() => scroll("left")}
          className="w-10 h-10 rounded-full border border-polished-gold/30 bg-white/50 backdrop-blur-sm hover:border-polished-gold flex items-center justify-center text-asper-ink hover:text-burgundy transition-all duration-500 shadow-sm"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 rounded-full border border-polished-gold/30 bg-white/50 backdrop-blur-sm hover:border-polished-gold flex items-center justify-center text-asper-ink hover:text-burgundy transition-all duration-500 shadow-sm"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-8 pt-4 px-2"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.handle || p.id}`}
            className="group flex-shrink-0 w-[280px] md:w-[320px]"
            data-testid={`bestseller-card-${p.id}`}
          >
            <div className="relative bg-white border border-border/40 p-6 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(128,0,32,0.1)] hover:border-polished-gold/30 hover:-translate-y-1 rounded-sm">
              {/* Shimmer beam */}
              <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-[20deg] pointer-events-none z-20 group-hover:left-[150%] transition-all duration-1000 ease-in-out" />

              <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-asper-stone">
                <img
                  src={p.image_url || "/editorial-showcase-2.jpg"}
                  alt={p.title}
                  className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/5 transition-colors duration-500" />
              </div>

              <div className="space-y-2">
                {p.brand && (
                  <p className="text-[10px] uppercase tracking-[0.2em] text-polished-gold font-body font-bold truncate">
                    {p.brand}
                  </p>
                )}
                <h3 className="font-display text-base text-asper-ink line-clamp-2 leading-tight font-semibold min-h-[2.5rem]">
                  {p.title}
                </h3>
                {p.price != null && (
                  <p className="font-body text-lg text-burgundy font-bold pt-1">
                    {Number(p.price).toFixed(2)} JOD
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}

        {products.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] animate-pulse">
              <div className="aspect-[4/5] bg-muted mb-6" />
              <div className="h-3 bg-muted w-16 mb-2" />
              <div className="h-4 bg-muted w-full" />
            </div>
          ))}
      </div>
    </div>
  );
}

export function DualPersonaBestsellers() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [activePersona, setActivePersona] = useState<PersonaKey>("dr_sami");
  const [activeTab, setActiveTab] = useState("skincare");

  const tabs: TabItem[] = activePersona === "dr_sami" ? [...CLINICAL_TABS] : [...LUXURY_TABS];

  const { data: products = [] } = useQuery({
    queryKey: ["persona-bestsellers", activePersona, activeTab],
    queryFn: async () => {
      let query = supabase.from("products").select("*").neq("availability_status", "Pending_Purge").limit(12);

      const filter = TAB_FILTERS[activeTab];
      if (filter?.asper_categories?.length) {
        query = query.in("asper_category", filter.asper_categories);
      } else if (filter?.concerns?.length) {
        query = query.in("primary_concern", filter.concerns);
      }

      if (activePersona === "dr_sami") {
        query = query.or("ai_persona_lead.eq.dr_sami,ai_persona_lead.is.null");
      } else {
        query = query.or("ai_persona_lead.eq.ms_zain,ai_persona_lead.is.null");
      }

      query = query.order("bestseller_rank", { ascending: true, nullsFirst: false });

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).slice(0, 8);
    },
    staleTime: 60_000,
  });

  const handlePersonaSwitch = (persona: PersonaKey) => {
    setActivePersona(persona);
    setActiveTab(persona === "dr_sami" ? "skincare" : "makeup");
  };

  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: LUXURY_EASE }}
        >
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-burgundy mb-3 block font-bold">
            {isAr ? "مُنتقاة بعناية" : "Curated Bestsellers"}
          </span>
          <h2 className={cn("font-display text-3xl md:text-4xl lg:text-5xl text-asper-ink", isAr && "font-arabic")}>
            {isAr ? "اختيارات خبرائنا" : "Expert-Curated Picks"}
          </h2>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => handlePersonaSwitch("dr_sami")}
            className={cn(
              "group flex items-center gap-2.5 px-6 py-3 border transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
              activePersona === "dr_sami"
                ? "border-burgundy bg-burgundy/5 text-burgundy shadow-sm"
                : "border-border text-muted-foreground hover:border-burgundy/50 hover:text-burgundy"
            )}
          >
            <Stethoscope className={cn("w-4 h-4", activePersona === "dr_sami" ? "text-burgundy" : "text-muted-foreground")} />
            <span className="font-body text-[11px] uppercase tracking-[0.2em] font-bold">
              {isAr ? "اختيارات د. سامي السريرية" : "Dr. Sami's Clinical Picks"}
            </span>
          </button>

          <button
            onClick={() => handlePersonaSwitch("ms_zain")}
            className={cn(
              "group flex items-center gap-2.5 px-6 py-3 border transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
              activePersona === "ms_zain"
                ? "border-polished-gold bg-polished-gold/5 text-asper-ink shadow-sm"
                : "border-border text-muted-foreground hover:border-polished-gold/50 hover:text-asper-ink"
            )}
          >
            <Sparkles className={cn("w-4 h-4", activePersona === "ms_zain" ? "text-polished-gold" : "text-muted-foreground")} />
            <span className="font-body text-[11px] uppercase tracking-[0.2em] font-bold">
              {isAr ? "تعديلات الآنسة زين الفاخرة" : "Ms. Zain's Luxury Edits"}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-5 py-2 font-body text-[11px] uppercase tracking-[0.15em] transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)] border-b-2",
                activeTab === tab.key
                  ? "border-burgundy text-burgundy font-bold"
                  : "border-transparent text-muted-foreground hover:text-asper-ink hover:border-polished-gold/30"
              )}
            >
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activePersona}-${activeTab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: LUXURY_EASE }}
          >
            <ProductRow products={products} isArabic={isAr} />
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block font-body text-[11px] uppercase tracking-[0.3em] text-asper-ink
                       border-b border-polished-gold pb-1 hover:text-burgundy
                       transition-colors duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
          >
            {isAr ? "تصفح الكل" : "View All Products"}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
}
