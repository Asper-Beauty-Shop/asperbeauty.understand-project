import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Asper Beauty Shop — Gold Line Navigation Icons
 * 
 * Stroke: 1.2px, matching the Clinical Elegance icon system
 * Color: Inherits from parent (currentColor) — styled gold via text-accent
 * Fill: None (pure line art)
 */
const icons: Record<string, ReactNode> = {
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Elegant tote bag */}
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

interface BrandIconProps {
  icon: keyof typeof icons;
  notificationCount?: number;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
}

export default function BrandIcon({
  icon,
  notificationCount = 0,
  onClick,
  className,
  children,
  ariaLabel,
}: BrandIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative p-2 rounded-lg transition-all duration-300 hover:bg-accent/5",
        className
      )}
      aria-label={ariaLabel || icon}
    >
      <div className="w-5 h-5 text-accent transition-all duration-300 group-hover:text-gold-dark group-hover:drop-shadow-[0_0_4px_hsl(43_69%_46%/0.4)]">
        {children || icons[icon]}
      </div>

      {notificationCount > 0 && (
        <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-sm ring-2 ring-background">
          {notificationCount}
        </span>
      )}
    </button>
  );
}
