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
    ar: "Ø§Ù„ÙƒÙ„",
    icon: LayoutGrid,
    description: { en: "Browse everything", ar: "ØªØµÙØ­ Ø§Ù„ÙƒÙ„" },
  },
  {
    id: "before-birth",
    en: "Before Birth",
    ar: "Ù‚Ø¨Ù„ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø©",
    icon: Heart,
    description: { en: "Prenatal care & supplements", ar: "Ø±Ø¹Ø§ÙŠØ© Ù…Ø§ Ù‚Ø¨Ù„ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø© ÙˆØ§Ù„Ù…ÙƒÙ…Ù„Ø§Øª" },
  },
  {
    id: "after-birth",
    en: "After Birth",
    ar: "Ø¨Ø¹Ø¯ Ø§Ù„ÙˆÙ„Ø§Ø¯Ø©",
    icon: Sparkles,
    description: { en: "Recovery & lactation", ar: "Ø§Ù„ØªØ¹Ø§ÙÙŠ ÙˆØ§Ù„Ø±Ø¶Ø§Ø¹Ø©" },
  },
  {
    id: "first-years",
    en: "First Years",
    ar: "Ø§Ù„Ø³Ù†ÙˆØ§Øª Ø§Ù„Ø£ÙˆÙ„Ù‰",
    icon: Baby,
    description: { en: "Pediatric skincare & feeding", ar: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ§Ù„ØªØºØ°ÙŠØ©" },
  },
  {
    id: "essentials",
    en: "Essentials",
    ar: "Ø£Ø³Ø§Ø³ÙŠØ§Øª Ø§Ù„Ø£Ù…ÙˆÙ…Ø©",
    icon: ShoppingBag,
    description: { en: "Hospital bags & hardware", ar: "Ø­Ù‚ÙŠØ¨Ø© Ø§Ù„Ù…Ø³ØªØ´ÙÙ‰ ÙˆØ§Ù„Ù…Ø³ØªÙ„Ø²Ù…Ø§Øª" },
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
          {isAr ? "Ø§Ø®ØªØ§Ø±ÙŠ Ù…Ø±Ø­Ù„ØªÙƒ" : "Choose Your Stage"}
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

