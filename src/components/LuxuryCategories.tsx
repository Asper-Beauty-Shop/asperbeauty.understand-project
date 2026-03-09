import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CATS = [
  {
    name: "Skin",
    nameAr: "Ø§Ù„Ø¨Ø´Ø±Ø©",
    img:
      "/assets/luxury-asset-25.png",
    href: "/shop?category=Skin%20Care",
  },
  {
    name: "Hair",
    nameAr: "Ø§Ù„Ø´Ø¹Ø±",
    img:
      "/assets/luxury-asset-26.png",
    href: "/shop?category=Hair%20Care",
  },
  {
    name: "Makeup",
    nameAr: "Ø§Ù„Ù…ÙƒÙŠØ§Ø¬",
    img:
      "/assets/luxury-asset-27.png",
    href: "/shop?category=Makeup",
  },
  {
    name: "Fragrance",
    nameAr: "Ø§Ù„Ø¹Ø·ÙˆØ±",
    img:
      "/assets/luxury-asset-28.png",
    href: "/shop?category=Fragrances",
  },
  {
    name: "Body",
    nameAr: "Ø§Ù„Ø¬Ø³Ù…",
    img:
      "/assets/luxury-asset-29.png",
    href: "/shop?category=Body%20Care",
  },
];

export const LuxuryCategories = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="py-16 bg-background overflow-x-auto">
      <div className="container mx-auto px-4 flex justify-between items-center min-w-[600px]">
        {CATS.map((c) => (
          <Link
            key={c.name}
            to={c.href}
            className="group flex flex-col items-center gap-4"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold-300 transition-all p-1">
              <img
                src={c.img}
                className="w-full h-full object-cover rounded-full"
                alt={isAr ? c.nameAr : c.name}
              />
            </div>
            <span className="font-serif text-lg text-foreground italic group-hover:text-gold-500 transition-colors">
              {isAr ? c.nameAr : c.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LuxuryCategories;

