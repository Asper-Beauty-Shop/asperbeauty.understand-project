import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

/**
 * Clinical Dispatch — Dr. Sami Editorial Block
 * Asymmetric layout: B&W editorial photo + AI-pharmacist content
 */
export const EditorialSpotlight = () => {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-20 lg:py-28 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
            {/* Editorial Photo — 3 columns, asymmetric */}
            <div className="lg:col-span-3 relative overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop"
                alt="Laboratory setting with clinical precision"
                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                loading="lazy"
              />
              {/* Overlay badge */}
              <div className="absolute top-6 left-6">
                <span className="bg-burgundy text-polished-white text-[10px] uppercase tracking-[0.2em] font-body font-semibold px-4 py-2 rounded-full">
                  {isArabic ? "ملف سريري" : "Clinical Dossier"}
                </span>
              </div>
            </div>

            {/* Content — 2 columns */}
            <div className={cn("lg:col-span-2", isArabic && "text-right")}>
              <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-4 block">
                {isArabic ? "من مكتب الدكتور سامي" : "From Dr. Sami's Desk"}
              </span>
              <h2
                className={cn(
                  "font-heading text-2xl lg:text-3xl xl:text-4xl font-bold text-asper-ink mb-6 leading-tight",
                  isArabic && "font-arabic"
                )}
              >
                {isArabic
                  ? "لماذا يصف الدكتور سامي الببتيدات للبيئات الحضرية"
                  : "Why Dr. Sami Prescribes Peptides for Urban Environments"}
              </h2>

              <p
                className={cn(
                  "font-body text-base text-muted-foreground leading-relaxed mb-8 max-w-lg",
                  isArabic && "font-arabic mr-0 ml-auto"
                )}
              >
                {isArabic
                  ? "التلوث الحضري يُسرّع شيخوخة البشرة بنسبة 20%. اكتشفي كيف تعمل الببتيدات النحاسية والنياسيناميد على إعادة بناء حاجز بشرتك وحمايتها من التأكسد اليومي."
                  : "Urban pollution accelerates skin aging by 20%. Discover how copper peptides and niacinamide rebuild your barrier and defend against daily oxidative stress."}
              </p>

              {/* Key points */}
              <div className="space-y-3 mb-8">
                {[
                  { en: "Copper Peptides stimulate collagen synthesis", ar: "ببتيدات النحاس تحفز تخليق الكولاجين" },
                  { en: "Niacinamide strengthens the skin barrier", ar: "النياسيناميد يعزز حاجز البشرة" },
                  { en: "Antioxidant defense against urban pollutants", ar: "دفاع مضاد للأكسدة ضد الملوثات" },
                ].map((point) => (
                  <div key={point.en} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-polished-gold flex-shrink-0" />
                    <span className="font-body text-sm text-asper-ink">
                      {isArabic ? point.ar : point.en}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/skin-concerns">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-burgundy text-burgundy bg-transparent hover:bg-burgundy hover:text-polished-white text-sm uppercase tracking-widest px-8 h-12 font-semibold transition-all duration-400 rounded-none"
                >
                  {isArabic ? "اقرأ الملف" : "Read the Dossier"}
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                      dir === "rtl"
                        ? "mr-2 rotate-180 group-hover:-translate-x-1"
                        : "ml-2"
                    )}
                  />
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />
    </section>
  );
};
