import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Flame, Zap } from "lucide-react";

interface CountdownBannerProps {
  isAr: boolean;
}

/** Returns the next upcoming midnight (end of day) as the sale deadline. */
function getNextDeadline(): Date {
  const now = new Date();
  const deadline = new Date(now);
  // Set to end of current day
  deadline.setHours(23, 59, 59, 999);
  // If less than 1 hour remains, push to next day for a better visual
  if (deadline.getTime() - now.getTime() < 3600_000) {
    deadline.setDate(deadline.getDate() + 1);
  }
  return deadline;
}

function useCountdown(deadline: Date) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, deadline.getTime() - now);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return { hours, minutes, seconds, isExpired: diff <= 0 };
}

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="font-display text-2xl md:text-3xl text-accent tabular-nums leading-none">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 font-body mt-1">
      {label}
    </span>
  </div>
);

const Separator = () => (
  <span className="text-accent/60 text-xl md:text-2xl font-display leading-none animate-pulse mx-1">
    :
  </span>
);

export function CountdownBanner({ isAr }: CountdownBannerProps) {
  const deadline = useMemo(() => getNextDeadline(), []);
  const { hours, minutes, seconds, isExpired } = useCountdown(deadline);

  if (isExpired) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden"
    >
      {/* Outer wrapper with glass effect */}
      <div className="luxury-container py-5">
        <div className="relative rounded-xl border border-accent/20 bg-card/80 backdrop-blur-md overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
          {/* Subtle gold shimmer line at top */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-4 px-6">
            {/* Left icon cluster */}
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive animate-pulse" />
              <span className="font-display text-sm md:text-base text-foreground uppercase tracking-wider">
                {isAr ? "عرض لفترة محدودة" : "Limited Time Offer"}
              </span>
              <Zap className="w-4 h-4 text-accent" />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-border/50" />

            {/* Countdown */}
            <div className="flex items-center gap-0.5">
              <Clock className="w-4 h-4 text-accent/60 me-2" />
              <TimeBlock value={hours} label={isAr ? "ساعة" : "HRS"} />
              <Separator />
              <TimeBlock value={minutes} label={isAr ? "دقيقة" : "MIN"} />
              <Separator />
              <TimeBlock value={seconds} label={isAr ? "ثانية" : "SEC"} />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-border/50" />

            {/* CTA text */}
            <span className="text-xs font-body text-muted-foreground text-center">
              {isAr
                ? "لا تفوّتي الفرصة — الأسعار ترتفع قريباً!"
                : "Don't miss out — prices go up soon!"}
            </span>
          </div>

          {/* Bottom shimmer */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>
      </div>
    </motion.section>
  );
}
