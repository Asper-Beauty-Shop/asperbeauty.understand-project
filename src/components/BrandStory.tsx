import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Sparkles } from "lucide-react";
import asperLogo from "@/assets/asper-lotus-logo.png";

const BrandStory = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Top gold accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent to-accent opacity-50" />

      <div className="container mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {isRTL ? "ملاذ العلم والجمال" : "The Sanctuary of Science & Beauty"}
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isRTL
              ? "دماغ واحد، صوتان — دقة سريرية وأناقة جمالية في خدمتك."
              : "One Brain, Two Voices — clinical precision and aesthetic elegance, at your service."}
          </p>
        </div>

        {/* Dual-persona columns */}
        <div
          className={`grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16 ${isRTL ? "direction-rtl" : ""}`}
        >
          {/* Dr. Sami — Clinical */}
          <div
            className={`relative rounded-2xl border border-primary/20 bg-primary/5 p-8 space-y-5 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {isRTL ? "د. سامي" : "Dr. Sami"}
                </h3>
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">
                  {isRTL ? "الصوت السريري" : "The Clinical Voice"}
                </p>
              </div>
            </div>

            <blockquote className="font-body text-muted-foreground leading-relaxed border-s-2 border-primary/30 ps-4 italic">
              {isRTL
                ? "كل منتج على رفوفنا خضع لفحص صيدلاني دقيق. نحن لا نبيع مستحضرات — نقدم حلولاً علمية لبشرتك."
                : "Every product on our shelves undergoes rigorous pharmacist vetting. We don't sell cosmetics — we deliver scientific solutions for your skin."}
            </blockquote>

            <div className="flex flex-wrap gap-2">
              {(isRTL
                ? ["مُختبر سريرياً", "مصادر موثوقة", "معتمد من JFDA"]
                : ["Clinically Tested", "Trusted Sources", "JFDA Authorized"]
              ).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-body rounded-full bg-primary/10 text-primary border border-primary/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Ms. Zain — Aesthetic */}
          <div
            className={`relative rounded-2xl border border-accent/30 bg-accent/5 p-8 space-y-5 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {isRTL ? "مِس زين" : "Ms. Zain"}
                </h3>
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">
                  {isRTL ? "الصوت الجمالي" : "The Aesthetic Voice"}
                </p>
              </div>
            </div>

            <blockquote className="font-body text-muted-foreground leading-relaxed border-s-2 border-accent/40 ps-4 italic">
              {isRTL
                ? "الجمال طقسٌ وليس روتيناً. دعيني أرشدك إلى روتين صباحي يجعل بشرتك تتوهج من الداخل."
                : "Beauty is a ritual, not a routine. Let me guide you to a morning regimen that makes your skin glow from within."}
            </blockquote>

            <div className="flex flex-wrap gap-2">
              {(isRTL
                ? ["إشراقة يومية", "نصائح شخصية", "روتين مخصص"]
                : ["Daily Radiance", "Personal Tips", "Custom Routine"]
              ).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-body rounded-full bg-accent/10 text-accent border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Central logo emblem */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 border border-accent/15 rounded-full animate-spin-slow" />
            <img
              src={asperLogo}
              alt={isRTL ? "شعار أسبر بيوتي" : "Asper Beauty emblem"}
              className="w-28 h-28 rounded-full object-cover border-2 border-accent/30 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Bottom gold accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-t from-transparent to-accent opacity-50" />
    </section>
  );
};

export default BrandStory;
