import { cn } from "@/lib/utils";

interface ClinicalScoreRingProps {
  /** Score from 0â€“100 */
  score: number;
  /** e.g. "Based on 420 verified trials" */
  label?: string;
  /** Ring diameter in px */
  size?: number;
  className?: string;
}

export function ClinicalScoreRing({
  score,
  label,
  size = 56,
  className,
}: ClinicalScoreRingProps) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track */}
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          {/* Gold progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-luxury"
          />
        </svg>
        {/* Score text */}
        <span className="absolute inset-0 flex items-center justify-center font-body text-xs font-bold text-foreground">
          {score}%
        </span>
      </div>
      {label && (
        <span className="text-[10px] text-muted-foreground font-body leading-tight max-w-[100px]">
          {label}
        </span>
      )}
    </div>
  );
}

