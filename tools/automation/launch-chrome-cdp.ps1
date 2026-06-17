param(
  [string]$Url = "https://chatgpt.com",
  [int]$Port = 9222,
  [string]$ProfileDir = "$env:LOCALAPPDATA\MobilyTechBR\automation-profiles\chrome-cdp"
)

$ErrorActionPreference = "Stop"

$chromeCandidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chromePath = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chromePath) {
  throw "Google Chrome nao encontrado nos caminhos padrao."
}

New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null

$arguments = @(
  "--remote-debugging-port=$Port",
  "--user-data-dir=$ProfileDir",
  "--no-first-run",
  "--no-default-browser-check",
  $Url
)

Start-Process -FilePath $chromePath -ArgumentList $arguments
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
