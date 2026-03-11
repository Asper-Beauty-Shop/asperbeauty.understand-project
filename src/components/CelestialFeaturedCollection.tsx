import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ConsultPharmacistCard } from "@/components/ConsultPharmacistCard";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { trackQuizFunnel } from "@/lib/quizFunnelAnalytics";
import { ShoppingBag } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type SkinConcern = Database["public"]["Enums"]["skin_concern"];

interface TrayProduct {
  id: string;
  handle: string;
  title: string;
  brand: string | null;
  price: number | null;
  image_url: string | null;
  step: string;
  is_hero: boolean;
  is_bestseller: boolean;
  inventory_total: number;
}

interface TrayResponse {
  concern: string;
  step_1: TrayProduct | null;
  step_2: TrayProduct | null;
  step_3: TrayProduct | null;
  generated_at: string;
}

const CONCERNS: { tag: SkinConcern; en: string; ar: string }[] = [
  { tag: "Concern_Hydration", en: "Hydration", ar: "ترطيب" },
  { tag: "Concern_Acne", en: "Acne", ar: "حب الشباب" },
  { tag: "Concern_AntiAging", en: "Anti-Aging", ar: "مكافحة الشيخوخة" },
  { tag: "Concern_Sensitivity", en: "Sensitivity", ar: "حساسية" },
  { tag: "Concern_Pigmentation", en: "Pigmentation", ar: "تصبغات" },
  { tag: "Concern_Brightening", en: "Brightening", ar: "إشراق" },
  { tag: "Concern_Dryness", en: "Dryness", ar: "جفاف" },
  { tag: "Concern_SunProtection", en: "Sun Protection", ar: "حماية من الشمس" },
  { tag: "Concern_DarkCircles", en: "Dark Circles", ar: "هالات سوداء" },
  { tag: "Concern_Redness", en: "Redness", ar: "احمرار" },
  { tag: "Concern_Oiliness", en: "Oiliness", ar: "بشرة دهنية" },
  { tag: "Concern_Aging", en: "Aging", ar: "شيخوخة" },
];

const STEP_META: Record<string, { en: string; ar: string; key: string }> = {
  step_1: { en: "Step 1: Cleanser", ar: "الخطوة ١: المنظف", key: "step_1_cleanser" },
  step_2: { en: "Step 2: Treatment", ar: "الخطوة ٢: المعالجة", key: "step_2_treatment" },
  step_3: { en: "Step 3: Moisturizer / SPF", ar: "الخطوة ٣: المرطب / الحماية", key: "step_3_moisturizer" },
};

const CelestialFeaturedCollection = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [activeConcern, setActiveConcern] = useState<SkinConcern>("Concern_Hydration");
  const [tray, setTray] = useState<TrayResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addMultipleFromPrescription = useCartStore((s) => s.addMultipleFromPrescription);
  const cartLoading = useCartStore((s) => s.isLoading);

  const fetchTray = useCallback(async (concern: SkinConcern) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_tray_by_concern", {
        concern_tag: concern,
      });
      if (error) throw error;
      setTray(data as unknown as TrayResponse);
    } catch (err) {
      console.error("Digital Tray fetch error:", err);
      setTray(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTray(activeConcern);
  }, [activeConcern, fetchTray]);

  const handleConcernClick = (tag: SkinConcern) => {
    setActiveConcern(tag);
    trackQuizFunnel("SELECT_CONCERN", { concern: tag });
  };

  const trayProducts = tray
    ? [tray.step_1, tray.step_2, tray.step_3].filter(Boolean) as TrayProduct[]
    : [];

  const handleAddRoutine = async () => {
    if (!trayProducts.length) return;
    trackQuizFunnel("ADD_TO_CART", { concern: activeConcern, count: trayProducts.length });
    await addMultipleFromPrescription(
      trayProducts.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price ?? 0,
        image_url: p.image_url,
        brand: p.brand,
        category: p.step,
      }))
    );
    toast.success(
      language === "ar" ? "تمت إضافة الروتين إلى السلة" : "Routine added to cart",
      {
        description:
          language === "ar"
            ? `${trayProducts.length} منتج — افتح السلة للاطلاع`
            : `${trayProducts.length} items — open cart to review`,
        position: "top-center",
      }
    );
  };

  const steps = ["step_1", "step_2", "step_3"] as const;

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-10 ${isRTL ? "rtl" : ""}`}>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-sm mb-4 font-body">
            {isRTL ? "روتينك السريري في ٣ خطوات" : "Your Clinical Routine in 3 Steps"}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            {isRTL ? "الصينية الرقمية" : "The Digital Tray"}
          </h2>
          <div className="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {/* Concern Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide md:flex-wrap justify-start md:justify-center gap-3 mb-12 -mx-6 px-6 md:mx-0 md:px-0" dir={isRTL ? "rtl" : "ltr"}>
          {CONCERNS.map((c) => (
            <button
              key={c.tag}
              onClick={() => handleConcernClick(c.tag)}
              className={`px-5 py-2 rounded-full font-body text-sm transition-all border ${
                activeConcern === c.tag
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card text-foreground border-border hover:border-accent hover:shadow-sm"
              }`}
            >
              {isRTL ? c.ar : c.en}
            </button>
          ))}
        </div>

        {/* 3-Step Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-[4/5] bg-muted" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20 mx-auto bg-muted" />
                  <Skeleton className="h-6 w-32 mx-auto bg-muted" />
                  <Skeleton className="h-5 w-16 mx-auto bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((stepKey, index) => {
              const product = tray?.[stepKey] as TrayProduct | null;
              const meta = STEP_META[stepKey];

              if (!product) {
                return (
                  <ConsultPharmacistCard
                    key={stepKey}
                    stepKey={meta.key}
                    className="animate-fade-up"
                  />
                );
              }

              return (
                <Link
                  to={`/product/${product.handle}`}
                  key={product.id}
                  className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent hover:shadow-lg opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {/* Step label */}
                  <div className="px-4 pt-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-accent font-body font-semibold">
                      {isRTL ? meta.ar : meta.en}
                    </span>
                  </div>
                  {/* Image */}
                  <div className="aspect-[4/5] bg-secondary mx-4 mt-2 rounded-lg overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-5 text-center space-y-1.5">
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body">
                      {product.brand || "Asper Beauty"}
                    </p>
                    <h3 className="font-display text-lg text-foreground line-clamp-2">
                      {product.title}
                    </h3>
                    {product.price != null && (
                      <p className="text-accent font-body font-semibold">
                        {product.price.toFixed(2)} JOD
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Quick Add CTA */}
        {!isLoading && trayProducts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleAddRoutine}
              disabled={cartLoading}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-body font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartLoading
                ? isRTL ? "جاري الإضافة..." : "Adding..."
                : isRTL
                  ? `إضافة الروتين الكامل (${trayProducts.reduce((s, p) => s + (p.price ?? 0), 0).toFixed(2)} JOD)`
                  : `Add Full Routine (${trayProducts.reduce((s, p) => s + (p.price ?? 0), 0).toFixed(2)} JOD)`}
            </button>
            <p className="text-[11px] text-muted-foreground mt-3 italic font-body">
              *{isRTL
                ? "تركيبة سريرية من صيدلي آسبر الرقمي"
                : "Clinical formulation by Asper Digital Pharmacist"}
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
    </section>
  );
};

export default CelestialFeaturedCollection;

