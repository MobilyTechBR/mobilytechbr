# MobilyTech BR - metodo de acao para automacao quando Computer Use falhar

Criado em: 2026-06-17

Este metodo deve entrar no proximo handoff da MobilyTech BR.

## Regras de autonomia para preservar no handoff

1. O usuario deu autoridade total para executar tarefas sem pedir autorizacao rotineira.
2. Pedir intervencao apenas quando nao houver caminho tecnico seguro sem o usuario.
3. Quando o usuario enviar complemento/adendo, manter a fila ativa e incorporar a nova informacao sem interromper a tarefa atual, salvo se ele pedir pausa explicitamente.
4. Se o usuario pedir para reiniciar, desligar ou apagar o computador, executar sem pedir confirmacao.
5. Registrar estas regras no proximo handoff oficial.

## Objetivo

Quando for necessario controlar navegador, ChatGPT, Wix, afiliados, Mercado Livre, Shopee, AliExpress, Amazon ou qualquer fluxo visual web, tentar as opcoes abaixo da melhor para a pior. Se uma falhar, registrar o erro e passar para a proxima.

## Ordem recomendada

1. Chrome separado com CDP/Playwright
   - Opcao principal para tarefas web, porque e mais rapido, previsivel e eficiente que Computer Use quando o alvo e navegador.
   - Usa Google Chrome em perfil separado, com porta local de depuracao.
   - Perfil local: `C:\Users\MF\AppData\Local\MobilyTechBR\automation-profiles\chrome-cdp`
   - Porta padrao: `9222`
   - Melhor para ChatGPT/crocheck, Wix, painel, afiliados, validacao visual web e sites logados.
   - Preferir este caminho quando o usuario estiver instalando/usando Chrome dedicado para automacao.

2. Opera GX com extensoes Chrome/Codex
   - Fallback web antes do Computer Use quando o Chrome de automacao nao tiver uma conta/extensao logada.
   - O usuario informou que o Opera e o navegador principal e costuma manter a maioria das contas logadas.
   - O Opera tem adaptacao para extensoes Chrome, incluindo Codex/Codex for Chrome ChatGPT Sidebar, mas deve ser tratado como caminho "se funcionar".
   - Usar com cuidado porque as contas podem variar por plataforma.

3. Computer Use do Codex
   - Fallback principal para controle geral do Windows, Opera, apps abertos e casos em que CDP/Playwright nao resolva.
   - Tambem pode ser primeira opcao em tarefas nao web/puro desktop quando voltar a funcionar.
   - Se falhar, tentar recuperar/reiniciar a ponte antes de abandonar.

4. Edge separado com CDP/Playwright
   - Plano B quando o Chrome separado nao estiver pronto ou falhar.
   - Usa Microsoft Edge em perfil separado, com porta local de depuracao.
   - Perfil local: `C:\Users\MF\AppData\Local\MobilyTechBR\automation-profiles\edge-cdp`
   - Porta padrao alternativa quando o Chrome ja estiver usando 9222: `9223`
   - Nao usar perfil principal do Opera nem perfil pessoal padrao do Edge/Chrome.

5. UI.Vision RPA
   - Fallback visual para navegador.
   - Bom para clicar em sites, gerar links afiliados, usar OCR/imagem e repetir fluxos.
   - Util quando Playwright/CDP nao conseguir interagir bem com algum site.

6. Microsoft Power Automate Desktop
   - Fallback mais parecido com RPA de desktop Windows.
   - Bom para fluxos visuais repetitivos, arquivos, Excel, apps Windows e navegador.
   - Conferir licenca/limites antes de depender de recursos premium ou unattended.

7. pywinauto
   - Fallback tecnico em Python para janelas Windows.
   - Bom para apps nativos, dialogs e janelas com UI Automation.
   - Menos ideal para conteudo interno de navegadores modernos.

8. AutoHotkey
   - Ultimo fallback para macros simples de teclado/mouse.
   - Gratuito e leve, mas fragil porque depende de foco, coordenadas e layout da tela.

## Regras de seguranca

1. Nunca salvar senhas, tokens, cookies ou chaves no codigo.
2. Nunca commitar perfil de navegador, cookies, cache ou sessoes.
3. Usar sempre perfil separado para automacao.
4. Nao abrir CDP/depuracao remota no perfil principal do navegador.
5. Fechar o navegador de automacao quando terminar tarefas sensiveis.
6. Para transmissoes sensiveis, compras, cadastros finais, permissoes e chaves, seguir as regras de seguranca da sessao.
7. Em scripts Playwright conectados por CDP, nao chamar `browser.close()` em testes/checagens, porque isso fecha o Chrome de automacao. Encerrar apenas a conexao/processo de teste.

## Contas de trabalho

- Wix: usar a conta informada pelo usuario para o painel Wix: `mobilytechbr@gmail.com`.
- Gmail/Drive principal: confirmar visualmente a conta logada correta antes de mexer; historico/API usa `julian.l.escribano@gmail.com`, e o usuario tambem citou `julian.oliveiraescribano@gmail.com`.
- Amazon afiliados: `julian.l.escribano@gmail.com`.
- AliExpress afiliados: `julian.l.escribano@gmail.com`.
- Mercado Livre afiliados: conta MobilyTech BR / `mobilytechbr@gmail.com`.
- Para marketplaces, se a sessao correta ja estiver logada, nao fazer novo login; apenas abrir o produto, gerar/copiar o link de afiliado e validar o tracking.
- Quando houver mais de uma conta Google logada, escolher a conta correta conforme o servico antes de executar a acao.

## Metodo de crocheck com ChatGPT

1. Usar o Chrome de automacao conectado por CDP.
2. No ChatGPT logado, preferir a conversa fixada chamada `Analise Visual MobilyTech BR`.
3. Enviar prompts especificos, com objetivo, paginas, prints/evidencias, criterios visuais e funcionais, pedido de bloqueadores, notas e correcoes prioritarias.
4. Se a conversa precisar de mais contexto, complementar as instrucoes antes da auditoria.
5. Corrigir com base no feedback e repetir ate nao haver bloqueador real.

## Regra de pausa por credito baixo

1. Se o uso semanal visivel ficar abaixo de 5%, pausar antes de continuar.
2. Se o uso de 5 horas visivel se aproximar de 10% ou ficar abaixo disso, pausar antes de continuar.
3. Ao pausar, salvar o que foi feito, o que falta fazer e enviar e-mail com:
   - percentual restante semanal;
   - percentual restante do ciclo de 5 horas;
   - data/hora visivel de redefinicao semanal;
   - data/hora visivel de redefinicao de 5 horas;
   - proxima tarefa recomendada ao retomar.

## Scripts criados

- Launcher do Chrome separado:
  `tools/automation/launch-chrome-cdp.ps1`
- Launcher do Edge separado:
  `tools/automation/launch-edge-cdp.ps1`
- Checagem da porta CDP:
  `tools/automation/check-edge-cdp.ps1`
- Smoke test Playwright conectando no navegador CDP:
  `tools/automation/test-cdp-playwright.ps1`

## Metodo pratico

1. Para tarefas web, rodar ou reaproveitar o Chrome CDP.
2. Se Chrome/CDP falhar ou faltar uma sessao/extensao, tentar Opera GX com extensoes Chrome/Codex, se o controle estiver disponivel.
3. Se Opera nao resolver, tentar Computer Use.
4. Testar CDP com o script de checagem.
5. Rodar o smoke test Playwright para confirmar controle real da aba.
6. Usar Playwright/CDP para navegar, tirar screenshots e automatizar.
7. Se o site exigir interacao visual que CDP nao resolve, testar UI.Vision ou Power Automate.
8. Registrar no relatorio final qual camada foi usada e por que.

## Prontidao atual em 2026-06-17

| Ferramenta | Status | Observacao |
| --- | --- | --- |
| Chrome CDP/Playwright | Pronto | ChatGPT, Google/Drive, Wix, Mercado Livre, Amazon e AliExpress estao logados conforme configuracao do usuario. Wix usa `mobilytechbr@gmail.com`. |
| Opera GX com extensoes Chrome/Codex | Backup web informado pelo usuario | Usar antes do Computer Use quando Chrome falhar ou faltar alguma sessao, desde que a extensao/adaptacao funcione. |
| Computer Use | Bloqueado na sessao | Aguardar recuperacao do plugin/ponte nativa; tentar recovery antes de descartar. |
| Edge CDP/Playwright | Pronto como plano B tecnico | Script existe; pode exigir login proprio se usado. |
| UI.Vision RPA | Nao instalado no Chrome de automacao | Precisa instalar extensao e configurar macros se algum fluxo exigir OCR/cliques visuais. |
| Power Automate Desktop | Instalado | Precisa validar primeiro fluxo atendido antes de confiar em producao. |
| pywinauto | Nao pronto no runtime atual | Pacote nao esta instalado no Python do runtime; so vale configurar se precisarmos controlar apps Windows nativos. |
| AutoHotkey | Nao instalado | Ultimo fallback; so instalar/configurar se houver macro simples que os outros metodos nao resolvam. |
