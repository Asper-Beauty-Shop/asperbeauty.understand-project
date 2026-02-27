type Locale = "en" | "ar";

export function getLocalizedCategory(category: string | null, locale: Locale): string {
  if (!category) return locale === "ar" ? "عام" : "General";
  return category;
}

export function getLocalizedDescription(description: string | null | undefined, locale: Locale, maxLength = 300): string {
  if (!description) return "";
  return description.length > maxLength ? description.slice(0, maxLength) + "…" : description;
}

export function translateTitle(title: string, _locale: Locale): string {
  return title;
}
