/**
 * useRapidTask — TanStack Query useMutation for the rapid-task admin edge function.
 *
 * Admin-only. Requires the user to have `role = 'admin'` in the user_roles table.
 * The Supabase client automatically injects the session JWT.
 *
 * Available tasks: health | stats | clear-rate-limits | sync-tray
 *
 * Usage:
 *   const { mutate: runTask, isPending, data } = useRapidTask();
 *   runTask({ task: "health" });
 *   runTask({ task: "sync-tray", payload: { concern: "Concern_Acne" } });
 */

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export type RapidTaskName =
  | "health"
  | "stats"
  | "clear-rate-limits"
  | "sync-tray";

export interface RapidTaskRequest {
  task: RapidTaskName;
  payload?: Record<string, unknown>;
}

export interface HealthResult {
  task: "health";
  status: "ok";
  checks: Record<string, string>;
  ms: number;
  ts: string;
}

export interface StatsResult {
  task: "stats";
  counts: Record<string, number | string>;
  ms: number;
}

export interface ClearRateLimitsResult {
  task: "clear-rate-limits";
  deleted: number;
  ms: number;
}

export interface SyncTrayResult {
  task: "sync-tray";
  status: string;
  ms: number;
}

export type RapidTaskResult =
  | HealthResult
  | StatsResult
  | ClearRateLimitsResult
  | SyncTrayResult;

// ── API Function ──────────────────────────────────────────────────────────────

async function invokeRapidTask(req: RapidTaskRequest): Promise<RapidTaskResult> {
  const { data, error } = await supabase.functions.invoke("rapid-task", {
    body: req,
  });

  if (error) throw new Error(error.message ?? "rapid-task invocation failed");
  if (data?.error) throw new Error(data.error as string);

  return data as RapidTaskResult;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseRapidTaskOptions {
  onSuccess?: (result: RapidTaskResult) => void;
  onError?: (error: Error) => void;
  /** Show automatic success toast (default: true) */
  showSuccessToast?: boolean;
}

export function useRapidTask(options: UseRapidTaskOptions = {}) {
  const { showSuccessToast = true } = options;

  return useMutation<RapidTaskResult, Error, RapidTaskRequest>({
    mutationFn: invokeRapidTask,

    onSuccess: (data) => {
      if (showSuccessToast) {
        const ms = "ms" in data ? data.ms : 0;
        toast.success(`Task "${data.task}" completed`, {
          description: `${ms}ms`,
        });
      }
      options.onSuccess?.(data);
    },

    onError: (error) => {
      console.error("[useRapidTask]", error);
      toast.error(`Task failed: ${error.message}`);
      options.onError?.(error);
    },

    // No retry — admin tasks should be idempotent but not auto-retried
    retry: false,
  });
}
