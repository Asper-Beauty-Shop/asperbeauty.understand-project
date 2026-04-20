/**
 * Asper Beauty - 3-Click Funnel Tracking
 * Purpose: Identify drop-off points in the "Morning Spa" consultation for the 24-Hour Clinical Audit and Customer Success Report.
 */

export type QuizStep =
  | "START_QUIZ"
  | "SELECT_CONCERN"
  | "SELECT_SKIN_TYPE"
  | "VIEW_PRESCRIPTION"
  | "ADD_TO_CART";

export function trackQuizFunnel(
  step: QuizStep,
  data?: Record<string, unknown>,
): void {
  // Log to console for 24-Hour Clinical Audit verification
  if (import.meta.env.DEV) {
    console.log(`[ASPER_ANALYTICS] Step: ${step}`, data ?? {});
  }

  // Send to your backend/Supabase for the Customer Success Report when ready:
  // e.g. supabase.from('quiz_funnel_events').insert({
  //   step,
  //   metadata: data ?? {},
  //   timestamp: new Date().toISOString(),
  // });
}
