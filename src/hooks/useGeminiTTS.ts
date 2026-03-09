import { useState, useCallback, useRef } from "react";

// â”€â”€ Asper Beauty Shop â€” Gemini TTS Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Calls the /functions/v1/gemini-tts Supabase Edge Function and returns
// playback controls + waveform data for <AudioWaveformReplay />.
//
// Persona â†’ Voice
//   "dr-sami"  â†’ Puck   (authoritative, clinical)
//   "ms-zain"  â†’ Aoede  (warm, lyrical)

export type TTSPersona = "dr-sami" | "ms-zain";

export interface UseGeminiTTSReturn {
  /** Speak the given text using the specified persona */
  speak: (text: string, persona?: TTSPersona) => Promise<void>;
  /** Replay the last generated audio from the beginning */
  replay: () => void;
  /** Stop current playback */
  stop: () => void;
  /** true while the Edge Function is being called */
  isLoading: boolean;
  /** true while audio is currently playing */
  isPlaying: boolean;
  /** 0â€“1 playback progress */
  progress: number;
  /** Duration of the current audio in seconds */
  duration: number;
  /** Error message, if any */
  error: string | null;
  /** Cached WAV blob URL for the last generated audio */
  audioUrl: string | null;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const TTS_ENDPOINT = `${SUPABASE_URL}/functions/v1/gemini-tts`;

export function useGeminiTTS(): UseGeminiTTSReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRafRef = useRef<number | null>(null);

  // â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const stopProgressRaf = () => {
    if (progressRafRef.current !== null) {
      cancelAnimationFrame(progressRafRef.current);
      progressRafRef.current = null;
    }
  };

  const startProgressRaf = (audio: HTMLAudioElement) => {
    stopProgressRaf();
    const tick = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      }
      if (!audio.ended && !audio.paused) {
        progressRafRef.current = requestAnimationFrame(tick);
      }
    };
    progressRafRef.current = requestAnimationFrame(tick);
  };

  const bindAudioEvents = (audio: HTMLAudioElement) => {
    audio.onplay = () => {
      setIsPlaying(true);
      startProgressRaf(audio);
    };
    audio.onpause = () => {
      setIsPlaying(false);
      stopProgressRaf();
    };
    audio.onended = () => {
      setIsPlaying(false);
      setProgress(1);
      stopProgressRaf();
    };
    audio.ondurationchange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    audio.onerror = () => {
      setIsPlaying(false);
      stopProgressRaf();
      setError("Audio playback error");
    };
  };

  // â”€â”€ speak â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const speak = useCallback(
    async (text: string, persona: TTSPersona = "dr-sami") => {
      if (!text.trim()) return;

      setIsLoading(true);
      setError(null);
      setProgress(0);

      // Stop and clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      try {
        const res = await fetch(TTS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, persona }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ?? `HTTP ${res.status}`,
          );
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const audio = new Audio(url);
        audioRef.current = audio;
        bindAudioEvents(audio);

        await audio.play();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        console.error("[useGeminiTTS] speak error:", msg);
      } finally {
        setIsLoading(false);
      }
    },
    [audioUrl],
  );

  // â”€â”€ replay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const replay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.currentTime = 0;
    setProgress(0);
    audio.play().catch((e) => setError(String(e)));
  }, [audioUrl]);

  // â”€â”€ stop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setProgress(0);
    setIsPlaying(false);
    stopProgressRaf();
  }, []);

  return {
    speak,
    replay,
    stop,
    isLoading,
    isPlaying,
    progress,
    duration,
    error,
    audioUrl,
  };
}
