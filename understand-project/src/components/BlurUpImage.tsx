import { ImgHTMLAttributes, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BlurUpImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  /** Full-resolution image URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional low-quality placeholder (will auto-generate if not provided) */
  placeholderSrc?: string;
  /** Additional class names */
  className?: string;
  /** Container class names */
  containerClassName?: string;
  /** Blur amount in pixels (default: 20) */
  blurAmount?: number;
  /** Transition duration in ms (default: 500) */
  transitionDuration?: number;
}

/**
 * Progressive blur-up image loading component
 * Shows a blurred placeholder that smoothly transitions to the full image
 */
export const BlurUpImage = ({
  src,
  alt,
  placeholderSrc,
  className = "",
  containerClassName = "",
  blurAmount = 20,
  transitionDuration = 500,
  ...props
}: BlurUpImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  // Generate a tiny placeholder URL for Shopify CDN images
  const getPlaceholder = useCallback((url: string): string => {
    if (placeholderSrc) return placeholderSrc;

    // For Shopify CDN, request a tiny version
    if (url?.includes("cdn.shopify.com")) {
      try {
        const urlObj = new URL(url);
        urlObj.searchParams.set("width", "20");
        urlObj.searchParams.set("height", "20");
        return urlObj.toString();
      } catch {
        return url;
      }
    }

    // Return original for non-Shopify images
    return url;
  }, [placeholderSrc]);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(true); // Show whatever we have
  }, []);

  if (!currentSrc) return null;

  const placeholder = getPlaceholder(currentSrc);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Blurred placeholder layer */}
      <div
        className={cn(
          "absolute inset-0 w-full h-full",
          "transition-opacity",
          isLoaded ? "opacity-0" : "opacity-100",
        )}
        style={{
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className={cn(
            "w-full h-full object-cover scale-110",
            className,
          )}
          style={{
            filter: `blur(${blurAmount}px)`,
            transform: "scale(1.1)", // Prevent blur edges from showing
          }}
        />
        {/* Subtle shimmer overlay during load */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
          style={{
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Full resolution image */}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity",
          isLoaded && !isError ? "opacity-100" : "opacity-0",
          className,
        )}
        style={{
          transitionDuration: `${transitionDuration}ms`,
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default BlurUpImage;

