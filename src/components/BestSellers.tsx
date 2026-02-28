import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

// Filter data
const filterData = {
  brands: [
    { id: "vichy", name: "Vichy" },
    { id: "eucerin", name: "Eucerin" },
    { id: "cetaphil", name: "Cetaphil" },
    { id: "svr", name: "SVR" },
    { id: "bioderma", name: "Bioderma" },
  ],
  concerns: [
    { id: "acne", name: "Acne", nameAr: "حب الشباب" },
    { id: "anti-aging", name: "Anti-Aging", nameAr: "مكافحة الشيخوخة" },
    { id: "dryness", name: "Dryness", nameAr: "الجفاف" },
    { id: "sensitivity", name: "Sensitivity", nameAr: "البشرة الحساسة" },
    { id: "dark-spots", name: "Dark Spots", nameAr: "البقع الداكنة" },
  ],
  ingredients: [
    { id: "hyaluronic-acid", name: "Hyaluronic Acid" },
    { id: "retinol", name: "Retinol" },
    { id: "vitamin-c", name: "Vitamin C" },
    { id: "niacinamide", name: "Niacinamide" },
    { id: "salicylic-acid", name: "Salicylic Acid" },
  ],
};

interface FilterGroupProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterGroup = (
  { title, isOpen, onToggle, children }: FilterGroupProps,
) => (
  <div className="border-b border-gold/20 pb-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 font-display text-sm text-foreground hover:text-gold transition-colors duration-400"
    >
      {title}
      {isOpen
        ? <ChevronUp className="w-4 h-4" />
        : <ChevronDown className="w-4 h-4" />}
    </button>
    {isOpen && (
      <div className="mt-3 space-y-2 animate-fade-in">
        {children}
      </div>
    )}
  </div>
);

export const BestSellers = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Filter states
  const [openFilters, setOpenFilters] = useState({
    brands: true,
    concerns: true,
    price: false,
    ingredients: false,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const toggleFilter = (filter: keyof typeof openFilters) => {
    setOpenFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["bestSellers"],
    queryFn: () => fetchProducts(12),
    staleTime: 5 * 60 * 1000,
  });

  // Filter products based on selections (simplified - would need product data with these fields)
  const filteredProducts = products || [];

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {isArabic ? "الأكثر مبيعاً" : "Best Sellers"}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Hidden on mobile */}
          <aside className="hidden lg:block lg:w-1/5 lg:sticky lg:top-36 lg:self-start">
            <div className="bg-card p-6 rounded-lg border border-gold/20 shadow-sm">
              <h3 className="font-display text-lg text-burgundy mb-6 pb-3 border-b border-gold/30">
                {isArabic ? "تصفية حسب" : "Filter By"}
              </h3>

              {/* Brand Filter */}
              <FilterGroup
                title={isArabic ? "العلامة التجارية" : "Brand"}
                isOpen={openFilters.brands}
                onToggle={() => toggleFilter("brands")}
              >
                {filterData.brands.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand.id]);
                        } else {
                          setSelectedBrands(
                            selectedBrands.filter((b) => b !== brand.id),
                          );
                        }
                      }}
                      className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-400">
                      {brand.name}
                    </span>
                  </label>
                ))}
              </FilterGroup>

              {/* Skin Concern Filter */}
              <FilterGroup
                title={isArabic ? "مشاكل البشرة" : "Skin Concern"}
                isOpen={openFilters.concerns}
                onToggle={() => toggleFilter("concerns")}
              >
                {filterData.concerns.map((concern) => (
                  <label
                    key={concern.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedConcerns.includes(concern.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedConcerns([
                            ...selectedConcerns,
                            concern.id,
                          ]);
                        } else {
                          setSelectedConcerns(
                            selectedConcerns.filter((c) => c !== concern.id),
                          );
                        }
                      }}
                      className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-400">
                      {isArabic ? concern.nameAr : concern.name}
                    </span>
                  </label>
                ))}
              </FilterGroup>

              {/* Price Range Filter */}
              <FilterGroup
                title={isArabic ? "نطاق السعر" : "Price Range"}
                isOpen={openFilters.price}
                onToggle={() => toggleFilter("price")}
              >
                <div className="px-1 py-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={200}
                    step={10}
                    className="[&_[role=slider]]:bg-gold [&_[role=slider]]:border-gold"
                  />
                  <div className="flex justify-between mt-3 font-body text-xs text-muted-foreground">
                    <span>JOD {priceRange[0]}</span>
                    <span>JOD {priceRange[1]}</span>
                  </div>
                </div>
              </FilterGroup>

              {/* Ingredients Filter */}
              <FilterGroup
                title={isArabic ? "المكونات" : "Ingredients"}
                isOpen={openFilters.ingredients}
                onToggle={() => toggleFilter("ingredients")}
              >
                {filterData.ingredients.map((ingredient) => (
                  <label
                    key={ingredient.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedIngredients.includes(ingredient.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIngredients([
                            ...selectedIngredients,
                            ingredient.id,
                          ]);
                        } else {
                          setSelectedIngredients(
                            selectedIngredients.filter((i) =>
                              i !== ingredient.id
                            ),
                          );
                        }
                      }}
                      className="border-gold/50 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-400">
                      {ingredient.name}
                    </span>
                  </label>
                ))}
              </FilterGroup>
            </div>
          </aside>

          {/* Product Grid - 80% */}
          <div className="lg:w-4/5">
            {isLoading
              ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-card animate-pulse rounded-lg aspect-[3/4]"
                    />
                  ))}
                </div>
              )
              : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                  {filteredProducts.map((product: ShopifyProduct) => (
                    <ProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              )}

            {/* Empty state */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="font-body text-muted-foreground">
                  {isArabic ? "لا توجد منتجات" : "No products found"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
