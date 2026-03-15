/**
 * CategoryNavBar — Horizontal icon-based category strip
 *
 * Appears below the main header navigation.
 * Design: Medical Luxury — Maroon primary, Polished Gold accents, ultra-thin 1.2px icons.
 * Mobile: horizontally scrollable, hidden scrollbar.
 * Desktop: centered, evenly spaced.
 */

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { categoryList } from "@/components/brand/CategoryIcons";
import { useLanguage } from "@/contexts/LanguageContext";
import { prefetchRoute } from "@/lib/prefetchRoute";

export function CategoryNavBar({ className }: { className?: string }) {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const activeCat = params.get("category") ?? (pathname === "/mom-baby" ? "mom-baby" : null);

  return (
    <nav
      aria-label={isAr ? "تصفح حسب الفئة" : "Browse by category"}
      className={cn(
        "w-full bg-background border-b border-polished-gold/15",
        className,
      )}
    >
      <ul
        className={cn(
          "flex items-center gap-0 overflow-x-auto scrollbar-hide",
          "md:justify-center md:overflow-visible",
          "px-4 md:px-0",
        )}
        role="list"
      >
        {categoryList.map(({ key, label, labelAr, Icon, href }) => {
          const isActive = activeCat === key;
          return (
            <li key={key} className="shrink-0">
              <Link
                to={href}
                onMouseEnter={() => prefetchRoute(href)}
                onFocus={() => prefetchRoute(href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex flex-col items-center gap-1.5 px-4 py-3 transition-all duration-200",
                  "border-b-2 border-transparent",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-polished-gold focus-visible:ring-offset-1",
                  isActive
                    ? "border-polished-gold text-burgundy"
                    : "text-muted-foreground hover:text-burgundy hover:border-polished-gold/40",
                )}
              >
                <Icon
                  size={28}
                  goldAccent
                  className={cn(
                    "transition-transform duration-200 group-hover:-translate-y-0.5",
                    isActive ? "text-burgundy" : "text-muted-foreground group-hover:text-burgundy",
                  )}
                />
                <span className="font-body text-[10px] uppercase tracking-wider whitespace-nowrap">
                  {isAr ? labelAr : label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
