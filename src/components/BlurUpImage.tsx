import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BlurUpImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Progressive "Blur-Up" image loader.
 * Shows a blurred tiny version (CSS blur on the same src with low quality)
 * then fades in the high-res image over 0.5s.
 */
export function BlurUpImage({ src, alt, className, containerClassName }: BlurUpImageProps) {
  const [loaded, setLoaded] = useState(false);

  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Blurred placeholder — same src but CSS-blurred until high-res loads */}
      <img
        src={src}
        alt=""
        aria-hidden
        className={cn(
          "absolute inset-0 h-full w-full object-contain scale-110 blur-xl transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
          className
        )}
        loading="eager"
        decoding="async"
        // Use a tiny version if CDN supports it, otherwise CSS blur handles it
        style={{ imageRendering: "pixelated" }}
      />
      {/* High-res image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "relative h-full w-full object-contain transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        loading="lazy"
        decoding="async"
        onLoad={onLoad}
      />
    </div>
  );
}
