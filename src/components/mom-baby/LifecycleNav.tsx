import { useLanguage } from "@/contexts/LanguageContext";
import type { LifecyclePhase } from "@/pages/MomBaby";
import { cn } from "@/lib/utils";
import { Heart, Baby, Sparkles, ShoppingBag, LayoutGrid } from "lucide-react";

const phases: {
  id: LifecyclePhase;
  en: string;
  ar: string;
  icon: typeof Heart;
  description: { en: string; ar: string };
}[] = [
  {
    id: "all",
    en: "All",
    ar: "الكل",
    icon: LayoutGrid,
    description: { en: "Browse everything", ar: "تصفح الكل" },
  },
  {
    id: "before-birth",
    en: "Before Birth",
    ar: "قبل الولادة",
    icon: Heart,
    description: { en: "Prenatal care & supplements", ar: "رعاية ما قبل الولادة والمكملات" },
  },
  {
    id: "after-birth",
    en: "After Birth",
    ar: "بعد الولادة",
    icon: Sparkles,
    description: { en: "Recovery & lactation", ar: "التعافي والرضاعة" },
  },
  {
    id: "first-years",
    en: "First Years",
    ar: "السنوات الأولى",
    icon: Baby,
    description: { en: "Pediatric skincare & feeding", ar: "العناية بالبشرة والتغذية" },
  },
  {
    id: "essentials",
    en: "Essentials",
    ar: "أساسيات الأمومة",
    icon: ShoppingBag,
    description: { en: "Hospital bags & hardware", ar: "حقيبة المستشفى والمستلزمات" },
  },
];

interface Props {
  activePhase: LifecyclePhase;
  onPhaseChange: (phase: LifecyclePhase) => void;
}

export default function LifecycleNav({ activePhase, onPhaseChange }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section id="lifecycle-nav" className="py-8 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-lg text-foreground mb-4 text-center">
          {isAr ? "اختاري مرحلتك" : "Choose Your Stage"}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
          {phases.map((phase) => {
            const active = activePhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => onPhaseChange(phase.id)}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-xl px-5 py-3 text-center transition-all duration-300 border min-w-[120px]",
                  active
                    ? "border-primary bg-primary/5 shadow-warm"
                    : "border-border bg-card hover:border-accent/50 hover:shadow-warm"
                )}
              >
                <phase.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-accent"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-body font-medium",
                    active ? "text-primary" : "text-foreground"
                  )}
                >
                  {isAr ? phase.ar : phase.en}
                </span>
                <span className="text-[10px] text-muted-foreground font-body leading-tight">
                  {isAr ? phase.description.ar : phase.description.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
