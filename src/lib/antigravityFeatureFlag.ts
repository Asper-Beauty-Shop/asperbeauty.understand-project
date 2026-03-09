/**
 * Feature Flag: Antigravity Panel
 *
 * All Antigravity connection/diagnostic UI or workflow changes must be wrapped
 * with this flag, per Operational-Workflow-Rules. This enables safe, incremental
 * rollout and easy toggling without redeployment.
 *
 * Control via environment variable (recommended):
 *   VITE_FEATURE_ANTIGRAVITY=true   â€” enable
 *   VITE_FEATURE_ANTIGRAVITY=false  â€” disable (default)
 *
 * See env.main-site.example and APPLY_TO_MAIN_SITE.md for conventions.
 */
export const FEATURE_ANTIGRAVITY: boolean =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  typeof import.meta.env.VITE_FEATURE_ANTIGRAVITY !== "undefined"
    ? String(import.meta.env.VITE_FEATURE_ANTIGRAVITY).toLowerCase() === "true"
    : false;

/**
 * Run the Antigravity diagnostic PowerShell script and return a structured result.
 *
 * - Only executes when FEATURE_ANTIGRAVITY is true.
 * - Requires a Node.js / Deno-capable runtime (not available in the browser).
 * - Runs `scripts/antigravity-diagnostic.ps1` via PowerShell.
 * - Returns `{ status, details }` for downstream UI or workflow handling.
 * - Follows Monitoring-Quality-Rules: errors produce an escalatable object.
 *
 * Possible status values:
 *   "success"    â€” language server process was found.
 *   "no_process" â€” script ran but found no language server process.
 *   "error"      â€” flag disabled, wrong environment, or script failed.
 *   "escalate"   â€” script output signals uncertainty; human review needed.
 */
export async function runAntigravityDiagnostic(): Promise<{
  status: "success" | "no_process" | "error" | "escalate";
  details: string;
}> {
  if (!FEATURE_ANTIGRAVITY) {
    return {
      status: "error",
      details: "Antigravity diagnostics are disabled by feature flag.",
    };
  }

  // Guard: cannot run PowerShell in a pure browser environment.
  if (typeof window !== "undefined" && typeof (window as Window & { process?: unknown }).process === "undefined") {
    return {
      status: "error",
      details: "Cannot run PowerShell diagnostics in browser environment.",
    };
  }

  try {
    // Dynamic imports so this module remains safe to bundle in browser contexts
    // even though the runtime branch above will never reach here in a browser.
    const { exec } = await import("child_process");
    const util = await import("util");
    const path = await import("path");
    const execAsync = util.promisify(exec);

    const scriptPath = path.join("scripts", "antigravity-diagnostic.ps1");
    const { stdout } = await execAsync(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`
    );

    if (
      stdout?.includes("no language_server_windows_x64") ||
      stdout?.toLowerCase().includes("no_process")
    ) {
      return { status: "no_process", details: stdout.trim() };
    }

    return { status: "success", details: stdout?.trim() || "Diagnostic succeeded." };
  } catch (err: unknown) {
    const e = err as { stderr?: string; message?: string };
    const detail = e?.stderr || e?.message || "Unknown error in diagnosis script";
    return {
      status:
        detail.includes("uncertain") || detail.includes("cannot detect")
          ? "escalate"
          : "error",
      details: detail,
    };
  }
}
