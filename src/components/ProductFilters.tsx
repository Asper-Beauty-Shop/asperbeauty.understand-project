import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
}

interface ProductFiltersProps {
  availableCategories: string[];
  availableBrands: string[];
  maxPrice: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const ProductFilters = ({
  availableCategories,
  availableBrands,
  maxPrice,
  filters,
  onFiltersChange,
}: ProductFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      brands: [],
      priceRange: [0, maxPrice],
    });
  };

  const hasActiveFilters = filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header with Clear */}
      <div className="flex items-center justify-between pb-4 border-b border-gold/20">
        <h3 className="font-display text-lg text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gold hover:text-gold/80"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div className="border-b border-gold/10 pb-4">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full py-2 font-display text-sm text-foreground"
          >
            Category
            {expandedSections.category
              ? <ChevronUp className="w-4 h-4 text-gold" />
              : <ChevronDown className="w-4 h-4 text-gold" />}
          </button>
          {expandedSections.category && (
            <div className="mt-3 space-y-2">
              {availableCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div className="border-b border-gold/10 pb-4">
          <button
            onClick={() => toggleSection("brand")}
            className="flex items-center justify-between w-full py-2 font-display text-sm text-foreground"
          >
            Brand
            {expandedSections.brand
              ? <ChevronUp className="w-4 h-4 text-gold" />
              : <ChevronDown className="w-4 h-4 text-gold" />}
          </button>
          {expandedSections.brand && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                    className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full py-2 font-display text-sm text-foreground"
        >
          Price Range
          {expandedSections.price
            ? <ChevronUp className="w-4 h-4 text-gold" />
            : <ChevronDown className="w-4 h-4 text-gold" />}
        </button>
        {expandedSections.price && (
          <div className="mt-4 px-1">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={maxPrice}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between mt-3 font-body text-sm text-muted-foreground">
              <span>JOD {filters.priceRange[0]}</span>
              <span>JOD {filters.priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(true)}
          className="w-full border-gold/30 text-foreground hover:bg-gold/10"
        >
          <Filter className="w-4 h-4 me-2" />
          Filters
          {hasActiveFilters && (
            <span className="ms-2 bg-gold text-cream text-xs px-2 py-0.5 rounded-full">
              {filters.categories.length + filters.brands.length +
                (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice
                  ? 1
                  : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-maroon/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-cream p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-foreground">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-gold/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-32 bg-cream border border-gold/20 p-6">
          <FilterContent />
        </div>
      </div>
    </>
  );
};
