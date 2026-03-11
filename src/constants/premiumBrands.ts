/**
 * Premium brand tiers for homepage curation.
 * Only these brands appear in homepage modules.
 * Mass-market brands are accessible via search & AI concierge only.
 */

export const CLINICAL_AUTHORITY_BRANDS = [
  "La Roche-Posay",
  "Vichy",
  "Eucerin",
  "Bioderma",
  "Sesderma",
  "CeraVe",
  "COSRX",
] as const;

export const AESTHETIC_LUXURY_BRANDS = [
  "Kérastase",
  "Guerlain",
  "Giorgio Armani",
  "Augustinus Bader",
  "YSL",
] as const;

export const HOMEPAGE_ALLOWED_BRANDS = [
  ...CLINICAL_AUTHORITY_BRANDS,
  ...AESTHETIC_LUXURY_BRANDS,
] as const;

/** Check if a brand is allowed on the homepage */
export function isHomepageBrand(brand: string | null | undefined): boolean {
  if (!brand) return false;
  const normalized = brand.trim().toLowerCase();
  return HOMEPAGE_ALLOWED_BRANDS.some(
    (b) => b.toLowerCase() === normalized
  );
}
