import { useEffect } from "react";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Asper Beauty Shop",
  url: "https://www.asperbeautyshop.com",
  logo: "https://www.asperbeautyshop.com/favicon.png",
  description:
    "Shop 4,000+ dermocosmetic and clinical skincare products from Eucerin, La Roche-Posay, CeraVe, Bioderma, Vichy and more. Free delivery in Amman.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+962-79-065-6666",
    contactType: "customer service",
    areaServed: "JO",
    availableLanguage: ["en", "ar"],
  },
  sameAs: [
    "https://wa.me/962790656666",
    "https://www.instagram.com/asper.beauty.shop/",
    "https://www.facebook.com/AsperBeautyShop",
    "https://tiktok.com/@asper.beauty.shop",
    "https://youtube.com/@asperbeautyshop",
    "https://snapchat.com/add/asperbeautyshop",
    "https://linkedin.com/company/asper-beauty-shop",
    "https://pinterest.com/asperbeautyshop",
    "https://x.com/asperbeautyshop",
  ],
};

const SCRIPT_ID = "org-jsonld";

export function OrganizationSchema() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(SCHEMA);
    document.head.appendChild(script);
    return () => {
      document.getElementById(SCRIPT_ID)?.remove();
    };
  }, []);
  return null;
}
