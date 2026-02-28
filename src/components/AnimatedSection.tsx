import { ReactNode, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?:
    | "fade-up"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "fade"
    | "zoom"
    | "blur"
    | "slide-up";
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const AnimatedSection = ({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.1,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  // Assign ref to container
  const setRef = (node: HTMLDivElement | null) => {
    (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  const animationClasses = {
    "fade-up": "translate-y-12 opacity-0",
    "fade-left": "-translate-x-12 opacity-0",
    "fade-right": "translate-x-12 opacity-0",
    "scale": "scale-90 opacity-0",
    "fade": "opacity-0",
    "zoom": "scale-75 opacity-0 blur-sm",
    "blur": "opacity-0 blur-md",
    "slide-up": "translate-y-20 opacity-0 scale-95",
  };

  const visibleClasses =
    "translate-y-0 translate-x-0 scale-100 opacity-100 blur-0";

  return (
    <div
      ref={setRef}
      className={cn(
        "transition-all ease-out will-change-transform",
        isVisible ? visibleClasses : animationClasses[animation],
        className,
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};
