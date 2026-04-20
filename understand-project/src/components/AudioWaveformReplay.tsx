import React, { useMemo } from "react";
import { RotateCcw, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Asper Beauty Shop — Audio Waveform + Replay Component ───────────────────
// Design tokens (strict):
//   Background  : Soft Ivory  (#F8F8FF) — blends with page canvas
//   Active bar  : Deep Maroon (#800020) — progress & active waveform
//   Inactive bar: rose clay alpha       — unplayed bars
//   Replay hover: Shiny Gold  (#C5A028) — "Midas Touch"
//   Text        : Dark Charcoal #333333

interface AudioWaveformReplayProps {
  /** 0–1 playback progress */
  progress?: number;
  /** Duration in seconds */
  duration?: number;
  /** Is audio currently playing? */
  isPlaying?: boolean;
  /** Is audio being fetched/generated? */
  isLoading?: boolean;
  /** Error string if any */
  error?: string | null;
  /** Persona label shown underneath */
  persona?: "dr-sami" | "ms-zain";
  /** Called when the Replay button is clicked */
  onReplay?: () => void;
  /** Called when the Stop button is clicked */
  onStop?: () => void;
  /** Extra class names for the container */
  className?: string;
}

// ── Static waveform shape (looks like a voice print) ───────────────────────
// Heights are pre-seeded so the bars look natural without dynamic analysis.
const BAR_HEIGHTS = [
  30, 55, 45, 70, 60, 85, 50, 75, 40, 90, 65, 80, 55, 95, 70,
  60, 85, 45, 75, 55, 65, 50, 80, 70, 60, 45, 90, 75, 55, 80,
  65, 50, 70, 60, 85, 45, 75, 55, 95, 65,
];
const NUM_BARS = BAR_HEIGHTS.length;

function formatTime(secs: number): string {
  if (!isFinite(secs) || secs <= 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const PERSONA_LABELS: Record<string, { name: string; title: string }> = {
  "dr-sami": { name: "Dr. Sami", title: "Clinical Pharmacist" },
  "ms-zain": { name: "Ms. Zain", title: "Beauty Concierge" },
};

export const AudioWaveformReplay: React.FC<AudioWaveformReplayProps> = ({
  progress = 0,
  duration = 0,
  isPlaying = false,
  isLoading = false,
  error = null,
  persona = "dr-sami",
  onReplay,
  onStop,
  className,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const activeBars = Math.floor(clampedProgress * NUM_BARS);
  const currentTime = duration * clampedProgress;

  const personaLabel = PERSONA_LABELS[persona] ?? PERSONA_LABELS["dr-sami"];

  // Pulsing animation keyframes injected once via a <style> tag
  const pulseStyle = useMemo(
    () => (
      <style>{`
        @keyframes asper-bar-pulse {
          0%,100% { transform: scaleY(1); }
          50%      { transform: scaleY(1.25); }
        }
        .asper-bar-active-pulse {
          animation: asper-bar-pulse 0.7s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
    ),
    [],
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl px-4 py-3 select-none",
        "bg-[#F8F8FF] border border-[#C5A028]/20",
        className,
      )}
      aria-label="Audio player"
    >
      {pulseStyle}

      {/* ── Persona label row ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-[#333333]/60 font-[Montserrat,sans-serif]">
        <span>
          <span className="font-semibold text-[#800020]">{personaLabel.name}</span>
          {" · "}
          {personaLabel.title}
        </span>
        {/* Duration */}
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* ── Waveform SVG ──────────────────────────────────────────────────── */}
      <div className="relative h-16 flex items-center overflow-hidden rounded-md">
        {isLoading ? (
          /* Loading state — shimmer bars */
          <div className="flex items-end gap-[2px] w-full h-full px-1">
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-[#800020]/20 animate-pulse"
                style={{ height: `${(h / 95) * 100}%` }}
              />
            ))}
          </div>
        ) : error ? (
          <p className="w-full text-center text-xs text-red-500 font-[Montserrat,sans-serif]">
            {error}
          </p>
        ) : (
          <div className="flex items-end gap-[2px] w-full h-full px-1">
            {BAR_HEIGHTS.map((h, i) => {
              const isActive = i < activeBars;
              const isCurrent = i === activeBars;
              const heightPct = `${(h / 95) * 100}%`;

              return (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-sm transition-all duration-100",
                    isActive
                      ? "bg-[#800020]"
                      : "bg-[#800020]/15",
                    isPlaying && isCurrent && "asper-bar-active-pulse bg-[#800020]",
                  )}
                  style={{ height: heightPct }}
                />
              );
            })}
          </div>
        )}

        {/* Maroon playhead line */}
        {!isLoading && !error && (
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#800020] rounded-full transition-all duration-100 pointer-events-none"
            style={{ left: `${clampedProgress * 100}%` }}
          />
        )}
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div className="h-[3px] w-full rounded-full bg-[#800020]/15 overflow-hidden">
        <div
          className="h-full bg-[#800020] rounded-full transition-all duration-100"
          style={{ width: `${clampedProgress * 100}%` }}
        />
      </div>

      {/* ── Controls row ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {/* Stop button — shown while playing */}
        {isPlaying && onStop && (
          <button
            onClick={onStop}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                       text-[#800020] border border-[#800020]/30 bg-transparent
                       hover:bg-[#800020]/10 transition-colors duration-200
                       font-[Montserrat,sans-serif]"
            aria-label="Stop playback"
          >
            <Square size={13} className="fill-[#800020]" />
            Stop
          </button>
        )}

        {/* Replay / Loading button */}
        <button
          onClick={onReplay}
          disabled={isLoading}
          className={cn(
            "group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium",
            "text-[#800020] border border-[#800020]/30 bg-transparent",
            "hover:border-[#C5A028] hover:text-[#C5A028] hover:bg-[#C5A028]/5",
            "active:scale-95 transition-all duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "font-[Montserrat,sans-serif]",
          )}
          aria-label="Replay voiceover"
        >
          {isLoading ? (
            <Loader2 size={13} className="animate-spin text-[#800020]" />
          ) : (
            <RotateCcw
              size={13}
              className="text-[#800020] group-hover:text-[#C5A028] transition-colors duration-200"
            />
          )}
          {isLoading ? "Generating…" : "Replay"}
        </button>
      </div>
    </div>
  );
};

export default AudioWaveformReplay;

