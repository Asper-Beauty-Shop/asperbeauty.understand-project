import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Well-known brands in the store, grouped alphabetically for quick access */
const POPULAR_BRANDS = [
  "Beesline", "Bioderma", "Bourjois", "Catrice", "CeraVe",
  "Essence", "Eucerin", "Golden Rose", "L'Oreal", "La Roche-Posay",
  "Maybelline", "Note", "NYX", "Sebamed", "Seventeen",
  "Too Faced", "Topface", "Vaseline", "Vichy",
];

interface VendorFilterProps {
  selected: string[];
  onSelect: (selected: string[]) => void;
}

export function VendorFilter({ selected, onSelect }: VendorFilterProps) {
  const [expanded, setExpanded] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? POPULAR_BRANDS.filter((b) =>
        b.toLowerCase().includes(search.trim().toLowerCase())
      )
    : POPULAR_BRANDS;

  const toggle = (brand: string) => {
    onSelect(
      selected.includes(brand)
        ? selected.filter((s) => s !== brand)
        : [...selected, brand]
    );
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground font-heading">
          Brands
        </h3>
        {selected.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect([])}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear ({selected.length})
          </Button>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span>ðŸ·ï¸</span>
        <span className="flex-1 text-left">All Brands</span>
      </button>

      {expanded && (
        <div className="ml-2 space-y-1">
          <div className="relative px-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 pl-7 text-xs font-body"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
            {filtered.map((brand) => (
              <label
                key={brand}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-accent/50",
                  selected.includes(brand)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                <Checkbox
                  checked={selected.includes(brand)}
                  onCheckedChange={() => toggle(brand)}
                  className="h-3.5 w-3.5"
                />
                {brand}
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-2 text-xs text-muted-foreground">
                No brands found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Build a Shopify vendor query from selected brand names.
 */
export function buildVendorQuery(vendors: string[]): string | undefined {
  if (vendors.length === 0) return undefined;
  return vendors.map((v) => `vendor:${v}`).join(" OR ");
}

