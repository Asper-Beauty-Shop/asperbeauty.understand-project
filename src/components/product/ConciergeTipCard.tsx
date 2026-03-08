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
  borderClass: string;
  headerEn: string;
  headerAr: string;
  pinColor: string;
}> = {
  safe: {
    icon: ShieldCheck,
    borderClass: "border-shiny-gold",
    headerEn: "Concierge Tip",
    headerAr: "نصيحة الكونسيرج",
    pinColor: "hsl(var(--polished-gold))",
  },
  caution: {
    icon: AlertTriangle,
    borderClass: "border-burgundy",
    headerEn: "Clinical Advisory",
    headerAr: "تنبيه سريري",
    pinColor: "hsl(var(--burgundy))",
  },
  conflict: {
    icon: AlertCircle,
    borderClass: "border-burgundy",
    headerEn: "Ingredient Conflict",
    headerAr: "تعارض المكونات",
    pinColor: "hsl(var(--burgundy))",
  },
};

export const ConciergeTipCard = ({
  data,
  isLoading = false,
  persona = "dr_sami",
  className,
}: ConciergeTipCardProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const signature = persona === "dr_sami"
    ? (isArabic ? "— د. بوت 🩺" : "— Dr. Bot 🩺")
    : (isArabic ? "— مس. زين ✨" : "— Ms. Zain ✨");

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={cn(
          "relative bg-soft-ivory border border-shiny-gold/40 shadow-md p-6 lg:p-8 rounded-sm animate-pulse",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Loader2 className="h-5 w-5 text-polished-gold animate-spin" />
          <div className="h-5 w-32 bg-polished-gold/20 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  // Default safe tip when no data
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

  return (
    <div
      className={cn(
        "relative bg-soft-ivory border-2 shadow-md p-6 lg:p-8 rounded-sm transition-colors duration-500",
        config.borderClass,
        isArabic && "text-right",
        className
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Decorative pin */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <svg
          width="12" height="12" viewBox="0 0 12 12"
          fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
        >
          <circle cx="6" cy="6" r="5" fill={config.pinColor} stroke={config.pinColor} strokeWidth="1" opacity="0.9" />
          <circle cx="6" cy="6" r="2" fill={config.pinColor} opacity="0.5" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <StatusIcon
          className={cn(
            "h-5 w-5 shrink-0",
            effectiveData.status === "safe" ? "text-polished-gold" : "text-burgundy"
          )}
        />
        <h4 className={cn(
          "font-heading text-xl font-semibold",
          effectiveData.status === "safe" ? "text-burgundy" : "text-burgundy"
        )}>
          {isArabic ? config.headerAr : config.headerEn}
        </h4>
      </div>

      {/* Body */}
      <p className="font-body text-sm leading-relaxed text-dark-charcoal">
        {effectiveData.dr_sami_insight}
      </p>

      {/* Alternative recommendation */}
      {effectiveData.recommended_alternative_ingredient && effectiveData.status !== "safe" && (
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

      {/* Signature */}
      <p className={cn(
        "mt-4 font-body text-xs italic text-polished-gold",
        isArabic ? "text-left" : "text-right"
      )}>
        {signature}
      </p>

      {/* Disclaimer for clinical states */}
      {effectiveData.status !== "safe" && (
        <p className="mt-2 font-body text-[10px] text-muted-foreground italic">
          {isArabic
            ? "أقدّم إرشادات عناية احترافية، وليس تشخيصًا طبيًا."
            : "I provide professional skincare guidance, not medical diagnosis."}
        </p>
      )}
    </div>
  );
};
