import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

export const EditorialSpotlight = () => {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-16 lg:py-24 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/30 to-transparent" />

      <div className="luxury-container">
        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Lifestyle Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80&auto=format&fit=crop"
                alt="Hydration trio skincare products in luxury setting"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-burgundy text-polished-white text-xs uppercase tracking-[0.2em] font-body font-semibold px-4 py-2 rounded-full">
                  {isArabic ? "مطلوب!" : "WANTED!"}
                </span>
              </div>
            </div>

            {/* Descriptive Content */}
            <div className={cn(isArabic && "text-right")}>
              <span className="font-body text-xs uppercase tracking-[0.3em] text-polished-gold mb-4 block">
                {isArabic ? "منتجات مميزة" : "Hero Products"}
              </span>
              <h2
                className={cn(
                  "font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-asper-ink mb-6 leading-tight",
                  isArabic && "font-arabic"
                )}
              >
                {isArabic
                  ? "ثلاثي الترطيب المثالي"
                  : "The Ultimate Hydration Trio"}
              </h2>

              <p
                className={cn(
                  "font-body text-base text-muted-foreground leading-relaxed mb-8 max-w-lg",
                  isArabic && "font-arabic mr-0 ml-auto"
                )}
              >
                {isArabic
                  ? "تركيبة علمية مدروسة تمنح بشرتك ترطيباً عميقاً يدوم 72 ساعة. من التنظيف إلى الحماية — كل خطوة مصممة لإشراقة طبيعية."
                  : "A clinically formulated trio delivering 72-hour deep hydration. From cleansing to protection — every step is designed for a natural, healthy glow."}
              </p>

              {/* Product mini-list */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    step: isArabic ? "الخطوة ١" : "Step 1",
                    name: isArabic ? "جل منظف مرطب · تنظيف يومي لطيف" : "Hydrating Cleansing Gel · Gentle Daily Purifier",
                  },
                  {
                    step: isArabic ? "الخطوة ٢" : "Step 2",
                    name: isArabic ? "سيروم الهيالورونيك · ترطيب مكثف" : "Hyaluronic Acid Serum · Intense Moisture Surge",
                  },
                  {
                    step: isArabic ? "الخطوة ٣" : "Step 3",
                    name: isArabic ? "كريم ترطيب عميق · إعادة بناء الحاجز" : "Rich Moisture Barrier Cream · Deep Repair Treatment",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-center gap-4 border-b border-border pb-3"
                  >
                    <span className="text-xs uppercase tracking-wider text-polished-gold font-body font-semibold w-16 flex-shrink-0">
                      {item.step}
                    </span>
                    <span className="font-body text-sm text-asper-ink">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/skin-concerns">
                <Button
                  size="lg"
                  className="group bg-burgundy text-primary-foreground hover:bg-burgundy-light border border-transparent hover:border-polished-gold text-sm uppercase tracking-widest px-8 h-12 font-semibold transition-all duration-400"
                >
                  {isArabic ? "اكتشفي الآن" : "Discover Now"}
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
