import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation with schema.org BreadcrumbList markup.
 * Usage: <Breadcrumb items={[{label:"Home",href:"/"},{label:"Dermocosmetics",href:"/dermocosmetics"},{label:"Eucerin"}]} />
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap", className)}
    >
      <ol
        className="flex items-center gap-1.5 flex-wrap"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1" itemProp="item">
            <Home className="h-3 w-3" />
            <span itemProp="name" className="sr-only">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        {items.map((item, idx) => (
          <li
            key={item.label}
            className="flex items-center gap-1.5"
            itemScope
            itemType="https://schema.org/ListItem"
            itemProp="itemListElement"
          >
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" aria-hidden />
            {item.href && idx < items.length - 1 ? (
              <Link to={item.href} className="hover:text-primary transition-colors" itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-foreground font-medium" itemProp="name">{item.label}</span>
            )}
            <meta itemProp="position" content={String(idx + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
