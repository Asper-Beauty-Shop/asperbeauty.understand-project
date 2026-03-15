import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search, X } from "lucide-react";
import { searchProducts, ShopifyProduct } from "@/lib/shopify";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateTitle } from "@/lib/productUtils";
import { formatJOD } from "@/lib/productImageUtils";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobile?: boolean;
}

export const SearchDropdown = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  isMobile = false,
}: SearchDropdownProps) => {
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language, isRTL } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const products = await searchProducts(searchQuery, 8);
        setResults(products);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Search error:", error);
        }
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleResultClick = () => {
    setSearchQuery("");
    onClose();
  };

  const showDropdown = isOpen && (searchQuery.length >= 2 || isLoading);

  if (!showDropdown) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute ${
        isMobile
          ? "left-0 right-0 top-full mt-1"
          : "left-0 right-0 top-full mt-2"
      } bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto`}
    >
      {isLoading
        ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-shiny-gold" />
            <span className="ml-2 text-gray-500 font-body text-sm">
              {language === "ar" ? "جاري البحث..." : "Searching..."}
            </span>
          </div>
        )
        : results.length > 0
        ? (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-xs text-gray-500 font-body">
                {language === "ar"
                  ? `تم العثور على ${results.length} نتيجة`
                  : `${results.length} results found`}
              </span>
            </div>
            <ul>
              {results.map((product) => {
                const imageUrl = product.node.images.edges[0]?.node.url;
                const price = parseFloat(
                  product.node.priceRange.minVariantPrice.amount,
                );
                const displayTitle = translateTitle(
                  product.node.title,
                  language,
                );

                return (
                  <li key={product.node.id}>
                    <Link
                      to={`/product/${product.node.handle}`}
                      onClick={handleResultClick}
                      className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {imageUrl
                          ? (
                            <img
                              src={imageUrl}
                              alt={displayTitle}
                              className="w-full h-full object-cover"
                            />
                          )
                          : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Search className="w-5 h-5" />
                            </div>
                          )}
                      </div>

                      {/* Product Info */}
                      <div
                        className={`flex-1 min-w-0 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        <h4 className="font-display text-sm text-dark-charcoal truncate">
                          {displayTitle}
                        </h4>
                        <p className="text-xs text-gray-500 font-body mt-0.5">
                          {product.node.vendor}
                        </p>
                        <p className="text-sm font-semibold text-shiny-gold mt-1 font-body">
                          {formatJOD(price)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* View All Results Link */}
            <Link
              to={`/collections?search=${encodeURIComponent(searchQuery)}`}
              onClick={handleResultClick}
              className="block px-4 py-3 bg-gray-50 text-center text-sm font-display text-shiny-gold hover:text-dark-charcoal transition-colors border-t border-gray-200"
            >
              {language === "ar" ? "عرض جميع النتائج" : "View All Results"}
            </Link>
          </div>
        )
        : (
          <div className="py-8 text-center">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-body text-sm">
              {language === "ar" ? "لا توجد نتائج" : "No results found"}
            </p>
            <p className="text-gray-400 font-body text-xs mt-1">
              {language === "ar"
                ? "جربي كلمات بحث مختلفة"
                : "Try different search terms"}
            </p>
          </div>
        )}
    </div>
  );
};

