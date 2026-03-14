import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * Unit tests for src/lib/antigravityFeatureFlag.ts
 *
 * Tests the FEATURE_ANTIGRAVITY flag value and the behaviour of
 * runAntigravityDiagnostic() under various conditions.
 */

/** Helper type for patching globalThis.window in tests. */
type GlobalWithWindow = typeof globalThis & { window?: unknown };

describe("FEATURE_ANTIGRAVITY flag", () => {
  it("defaults to false when VITE_FEATURE_ANTIGRAVITY env var is absent", async () => {
    // In the test environment VITE_FEATURE_ANTIGRAVITY is not set,
    // so the flag should evaluate to false.
    const { FEATURE_ANTIGRAVITY } = await import("../antigravityFeatureFlag");
    expect(FEATURE_ANTIGRAVITY).toBe(false);
  });
});

describe("runAntigravityDiagnostic()", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns status 'error' when the feature flag is false", async () => {
    const { runAntigravityDiagnostic } = await import("../antigravityFeatureFlag");
    const result = await runAntigravityDiagnostic();
    expect(result.status).toBe("error");
    expect(result.details).toMatch(/disabled by feature flag/i);
  });

  it("returns status 'error' when called in a browser-like environment (no process on window)", async () => {
    // Simulate a browser context: window exists but window.process does not.
    const hadWindow = "window" in globalThis;
    const originalWindowProcess = (globalThis as GlobalWithWindow & { window?: { process?: unknown } }).window?.process;

    // Set up a window object without a .process property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window = {};

    vi.stubEnv("VITE_FEATURE_ANTIGRAVITY", "true");
    vi.resetModules();

    const { runAntigravityDiagnostic } = await import("../antigravityFeatureFlag");
    const result = await runAntigravityDiagnostic();

    expect(result.status).toBe("error");
    expect(result.details).toMatch(/browser environment/i);

    // Restore window
    if (hadWindow) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).window = { process: originalWindowProcess };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).window;
    }
  });

  it("returns status 'error' when flag is true but PowerShell is not available (CI/Linux)", async () => {
    // In the Linux CI environment, 'powershell' does not exist.
    // The function should catch the exec error and return { status: "error" }.
    vi.stubEnv("VITE_FEATURE_ANTIGRAVITY", "true");
    vi.resetModules();

    const { runAntigravityDiagnostic } = await import("../antigravityFeatureFlag");
    const result = await runAntigravityDiagnostic();

    // PowerShell is unavailable → exec throws → catch block returns "error"
    expect(result.status).toBe("error");
    expect(result.details.length).toBeGreaterThan(0);
  });
});

