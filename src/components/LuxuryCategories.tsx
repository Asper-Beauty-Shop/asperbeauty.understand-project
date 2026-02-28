import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CATS = [
  {
    name: "Skin",
    nameAr: "البشرة",
    img:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300",
    href: "/shop?category=Skin%20Care",
  },
  {
    name: "Hair",
    nameAr: "الشعر",
    img:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=300",
    href: "/shop?category=Hair%20Care",
  },
  {
    name: "Makeup",
    nameAr: "المكياج",
    img:
      "https://images.unsplash.com/photo-1522338228045-9b68e7751395?auto=format&fit=crop&w=300",
    href: "/shop?category=Makeup",
  },
  {
    name: "Fragrance",
    nameAr: "العطور",
    img:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300",
    href: "/shop?category=Fragrances",
  },
  {
    name: "Body",
    nameAr: "الجسم",
    img:
      "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=300",
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
