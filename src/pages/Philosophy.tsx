import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, FlaskConical, Globe, Sparkles, Sun, Droplets, Eye, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Visual Identity Showcase Components ─── */

const ColorSwatch = ({ name, nameAr, hex, hsl, token, isArabic }: {
  name: string; nameAr: string; hex: string; hsl: string; token: string; isArabic: boolean;
}) => (
  <div className="group">
    <div
      className="w-full aspect-square rounded-none border border-border/20 mb-3 transition-all duration-400 group-hover:shadow-lg group-hover:-translate-y-1"
      style={{ backgroundColor: hex }}
    />
    <p className="font-display text-sm text-foreground font-semibold">{isArabic ? nameAr : name}</p>
    <p className="font-body text-xs text-muted-foreground mt-0.5">{hex}</p>
    <p className="font-body text-[10px] text-muted-foreground/60 mt-0.5">HSL {hsl}</p>
    <code className="font-mono text-[10px] text-polished-gold block mt-1">--{token}</code>
  </div>
);

const TypographySample = ({ fontClass, fontName, fontNameAr, description, descAr, sample, sampleAr, isArabic }: {
  fontClass: string; fontName: string; fontNameAr: string; description: string; descAr: string;
  sample: string; sampleAr: string; isArabic: boolean;
}) => (
  <div className="py-8 border-b border-border/20 last:border-b-0">
    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
      <div className="md:w-1/3">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-polished-gold mb-1">
          {isArabic ? fontNameAr : fontName}
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          {isArabic ? descAr : description}
        </p>
      </div>
      <div className="md:w-2/3">
        <p className={cn(fontClass, "text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight")}>
          {isArabic ? sampleAr : sample}
        </p>
      </div>
    </div>
  </div>
);

const PrincipleCard = ({ icon, title, titleAr, description, descAr, isArabic }: {
  icon: React.ReactNode; title: string; titleAr: string; description: string; descAr: string; isArabic: boolean;
}) => (
  <div className="p-6 bg-card border border-border/20 hover:border-polished-gold/40 transition-all duration-400 group">
    <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center mb-4 text-burgundy group-hover:bg-burgundy group-hover:text-white transition-colors duration-400">
      {icon}
    </div>
    <h4 className="font-display text-lg text-burgundy mb-2">{isArabic ? titleAr : title}</h4>
    <p className="font-body text-sm text-muted-foreground leading-relaxed">{isArabic ? descAr : description}</p>
  </div>
);

/* ─── Timeline (preserved from original) ─── */

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const useParallax = (speed: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = elementCenter - windowHeight / 2;
        setOffset(distanceFromCenter * speed);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { ref, offset };
};

const TimelineSection = ({ isArabic }: { isArabic: boolean }) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { ref: parallaxRef, offset } = useParallax(0.05);

  const timelineData: { en: TimelineItem[]; ar: TimelineItem[] } = {
    en: [
      { year: "2015", title: "The Pharmacy Roots", description: "Asper began as a trusted community pharmacy in Amman, built on the foundation of clinical expertise and genuine care for every customer.", icon: <FlaskConical className="w-5 h-5" /> },
      { year: "2018", title: "Dermatology Focus", description: "We expanded into clinical skincare, partnering with dermatologists to curate medical-grade products that deliver real results.", icon: <Sparkles className="w-5 h-5" /> },
      { year: "2021", title: "Digital Evolution", description: "Asper Beauty was born—bringing our pharmacy heritage online with a curated selection of luxury skincare and expert guidance.", icon: <Globe className="w-5 h-5" /> },
      { year: "2024", title: "Jordan's Premier Destination", description: "Today, we are recognized as Amman's leading digital beauty concierge, trusted by thousands for authentic, effective products.", icon: <Award className="w-5 h-5" /> },
    ],
    ar: [
      { year: "2015", title: "الجذور الصيدلانية", description: "بدأت آسبر كصيدلية مجتمعية موثوقة في عمّان، مبنية على أساس الخبرة السريرية والرعاية الحقيقية لكل عميل.", icon: <FlaskConical className="w-5 h-5" /> },
      { year: "2018", title: "التركيز على طب الجلدية", description: "توسعنا في العناية بالبشرة السريرية، بالشراكة مع أطباء الجلدية لاختيار منتجات طبية تحقق نتائج حقيقية.", icon: <Sparkles className="w-5 h-5" /> },
      { year: "2021", title: "التطور الرقمي", description: "ولدت آسبر بيوتي—لنقل إرثنا الصيدلاني عبر الإنترنت مع مجموعة مختارة من مستحضرات العناية الفاخرة وإرشادات الخبراء.", icon: <Globe className="w-5 h-5" /> },
      { year: "2024", title: "الوجهة الأولى في الأردن", description: "اليوم، نحن معروفون كأفضل خدمة كونسيرج رقمية للجمال في عمّان، موثوقون من الآلاف للحصول على منتجات أصلية وفعالة.", icon: <Award className="w-5 h-5" /> },
    ],
  };

  const items = timelineData[isArabic ? "ar" : "en"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => prev.includes(index) ? prev : [...prev, index]);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" },
    );
    const elements = timelineRef.current?.querySelectorAll("[data-index]");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={parallaxRef}
      className="py-16 md:py-24 bg-burgundy/5 -mx-6 md:-mx-8 px-6 md:px-8 my-16 md:my-24"
      style={{ transform: `translateY(${offset}px)`, transition: "transform 0.1s ease-out" }}
    >
      <div className="text-center mb-12 md:mb-16">
        <span className="font-script text-xl md:text-2xl text-gold mb-3 block">
          {isArabic ? "رحلتنا" : "Our Journey"}
        </span>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy">
          {isArabic ? "من الصيدلية إلى الفخامة" : "From Pharmacy to Luxury"}
        </h2>
      </div>

      <div ref={timelineRef} className="relative">
        <div className={`absolute ${isArabic ? "right-6 md:right-1/2 md:translate-x-1/2" : "left-6 md:left-1/2 md:-translate-x-1/2"} top-0 bottom-0 w-px bg-gold/40`} />

        <div className="space-y-12 md:space-y-0">
          {items.map((item, index) => (
            <div
              key={index}
              data-index={index}
              className={`relative md:flex md:items-center md:justify-center transition-all duration-700 ease-out ${visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 150}ms`, transform: visibleItems.includes(index) ? `translateY(${index % 2 === 0 ? offset * 0.3 : offset * -0.3}px)` : undefined }}
            >
              <div className={`${isArabic ? "mr-12 md:mr-0" : "ml-12 md:ml-0"} md:w-5/12 ${index % 2 === 0 ? (isArabic ? "md:ml-auto md:mr-8" : "md:mr-auto md:ml-8") : (isArabic ? "md:mr-auto md:ml-8" : "md:ml-auto md:mr-8")} ${index > 0 ? "md:mt-16" : ""}`}>
                <div className="bg-white p-6 shadow-sm border border-gold/20 hover:shadow-md hover:border-gold/40 transition-all duration-400">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-2xl md:text-3xl text-gold font-semibold">{item.year}</span>
                  </div>
                  <h3 className="font-display text-lg md:text-xl text-burgundy mb-2">{item.title}</h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
              <div className={`absolute ${isArabic ? "right-0" : "left-0"} md:left-1/2 md:-translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-gold flex items-center justify-center text-burgundy shadow-lg z-10 transition-transform duration-500 ${visibleItems.includes(index) ? "scale-100" : "scale-0"}`} style={{ transitionDelay: `${index * 150 + 200}ms` }}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Main Page ─── */

const Philosophy = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const colors = [
    { name: "Soft Ivory", nameAr: "عاجي ناعم", hex: "#F8F8FF", hsl: "240 100% 99%", token: "background" },
    { name: "Deep Maroon", nameAr: "ماروني عميق", hex: "#800020", hsl: "345 100% 25%", token: "burgundy" },
    { name: "Shiny Gold", nameAr: "ذهبي لامع", hex: "#C5A028", hsl: "43 69% 46%", token: "polished-gold" },
    { name: "Dark Charcoal", nameAr: "فحمي داكن", hex: "#333333", hsl: "0 0% 20%", token: "asper-ink" },
    { name: "Pure White", nameAr: "أبيض نقي", hex: "#FFFFFF", hsl: "0 0% 100%", token: "card" },
    { name: "Rose Clay", nameAr: "طين وردي", hex: "#C4A494", hsl: "20 28% 67%", token: "rose-clay" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden" dir={isArabic ? "rtl" : "ltr"}>
      <Header />

      <main className="pt-32 md:pt-40 pb-24">
        {/* ═══ HERO ═══ */}
        <div className="max-w-[900px] mx-auto px-6 md:px-8 text-center mb-20 md:mb-28">
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-polished-gold mb-4 block">
            {isArabic ? "هوية العلامة التجارية" : "Brand Identity"}
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-burgundy leading-tight mb-6">
            {isArabic ? "فلسفتنا البصرية" : "Our Visual Philosophy"}
          </h1>
          <p className="font-display text-xl md:text-2xl text-foreground/70 italic max-w-lg mx-auto">
            {isArabic
              ? "مُنتقاة من الصيادلة. مدعومة بالذكاء."
              : "Curated by Pharmacists. Powered by Intelligence."}
          </p>
          <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-polished-gold to-transparent mx-auto" />
        </div>

        <article className="max-w-[1000px] mx-auto px-6 md:px-8">

          {/* ═══ SECTION 1: THE PIVOT ═══ */}
          <section className="mb-20 md:mb-28">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
              01 — {isArabic ? "التحول الاستراتيجي" : "The Strategic Pivot"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-6">
              {isArabic ? "من 'حفلة مسائية' إلى 'صباح السبا'" : "From 'Evening Gala' to 'Morning Spa'"}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="p-6 bg-[#1a1a2e] text-white/70 border border-white/10">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
                  {isArabic ? "السابق" : "Before"}
                </p>
                <p className="font-display text-lg text-white/90 mb-2">
                  {isArabic ? "الأناقة المظلمة" : "Dark Elegance"}
                </p>
                <p className="font-body text-sm leading-relaxed">
                  {isArabic
                    ? "خلفيات داكنة، نصوص ذهبية، ظلال ثقيلة — جمال غامض وحصري."
                    : "Dark maroon backgrounds, gold text, heavy shadows — mysterious exclusivity."}
                </p>
              </div>
              {/* After */}
              <div className="p-6 bg-card border border-polished-gold/30 shadow-sm">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-polished-gold mb-3">
                  {isArabic ? "الحالي" : "Now"}
                </p>
                <p className="font-display text-lg text-burgundy mb-2">
                  {isArabic ? "الجودة الأصيلة" : "Authentic Quality"}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "خلفيات عاجية ناعمة، طباعة داكنة واضحة، ذهب بأناقة — دقة سريرية شفافة."
                    : "Soft ivory canvas, dark crisp typography, gold with restraint — transparent clinical precision."}
                </p>
              </div>
            </div>
          </section>

          {/* ═══ SECTION 2: COLOR PALETTE ═══ */}
          <section className="mb-20 md:mb-28">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
              02 — {isArabic ? "لوحة الألوان السريرية" : "The Clinical Palette"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-4">
              {isArabic ? "لغة اللون" : "The Language of Color"}
            </h2>
            <p className="font-body text-base text-muted-foreground mb-10 max-w-xl">
              {isArabic
                ? "كل لون يؤدي دورًا محددًا في بناء الثقة والوضوح السريري."
                : "Every color serves a precise role in building trust and clinical clarity."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {colors.map((c) => (
                <ColorSwatch key={c.token} {...c} isArabic={isArabic} />
              ))}
            </div>

            {/* Midas Touch demo */}
            <div className="mt-12 p-8 bg-background border border-border/20">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-polished-gold mb-4">
                {isArabic ? "تفاعل 'اللمسة الذهبية'" : "The 'Midas Touch' Interaction"}
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-32 h-40 bg-card border border-border/30 hover:border-polished-gold hover:-translate-y-1 hover:shadow-lg transition-all duration-400 flex items-center justify-center"
                  >
                    <span className="font-body text-xs text-muted-foreground">
                      {isArabic ? `بطاقة ${i}` : `Card ${i}`}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground text-center mt-4">
                {isArabic
                  ? "مرر المؤشر فوق البطاقات لرؤية حدود الختم الذهبي"
                  : "Hover over cards to see the gold seal border illuminate"}
              </p>
            </div>
          </section>

          {/* ═══ SECTION 3: TYPOGRAPHY ═══ */}
          <section className="mb-20 md:mb-28">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
              03 — {isArabic ? "هندسة الطباعة" : "Typography Architecture"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-8">
              {isArabic ? "أصوات العلامة التجارية" : "The Brand Voices"}
            </h2>

            <div className="border-t border-border/20">
              <TypographySample
                fontClass="font-display"
                fontName="Playfair Display"
                fontNameAr="بلاي فير ديسبلاي"
                description="The Voice of Luxury — used for headings to evoke timeless 'Eternal Elegance'."
                descAr="صوت الفخامة — يُستخدم للعناوين لإثارة 'الأناقة الخالدة'."
                sample="Timeless Radiance"
                sampleAr="إشراقة خالدة"
                isArabic={isArabic}
              />
              <TypographySample
                fontClass="font-body"
                fontName="Montserrat"
                fontNameAr="مونتسيرات"
                description="The Voice of Science — clean geometric font for UI, body copy, and technical data."
                descAr="صوت العلم — خط هندسي نظيف لواجهة المستخدم والنصوص التقنية."
                sample="Clinical Precision"
                sampleAr="دقة سريرية"
                isArabic={isArabic}
              />
              <TypographySample
                fontClass="font-arabic"
                fontName="Tajawal"
                fontNameAr="تجوّل"
                description="Arabic authority — geometrically structured for medical luxury in RTL markets."
                descAr="سلطة عربية — هيكل هندسي للفخامة الطبية في الأسواق العربية."
                sample="جودة أصيلة"
                sampleAr="جودة أصيلة"
                isArabic={isArabic}
              />
              <TypographySample
                fontClass="font-script"
                fontName="Great Vibes"
                fontNameAr="غريت فايبز"
                description="The Signature — reserved for signatures and ceremonial accents."
                descAr="التوقيع — محجوز للتوقيعات واللمسات الاحتفالية."
                sample="The Asper Way"
                sampleAr="أسلوب آسبر"
                isArabic={isArabic}
              />
            </div>
          </section>

          {/* ═══ SECTION 4: CLEAN SCIENCE PHOTOGRAPHY ═══ */}
          <section className="mb-20 md:mb-28">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
              04 — {isArabic ? "تصوير 'العلم النظيف'" : "'Clean Science' Photography"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-4">
              {isArabic ? "قواعد التصوير" : "Photography Rules"}
            </h2>
            <p className="font-body text-base text-muted-foreground mb-10 max-w-xl">
              {isArabic
                ? "كل صورة يجب أن تعكس الشفافية والنقاء السريري — بدون استثناء."
                : "Every image must reflect transparency and clinical purity — no exceptions."}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <PrincipleCard
                icon={<Sun className="w-5 h-5" />}
                title="High-Key Natural Light"
                titleAr="إضاءة طبيعية عالية"
                description="Bright, airy compositions. Morning sunlight through clean glass. No artificial neon, no heavy shadows."
                descAr="تراكيب مشرقة ومفتوحة. ضوء صباحي عبر زجاج نظيف. بدون نيون اصطناعي، بدون ظلال ثقيلة."
                isArabic={isArabic}
              />
              <PrincipleCard
                icon={<Droplets className="w-5 h-5" />}
                title="Ingredient-First"
                titleAr="المكونات أولاً"
                description="Macro textures showing tangible quality — clear serums, suspended gold elements, 'The Alchemist's Touch'."
                descAr="أنسجة مقربة تظهر الجودة الملموسة — سيروم شفاف، عناصر ذهبية معلقة، 'لمسة الخيميائي'."
                isArabic={isArabic}
              />
              <PrincipleCard
                icon={<Eye className="w-5 h-5" />}
                title="Organic Surfaces"
                titleAr="أسطح طبيعية"
                description="Marble, linen, botanical elements. Materials that convey purity and luxury without artifice."
                descAr="رخام، كتان، عناصر نباتية. مواد تنقل النقاء والفخامة بدون تصنع."
                isArabic={isArabic}
              />
              <PrincipleCard
                icon={<Camera className="w-5 h-5" />}
                title="Strictly Forbidden"
                titleAr="ممنوع تمامًا"
                description="Heavy dark shadows, artificial galaxy swirls, neon lighting, or any 'Evening Gala' aesthetic remnants."
                descAr="ظلال داكنة ثقيلة، دوامات مجرية اصطناعية، إضاءة نيون، أو أي بقايا من جمالية 'الحفلة المسائية'."
                isArabic={isArabic}
              />
            </div>
          </section>

          {/* ═══ SECTION 5: UI PRINCIPLES ═══ */}
          <section className="mb-20 md:mb-28">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
              05 — {isArabic ? "مبادئ واجهة المستخدم" : "UI Principles"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-8">
              {isArabic ? "الصينية الرقمية والزجاج السريري" : "Digital Tray & Frosted Clinical Glass"}
            </h2>

            <div className="space-y-6">
              {/* Glassmorphism demo */}
              <div className="p-8 bg-gradient-to-br from-background to-card border border-border/20">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { en: "Pure White Cards", ar: "بطاقات بيضاء نقية", desc: isArabic ? "على خلفية عاجية للتباين النقي" : "On ivory canvas for pristine contrast" },
                    { en: "Frosted Glass", ar: "زجاج بلوري", desc: isArabic ? "شفافية طبية باستخدام backdrop-blur" : "Clinical transparency with backdrop-blur" },
                    { en: "Gold Seal Borders", ar: "حدود الختم الذهبي", desc: isArabic ? "ذهب 1px عند التمرير — ختم الأصالة" : "1px gold on hover — the seal of authenticity" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-card/60 backdrop-blur-sm md:backdrop-blur-md border border-border/30 hover:border-polished-gold p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <p className="font-display text-base text-burgundy mb-1">{isArabic ? item.ar : item.en}</p>
                      <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══ SECTION 6: BRAND MARKS ═══ */}
          <section className="mb-20 md:mb-28">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
              06 — {isArabic ? "العلامات التجارية" : "Brand Marks"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-4">
              {isArabic ? "اللوتس وختم الأصالة" : "The Lotus & The Seal of Authenticity"}
            </h2>
            <p className="font-body text-base text-muted-foreground mb-8 max-w-xl">
              {isArabic
                ? "شعار اللوتس يمثل 'الجمال العضوي يلتقي بالكمال الرياضي'. الختم الذهبي — ختم الموافقة على التعبئة والمنصات الرقمية."
                : "The Lotus emblem represents 'organic beauty meeting mathematical perfection'. The Golden Seal — a stamp of approval on packaging and digital platforms."}
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { en: "Intelligent.", ar: "ذكي." },
                { en: "Authentic.", ar: "أصيل." },
                { en: "Eternal.", ar: "خالد." },
              ].map((word, i) => (
                <span
                  key={i}
                  className="font-display text-lg md:text-xl text-burgundy border-b-2 border-polished-gold/40 pb-1"
                >
                  {isArabic ? word.ar : word.en}
                </span>
              ))}
            </div>
          </section>

          {/* ═══ SECTION 7: APPROVED SLOGANS ═══ */}
          <section className="mb-20 md:mb-28 p-8 md:p-12 bg-burgundy/5 border border-burgundy/10">
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
              07 — {isArabic ? "الشعارات المعتمدة" : "Approved Slogans"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-8">
              {isArabic ? "قاموس العلامة التجارية" : "The Brand Lexicon"}
            </h2>
            <div className="space-y-6">
              {[
                { context: isArabic ? "الشعار الرئيسي" : "Primary Anchor", en: "Curated by Pharmacists. Powered by Intelligence.", ar: "مُنتقاة من الصيادلة. مدعومة بالذكاء.", primary: true },
                { context: isArabic ? "فلسفة العلامة" : "Brand Philosophy", en: "We are not just selling cosmetics; we are dispensing beauty through intelligence.", ar: "لسنا نبيع مستحضرات تجميل فحسب؛ نحن نصرف الجمال عبر الذكاء." },
                { context: isArabic ? "الهوية الأساسية" : "Core Identity", en: "Intelligent. Authentic. Eternal.", ar: "ذكي. أصيل. خالد." },
                { context: isArabic ? "العلم النظيف" : "Clean Science", en: "Nature Contained by Science.", ar: "الطبيعة محتواة بالعلم." },
                { context: isArabic ? "الاتصال العاطفي" : "Emotional Connection", en: "Where science meets soul.", ar: "حيث يلتقي العلم بالروح." },
                { context: isArabic ? "مكافحة الشيخوخة" : "Anti-Aging", en: "Timeless Beauty: Trusted Solutions for Ageless Radiance.", ar: "جمال خالد: حلول موثوقة لإشراقة لا تعرف العمر." },
              ].map((slogan, i) => (
                <div key={i} className={cn("pb-5 border-b border-border/20 last:border-b-0", slogan.primary && "pb-6")}>
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] text-polished-gold mb-1">{slogan.context}</p>
                  <p className={cn(
                    "font-display text-foreground",
                    slogan.primary ? "text-xl md:text-2xl text-burgundy font-semibold" : "text-base md:text-lg"
                  )}>
                    {isArabic ? slogan.ar : slogan.en}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ TIMELINE (preserved) ═══ */}
          <TimelineSection isArabic={isArabic} />

          {/* ═══ ORIGIN STORY ═══ */}
          <section className="mb-16 md:mb-24">
            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-6">
              {isArabic ? "ولدت من العلم. مختارة لكِ." : "Born from Science. Curated for You."}
            </h2>
            <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-10">
              {isArabic
                ? "آسبر بيوتي ليست مجرد متجر؛ إنها التطور الرقمي لإرثنا الصيدلاني. نحن نسد الفجوة بين طب الجلدية السريري والفخامة الراقية، مما يضمن أن كل منتج نقدمه فعال بقدر ما هو أنيق."
                : "Asper Beauty is not just a store; it is the digital evolution of our pharmacy heritage. We bridge the gap between clinical dermatology and high-end luxury, ensuring that every product we offer is as effective as it is elegant."}
            </p>

            <div className="flex justify-center my-12">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-polished-gold to-transparent" />
            </div>

            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-6">
              {isArabic ? "فن الاختيار." : "The Art of Selection."}
            </h2>
            <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-10">
              {isArabic
                ? "نرفض 90% من المنتجات التي نراجعها. إذا لم تستوفِ التركيبة معاييرنا الصارمة لنقاء المكونات والأداء، فلن تصل إلى رفوفنا."
                : "We reject 90% of the products we review. If a formulation does not meet our strict standards for ingredient purity and performance, it does not make it to our shelves."}
            </p>

            <div className="flex justify-center my-12">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-polished-gold to-transparent" />
            </div>

            <h2 className="font-display text-2xl md:text-3xl text-burgundy mb-6">
              {isArabic ? "الكونسيرج الرقمي في عمّان." : "Amman's Digital Concierge."}
            </h2>
            <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
              {isArabic
                ? "من لحظة تصفحك إلى لحظة وصول طردنا المميز إلى بابك، يتم التعامل معك بعناية العميل الخاص."
                : "From the moment you browse to the moment our signature package arrives at your door, you are treated with the care of a private client. Expert advice is just a click away."}
            </p>
          </section>

          {/* Signature */}
          <div className="pt-8 border-t border-polished-gold/30 text-center">
            <span className="font-script text-3xl md:text-4xl text-polished-gold">
              {isArabic ? "فريق آسبر" : "The Asper Team"}
            </span>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Philosophy;
