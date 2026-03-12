import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search, X, Tag, ChevronRight } from "lucide-react";
import { searchProducts, ShopifyProduct } from "@/lib/shopify";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateTitle } from "@/lib/productUtils";
import { formatJOD } from "@/lib/productImageUtils";
import { supabase } from "@/integrations/supabase/client";

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
  const [results, setResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language, isRTL } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length < 2) {
      setResults([]);
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        // 1. Search products with hierarchy
        const { data: products } = await supabase
          .from("products")
          .select(`
            id, title, brand, price, image_url, handle,
            categories (
              name,
              departments (name)
            )
          `)
          .ilike("title", `%${searchQuery}%`)
          .limit(5);

        // 2. Search categories directly
        const { data: matchedCats } = await supabase
          .from("categories")
          .select("id, name, slug, departments(name)")
          .ilike("name", `%${searchQuery}%`)
          .limit(3);

        setResults(products || []);
        setCategories(matchedCats || []);
      } catch (error) {
        console.error("Search error:", error);
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

  // Clinical Index: Group results by Department
  const groupedResults = useMemo(() => {
    const groups: Record<string, any[]> = {};
    results.forEach((product) => {
      const deptName = product.categories?.departments?.name || (language === "ar" ? "منتجات متنوعة" : "Other Products");
      if (!groups[deptName]) groups[deptName] = [];
      groups[deptName].push(product);
    });
    return groups;
  }, [results, language]);

  const showDropdown = isOpen && (searchQuery.length >= 2 || isLoading);

  if (!showDropdown) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute ${
        isMobile
          ? "left-0 right-0 top-full mt-1"
          : "left-0 right-0 top-full mt-2"
      } bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden z-50 max-h-[500px] overflow-y-auto`}
    >
      {isLoading
        ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#800020]" />
            <span className="ml-3 text-gray-500 font-body text-sm">
              {language === "ar" ? "تحليل الكتالوج..." : "Analyzing Catalogue..."}
            </span>
          </div>
        )
        : (results.length > 0 || categories.length > 0)
        ? (
          <div className="flex flex-col">
            {/* Category Suggestions */}
            {categories.length > 0 && (
              <div className="p-2 bg-[#F8F8FF] border-b border-gray-100">
                <span className="px-3 py-1 text-[10px] font-bold text-[#800020] uppercase tracking-widest">
                  {language === "ar" ? "الفئات المقترحة" : "Suggested Categories"}
                </span>
                <div className="mt-1 flex flex-wrap gap-2 p-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-[#D4AF37] transition-all group"
                    >
                      <Tag className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-xs font-medium text-gray-700 group-hover:text-[#800020]">
                        {cat.name}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        in {cat.departments?.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product Results grouped by Department (Clinical Index) */}
            {Object.entries(groupedResults).map(([deptName, products]) => (
              <div key={deptName} className="border-b border-gray-100 last:border-b-0">
                {/* Sector Header: Clinical Authority */}
                <div className="bg-[#F8F8FF] px-4 py-2 sticky top-0 z-10 border-y border-gray-100/50">
                  <span className="text-[10px] font-bold text-[#800020] uppercase tracking-widest">
                    {deptName}
                  </span>
                </div>

                <ul className="flex flex-col">
                  {products.map((product) => {
                    const imageUrl = product.image_url;
                    const price = product.price;
                    const displayTitle = translateTitle(product.title, language);
                    const cat = product.categories?.name;

                    return (
                      <li key={product.id}>
                        <Link
                          to={`/product/${product.handle || product.id}`}
                          onClick={handleResultClick}
                          className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-l-2 border-transparent hover:border-[#D4AF37] group ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          {/* Micro-Thumbnail */}
                          <div className="w-10 h-10 bg-[#F8F8FF] rounded-md flex-shrink-0 flex items-center justify-center p-1 border border-gray-100">
                            {imageUrl
                              ? (
                                <img
                                  src={imageUrl}
                                  alt={displayTitle}
                                  className="max-h-full object-contain mix-blend-multiply"
                                />
                              )
                              : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Search className="w-4 h-4" />
                                </div>
                              )}
                          </div>

                          {/* Result Data */}
                          <div
                            className={`flex-1 min-w-0 ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate block mb-0.5">
                              {product.brand}
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#800020] transition-colors leading-tight">
                              {displayTitle}
                            </h4>
                          </div>

                          {/* Price */}
                          <span className="text-sm font-extrabold text-gray-900 shrink-0">
                            {formatJOD(price)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* View All Results Link */}
            <Link
              to={`/shop?search=${encodeURIComponent(searchQuery)}`}
              onClick={handleResultClick}
              className="block px-4 py-4 bg-white text-center text-xs font-bold text-[#D4AF37] hover:text-[#800020] transition-colors border-t border-gray-100 uppercase tracking-[0.2em] sticky bottom-0 z-20"
            >
              {language === "ar" ? "استكشاف جميع النتائج" : "Explore All Matches"}
            </Link>
          </div>
        )
        : (
          <div className="py-12 text-center bg-white p-6">
            <div className="w-12 h-12 bg-[#F8F8FF] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-900 font-display text-sm font-semibold">
              {language === "ar" ? "لم يتم العثور على تشخيصات" : "No clinical matches"}
            </p>
            <p className="text-gray-400 font-body text-xs mt-2 px-8">
              No matches found for "<span className="font-bold text-gray-900">{searchQuery}</span>".
            </p>
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-beauty-assistant", { detail: { persona: "dr_sami" } }));
                onClose();
              }}
              className="mt-6 text-[10px] font-bold text-[#800020] uppercase tracking-widest hover:underline bg-[#800020]/5 px-4 py-2 rounded-full transition-all"
            >
              {language === "ar" ? "استشيري الصيدلي الرقمي بدلاً من ذلك" : "Consult AI Concierge Instead"}
            </button>
          </div>
        )}
    </div>
  );
};

