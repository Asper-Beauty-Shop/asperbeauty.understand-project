/**
 * Asper Beauty Shop — Isolated Chat State Store
 *
 * Zustand + persist middleware providing:
 *  - Strict persona isolation (dr_sami | ms_zain)
 *  - Per-persona conversation history that survives page reloads
 *  - Type-level guardrails: PersonaId union prevents routing to ghost agents
 *
 * DESIGN DECISIONS
 *  - sessions: Record<PersonaId, PersistedMessage[]> — physically separate
 *    arrays so the backend RAG pipeline can never cross-contaminate histories.
 *  - partialize excludes isOpen/isTyping — UI transient state is not restored
 *    on reload (avoids locked spinner or invisible modal on cold boot).
 *  - content is stored as plain string only; base64 images and streaming
 *    partial chunks remain in AIConcierge local state and are never written
 *    here (prevents localStorage quota exhaustion).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ── Persona Identity ──────────────────────────────────────────────────────────

/**
 * Exact literal union of valid persona IDs.
 * Any component trying to route to a non-existent persona gets a TS build error.
 */
export type PersonaId = "dr_sami" | "ms_zain" | "dr_rose";

export const PERSONAS: PersonaId[] = ["dr_sami", "ms_zain", "dr_rose"];

// ── Message Types ─────────────────────────────────────────────────────────────

/**
 * A persisted message — content is always plain text.
 * Multimodal (image) messages are handled by AIConcierge local state only.
 */
export interface PersistedMessage {
  id: string;
  role: "user" | "assistant";
  /** Plain text only — images are intentionally excluded from persistence */
  content: string;
  timestamp: number;
  /** Which persona produced this reply (populated on assistant messages) */
  persona?: PersonaId;
  /** Product handles surfaced in this response, for cart integration */
  recommendedProducts?: string[];
}

// ── Store Shape ───────────────────────────────────────────────────────────────

interface ChatState {
  // ── State ──
  activePersona: PersonaId;
  /**
   * Isolated session histories.
   * Access as: sessions[personaId] — never merge these arrays.
   */
  sessions: Record<PersonaId, PersistedMessage[]>;
  isTyping: boolean;
  isOpen: boolean;

  // ── Actions ──
  setActivePersona: (id: PersonaId) => void;
  addMessage: (personaId: PersonaId, message: PersistedMessage) => void;
  /** Replace the last assistant message (for streaming finalization) */
  finalizeLastAssistantMessage: (
    personaId: PersonaId,
    content: string,
    recommendedProducts?: string[]
  ) => void;
  clearSession: (personaId: PersonaId) => void;
  clearAllSessions: () => void;
  setTyping: (status: boolean) => void;
  toggleChat: (status?: boolean) => void;
}

// ── Initial State ─────────────────────────────────────────────────────────────

const emptySessions: Record<PersonaId, PersistedMessage[]> = {
  dr_sami: [],
  ms_zain: [],
  dr_rose: [],
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      activePersona: "ms_zain",
      sessions: emptySessions,
      isTyping: false,
      isOpen: false,

      setActivePersona: (id) => set({ activePersona: id }),

      addMessage: (personaId, message) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [personaId]: [...state.sessions[personaId], message],
          },
        })),

      finalizeLastAssistantMessage: (personaId, content, recommendedProducts) =>
        set((state) => {
          const msgs = state.sessions[personaId];
          const lastIdx = msgs.length - 1;
          if (lastIdx < 0 || msgs[lastIdx].role !== "assistant") return state;
          const updated = [...msgs];
          updated[lastIdx] = { ...updated[lastIdx], content, recommendedProducts };
          return { sessions: { ...state.sessions, [personaId]: updated } };
        }),

      clearSession: (personaId) =>
        set((state) => ({
          sessions: { ...state.sessions, [personaId]: [] },
        })),

      clearAllSessions: () => set({ sessions: { ...emptySessions } }),

      setTyping: (status) => set({ isTyping: status }),

      toggleChat: (status) =>
        set((state) => ({ isOpen: status ?? !state.isOpen })),
    }),
    {
      name: "asper-beauty-chat-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the chat histories — never the transient UI state
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Returns the persisted message history for a specific persona */
export const selectPersonaHistory = (
  state: ChatState,
  personaId: PersonaId
): PersistedMessage[] => state.sessions[personaId];

/** Generates a stable message ID */
export const newMessageId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
