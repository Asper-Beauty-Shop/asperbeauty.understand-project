export function formatJOD(price: number): string {
  return `${price.toFixed(2)} JOD`;
}

export function getProductImage(imageUrl: string | null, _category?: string, _title?: string): string {
  return imageUrl || "/placeholder.svg";
}

export const CATEGORY_FILTER_TO_DB: Record<string, string[]> = {
  "skin-care": ["Skin Care", "Skincare", "skincare"],
  "makeup": ["Makeup", "Make Up", "makeup"],
  "hair-care": ["Hair Care", "Haircare", "hair care"],
  "fragrance": ["Fragrance", "Fragrances", "fragrance"],
  "body-care": ["Body Care", "Body", "body care"],
  "tools-devices": ["Tools", "Devices", "tools"],
};
