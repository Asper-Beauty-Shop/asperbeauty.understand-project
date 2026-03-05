# Development

Local setup, tooling, and Cursor/IDE notes for the Asper Beauty Shop repo.

---

## Toolkit for Antigravity (Cursor extension)

The **Toolkit for Antigravity** extension in Cursor connects to an external Antigravity process (Antigravity IDE or its language server, `language_server_windows_x64.exe`). If that process is not running, the Toolkit reports **no_process** and *"Cannot fetch quota: server info not available."*

### PowerShell execution policy (Windows)

To avoid execution policy errors when the Toolkit runs PowerShell (e.g. `Get-CimInstance`), set:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

Run once per user; completed successfully for this workspace.

### Diagnostic script (process check)

The repo includes a script that runs the same process check the extension uses (avoids `$_` being stripped when invoked from some shells):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\antigravity-diagnostic.ps1"
```

- **If it lists processes** — Antigravity language server / IDE is running; the Toolkit can connect after a reload.
- **If it shows nothing** — No `language_server_windows_x64.exe` or Antigravity-related process is running. The Toolkit log **Reason: no_process** is expected.

### What you need for the Toolkit to connect

1. **Start Antigravity IDE** (or whatever launches `language_server_windows_x64.exe`) on this machine.
2. Reload Cursor or run the Toolkit again once that process is running.

If you **don’t use Antigravity**, disable or uninstall the *"Toolkit for Antigravity"* extension in Cursor to stop connection attempts and quota messages.

### Optional: feature flag (frontend)

Per Operational-Workflow-Rules, wrap Antigravity panel / connection / diagnostic UI in a feature flag. Control via env: `VITE_FEATURE_ANTIGRAVITY=true|false` (see `env.main-site.example` and APPLY_TO_MAIN_SITE.md).

**Example (e.g. in a shared constants or feature-flags module):**

```js
// Feature flag for Antigravity Panel — wrap new connection/diagnostic UI with this.
export const FEATURE_ANTIGRAVITY = (
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  typeof import.meta.env.VITE_FEATURE_ANTIGRAVITY !== "undefined"
    ? String(import.meta.env.VITE_FEATURE_ANTIGRAVITY).toLowerCase() === "true"
    : false
);

// Usage:
// if (FEATURE_ANTIGRAVITY) {
//   // Show Antigravity info panel, diagnostics, or connection wizard.
// } else {
//   // Fallback to legacy/disabled state.
// }
```

---

## Other docs

- **Brain & env:** [BRAIN-CONFIG.md](./BRAIN-CONFIG.md)
- **Apply to main site & all channels:** [APPLY_AND_RUN.md](./APPLY_AND_RUN.md)
- **Role & mandate:** [ROLE_AND_MANDATE.md](./ROLE_AND_MANDATE.md)
