import { cn } from "@/lib/utils";
import { FlaskConical, ShieldCheck, Star } from "lucide-react";

interface ClinicalBadgeProps {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * "Clinically Tested" badge for product cards.
 */
export function ClinicalBadge({ label = "Clinically Tested", size = "sm", className }: ClinicalBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm"
          ? "text-[10px] px-2 py-0.5 border-primary/30 bg-primary/5 text-primary"
          : "text-xs px-3 py-1 border-primary/30 bg-primary/5 text-primary",
        className,
      )}
      title="Clinically tested and pharmacist-verified"
    >
      <FlaskConical className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {label}
    </span>
  );
}

/**
 * Dermatologist endorsed badge.
 */
export function DermBadge({ label = "Derm Endorsed", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border text-[10px] font-medium px-2 py-0.5 border-emerald-300 bg-emerald-50 text-emerald-700",
        className,
      )}
    >
      <ShieldCheck className="h-2.5 w-2.5" />
      {label}
    </span>
  );
}

interface StarRatingProps {
  rating: number; // 0-5
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Star rating display for product cards.
 */
export function StarRating({ rating, count, size = "sm", className }: StarRatingProps) {
  const stars = Math.round(rating * 2) / 2; // half-star rounding
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              size === "sm" ? "h-3 w-3" : "h-4 w-4",
              i < Math.floor(stars)
                ? "text-amber-400 fill-amber-400"
                : i < stars
                ? "text-amber-400 fill-amber-200"
                : "text-muted-foreground/30 fill-muted-foreground/10",
            )}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-[10px] text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
