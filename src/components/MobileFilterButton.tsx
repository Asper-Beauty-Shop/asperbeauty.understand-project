import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileFilterButtonProps {
  activeFilterCount?: number;
  onClick: () => void;
}

export default function MobileFilterButton({ activeFilterCount = 0, onClick }: MobileFilterButtonProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-36 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      )}
    >
      <button
        onClick={onClick}
        className="group relative flex items-center gap-3 px-6 py-3.5 bg-primary text-primary-foreground rounded-full shadow-[0_10px_25px_-5px_hsl(var(--primary)/0.4)] border border-primary hover:bg-primary/90 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        <SlidersHorizontal className="h-5 w-5 text-accent group-hover:text-primary-foreground transition-colors" />

        <span className="font-body font-medium text-sm tracking-wide">
          Filter & Sort
        </span>

        {activeFilterCount > 0 && (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-primary font-bold text-xs font-body shadow-sm">
            {activeFilterCount}
          </span>
        )}

        {/* Inner glow ring */}
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 pointer-events-none" />
      </button>
    </div>
  );
}

