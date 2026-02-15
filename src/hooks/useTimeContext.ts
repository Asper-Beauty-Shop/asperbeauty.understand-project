import { useMemo } from "react";

export type TimeOfDay = "morning" | "afternoon" | "evening";

interface TimeContext {
  timeOfDay: TimeOfDay;
  greeting: string;
  tagline: string;
  featuredQuery: string;
  moodClass: string;
}

/**
 * Returns context-aware data based on the user's local time.
 * Morning (5–11): Bright, protection-focused
 * Afternoon (12–18): Balanced, general
 * Evening (19–4): Moody, repair-focused
 */
export function useTimeContext(): TimeContext {
  return useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        timeOfDay: "morning",
        greeting: "Good Morning. Protect your skin today.",
        tagline: "Start your day with clinical protection.",
        featuredQuery: "sunscreen OR vitamin C OR day cream",
        moodClass: "hero-morning",
      };
    }

    if (hour >= 12 && hour < 19) {
      return {
        timeOfDay: "afternoon",
        greeting: "Good Afternoon. Refresh & Renew.",
        tagline: "Midday glow — hydrate and protect.",
        featuredQuery: "moisturizer OR hydration OR mist",
        moodClass: "hero-afternoon",
      };
    }

    // 19:00 – 04:59
    return {
      timeOfDay: "evening",
      greeting: "Good Evening. Time to repair.",
      tagline: "Let your skin recover while you rest.",
      featuredQuery: "retinol OR night mask OR serum",
      moodClass: "hero-evening",
    };
  }, []);
}
