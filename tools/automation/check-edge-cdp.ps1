param(
  [int]$Port = 9222
)

$ErrorActionPreference = "Stop"

try {
  $version = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 5
  $tabs = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/list" -TimeoutSec 5
  [pscustomobject]@{
    ok = $true
    browser = $version.Browser
    webSocketDebuggerUrl = $version.webSocketDebuggerUrl
    tabCount = @($tabs).Count
    firstTabs = @($tabs | Select-Object -First 5 | ForEach-Object {
      [pscustomobject]@{
        title = $_.title
        url = $_.url
        type = $_.type
      }
    })
  } | ConvertTo-Json -Depth 5
} catch {
  [pscustomobject]@{
    ok = $false
    error = $_.Exception.Message
  } | ConvertTo-Json -Depth 4
}
