import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton = (
  { className }: ProductCardSkeletonProps,
) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {/* Image Skeleton */}
      <div className="aspect-[3/4] bg-gradient-to-br from-cream via-taupe/20 to-cream rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skeleton-shimmer" />
      </div>

      {/* Label Badge Skeleton */}
      <div className="absolute top-4 left-4 w-24 h-6 bg-burgundy/20 rounded-full" />

      {/* Text Skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-taupe/30 rounded w-3/4" />
        <div className="h-4 bg-taupe/20 rounded w-1/2" />
      </div>
    </div>
  );
};

export const BrandCardSkeleton = ({ className }: ProductCardSkeletonProps) => {
  return (
    <div className={cn("animate-pulse flex-shrink-0", className)}>
      <div className="w-40 lg:w-48 rounded-xl p-6 lg:p-8 border border-gold/10 bg-cream/30">
        {/* Logo Skeleton */}
        <div className="h-20 lg:h-24 flex items-center justify-center mb-4">
          <div className="w-24 h-12 bg-taupe/20 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skeleton-shimmer" />
          </div>
        </div>
        {/* Text Skeleton */}
        <div className="h-3 bg-taupe/20 rounded w-16 mx-auto" />
      </div>
    </div>
  );
};

export const CategoryCardSkeleton = (
  { className }: ProductCardSkeletonProps,
) => {
  return (
    <div className={cn("animate-pulse flex flex-col items-center", className)}>
      {/* Circle Skeleton */}
      <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-cream via-taupe/20 to-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skeleton-shimmer" />
      </div>
      {/* Text Skeleton */}
      <div className="mt-4 md:mt-5 h-4 bg-taupe/20 rounded w-20" />
    </div>
  );
};

export const TestimonialCardSkeleton = (
  { className }: ProductCardSkeletonProps,
) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-cream/5 border border-gold/10 rounded-lg p-8",
        className,
      )}
    >
      {/* Quote Icon Skeleton */}
      <div className="w-10 h-10 bg-gold/10 rounded mb-6" />

      {/* Review Text Skeleton */}
      <div className="space-y-2 mb-6 min-h-[100px]">
        <div className="h-3 bg-cream/10 rounded w-full" />
        <div className="h-3 bg-cream/10 rounded w-5/6" />
        <div className="h-3 bg-cream/10 rounded w-4/6" />
        <div className="h-3 bg-cream/10 rounded w-3/4" />
      </div>

      {/* Stars Skeleton */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gold/20 rounded" />
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gold/10 mb-6" />

      {/* Author Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gold/20" />
        <div className="space-y-2">
          <div className="h-4 bg-cream/10 rounded w-24" />
          <div className="h-3 bg-cream/10 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

export const ImageSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-br from-cream via-taupe/20 to-cream relative overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skeleton-shimmer" />
    </div>
  );
};
