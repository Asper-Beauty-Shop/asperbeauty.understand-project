import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // --- DESIGN_SYSTEM.md Morning Spa Tokens (HSL via CSS vars) ---
        "asper-stone": {
          DEFAULT: "hsl(var(--asper-stone))",
          light: "hsl(var(--asper-stone-light))",
          dark: "hsl(var(--asper-stone-dark))",
        },
        "rose-clay": {
          DEFAULT: "hsl(var(--rose-clay))",
          light: "hsl(var(--rose-clay-light))",
          dark: "hsl(var(--rose-clay-dark))",
        },
        "polished-gold": "hsl(var(--polished-gold))",
        "polished-white": "hsl(var(--polished-white))",
        "asper-ink": {
          DEFAULT: "hsl(var(--asper-ink))",
          muted: "hsl(var(--asper-ink-muted))",
        },
        // Legacy compat tokens
        maroon: "hsl(var(--burgundy))",
        "soft-ivory": "hsl(var(--asper-stone))",
        "shiny-gold": "hsl(var(--polished-gold))",
        "dark-charcoal": "hsl(var(--asper-ink))",
        // Legacy pharmacy tokens (backward compat)
        asper: {
          merlot: "#4A0404",
          merlotLight: "hsl(var(--burgundy))",
          gold: "hsl(var(--polished-gold))",
          goldLight: "hsl(var(--gold-light))",
          charcoal: "hsl(var(--asper-ink))",
          ivory: "hsl(var(--asper-stone))",
        },
        // --------------------------------------
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Legacy color tokens for backward compatibility
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          glow: "hsl(var(--gold-glow))",
        },
        burgundy: {
          DEFAULT: "hsl(var(--burgundy))",
          light: "hsl(var(--burgundy-light))",
          dark: "hsl(var(--burgundy-dark))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Montserrat", "sans-serif"],
        display: ["Playfair Display", "serif"],
        heading: ["Playfair Display", "serif"],
        body: ["Montserrat", "Inter", "sans-serif"],
        script: ["Great Vibes", "cursive"],
        arabic: ["Tajawal", "sans-serif"],
      },
      backgroundImage: {
        "celestial-gradient": "linear-gradient(to bottom, #4A0404, #2b0202)",
        "gold-shimmer": "linear-gradient(45deg, #D4AF37, #F3E5AB, #D4AF37)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "skeleton-breathe": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "spin-slow": "spin-slow 20s linear infinite",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "skeleton-breathe": "skeleton-breathe 2s ease-in-out infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- tailwind plugin
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
