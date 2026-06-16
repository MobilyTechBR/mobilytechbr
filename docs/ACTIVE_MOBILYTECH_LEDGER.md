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
