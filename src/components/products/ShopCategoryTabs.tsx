import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

const SHOP_CATEGORIES = [
  { label: "All", icon: "🛍️" },
  { label: "Skincare", icon: "🧴" },
  { label: "Haircare", icon: "💇" },
  { label: "Makeup", icon: "💄" },
  { label: "Bath & Body", icon: "🧼" },
  { label: "Perfume", icon: "🌸" },
  { label: "Supplements", icon: "💊" },
  { label: "Baby & Mother", icon: "👶" },
];

interface ShopCategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ShopCategoryTabs({ activeTab, onTabChange }: ShopCategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeTab]);

  return (
    <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1 -mx-1 px-1">
      {SHOP_CATEGORIES.map((tab) => {
        const isActive = activeTab === tab.label;
        return (
          <button
            key={tab.label}
            ref={isActive ? activeRef : undefined}
            onClick={() => onTabChange(tab.label)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium font-body transition-all duration-200 shrink-0",
              "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border/60 hover:border-accent hover:text-foreground hover:bg-accent/10"
            )}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
