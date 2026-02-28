import { useCallback, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BRANDS,
  CATEGORIES,
  PRICE_RANGES,
  SKIN_CONCERNS,
} from "@/lib/categoryHierarchy";
import { sanitizeInput } from "@/lib/validationSchemas";

export interface FilterState {
  searchQuery: string;
  categories: string[];
  subcategories: string[];
  brands: string[];
  skinConcerns: string[];
  priceRange: [number, number];
  onSaleOnly: boolean;
}

interface ProductSearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  productCount: number;
}

export const ProductSearchFilters = ({
  filters,
  onFiltersChange,
  productCount,
}: ProductSearchFiltersProps) => {
  const { language } = useLanguage();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const activeFilterCount = filters.categories.length +
    filters.subcategories.length +
    filters.brands.length +
    filters.skinConcerns.length +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  }, [filters, onFiltersChange]);

  // Sanitize search input to prevent XSS
  const handleSearchChange = useCallback((value: string) => {
    // Limit length and sanitize
    const sanitized = sanitizeInput(value).slice(0, 100);
    updateFilters({ searchQuery: sanitized });
  }, [updateFilters]);

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilters({ [key]: updated });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: "",
      categories: [],
      subcategories: [],
      brands: [],
      skinConcerns: [],
      priceRange: [0, 200],
      onSaleOnly: false,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <Accordion
        type="multiple"
        defaultValue={["categories", "brands", "concerns"]}
        className="w-full"
      >
        <AccordionItem value="categories" className="border-b border-gray-100">
          <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline py-3">
            {language === "ar" ? "الفئات" : "Categories"}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() =>
                        toggleArrayFilter("categories", category.id)}
                      className="border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {language === "ar" ? category.labelAr : category.labelEn}
                    </span>
                  </label>
                  {filters.categories.includes(category.id) && (
                    <div className="ml-6 space-y-2">
                      {category.subcategories.map((sub) => (
                        <label
                          key={sub.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={filters.subcategories.includes(sub.id)}
                            onCheckedChange={() =>
                              toggleArrayFilter("subcategories", sub.id)}
                            className="border-gray-300 h-3.5 w-3.5"
                          />
                          <span className="text-xs text-gray-600">
                            {language === "ar" ? sub.labelAr : sub.labelEn}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands" className="border-b border-gray-100">
          <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline py-3">
            {language === "ar" ? "العلامات التجارية" : "Brands"}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 gap-2">
              {BRANDS.map((brand) => (
                <label
                  key={brand.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.brands.includes(brand.name)}
                    onCheckedChange={() =>
                      toggleArrayFilter("brands", brand.name)}
                    className="border-gray-300 h-3.5 w-3.5"
                  />
                  <span className="text-xs text-gray-600">{brand.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skin Concerns */}
        <AccordionItem value="concerns" className="border-b border-gray-100">
          <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline py-3">
            {language === "ar" ? "مشاكل البشرة" : "Skin Concerns"}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-wrap gap-2">
              {SKIN_CONCERNS.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => toggleArrayFilter("skinConcerns", concern.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filters.skinConcerns.includes(concern.id)
                      ? concern.color + " ring-2 ring-offset-1 ring-gray-400"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {language === "ar" ? concern.labelAr : concern.labelEn}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-b border-gray-100">
          <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline py-3">
            {language === "ar" ? "نطاق السعر" : "Price Range"}
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4 px-1">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  updateFilters({ priceRange: value as [number, number] })}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{filters.priceRange[0]} JD</span>
                <span>{filters.priceRange[1]} JD</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.id}
                    onClick={() =>
                      updateFilters({
                        priceRange: [range.min, Math.min(range.max, 200)],
                      })}
                    className="px-2 py-1 text-xs rounded border border-gray-200 hover:border-burgundy hover:text-burgundy transition-colors"
                  >
                    {language === "ar" ? range.labelAr : range.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* On Sale Toggle */}
      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-red-50 border border-red-100">
        <Checkbox
          checked={filters.onSaleOnly}
          onCheckedChange={(checked) =>
            updateFilters({ onSaleOnly: !!checked })}
          className="border-red-300"
        />
        <span className="text-sm font-medium text-red-700">
          {language === "ar" ? "العروض فقط" : "On Sale Only"}
        </span>
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={language === "ar"
              ? "ابحث عن منتجات..."
              : "Search products..."}
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy"
            maxLength={100}
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="lg:hidden flex items-center gap-2 border-gray-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{language === "ar" ? "تصفية" : "Filters"}</span>
              {activeFilterCount > 0 && (
                <Badge className="bg-burgundy text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 bg-white p-0 overflow-y-auto"
          >
            <SheetHeader className="p-4 border-b border-gray-100">
              <SheetTitle className="text-left">
                {language === "ar" ? "تصفية المنتجات" : "Filter Products"}
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <Button
                onClick={() => setIsSheetOpen(false)}
                className="w-full bg-burgundy hover:bg-burgundy-light text-white"
              >
                {language === "ar"
                  ? `عرض ${productCount} منتج`
                  : `Show ${productCount} Products`}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">
            {language === "ar" ? "الفلاتر النشطة:" : "Active filters:"}
          </span>

          {filters.categories.map((catId) => {
            const cat = CATEGORIES.find((c) => c.id === catId);
            return (
              <Badge
                key={catId}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer gap-1"
                onClick={() => toggleArrayFilter("categories", catId)}
              >
                {language === "ar" ? cat?.labelAr : cat?.labelEn}
                <X className="w-3 h-3" />
              </Badge>
            );
          })}

          {filters.brands.map((brand) => (
            <Badge
              key={brand}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer gap-1"
              onClick={() => toggleArrayFilter("brands", brand)}
            >
              {brand}
              <X className="w-3 h-3" />
            </Badge>
          ))}

          {filters.skinConcerns.map((concernId) => {
            const concern = SKIN_CONCERNS.find((c) => c.id === concernId);
            return (
              <Badge
                key={concernId}
                className={`${concern?.color} cursor-pointer gap-1`}
                onClick={() => toggleArrayFilter("skinConcerns", concernId)}
              >
                {language === "ar" ? concern?.labelAr : concern?.labelEn}
                <X className="w-3 h-3" />
              </Badge>
            );
          })}

          {filters.onSaleOnly && (
            <Badge
              className="bg-red-100 text-red-700 cursor-pointer gap-1"
              onClick={() => updateFilters({ onSaleOnly: false })}
            >
              {language === "ar" ? "العروض" : "On Sale"}
              <X className="w-3 h-3" />
            </Badge>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs text-burgundy hover:underline ml-2"
          >
            {language === "ar" ? "مسح الكل" : "Clear all"}
          </button>
        </div>
      )}

      {/* Desktop Filters (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <FilterContent />
      </div>
    </div>
  );
};

export default ProductSearchFilters;
