import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  onFilterChange: (filters: FilterState) => void;
  products: any[];
}

export const ProductSearchFilters = ({ filters, onFilterChange }: ProductSearchFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          className="pl-10"
        />
      </div>
    </div>
  );
};
