/**
 * Concierge analytics: Top Skin Concern + Prescription Conversion.
 * Sends events to Supabase Edge Function log-concierge-events.
 */

const LOG_CONCIERGE_EVENTS_URL =
  `${import.meta.env.VITE_SUPABASE_URL || "https://vhgwvfedgfmcixhdyttt.supabase.co"}/functions/v1/log-concierge-events`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function postEvent(payload: Record<string, unknown>): void {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "apikey": ANON_KEY,
    "Authorization": `Bearer ${ANON_KEY}`,
  };
  fetch(LOG_CONCIERGE_EVENTS_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  }).catch(() => {});
}

/** Top Skin Concern: log when user selects a skin concern. */
export function logSkinConcernClick(
  concernId: string,
  concernSlug?: string,
): void {
  postEvent({ concern_id: concernId, concern_slug: concernSlug ?? concernId });
}

/** Prescription Conversion: log when user adds to cart from Quick View / prescription CTA. */
export function logPrescriptionAddToCart(
  productId: string,
  source: "quick_view" | "prescription_cta" = "quick_view",
): void {
  postEvent({
    event: "add_to_cart_from_prescription",
    product_id: productId,
    source,
  });
}
