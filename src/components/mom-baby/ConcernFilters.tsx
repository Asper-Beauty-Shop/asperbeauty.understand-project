import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const concerns = [
  { id: "hygiene", en: "Personal Hygiene", ar: "Ø§Ù„Ù†Ø¸Ø§ÙØ© Ø§Ù„Ø´Ø®ØµÙŠØ©", count: 230 },
  { id: "atopic", en: "Atopic Dermatitis", ar: "Ø§Ù„ØªÙ‡Ø§Ø¨ Ø§Ù„Ø¬Ù„Ø¯ Ø§Ù„ØªØ£ØªØ¨ÙŠ", count: 85 },
  { id: "first-teeth", en: "First Teeth", ar: "Ø§Ù„Ø£Ø³Ù†Ø§Ù† Ø§Ù„Ø£ÙˆÙ„Ù‰", count: 34 },
  { id: "special-care", en: "Special Care", ar: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ø®Ø§ØµØ©", count: 33 },
  { id: "nasal", en: "Nasal Congestion", ar: "Ø§Ø­ØªÙ‚Ø§Ù† Ø§Ù„Ø£Ù†Ù", count: 26 },
  { id: "dehydration", en: "Dehydration", ar: "Ø§Ù„Ø¬ÙØ§Ù", count: 19 },
  { id: "cradle-cap", en: "Cradle Cap", ar: "Ù‚Ø¨Ø¹Ø© Ø§Ù„Ù…Ù‡Ø¯", count: 13 },
  { id: "colic", en: "Cramps & Colic", ar: "Ø§Ù„ØªØ´Ù†Ø¬Ø§Øª ÙˆØ§Ù„Ù…ØºØµ", count: 12 },
  { id: "lice", en: "Lice", ar: "Ø§Ù„Ù‚Ù…Ù„", count: 11 },
  { id: "seborrheic", en: "Seborrheic Dermatitis", ar: "Ø§Ù„ØªÙ‡Ø§Ø¨ Ø§Ù„Ø¬Ù„Ø¯ Ø§Ù„Ù…Ø«Ù‘ÙŠ", count: 8 },
  { id: "sensitive", en: "Sensitive Skin", ar: "Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø­Ø³Ø§Ø³Ø©", count: 6 },
  { id: "stretch-marks", en: "Stretch Marks", ar: "Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªÙ…Ø¯Ø¯", count: 5 },
  { id: "sun-protection", en: "Sun Protection", ar: "Ø§Ù„Ø­Ù…Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø´Ù…Ø³", count: 4 },
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
            {isAr ? "ØªØµÙÙŠØ© Ø­Ø³Ø¨ Ø§Ù„Ù‚Ù„Ù‚" : "Filter by Concern"}
          </h3>
          {activeConcern && (
            <button
              onClick={() => onConcernChange(null)}
              className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-3 h-3" />
              {isAr ? "Ù…Ø³Ø­" : "Clear"}
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

