/**
 * Helper to generate Shopify CDN image URLs with size + WebP optimization
 */
export const getOptimizedShopifyImageUrl = (
  url: string,
  width: number,
  height?: number,
  format: "webp" | "jpg" | "png" = "webp",
): string => {
  if (!url || !url.includes("cdn.shopify.com")) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("width", width.toString());
    if (height) {
      urlObj.searchParams.set("height", height.toString());
    }
    urlObj.searchParams.set("crop", "center");
    urlObj.searchParams.set("format", format);
    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * Generate srcset for responsive images (WebP)
 */
export const getShopifyImageSrcSet = (
  url: string,
  sizes: number[],
  format: "webp" | "jpg" | "png" = "webp",
): string => {
  if (!url || !url.includes("cdn.shopify.com")) {
    return "";
  }

  return sizes
    .map((size) => `${getOptimizedShopifyImageUrl(url, size, undefined, format)} ${size}w`)
    .join(", ");
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  isShopify?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  loading = "lazy",
  fetchPriority = "auto",
  isShopify = true,
}: OptimizedImageProps) => {
  const isShopifyUrl = src?.includes("cdn.shopify.com");

  if (isShopify && isShopifyUrl) {
    const webpSrcSet = getShopifyImageSrcSet(src, [200, 400, 600, 800, 1200], "webp");
    const fallbackSrcSet = getShopifyImageSrcSet(src, [200, 400, 600, 800, 1200], "jpg");
    const optimizedSrc = width
      ? getOptimizedShopifyImageUrl(src, width, height, "webp")
      : getOptimizedShopifyImageUrl(src, 400, undefined, "webp");

    return (
      <picture>
        <source type="image/webp" srcSet={webpSrcSet || undefined} sizes={sizes} />
        <img
          src={optimizedSrc}
          srcSet={fallbackSrcSet || undefined}
          sizes={fallbackSrcSet ? sizes : undefined}
          alt={alt}
          className={className}
          loading={loading}
          fetchPriority={fetchPriority}
          width={width}
          height={height}
          decoding="async"
        />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      width={width}
      height={height}
      decoding="async"
    />
  );
};
