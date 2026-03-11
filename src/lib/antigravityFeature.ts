/**
 * Antigravity Panel Feature Flag and Diagnostic Runner
 *
 * All new connection/diagnostic UI or workflow changes are controlled by the
 * FEATURE_ANTIGRAVITY flag, enabling safe, incremental rollout and easy toggling.
 *
 * To enable: set VITE_FEATURE_ANTIGRAVITY=true in your environment or .env file.
 * (See env.main-site.example for environment flag conventions.)
 */

export const FEATURE_ANTIGRAVITY: boolean =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  typeof import.meta.env.VITE_FEATURE_ANTIGRAVITY !== "undefined"
    ? String(import.meta.env.VITE_FEATURE_ANTIGRAVITY).toLowerCase() === "true"
    : false;

/**
 * Run the Antigravity diagnostic script and return a status/result object.
 *
 * Only executes when FEATURE_ANTIGRAVITY is true and in a Node.js environment
 * (i.e. not in the browser). Runs scripts/antigravity-diagnostic.ps1 via
 * PowerShell and interprets the output.
 *
 * Returns a standardised result suitable for display in UI or workflow logs:
 *   - "success"    — language server process found
 *   - "no_process" — script ran but no Antigravity process detected
 *   - "error"      — feature disabled, wrong environment, or script error
 *   - "escalate"   — script output indicates uncertainty; needs human review
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

  // Only attempt in a Node.js-capable environment, not in the browser.
  if (typeof window !== "undefined") {
    return {
      status: "error",
      details: "Cannot run PowerShell diagnostics in browser environment.",
    };
  }

  try {
    // Dynamic imports to avoid bundling Node built-ins into the browser bundle.
    const { exec } = await import("child_process");
    const nodePath = await import("path");
    const util = await import("util");
    const execAsync = util.promisify(exec);

    // Use path.join so this works correctly on any platform (PowerShell also
    // accepts forward-slash separators on Windows).
    const scriptPath = nodePath.join("scripts", "antigravity-diagnostic.ps1");
    const { stdout } = await execAsync(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`
    );

    if (
      stdout?.includes("no language_server_windows_x64.exe") ||
      stdout?.toLowerCase().includes("no_process")
    ) {
      return {
        status: "no_process",
        details: stdout.trim(),
      };
    }

    return {
      status: "success",
      details: stdout?.trim() || "Diagnostic succeeded.",
    };
  } catch (err: unknown) {
    const error = err as { stderr?: string; message?: string };
    const detail =
      error?.stderr || error?.message || "Unknown error in diagnosis script";
    return {
      status:
        detail.includes("uncertain") || detail.includes("cannot detect")
          ? "escalate"
          : "error",
      details: detail,
    };
  }
}
