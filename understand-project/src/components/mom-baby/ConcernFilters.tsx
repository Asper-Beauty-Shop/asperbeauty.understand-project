import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const concerns = [
  { id: "hygiene", en: "Personal Hygiene", ar: "النظافة الشخصية", count: 230 },
  { id: "atopic", en: "Atopic Dermatitis", ar: "التهاب الجلد التأتبي", count: 85 },
  { id: "first-teeth", en: "First Teeth", ar: "الأسنان الأولى", count: 34 },
  { id: "special-care", en: "Special Care", ar: "العناية الخاصة", count: 33 },
  { id: "nasal", en: "Nasal Congestion", ar: "احتقان الأنف", count: 26 },
  { id: "dehydration", en: "Dehydration", ar: "الجفاف", count: 19 },
  { id: "cradle-cap", en: "Cradle Cap", ar: "قبعة المهد", count: 13 },
  { id: "colic", en: "Cramps & Colic", ar: "التشنجات والمغص", count: 12 },
  { id: "lice", en: "Lice", ar: "القمل", count: 11 },
  { id: "seborrheic", en: "Seborrheic Dermatitis", ar: "التهاب الجلد المثّي", count: 8 },
  { id: "sensitive", en: "Sensitive Skin", ar: "البشرة الحساسة", count: 6 },
  { id: "stretch-marks", en: "Stretch Marks", ar: "علامات التمدد", count: 5 },
  { id: "sun-protection", en: "Sun Protection", ar: "الحماية من الشمس", count: 4 },
];

interface Props {
  activeConcern: string | null;
  onConcernChange: (concern: string | null) => void;
}

export default function ConcernFilters({ activeConcern, onConcernChange }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="py-6 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-base text-foreground">
            {isAr ? "تصفية حسب القلق" : "Filter by Concern"}
          </h3>
          {activeConcern && (
            <button
              onClick={() => onConcernChange(null)}
              className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-3 h-3" />
              {isAr ? "مسح" : "Clear"}
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {concerns.map((concern) => {
            const active = activeConcern === concern.id;
            return (
              <button
                key={concern.id}
                onClick={() => onConcernChange(active ? null : concern.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-body transition-all duration-200 border shrink-0",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-accent/50"
                )}
              >
                {isAr ? concern.ar : concern.en}
                <span
                  className={cn(
                    "text-[10px] rounded-full px-1.5 py-0.5",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {concern.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

