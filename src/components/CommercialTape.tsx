import { useLanguage } from "@/contexts/LanguageContext";

const advantages = [
  { en: "Curated by Pharmacists: 5,000+ Premium SKUs", ar: "Ø¨Ø¥Ø´Ø±Ø§Ù ØµÙŠØ¯Ù„Ø§Ù†ÙŠ: Ø£ÙƒØ«Ø± Ù…Ù† 5,000 Ù…Ù†ØªØ¬ Ø·Ø¨ÙŠ ÙØ§Ø®Ø±" },
  { en: "The Asper Experience: Same-Day Amman Concierge Delivery", ar: "ØªØ¬Ø±Ø¨Ø© Ø£Ø³Ø¨Ø±: ØªÙˆØµÙŠÙ„ ÙÙŠ Ù†ÙØ³ Ø§Ù„ÙŠÙˆÙ… Ø¯Ø§Ø®Ù„ Ø¹Ù…Ù‘Ø§Ù†" },
  { en: "Gold Standard: 100% Guaranteed Authenticity & JFDA Certified", ar: "Ø§Ù„Ù…Ø¹ÙŠØ§Ø± Ø§Ù„Ø°Ù‡Ø¨ÙŠ: Ø£ØµØ§Ù„Ø© Ù…Ø¶Ù…ÙˆÙ†Ø© 100% ÙˆÙ…Ø¹ØªÙ…Ø¯ Ù…Ù† Ø§Ù„ØºØ°Ø§Ø¡ ÙˆØ§Ù„Ø¯ÙˆØ§Ø¡" },
  { en: "Cruelty-Free, Ethical & Dermatologist Tested", ar: "Ø®Ø§Ù„Ù Ù…Ù† Ø§Ù„Ù‚Ø³ÙˆØ©ØŒ Ø£Ø®Ù„Ø§Ù‚ÙŠ ÙˆÙ…Ø®ØªØ¨Ø± Ù…Ù† Ø£Ø·Ø¨Ø§Ø¡ Ø¬Ù„Ø¯ÙŠØ©" },
  { en: "Powered by Intelligence: Discover the 3-Click AI Regimen", ar: "Ù…Ø¯Ø¹ÙˆÙ… Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ: Ø§ÙƒØªØ´ÙÙŠ Ø±ÙˆØªÙŠÙ†Ùƒ Ø¨Ù€3 Ù†Ù‚Ø±Ø§Øª" },
];

const CommercialTape = () => {
  const { language } = useLanguage();
  const locale = language;

  const items = [...advantages, ...advantages];

  return (
    <div
      className="commercial-tape relative w-full overflow-hidden bg-primary h-10 flex items-center z-[60]"
      role="marquee"
      aria-label={locale === "ar" ? "Ù…Ø²Ø§ÙŠØ§ Ø£Ø³Ø¨Ø± Ø¨ÙŠÙˆØªÙŠ Ø´ÙˆØ¨" : "Asper Beauty Shop advantages"}
    >
      <div className="commercial-tape-track flex items-center whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-body text-sm font-medium text-primary-foreground px-4 select-none">
              {locale === "ar" ? item.ar : item.en}
            </span>
            <span
              className="text-accent text-xs select-none"
              aria-hidden="true"
            >
              âœ¦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommercialTape;

