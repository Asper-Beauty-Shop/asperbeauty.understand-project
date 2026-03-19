import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LuxuryProductCard } from "@/components/LuxuryProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const BestSellersSection = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const { data: products, isLoading } = useQuery({
    queryKey: ["best-sellers-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .neq("availability_status", "Pending_Purge")
        .lt("bestseller_rank", 999)
        .order("bestseller_rank", { ascending: true })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:mb-16">
          <div className="text-center md:text-left">
            <span className="mb-3 inline-block font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold-500">
              {isAr ? "مفضلات عالمية" : "World-Class Favorites"}
            </span>
            <h2 className="font-display text-4xl font-light tracking-tight text-luxury-black md:text-5xl">
              {isAr ? "الأكثر مبيعاً" : "Global Best Sellers"}
            </h2>
          </div>
          <Link
            to="/best-sellers"
            className="group flex items-center gap-2 font-sans text-sm font-medium uppercase tracking-widest text-luxury-black transition-colors hover:text-gold-500"
          >
            {isAr ? "عرض الكل" : "View All"}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-[3/4] w-full bg-cream-dark" />
                  <div className="p-4">
                    <Skeleton className="mb-2 h-3 w-16 bg-cream-dark" />
                    <Skeleton className="mb-3 h-5 w-full bg-cream-dark" />
                    <Skeleton className="h-4 w-20 bg-cream-dark" />
                  </div>
                </div>
              ))
            : products?.map((product) => (
                <LuxuryProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    title: product.title,
                    category: product.primary_concern || undefined,
                    brand: product.brand || undefined,
                    price: product.price ?? 0,
                    original_price: null,
                    discount_percent: null,
                    image_url: product.image_url || "/editorial-showcase-2.webp",
                    description: product.pharmacist_note || undefined,
                    volume_ml: undefined,
                    is_new: false,
                    is_on_sale: false,
                  }}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;

