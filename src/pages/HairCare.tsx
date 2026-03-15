import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Shield, Leaf, Star, ChevronRight, Droplets, FlaskConical, Heart, Wind, Scissors, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpertTipWidget } from "@/components/ExpertTipWidget";
import { ClinicalBadge, DermBadge } from "@/components/TrustBadges";

const BRANDS = [
  { name: "Ducray", slug: "ducray", tagline: "Clinical hair & scalp solutions since 1952", concern: "Hair Loss & Scalp" },
  { name: "Vichy Dercos", slug: "vichy", tagline: "Mineralizing volcanic water for hair", concern: "Anti-Dandruff & Strengthening" },
  { name: "René Furterer", slug: "rene-furterer", tagline: "Plant-based hair care expertise", concern: "Nourishing & Repair" },
  { name: "Kérastase", slug: "kerastase", tagline: "Luxury professional hair rituals", concern: "Luxury & Repair" },
  { name: "Bioderma", slug: "bioderma", tagline: "Biology at the service of dermatology", concern: "Sensitive Scalp" },
];

const CATEGORIES = [
  { label: "Shampoo & Conditioner", icon: Droplets, slug: "shampoo", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Hair Loss Treatments", icon: FlaskConical, slug: "hair-loss", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Scalp Care", icon: Shield, slug: "scalp-care", color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Hair Masks & Repair", icon: Heart, slug: "hair-mask", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { label: "Dry & Damaged Hair", icon: Wind, slug: "dry-hair", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Color Protection", icon: Scissors, slug: "color-protection", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

const GUIDES = [
  {
    title: "Understanding Hair Loss",
    description: "Learn the clinical difference between androgenic alopecia, telogen effluvium, and scalp conditions — and which treatments work.",
    icon: FlaskConical,
  },
  {
    title: "Ingredient Guide for Hair",
    description: "Minoxidil, Biotin, Caffeine, Niacinamide for scalp — understand what each active does for hair density and health.",
    icon: Sparkles,
  },
  {
    title: "Building Your Hair Regimen",
    description: "A pharmacist-curated 3-step hair care routine: Cleanse → Treat → Protect. Tailored to your scalp type and concerns.",
    icon: Leaf,
  },
];

export default function HairCare() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className={`min-h-screen bg-background font-body${isAr ? " rtl" : ""}`}>
      <Header />

      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div className="pt-28 pb-2 px-4 max-w-5xl mx-auto">
        <Breadcrumb
          items={[
            { label: isAr ? "العناية بالشعر" : "Hair Care", href: "/hair-care" },
            { label: isAr ? "علاجات الشعر والفروة" : "Clinical Hair Treatments" },
          ]}
        />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-8 pb-20">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <FlaskConical className="h-3.5 w-3.5" />
            <span>{isAr ? "صيدلاني متخصص · علاجات سريرية للشعر" : "Pharmacist-Curated · Clinical Hair Treatments"}</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            {isAr
              ? "أفضل منتجات العناية بالشعر والفروة في الأردن — علاجات سريرية موصى بها"
              : "Premium Hair Care & Scalp Treatments — Jordan's #1 Clinical Pharmacy"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3 font-body">
            {isAr
              ? "اكتشف منتجات العناية بالشعر المتخصصة — من علاجات تساقط الشعر إلى ترطيب الفروة — موصى بها من صيادلة Asper."
              : "Shop 500+ clinical hair care products — pharmacist-verified treatments for hair loss, scalp conditions, and nourishing repair. Same-day delivery in Amman."}
          </p>
          <p className="text-sm text-muted-foreground/70 mb-8">
            {isAr
              ? "Ducray · Vichy Dercos · René Furterer · Kérastase وأكثر"
              : "Ducray · Vichy Dercos · René Furterer · Kérastase & more"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/shop?category=hair-care">
                {isAr ? "تسوق منتجات الشعر" : "Shop Hair Care"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/concerns/hair-loss">
                {isAr ? "علاجات تساقط الشعر" : "Hair Loss Treatments"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── What is Clinical Hair Care ─────────────────────────────────── */}
      <section className="py-16 bg-background" aria-label="About clinical hair care">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {isAr ? "ما الذي يميّز العناية السريرية بالشعر؟" : "What Makes Clinical Hair Care Different?"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {isAr
                ? "منتجات الشعر السريرية مُصاغة بتركيزات فعّالة مثبتة علميًا لنتائج حقيقية وملموسة"
                : "Clinical hair care bridges cosmetics and pharmaceuticals — formulated to treat the scalp and strengthen hair at the root"}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FlaskConical,
                title: isAr ? "مُصاغ سريريًا للشعر" : "Clinically Formulated for Hair",
                body: isAr
                  ? "تركيزات فعّالة مثبتة علميًا من مكثفات الشعر والبيوتين والكافيين لتقوية بصيلات الشعر."
                  : "Proven active concentrations of hair densifiers, biotin, and caffeine to stimulate follicles and reduce shedding.",
              },
              {
                icon: Shield,
                title: isAr ? "موصى به من الأطباء" : "Dermatologist Recommended",
                body: isAr
                  ? "تُوصي به عيادات الأمراض الجلدية وأطباء الشعر في الأردن والعالم."
                  : "Recommended by trichologists and dermatology clinics across Jordan and globally for scalp health.",
              },
              {
                icon: Leaf,
                title: isAr ? "آمن لجميع أنواع الشعر" : "Safe for All Hair Types",
                body: isAr
                  ? "مُختبَر طبياً — مناسب لفروة الرأس الحساسة والشعر المصبوغ وشعر ما بعد الولادة."
                  : "Rigorously tested — suitable for sensitive scalp, color-treated, and post-partum hair loss routines.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-border/60 bg-card p-6 flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Categories ─────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {isAr ? "تسوق منتجات الشعر بالفئة" : "Shop Hair Care by Category"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr ? "كل ما تحتاجه لروتين عناية متكامل بشعرك وفروة رأسك" : "Clinical hair treatments for every concern — from scalp health to intense repair"}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CATEGORIES.map(({ label, icon: Icon, slug, color }) => (
              <Link
                key={slug}
                to={`/shop?category=${slug}`}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${color}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium leading-tight">{label}</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted Brands ────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {isAr ? "أفضل علامات العناية بالشعر العالمية" : "Premium Clinical Hair Care Brands"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr ? "أبرز العلامات الطبية المتخصصة في الشعر — منتقاة ومعتمدة من صيادلة Asper" : "The world's most trusted clinical hair brands — curated and stocked by Asper's pharmacists"}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BRANDS.map(({ name, slug, tagline, concern }) => (
              <Link
                key={slug}
                to={`/brands/${slug}`}
                className="group rounded-xl border border-border/60 bg-card p-5 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-foreground text-lg">{name}</h3>
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-xs text-muted-foreground italic">{tagline}</p>
                <span className="inline-block rounded-full bg-primary/10 text-primary text-[11px] font-medium px-2.5 py-0.5 w-fit">
                  {concern}
                </span>
                <span className="mt-1 text-xs text-primary/70 group-hover:text-primary transition-colors flex items-center gap-1">
                  {isAr ? "تسوق الآن" : "Shop brand"} <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Expert Tip + Trust Badges ─────────────────────────────────── */}
      <section className="py-10 bg-background">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <ExpertTipWidget />
            <div className="rounded-xl border border-border/60 bg-card p-5 flex flex-col gap-3">
              <h3 className="font-heading font-semibold text-foreground text-sm">
                {isAr ? "شارات الجودة والثقة" : "Why Trust Asper for Hair Care?"}
              </h3>
              <div className="flex flex-wrap gap-2">
                <ClinicalBadge size="md" />
                <DermBadge label="Dermatologist Endorsed" />
                <span className="inline-flex items-center gap-1 rounded-full border text-[10px] font-medium px-2 py-0.5 border-amber-300 bg-amber-50 text-amber-700">
                  ★ 4.9/5 Customer Rating
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border text-[10px] font-medium px-2 py-0.5 border-blue-300 bg-blue-50 text-blue-700">
                  🇯🇴 Jordan's #1 Clinical Pharmacy
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr
                  ? "كل منتج لرعاية الشعر في مخزوننا مُختبَر طبياً وموصى به من صيادلة وأطباء جلدية متخصصين في صحة الشعر."
                  : "Every hair care product in our inventory is clinically tested and personally curated by our licensed pharmacists and trichology specialists."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Guides & Resources ────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {isAr ? "دليل العناية بالشعر من صيادلة Asper" : "Clinical Hair Care Guides & Expert Advice"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr
                ? "دليلك العلمي الشامل لاختيار منتجات الشعر الصحيحة وبناء روتين فعّال"
                : "Expert-written guides to help you choose the right hair treatments, understand clinical actives, and build an effective hair care routine"}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {GUIDES.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-xl border border-border/60 bg-card p-6 flex flex-col gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-4.5 w-4.5 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{description}</p>
                <Link to="/skin-concerns" className="text-xs text-primary hover:underline flex items-center gap-1">
                  {isAr ? "اقرأ المزيد" : "Read more"} <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
            {isAr
              ? "احصل على استشارة صيدلانية مجانية لعناية شعرك"
              : "Free Pharmacist Consultation — Find Your Perfect Hair Care Routine"}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {isAr
              ? "فريقنا من الصيادلة المتخصصين يساعدك في اختيار العلاج المثالي لشعرك. توصيل نفس اليوم في عمّان."
              : "Our specialist pharmacists will guide you to the perfect clinical hair care routine for your scalp type and concerns. Same-day delivery in Amman."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/?intent=consultation">
                {isAr ? "ابدأ الاستشارة الآن" : "Start Your Consultation"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">
                {isAr ? "تواصل معنا" : "Contact Us"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
