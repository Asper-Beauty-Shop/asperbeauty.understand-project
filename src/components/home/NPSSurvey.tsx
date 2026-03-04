import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/AnimatedSection";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const NPSSurvey = () => {
  const { language } = mmm
  const isArabic = language === "ar";
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleScore = (score: number) => {
    setSelectedScore(score);
    setHasSubmitted(true);
    toast.success(
      isArabic ? "شكراً لتقييمك!" : "Thank you for your feedback!",
      {
        description:
          isArabic
            ? "ملاحظاتك تساعدنا على التحسن"
            : "Your feedback helps us improve",
        position: "top-center",
      }
    );
  };

  return (
    <section className="py-10 bg-asper-stone-light relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/20 to-transparent" />

      <AnimatedSection className="luxury-container" animation="fade-up">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          <p className="font-display text-base lg:text-lg text-asper-ink text-center md:text-left flex-shrink-0">
            {isArabic
              ? "ما مدى إعجابك بتشكيلتنا؟"
              : "How much do you like our assortment?"}
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {Array.from({ length: 11 }, (_, i) => i).map((score) => (
              <button
                key={score}
                onClick={() => handleScore(score)}
                disabled={hasSubmitted}
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-body font-semibold transition-all duration-300 border",
                  hasSubmitted && selectedScore === score
                    ? "bg-polished-gold text-asper-ink border-polished-gold scale-110"
                    : hasSubmitted
                      ? "bg-asper-stone border-border text-muted-foreground cursor-default opacity-50"
                      : "bg-card border-border text-asper-ink hover:border-polished-gold hover:bg-polished-gold/10 hover:scale-110"
                )}
                aria-label={`Rate ${score} out of 10`}
              >
                {score}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-[10px] font-body text-muted-foreground uppercase tracking-wider md:hidden w-full max-w-xs">
            <span>{isArabic ? "غير محتمل" : "Not likely"}</span>
            <span>{isArabic ? "محتمل جداً" : "Very likely"}</span>
          </div>
        </div>
      </AnimatedSection>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/20 to-transparent" />
    </section>
  );
};
