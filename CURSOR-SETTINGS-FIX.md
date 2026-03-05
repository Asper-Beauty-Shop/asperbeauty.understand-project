# Fix: Unknown Configuration Setting in Cursor User settings.json

## Problem
Cursor reports **Unknown Configuration Setting** for `chat.mcp.discovery.enabled`. Cursor does not support this key in User `settings.json`.

## Fix
**Remove** the following block from:
`C:\Users\C-R\AppData\Roaming\Cursor\User\settings.json`

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
- **If you don’t see this key** in your `settings.json`, the warning may come from another profile or file; no change needed in this file.

## Verify
1. Save the file.
2. Reload Cursor (or run **Developer: Reload Window**).
3. Open Settings (Ctrl+,) and confirm the warning is gone.

## Explanation
`chat.mcp.discovery.enabled` is a setting used by other tools (e.g. Claude desktop, Windsurf), not by Cursor. Cursor’s MCP behavior is controlled via the **Tools & MCP** UI and `.cursor/mcp.json` (or global `~/.cursor/mcp.json`), not this settings key. Removing it removes the unknown-setting warning without affecting Cursor’s MCP.
