/**
 * chat-api.ts — Typed API layer for Asper Beauty AI personas
 *
 * Separates fetch logic from UI components so TanStack Query mutations
 * can be unit-tested and reused across widgets without coupling to Supabase SDK.
 */

import { supabase } from "@/integrations/supabase/client";
import type { PersonaId } from "@/stores/chatStore";

// ── Request / Response Types ──────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** Force a specific persona; otherwise auto-detected by the edge function */
  forcePersona?: PersonaId;
  /** Language code: "en" | "ar" */
  language?: string;
  /** User ID for RAG personalization and rate limiting */
  userId?: string;
}

export interface RecommendedProduct {
  id: string;
  title: string;
  handle: string;
  price?: number;
  image_url?: string;
}

export interface ChatResponse {
  reply: string;
  persona: PersonaId;
  products?: RecommendedProduct[];
}

// ── API Functions ─────────────────────────────────────────────────────────────

/**
 * Send a chat message to the beauty-assistant edge function.
 * Returns a structured ChatResponse or throws on error.
 *
 * Used by: useBeautyChat (TanStack Query useMutation)
 */
export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const { data, error } = await supabase.functions.invoke("beauty-assistant", {
    body: {
      messages: req.messages,
      forcePersona: req.forcePersona,
      language: req.language ?? "en",
    },
  });

  if (error) throw new Error(error.message ?? "beauty-assistant invocation failed");

  return {
    reply: (data?.reply as string) ?? "",
    persona: (data?.persona as PersonaId) ?? "ms_zain",
    products: (data?.products as RecommendedProduct[]) ?? [],
  };
}

/**
 * Send a message to the asper-intelligence edge function (multimodal + TTS).
 * Used by the AsperIntelligence page.
 */
export async function sendIntelligenceChat(params: {
  prompt: string;
  persona: "clinical" | "luxury";
  image?: string | null;
  catalog?: { title: string; price: string }[];
}): Promise<{ reply: string }> {
  const { data, error } = await supabase.functions.invoke("asper-intelligence", {
    body: { action: "chat", ...params },
  });

  if (error) throw new Error(error.message ?? "asper-intelligence invocation failed");

  return { reply: (data?.reply as string) ?? "" };
}
