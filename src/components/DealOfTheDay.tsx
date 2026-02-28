import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatJOD } from "@/lib/productImageUtils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const DealOfTheDay = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // Countdown Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to 24 hours
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch products on sale
  const { data: deals, isLoading } = useQuery({
    queryKey: ["deal-of-the-day"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_on_sale", true)
        .order("discount_percent", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  const formatTime = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header with Timer */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Flame className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">
                {isAr ? "عروض اليوم" : "Specials & Offers"}
              </h2>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-1 font-mono text-lg font-bold tracking-wider text-foreground">
              <span className="rounded bg-muted px-2 py-1">
                {formatTime(timeLeft.hours)}
              </span>
              <span>:</span>
              <span className="rounded bg-muted px-2 py-1">
                {formatTime(timeLeft.minutes)}
              </span>
              <span>:</span>
              <span className="rounded bg-muted px-2 py-1">
                {formatTime(timeLeft.seconds)}
              </span>
            </div>
            <Link
              to="/offers"
              className="ml-4 flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {isAr ? "عرض الكل" : "View All"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {isLoading
            ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-muted bg-card"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4">
                    <Skeleton className="mb-2 h-3 w-16" />
                    <Skeleton className="mb-3 h-4 w-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))
            )
            : deals && deals.length > 0
            ? (
              deals.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group overflow-hidden rounded-lg border border-muted bg-card transition-all duration-300 hover:border-primary hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted/30">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Discount Badge */}
                    {product.discount_percent && (
                      <div className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
                        -{product.discount_percent}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {product.brand || product.category}
                    </span>
                    <h3 className="mt-1 line-clamp-2 font-sans text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {product.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-serif text-lg font-semibold text-primary">
                        {formatJOD(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatJOD(product.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )
            : (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">
                  {isAr ? "لا توجد عروض حالياً" : "No deals available right now"}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/shop">
                    {isAr ? "تصفح المنتجات" : "Browse Products"}
                  </Link>
                </Button>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
