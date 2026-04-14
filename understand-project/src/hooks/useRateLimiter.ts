import { useCallback, useEffect, useRef, useState } from "react";

interface RateLimitState {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

interface RateLimiterConfig {
  maxAttempts: number;
  windowMs: number;
  lockoutMs: number;
  storageKey: string;
}

interface RateLimiterReturn {
  canAttempt: boolean;
  remainingAttempts: number;
  lockoutRemaining: number;
  recordAttempt: () => void;
  recordSuccess: () => void;
  reset: () => void;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  lockoutMs: 30 * 60 * 1000, // 30 minutes lockout after max attempts
  storageKey: "auth_rate_limit",
};

export function useRateLimiter(
  config: Partial<RateLimiterConfig> = {},
): RateLimiterReturn {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<RateLimitState>(() => {
    try {
      const stored = localStorage.getItem(finalConfig.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          attempts: parsed.attempts || 0,
          lockedUntil: parsed.lockedUntil || null,
          lastAttempt: parsed.lastAttempt || 0,
        };
      }
    } catch {
      // Ignore parse errors
    }
    return { attempts: 0, lockedUntil: null, lastAttempt: 0 };
  });

  const [, setForceUpdate] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(finalConfig.storageKey, JSON.stringify(state));
    } catch {
      // Storage might be full or disabled
    }
  }, [state, finalConfig.storageKey]);

  // Update countdown every second when locked out
  useEffect(() => {
    const now = Date.now();
    const isLocked = state.lockedUntil && state.lockedUntil > now;

    if (isLocked) {
      intervalRef.current = window.setInterval(() => {
        const currentNow = Date.now();
        if (!state.lockedUntil || currentNow >= state.lockedUntil) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setState((prev) => ({ ...prev, lockedUntil: null, attempts: 0 }));
        } else {
          setForceUpdate((n) => n + 1);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.lockedUntil]);

  // Clean up old attempts outside the window
  useEffect(() => {
    const now = Date.now();
    if (state.lastAttempt && now - state.lastAttempt > finalConfig.windowMs) {
      setState((prev) => ({ ...prev, attempts: 0, lastAttempt: 0 }));
    }
  }, [state.lastAttempt, finalConfig.windowMs]);

  const canAttempt = useCallback(() => {
    const now = Date.now();

    // Check if locked out
    if (state.lockedUntil && state.lockedUntil > now) {
      return false;
    }

    // Check if attempts are within window
    if (state.lastAttempt && now - state.lastAttempt > finalConfig.windowMs) {
      return true; // Window expired, can attempt
    }

    return state.attempts < finalConfig.maxAttempts;
  }, [state, finalConfig.maxAttempts, finalConfig.windowMs]);

  const remainingAttempts = useCallback(() => {
    const now = Date.now();

    if (state.lockedUntil && state.lockedUntil > now) {
      return 0;
    }

    if (state.lastAttempt && now - state.lastAttempt > finalConfig.windowMs) {
      return finalConfig.maxAttempts;
    }

    return Math.max(0, finalConfig.maxAttempts - state.attempts);
  }, [state, finalConfig.maxAttempts, finalConfig.windowMs]);

  const lockoutRemaining = useCallback(() => {
    const now = Date.now();
    if (state.lockedUntil && state.lockedUntil > now) {
      return Math.ceil((state.lockedUntil - now) / 1000);
    }
    return 0;
  }, [state.lockedUntil]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();

    setState((prev) => {
      // Check if window expired
      const windowExpired = prev.lastAttempt &&
        now - prev.lastAttempt > finalConfig.windowMs;
      const currentAttempts = windowExpired ? 0 : prev.attempts;
      const newAttempts = currentAttempts + 1;

      // Lock out if max attempts exceeded
      if (newAttempts >= finalConfig.maxAttempts) {
        return {
          attempts: newAttempts,
          lockedUntil: now + finalConfig.lockoutMs,
          lastAttempt: now,
        };
      }

      return {
        attempts: newAttempts,
        lockedUntil: null,
        lastAttempt: now,
      };
    });
  }, [finalConfig.windowMs, finalConfig.maxAttempts, finalConfig.lockoutMs]);

  const recordSuccess = useCallback(() => {
    setState({ attempts: 0, lockedUntil: null, lastAttempt: 0 });
    try {
      localStorage.removeItem(finalConfig.storageKey);
    } catch {
      // Ignore storage errors
    }
  }, [finalConfig.storageKey]);

  const reset = useCallback(() => {
    setState({ attempts: 0, lockedUntil: null, lastAttempt: 0 });
    try {
      localStorage.removeItem(finalConfig.storageKey);
    } catch {
      // Ignore storage errors
    }
  }, [finalConfig.storageKey]);

  return {
    canAttempt: canAttempt(),
    remainingAttempts: remainingAttempts(),
    lockoutRemaining: lockoutRemaining(),
    recordAttempt,
    recordSuccess,
    reset,
  };
}

// Pre-configured rate limiters for different auth actions
export function useLoginRateLimiter() {
  return useRateLimiter({
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutMs: 30 * 60 * 1000, // 30 minutes
    storageKey: "login_rate_limit",
  });
}

export function useSignupRateLimiter() {
  return useRateLimiter({
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    lockoutMs: 60 * 60 * 1000, // 1 hour
    storageKey: "signup_rate_limit",
  });
}

export function usePasswordResetRateLimiter() {
  return useRateLimiter({
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutMs: 60 * 60 * 1000, // 1 hour
    storageKey: "password_reset_rate_limit",
  });
}

export function useMFARateLimiter() {
  return useRateLimiter({
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
    lockoutMs: 15 * 60 * 1000, // 15 minutes
    storageKey: "mfa_rate_limit",
  });
}
