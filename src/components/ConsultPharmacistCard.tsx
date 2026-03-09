import { Stethoscope } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STEP_LABELS: Record<string, { en: string; ar: string }> = {
  step_1_cleanser: { en: "Step 1: Cleanser", ar: "Ø§Ù„Ø®Ø·ÙˆØ© Ù¡: Ø§Ù„Ù…Ù†Ø¸Ù" },
  step_2_treatment: { en: "Step 2: Treatment", ar: "Ø§Ù„Ø®Ø·ÙˆØ© Ù¢: Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©" },
  step_3_moisturizer: {
    en: "Step 3: Moisturizer / SPF",
    ar: "Ø§Ù„Ø®Ø·ÙˆØ© Ù£: Ø§Ù„Ù…Ø±Ø·Ø¨ / Ø§Ù„Ø­Ù…Ø§ÙŠØ©",
  },
};

interface ConsultPharmacistCardProps {
  stepKey: string;
  className?: string;
}

/** Rendered in a Digital Tray slot when no product is assigned (null from get_tray_by_concern). */
export function ConsultPharmacistCard(
  { stepKey, className = "" }: ConsultPharmacistCardProps,
) {
  const { language } = useLanguage();
  const stepLabel = STEP_LABELS[stepKey]
    ? (language === "ar" ? STEP_LABELS[stepKey].ar : STEP_LABELS[stepKey].en)
    : stepKey;

  return (
    <div
      className={"rounded-xl border border-shiny-gold/30 bg-soft-ivory/80 p-6 flex flex-col items-center justify-center min-h-[280px] text-center " +
        className}
    >
      <div className="w-14 h-14 rounded-full bg-maroon/10 flex items-center justify-center mb-4">
        <Stethoscope className="h-7 w-7 text-maroon" />
      </div>
      <p className="font-body text-dark-charcoal font-medium mb-1">
        {stepLabel}
      </p>
      <p className="font-body text-maroon font-semibold">
        {language === "ar" ? "Ø§Ø³ØªØ´Ø± Ø§Ù„ØµÙŠØ¯Ù„ÙŠ" : "Consult Pharmacist"}
      </p>
      <p className="font-body text-gray-500 text-sm mt-2 max-w-[200px]">
        {language === "ar"
          ? "Ø³Ù†Ø®ØªØ§Ø± Ù„Ùƒ Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ø£Ù†Ø³Ø¨ Ù„Ù‡Ø°Ù‡ Ø§Ù„Ø®Ø·ÙˆØ©."
          : "We'll pick the right product for this step."}
      </p>
    </div>
  );
}

