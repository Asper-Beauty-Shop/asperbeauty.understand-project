import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { IncognitoToggle } from "@/components/IncognitoToggle";
import TrustBadges from "@/components/brand/TrustBadges";
import SocialIconsRow from "@/components/brand/SocialLinks";
import asperLogo from "@/assets/asper-lotus-logo.png";
import asperSeal from "@/assets/asper-wax-seal.jfif";

export const Footer = () => {
  const { t, locale } = useLanguage();

  return (
    <footer className="py-16 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={asperLogo} alt="Asper" className="h-8 w-auto brightness-0 invert opacity-90" />
              <span className="text-xs font-body uppercase tracking-[0.25em] text-primary-foreground/70">Beauty Shop</span>
            </div>
            <p className={`text-sm text-primary-foreground/70 leading-relaxed ${locale === "ar" ? "font-arabic" : "font-body"}`}>
              {t("footer.tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary-foreground/90">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">Shop All</Link>
              <Link to="/shop" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">Browse Catalog</Link>
              <Link to="/intelligence" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">AI Intelligence</Link>
              <Link to="/brand" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">Our Story</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary-foreground/90">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/962790656666" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">
                WhatsApp: +962 79 065 6666
              </a>
              <a href="https://instagram.com/asper.beauty.shop" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">
                @asper.beauty.shop
              </a>
              <IncognitoToggle className="mt-1 border-primary-foreground/20 text-primary-foreground/60 hover:text-primary-foreground hover:border-primary-foreground/40" />
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mb-6">
          <h4 className="font-heading text-xs font-semibold mb-3 text-primary-foreground/70 uppercase tracking-[0.2em]">Follow Us</h4>
          <SocialIconsRow variant="footer" />
        </div>

        {/* Trust Badges */}
        <div className="mb-8">
          <TrustBadges />
        </div>

        <div className="h-px bg-primary-foreground/10" />
        <div className="flex items-center justify-between mt-6">
          <p className={`text-xs text-primary-foreground/50 ${locale === "ar" ? "font-arabic" : "font-body"}`}>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          {/* Gold Authenticity Seal */}
          <div className="gold-seal-rotate cursor-pointer" title="Guaranteed Authentic">
            <img src={asperSeal} alt="Asper Authenticity Seal" className="h-10 w-10 rounded-full object-cover" />
          </div>
        </div>
      </div>
    </footer>
  );
};
