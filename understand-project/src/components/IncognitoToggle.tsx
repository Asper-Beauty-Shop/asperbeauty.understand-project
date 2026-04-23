import { EyeOff, Eye } from "lucide-react";
import { useIncognitoStore } from "@/stores/incognitoStore";
import { cn } from "@/lib/utils";

/**
 * Incognito Mode toggle — placed in footer or nav.
 * When active, adds a global CSS class that blurs product images
 * and anonymizes sensitive product names.
 */
export function IncognitoToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useIncognitoStore();

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-body transition-colors rounded-full px-3 py-1.5 border",
        enabled
          ? "bg-primary/10 text-primary border-primary/30"
          : "text-muted-foreground border-border hover:text-foreground hover:border-foreground/30",
        className
      )}
      title={enabled ? "Disable private browsing" : "Enable private browsing — blurs images for discretion"}
    >
      {enabled ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      <span>{enabled ? "Private Mode" : "Private"}</span>
    </button>
  );
}

