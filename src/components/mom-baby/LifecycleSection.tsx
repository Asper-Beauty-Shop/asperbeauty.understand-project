import { useLanguage } from "@/contexts/LanguageContext";
import type { LifecyclePhase } from "@/pages/MomBaby";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Baby, ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhaseData {
  id: LifecyclePhase;
  en: string;
  ar: string;
  icon: typeof Heart;
  color: string;
  categories: { en: string; ar: string; count: number }[];
  featured: { en: string; ar: string; brand: string; price: string }[];
}

const phasesData: PhaseData[] = [
  {
    id: "before-birth",
    en: "Before Birth",
    ar: "قبل الولادة",
    icon: Heart,
    color: "text-rose-clay",
    categories: [
      { en: "Supplements & Fertility", ar: "المكملات والخصوبة", count: 24 },
      { en: "Stretch Mark Prevention", ar: "الوقاية من التمدد", count: 18 },
      { en: "Pregnancy-Safe Skincare", ar: "عناية آمنة للحمل", count: 32 },
      { en: "Hair & Scalp Care", ar: "العناية بالشعر", count: 12 },
    ],
    featured: [
      { en: "Natalben Supra Pregnancy", ar: "ناتالبن سوبرا للحمل", brand: "Natalben", price: "21.73" },
      { en: "Mustela Stretch Marks Cream", ar: "كريم علامات التمدد", brand: "Mustela", price: "18.50" },
      { en: "A-Derma Exomega Control", ar: "إكزوميغا كونترول", brand: "A-Derma", price: "15.20" },
    ],
  },
  {
    id: "after-birth",
    en: "After Birth",
    ar: "بعد الولادة",
    icon: Sparkles,
    color: "text-accent",
    categories: [
      { en: "Breast Pumps & Accessories", ar: "مضخات الثدي والإكسسوارات", count: 28 },
      { en: "Milk Storage", ar: "تخزين الحليب", count: 15 },
      { en: "Nipple Care", ar: "العناية بالحلمات", count: 9 },
      { en: "Body Recovery", ar: "استعادة الجسم", count: 22 },
    ],
    featured: [
      { en: "Medela Swing Maxi Double", ar: "مضخة مديلا سوينج ماكسي", brand: "Medela", price: "189.00" },
      { en: "Barral MotherProtect Oil", ar: "زيت باريل للأم", brand: "Barral", price: "12.40" },
      { en: "Lierac Body Sculpt Gel", ar: "جل شد الجسم ليراك", brand: "Lierac", price: "28.90" },
    ],
  },
  {
    id: "first-years",
    en: "First Years",
    ar: "السنوات الأولى",
    icon: Baby,
    color: "text-primary",
    categories: [
      { en: "Feeding & Accessories", ar: "الإطعام والإكسسوارات", count: 190 },
      { en: "Diaper Changing", ar: "تغيير الحفاض", count: 59 },
      { en: "Bath & Hygiene", ar: "الاستحمام والنظافة", count: 34 },
      { en: "Oral Health", ar: "الصحة الفموية", count: 6 },
    ],
    featured: [
      { en: "Mustela Stelatopia+ Cream", ar: "كريم ستيلاتوبيا+", brand: "Mustela", price: "22.80" },
      { en: "Bioderma ABCDerm Gel", ar: "جل أبيسيدرم بيوديرما", brand: "Bioderma", price: "14.50" },
      { en: "Isdin Nutratopic Pro-AMP", ar: "نيوتراتوبيك برو", brand: "Isdin", price: "19.30" },
    ],
  },
  {
    id: "essentials",
    en: "Maternity Essentials",
    ar: "أساسيات الأمومة",
    icon: ShoppingBag,
    color: "text-burgundy",
    categories: [
      { en: "Hospital Bags & Baskets", ar: "حقائب المستشفى", count: 12 },
      { en: "Thermometers & Monitors", ar: "موازين الحرارة والمراقبة", count: 13 },
      { en: "Gift Sets & Bundles", ar: "أطقم الهدايا", count: 18 },
      { en: "Nebulizers & Respiratory", ar: "أجهزة الاستنشاق", count: 5 },
    ],
    featured: [
      { en: "Mustela Essential Basket", ar: "سلة مستيلا الأساسية", brand: "Mustela", price: "45.00" },
      { en: "Owlet Dream Sock Monitor", ar: "جوارب أولت الذكية", brand: "Owlet", price: "299.00" },
      { en: "Braun No Touch Thermometer", ar: "ميزان حرارة براون", brand: "Braun", price: "52.00" },
    ],
  },
];

interface Props {
  activePhase: LifecyclePhase;
  activeConcern: string | null;
}

export default function LifecycleSection({ activePhase, activeConcern }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const visible = activePhase === "all" ? phasesData : phasesData.filter((p) => p.id === activePhase);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="space-y-16"
          >
            {visible.map((phase) => (
              <div key={phase.id}>
                {/* Phase header */}
                <div className="flex items-center gap-3 mb-6">
                  <phase.icon className={cn("w-6 h-6", phase.color)} />
                  <h2 className="font-heading text-2xl md:text-3xl text-foreground">
                    {isAr ? phase.ar : phase.en}
                  </h2>
                </div>

                {/* Categories grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {phase.categories.map((cat) => (
                    <button
                      key={cat.en}
                      className="group rounded-xl border border-border bg-card p-4 text-start hover:border-accent/50 hover:shadow-warm transition-all duration-300"
                    >
                      <span className="block text-sm font-body font-medium text-foreground group-hover:text-primary transition-colors">
                        {isAr ? cat.ar : cat.en}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {cat.count} {isAr ? "منتج" : "products"}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Featured products */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {phase.featured.map((product) => (
                    <div
                      key={product.en}
                      className="product-card-hover group rounded-xl border border-border bg-card p-5 cursor-pointer"
                    >
                      {/* Placeholder image area */}
                      <div className="w-full aspect-square rounded-lg bg-muted/50 mb-4 flex items-center justify-center">
                        <phase.icon className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <p className="text-[10px] font-body uppercase tracking-widest text-accent mb-1">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-body font-medium text-foreground mb-2 line-clamp-2">
                        {isAr ? product.ar : product.en}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-heading font-bold text-primary">
                          ${product.price}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          {isAr ? "عرض" : "View"}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
