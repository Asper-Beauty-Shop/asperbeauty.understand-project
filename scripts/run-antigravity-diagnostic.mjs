#!/usr/bin/env node
/**
 * Antigravity diagnostic runner (Node).
 * Runs scripts/antigravity-diagnostic.ps1 and returns { status, details }.
 * Use: node scripts/run-antigravity-diagnostic.mjs
 * Or require and call runAntigravityDiagnostic() from Node tooling.
 */

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, "antigravity-diagnostic.ps1");

/**
 * Run Antigravity diagnostic script and return status/result.
 * @returns {{ status: 'success' | 'no_process' | 'error' | 'escalate', details: string }}
 */
export async function runAntigravityDiagnostic() {
  try {
    const { stdout, stderr } = await execAsync(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`,
      { cwd: path.resolve(__dirname, "..") }
    );
    const out = (stdout || "").trim();
    const err = (stderr || "").trim();

    if (
      out.includes("no language_server_windows_x64.exe") ||
      out.toLowerCase().includes("no_process") ||
      out.toLowerCase().includes("no matching processes") ||
      (!out && !err)
    ) {
      return { status: "no_process", details: out || "No Antigravity process found." };
    }

    return { status: "success", details: out || "Diagnostic succeeded." };
  } catch (err) {
    const detail = err?.stderr || err?.message || "Unknown error in diagnosis script";
    const status =
      detail.includes("uncertain") || detail.includes("cannot detect")
        ? "escalate"
        : "error";
    return { status, details: detail };
  }
}

// Run when executed directly
const isMain = process.argv[1] && process.argv[1].endsWith("run-antigravity-diagnostic.mjs");
if (isMain) {
  runAntigravityDiagnostic()
    .then(({ status, details }) => {
      console.log("Status:", status);
      console.log("Details:", details);
      process.exit(status === "error" || status === "escalate" ? 1 : 0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
