import { ImgHTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ImageSkeleton } from "./ProductCardSkeleton";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

export const LazyImage = ({
  src,
  alt,
  className,
  skeletonClassName,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton placeholder */}
      {!isLoaded && !isError && (
        <ImageSkeleton
          className={cn("absolute inset-0 w-full h-full", skeletonClassName)}
        />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        {...props}
      />
    </div>
  );
};
