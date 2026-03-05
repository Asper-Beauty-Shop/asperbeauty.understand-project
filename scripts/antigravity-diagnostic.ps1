# Antigravity Toolkit diagnostic - process check
# Run: powershell -NoProfile -File "scripts\antigravity-diagnostic.ps1"
$ErrorActionPreference = 'SilentlyContinue'
Get-Process | Where-Object { $_.ProcessName -match 'language|antigravity' } | Select-Object Id, ProcessName, Path | Format-Table -AutoSize
if (-not $?) { Write-Host "No matching processes (language_server_windows_x64.exe / Antigravity not running)." }
