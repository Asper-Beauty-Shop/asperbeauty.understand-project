import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LuxuryProductCard } from "@/components/LuxuryProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedCollection = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .neq("availability_status", "Pending_Purge")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="featured-collection" className="bg-cream py-20 md:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-3 inline-block font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold-500">
            Selected For You
          </span>
          <h2 className="font-serif text-4xl font-light tracking-tight text-luxury-black md:text-5xl">
            The Iconic Edit
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gold-300" />
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
                    image_url: product.image_url || "/editorial-showcase-2.jpg",
                    description: product.pharmacist_note || undefined,
                    volume_ml: undefined,
                    is_new: new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    is_on_sale: false,
                  }}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;

