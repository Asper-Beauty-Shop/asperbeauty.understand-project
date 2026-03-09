import { cn } from "@/lib/utils";

/**
 * Asper Beauty Shop â€” 9 Social Platform Icons
 * Style: Clean SVG, 1.2px stroke
 * Default: Deep Maroon (text-primary) â†’ Hover: Shiny Gold (text-accent) "Midas Touch"
 */

interface SocialLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

function SocialLink({ href, label, children, className }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "group flex items-center justify-center w-9 h-9 rounded-full border border-primary-foreground/20 hover:border-accent/60 transition-all duration-300",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-primary-foreground/60 group-hover:text-accent transition-colors duration-300"
      >
        {children}
      </svg>
    </a>
  );
}

// WhatsApp
const WhatsAppIcon = () => (
  <>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2a10 10 0 0 0-8.535 15.15L2 22l4.985-1.408A10 10 0 1 0 12 2z" />
  </>
);

// Instagram
const InstagramIcon = () => (
  <>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </>
);

// Facebook
const FacebookIcon = () => (
  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
);

// TikTok
const TikTokIcon = () => (
  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
);

// YouTube
const YouTubeIcon = () => (
  <>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </>
);

// Snapchat
const SnapchatIcon = () => (
  <path d="M12 2c-2.5 0-4.5 1.5-5 4-.2 1 0 2.5 0 3.5-1 .5-2 .5-2 1.5s1.5 1 2 1.5c-.5 2-2 3-3.5 3.5.5 1 2 1 3 1 0 .5-.5 1.5 0 2h11c.5-.5 0-1.5 0-2 1 0 2.5 0 3-1-1.5-.5-3-1.5-3.5-3.5.5-.5 2-.5 2-1.5s-1-.5-2-1.5c0-1 .2-2.5 0-3.5-.5-2.5-2.5-4-5-4z" />
);

// LinkedIn
const LinkedInIcon = () => (
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </>
);

// Pinterest
const PinterestIcon = () => (
  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.808-2.425.853 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.282a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
);

// X (Twitter)
const XIcon = () => (
  <path d="M4 4l11.733 16h4.267l-11.733-16zm.324 1.266l10.302 13.988h2.05L6.374 5.266zM17.5 4l-5.5 6M6.5 20l5.5-6" />
);

export const socialLinks = [
  { key: "whatsapp", href: "https://wa.me/962790656666", label: "WhatsApp", Icon: WhatsAppIcon },
  { key: "instagram", href: "https://www.instagram.com/asper.beauty.shop/", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", href: "https://www.facebook.com/AsperBeautyShop", label: "Facebook", Icon: FacebookIcon },
  { key: "tiktok", href: "https://tiktok.com/@asper.beauty.shop", label: "TikTok", Icon: TikTokIcon },
  { key: "youtube", href: "https://youtube.com/@asperbeautyshop", label: "YouTube", Icon: YouTubeIcon },
  { key: "snapchat", href: "https://snapchat.com/add/asperbeautyshop", label: "Snapchat", Icon: SnapchatIcon },
  { key: "linkedin", href: "https://linkedin.com/company/asper-beauty-shop", label: "LinkedIn", Icon: LinkedInIcon },
  { key: "pinterest", href: "https://pinterest.com/asperbeautyshop", label: "Pinterest", Icon: PinterestIcon },
  { key: "x", href: "https://x.com/asperbeautyshop", label: "X (Twitter)", Icon: XIcon },
];

interface SocialIconsRowProps {
  className?: string;
  /** Use "footer" variant for light icons on dark bg, or "page" for dark icons on light bg */
  variant?: "footer" | "page";
}

export default function SocialIconsRow({ className, variant = "footer" }: SocialIconsRowProps) {
  return (
    <div className={cn("flex items-center gap-3 flex-wrap", className)}>
      {socialLinks.map(({ key, href, label, Icon }) => (
        <SocialLink
          key={key}
          href={href}
          label={label}
          className={
            variant === "page"
              ? "border-border hover:border-accent/60 [&_svg]:text-foreground/60 [&_svg]:group-hover:text-accent"
              : undefined
          }
        >
          <Icon />
        </SocialLink>
      ))}
    </div>
  );
}

