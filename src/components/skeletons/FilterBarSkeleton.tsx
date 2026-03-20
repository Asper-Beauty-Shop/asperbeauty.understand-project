import { cn } from "@/lib/utils";

export interface FilterBarSkeletonProps {
  /** Determines if the pulse animation should be active. */
  shouldAnimate?: boolean;
  /** Optional contextual label for screen readers. */
  ariaLabel?: string;
}

/**
 * CLS-safe skeleton that mirrors the exact dimensions of the Shop filter bar:
 * - Mobile: category pill row (~44px pills) + sort/view controls row → ~120px
 * - Desktop: single controls row → ~64px
 * Uses Soft Ivory (#EFEBE4) pulsing to match brand skeleton system.
 */
export function FilterBarSkeleton({
  shouldAnimate = true,
  ariaLabel = "Loading filters…",
}: FilterBarSkeletonProps) {
  const pulse = shouldAnimate ? "animate-pulse" : "";

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className="w-full"
    >
      {/* Mobile category pills row — hidden on lg+ */}
      <div className="lg:hidden flex gap-3 overflow-hidden py-3 -mx-4 px-4 border-b border-border/50">
        {[80, 96, 72, 88, 64].map((w, i) => (
          <div
            key={i}
            className={cn("flex-shrink-0 h-[44px] rounded-full bg-secondary/60", pulse)}
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Controls row: product count + sort + view toggle */}
      <div className="flex flex-wrap items-center gap-3 mb-6 mt-3 lg:mt-0">
        {/* Product count placeholder */}
        <div className={cn("h-4 w-24 rounded bg-secondary/60 flex-1", pulse)} />
        {/* On Sale pill */}
        <div className={cn("h-8 w-20 rounded-full bg-secondary/60", pulse)} />
        {/* Sort dropdown */}
        <div className={cn("h-9 w-36 rounded bg-secondary/60", pulse)} />
        {/* View toggle */}
        <div className={cn("h-9 w-20 rounded-lg bg-secondary/60", pulse)} />
      </div>

      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
