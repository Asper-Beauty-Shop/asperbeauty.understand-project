/**
 * Elite skeleton loaders matching the "Morning Spa" aesthetic.
 * Uses a slow 2s breathing animation in Soft Ivory tones.
 */

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-6 md:gap-10 lg:gap-12 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border/30 overflow-hidden"
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          {/* Image area — matches aspect-[3/4] */}
          <div className="aspect-[3/4] w-full bg-secondary animate-skeleton-breathe" />

          {/* Card body */}
          <div className="p-4 md:p-6 space-y-3">
            {/* Brand */}
            <div className="h-2.5 w-16 bg-secondary rounded-sm animate-skeleton-breathe" style={{ animationDelay: `${i * 0.12 + 0.1}s` }} />
            {/* Title */}
            <div className="h-4 w-3/4 bg-secondary rounded-sm animate-skeleton-breathe" style={{ animationDelay: `${i * 0.12 + 0.15}s` }} />
            {/* Pharmacist note */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-secondary animate-skeleton-breathe" />
              <div className="h-3 w-2/3 bg-secondary rounded-sm animate-skeleton-breathe" />
            </div>
            {/* Ingredient pills */}
            <div className="flex gap-1.5">
              <div className="h-5 w-14 rounded-full bg-secondary animate-skeleton-breathe" />
              <div className="h-5 w-18 rounded-full bg-secondary animate-skeleton-breathe" />
            </div>
            {/* Price */}
            <div className="h-4 w-20 bg-secondary rounded-sm animate-skeleton-breathe" />
          </div>
        </div>
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
