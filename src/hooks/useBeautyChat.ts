/**
 * useBeautyChat — TanStack Query useMutation hook for the beauty-assistant edge function.
 *
 * Provides:
 *  - Stable loading / error / idle states (no manual isLoading booleans)
 *  - Automatic retry with exponential backoff (disabled on 4xx errors)
 *  - Error normalization into user-facing toast messages
 *  - Typed request / response via chat-api.ts
 *
 * Usage:
 *   const { mutate: sendMessage, isPending, isError } = useBeautyChat({
 *     onSuccess: (data) => { ... },
 *   });
 *   sendMessage({ messages, language });
 */

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendChatMessage, type ChatRequest, type ChatResponse } from "@/lib/chat-api";
import { useLanguage } from "@/contexts/LanguageContext";

const ERROR_MESSAGES = {
  en: "Our AI concierge is momentarily unavailable. Please try again.",
  ar: "المساعد الذكي غير متاح مؤقتاً. يرجى المحاولة مرة أخرى.",
} as const;

interface UseBeautyChatOptions {
  onSuccess?: (data: ChatResponse) => void;
  onError?: (error: Error) => void;
  /** Show automatic error toast on failure (default: true) */
  showErrorToast?: boolean;
}

export function useBeautyChat(options: UseBeautyChatOptions = {}) {
  const { showErrorToast = true } = options;
  const { locale } = useLanguage();
  const lang = locale === "ar" ? "ar" : "en";

  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: sendChatMessage,

    // Only retry on 5xx (server errors) — not on 4xx (auth / bad request)
    retry: (failureCount, error) => {
      if (error.message.includes("401") || error.message.includes("400")) return false;
      return failureCount < 2;
    },

    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),

    onSuccess: options.onSuccess,

    onError: (error) => {
      console.error("[useBeautyChat]", error);
      if (showErrorToast) {
        toast.error(ERROR_MESSAGES[lang]);
      }
      options.onError?.(error);
    },
  });
}
