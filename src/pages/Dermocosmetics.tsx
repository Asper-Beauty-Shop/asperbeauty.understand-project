import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useLanguage } from "@/contexts/LanguageContext";
import { FlaskConical, Leaf, Shield, Star, ChevronRight, Sparkles, Heart, Eye, Sun, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpertTipWidget } from "@/components/ExpertTipWidget";
import { ClinicalBadge, DermBadge } from "@/components/TrustBadges";
import { DermocosmecticsQuiz } from "@/components/DermocosmecticsQuiz";
import { ProductFinderWidget } from "@/components/ProductFinderWidget";

const BRANDS = [
  { name: "Eucerin", slug: "eucerin", tagline: "Dermatologically tested since 1900", concern: "Sensitive & Dry Skin" },
  { name: "La Roche-Posay", slug: "la-roche-posay", tagline: "Recommended by dermatologists worldwide", concern: "Reactive & Sensitive Skin" },
  { name: "CeraVe", slug: "cerave", tagline: "Developed with dermatologists", concern: "All Skin Types" },
  { name: "Bioderma", slug: "bioderma", tagline: "Biology at the service of dermatology", concern: "Sensitive & Oily Skin" },
  { name: "Vichy", slug: "vichy", tagline: "Mineralizing volcanic water", concern: "Anti-Aging & Revitalizing" },
];

const CATEGORIES = [
  { label: "Cleanser & Toner", icon: Droplets, slug: "cleanser", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Serums & Treatments", icon: FlaskConical, slug: "serum", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Moisturizers & SPF", icon: Shield, slug: "moisturizer", color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Eye Care", icon: Eye, slug: "eye-care", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { label: "Sun Protection", icon: Sun, slug: "sun-protection", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Sensitive / Reactive Skin", icon: Heart, slug: "sensitive", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

const GUIDES = [
  {
    title: "How to Choose Dermocosmetics",
    slug: "how-to-choose",
    description: "Learn to match clinical formulas to your skin barrier needs, from pH balance to active concentrations.",
    icon: FlaskConical,
  },
  {
    title: "Ingredient Insights",
    slug: "ingredient-insights",
    description: "Retinol, Niacinamide, AHAs, Ceramides — understand what each active does and how to layer them safely.",
    icon: Sparkles,
  },
  {
    title: "Dermocosmetic Education",
    slug: "dermocosmetic-education",
    description: "Clinical skincare goes beyond beauty. Discover how dermocosmetics are formulated for therapeutic results.",
    icon: Leaf,
  },
];

export default function Dermocosmetics() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className={`min-h-screen bg-background font-body${isAr ? " rtl" : ""}`}>
      <Header />

      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div className="pt-28 pb-2 px-4 max-w-5xl mx-auto">
        <Breadcrumb
          items={[
            { label: isAr ? "التجميل الطبي" : "Dermocosmetics", href: "/dermocosmetics" },
            { label: isAr ? "منتجات التجميل الطبي" : "Clinical Skincare" },
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
            <span>Pharmacist-Curated · Clinical Grade</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            {isAr
              ? "التجميل الطبي والعناية السريرية بالبشرة"
              : "Dermocosmetics & Clinical Skincare"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
            {isAr
              ? "اكتشف كيف تجمع منتجات التجميل الطبي الراقية بين العلم والعناية بالبشرة لنتائج فعّالة وآمنة."
              : "Discover how premium dermocosmetics combine science and skincare for effective, pharmacist-verified results. Trusted by dermatologists across Jordan."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/shop?category=dermocosmetics">
                {isAr ? "تسوق الآن" : "Shop Dermocosmetics"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/skin-concerns">
                {isAr ? "اكتشف روتينك" : "Find Your Routine"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── What is Dermocosmetics ─────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FlaskConical,
                title: isAr ? "مُصاغ سريريًا" : "Clinically Formulated",
                body: isAr
                  ? "مُصمَّم بتركيزات فعّالة مثبتة علميًا، بعيدًا عن المواد المزيّنة غير الضرورية."
                  : "Formulated with clinically proven active concentrations — no unnecessary fillers.",
              },
              {
                icon: Shield,
                title: isAr ? "مُصادَق من الأطباء" : "Dermatologist Endorsed",
                body: isAr
                  ? "تُوصي به أكبر عيادات الأمراض الجلدية في الأردن والعالم."
                  : "Recommended by leading dermatology clinics in Jordan and globally.",
              },
              {
                icon: Leaf,
                title: isAr ? "آمن للبشرة الحساسة" : "Safe for Sensitive Skin",
                body: isAr
                  ? "مُختبَر بدقة طبية — مناسب للبشرة الحساسة والتفاعلية والبشرة أثناء الحمل."
                  : "Rigorously tested — suitable for reactive, sensitized, and pregnancy-safe routines.",
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
              {isAr ? "فئات المنتجات" : "Product Categories"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr ? "كل ما تحتاجه لروتين عناية متكامل" : "Everything you need for a complete clinical skincare regimen"}
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
              {isAr ? "العلامات التجارية الموثوقة" : "Trusted Clinical Brands"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr ? "شركاؤنا من أبرز العلامات الطبية عالميًا" : "Our curated selection of the world's most respected dermocosmetic brands"}
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
                  <span className="font-heading font-bold text-foreground text-lg">{name}</span>
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

      {/* ── Skin Quiz ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {isAr ? "اكتشف روتين التجميل الطبي المثالي لك" : "Find Your Perfect Dermocosmetics Routine"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr ? "٣ أسئلة فقط — توصيات شخصية من صيدلانيّنا" : "3 quick questions — personalized clinical skincare in seconds"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <DermocosmecticsQuiz />
            <ProductFinderWidget />
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
                {isAr ? "شارات الجودة والثقة" : "Why Trust Asper?"}
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
                  ? "كل منتج في مخزوننا مختبَر طبياً وموصى به من قِبل الصيادلة والأطباء الجلديين."
                  : "Every product in our inventory is clinically tested and personally curated by our team of licensed pharmacists and dermatologists."}
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
              {isAr ? "الأدلة والمصادر" : "Guides & Resources"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr
                ? "دليلك العلمي لاختيار منتجات التجميل الطبي"
                : "Expert knowledge to help you choose, layer, and get results from clinical skincare"}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {GUIDES.map(({ title, slug: _slug, description, icon: Icon }) => (
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
              ? "احصل على استشارة مجانية من صيدلانيك"
              : "Get a Free Pharmacist Consultation"}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {isAr
              ? "فريقنا من الصيادلة المتخصصين يساعدك في اختيار المنتج المثالي لبشرتك. توصيل نفس اليوم في عمّان."
              : "Our specialist pharmacists will guide you to the perfect dermocosmetic routine for your skin type and concerns. Same-day delivery in Amman."}
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
