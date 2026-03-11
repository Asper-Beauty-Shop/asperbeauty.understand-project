import { SKIN_CONCERNS } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

interface ConcernFilterProps {
  selected: string | null;
  onSelect: (concern: string | null) => void;
}

export function ConcernFilter({ selected, onSelect }: ConcernFilterProps) {
  return (
    <div data-testid="concern-filter" className="flex flex-wrap gap-2">
      <FilterChip
        label="All"
        isSelected={selected === null}
        onClick={() => onSelect(null)}
      />
      {SKIN_CONCERNS.map((c) => (
        <FilterChip
          key={c.value}
          label={c.label}
          isSelected={selected === c.value}
          onClick={() => onSelect(selected === c.value ? null : c.value)}
        />
      ))}
    </div>
  );
}

/** Tactile filter chip with bounce animation */
function FilterChip({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-body font-medium tracking-wide border transition-all duration-200",
        "active:scale-95 hover:shadow-maroon-glow",
        isSelected
          ? "bg-primary text-primary-foreground border-primary scale-100 shadow-maroon-glow"
          : "bg-transparent text-foreground border-primary/30 hover:border-primary/60"
      )}
    >
      {label}
    </button>
  );
}

