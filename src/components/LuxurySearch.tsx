"use client";

import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  ArrowRight,
  History,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { formatJOD } from "@/lib/productImageUtils";

interface SearchResult {
  id: string;
  title: string;
  primary_concern: string | null;
  image_url: string | null;
  price: number | null;
}

export const LuxurySearch = (
  { open, setOpen }: { open: boolean; setOpen: (open: boolean) => void },
) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches] = useState(["Olaplex", "CeraVe Cleanser", "Retinol"]);
  const navigate = useNavigate();

  // 1. Live Search Logic (Debounced)
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("products")
        .select("id, title, primary_concern, image_url, price")
        .ilike("title", `%${query}%`)
        .limit(5);

      if (data) setResults(data as SearchResult[]);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleProductClick = (productId: string) => {
    setOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    setOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center border-b border-gray-100 px-4">
        <Search className="h-5 w-5 text-gold-500" />
        <CommandInput
          placeholder="Search for products, brands..."
          value={query}
          onValueChange={setQuery}
          className="border-0 focus:ring-0 font-sans text-base placeholder:text-gray-400"
        />
      </div>

      <CommandList className="max-h-[60vh]">
        <CommandEmpty className="py-12 text-center">
          <p className="text-gray-400 text-sm">
            No results found for "{query}"
          </p>
        </CommandEmpty>

        {/* 2. RECENT SEARCHES (iHerb Style) */}
        {!query && (
          <CommandGroup
            heading={
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold px-2">
                <History className="h-3 w-3" />
                Recent Searches
              </span>
            }
          >
            {recentSearches.map((search) => (
              <CommandItem
                key={search}
                className="py-3 px-4 cursor-pointer"
                onSelect={() => handleSearchSubmit(search)}
              >
                {search}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* 3. TRENDING BRANDS (Luxury Style) */}
        {!query && (
          <>
            <CommandSeparator />
            <CommandGroup
              heading={
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold px-2">
                  <TrendingUp className="h-3 w-3" />
                  Trending Luxury Brands
                </span>
              }
            >
              <div className="flex flex-wrap gap-2 p-4">
                {["Dior", "Olaplex", "Estée Lauder", "CeraVe", "Kérastase"].map(
                  (brand) => (
                    <button
                      key={brand}
                      onClick={() => handleSearchSubmit(brand)}
                      className="px-4 py-2 bg-cream rounded-full text-xs font-bold uppercase tracking-wider text-luxury-black hover:bg-gold-300 transition-colors"
                    >
                      {brand}
                    </button>
                  ),
                )}
              </div>
            </CommandGroup>
          </>
        )}

        {/* 4. LIVE PRODUCT SUGGESTIONS */}
        {results.length > 0 && (
          <CommandGroup
            heading={
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold px-2">
                <Sparkles className="h-3 w-3" />
                Suggested Products
              </span>
            }
          >
            {results.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => handleProductClick(product.id)}
                className="flex items-center gap-4 py-4 cursor-pointer hover:bg-gray-50 rounded-none border-b border-gray-50 last:border-0"
              >
                <div className="w-12 h-12 bg-cream rounded-lg overflow-hidden flex-shrink-0">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-luxury-black truncate">
                    {product.title}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">
                    {product.primary_concern ?? ""}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm">
                    {formatJOD(Number(product.price))}
                  </p>
                  <ArrowRight className="h-4 w-4 text-gold-500 ml-auto" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>

      <div className="flex items-center justify-between border-t border-gray-100 p-4 bg-cream/50">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          Press ESC to close
        </p>
        <button
          onClick={() => handleSearchSubmit(query || "")}
          className="text-[10px] uppercase tracking-widest font-bold text-gold-500 hover:text-luxury-black transition-colors flex items-center gap-1"
        >
          View all search results
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </CommandDialog>
  );
};

export default LuxurySearch;

