/**
 * Asper Protocol — Medical Luxury error copy.
 * Concierge voice; no "broken robot" tone.
 * Source: Brand Playbook (Empathy First, Senior Concierge escalation, Gold Standard).
 */

export const ASPER_PROTOCOL = {
  /** In-chat / short (e.g. chat bubble, toast). */
  errorShort: {
    en: "I apologize for the delay. 😔 Please share your email so our Senior Team can prioritize your request and contact you directly. Your care is our top priority. 🛡️",
    ar: "أعتذر عن التأخير. 😔 يرجى مشاركة بريدك الإلكتروني حتى يتمكن فريقنا من أولوية طلبك والتواصل معك مباشرة. رعايتك هي أولويتنا. 🛡️",
  },
  /** Full error (e.g. Error Boundary). No email form here; suggest refresh/contact. */
  errorFull: {
    en: "I sincerely apologize for the brief technical interruption. 😔 A Senior Concierge will resolve this immediately. Please refresh the page or contact us if the issue continues. 🛡️",
    ar: "أعتذر بصدق عن الانقطاع التقني الموجز. 😔 سيتولى أحد كبار الموظفين حل هذا فوراً. يرجى تحديث الصفحة أو الاتصال بنا إذا استمرت المشكلة. 🛡️",
  },
  /** Checkout temporarily unavailable (cart). */
  checkoutUnavailable: {
    en: "Checkout is temporarily unavailable. Please try again in a moment or contact our Concierge. 🛡️",
    ar: "الدفع غير متاح مؤقتاً. يرجى المحاولة بعد قليل أو التواصل مع فريقنا. 🛡️",
  },
} as const;
