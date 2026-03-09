export const getPlaceholderImage = (category: string, title: string): string => {
  return "/editorial-showcase-2.jpg";
};

export const getProductImage = (imageUrl: string | null | undefined, category?: string, title?: string): string => {
  if (imageUrl && imageUrl !== "" && imageUrl !== "null") return imageUrl;
  return "/editorial-showcase-2.jpg";
};

export const formatJOD = (val: number): string => {
  return val.toFixed(3) + " JD";
};

export const formatPriceJOD = (p: number): string => {
  return p.toFixed(2) + " JOD";
};