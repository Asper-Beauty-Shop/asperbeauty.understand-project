import { CategoryFilter } from "@/components/CategoryFilter";
import { VendorFilter } from "@/components/VendorFilter";
import { Separator } from "@/components/ui/separator";

interface ProductFilterSidebarProps {
  selectedTypes: string[];
  onSelectTypes: (types: string[]) => void;
  selectedVendors: string[];
  onSelectVendors: (vendors: string[]) => void;
}

export function ProductFilterSidebar({
  selectedTypes,
  onSelectTypes,
  selectedVendors,
  onSelectVendors,
}: ProductFilterSidebarProps) {
  return (
    <div data-testid="filter-sidebar" className="space-y-4">
      <CategoryFilter selected={selectedTypes} onSelect={onSelectTypes} />
      <Separator />
      <VendorFilter selected={selectedVendors} onSelect={onSelectVendors} />
    </div>
  );
}

