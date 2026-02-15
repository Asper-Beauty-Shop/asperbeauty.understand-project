/**
 * Slow-breathing skeleton grid mimicking product card layout.
 * Uses a 2s ease-in-out "spa breathing" animation instead of default fast pulse.
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border/50 bg-card overflow-hidden"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          {/* Image area */}
          <div className="aspect-square w-full bg-muted animate-skeleton-breathe rounded-none" />
          {/* Card body */}
          <div className="p-4 space-y-3">
            {/* Brand */}
            <div className="h-3 w-20 bg-muted rounded animate-skeleton-breathe" style={{ animationDelay: `${i * 0.15 + 0.1}s` }} />
            {/* Title */}
            <div className="h-4 w-3/4 bg-muted rounded animate-skeleton-breathe" style={{ animationDelay: `${i * 0.15 + 0.2}s` }} />
            {/* Pharmacist note */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted animate-skeleton-breathe" />
              <div className="h-3 w-2/3 bg-muted rounded animate-skeleton-breathe" />
            </div>
            {/* Highlights */}
            <div className="flex gap-1.5">
              <div className="h-5 w-16 rounded-full bg-muted animate-skeleton-breathe" />
              <div className="h-5 w-20 rounded-full bg-muted animate-skeleton-breathe" />
            </div>
            {/* Price + button */}
            <div className="flex items-center justify-between">
              <div className="h-5 w-16 bg-muted rounded animate-skeleton-breathe" />
              <div className="h-5 w-12 bg-muted rounded animate-skeleton-breathe" />
            </div>
            <div className="h-9 w-full rounded-md bg-muted animate-skeleton-breathe" />
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
            <div className="h-5 w-48 rounded-full bg-muted animate-skeleton-breathe" />
            <div className="h-12 w-full bg-muted rounded animate-skeleton-breathe" />
            <div className="h-12 w-3/4 bg-muted rounded animate-skeleton-breathe" />
            <div className="h-20 w-full bg-muted rounded animate-skeleton-breathe" />
            <div className="flex gap-3">
              <div className="h-12 w-40 rounded-md bg-muted animate-skeleton-breathe" />
              <div className="h-12 w-40 rounded-md bg-muted animate-skeleton-breathe" />
            </div>
          </div>
          <div className="aspect-[4/5] w-full rounded-lg bg-muted animate-skeleton-breathe" />
        </div>
      </div>
    </section>
  );
}
