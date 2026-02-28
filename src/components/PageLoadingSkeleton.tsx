import { cn } from "@/lib/utils";
import {
  BrandCardSkeleton,
  ProductCardSkeleton,
  TestimonialCardSkeleton,
} from "./ProductCardSkeleton";

export const PageLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-cream animate-fade-in">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="w-32 h-10 bg-cream/10 rounded animate-pulse" />
            <div className="hidden md:flex items-center gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-4 bg-cream/10 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="flex items-center gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-cream/10 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="pt-28 md:pt-32 lg:pt-36">
        <div className="relative h-[70vh] md:h-[85vh] bg-gradient-to-br from-charcoal via-charcoal/90 to-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/5 to-transparent skeleton-shimmer" />
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <div className="w-48 h-4 bg-cream/10 rounded mb-6 animate-pulse" />
            <div className="w-80 md:w-[500px] h-12 md:h-16 bg-cream/10 rounded mb-4 animate-pulse" />
            <div className="w-64 md:w-96 h-6 bg-cream/10 rounded mb-8 animate-pulse" />
            <div className="w-40 h-12 bg-gold/20 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Featured Products Section Skeleton */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-32 h-4 bg-taupe/20 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-8 bg-taupe/30 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </section>

      {/* Brands Section Skeleton */}
      <section className="py-16 bg-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-40 h-4 bg-cream/10 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-72 h-8 bg-cream/20 rounded mx-auto animate-pulse" />
          </div>
          <div className="flex justify-center gap-6 overflow-hidden">
            {[...Array(6)].map((_, i) => <BrandCardSkeleton key={i} />)}
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className="py-16 bg-charcoal/95">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-36 h-4 bg-cream/10 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-56 h-8 bg-cream/20 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <TestimonialCardSkeleton key={i} />)}
          </div>
        </div>
      </section>

      {/* Newsletter Skeleton */}
      <section className="py-16 bg-gradient-to-br from-burgundy/10 via-cream to-gold/10">
        <div className="container mx-auto px-4 text-center">
          <div className="w-48 h-8 bg-taupe/20 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-80 h-4 bg-taupe/10 rounded mx-auto mb-8 animate-pulse" />
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <div className="flex-1 h-12 bg-taupe/10 rounded animate-pulse" />
            <div className="w-32 h-12 bg-gold/30 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-charcoal py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="w-24 h-5 bg-cream/20 rounded animate-pulse" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="w-32 h-3 bg-cream/10 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
