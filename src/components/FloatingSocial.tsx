import { cn } from "@/lib/utils";
import { socialLinks } from "@/components/brand/SocialLinks";

/**
 * Floating Social Sidebar â€” Desktop only
 * Shows Instagram, WhatsApp, Facebook for quick access
 * Deep Maroon default â†’ Shiny Gold hover ("Midas Touch")
 */
const floatingLinks = socialLinks.filter(l =>
  ["whatsapp", "instagram", "facebook"].includes(l.key)
);

export default function FloatingSocial() {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {floatingLinks.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card/80 backdrop-blur-sm hover:border-accent/60 hover:shadow-[0_0_12px_hsl(43_69%_46%/0.2)] transition-all duration-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4.5 h-4.5 text-primary group-hover:text-accent transition-colors duration-300"
          >
            <Icon />
          </svg>
        </a>
      ))}
    </div>
  );
}

