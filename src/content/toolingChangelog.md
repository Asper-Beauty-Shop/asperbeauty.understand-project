# Tooling Changelog

Updates from our development and AI tooling pipeline (Claude Code and related tooling). Applied to the site for transparency and team reference.

---

## 2.1.68

- Opus 4.6 now defaults to medium effort for Max and Team subscribers. Medium effort works well for most tasks — it's the sweet spot between speed and thoroughness. You can change this anytime with `/model`
- Re-introduced the "ultrathink" keyword to enable high effort for the next turn
- Removed Opus 4 and 4.1 from Claude Code on the first-party API — users with these models pinned are automatically moved to Opus 4.6

## 2.1.66

- Reduced spurious error logging

## 2.1.63

- Added `/simplify` and `/batch` bundled slash commands
- Fixed local slash command output like /cost appearing as user-sent messages instead of system messages in the UI
- Project configs & auto memory now shared across git worktrees of the same repository
- Added `ENABLE_CLAUDEAI_MCP_SERVERS=false` env var to opt out from making claude.ai MCP servers available
- Improved `/model` command to show the currently active model in the slash command menu
- Added HTTP hooks, which can POST JSON to a URL and receive JSON instead of running a shell command
- Fixed listener leak in bridge polling loop
- Fixed listener leak in MCP OAuth flow cleanup
- Added manual URL paste fallback during MCP OAuth authentication. If the automatic localhost redirect doesn't work, you can paste the callback URL to complete authentication.
- Fixed memory leak when navigating hooks configuration menu
- Fixed listener leak in interactive permission handler during auto-approvals
- Fixed file count cache ignoring glob ignore patterns
- Fixed memory leak in bash command prefix cache
- Fixed MCP tool/resource cache leak on server reconnect
- Fixed IDE host IP detection cache incorrectly sharing results across ports
- Fixed WebSocket listener leak on transport reconnect
- Fixed memory leak in git root detection cache that could cause unbounded growth in long-running sessions
- Fixed memory leak in JSON parsing cache that grew unbounded over long sessions
- VSCode: Fixed remote sessions not appearing in conversation history
- Fixed a race condition in the REPL bridge where new messages could arrive at the server interleaved with historical messages during the initial connection flush, causing message ordering issues.
- Fixed memory leak where long-running teammates retained all messages in AppState even after conversation compaction
- Fixed a memory leak where MCP server fetch caches were not cleared on disconnect, causing growing memory usage with servers that reconnect frequently
- Improved memory usage in long sessions with subagents by stripping heavy progress message payloads during context compaction
- Added "Always copy full response" option to the `/copy` picker. When selected, future `/copy` commands will skip the code block picker and copy the full response directly.
- VSCode: Added session rename and remove actions to the sessions list
- Fixed `/clear` not resetting cached skills, which could cause stale skill content to persist in the new conversation

## 2.1.62

- Fixed prompt suggestion cache regression that reduced cache hit rates

## 2.1.61

- Fixed concurrent writes corrupting config file on Windows

## 2.1.59

- Claude automatically saves useful context to auto-memory. Manage with /memory
- Added `/copy` command to show an interactive picker when code blocks are present, allowing selection of individual code blocks or the full response.
- Improved "always allow" prefix suggestions for compound bash commands (e.g. `cd /tmp && git fetch && git push`) to compute smarter per-subcommand prefixes instead of treating the whole command as one
- Improved ordering of short task lists
- Improved memory usage in multi-agent sessions by releasing completed subagent task state
- Fixed MCP OAuth token refresh race condition when running multiple Claude Code instances simultaneously
- Fixed shell commands not showing a clear error message when the working directory has been deleted
- Fixed config file corruption that could wipe authentication when multiple Claude Code instances ran simultaneously

## 2.1.58

- Expand Remote Control to more users

## 2.1.56

- VS Code: Fixed another cause of "command 'claude-vscode.editor.openLast' not found" crashes

## 2.1.55

- Fixed BashTool failing on Windows with EINVAL error

## 2.1.53

- Fixed a UI flicker where user input would briefly disappear after submission before the message rendered
- Fixed bulk agent kill (ctrl+f) to send a single aggregate notification instead of one per agent, and to properly clear the command queue
- Fixed graceful shutdown sometimes leaving stale sessions when using Remote Control by parallelizing teardown network calls
- Fixed `--worktree` sometimes being ignored on first launch
- Fixed a panic ("switch on corrupted value") on Windows
- Fixed a crash that could occur when spawning many processes on Windows
- Fixed a crash in the WebAssembly interpreter on Linux x64 & Windows x64
- Fixed a crash that sometimes occurred after 2 minutes on Windows ARM64

## 2.1.52

- VS Code: Fixed extension crash on Windows ("command 'claude-vscode.editor.openLast' not found")

## 2.1.51

- Added `claude remote-control` subcommand for external builds, enabling local environment serving for all users.
- Updated plugin marketplace default git timeout from 30s to 120s and added `CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS` to configure.
- Added support for custom npm registries and specific version pinning when installing plugins from npm sources
- BashTool now skips login shell (`-l` flag) by default when a shell snapshot is available, improving command execution performance. Previously this required setting `CLAUDE_BASH_NO_LOGIN=true`.
- Fixed a security issue where `statusLine` and `fileSuggestion` hook commands could execute without workspace trust acceptance in interactive mode.
- Tool results larger than 50K characters are now persisted to disk (previously 100K). This reduces context window usage and improves conversation longevity.
- Fixed a bug where duplicate `control_response` messages (e.g., from WebSocket reconnects) could cause API 400 errors by pushing duplicate assistant messages into the conversation.
- Added `CLAUDE_CODE_ACCOUNT_UUID`, `CLAUDE_CODE_USER_EMAIL`, and `CLAUDE_CODE_ORGANIZATION_UUID` environment variables for SDK callers to provide account info synchronously, eliminating a race condition where early telemetry events lacked account metadata.
- Fixed slash command autocomplete crashing when a plugin's SKILL.md description is a YAML array or other non-string type
- The `/model` picker now shows human-readable labels (e.g., "Sonnet 4.5") instead of raw model IDs for pinned model versions, with an upgrade hint when a newer version is available.
- Managed settings can now be set via macOS plist or Windows Registry. Learn more at https://code.claude.com/docs/en/settings#settings-files

## 2.1.50

- Added support for `startupTimeout` configuration for LSP servers
- Added `WorktreeCreate` and `WorktreeRemove` hook events, enabling custom VCS setup and teardown when agent worktree isolation creates or removes worktrees.
- Fixed a bug where resumed sessions could be invisible when the working directory involved symlinks, because the session storage path was resolved at different times during startup. Also fixed session data loss on SSH disconnect by flushing session data before hooks and analytics in the graceful shutdown sequence.
- Linux: Fixed native modules not loading on systems with glibc older than 2.30 (e.g., RHEL 8)
- Fixed memory leak in agent teams where completed teammate tasks were never garbage collected from session state
- Fixed `CLAUDE_CODE_SIMPLE` to fully strip down skills, session memory, custom agents, and CLAUDE.md token counting
- Fixed `/mcp reconnect` freezing the CLI when given a server name that doesn't exist
- Fixed memory leak where completed task state objects were never removed from AppState
- Added support for `isolation: worktree` in agent definitions, allowing agents to declaratively run in isolated git worktrees.
- `CLAUDE_CODE_SIMPLE` mode now also disables MCP tools, attachments, hooks, and CLAUDE.md file loading for a fully minimal experience.
- Fixed bug where MCP tools were not discovered when tool search is enabled and a prompt is passed in as a launch argument
- Improved memory usage during long sessions by clearing internal caches after compaction
- Added `claude agents` CLI command to list all configured agents
- Improved memory usage during long sessions by clearing large tool results after they have been processed
- Fixed a memory leak where LSP diagnostic data was never cleaned up after delivery, causing unbounded memory growth in long sessions
- Fixed a memory leak where completed task output was not freed from memory, reducing memory usage in long sessions with many tasks
- Improved startup performance for headless mode (`-p` flag) by deferring Yoga WASM and UI component imports
- Fixed prompt suggestion cache regression that reduced cache hit rates
- Fixed unbounded memory growth in long sessions by capping file history snapshots
- Added `CLAUDE_CODE_DISABLE_1M_CONTEXT` environment variable to disable 1M context window support
- Opus 4.6 (fast mode) now includes the full 1M context window
- VSCode: Added `/extra-usage` command support in VS Code sessions
- Fixed memory leak where TaskOutput retained recent lines after cleanup
- Fixed memory leak in CircularBuffer where cleared items were retained in the backing array
- Fixed memory leak in shell command execution where ChildProcess and AbortController references were retained after cleanup

## 2.1.49

- Improved MCP OAuth authentication with step-up auth support and discovery caching, reducing redundant network requests during server connections
- Added `--worktree` (`-w`) flag to start Claude in an isolated git worktree
- Subagents support `isolation: "worktree"` for working in a temporary git worktree
- Added Ctrl+F keybinding to kill background agents (two-press confirmation)
- Agent definitions support `background: true` to always run as a background task
- Plugins can ship `settings.json` for default configuration
- Fixed file-not-found errors to suggest corrected paths when the model drops the repo folder
- Fixed Ctrl+C and ESC being silently ignored when background agents are running and the main thread is idle. Pressing twice within 3 seconds now kills all background agents.
- Fixed prompt suggestion cache regression that reduced cache hit rates.
- Fixed `plugin enable` and `plugin disable` to auto-detect the correct scope when `--scope` is not specified, instead of always defaulting to user scope
- Simple mode (`CLAUDE_CODE_SIMPLE`) now includes the file edit tool in addition to the Bash tool, allowing direct file editing in simple mode.
- Permission suggestions are now populated when safety checks trigger an ask response, enabling SDK consumers to display permission options
- Sonnet 4.5 with 1M context is being removed from the Max plan in favor of our frontier Sonnet 4.6 model, which now has 1M context. Please switch in /model.
- Fixed verbose mode not updating thinking block display when toggled via `/config` — memo comparators now correctly detect verbose changes
- Fixed unbounded WASM memory growth during long sessions by periodically resetting the tree-sitter parser
- Fixed potential rendering issues caused by stale yoga layout references
- Improved performance in non-interactive mode (`-p`) by skipping unnecessary API calls during startup
- Improved performance by caching authentication failures for HTTP and SSE MCP servers, avoiding repeated connection attempts to servers requiring auth
- Fixed unbounded memory growth during long-running sessions caused by Yoga WASM linear memory never shrinking
- SDK model info now includes `supportsEffort`, `supportedEffortLevels`, and `supportsAdaptiveThinking` fields so consumers can discover model capabilities.
- Added `ConfigChange` hook event that fires when configuration files change during a session, enabling enterprise security auditing and optional blocking of settings changes.
- Improved startup performance by caching MCP auth failures to avoid redundant connection attempts
- Improved startup performance by reducing HTTP calls for analytics token counting
- Improved startup performance by batching MCP tool token counting into a single API call
- Fixed `disableAllHooks` setting to respect managed settings hierarchy — non-managed settings can no longer disable managed hooks set by policy (#26637)
- Fixed `--resume` session picker showing raw XML tags for sessions that start with commands like `/clear`. Now correctly falls through to the session ID fallback.
- Improved permission prompts for path safety and working directory blocks to show the reason for the restriction instead of a bare prompt with no context

## 2.1.47

- Fixed FileWriteTool line counting to preserve intentional trailing blank lines instead of stripping them with `trimEnd()`.
- Fixed Windows terminal rendering bugs caused by `os.EOL` (`\r\n`) in display code — line counts now show correct values instead of always showing 1 on Windows.
- Improved VS Code plan preview: auto-updates as Claude iterates, enables commenting only when the plan is ready for review, and keeps the preview open when rejecting so Claude can revise.
- Fixed a bug where bold and colored text in markdown output could shift to the wrong characters on Windows due to `\r\n` line endings.
- Fixed compaction failing when conversation contains many PDF documents by stripping document blocks alongside images before sending to the compaction API (anthropics/claude-code#26188)
- Improved memory usage in long-running sessions by releasing API stream buffers, agent context, and skill state after use
- Improved startup performance by deferring SessionStart hook execution, reducing time-to-interactive by ~500ms.
- Fixed an issue where bash tool output was silently discarded on Windows when using MSYS2 or Cygwin shells.
- Improved performance of `@` file mentions - file suggestions now appear faster by pre-warming the index on startup and using session-based caching with background refresh.
- Improved memory usage by trimming agent task message history after tasks complete
- Improved memory usage during long agent sessions by eliminating O(n²) message accumulation in progress updates
- Fixed the bash permission classifier to validate that returned match descriptions correspond to actual input rules, preventing hallucinated descriptions from incorrectly granting permissions
- Fixed user-defined agents only loading one file on NFS/FUSE filesystems that report zero inodes (anthropics/claude-code#26044)
- Fixed plugin agent skills silently failing to load when referenced by bare name instead of fully-qualified plugin name (anthropics/claude-code#25834)
- Search patterns in collapsed tool results are now displayed in quotes for clarity
- Windows: Fixed CWD tracking temp files never being cleaned up, causing them to accumulate indefinitely (anthropics/claude-code#17600)
- Use `ctrl+f` to kill all background agents instead of double-pressing ESC. Background agents now continue running when you press ESC to cancel the main thread, giving you more control over agent lifecycle.
- Fixed API 400 errors ("thinking blocks cannot be modified") that occurred in sessions with concurrent agents, caused by interleaved streaming content blocks preventing proper message merging.
- Simplified teammate navigation to use only Shift+Down (with wrapping) instead of both Shift+Up and Shift+Down.
- Fixed an issue where a single file write/edit error would abort all other parallel file write/edit operations. Independent file mutations now complete even when a sibling fails.
- Added `last_assistant_message` field to Stop and SubagentStop hook inputs, providing the final assistant response text so hooks can access it without parsing transcript files.
- Fixed custom session titles set via `/rename` being lost after resuming a conversation (anthropics/claude-code#23610)
- Fixed collapsed read/search hint text overflowing on narrow terminals by truncating from the start.
- Fixed an issue where bash commands with backslash-newline continuation lines (e.g., long commands split across multiple lines with `\`) would produce spurious empty arguments, potentially breaking command execution.
- Fixed built-in slash commands (`/help`, `/model`, `/compact`, etc.) being hidden from the autocomplete dropdown when many user skills are installed (anthropics/claude-code#22020)
- Fixed MCP servers not appearing in the MCP Management Dialog after deferred loading
- Fixed session name persisting in status bar after `/clear` command (anthropics/claude-code#26082)
- Fixed crash when a skill's `name` or `description` in SKILL.md frontmatter is a bare number (e.g., `name: 3000`) — the value is now properly coerced to a string (anthropics/claude-code#25837)
- Fixed /resume silently dropping sessions when the first message exceeds 16KB or uses array-format content (anthropics/claude-code#25721)
- Added `chat:newline` keybinding action for configurable multi-line input (anthropics/claude-code#26075)
- Added `added_dirs` to the statusline JSON `workspace` section, exposing directories added via `/add-dir` to external scripts (anthropics/claude-code#26096)
- Fixed `claude doctor` misclassifying mise and asdf-managed installations as native installs (anthropics/claude-code#26033)
- Fixed zsh heredoc failing with "read-only file system" error in sandboxed commands (anthropics/claude-code#25990)
- Fixed agent progress indicator showing inflated tool use count (anthropics/claude-code#26023)
- Fixed image pasting not working on WSL2 systems where Windows copies images as BMP format (anthropics/claude-code#25935)
- Fixed background agent results returning raw transcript data instead of the agent's final answer (anthropics/claude-code#26012)
- Fixed Warp terminal incorrectly prompting for Shift+Enter setup when it supports it natively (anthropics/claude-code#25957)
- Fixed CJK wide characters causing misaligned timestamps and layout elements in the TUI (anthropics/claude-code#26084)
- Fixed custom agent `model` field in `.claude/agents/*.md` being ignored when spawning team teammates (anthropics/claude-code#26064)
- Fixed plan mode being lost after context compaction, causing the model to switch from planning to implementation mode (anthropics/claude-code#26061)
- Fixed `alwaysThinkingEnabled: true` in settings.json not enabling thinking mode on Bedrock and Vertex providers (anthropics/claude-code#26074)
- Fixed `tool_decision` OTel telemetry event not being emitted in headless/SDK mode (anthropics/claude-code#26059)
- Fixed session name being lost after context compaction — renamed sessions now preserve their custom title through compaction (anthropics/claude-code#26121)
- Increased initial session count in resume picker from 10 to 50 for faster session discovery (anthropics/claude-code#26123)
- Windows: fixed worktree session matching when drive letter casing differs (anthropics/claude-code#26123)
- Fixed `/resume <session-id>` failing to find sessions whose first message exceeds 16KB (anthropics/claude-code#25920)
- Fixed "Always allow" on multiline bash commands creating invalid permission patterns that corrupt settings (anthropics/claude-code#25909)
- Fixed React crash (error #31) when a skill's `argument-hint` in SKILL.md frontmatter uses YAML sequence syntax (e.g., `[topic: foo | bar]`) — the value is now properly coerced to a string (anthropics/claude-code#25826)
- Fixed crash when using `/fork` on sessions that used web search — null entries in search results from transcript deserialization are now handled gracefully (anthropics/claude-code#25811)
- Fixed read-only git commands triggering FSEvents file watcher loops on macOS by adding --no-optional-locks flag (anthropics/claude-code#25750)
- Fixed custom agents and skills not being discovered when running from a git worktree — project-level `.claude/agents/` and `.claude/skills/` from the main repository are now included (anthropics/claude-code#25816)
- Fixed non-interactive subcommands like `claude doctor` and `claude plugin validate` being blocked inside nested Claude sessions (anthropics/claude-code#25803)
- Windows: Fixed the same CLAUDE.md file being loaded twice when drive letter casing differs between paths (anthropics/claude-code#25756)
- Fixed inline code spans in markdown being incorrectly parsed as bash commands (anthropics/claude-code#25792)
- Fixed teammate spinners not respecting custom spinnerVerbs from settings (anthropics/claude-code#25748)
- Fixed shell commands permanently failing after a command deletes its own working directory (anthropics/claude-code#26136)
- Fixed hooks (PreToolUse, PostToolUse) silently failing to execute on Windows by using Git Bash instead of cmd.exe (anthropics/claude-code#25981)
- Fixed LSP `findReferences` and other location-based operations returning results from gitignored files (e.g., `node_modules/`, `venv/`) (anthropics/claude-code#26051)
- Moved config backup files from home directory root to `~/.claude/backups/` to reduce home directory clutter (anthropics/claude-code#26130)
- Fixed sessions with large first prompts (>16KB) disappearing from the /resume list (anthropics/claude-code#26140)
- Fixed shell functions with double-underscore prefixes (e.g., `__git_ps1`) not being preserved across shell sessions (anthropics/claude-code#25824)
- Fixed spinner showing "0 tokens" counter before any tokens have been received (anthropics/claude-code#26105)
- VSCode: Fixed conversation messages appearing dimmed while the AskUserQuestion dialog is open (anthropics/claude-code#26078)
- Fixed background tasks failing in git worktrees due to remote URL resolution reading from worktree-specific gitdir instead of the main repository config (anthropics/claude-code#26065)
- Fixed Right Alt key leaving visible `[25~` escape sequence residue in the input field on Windows/Git Bash terminals (anthropics/claude-code#25943)
- The `/rename` command now updates the terminal tab title by default (anthropics/claude-code#25789)
- Fixed Edit tool silently corrupting Unicode curly quotes (\u201c\u201d \u2018\u2019) by replacing them with straight quotes when making edits (anthropics/claude-code#26141)
- Fixed OSC 8 hyperlinks only being clickable on the first line when link text wraps across multiple terminal lines.

## 2.1.46

- Fixed orphaned CC processes after terminal disconnect on macOS
- Added support for using claude.ai MCP connectors in Claude Code

## 2.1.45

- Added support for Claude Sonnet 4.6
- Added support for reading `enabledPlugins` and `extraKnownMarketplaces` from `--add-dir` directories
- Added `spinnerTipsOverride` setting to customize spinner tips — configure `tips` with an array of custom tip strings, and optionally set `excludeDefault: true` to show only your custom tips instead of the built-in ones
- Added `SDKRateLimitInfo` and `SDKRateLimitEvent` types to the SDK, enabling consumers to receive rate limit status updates including utilization, reset times, and overage information
- Fixed Agent Teams teammates failing on Bedrock, Vertex, and Foundry by propagating API provider environment variables to tmux-spawned processes (anthropics/claude-code#23561)
- Fixed sandbox "operation not permitted" errors when writing temporary files on macOS by using the correct per-user temp directory (anthropics/claude-code#21654)
- Fixed Task tool (backgrounded agents) crashing with a `ReferenceError` on completion (anthropics/claude-code#22087)
- Fixed autocomplete suggestions not being accepted on Enter when images are pasted in the input
- Fixed skills invoked by subagents incorrectly appearing in main session context after compaction
- Fixed excessive `.claude.json.backup` files accumulating on every startup
- Fixed plugin-provided commands, agents, and hooks not being available immediately after installation without requiring a restart
- Improved startup performance by removing eager loading of session history for stats caching
- Improved memory usage for shell commands that produce large output — RSS no longer grows unboundedly with command output size
- Improved collapsed read/search groups to show the current file or search pattern being processed beneath the summary line while active
- [VSCode] Improved permission destination choice (project/user/session) to persist across sessions

## 2.1.44

- Fixed ENAMETOOLONG errors for deeply-nested directory paths
- Fixed auth refresh errors

## 2.1.43

- Fixed AWS auth refresh hanging indefinitely by adding a 3-minute timeout
- Fixed spurious warnings for non-agent markdown files in `.claude/agents/` directory
- Fixed structured-outputs beta header being sent unconditionally on Vertex/Bedrock

## 2.1.42

- Improved startup performance by deferring Zod schema construction
- Improved prompt cache hit rates by moving date out of system prompt
- Added one-time Opus 4.6 effort callout for eligible users
- Fixed /resume showing interrupt messages as session titles
- Fixed image dimension limit errors to suggest /compact

## 2.1.41

- Added guard against launching Claude Code inside another Claude Code session
- Fixed Agent Teams using wrong model identifier for Bedrock, Vertex, and Foundry customers
- Fixed a crash when MCP tools return image content during streaming
- Fixed /resume session previews showing raw XML tags instead of readable command names
- Improved model error messages for Bedrock/Vertex/Foundry users with fallback suggestions
- Fixed plugin browse showing misleading "Space to Toggle" hint for already-installed plugins
- Fixed hook blocking errors (exit code 2) not showing stderr to the user
- Added `speed` attribute to OTel events and trace spans for fast mode visibility
- Added `claude auth login`, `claude auth status`, and `claude auth logout` CLI subcommands
- Added Windows ARM64 (win32-arm64) native binary support
- Improved `/rename` to auto-generate session name from conversation context when called without arguments
- Improved narrow terminal layout for prompt footer
- Fixed file resolution failing for @-mentions with anchor fragments (e.g., `@README.md#installation`)
- Fixed FileReadTool blocking the process on FIFOs, `/dev/stdin`, and large files
- Fixed background task notifications not being delivered in streaming Agent SDK mode
- Fixed cursor jumping to end on each keystroke in classifier rule input
- Fixed markdown link display text being dropped for raw URL
- Fixed auto-compact failure error notifications being shown to users
- Fixed permission wait time being included in subagent elapsed time display
- Fixed proactive ticks firing while in plan mode
- Fixed clear stale permission rules when settings change on disk
- Fixed hook blocking errors showing stderr content in UI

## 2.1.39

- Improved terminal rendering performance
- Fixed fatal errors being swallowed instead of displayed
- Fixed process hanging after session close
- Fixed character loss at terminal screen boundary
- Fixed blank lines in verbose transcript view

## 2.1.38

- Fixed VS Code terminal scroll-to-top regression introduced in 2.1.37
- Fixed Tab key queueing slash commands instead of autocompleting
- Fixed bash permission matching for commands using environment variable wrappers
- Fixed text between tool uses disappearing when not using streaming
- Fixed duplicate sessions when resuming in VS Code extension
- Improved heredoc delimiter parsing to prevent command smuggling
- Blocked writes to `.claude/skills` directory in sandbox mode

## 2.1.37

- Fixed an issue where /fast was not immediately available after enabling /extra-usage

## 2.1.36

- Fast mode is now available for Opus 4.6. Learn more at https://code.claude.com/docs/en/fast-mode

## 2.1.34

- Fixed a crash when agent teams setting changed between renders
- Fixed a bug where commands excluded from sandboxing (via `sandbox.excludedCommands` or `dangerouslyDisableSandbox`) could bypass the Bash ask permission rule when `autoAllowBashIfSandboxed` was enabled

## 2.1.33

- Fixed agent teammate sessions in tmux to send and receive messages
- Fixed warnings about agent teams not being available on your current plan
- Added `TeammateIdle` and `TaskCompleted` hook events for multi-agent workflows
- Added support for restricting which sub-agents can be spawned via `Task(agent_type)` syntax in agent "tools" frontmatter
- Added `memory` frontmatter field support for agents, enabling persistent memory with `user`, `project`, or `local` scope
- Added plugin name to skill descriptions and `/skills` menu for better discoverability
- Fixed an issue where submitting a new message while the model was in extended thinking would interrupt the thinking phase
- Fixed an API error that could occur when aborting mid-stream, where whitespace text combined with a thinking block would bypass normalization and produce an invalid request
- Fixed API proxy compatibility issue where 404 errors on streaming endpoints no longer triggered non-streaming fallback
- Fixed an issue where proxy settings configured via `settings.json` environment variables were not applied to WebFetch and other HTTP requests on the Node.js build
- Fixed `/resume` session picker showing raw XML markup instead of clean titles for sessions started with slash commands
- Improved error messages for API connection failures — now shows specific cause (e.g., ECONNREFUSED, SSL errors) instead of generic "Connection error"
- Errors from invalid managed settings are now surfaced
- VSCode: Added support for remote sessions, allowing OAuth users to browse and resume sessions from claude.ai
- VSCode: Added git branch and message count to the session picker, with support for searching by branch name
- VSCode: Fixed scroll-to-bottom under-scrolling on initial session load and session switch

## 2.1.32

- Claude Opus 4.6 is now available!
- Added research preview agent teams feature for multi-agent collaboration (token-intensive feature, requires setting CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1)
- Claude now automatically records and recalls memories as it works
- Added "Summarize from here" to the message selector, allowing partial conversation summarization.
- Skills defined in `.claude/skills/` within additional directories (`--add-dir`) are now loaded automatically.
- Fixed `@` file completion showing incorrect relative paths when running from a subdirectory
- Updated --resume to re-use --agent value specified in previous conversation by default.
- Fixed: Bash tool no longer throws "Bad substitution" errors when heredocs contain JavaScript template literals like `${index + 1}`, which previously interrupted tool execution
- Skill character budget now scales with context window (2% of context), so users with larger context windows can see more skill descriptions without truncation
- Fixed Thai/Lao spacing vowels (สระ า, ำ) not rendering correctly in the input field
- VSCode: Fixed slash commands incorrectly being executed when pressing Enter with preceding text in the input field
- VSCode: Added spinner when loading past conversations list

## 2.1.31

- Added session resume hint on exit, showing how to continue your conversation later
- Added support for full-width (zenkaku) space input from Japanese IME in checkbox selection
- Fixed PDF too large errors permanently locking up sessions, requiring users to start a new conversation
- Fixed bash commands incorrectly reporting failure with "Read-only file system" errors when sandbox mode was enabled
- Fixed a crash that made sessions unusable after entering plan mode when project config in `~/.claude.json` was missing default fields
- Fixed `temperatureOverride` being silently ignored in the streaming API path, causing all streaming requests to use the default temperature (1) regardless of the configured override
- Fixed LSP shutdown/exit compatibility with strict language servers that reject null params
- Improved system prompts to more clearly guide the model toward using dedicated tools (Read, Edit, Glob, Grep) instead of bash equivalents (`cat`, `sed`, `grep`, `find`), reducing unnecessary bash command usage
- Improved PDF and request size error messages to show actual limits (100 pages, 20MB)
- Reduced layout jitter in the terminal when the spinner appears and disappears during streaming
- Removed misleading Anthropic API pricing from model selector for third-party provider (Bedrock, Vertex, Foundry) users

## 2.1.30

- Added `pages` parameter to the Read tool for PDFs, allowing specific page ranges to be read (e.g., `pages: "1-5"`). Large PDFs (>10 pages) now return a lightweight reference when `@` mentioned instead of being inlined into context.
- Added pre-configured OAuth client credentials for MCP servers that don't support Dynamic Client Registration (e.g., Slack). Use `--client-id` and `--client-secret` with `claude mcp add`.
- Added `/debug` for Claude to help troubleshoot the current session
- Added support for additional `git log` and `git show` flags in read-only mode (e.g., `--topo-order`, `--cherry-pick`, `--format`, `--raw`)
- Added token count, tool uses, and duration metrics to Task tool results
- Added reduced motion mode to the config
- Fixed phantom "(no content)" text blocks appearing in API conversation history, reducing token waste and potential model confusion
- Fixed prompt cache not correctly invalidating when tool descriptions or input schemas changed, only when tool names changed
- Fixed 400 errors that could occur after running `/login` when the conversation contained thinking blocks
- Fixed a hang when resuming sessions with corrupted transcript files containing `parentUuid` cycles
- Fixed rate limit message showing incorrect "/upgrade" suggestion for Max 20x users when extra-usage is unavailable
- Fixed permission dialogs stealing focus while actively typing
- Fixed subagents not being able to access SDK-provided MCP tools because they were not synced to the shared application state
- Fixed a regression where Windows users with a `.bashrc` file could not run bash commands
- Improved memory usage for `--resume` (68% reduction for users with many sessions) by replacing the session index with lightweight stat-based loading and progressive enrichment
- Improved `TaskStop` tool to display the stopped command/task description in the result line instead of a generic "Task stopped" message
- Changed `/model` to execute immediately instead of being queued
- [VSCode] Added multiline input support to the "Other" text input in question dialogs (use Shift+Enter for new lines)
- [VSCode] Fixed duplicate sessions appearing in the session list when starting a new conversation

## 2.1.29

- Fixed startup performance issues when resuming sessions that have `saved_hook_context`

## 2.1.27

- Added tool call failures and denials to debug logs
- Fixed context management validation error for gateway users, ensuring `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` avoids the error
- Added `--from-pr` flag to resume sessions linked to a specific GitHub PR number or URL
- Sessions are now automatically linked to PRs when created via `gh pr create`
- Fixed /context command not displaying colored output
- Fixed status bar duplicating background task indicator when PR status was shown
- Windows: Fixed bash command execution failing for users with `.bashrc` files
- Windows: Fixed console windows flashing when spawning child processes
- VSCode: Fixed OAuth token expiration causing 401 errors after extended sessions

## 2.1.25

- Fixed beta header validation error for gateway users on Bedrock and Vertex, ensuring `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` avoids the error

## 2.1.23

- Added customizable spinner verbs setting (`spinnerVerbs`)
- Fixed mTLS and proxy connectivity for users behind corporate proxies or using client certificates
- Fixed per-user temp directory isolation to prevent permission conflicts on shared systems
- Fixed a race condition that could cause 400 errors when prompt caching scope was enabled
- Fixed pending async hooks not being cancelled when headless streaming sessions ended
- Fixed tab completion not updating the input field when accepting a suggestion
- Fixed ripgrep search timeouts silently returning empty results instead of reporting errors
- Improved terminal rendering performance with optimized screen data layout
- Changed Bash commands to show timeout duration alongside elapsed time
- Changed merged pull requests to show a purple status indicator in the prompt footer
- [IDE] Fixed model options displaying incorrect region strings for Bedrock users in headless mode

## 2.1.22

- Fixed structured outputs for non-interactive (-p) mode

## 2.1.21

- Added support for full-width (zenkaku) number input from Japanese IME in option selection prompts
- Fixed shell completion cache files being truncated on exit
- Fixed API errors when resuming sessions that were interrupted during tool execution
- Fixed auto-compact triggering too early on models with large output token limits
- Fixed task IDs potentially being reused after deletion
- Fixed file search not working in VS Code extension on Windows
- Improved read/search progress indicators to show "Reading…" while in progress and "Read" when complete
- Improved Claude to prefer file operation tools (Read, Edit, Write) over bash equivalents (cat, sed, awk)
- [VSCode] Added automatic Python virtual environment activation, ensuring `python` and `pip` commands use the correct interpreter (configurable via `claudeCode.usePythonEnvironment` setting)
- [VSCode] Fixed message action buttons having incorrect background colors

## 2.1.20

- Added arrow key history navigation in vim normal mode when cursor cannot move further
- Added external editor shortcut (Ctrl+G) to the help menu for better discoverability
- Added PR review status indicator to the prompt footer, showing the current branch's PR state (approved, changes requested, pending, or draft) as a colored dot with a clickable link
- Added support for loading `CLAUDE.md` files from additional directories specified via `--add-dir` flag (requires setting `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`)
- Added ability to delete tasks via the `TaskUpdate` tool
- Fixed session compaction issues that could cause resume to load full history instead of the compact summary
- Fixed agents sometimes ignoring user messages sent while actively working on a task
- Fixed wide character (emoji, CJK) rendering artifacts where trailing columns were not cleared when replaced by narrower characters
- Fixed JSON parsing errors when MCP tool responses contain special Unicode characters
- Fixed up/down arrow keys in multi-line and wrapped text input to prioritize cursor movement over history navigation
- Fixed draft prompt being lost when pressing UP arrow to navigate command history
- Fixed ghost text flickering when typing slash commands mid-input
- Fixed marketplace source removal not properly deleting settings
- Fixed duplicate output in some commands like `/context`
- Fixed task list sometimes showing outside the main conversation view
- Fixed syntax highlighting for diffs occurring within multiline constructs like Python docstrings
- Fixed crashes when cancelling tool use
- Improved `/sandbox` command UI to show dependency status with installation instructions when dependencies are missing
- Improved thinking status text with a subtle shimmer animation
- Improved task list to dynamically adjust visible items based on terminal height
- Improved fork conversation hint to show how to resume the original session
- Changed collapsed read/search groups to show present tense ("Reading", "Searching for") while in progress, and past tense ("Read", "Searched for") when complete
- Changed `ToolSearch` results to appear as a brief notification instead of inline in the conversation
- Changed the `/commit-push-pr` skill to automatically post PR URLs to Slack channels when configured via MCP tools
- Changed the `/copy` command to be available to all users
- Changed background agents to prompt for tool permissions before launching
- Changed permission rules like `Bash(*)` to be accepted and treated as equivalent to `Bash`
- Changed config backups to be timestamped and rotated (keeping 5 most recent) to prevent data loss

## 2.1.19

- Added env var `CLAUDE_CODE_ENABLE_TASKS`, set to `false` to keep the old system temporarily
- Added shorthand `$0`, `$1`, etc. for accessing individual arguments in custom commands
- Fixed crashes on processors without AVX instruction support
- Fixed dangling Claude Code processes when terminal is closed by catching EIO errors from `process.exit()` and using SIGKILL as fallback
- Fixed `/rename` and `/tag` not updating the correct session when resuming from a different directory (e.g., git worktrees)
- Fixed resuming sessions by custom title not working when run from a different directory
- Fixed pasted text content being lost when using prompt stash (Ctrl+S) and restore
- Fixed agent list displaying "Sonnet (default)" instead of "Inherit (default)" for agents without an explicit model setting
- Fixed backgrounded hook commands not returning early, potentially causing the session to wait on a process that was intentionally backgrounded
- Fixed file write preview omitting empty lines
- Changed skills without additional permissions or hooks to be allowed without requiring approval
- Changed indexed argument syntax from `$ARGUMENTS.0` to `$ARGUMENTS[0]` (bracket syntax)
- [SDK] Added replay of `queued_command` attachment messages as `SDKUserMessageReplay` events when `replayUserMessages` is enabled
- [VSCode] Enabled session forking and rewind functionality for all users

## 2.1.18

- Added customizable keyboard shortcuts. Configure keybindings per context, create chord sequences, and personalize your workflow. Run `/keybindings` to get started. Learn more at https://code.claude.com/docs/en/keybindings

## 2.1.17

- Fixed crashes on processors without AVX instruction support

## 2.1.16

- Added new task management system, including new capabilities like dependency tracking
- [VSCode] Added native plugin management support
- [VSCode] Added ability for OAuth users to browse and resume remote Claude sessions from the Sessions dialog
- Fixed out-of-memory crashes when resuming sessions with heavy subagent usage
- Fixed an issue where the "context remaining" warning was not hidden after running `/compact`
- Fixed session titles on the resume screen not respecting the user's language setting
- [IDE] Fixed a race condition on Windows where the Claude Code sidebar view container would not appear on start

## 2.1.15

- Added deprecation notification for npm installations - run `claude install` or see https://docs.anthropic.com/en/docs/claude-code/getting-started for more options
- Improved UI rendering performance with React Compiler
- Fixed the "Context left until auto-compact" warning not disappearing after running `/compact`
- Fixed MCP stdio server timeout not killing child process, which could cause UI freezes
