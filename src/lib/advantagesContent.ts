/**
 * Single source of truth for "Our Advantages" / "Why shop with us".
 * Used on: Home (TrustBanner), docs (ADVANTAGES_AND_PLATFORMS.md), README.
 * Keep in sync across website and all platforms.
 */
export const ADVANTAGES = [
  {
    id: "authentic",
    iconKey: "shield",
    title: "Guaranteed Authentic",
    titleAr: "Ø£ØµØ§Ù„Ø© Ù…Ø¶Ù…ÙˆÙ†Ø©",
    description: "We compete against fakes",
    descriptionAr: "Ù†Ø­Ø§Ø±Ø¨ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù…Ù‚Ù„Ø¯Ø©",
  },
  {
    id: "pharmacist",
    iconKey: "stethoscope",
    title: "Pharmacist Verified",
    titleAr: "Ù…Ø¹ØªÙ…Ø¯ Ù…Ù† Ø§Ù„ØµÙŠØ¯Ù„ÙŠ",
    description: "We are experts",
    descriptionAr: "Ø®Ø¨Ø±Ø§Ø¡ Ù…ØªØ®ØµØµÙˆÙ†",
  },
  {
    id: "delivery",
    iconKey: "truck",
    title: "Amman Concierge Delivery",
    titleAr: "ØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹ ÙÙŠ Ø¹Ù…Ù‘Ø§Ù†",
    description: "We are fast",
    descriptionAr: "Ø³Ø±Ø¹Ø© ÙØ§Ø¦Ù‚Ø©",
  },
] as const;

export type AdvantageId = (typeof ADVANTAGES)[number]["id"];
