import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterOption {
  label: string;
  labelAr: string;
  value: string;
}

const SKIN_TYPES: FilterOption[] = [
  { label: "All", labelAr: "الكل", value: "" },
  { label: "Oily", labelAr: "دهنية", value: "oily" },
  { label: "Dry", labelAr: "جافة", value: "dry" },
  { label: "Combination", labelAr: "مختلطة", value: "combination" },
  { label: "Sensitive", labelAr: "حساسة", value: "sensitive" },
];

const CONCERNS: FilterOption[] = [
  { label: "All Concerns", labelAr: "كل المشكلات", value: "" },
  { label: "Acne", labelAr: "حبوب", value: "acne" },
  { label: "Anti-Aging", labelAr: "مكافحة الشيخوخة", value: "anti-aging" },
  { label: "Dryness", labelAr: "جفاف", value: "dryness" },
  { label: "Pigmentation", labelAr: "تصبغات", value: "pigmentation" },
  { label: "Sensitivity", labelAr: "حساسية", value: "sensitivity" },
  { label: "Sun Damage", labelAr: "أضرار الشمس", value: "sun-protection" },
];

const BRANDS: FilterOption[] = [
  { label: "All Brands", labelAr: "كل العلامات", value: "" },
  { label: "Eucerin", labelAr: "يوسيرين", value: "eucerin" },
  { label: "La Roche-Posay", labelAr: "لاروش بوزيه", value: "la-roche-posay" },
  { label: "CeraVe", labelAr: "سيرافي", value: "cerave" },
  { label: "Bioderma", labelAr: "بيوديرما", value: "bioderma" },
  { label: "Vichy", labelAr: "فيشي", value: "vichy" },
];

const PRICE_RANGES: FilterOption[] = [
  { label: "Any Price", labelAr: "أي سعر", value: "" },
  { label: "Under 10 JOD", labelAr: "أقل من 10 JD", value: "0-10" },
  { label: "10–25 JOD", labelAr: "10–25 JD", value: "10-25" },
  { label: "25–50 JOD", labelAr: "25–50 JD", value: "25-50" },
  { label: "Over 50 JOD", labelAr: "أكثر من 50 JD", value: "50-" },
];

interface Filters {
  skinType: string;
  concern: string;
  brand: string;
  price: string;
}

interface ProductFinderWidgetProps {
  className?: string;
}

function Chip({ option, selected, onClick, isAr }: { option: FilterOption; selected: boolean; onClick: () => void; isAr: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5",
      )}
    >
      {isAr ? option.labelAr : option.label}
    </button>
  );
}

export function ProductFinderWidget({ className }: ProductFinderWidgetProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [filters, setFilters] = useState<Filters>({ skinType: "", concern: "", brand: "", price: "" });
  const [expanded, setExpanded] = useState(false);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (filters.skinType) params.set("skin", filters.skinType);
    if (filters.concern) params.set("concern", filters.concern);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.price) params.set("price", filters.price);
    return `/shop?${params.toString()}`;
  };

  const reset = () => setFilters({ skinType: "", concern: "", brand: "", price: "" });

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card overflow-hidden", className)}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="font-heading font-semibold text-sm text-foreground">
            {isAr ? "البحث الذكي عن المنتجات" : "Smart Product Finder"}
          </span>
          {activeCount > 0 && (
            <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-90")} />
      </button>

      {expanded && (
        <div className="border-t border-border/50 px-5 py-4 flex flex-col gap-4">
          {/* Skin Type */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              {isAr ? "نوع البشرة" : "Skin Type"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SKIN_TYPES.map(opt => (
                <Chip key={opt.value} option={opt} selected={filters.skinType === opt.value} onClick={() => setFilters(f => ({ ...f, skinType: opt.value }))} isAr={isAr} />
              ))}
            </div>
          </div>

          {/* Concern */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              {isAr ? "المشكلة الجلدية" : "Skin Concern"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CONCERNS.map(opt => (
                <Chip key={opt.value} option={opt} selected={filters.concern === opt.value} onClick={() => setFilters(f => ({ ...f, concern: opt.value }))} isAr={isAr} />
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              {isAr ? "العلامة التجارية" : "Brand"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {BRANDS.map(opt => (
                <Chip key={opt.value} option={opt} selected={filters.brand === opt.value} onClick={() => setFilters(f => ({ ...f, brand: opt.value }))} isAr={isAr} />
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              {isAr ? "نطاق السعر" : "Price Range"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_RANGES.map(opt => (
                <Chip key={opt.value} option={opt} selected={filters.price === opt.value} onClick={() => setFilters(f => ({ ...f, price: opt.value }))} isAr={isAr} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button asChild className="flex-1">
              <Link to={buildSearchUrl()}>
                {isAr ? "عرض النتائج" : "Find Products"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            {activeCount > 0 && (
              <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                <X className="h-3.5 w-3.5" />
                {isAr ? "إعادة ضبط" : "Reset"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
