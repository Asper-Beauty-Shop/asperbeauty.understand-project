import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IncognitoStore {
  enabled: boolean;
  toggle: () => void;
}

/**
 * Incognito Mode â€” blurs product images and anonymizes names
 * for sensitive browsing (hair loss, acne, fungal, etc).
 * Persists across sessions via localStorage.
 */
export const useIncognitoStore = create<IncognitoStore>()(
  persist(
    (set, get) => ({
      enabled: false,
      toggle: () => set({ enabled: !get().enabled }),
    }),
    {
      name: "asper-incognito",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
