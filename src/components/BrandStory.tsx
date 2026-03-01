import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Sparkles } from "lucide-react";
import asperLogo from "@/assets/asper-lotus-logo.png";

const content = {
  en: {
    title: "Science Meets Luxury",
    subtitle: "The Dual-Voice Philosophy of Asper Beauty",
    drSami: {
      name: "Dr. Sami",
      role: "The Clinical Voice",
      quote: "I provide clinical wellness guidance, grounded in pharmaceutical precision.",
      description:
        "Led by expert pharmacists, every product in our collection is rigorously vetted for safety, efficacy, and active ingredient integrity. We don't just sell skincare; we prescribe solutions for acne, rosacea, and barrier repair.",
      badges: ["JFDA Authorized", "Pharmacist-Vetted", "Clinical Efficacy"],
    },
    msZain: {
      name: "Ms. Zain",
      role: "The Aesthetic Voice",
      quote: "Welcome to your personal beauty ritual. True luxury is in the details.",
      description:
        "Beauty is an experience. From the scent of a premium serum to the glow of a bridal routine, we curate high-end aesthetics that transform your daily skincare into a moment of pure, unapologetic indulgence.",
      badges: ["Bridal Radiance", "Sensorial Textures", "Editorial Glow"],
    },
  },
  ar: {
    title: "حيث يلتقي العلم بالرفاهية",
    subtitle: "فلسفة الصوت المزدوج لجمال أسبر",
    drSami: {
      name: "د. سامي",
      role: "صوت العلم",
      quote: "أقدم إرشادات صحية وسريرية، مبنية على الدقة الصيدلانية.",
      description:
        "بإشراف صيادلة خبراء، يتم فحص كل منتج في مجموعتنا بدقة لضمان الأمان والفعالية وسلامة المكونات الفعالة. نحن لا نبيع منتجات العناية بالبشرة فحسب؛ بل نصف حلولاً لحب الشباب والوردية وإصلاح حاجز البشرة.",
      badges: ["معتمد من JFDA", "فحص صيدلاني", "فعالية سريرية"],
    },
    msZain: {
      name: "مِس زين",
      role: "الصوت الجمالي",
      quote: "الجمال طقسٌ وليس روتيناً. دعيني أرشد توهجك.",
      description:
        "من روتين الإشراقة الصباحية المثالي إلى التدليل المسائي المنسق، تحوّل مِس زين روتينك اليومي إلى تجربة من الملمس والعطر والنتائج المرئية.",
      badges: ["إشراقة يومية", "طقوس شخصية", "روتين مخصص"],
    },
  },
};

const BrandStory = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const t = content[language];

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Top gold accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent to-accent opacity-50" />

      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Dual-persona columns */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
          {/* Dr. Sami — Clinical */}
          <div
            className={`rounded-2xl border border-primary/20 bg-primary/5 p-8 space-y-5 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {t.drSami.name}
                </h3>
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">
                  {t.drSami.role}
                </p>
              </div>
            </div>

            <blockquote
              className={`font-body text-muted-foreground leading-relaxed italic ps-4 ${isRTL ? "border-e-2 border-primary/30 pe-4 ps-0" : "border-s-2 border-primary/30"}`}
            >
              "{t.drSami.quote}"
            </blockquote>

            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {t.drSami.description}
            </p>

            <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}>
              {t.drSami.badges.map((tag) => (
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
            className={`rounded-2xl border border-accent/30 bg-accent/5 p-8 space-y-5 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {t.msZain.name}
                </h3>
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">
                  {t.msZain.role}
                </p>
              </div>
            </div>

            <blockquote
              className={`font-body text-muted-foreground leading-relaxed italic ps-4 ${isRTL ? "border-e-2 border-accent/40 pe-4 ps-0" : "border-s-2 border-accent/40"}`}
            >
              "{t.msZain.quote}"
            </blockquote>

            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {t.msZain.description}
            </p>

            <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}>
              {t.msZain.badges.map((tag) => (
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
