import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const promotions = {
  en: [
    "Complimentary Delivery on orders over 50 JOD",
    "Gifting Service Available",
    "Expert Skincare Consultations â€¢ In-store & Online",
  ],
  ar: [
    "ØªÙˆØµÙŠÙ„ Ù…Ø¬Ø§Ù†ÙŠ Ù„Ù„Ø·Ù„Ø¨Ø§Øª ÙÙˆÙ‚ 50 Ø¯ÙŠÙ†Ø§Ø±",
    "Ø®Ø¯Ù…Ø© Ø§Ù„Ù‡Ø¯Ø§ÙŠØ§ Ù…ØªÙˆÙØ±Ø©",
    "Ø§Ø³ØªØ´Ø§Ø±Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© â€¢ ÙÙŠ Ø§Ù„Ù…ØªØ¬Ø± ÙˆØ£ÙˆÙ†Ù„Ø§ÙŠÙ†",
  ],
};

export const PromotionBar = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = promotions[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="bg-asper-merlot border-b border-asper-gold/20">
      <div className="luxury-container py-2">
        <p
          className={`text-center text-asper-ivory font-body text-xs tracking-wide transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {messages[currentIndex]}
        </p>
      </div>
    </div>
  );
};

export default PromotionBar;

