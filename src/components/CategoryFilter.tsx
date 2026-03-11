import { useState } from "react";
import { CATEGORIES, type CategoryInfo } from "@/lib/categoryMapping";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryGroup {
  label: string;
  icon: string;
  subcategories: { label: string }[];
}

// Build groups from CATEGORIES
const CATEGORY_GROUPS: CategoryGroup[] = Object.values(CATEGORIES).map((cat) => ({
  label: cat.title,
  icon: cat.slug === "skin-care" ? "🧴" : cat.slug === "hair-care" ? "💇" : cat.slug === "make-up" ? "💄" : cat.slug === "body-care" ? "🧼" : cat.slug === "fragrances" ? "🌸" : "🔧",
  subcategories: [{ label: cat.title }],
}));

interface CategoryFilterProps {
  selected: string[];
  onSelect: (selected: string[]) => void;
  groups?: CategoryGroup[];
}

export function CategoryFilter({ selected, onSelect, groups }: CategoryFilterProps) {
  const displayGroups = groups || CATEGORY_GROUPS;
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    displayGroups.map((g) => g.label)
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const toggleSub = (subLabel: string) => {
    onSelect(
      selected.includes(subLabel)
        ? selected.filter((s) => s !== subLabel)
        : [...selected, subLabel]
    );
  };

  const isGroupPartiallySelected = (groupLabel: string) => {
    const group = displayGroups.find((g) => g.label === groupLabel);
    if (!group) return false;
    const selectedCount = group.subcategories.filter((s) => selected.includes(s.label)).length;
    return selectedCount > 0 && selectedCount < group.subcategories.length;
  };

  const isGroupFullySelected = (groupLabel: string) => {
    const group = displayGroups.find((g) => g.label === groupLabel);
    if (!group) return false;
    return group.subcategories.every((s) => selected.includes(s.label));
  };

  const toggleGroupAll = (groupLabel: string) => {
    const group = displayGroups.find((g) => g.label === groupLabel);
    if (!group) return;
    const allLabels = group.subcategories.map((s) => s.label);
    if (isGroupFullySelected(groupLabel)) {
      onSelect(selected.filter((s) => !allLabels.includes(s)));
    } else {
      onSelect(Array.from(new Set([...selected, ...allLabels])));
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground font-heading">Categories</h3>
        {selected.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => onSelect([])} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3 mr-1" />
            Clear ({selected.length})
          </Button>
        )}
      </div>
      {displayGroups.map((group) => {
        const isExpanded = expandedGroups.includes(group.label);
        return (
          <div key={group.label} className="space-y-0.5">
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              <span>{group.icon}</span>
              <span className="flex-1 text-left">{group.label}</span>
              <Checkbox
                checked={isGroupFullySelected(group.label) ? true : isGroupPartiallySelected(group.label) ? "indeterminate" : false}
                onCheckedChange={() => toggleGroupAll(group.label)}
                onClick={(e) => e.stopPropagation()}
                className="h-3.5 w-3.5"
              />
            </button>
            {isExpanded && (
              <div className="ml-6 space-y-0.5">
                {group.subcategories.map((sub) => (
                  <label
                    key={sub.label}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-accent/50",
                      selected.includes(sub.label) ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    <Checkbox checked={selected.includes(sub.label)} onCheckedChange={() => toggleSub(sub.label)} className="h-3.5 w-3.5" />
                    {sub.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

