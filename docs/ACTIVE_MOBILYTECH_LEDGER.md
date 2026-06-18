# MobilyTech BR - Ledger ativo

Este arquivo existe para evitar perda de sequencia quando o contexto for compactado automaticamente.

## Regra operacional

- Mensagens novas do usuario durante uma tarefa longa sao complementos por padrao.
- Nao substituir tarefas anteriores por um complemento, salvo se o usuario disser explicitamente que e um fechamento, cancelamento ou mudanca de prioridade.
- Depois de compactacao automatica, retomar pelo plano ativo, por este ledger e pelo estado real dos arquivos, nao pela ultima frase isolada antes da compactacao.
- Nao reabrir itens ja resolvidos apenas porque apareceram perto da linha de compactacao.
- Se houver duvida, verificar o arquivo, a pagina ou o conector atual antes de responder como se o tema ainda estivesse aberto.
- Autonomia do agente: em 2026-06-16 o usuario autorizou fazer automaticamente tudo que for necessario e seguro, usando APIs, plugins, Browser, Computer Use, Opera GX/Chrome ou painel logado quando for mais eficiente. So agrupar e pedir intervencao do usuario quando for realmente impossivel concluir sem acao humana. Nunca expor tokens, senhas, chaves, secrets ou credenciais em chat, repo, docs, prints ou logs.
- Status por e-mail: em 2026-06-16 o usuario pediu que cada etapa concluida do plano seja avisada por e-mail curto, com nome da etapa, pequeno resumo e proximo passo. Se uma etapa travar e precisar de intervencao humana, enviar e-mail com o bloqueio e a acao exata. Antes de desistir de API/ponte/plugin, pesquisar e tentar recuperar/contornar por conta propria, especialmente Computer Use.

## Estado em andamento

- Verificado em 2026-06-15: `https://mobilytechbr.vercel.app` responde com a fase 2 correta (`MobilyTech BR | Loja gamer`, `MOBMEN` e `MobilyTech Finds`). Runtime Vercel sem erros recentes apos commit `15cbd7c`.
- Verificado em 2026-06-15: `https://www.mobilytech.com.br` ainda serve o site Wix antigo/generico (`Inicio | MobilyTech BR`, contem `NovoTec`, nao contem `MOBMEN`). DNS de `www.mobilytech.com.br` ainda aponta para `wixdns.net`.
- A ponte dominio oficial -> visual Vercel ainda exige configuracao de dominio/DNS/Vercel. A API Wix de Domain DNS usa API key e nao o token comum do conector; nao tentar mudanca DNS sem endpoint/schema confirmado ou intervencao segura do painel.
- Fechar carrinho com cupom, retirada local e frete de fornecedor separado do Melhor Envio.
- Completar suporte backend para cupom local `MOBMEN` sem criar nova Vercel Function.
- Manter dropshipping com frete cobrado do cliente, origem nacional/internacional e margem editavel no painel.
- Complementar painel com origem, lucro estimado, margem e registro de venda para Planilha OLX.
- Atualizar modelo do Google Apps Script para a Planilha OLX correta, sem sobrescrever script antigo do usuario.
- Regenerar o site fase 2, validar desktop/mobile, busca, carrinho, frete, checkout e painel.
- Preparar ponte Wix/Headless e dominio oficial como etapa de publicacao/integração, preservando visual Vercel.
- Registro manual de venda no painel e somente para vendas fora do site: OLX, Facebook Marketplace e atendimento direto. Esse registro existe para controle financeiro/planilha, porque essas plataformas ja fazem sua propria mediacao com o cliente.
- Venda feita pelo checkout do site deve seguir fluxo automatico: confirmar pagamento, disparar e-mails/status do pedido e baixar estoque dos produtos fisicos vendidos.
- Produtos fisicos da MobilyTech BR (PCs, SSDs, fontes e pecas em estoque local) tem estoque unitario por padrao e nao podem ser adicionados ao carrinho mais de uma vez nem com quantidade maior que 1. Produtos de dropshipping/fornecedor podem aceitar quantidade maior.
- Apps Wix conectados/logados pelo usuario em 2026-06-15: Modalyst, Dropi e AI Product Images aparecem no painel. Avaliar se ajudam no backend de dropshipping e tratamento de imagem, mas nao substituir foto real do produto por imagem inventada se isso reduzir fidelidade. AI Product Images so deve ser usado se melhorar recorte/luz sem cortar, distorcer ou esconder detalhe do produto; validar visualmente e por crocheck.
- Ao fechar a etapa atual: rodar verificacao funcional completa (botoes, links, busca, carrinho, cupom, frete, checkout, painel e formularios), depois crocheck visual com ChatGPT para todas as secoes desktop/mobile, corrigir bloqueadores, enviar e-mail resumido com link/status e listar intervencoes do usuario com links exatos se ainda houver bloqueio.
- Em 2026-06-16 o usuario pediu explicitamente para parar a implementacao e gerar handoff mesmo com pendencias abertas, porque a compactacao/contexto estava atrapalhando a continuidade. Handoff criado em `docs/HANDOFF_MOBILYTECHBR_2026-06-16.md`, com copias em `C:\Users\MF\Documents\BACKUPSSITECODEX\HANDOFF_MOBILYTECHBR_2026-06-16.md` e `C:\Users\MF\Documents\New project\HANDOFF_MOBILYTECHBR_2026-06-16.md`. A proxima conversa deve continuar a partir dele; nao tratar a geracao do handoff como conclusao do projeto.
- Depois de tudo concluido e do e-mail final enviado, se for desligar o PC, agendar desligamento com temporizador de 10 minutos para permitir cancelamento/intervencao do usuario antes do desligamento efetivo. Nao desligar imediatamente.
- Complemento de e-mails transacionais: revisar/criar modelos bonitos e responsivos para cliente e vendedor, com logo MobilyTech BR, paleta branca/azul clara atual, cards com cantos arredondados e texto descontraido para cliente. Vendedor recebe dados operacionais completos; cliente recebe somente informacoes necessarias. Assuntos de teste devem explicitar CLIENTE ou VENDEDOR. Enviar rascunhos/testes para o e-mail MobilyTech e usar crocheck com ChatGPT para escrita e visual antes de considerar os modelos finais.

## Atualizacao 2026-06-16 - retomada apos handoff

- Foram lidos, nesta ordem, `docs/HANDOFF_MOBILYTECHBR_2026-06-16.md`, este ledger, `MOBILYTECH_STATE.md`, `docs/wix-hybrid-premium-status-2026-06-15.md` e `docs/phase2-final-qa-2026-06-15.md`.
- Antes das alteracoes, foi criado backup datado: `C:\Users\MF\Documents\BACKUPSSITECODEX\MobilyTechBR_backup_pre_changes_2026-06-16_122553.zip`. Tambem existe copia em `C:\Users\MF\Documents\GitHub\mobilytechbr\backups\MobilyTechBR_backup_pre_changes_2026-06-16_122553.zip`.
- Corrigido `scripts\build_phase2_ibuy_style.py`: o template JS `Qtd. ${quantity}` foi escapado dentro da f-string Python como `Qtd. ${{quantity}}`.
- O gerador `scripts\build_phase2_ibuy_style.py` rodou com sucesso e regenerou `index.html`, `fase2-hibrida.html` e paginas em `fase2/`.
- `node --check` passou usando Node local do Codex para libs/APIs existentes. A pasta `api/` tem 11 arquivos `.js`, abaixo do limite Hobby de 12 Serverless Functions.
- Teste Node de frete/quantidade confirmou: item fornecedor quantidade 3 com frete unitario 12 totaliza frete 36; item fisico quantidade 2 bloqueia com `PHYSICAL_PRODUCT_SINGLE_QUANTITY`.
- QA local em `http://127.0.0.1:4173/?qa=2026-06-16-local` passou para: home desktop, busca por `PNY`, item fisico sem duplicar no carrinho, `MobilyTech Finds` permitindo `Qtd. 2`, cupom `MOBMEN` em PC com desconto de R$ 48, retirada local em produto fisico e frete direto fornecedor via `api/shipping-quote.js` com quantidade 2 retornando R$ 59,80.
- Auditoria Browser desktop das paginas `Home`, `Ofertas`, `MobilyTech Finds`, `Limpeza`, `Montagem`, `Avaliacoes`, `Minha conta` e `Contato`: sem overflow horizontal, sem imagens quebradas, sem termos publicos proibidos e sem logs de erro/warn.
- Auditoria mobile 390x844 da home: sem overflow horizontal real, sem imagens quebradas e sem logs de erro/warn.
- Painel `admin/index.html` carregou localmente sem overflow horizontal, sem imagens quebradas e sem logs de erro/warn.
- Nao foi publicado/pushado nada nesta retomada. Git e Node continuam fora do PATH do PowerShell; foi usado runtime local do Codex para Node/Python.
- Pendente real: crocheck visual final com ChatGPT/Computer Use quando a ferramenta estiver disponivel, publicacao apos validacao final, revisao/implementacao restante de e-mails transacionais, login seguro/headless, Apps Script/Planilha OLX e ponte dominio/Wix conforme regras do handoff.

## Atualizacao 2026-06-16 - salvaguarda Apps Script/Planilha OLX

- O usuario reforcou que a Planilha OLX ja tem Apps Script para relatorio mensal/organizacao; portanto, qualquer nova automacao deve evitar conflito com o codigo existente.
- Verificacao em modo somente leitura no Apps Script mostrou o projeto `MobilyTech Relatorio Mensal` apontando para a planilha `1Wc_ctkvNJh-64Yg30EHGBCjylL92s2BDtXbNhug0VsQ`, com `SALES_SHEET = 'Vendas_PCs'`, `SUMMARY_SHEET = 'Resumo_Mensal'`, relatorio mensal e automacao de ordenacao.
- A automacao de ordenacao trata `Vendas_PCs` como tabela `A:I` e usa colunas auxiliares `AA:AB`; por isso, nao adicionar colunas extras em `Vendas_PCs`.
- O projeto vivo `Pos Venda MobilyTechBR` foi visto como legado/outro contexto: ele apontava para outra planilha e nao deve ser sobrescrito automaticamente sem plano de migracao e autorizacao.
- Nenhum Apps Script vivo nem planilha Google foi editado nesta etapa. As mudancas foram apenas locais em `docs/google-apps-script/mobilytech-pos-venda.gs` e `docs/google-apps-script/README-pos-venda.md`.
- Decisao tecnica local: `registerManualSale_` continua escrevendo somente as 9 colunas financeiras originais em `Vendas_PCs`; metadados extras (`Canal`, `ProdutoID`, `Status no Site`, observacoes e timestamp) vao para a aba separada `Vendas_PCs_Metadata`.
- `docs/google-apps-script/mobilytech-pos-venda.gs` compilou localmente via parser Node (`vm.Script`) sem erro. `api/register-sale.js` passou `node --check` e, sem `ADMIN_WRITE_TOKEN`, retorna 501 controlado com `needsConfig: true`.
- Antes de publicar/colar Apps Script em ambiente vivo: manter o projeto mensal intacto e preferir Web App separado para pos-venda/ponte; se for preciso mexer no Apps Script vivo, fazer backup e pedir confirmacao com link/acao exata.

## Atualizacao 2026-06-16 - e-mails de pagamento pendente

- O template local do Apps Script agora cobre tambem `PENDENTE`/`PENDING`/`AGUARDANDO_PAGAMENTO`: envia e-mail ao cliente informando pedido recebido e pagamento pendente, com controle `EmailClientePagamentoPendenteEnviado` na aba `Pedidos`.
- `ordersSheet_()` passou a garantir os headers de `Pedidos` via `ensureSheet_()`, para reduzir risco se o Web App for atualizado e alguem esquecer de rodar `setupMobilyTechPostSale()` antes do trigger.
- `sendTestTransactionalEmails()` inclui agora o teste `[TESTE CLIENTE] Pedido recebido, pagamento pendente`.
- `api/create-preference.js` e `api/create-abacate-checkout.js` nao criam novas Vercel Functions; ambos tentam avisar `ORDER_NOTIFICATION_ENDPOINT` em modo best-effort depois de criar o checkout, com `order_status=PENDENTE`. Sem `ORDER_NOTIFICATION_ENDPOINT`, o checkout continua normal e o aviso fica marcado como `skipped`.
- Para evitar duplicidade entre pedido pendente e aprovado, Mercado Pago passou a gravar uma `order_reference` unica nos metadados e Abacate Pay usa `orderReference`/`externalId`. Os webhooks aprovados usam essa referencia como `payment_id` interno e preservam o ID real do provedor em `provider_payment_id`.
- `node --check` passou para `api/create-preference.js`, `api/create-abacate-checkout.js`, `api/mercado-pago-webhook.js` e `api/abacate-pay-webhook.js`. O Apps Script local compilou via `vm.Script`. A pasta `api/` segue com 11 arquivos `.js`.
- Pendente antes de considerar isso vivo: publicar/atualizar Web App Apps Script separado com seguranca, configurar `ORDER_NOTIFICATION_ENDPOINT` na Vercel e enviar e-mails de teste reais para `mobilytechbr@gmail.com`.

## Atualizacao 2026-06-16 - Wix/dominio/login

- Verificacao ao vivo: Vercel direto `https://mobilytechbr.vercel.app/?qa=2026-06-16-status` respondeu 200 com fase 2 (`MobilyTech BR | Loja gamer`, `MOBMEN`, `MobilyTech Finds`).
- Dominio oficial `https://www.mobilytech.com.br/?qa=2026-06-16-status` respondeu 200 como pagina Wix (`Inicio | MobilyTech BR`) com iframe/ponte para `mobilytechbr.vercel.app`; o HTML externo nao contem diretamente os textos da fase 2.
- Subrota direta `https://www.mobilytech.com.br/fase2/ofertas.html?qa=2026-06-16-status` ainda retorna 404. Workaround por query `?mtbPath=%2Ffase2%2Fofertas.html` ainda responde 200 e contem a ponte.
- Favicon do dominio oficial ainda e o padrao Wix `https://static.parastorage.com/client/pfavico.ico`; trocar para a logo MobilyTech BR segue pendente por painel/editor Wix ou API especifica confirmada.
- Conector Wix confirmou site canonico `85e985c5-2904-452f-85e2-a98f6d3b1cac`: Premium, Published, custom domain, Velo enabled, Members Area e Stores V3.
- Conector Vercel confirmou projeto `mobilytechbr` (`prj_ljqtPnKqvLMRUio4bMAWMtNaGeWz`) e que `www.mobilytech.com.br` ainda nao esta anexado ao Vercel. Dominios Vercel atuais: `mobilytechbr.vercel.app`, `mobilytechbr-mobily-tech-s-projects.vercel.app`, `mobilytechbr-git-main-mobily-tech-s-projects.vercel.app`.
- Login real/headless continua bloqueado por armazenamento seguro de segredo OAuth/env vars. Nao criar Wix Headless OAuth App nem botao social real ate haver caminho confirmado para salvar segredo sem expor credenciais.

## Atualizacao 2026-06-16 - publicacao, dominio oficial e crocheck

- Publicacao Vercel concluida no `main` com commit `d46d9e2`; deployment production mais recente verificado: `mobilytechbr-8goam0hpd-mobily-tech-s-projects.vercel.app`, estado `READY`.
- Apps Script separado de pos-venda foi atualizado no projeto `MobilyTech Relatorio Mensal` sem sobrescrever a rotina mensal existente. `setupMobilyTechPostSale` rodou com sucesso. A planilha manteve `Vendas_PCs` em `A:I`; metadados extras ficam em `Vendas_PCs_Metadata`.
- Web App Apps Script de pos-venda foi publicado e validado por `doGet` 200. A URL completa do Web App foi configurada na Vercel em `ORDER_NOTIFICATION_ENDPOINT` e `SALES_REGISTRATION_ENDPOINT` como variaveis sensiveis de Production. Nao registrar a URL completa em docs ou chat.
- `ADMIN_WRITE_TOKEN` segue intencionalmente nao configurado; por isso `api/register-sale.js` retorna 501 controlado para registro manual/admin ate existir plano seguro de segredo.
- QA production em Vercel apos redeploy passou em desktop e mobile para home, busca `PNY`, carrinho com quantidade de fornecedor e assets sem quebrar. Evidencias em `docs/qa/production-final-2026-06-16-env-redeploy/`.
- Crocheck inicial com ChatGPT em modo `muito alto` marcou a versao como boa visualmente, mas bloqueou publicacao final porque `https://www.mobilytech.com.br/fase2/ofertas.html` retornava 404 direto no dominio oficial.
- Correcao aplicada: no Wix DNS, `www.mobilytech.com.br` foi alterado de `cdn1.wixdns.net` para o CNAME Vercel `3d53bf07e7cc5a82.vercel-dns-017.com`. O dominio raiz `mobilytech.com.br` foi mantido nos tres A records Wix originais para preservar o redirecionamento 301 para `www`.
- Vercel Domains marcou `www.mobilytech.com.br` como `Valid Configuration` em Production. O registro apex `mobilytech.com.br` aparece invalido na Vercel porque permanece intencionalmente servido pelo Wix como redirect para `www`; isso nao bloqueia o dominio oficial `www`.
- Validacao HTTP externa: `https://www.mobilytech.com.br/`, `/fase2/ofertas.html`, `/assets/mobilytech-logo.png`, `/data/products.json`, `/data/addons.json` e `/data/swaps.json` responderam 200 via Vercel. `https://mobilytech.com.br/` respondeu 301 via Wix para `https://www.mobilytech.com.br/`.
- Prova de paridade: `https://www.mobilytech.com.br/fase2/ofertas.html` e `https://mobilytechbr.vercel.app/fase2/ofertas.html` retornaram HTML byte a byte identico, SHA-256 `a36c60e328345a139fc1acb5b735bc9533b42d16935f45565d89e591266798ae`. Evidencia salva em `docs/qa/production-final-2026-06-16-env-redeploy/official-domain-byte-compare.json`.
- Observacao de propagacao/cache: Opera GX e o Browser interno ainda podiam mostrar 404 Wix na subrota durante a janela de cache DNS antiga. Isso foi classificado como cache local/propagacao; resolvers externos e HTTP direto ja resolvem `www` para Vercel.
- Crocheck follow-up com ChatGPT confirmou: blocker de rota direta resolvido, publicacao real aprovada, nota final 9,1/10, sem blockers restantes. Recomendou apenas smoke test operacional final como validacao nao bloqueante.
- E-mails de etapa enviados ao usuario: levantamento/preparacao, publicacao/QA Vercel, autorizacao Apps Script, Apps Script/endpoints Vercel e dominio oficial `www` na Vercel.
- Pendencias reais restantes: configurar `ADMIN_WRITE_TOKEN` somente por canal seguro, rodar testes reais dos e-mails transacionais, concluir login/headless se houver armazenamento seguro de OAuth secret, decidir se o favicon/home raiz Wix devem migrar depois, e investigar o crash/fechamento do Codex por ultimo conforme pedido do usuario.

## Atualizacao 2026-06-16 - investigacao Codex/Opera

- Investigacao local por ultimo conforme pedido do usuario: pasta Crashpad do Codex contem dumps em `C:\Users\MF\AppData\Local\Packages\OpenAI.Codex_2p2nqsd0c76g0\LocalCache\Roaming\Codex\web\Codex\Crashpad\reports`, com arquivos de 2026-06-16 13:32 e 13:42. Sem simbolos/debugger, nao foi possivel determinar stack exata a partir dos `.dmp`.
- Windows Event Viewer nas ultimas horas nao mostrou `Application Error` direto para Codex, mas mostrou `APPCRASH` do Opera GX `132.0.5905.43` em `opera_browser.dll`, excecao `0xc0000005`, e historico de `LiveKernelEvent`/watchdog de GPU. A tentativa de Opera headless para screenshot tambem travou/crashou e foi encerrada por filtro de perfil temporario, sem fechar o Opera normal.
- Mitigacao operacional adotada: nao usar Browser interno para Google OAuth/Apps Script; preferir Opera normal via painel quando houver login humano, conectores oficiais quando existirem, e shell/HTTP para QA de dominio. Evitar Opera headless neste ambiente.
- Para evitar perda de continuidade se o Codex/WebView fechar de novo: manter `docs/HANDOFF_MOBILYTECHBR_2026-06-16.md`, este ledger e `MOBILYTECH_STATE.md` atualizados; enviar e-mails de etapa; criar/atualizar handoff sempre que a fila longa ficar vulneravel a compactacao ou crash.
- Nao foi aplicada mudanca de sistema/driver/GPU nem limpeza destrutiva de Crashpad, para preservar evidencia e evitar risco fora do escopo do site.

## Atualizacao 2026-06-16 - fechamento das pendencias restantes

- `ADMIN_WRITE_TOKEN`: producao ainda retornou 501 em `https://www.mobilytech.com.br/api/register-sale` sem token, confirmando ausencia da env var. Um token forte foi gerado localmente, sem imprimir o valor, e salvo com DPAPI em `C:\Users\MF\Documents\BACKUPSSITECODEX\MobilyTechBR_secrets\admin-write-token.dpapi.txt`. Helper para o usuario copiar o valor: `C:\Users\MF\Documents\BACKUPSSITECODEX\MobilyTechBR_secrets\copy-admin-token-to-clipboard.ps1`.
- Intervencao enviada por e-mail: o usuario precisa adicionar `ADMIN_WRITE_TOKEN` na Vercel como Environment Variable sensivel de Production. Motivo: conector Vercel atual nao expoe gravacao de env vars; Vercel CLI nao esta instalada/autenticada; Browser integrado caiu no login; Opera normal abriu a Vercel logada, mas Computer Use detectou controle manual e a pagina nao ficou acessivel o bastante para salvar segredo com seguranca.
- E-mails transacionais: `scripts/render_email_previews.js` regenerou 11 previews a partir de `docs/google-apps-script/mobilytech-pos-venda.gs`; todos foram enviados como e-mails reais para `me`/conta MobilyTech com assuntos `[TESTE CLIENTE]` ou `[TESTE VENDEDOR]` e confirmados no Gmail em `SENT`.
- Complemento do usuario aplicado: os e-mails de vendedor mantiveram a estrutura aprovada, mas agora usam tema visual proprio em azul mais escuro, faixa superior discreta e botoes/blocos no mesmo tom. `scripts/render_email_previews.js` agora limpa `docs/email-previews` antes de renderizar para evitar evidencia velha. Cinco testes `[TESTE VENDEDOR - AJUSTE COR]` foram enviados para a conta MobilyTech.
- Favicon/home: `www.mobilytech.com.br` ja serve Vercel e a home retorna `MobilyTech BR | Loja gamer` com link para `assets/favicon.png`. Foi encontrada lacuna em `/favicon.ico` direto retornando 404; foram adicionados `favicon.ico`, `favicon.png` e `apple-touch-icon.png` na raiz publica para fechar esse fallback apos deploy.
- Wix logo: Site Properties do Wix para o site canonico `85e985c5-2904-452f-85e2-a98f6d3b1cac` ja mostra `siteDisplayName`/`businessName` como `MobilyTech BR` e `logo` configurado. Como o `www` esta na Vercel, favicon Wix antigo nao e blocker do cliente.
- Login/headless: docs oficiais Wix confirmam que Create OAuth App retorna `secret`; nao criar OAuth App nem botao de login social real ate haver caminho seguro para gravar segredo direto em env vars. `fase2/minha-conta.html` permanece como consulta/atendimento de pedido, sem login fake.

## Atualizacao 2026-06-16 - ADMIN_WRITE_TOKEN configurado pelo usuario

- Usuario informou que configurou `ADMIN_WRITE_TOKEN` na Vercel e executou redeploy. Validacao segura em producao com token propositalmente errado retornou 401, nao 501; isso confirma que a env var esta ativa sem registrar venda.
- Para permitir validacao completa sem poluir a planilha, `api/register-sale.js` ganhou `dryRun: true` ou `mode: "auth-check"` depois da validacao do token. O modo retorna `authenticated: true` sem chamar o Apps Script/upstream.
- Teste local do endpoint passou: token correto + `dryRun` retorna 200; token errado retorna 401. Proximo passo apos publicar este commit: testar `https://www.mobilytech.com.br/api/register-sale` com o token real em `dryRun`, sem imprimir segredo.

## Atualizacao 2026-06-16 - deploy final 99106c0 validado

- Commit `99106c0` (`Finalize admin token and seller emails`) foi enviado para `origin/main` e a Vercel criou o deploy de producao `dpl_BHy7ttr5FocwThk5wHazzgzwQ32M`, estado `READY`, URL `mobilytechbr-7padblzj9-mobily-tech-s-projects.vercel.app`.
- QA HTTP em `https://www.mobilytech.com.br` com `qa=99106c0`: home, `/fase2/ofertas.html`, `/fase2/minha-conta.html`, `/favicon.ico`, `/favicon.png` e `/apple-touch-icon.png` retornaram 200 via `Server: Vercel`.
- `ADMIN_WRITE_TOKEN` em producao: token errado retornou 401; token correto descriptografado localmente e usado somente em `dryRun` retornou 200 com `authenticated:true` e `dryRun:true`. Nenhuma venda real foi registrada nesse teste.
- Apps Script: fonte local `docs/google-apps-script/mobilytech-pos-venda.gs` esta atualizada e testada por previews/e-mails. Qualquer publicacao no Apps Script vivo deve preservar a codificacao mensal ja existente na planilha; preferir projeto/Web App separado ou backup/compare antes de colar codigo.

## Atualizacao 2026-06-16 - fechamento investigacao Codex/Opera

- Checagem final dos ultimos logs mostrou `APPCRASH` do Opera GX `132.0.5905.43` em `opera_browser.dll`, excecao `0xc0000005`, as 13:50:02, alem de historico Windows `LiveKernelEvent`/watchdog GPU. O Event Viewer nao mostrou APPCRASH textual do Codex nas ultimas horas.
- Crashpad do Codex tem dumps recentes em `C:\Users\MF\AppData\Local\Packages\OpenAI.Codex_2p2nqsd0c76g0\LocalCache\Roaming\Codex\web\Codex\Crashpad\reports`, com arquivos as 13:32 e 13:42. A sessao atual do Codex continuou rodando depois disso.
- Mitigacao aplicada no fluxo: evitar Opera GX/Browser interno para OAuth/Apps Script e tarefas longas; usar conectores oficiais, Vercel/Gmail/Drive quando disponiveis, shell/HTTP para QA e Opera normal apenas quando login humano for indispensavel. Nao foi feita alteracao destrutiva de driver, perfil do navegador ou cache do Codex.

## Atualizacao 2026-06-16 - conta do cliente e consulta segura de pedidos

- Site fase 2 local: menu de perfil/dropdown, pagina `Minha conta`, cores de checkout, cupom sem exemplo visivel, painel privado e editor de conteudo foram implementados localmente e passaram QA no navegador interno.
- Allowlist admin correta registrada no codigo: `mobilytechbr@gmail.com` e `julian.l.escribano@gmail.com`; `mobilyfinds@gmail.com` nao deve ser usado.
- `api/register-sale.js` agora aceita sessao admin assinada ou token legado, mantendo `dryRun`/`mode: "auth-check"` para validar sem registrar venda.
- `docs/google-apps-script/mobilytech-pos-venda.gs` ganhou a acao `lookup-customer-orders` antes do fallback de `upsertOrder_`, evitando que uma consulta de historico vire pedido novo por engano.
- A consulta de pedidos e somente leitura, exige `CUSTOMER_ORDERS_TOKEN` nas propriedades do Apps Script, filtra por `ClienteEmail` e retorna apenas campos publicos da aba `Pedidos`; nao altera `Vendas_PCs`, nao toca `A:I`, nao chama GitHub e nao envia e-mails.
- Testes locais passaram: sintaxe do Apps Script via `vm.Script`, consulta com token ausente/errado sem retorno de dados e consulta com token correto retornando apenas o pedido do e-mail correspondente. Publicacao no Apps Script vivo ainda exige backup/compare por causa da rotina mensal existente.
- Validacao real em producao apos intervencao do usuario: Google OAuth foi configurado na Vercel, login real funcionou na pagina `Minha conta`, o Web App separado de pos-venda respondeu ativo, `CUSTOMER_ORDERS_TOKEN` foi salvo nas propriedades do Apps Script e em env vars sensiveis da Vercel, e a pagina `Minha conta` retornou `Nenhum pedido encontrado para este e-mail no momento`, confirmando Vercel -> Apps Script -> historico de pedidos conectado sem expor pedidos de outras contas.

## Atualizacao 2026-06-16 - MobilyTech Finds 50+50 e frete de fornecedor

- Fonte completa 50 dropshipping + 50 afiliados localizada em `C:\Users\MF\Documents\New project\build_mobilytech_fase1_products.mjs` e internalizada no repo como `data/finds-source-phase1-2026-06-13.json`, com origem, links, notas e contagens preservadas.
- `data/products.json` agora contem 59 produtos no total, sendo 51 `dropshipping`: os 50 itens da triagem fase 1 estao representados como produtos vendaveis, e o teclado ABNT2 antigo foi preservado como item extra ja existente.
- `data/phase2-finalists.json` agora tem 104 cards publicos: 50 manuais/vendidos pela MobilyTech e 54 recomendacoes afiliadas. Foram adicionadas 12 recomendacoes Shopee e `defaults.allowedAffiliatePlatforms` inclui Mercado Livre, Amazon, Shopee e AliExpress.
- Novo asset `assets/shopee-logo.svg`; gerador fase 2 e painel privado reconhecem Shopee em botoes e links. O painel `private/admin/index.html` ganhou coluna Shopee no editor de MobilyTech Finds.
- Todos os produtos de fornecedor tem frete com `originMode: supplier`, `customerPays: true`, regiao/prazo e `freightBasis` dizendo que o frete deve considerar a origem do fornecedor ate o cliente final.
- Carrinho fase 2 ganhou fallback local para carrinho composto apenas por MobilyTech Finds: seleciona `Fornecedor selecionado - Envio direto do fornecedor` com o frete fixo do produto quando a rota `/api/shipping-quote` nao esta disponivel em servidor estatico.
- `lib/fulfillment-shipping.js` agora enriquece `FornecedorItens` para vendedor com quantidade, canal de origem, link, backup, custo estimado, frete cobrado, prazo, base do frete, risco/checagem e instrucao truncada de compra/validacao.
- QA local: JSONs validos, sem IDs duplicados, sem imagens faltando, `scripts/build_phase2_ibuy_style.py` compila e regenera. Browser interno em `http://localhost:4173/fase2/achados.html` confirmou 50 vendidos, 54 recomendacoes, 12 botoes Shopee, 0 imagens quebradas, 0 erros de console e sem overflow.
- QA carrinho local: item novo `Dock station USB-C 8 em 1 com HDMI` entra no carrinho, cupom nao aparece para cliente novo, Mercado Pago segue amarelo solido, Abacate Pay verde solido, e frete direto selecionado totaliza R$ 178,90 (R$ 149,00 + R$ 29,90).
- Pendente antes de publicar essa etapa: deploy/QA production e smoke real de checkout para confirmar que os metadados `manual_fulfillment_items` chegam ao Apps Script/e-mail vendedor com o conteudo enriquecido.

## Atualizacao 2026-06-16 - PayPal e apps Wix gratuitos

- Avaliacao documentada em `docs/wix-paypal-apps-assessment-2026-06-16.md`.
- PayPal: nao adicionar agora como terceiro checkout vivo. No site Vercel atual, a integracao correta exigiria backend para criar/capturar pedidos, registro/webhook, tratamento de frete/cupom e secrets PayPal em Vercel. Manter Mercado Pago + Abacate Pay ate o fluxo atual estar publicado e validado.
- Wix conector: chamada atual retornou necessidade de reautenticacao antes de qualquer acao no app. Sem conexao ativa, nao instalar nem contratar apps por API.
- Apps de imagem: `AI Product Images` e o primeiro candidato gratuito para teste visual; `AI Product Photos and Images` fica como secundario. Testar apenas em imagens duplicadas/nao criticas e comparar com o metodo atual por crocheck antes de substituir o fluxo de imagem.
- Dropshipping Wix: `DSers` e o melhor candidato gratuito para AliExpress se a operacao migrar para Wix Stores; `AppScenic` pode ser avaliado para fornecedores alternativos, mas exige checagem de frete/preco Brasil.
- Rejeitados por enquanto: `Zonify` por ser trial/plano pago e `DropCommerce` porque a operacao util de importacao exige plano pago. `Product Upload` serve no maximo como teste limitado gratuito, nao como solucao permanente.
- Pendente se for testar no Wix: reautenticar o conector Wix ou usar painel Wix logado, confirmar o plano gratuito permanente na tela antes de qualquer instalacao e registrar evidencia visual.

## Atualizacao 2026-06-16 - correcao de cupom no carrinho

- Bug local encontrado no reteste pos-reboot: o navegador ainda preenchia `MOBMEN` no campo de cupom por persistencia antiga em `mobilytech-coupon-v1`, contrariando o pedido de nao entregar cupom pronto ao cliente.
- Correcao aplicada em `scripts/build_phase2_ibuy_style.py`: o site nao le mais nem grava o cupom em `localStorage`; no carregamento remove a chave legada quando disponivel. O cupom continua valido apenas se o cliente souber e digitar manualmente.
- Site regenerado e QA Browser local passou: item `Dock station USB-C 8 em 1 com HDMI` no carrinho com campo de cupom vazio, `MOBMEN` ausente da UI, Mercado Pago amarelo solido, Abacate Pay verde solido, sem logs de erro/warn.
- Frete fornecedor retestado no carrinho: CEP de teste retornou `Fornecedor selecionado - Envio direto do fornecedor`, frete R$ 29,90 e total R$ 178,90 para o produto de R$ 149,00.

## Atualizacao 2026-06-16 - crocheck local pos-retomada

- Evidencias salvas em `docs/qa/local-crocheck-2026-06-16-resume/`, incluindo screenshots desktop/mobile, relatorios JSON e `README.md` do crocheck.
- Limite da ferramenta: a descoberta nao expos Computer Use/ChatGPT externo nesta sessao retomada. Foi feito crocheck visual local pelo Codex/ChatGPT sobre screenshots; repetir a rodada externa quando a ferramenta visual estiver disponivel.
- Bloqueador visual encontrado e corrigido: no desktop, a nav textual tinha ficado longa e `Conta`/`Suporte` disputavam espaco com a busca. Solucao: remover `Conta` da nav textual, pois a conta agora fica no icone/dropdown; destacar o icone quando ativo/aberto; reduzir a busca desktop para 210px; reduzir gap da nav para 6px.
- Medicao final do header: `Conta` nao aparece mais como link textual, `Suporte` fica com 29,6px de folga antes da busca, sem overflow horizontal, sem imagens quebradas e sem logs de erro/warn.
- Checks finais locais: Home, Achados e Minha Conta em desktop e mobile sem overflow, sem imagens quebradas, sem `MOBMEN` visivel e sem logs de erro/warn.
- Achados renderizado localmente: 104 cards, 104 botoes, 50 botoes MobilyTech/carrinho, 54 botoes `Ver oferta`, 12 botoes Shopee.
- Carrinho fornecedor limpo: 1 unidade de `Dock station USB-C 8 em 1 com HDMI`, cupom vazio, frete fornecedor R$ 29,90, total R$ 178,90, Mercado Pago amarelo solido e Abacate Pay verde solido.
- Status: aprovado localmente para seguir a backup/deploy/QA production, mantendo como pendencia opcional/condicional a repeticao com ChatGPT externo quando o caminho de ferramenta estiver disponivel.

## Atualizacao 2026-06-16 - backup pre-publicacao pos-retomada

- Backup final antes de publicar esta leva criado em `C:\Users\MF\Documents\BACKUPSSITECODEX\MobilyTechBR_backup_pre_publish_2026-06-16_2026-06-16_194156.zip`.
- Tamanho aproximado: 431,14 MB.
- O backup excluiu `.git`, `node_modules` e a pasta local `backups` para evitar duplicacao pesada, preservando os arquivos atuais do site, dados, docs, assets e scripts.

## Atualizacao 2026-06-16 - consolidacao das rotas de conta/admin

- Pos-publicacao do commit `8582e03`, o HTML entrou em producao, mas as novas rotas separadas `/api/auth-session`, `/api/admin` e correlatas ainda retornavam 404 na Vercel; as APIs antigas continuavam respondendo.
- Correcao preparada localmente: as novas funcoes de conta, pedidos, OAuth e painel foram consolidadas em uma unica funcao `api/account.js`, com logica em `lib/account-handlers.js`.
- A pasta `api/` voltou a 12 funcoes publicas, preservando as 11 APIs antigas ja vivas e adicionando apenas a funcao unificada `account.js`.
- `vercel.json` agora reescreve os endpoints legados de conta para `api/account.js?action=...`, e `/admin` tambem passa pela mesma funcao protegida.
- O frontend gerado passou a consultar diretamente `/api/account?action=session` e `/api/account?action=customer-orders`; links de login/logout tambem apontam para a rota unificada.
- QA local sem segredos: sintaxe Node de `api/account.js` e `lib/account-handlers.js` passou; mocks confirmaram sessao 200, pedido sem login 401 e `/admin` sem sessao 401 com tela protegida.
- Commit final apos rebase sobre o commit automatico `f31e1a3` de recortes: `1f4d3c0` (`Consolidate account routes for Vercel`), enviado para `origin/main`.
- QA HTTP em producao `https://www.mobilytech.com.br` com `qa=1f4d3c0`: home 200 contendo `/api/account?action=session`; `/api/account?action=session` 200; endpoint legado `/api/auth-session` 200; `/admin` 401 com tela `Painel MobilyTech BR protegido`; `/private/admin/index.html` 404; `/api/register-sale` preservado com 405 em GET.
- QA HTTP no alias `https://mobilytechbr.vercel.app`: `/api/account?action=session` retornou 200 com JSON de sessao deslogada.
- QA Browser em producao salvo em `docs/qa/production-account-routes-2026-06-16-1f4d3c0/`: home, Achados, Minha Conta desktop e Achados mobile sem imagens quebradas, sem overflow horizontal, sem logs de erro/warn, e links de conta apontando para `/api/account`.

## Atualizacao 2026-06-16 - verificacao segura da Planilha OLX / Apps Script

- Verificacao somente leitura no Google Drive/Sheets da planilha `Planilha OLX` (`1Wc_ctkvNJh-64Yg30EHGBCjylL92s2BDtXbNhug0VsQ`) confirmou as abas atuais: `Vendas_PCs`, `Pedidos`, `Vendas_PCs_Metadata`, `Configuracoes`, `Revisao de precos`, `Novos anuncios`, `Estoque_Componentes` e `Resumo_Mensal`.
- `Vendas_PCs` continua com os 9 cabecalhos financeiros originais em `A:I`, preservando a base usada pelo relatorio mensal/organizacao existente. A planilha tem 28 colunas no grid, mas os dados oficiais de venda lidos continuam somente ate `Margem (%)`.
- `Pedidos` existe separado com os 30 cabecalhos de pos-venda, e `Vendas_PCs_Metadata` existe separado com metadados operacionais. Isso confirma que a arquitetura local evita gravar extras na tabela mensal.
- `Resumo_Mensal` existe e contem totais mensais formatados de custo, faturamento, lucro e margem; portanto nao se deve sobrescrever o projeto Apps Script mensal nem colar o script de pos-venda por cima dele.
- Busca Drive por MIME `application/vnd.google-apps.script` nao retornou projetos Apps Script; o conector atual nao permite auditar o codigo vivo do Apps Script. Sem acesso ao codigo vivo, qualquer publicacao deve continuar pela regra segura: backup/compare primeiro ou Web App separado.
- Producao indica `googleConfigured:false` e `microsoftConfigured:false` em `/api/account?action=session`; logo o teste real de login, painel admin e historico de pedidos esta bloqueado ate configurar OAuth/segredos em Vercel/provedores.

## Atualizacao 2026-06-16 - QA local do painel privado / miniatura de venda

- QA Browser local do painel em rota espelhada `/admin` salvo em `docs/qa/admin-sale-preview-2026-06-16-route/`.
- O seletor `Produto vendido` carregou 9 opcoes, selecionou `Fonte 750W 80 Plus Bronze NVINET - Lacrada - R$ 355,00` e exibiu a miniatura correspondente.
- Preview validado: `previewHidden:false`, titulo correto, specs `NVINET / NT750`, imagem `../assets/generated/fonte-750w-nvinet-80plus-bronze-cutout.png` renderizada com `naturalWidth:1400` e `naturalHeight:1400`.
- Sem overflow horizontal, sem imagens quebradas e sem logs warn/error na rota correta `/admin`.

## Atualizacao 2026-06-16 - intervencoes externas agrupadas por e-mail

- Producao confirmou `googleConfigured:false` e `microsoftConfigured:false`; portanto login real, painel admin autenticado e historico de pedidos por conta dependem de OAuth/env vars externas.
- Checagem local nao encontrou `gcloud`, `clasp`, `vercel` nem `npm` no PATH apos reboot; o conector Vercel disponivel nao expoe CRUD de env vars nem valores sensiveis.
- E-mail `MobilyTech BR - intervencoes necessarias para destravar login e pedidos` enviado para `me` com a lista agrupada: Google OAuth, Microsoft opcional, `AUTH_SESSION_SECRET`, `CUSTOMER_ORDERS_ENDPOINT`, `CUSTOMER_ORDERS_TOKEN`, acesso/backup do Apps Script vivo e reautenticacao Wix quando for testar apps/imagens.
- Enquanto isso nao for configurado, nao tentar criar pedido real nem colar Apps Script vivo: seguir apenas com validacoes locais/sem efeito colateral.

## Atualizacao 2026-06-16 - protecao contra e-mails de validacao

- Usuario avisou que recebeu e-mails de `Compra confirmada`/`voce vendeu no site` sem marcador de teste. Gmail mostrou quatro mensagens transacionais de validacao, sem produto/valor real de venda; foram tratadas como teste indesejado, nao como venda real.
- Causa provavel corrigida em duas camadas: as APIs de Mercado Pago/Abacate Pay nao usam mais `mobilytechbr@gmail.com` como fallback de e-mail de cliente, e o Apps Script agora rejeita payload incompleto antes de gravar pedido ou disparar e-mails.
- `docs/google-apps-script/mobilytech-pos-venda.gs` ganhou reconhecimento de `dry_run`/`dryRun`/`test_mode`/`validation_only`, validacao obrigatoria de venda real (`payment_id`, produto, valor e e-mail real do cliente) e filtro para nao reprocessar pedidos internos/teste na fila.
- O Apps Script vivo de pos-venda foi atualizado em deploy existente para `Versao 3` sem sobrescrever o projeto `MobilyTech Relatorio Mensal` nem mexer nas colunas `A:I` de `Vendas_PCs`. A URL do Web App nao foi registrada no repo/chat.
- Validacao viva: POST com `dry_run=true` retornou `dryRun:true` e `skipped:true`; POST incompleto retornou `ok:false` e erro controlado. Isso confirma que validacoes futuras nao gravam pedido nem enviam e-mails.
- Testes locais passaram: `node --check` em `api/create-preference.js`, `api/create-abacate-checkout.js`, `api/mercado-pago-webhook.js`, `api/abacate-pay-webhook.js`; fonte Apps Script validada por parser JS local.
- Publicacao Vercel: commit `6f2d8e0` publicou a barreira contra e-mails de validacao. O smoke conservador encontrou `500` em `GET` dos webhooks por import incorreto de `fulfillment-shipping`; commit `e13e4eb` corrigiu os imports para `../lib/fulfillment-shipping`.
- Deploy final `dpl_4Bjepjfw1w8fGqzsEimdYu4sr2Sa` (`e13e4eb`) ficou `READY`. Smoke HTTP no dominio oficial: home 200, `fase2/minha-conta.html` 200, `/api/account?action=session` 200 com Google configurado, `/admin` 401 protegido, checkouts em GET 405 e webhooks em GET 405. Logs Vercel da ultima janela nao mostraram novos 500.

## Atualizacao 2026-06-16/17 - Wix apps e imagens

- Conector Wix voltou a responder para o site canonico `85e985c5-2904-452f-85e2-a98f6d3b1cac`; API oficial de app instances retornou lista habilitada, mas sem nomes comerciais por `appDefId`.
- Avaliacao atualizada em `docs/wix-paypal-apps-assessment-2026-06-16.md`, usando painel Wix logado e paginas oficiais do App Market.
- `AI Product Images`: painel mostrou `20 creditos` no gratuito; App Market confirma plano gratuito. Decisao: nao serve para refazer todas as imagens atuais do Vercel em massa; testar apenas 1-2 imagens duplicadas/nao criticas se for necessario crocheck visual.
- `Dropi`: App Market informa free plan, mas painel MobilyTech mostrou `Trial Profissional`; pela regra do usuario, nao usar operacionalmente enquanto nao estiver claro que caiu em plano gratuito permanente.
- `Modalyst`: painel mostrou Hobby plan com `My Products 18`, `Sync List 17` e apenas `7 products left`; usar no maximo como aprendizado/teste, nao como escala de catalogo.
- `Zonify`: App Market mostra trial de 3 dias e planos pagos; rejeitado por nao atender plano gratuito permanente.
- `DSers`: App Market mostra plano gratuito robusto (ate 3 stores e 3000 produtos); melhor candidato se a operacao dropshipping for migrar para Wix Stores, sempre com produtos de teste e validacao de frete/fornecedor Brasil.

## Atualizacao 2026-06-16/17 - ajuste final MobilyTech Finds antes do deploy

- QA production preliminar detectou residuo do texto antigo `Ver oferta no Mercado Livre` dentro do JSON embutido em `fase2/achados.html`, mesmo com o botao visivel ja renderizando `Ver oferta`.
- Correcao aplicada na fonte `data/phase2-finalists.json`: 8 ocorrencias antigas foram trocadas por `Ver oferta`; `scripts/build_phase2_hybrid.py` tambem foi ajustado para nao reintroduzir o rotulo antigo em regeneracoes legadas.
- Site regenerado por `scripts/build_phase2_ibuy_style.py`.
- QA local salvo em `docs/qa/final-production-2026-06-17-26f5d35/local-post-finds-fix-qa.json` passou: paginas publicas existem, `fase2/montagem.html` e o caminho correto, nao ha `monte-seu-pc.html`, nao ha `Ver oferta no Mercado Livre`, 166 assets sem quebrados/zero byte, login/conta presentes, cupom nao aparece como texto visivel e Mercado Pago/Abacate Pay seguem com cores solidas.
- Publicacao: commit `83a70d7` publicou a correcao principal do Finds; commit `eb743c7` limpou tambem o HTML privado usado no corpo do 404 de `/private/admin/index.html`, removendo a ultima ocorrencia antiga em respostas verificadas.
- Deploy final `dpl_Gr7md1zmFFoSSP2CSYpZWRSDLFtn` ficou `READY` em producao.
- Smoke production salvo em `docs/qa/final-production-2026-06-17-26f5d35/production-post-finds-fix-qa.json` passou: paginas publicas 200, `/admin` 401, `/private/admin/index.html` 404, APIs de conta/pedidos/checkouts/webhooks com codigos esperados, data JSONs 200, 167 assets sem quebrados/zero byte, `Ver oferta no Mercado Livre` ausente, `Ver oferta` e logo Mercado Livre presentes, cupom nao exposto na UI, Mercado Pago amarelo solido e Abacate Pay verde solido.
- Logs runtime Vercel do deploy final, janela de 30 minutos, sem `error`/`fatal`.

## Atualizacao 2026-06-16 - painel site-content com escrita segura preparada

- Antes de editar, foi criado backup em `C:\Users\MF\Documents\BACKUPSSITECODEX\MobilyTechBR_pre_site_content_writer_2026-06-16_233140.zip`.
- `private/admin/index.html` ganhou botao `Salvar no site` para o editor de textos, destaque e artes do site, mantendo o botao de baixar `site-content.json` como fallback.
- A rota `/api/update-site-content` agora fica consolidada em `api/account.js?action=update-site-content`, exige sessao admin ou `ADMIN_WRITE_TOKEN`, valida o JSON e so tenta gravar `data/site-content.json` no GitHub se existir `GITHUB_CONTENT_WRITE_TOKEN`/token equivalente como segredo de servidor. O token nunca vai para o navegador.
- QA isolado da rota passou: `GET` retorna 405, POST sem admin retorna 401, payload invalido retorna 400 e ausencia de token GitHub retorna 501 seguro com mensagem de fallback. A publicacao real da escrita direta ainda depende de configurar um token GitHub fino em ambiente seguro; sem isso, o painel continua exportando JSON revisado.

## Atualizacao 2026-06-16 - QA controlado de fornecedor/dropshipping

- `lib/fulfillment-shipping.js` foi ajustado para, em itens internacionais, priorizar o link operacional `supplierSearchUrl` e a plataforma de origem da triagem (`AliExpress/DSers ou CJ`) em `FornecedorItens`, em vez de usar primeiro o link publico de curadoria.
- QA controlado salvo em `docs/qa/supplier-fulfillment-control-2026-06-16/qa.json`: 51 produtos de fornecedor ativos, 50 `INTL` e 1 `BR`, sem falhas de campos obrigatorios.
- A amostra validada contem produto, ID, quantidade, canal de origem, origem, link operacional, backup, custo estimado, frete cobrado do cliente, prazo, base de frete, reputacao, risco e instrucao.
- Isso valida P16/P17 sem compra real. O unico teste restante para essa area e uma venda/pedido controlado futuro, quando for desejado disparar fluxo real de checkout/e-mail.

## Atualizacao 2026-06-16 - publicacao do painel site-content seguro

- Commit `3768d2a` adicionou a rota como nova funcao `api/update-site-content.js`, mas o deploy `dpl_Gf35m4NdGAtrXUfs8qRQ9hbY2uQ5` falhou na etapa de deploy outputs. A causa provavel foi exceder o pacote estavel de 12 funcoes Node na Vercel.
- Correcao: commit `848b979` consolidou `/api/update-site-content` em `api/account.js?action=update-site-content`, preservando a URL chamada pelo painel e voltando a `lambdaRuntimeStats: {"nodejs":12}`.
- Deploy production `dpl_7cc7YG3CYrMrXNFiorUgUmjV4t7c` ficou `READY`.
- QA HTTP production salvo em `docs/qa/production-site-content-writer-2026-06-16-848b979/qa.json`: home oficial 200, Achados 200, Minha Conta 200, `/admin` 401 sem login, `/private/admin/index.html` 404, `/api/update-site-content` em GET 405, POST sem auth 401, `/api/auth-session` 200 e alias `mobilytechbr.vercel.app` 200.
- Logs runtime Vercel em producao, janela de 30 minutos, sem `error`/`fatal`.

## Atualizacao 2026-06-17 - flags publicas, afiliados Finds e regras de handoff

- Novas regras operacionais foram registradas para o proximo handoff: tratar adendos como complemento, nao pedir autorizacao rotineira, executar reinicio/desligamento quando solicitado sem nova confirmacao, usar Chrome CDP primeiro, Opera GX como fallback web, Computer Use depois com tentativa de recuperacao, e pausar com seguranca se creditos visiveis ficarem baixos.
- Dropshipping/CJ/DSers/frete exato foi movido para backlog pelo usuario em 2026-06-17; nao executar agora. Manter apenas como ideia futura ate haver fornecedor, frete fornecedor-cliente e automacao confiaveis.
- `data/site-content.json` ganhou `featureFlags`: Google e Mercado Pago ativos; Microsoft e Abacate Pay pausados. `lib/account-handlers.js` preserva `featureFlags` ao salvar site-content pelo painel.
- O gerador `scripts/build_phase2_ibuy_style.py` agora respeita `featureFlags` para esconder/mostrar login Google, login Microsoft, Mercado Pago e Abacate Pay. A UI publica regenerada nao contem `Entrar com Microsoft`, `Abacate Pay` nem `Painel interno`.
- O historico da conta filtra os dois pedidos falsos de validacao `pedido-1781658045002` e `pedido-1781657995494`, para nao aparecerem ao cliente logado.
- `private/admin/index.html` ganhou controles no editor visual para ligar/desligar Google, Microsoft, Mercado Pago e Abacate Pay, e ganhou campo/coluna interna de `Comissao interna` para MobilyTech Finds.
- MobilyTech Finds ficou em modo conservador: apenas links diretos rastreaveis ficam publicos; links de busca generica ficam pausados. Shopee segue pausado sem codigo de afiliado ativo.
- Via Chrome CDP logado no Mercado Livre, foram gerados 3 novos links `meli.la` pelo botao oficial `Compartilhar` do programa de afiliados; 3 produtos Mercado Livre continuaram pausados porque a pagina nao mostrou o botao de compartilhamento/afiliado. O total publico subiu para 11 itens prontos e 93 pausados.
- Backups relevantes: `backups\phase2-finalists-before-affiliate-audit-*` e `backups\phase2-finalists-before-ml-affiliate-generation-20260617-170717.json`.
- QA local salvo em `docs/qa/final-adjustments-2026-06-17/qa-report.json`: 22 checks passaram em desktop/mobile, sem erros reais de console; os 404 de `/api/account?action=session` sao esperados no servidor estatico local. Screenshots salvos na mesma pasta.
- QA do painel salvo em `docs/qa/final-adjustments-2026-06-17/admin-dom-qa.json`: tela visual de login existe, controles de botoes renderizam no DOM, coluna de comissao interna existe e nao houve erro de script. A rota oficial `/admin` continua protegida por `api/account.js?action=admin`.
- Crocheck externo no ChatGPT, conversa `Analise visual MobilyTech BR`, inicialmente bloqueou apenas o gate do admin por logo quebrado/truncado. O painel foi corrigido para usar `/assets/mobilytech-logo.png`, caixa fixa e fallback `MT`.
- Validacao local do logo do admin salva em `docs/qa/final-adjustments-2026-06-17/admin-logo-fix-qa.json`: `naturalWidth=1024`, `broken=false`, caixa `56x56`; screenshot salvo em `desktop-admin-gate-after-logo-fix.png`.
- Revalidacao no ChatGPT apos o ajuste retornou `APROVADO`, bloqueadores restantes `nenhum`. Registro salvo em `docs/qa/final-adjustments-2026-06-17/crocheck-chatgpt-final-2026-06-17.md`.
- Publicacao Git/Vercel: commits `1b4016f` e `83a643a` enviados para `main`. Deploy de producao `dpl_5EvrhNowrtd36DaXpmdGyeDhd2qv` ficou `READY` com alias `https://www.mobilytech.com.br`.
- Smoke oficial salvo em `docs/qa/final-adjustments-2026-06-17/production-smoke-83a643a.json`: 36 checks passaram, 0 falhas. Validou paginas publicas 200, admin protegido, `/private/admin/index.html` 404, asset do logo 200, endpoint de sessao 200, ausencia de Microsoft/Abacate/Painel interno/IDs literais de pedido fake, e `Ver oferta` correto no Finds.
- Logs runtime Vercel, producao, janela de 30 minutos, sem `error` ou `fatal`.

## Atualizacao 2026-06-18 - lote manual seguro de afiliados Finds

- Usuario confirmou que Amazon/AliExpress/Mercado Livre por API deve ficar no backlog; a execucao atual deve usar o metodo manual de gerar links pela pagina do produto quando a conta estiver logada.
- Backlog consolidado em `docs/MOBILYTECH_BACKLOG_2026-06-17.md`: APIs de afiliados, meta futura de 65 produtos rastreaveis, dropshipping/CJ/DSers/frete exato, Abacate Pay, Microsoft login e chat IA.
- Evidencia recuperada do Link Builder do Mercado Livre em `docs/qa/ml-linkbuilder-batch0-fail-snapshot-2026-06-17.txt`: 24 de 25 links foram gerados corretamente; 1 URL foi rejeitada pelo programa.
- Mapeamento seguro salvo em `docs/qa/ml-affiliate-links-mapped-2026-06-17.json`; o lote contem 24 links `https://meli.la/...` gerados pelo Link Builder oficial.
- Tentativas de gerar novos links pelo Chrome/Opera nesta retomada abriram login/verificacao do Mercado Livre para `mobilytechbr@gmail.com`; por seguranca, nao avancar por senha/codigo sozinho.
- `data/phase2-finalists.json` foi atualizado em modo conservador: 24 itens Mercado Livre diretos ficaram ativos e itens antigos de busca/sem rastreio ficaram pausados (`affiliateReady:false`) para nao publicar link sem comissao.
- Meta de 65 produtos fica bloqueada ate reconectar/verificar Mercado Livre ou configurar API/credenciais oficiais. Nao preencher a diferenca com links de busca.

## Atualizacao 2026-06-18 - nova ordem para botoes e lote AliExpress

- Usuario enviou tres referencias visuais para botoes `Ver oferta` por marketplace: AliExpress vermelho, Amazon preto/laranja e Mercado Livre amarelo. Manter o tamanho original do botao no site, padronizar tamanho do texto entre plataformas e validar desktop/mobile por crocheck rigoroso com ChatGPT antes de considerar pronto.
- O botao Mercado Livre deve seguir o mesmo estilo/forca visual do checkout Mercado Pago ja aprovado, mas com texto `Ver oferta` e logo oficial/sem fundo; Amazon e AliExpress devem seguir a mesma logica de formato, com cores/logos da marca correspondente.
- Amazon: usuario confirmou StoreID/tag `mobilytechbr-20` e forneceu exemplo de link completo com `tag=mobilytechbr-20`. Caminho pragmatico atual: quando nao houver API, gerar link rastreavel por ASIN + tag e/ou usar SiteStripe manual; validar que o link final contem o tag correto.
- AliExpress: usuario baixou template `C:\Users\MF\Downloads\batch_link_generate.csv`; a estrutura esperada e apenas uma coluna `URL`. Verificacao local em `data/phase2-finalists.json`, `data/products.json`, `data/finds-source-phase1-2026-06-13.json` e backups nao encontrou nenhuma URL real de produto AliExpress, apenas URLs de busca `pt.aliexpress.com/w/wholesale...SearchText=...`.
- Regra para o lote AliExpress: nao alimentar o gerador em lote com URL de busca generica. O CSV so deve conter paginas reais de produto AliExpress, uma por linha, para evitar publicar links sem produto exato/comissao confiavel.
- Teste real do gerador em lote AliExpress: usuario subiu `mobilytech_aliexpress_batch_UPLOAD_TESTE_80_BUSCAS_2026-06-18.csv` e recebeu `C:\Users\MF\Downloads\Sff22212171ab43deae7b84190ad9c1b0L.csv`. Validacao local: 79 linhas, 79 `Tracking URL` no formato `https://s.click.aliexpress.com/e/_...`, 79 `Tracking ID=default`, 0 erros, 0 duplicados. Relatorio salvo em `docs/qa/aliexpress-batch-links-2026-06-18.json`. Observacao: lote funciona, mas ainda aponta para buscas/categorias; para cards de produto ideais, substituir por URLs reais de produto antes de publicar.

## Atualizacao 2026-06-18 - pendencias ativas apos validacao do usuario

- Usuario verificou o site oficial e informou que a versao final ainda nao foi publicada: os novos anuncios/links de Amazon e AliExpress ainda nao aparecem em `https://www.mobilytech.com.br`.
- Usuario rejeitou o visual atual dos botoes: logos e botoes nao estao 100% iguais as referencias enviadas. Refazer Mercado Livre, Amazon e AliExpress com equivalencia visual maxima as imagens de referencia, mantendo todos os botoes com o mesmo tamanho/proporcao.
- Crocheck visual externo com ChatGPT na conversa fixada `Analise Visual MobilyTech BR` ainda esta pendente e deve ser feito antes de considerar os botoes aprovados.
- Estas pendencias sao ativas para a proxima execucao imediata, nao backlog futuro. Lista detalhada salva em `docs/PENDENCIAS_ATIVAS_MOBILYTECH_2026-06-18.md`.
- Usuario vai enviar um handoff de outra conversa sobre uma IA gratuita/local para auxiliar o Codex em tarefas repetitivas; analisar quando chegar e decidir o melhor uso pratico.

## Atualizacao 2026-06-18 - metodo IA local + Codex

- Handoff de IA local recebido em `C:\Users\MF\Documents\Codex\2026-06-18\oi-eu-tava-vendo-aqui-alguma\outputs\handoff-ia-local-para-codex-mobilytech.md`.
- Ferramentas locais confirmadas pelo handoff: Ollama `0.30.6`, modelo `qwen2.5-coder:7b`, Python `3.12.10`, Git `2.54.0.windows.1` e Aider `0.86.2`.
- Scripts confirmados no disco: `ask-local-model.cmd`, `start-local-aider.cmd` e `local-ai-setup-guide.md` na pasta `outputs` do handoff.
- Metodo salvo em `docs/METODO_IA_LOCAL_CODEX_MOBILYTECH.md`.
- Regra operacional: IA local pode preparar rascunhos, explicacoes, checklists e pequenas sugestoes; Codex continua revisando, testando e executando qualquer coisa de producao, afiliados, pagamento, credenciais, Vercel, Wix, GitHub ou dominio oficial.
- Para a pendencia ativa dos botoes/publicacao, a IA local pode ajudar no checklist visual e prompts de crocheck, mas o ChatGPT/crocheck externo e a validacao final no dominio oficial continuam obrigatorios.

## Atualizacao 2026-06-18 - regra obrigatoria de qualidade para IA local

- Usuario autorizou usar a IA local no maximo possivel para tarefas leves/repetitivas, desde que nao entre em areas sensiveis e nao demore de forma desproporcional.
- Regra obrigatoria para qualquer uso da IA local: todo resultado gerado por ela precisa de cheque final do Codex.
- Esse cheque deve confirmar que a qualidade esta no minimo quase perfeita e comparavel ao padrao que o Codex entregaria diretamente.
- Se o resultado estiver fraco, incompleto, confuso ou abaixo do padrao visual/funcional/textual/tecnico esperado, o Codex deve corrigir, refazer ou descartar antes de mostrar/publicar/commitar.
- Esta regra deve entrar no proximo handoff e ser aplicada toda vez que a IA local for usada.

## Atualizacao 2026-06-18 - botoes afiliados + primeiro uso real da IA local

- Primeiro teste real da IA local no fluxo MobilyTech executado com cautela: Ollama/qwen2.5-coder foi usado apenas como apoio para checklist/revisao leve; a saida direta foi considerada generica e o Codex fez o cheque final obrigatorio.
- Conclusao operacional: a IA local ajuda a economizar credito em checklist, prompts e segunda opiniao simples, mas ainda nao substitui Codex/Playwright/ChatGPT em QA visual ou decisoes de producao.
- `scripts/build_phase2_ibuy_style.py` foi ajustado para renderizar botoes `Ver oferta` com estrutura uniforme: marca a esquerda, divisor interno, texto centralizado, altura fixa de 46px, fonte 15.5px e estilos por marketplace.
- Novos assets de marca para botoes: `assets/affiliate-mercado-livre-mark.svg`, `assets/affiliate-amazon-mark.svg` e `assets/affiliate-aliexpress-mark.svg`.
- MobilyTech Finds local ficou com 66 produtos afiliados ativos: 24 Mercado Livre, 29 AliExpress e 13 Amazon; todos com link de oferta preenchido.
- QA local desktop/mobile salvo em `docs/qa/affiliate-buttons-2026-06-18/qa.json`: 66 cards, 66 botoes, 0 links vazios, 0 logos faltando, 0 separadores faltando e 0 botoes fora da altura esperada.
- Screenshots de evidencia salvos em `docs/qa/affiliate-buttons-2026-06-18/`.
- Crocheck externo no ChatGPT, conversa `Analise Visual MobilyTech BR`, nao foi executado nesta retomada porque nao houve ferramenta direta disponivel de Chrome/Computer Use para o agente. Validacao substituta: Playwright com Chrome local + inspeção visual manual pelo Codex.
- Proxima etapa imediata: publicar o pacote no Git/Vercel e validar no dominio oficial `https://www.mobilytech.com.br`.
