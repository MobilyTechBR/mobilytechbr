param(
  [int]$Port = 9222,
  [string]$NodeExe = "C:\Users\MF\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe",
  [string]$NodeModules = "C:\Users\MF\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $NodeExe)) {
  throw "Node.js do runtime Codex nao encontrado em $NodeExe"
}

if (-not (Test-Path $NodeModules)) {
  throw "node_modules do runtime Codex nao encontrado em $NodeModules"
}

$env:NODE_PATH = "$NodeModules;$NodeModules\.pnpm\node_modules"

$script = @"
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:$Port');
  const contexts = browser.contexts();
  const pageObjects = contexts.flatMap((context) => context.pages());
  const pages = [];

  for (const page of pageObjects) {
    pages.push({
      title: await page.title().catch(() => ''),
      url: page.url(),
    });
  }

  console.log(JSON.stringify({
    ok: true,
    port: $Port,
    contexts: contexts.length,
    pages,
  }, null, 2));

  // Nao chamar browser.close() aqui: em conexao CDP isso encerra o Chrome.
  // Encerrar apenas este processo Node fecha o socket e mantem o Chrome aberto.
  setTimeout(() => process.exit(0), 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"@

& $NodeExe -e $script
