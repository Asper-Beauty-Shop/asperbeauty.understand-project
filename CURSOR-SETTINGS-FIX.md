# Fix: Cursor User settings.json

**File:** `C:\Users\<USERNAME>\AppData\Roaming\Cursor\User\settings.json`

**Copy-paste option:** A full corrected JSON is in [cursor-user-settings-FIXED.json](cursor-user-settings-FIXED.json). Copy its entire contents and paste into your User `settings.json`, then save and reload Cursor.

---

## A. Corrupted structure (fix first)

Your file has broken JSON at the top and in a few other places. Apply these edits so the file parses:

1. **Lines 1–6** — Replace the corrupted start with a valid opening and one `workbench.settings.applyToAllProfiles`:
   - **Delete** from the very start through the first `]` (the broken `{workbench.settings...` and the duplicate/broken array including `M"npm.scriptExplorerAction"` and `]`).
   - **Insert** exactly this as the first line, then a newline:
   ```json
   {
       "workbench.settings.applyToAllProfiles": [
           "workbench.editorAssociations",
           "chat.mcp.access",
           "npm.scriptExplorerAction",
           "update.channel",
           "stash-push:command"
       ],
   ```
   - So the next line after the `],` should be `"git.enableSmartCommit": true,` (already there).

2. **workbench.editorAssociations** (around lines 35–42):
   - Remove the entry `"": ""`.
   - Change `"csv`": "vscode.markdown.preview.editor"` to `"*.csv": "vscode.markdown.preview.editor"` (fix the backtick and use `*.csv`).
   - Remove the long invalid key that starts with `"Commands for running scripts..."` (the whole line). If you need a default for CSV, keep only `"*.csv": "vscode.markdown.preview.editor"`.

3. **Duplicate workbench.settings.applyToAllProfiles** — Keep only one. Delete the duplicate block at lines 77–81 if the one at the top is now correct (same list including `update.channel` and `stash-push:command`).

4. **End of file (lines 210–213)** — Fix the invalid `"[apex-anon]"` block:
   - Change `"[apex-anon]": {` and the next line `always` and `}` to valid JSON, e.g.:
   ```json
   "[apex-anon]": {
       "editor.defaultFormatter": "default"
   }
   }
   ```
   - So the file ends with exactly one closing `}` for the root object.

---

## B. Unknown Configuration Setting (`chat.mcp.discovery.enabled`)

**Problem:** Cursor reports **Unknown Configuration Setting** for `chat.mcp.discovery.enabled`. Cursor does not support this key in User `settings.json`.

**Fix:** Remove the following block from:
`C:\Users\<USERNAME>\AppData\Roaming\Cursor\User\settings.json`

```json
"chat.mcp.discovery.enabled": {
    "claude-desktop": true,
    "windsurf": true,
    "cursor-global": true,
    "cursor-workspace": true
},
```

- Delete the entire `"chat.mcp.discovery.enabled"` entry **and** the comma after the `}`.
- If this was the last property in the object, remove the comma on the **previous** line so the JSON stays valid.
- **If you don't see this key** in your `settings.json`, the warning may come from another profile or file; no change needed in this file.

## Verify
1. Save the file.
2. Reload Cursor (or run **Developer: Reload Window**).
3. Open Settings (Ctrl+,) and confirm the warning is gone.

## Explanation
`chat.mcp.discovery.enabled` is a setting used by other tools (e.g. Claude desktop, Windsurf), not by Cursor. Cursor's MCP behavior is controlled via the **Tools & MCP** UI and `.cursor/mcp.json` (or global `~/.cursor/mcp.json`), not this settings key. Removing it removes the unknown-setting warning without affecting Cursor's MCP.
