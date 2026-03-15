import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, FlaskConical, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuizStep {
  id: string;
  question: string;
  questionAr: string;
  options: Array<{ label: string; labelAr: string; value: string; icon: string }>;
}

const STEPS: QuizStep[] = [
  {
    id: "skin_type",
    question: "What's your skin type?",
    questionAr: "ما نوع بشرتك؟",
    options: [
      { label: "Oily", labelAr: "دهنية", value: "oily", icon: "💧" },
      { label: "Dry", labelAr: "جافة", value: "dry", icon: "🌵" },
      { label: "Combination", labelAr: "مختلطة", value: "combination", icon: "☯️" },
      { label: "Sensitive", labelAr: "حساسة", value: "sensitive", icon: "🌸" },
      { label: "Normal", labelAr: "عادية", value: "normal", icon: "✨" },
    ],
  },
  {
    id: "primary_concern",
    question: "What's your main skin concern?",
    questionAr: "ما هي مشكلتك الجلدية الرئيسية؟",
    options: [
      { label: "Acne & Blemishes", labelAr: "الحبوب والبثور", value: "acne", icon: "🔬" },
      { label: "Anti-Aging", labelAr: "مكافحة الشيخوخة", value: "anti-aging", icon: "⏳" },
      { label: "Dryness", labelAr: "الجفاف", value: "hydration", icon: "💦" },
      { label: "Dark Spots", labelAr: "البقع الداكنة", value: "dark-spots", icon: "☀️" },
      { label: "Sensitivity", labelAr: "الحساسية", value: "sensitivity", icon: "🛡️" },
    ],
  },
  {
    id: "routine",
    question: "How complex is your current routine?",
    questionAr: "كم مرحلة في روتينك الحالي؟",
    options: [
      { label: "Just starting (1-2 steps)", labelAr: "مبتدئة (1-2 خطوات)", value: "beginner", icon: "🌱" },
      { label: "Basic (3-4 steps)", labelAr: "أساسية (3-4 خطوات)", value: "basic", icon: "⚗️" },
      { label: "Advanced (5+ steps)", labelAr: "متقدمة (5+ خطوات)", value: "advanced", icon: "🧬" },
    ],
  },
];

const CONCERN_TO_SLUG: Record<string, string> = {
  acne: "acne",
  "anti-aging": "anti-aging",
  hydration: "dryness",
  "dark-spots": "pigmentation",
  sensitivity: "sensitivity",
};

interface QuizProps {
  className?: string;
  compact?: boolean;
}

export function DermocosmecticsQuiz({ className, compact = false }: QuizProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const current = STEPS[step];

  const select = (value: string) => {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const getResultPath = () => {
    const concern = answers.primary_concern;
    const slug = CONCERN_TO_SLUG[concern] ?? concern;
    return `/concerns/${slug}`;
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  if (done) {
    const concern = answers.primary_concern ?? "acne";
    const slug = CONCERN_TO_SLUG[concern] ?? concern;
    const skinType = answers.skin_type ?? "normal";
    return (
      <div className={cn("rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center flex flex-col gap-4", className)}>
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <FlaskConical className="h-7 w-7 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
            {isAr ? "روتينك المثالي جاهز!" : "Your Personalized Routine Is Ready!"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isAr
              ? `بناءً على بشرتك ${skinType === "oily" ? "الدهنية" : skinType === "dry" ? "الجافة" : "المختلطة"} واهتماماتك`
              : `Based on your ${skinType} skin and ${concern.replace("-", " ")} concern`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to={`/concerns/${slug}`}>
              {isAr ? "عرض المنتجات الموصى بها" : "View Recommended Products"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/?intent=${concern}`}>
              {isAr ? "استشر صيدلانينا" : "Ask Our Pharmacist"}
            </Link>
          </Button>
        </div>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mx-auto transition-colors">
          <RefreshCw className="h-3 w-3" />
          {isAr ? "إعادة الاختبار" : "Retake Quiz"}
        </button>
      </div>
    );
  }

  const progressPct = Math.round((step / STEPS.length) * 100);

  return (
    <div className={cn("rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 flex flex-col gap-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            {isAr ? "اختبار البشرة" : "Skin Quiz"} · {step + 1}/{STEPS.length}
          </span>
        </div>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            {isAr ? "رجوع" : "Back"}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-primary/10">
        <div
          className="h-1 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="font-heading font-semibold text-foreground text-base">
        {isAr ? current.questionAr : current.question}
      </h3>

      {/* Options */}
      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
        {current.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => select(opt.value)}
            className="flex flex-col items-center gap-2 rounded-xl border border-primary/20 bg-background px-3 py-4 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-95"
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-xs font-medium text-foreground leading-tight">
              {isAr ? opt.labelAr : opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
