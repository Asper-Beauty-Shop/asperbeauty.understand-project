# Antigravity Language Server Diagnostic Script
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\antigravity-diagnostic.ps1"
#
# Checks whether the Antigravity language server process is running on this machine.
# Mirrors the process check performed by the Antigravity Toolkit VS Code/Cursor extension
# so you can diagnose "no_process" / quota failures without needing the extension UI.

$ProcessName = "language_server_windows_x64"
$FullExe     = "$ProcessName.exe"

Write-Host "=== Antigravity Language Server Diagnostic ===" -ForegroundColor Cyan
Write-Host "Searching for process: $FullExe"
Write-Host ""

$processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "FOUND: $($processes.Count) instance(s) of $FullExe running." -ForegroundColor Green
    $processes | Format-Table Id, Name, CPU, WorkingSet -AutoSize
    Write-Host ""
    Write-Host "Status: CONNECTED — the Antigravity Toolkit should be able to reach the language server." -ForegroundColor Green
    exit 0
} else {
    Write-Host "NOT FOUND: no $FullExe process detected." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Status: no_process" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "What this means:" -ForegroundColor Cyan
    Write-Host "  The Antigravity Toolkit extension connects to an external Antigravity process"
    Write-Host "  (e.g. Antigravity IDE or its language server).  Until that process is running,"
    Write-Host "  the Toolkit will report 'no_process' and 'Cannot fetch quota: server info not available'."
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Start Antigravity IDE (or the app that launches $FullExe)."
    Write-Host "  2. Reload Cursor / run this script again to confirm the process is detected."
    Write-Host "  3. If you do not use Antigravity, disable or uninstall the 'Toolkit for Antigravity'"
    Write-Host "     extension in Cursor to stop the repeated connection attempts."
    exit 0
}
