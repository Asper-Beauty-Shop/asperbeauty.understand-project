import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
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
        "group relative p-2 rounded-lg transition-all duration-300 hover:bg-accent/10",
        className
      )}
      aria-label={ariaLabel || icon}
    >
      <div className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-accent">
        {children || icons[icon]}
      </div>

      {notificationCount > 0 && (
        <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground shadow-sm ring-2 ring-background">
          {notificationCount}
        </span>
      )}
    </button>
  );
}
