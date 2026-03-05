<#
.SYNOPSIS
    Antigravity Diagnostic — run the same process checks the extension uses.

.DESCRIPTION
    Replicates the process checks performed by the Cursor Antigravity extension
    without $_ being stripped when the script is invoked from an external shell
    (cmd.exe, bash, etc.).  Because the logic lives inside a .ps1 file, the
    PowerShell runtime owns variable expansion and $_ is never touched by the
    calling shell.

.PARAMETER SiteUrl
    Base URL of the Asper Beauty Shop deployment to verify.
    Defaults to the SITE_URL environment variable, then the production URL.

.EXAMPLE
    pwsh -File scripts/antigravity-diagnostic.ps1

.EXAMPLE
    pwsh -File scripts/antigravity-diagnostic.ps1 -SiteUrl http://localhost:8080
#>

[CmdletBinding()]
param(
    [string]$SiteUrl = $(if ($env:SITE_URL) { $env:SITE_URL } else { 'https://asperbeautyshop-com.lovable.app' })
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Continue'

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Write-Check {
    param([bool]$Ok, [string]$Label, [string]$Detail = '')
    $icon  = if ($Ok) { '[+]' } else { '[!]' }
    $color = if ($Ok) { 'Green' } else { 'Yellow' }
    Write-Host "$icon $Label" -ForegroundColor $color
    if ($Detail) { Write-Host "    $Detail" -ForegroundColor DarkGray }
}

function Test-ProcessRunning {
    param([string]$Name, [string]$DisplayName = '')
    if (-not $DisplayName) { $DisplayName = $Name }

    # $_ is intentionally used here so the same pipeline expression that the
    # extension executes works correctly when read from a .ps1 file.
    $procs = Get-Process -ErrorAction SilentlyContinue |
             Where-Object { $_.Name -like "*$Name*" }

    $found = @($procs).Count -gt 0
    $detail = if ($found) {
        "PID(s): $(($procs | ForEach-Object { $_.Id }) -join ', ')"
    } else {
        'Not running'
    }
    Write-Check -Ok $found -Label $DisplayName -Detail $detail
    return $found
}

function Test-TcpPort {
    param([int]$Port, [string]$DisplayName = '')
    if (-not $DisplayName) { $DisplayName = "TCP :$Port" }

    $conn = $null
    try {
        $conn = [System.Net.Sockets.TcpClient]::new('127.0.0.1', $Port)
        $conn.Close()
        Write-Check -Ok $true -Label $DisplayName -Detail "Port $Port is open"
        return $true
    } catch {
        Write-Check -Ok $false -Label $DisplayName -Detail "Port $Port is closed"
        return $false
    }
}

function Test-HttpEndpoint {
    param([string]$Url, [string]$DisplayName = '', [int]$ExpectedStatus = 200)
    if (-not $DisplayName) { $DisplayName = $Url }

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing `
                        -TimeoutSec 10 -ErrorAction Stop
        $ok     = $response.StatusCode -eq $ExpectedStatus
        $detail = "HTTP $($response.StatusCode)"
        Write-Check -Ok $ok -Label $DisplayName -Detail $detail
        return $ok
    } catch [System.Net.WebException] {
        $code   = [int]$_.Exception.Response.StatusCode
        $detail = "HTTP $code"
        $ok     = $code -eq $ExpectedStatus
        Write-Check -Ok $ok -Label $DisplayName -Detail $detail
        return $ok
    } catch {
        Write-Check -Ok $false -Label $DisplayName -Detail $_.Exception.Message
        return $false
    }
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

$sep = '=' * 60

Write-Host ''
Write-Host '  Antigravity Diagnostic — Asper Beauty Shop' -ForegroundColor Cyan
Write-Host "  Site : $SiteUrl" -ForegroundColor DarkCyan
Write-Host "  Time : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor DarkCyan
Write-Host $sep

$results = [System.Collections.Generic.List[bool]]::new()

# ── Runtime processes ──────────────────────────────────────────────────────
Write-Host ''
Write-Host '  Runtime Processes' -ForegroundColor White
Write-Host ('-' * 40)

$results.Add((Test-ProcessRunning 'node'   'Node.js'))
$results.Add((Test-ProcessRunning 'bun'    'Bun'))
$results.Add((Test-ProcessRunning 'cursor' 'Cursor editor'))
$results.Add((Test-ProcessRunning 'code'   'VS Code'))

# ── Dev-server ports ───────────────────────────────────────────────────────
Write-Host ''
Write-Host '  Dev-Server Ports' -ForegroundColor White
Write-Host ('-' * 40)

$results.Add((Test-TcpPort 8080 'Vite dev server  (:8080)'))
$results.Add((Test-TcpPort 5173 'Vite alt port    (:5173)'))
$results.Add((Test-TcpPort 54321 'Supabase local  (:54321)'))

# ── Remote endpoints ───────────────────────────────────────────────────────
Write-Host ''
Write-Host '  Remote Endpoints' -ForegroundColor White
Write-Host ('-' * 40)

$results.Add((Test-HttpEndpoint "$SiteUrl/"       'Homepage'))
$results.Add((Test-HttpEndpoint "$SiteUrl/health" 'Health endpoint'))

# ── Summary ────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host $sep
$passed = @($results | Where-Object { $_ -eq $true }).Count
$total  = $results.Count

if ($passed -eq $total) {
    Write-Host "  PASSED  $passed/$total checks passed" -ForegroundColor Green
    exit 0
} else {
    $failed = $total - $passed
    Write-Host "  PARTIAL  $passed/$total checks passed  ($failed not running / unreachable)" `
               -ForegroundColor Yellow
    exit 1
}
