import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export type SafetyStatus = "safe" | "caution" | "conflict";

export interface ConciergeTipData {
  status: SafetyStatus;
  dr_sami_insight: string;
  recommended_alternative_ingredient: string | null;
  ui_accent_color: string;
}

interface ConciergeTipCardProps {
  data?: ConciergeTipData | null;
  isLoading?: boolean;
  persona?: "dr_sami" | "ms_zain";
  className?: string;
}

const statusConfig: Record<SafetyStatus, {
  icon: typeof ShieldCheck;
  headerEn: string;
  headerAr: string;
}> = {
  safe: {
    icon: ShieldCheck,
    headerEn: "Concierge Tip",
    headerAr: "نصيحة الكونسيرج",
  },
  caution: {
    icon: AlertTriangle,
    headerEn: "Clinical Advisory",
    headerAr: "تنبيه سريري",
  },
  conflict: {
    icon: AlertCircle,
    headerEn: "Ingredient Conflict",
    headerAr: "تعارض المكونات",
  },
};

/* Inline SVG persona icons at 16×16 in polished gold */
const CaduceusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
    <path d="M12 2v20M8 6c0-1.5 1.8-3 4-3s4 1.5 4 3-1.8 3-4 3-4-1.5-4-3zM8 10c0-1.5 1.8-3 4-3s4 1.5 4 3-1.8 3-4 3-4-1.5-4-3z" stroke="hsl(var(--polished-gold))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22h6" stroke="hsl(var(--polished-gold))" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LotusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
    <path d="M12 22c-2-4-6-8-6-12a6 6 0 0112 0c0 4-4 8-6 12z" stroke="hsl(var(--polished-gold))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22c-4-2-8-4-9-8 2 0 5 1 9 8zM12 22c4-2 8-4 9-8-2 0-5 1-9 8z" stroke="hsl(var(--polished-gold))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ConciergeTipCard = ({
  data,
  isLoading = false,
  persona = "dr_sami",
  className,
}: ConciergeTipCardProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const signatureText = persona === "dr_sami"
    ? (isArabic ? "— د. سامي، دعم أسبر السريري" : "— Dr. Sami, Asper Clinical Support")
    : (isArabic ? "— مس. زين، خبيرة الجمال" : "— Ms. Zain, Asper Beauty Concierge");

  const PersonaIcon = persona === "dr_sami" ? CaduceusIcon : LotusIcon;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn(
        "relative bg-soft-ivory border border-transparent shadow-md p-6 lg:p-8 rounded-sm",
        className
      )}>
        <div className="flex items-center gap-2 mb-3">
          <Loader2 className="h-5 w-5 text-polished-gold animate-spin" />
          <div className="h-5 w-32 bg-polished-gold/20 rounded" />
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  // Default safe tip
  const effectiveData: ConciergeTipData = data ?? {
    status: "safe",
    dr_sami_insight: isArabic
      ? "ضعي هذا السيروم على بشرة رطبة مباشرة بعد التنظيف لتعزيز امتصاص حمض الهيالورونيك."
      : "Apply this serum to damp skin immediately after cleansing to maximize hyaluronic acid absorption.",
    recommended_alternative_ingredient: null,
    ui_accent_color: "#C5A028",
  };

  const config = statusConfig[effectiveData.status];
  const StatusIcon = config.icon;
  const isSafe = effectiveData.status === "safe";
  const pinColor = isSafe ? "hsl(var(--polished-gold))" : "hsl(var(--burgundy))";

  return (
    <div
      className={cn(
        "relative bg-soft-ivory shadow-md p-6 lg:p-8 rounded-sm",
        // Midas Touch: transparent border → gold on hover with lift
        isSafe
          ? "border border-transparent hover:border-shiny-gold hover:-translate-y-1"
          : "border-2 border-burgundy",
        "transition-all duration-[400ms]",
        isArabic && "text-right",
        className
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Decorative gold pin */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="6" cy="6" r="5" fill={pinColor} stroke={pinColor} strokeWidth="1" opacity="0.9" />
          <circle cx="6" cy="6" r="2" fill={pinColor} opacity="0.5" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <StatusIcon className={cn("h-5 w-5 shrink-0", isSafe ? "text-polished-gold" : "text-burgundy")} />
        <h4 className="font-heading text-xl font-semibold text-burgundy">
          {isArabic ? config.headerAr : config.headerEn}
        </h4>
      </div>

      {/* Body */}
      <p className="font-body text-sm leading-relaxed text-dark-charcoal">
        {effectiveData.dr_sami_insight}
      </p>

      {/* Alternative recommendation */}
      {effectiveData.recommended_alternative_ingredient && !isSafe && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-polished-gold/5 border border-polished-gold/20 rounded-sm">
          <ShieldCheck className="h-4 w-4 text-polished-gold shrink-0" />
          <p className="font-body text-xs text-dark-charcoal">
            {isArabic ? "البديل الآمن: " : "Safe alternative: "}
            <span className="font-semibold text-polished-gold">
              {effectiveData.recommended_alternative_ingredient}
            </span>
            {" — "}
            <Link to="/skin-concerns" className="underline text-burgundy hover:text-burgundy/80 transition-colors">
              {isArabic ? "استكشفي الخيارات" : "Explore options"}
            </Link>
          </p>
        </div>
      )}

      {/* Dynamic Persona Signature with Icon */}
      <div className={cn(
        "mt-4 flex items-center gap-1.5",
        isArabic ? "justify-start flex-row-reverse" : "justify-end"
      )}>
        <p className="font-body text-xs italic text-polished-gold">
          {signatureText}
        </p>
        <PersonaIcon />
      </div>

      {/* Mandatory disclaimer for clinical states */}
      {!isSafe && (
        <p className="mt-2 font-body text-[10px] text-muted-foreground italic">
          {isArabic
            ? "أقدّم إرشادات عناية احترافية، وليس تشخيصًا طبيًا."
            : "I provide professional skincare guidance, not medical diagnosis."}
        </p>
      )}
    </div>
  );
};
