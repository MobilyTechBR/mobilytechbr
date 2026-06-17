param(
  [string]$Url = "https://chatgpt.com",
  [int]$Port = 9222,
  [string]$ProfileDir = "$env:LOCALAPPDATA\MobilyTechBR\automation-profiles\edge-cdp"
)

$ErrorActionPreference = "Stop"

$edgeCandidates = @(
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
)

$edgePath = $edgeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edgePath) {
  throw "Microsoft Edge nao encontrado nos caminhos padrao."
}

New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null

$arguments = @(
  "--remote-debugging-port=$Port",
  "--user-data-dir=$ProfileDir",
  "--no-first-run",
  "--no-default-browser-check",
  $Url
)

Start-Process -FilePath $edgePath -ArgumentList $arguments
Start-Sleep -Seconds 2

try {
  $version = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 5
  [pscustomobject]@{
    ok = $true
    browser = $version.Browser
    webSocketDebuggerUrl = $version.webSocketDebuggerUrl
    profileDir = $ProfileDir
    port = $Port
    url = $Url
  } | ConvertTo-Json -Depth 4
} catch {
  [pscustomobject]@{
    ok = $false
    error = $_.Exception.Message
    profileDir = $ProfileDir
    port = $Port
    url = $Url
  } | ConvertTo-Json -Depth 4
}
