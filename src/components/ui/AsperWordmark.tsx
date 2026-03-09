import { cn } from "@/lib/utils";

interface AsperWordmarkProps {
  /** Override text color â€” defaults to burgundy */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * Unified "ASPER" wordmark with gold foil underline.
 * Playfair Display Â· Deep Maroon Â· 1px Shiny Gold accent line with Midas Touch hover.
 */
export function AsperWordmark({ className, size = "md" }: AsperWordmarkProps) {
  const sizeClasses = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl md:text-4xl",
    lg: "text-3xl sm:text-4xl md:text-5xl",
  };

  return (
    <span
      className={cn(
        "relative inline-block pb-1 font-display font-bold tracking-[0.15em] uppercase",
        "after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-0 after:left-0",
        "after:bg-polished-gold after:scale-x-0 hover:after:scale-x-100",
        "after:origin-bottom-right hover:after:origin-bottom-left",
        "after:transition-transform after:duration-[400ms] after:ease-luxury",
        "transition-colors duration-[400ms]",
        sizeClasses[size],
        className
      )}
    >
      Asper
    </span>
  );
}
