import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFilterPillsProps {
  selectedTypes: string[];
  selectedVendors: string[];
  onRemoveType: (type: string) => void;
  onRemoveVendor: (vendor: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterPills({
  selectedTypes,
  selectedVendors,
  onRemoveType,
  onRemoveVendor,
  onClearAll,
}: ActiveFilterPillsProps) {
  const totalFilters = selectedTypes.length + selectedVendors.length;
  if (totalFilters === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {selectedTypes.map((type) => (
        <Button
          key={`type-${type}`}
          variant="secondary"
          size="sm"
          className="rounded-full text-xs h-7 gap-1"
          onClick={() => onRemoveType(type)}
        >
          {type}
          <X className="h-3 w-3" />
        </Button>
      ))}
      {selectedVendors.map((vendor) => (
        <Button
          key={`vendor-${vendor}`}
          variant="outline"
          size="sm"
          className="rounded-full text-xs h-7 gap-1 border-primary/30"
          onClick={() => onRemoveVendor(vendor)}
        >
          🏷️ {vendor}
          <X className="h-3 w-3" />
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full text-xs h-7 text-muted-foreground"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  );
}

