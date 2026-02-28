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

        // --- YOUR CUSTOM ASPER BRAND COLORS ---
        asper: {
          merlot: "#4A0404", // Deepest Burgundy (Main Backgrounds)
          merlotLight: "#800020", // Lighter Maroon (Secondary/Gradients)
          gold: "#D4AF37", // Metallic Gold (Primary Accents/Text)
          goldLight: "#F3E5AB", // Champagne (Highlights/Hover states)
          charcoal: "#1A1A1A", // Dark Text for light areas
          ivory: "#F9F7F2", // Off-white for text on dark backgrounds
        },
        // Premium Pharmacy palette (verified science / trusted pharmacy)
        maroon: "#800020", // Primary brand
        "soft-ivory": "#F8F8FF", // Global background
        "shiny-gold": "#C5A028", // Trust/accent (not bling)
        "dark-charcoal": "#333333", // High readability text
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
        // Defines your luxury font stack
        serif: ["Playfair Display", "serif"],
        sans: ["Montserrat", "sans-serif"],
        display: ["Playfair Display", "serif"],
        body: ["Montserrat", "Inter", "sans-serif"],
        script: ["Great Vibes", "cursive"],
        arabic: ["Tajawal", "sans-serif"], // RTL / Arabic
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "spin-slow": "spin-slow 20s linear infinite",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- tailwind plugin
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
