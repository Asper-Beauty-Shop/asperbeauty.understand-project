import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const promotions = {
  en: [
    "Complimentary Delivery on orders over 50 JOD",
    "Gifting Service Available",
    "Expert Skincare Consultations • In-store & Online",
  ],
  ar: [
    "توصيل مجاني للطلبات فوق 50 دينار",
    "خدمة الهدايا متوفرة",
    "استشارات العناية بالبشرة • في المتجر وأونلاين",
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
