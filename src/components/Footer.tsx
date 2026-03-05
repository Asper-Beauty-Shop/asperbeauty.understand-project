import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import asperLogo from "@/assets/asper-logo.jpg";

// Brand-accurate social media icon components
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
  </svg>
);

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState("");
  const {
    language,
  } = useLanguage();
  const isArabic = language === "ar";
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
  };
  const conciergLinks = [{
    name: isArabic ? "تتبع الطلب" : "Track Order",
    href: "/track-order",
  }, {
    name: isArabic ? "سياسة الشحن" : "Shipping Policy",
    href: "/contact",
  }, {
    name: isArabic ? "الإرجاع والاستبدال" : "Returns & Exchanges",
    href: "/contact",
  }, {
    name: isArabic ? "استشارة البشرة" : "Skin Consultation",
    href: "/skin-concerns",
  }];

  const aboutLinks = [{
    name: isArabic ? "فلسفتنا" : "Our Philosophy",
    href: "/philosophy",
  }, {
    name: isArabic ? "اتصل بنا" : "Contact Us",
    href: "/contact",
  }];
  return (
    <footer
      className="bg-burgundy"
      style={{
        borderTop: "1px solid hsl(var(--gold))",
      }}
    >
      {/* Main Footer Content */}
      <div className="luxury-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 - Brand Identity */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img
                src={asperLogo}
                alt="Asper Beauty Shop"
                className="h-16 rounded"
              />
            </Link>
            <p className="font-body text-cream mb-6">
              {isArabic
                ? "إعادة تعريف الجمال في الأردن."
                : "Redefining Beauty in Jordan."}
            </p>

            {/* Social Icons - Gold Outlines with Full Platform Coverage */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://www.instagram.com/asper.beauty.shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/robu.sweileh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@asper.beauty.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/962790656666"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/asperbeautyshop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="X (Twitter)"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@asperbeautyshop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/asper-beauty-shop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.snapchat.com/add/asperbeautyshop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="Snapchat"
              >
                <SnapchatIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.pinterest.com/asperbeautyshop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold hover:bg-[#C5A028] hover:border-[#C5A028] hover:text-[#800020] transition-all duration-400"
                aria-label="Pinterest"
              >
                <PinterestIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 - Concierge */}
          <div>
            <h3 className="font-display text-lg text-white mb-6">
              {isArabic ? "خدمة العملاء" : "Concierge"}
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-beauty-assistant"))}
                  className="font-body text-sm text-cream hover:text-gold transition-colors duration-400 text-left"
                >
                  {isArabic ? "استشارة رقمية • اسأل الصيدلي" : "Digital Consult • Ask the Pharmacist"}
                </button>
              </li>
              {conciergLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="font-body text-sm text-cream hover:text-gold transition-colors duration-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - About */}
          <div>
            <h3 className="font-display text-lg text-white mb-6">
              {isArabic ? "عن آسبر" : "About Asper"}
            </h3>
            <ul className="space-y-3 mb-8">
              {aboutLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="font-body text-sm text-cream hover:text-gold transition-colors duration-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-display text-sm text-white mb-3">
              {isArabic ? "زورونا" : "Visit Us"}
            </h4>
            <div className="space-y-2">
              <p className="font-body text-sm text-cream">
                {isArabic ? "عمّان، الأردن" : "Amman, Jordan"}
              </p>
              <a
                href="tel:+962790656666"
                className="font-body text-sm text-cream hover:text-gold transition-colors duration-400 block"
              >
                +962 79 065 6666
              </a>
              <a
                href="mailto:asperpharma@gmail.com"
                className="font-body text-sm text-cream hover:text-gold transition-colors duration-400 block"
              >
                asperpharma@gmail.com
              </a>
            </div>
          </div>

          {/* Column 4 - VIP Club */}
          <div>
            <h3 className="font-display text-lg text-white mb-6">
              {isArabic ? "اكتشف الحصريات" : "Unlock Exclusives"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isArabic ? "بريدك الإلكتروني" : "Your email"}
                className="w-full px-4 py-3 bg-transparent border border-white text-white font-body text-sm placeholder:text-white/50 focus:outline-none focus:border-gold transition-colors duration-400 rounded"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gold text-burgundy font-display text-sm tracking-wider hover:bg-gold-light transition-colors duration-400 rounded"
              >
                {isArabic ? "اشترك" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gold/30">
        <div className="luxury-container py-6">
          <p className="font-body text-xs text-cream/50 text-center">
            © 2026 Asper Beauty Shop.{" "}
            {isArabic ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
};
