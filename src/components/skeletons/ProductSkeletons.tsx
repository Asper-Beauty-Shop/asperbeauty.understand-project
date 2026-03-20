/**
 * Elite skeleton loaders — perfectly mirrors EliteProductCard dimensions
 * to prevent Cumulative Layout Shift (CLS).
 * Uses a slow 2s "spa breathing" animation in Soft Ivory tones.
 */

function EliteSkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="bg-card border border-border/30 overflow-hidden"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Image — matches aspect-[3/4] of real card */}
      <div className="aspect-[3/4] w-full bg-secondary animate-skeleton-breathe" />
      {/* Content — matches p-4 md:p-6 of real card */}
      <div className="p-4 md:p-6 space-y-2.5">
        {/* Brand */}
        <div className="h-2.5 w-16 bg-secondary rounded-sm animate-skeleton-breathe" style={{ animationDelay: `${index * 0.12 + 0.1}s` }} />
        {/* Title (2 lines) */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full bg-secondary rounded-sm animate-skeleton-breathe" style={{ animationDelay: `${index * 0.12 + 0.15}s` }} />
          <div className="h-3.5 w-2/3 bg-secondary rounded-sm animate-skeleton-breathe" style={{ animationDelay: `${index * 0.12 + 0.18}s` }} />
        </div>
        {/* Pharmacist note */}
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 bg-secondary animate-skeleton-breathe shrink-0" />
          <div className="h-3 w-3/5 bg-secondary rounded-sm animate-skeleton-breathe" />
        </div>
        {/* Ingredient pills */}
        <div className="flex gap-1.5">
          <div className="h-5 w-14 rounded-full bg-secondary animate-skeleton-breathe" />
          <div className="h-5 w-16 rounded-full bg-secondary animate-skeleton-breathe" />
          <div className="h-5 w-12 rounded-full bg-secondary animate-skeleton-breathe" />
        </div>
        {/* Rating stars */}
        <div className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((s) => (
            <div key={s} className="h-2.5 w-2.5 bg-secondary animate-skeleton-breathe" />
          ))}
          <div className="h-2.5 w-6 bg-secondary rounded-sm animate-skeleton-breathe ml-1" />
        </div>
        {/* Price */}
        <div className="h-4 w-20 bg-secondary rounded-sm animate-skeleton-breathe" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 gap-y-8 md:gap-8 lg:gap-10 xl:gap-12 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <EliteSkeletonCard key={i} index={i} />
      ))}
    </div>
  );
}

/**
 * Hero section skeleton for initial page load.
 */
export function HeroSkeleton() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-5 w-48 bg-secondary animate-skeleton-breathe" />
            <div className="h-12 w-full bg-secondary animate-skeleton-breathe" />
            <div className="h-12 w-3/4 bg-secondary animate-skeleton-breathe" />
            <div className="h-20 w-full bg-secondary animate-skeleton-breathe" />
            <div className="flex gap-3">
              <div className="h-12 w-40 bg-secondary animate-skeleton-breathe" />
              <div className="h-12 w-40 bg-secondary animate-skeleton-breathe" />
            </div>
          </div>
          <div className="aspect-[4/5] w-full bg-secondary animate-skeleton-breathe" />
        </div>
      </div>
    </section>
  );
}
