# Handoff MobilyTech BR - 2026-06-16

Este documento e para colar em uma nova conversa do Codex/ChatGPT e continuar o projeto MobilyTech BR sem reler todo o historico. Ele contem o estado real, o que foi aprendido, os metodos de trabalho do usuario, os problemas encontrados, o que ja foi feito e o que ainda falta.

## Prompt curto para a proxima IA

Continue o projeto MobilyTech BR a partir do repo:

`C:\Users\MF\Documents\GitHub\mobilytechbr`

Leia primeiro:

1. `C:\Users\MF\Documents\GitHub\mobilytechbr\docs\HANDOFF_MOBILYTECHBR_2026-06-16.md`
2. `C:\Users\MF\Documents\GitHub\mobilytechbr\docs\ACTIVE_MOBILYTECH_LEDGER.md`
3. `C:\Users\MF\Documents\GitHub\mobilytechbr\MOBILYTECH_STATE.md`
4. `C:\Users\MF\Documents\GitHub\mobilytechbr\docs\wix-hybrid-premium-status-2026-06-15.md`
5. `C:\Users\MF\Documents\GitHub\mobilytechbr\docs\phase2-final-qa-2026-06-15.md`

Nao exponha tokens, secrets, senhas, chaves privadas nem credenciais. Trate novas mensagens do usuario como complemento por padrao, nao como substituicao da fila ativa, salvo se ele disser explicitamente que e cancelamento, fechamento ou mudanca de direcao.

## Identidade e objetivo

- Nome correto: MobilyTech BR.
- Site Vercel/visual atual: `https://mobilytechbr.vercel.app`
- Dominio oficial desejado para cliente: `https://www.mobilytech.com.br`
- Repo local: `C:\Users\MF\Documents\GitHub\mobilytechbr`
- Projeto Vercel: `mobilytechbr`.
- Repositorio GitHub: `MobilyTechBR/mobilytechbr`.
- Branch de producao: `main`.
- Site Wix premium/canonico: `MobilyTech BR`, site ID `85e985c5-2904-452f-85e2-a98f6d3b1cac`.

Objetivo do projeto: manter o visual/codigo do Vercel, porque a Wix builder nao conseguiu reproduzir o visual desejado, mas aproveitar ao maximo o backend/ferramentas comerciais da Wix: dominio, Wix Stores, pagamentos, marketing, apps de dropshipping, cupons, possivel login/membros, pedidos e automacoes.

## Direcao visual oficial

A direcao visual oficial agora e a fase 2 clara, inspirada em iBUYPOWER/KaBuM, nao o visual antigo escuro/azul. Nao voltar para o tema dark antigo salvo pedido explicito.

Caracteristicas desejadas:

- Fundo branco/claro inspirado na iBUYPOWER.
- Cards limpos, cantos arredondados, proporcoes de loja gamer.
- Fotos reais dos PCs e produtos, sem imagem inventada quando o produto real precisa ser fiel.
- Logo original MobilyTech BR.
- Textos finais para cliente, sem termos internos como teste, rascunho, preview, dropshipping, afiliado, trafego pago.
- Desktop e mobile com textos sem sobreposicao, imagens sem corte estranho, botoes proporcionais.
- Home pode manter blocos principais de montagem e limpeza; outras areas podem virar subpaginas.
- `MobilyTech Finds` com esse casing: M e T maiusculos em MobilyTech e F maiusculo em Finds. Nao usar tudo em maiusculo salvo se o design pedir.

## Metodo de trabalho do usuario

### Complementos

O usuario frequentemente manda mensagens longas enquanto o trabalho esta em andamento. Por padrao, quase tudo e complemento. Nao parar a fila antiga so porque veio uma nova mensagem. Consolidar no ledger e continuar.

### Crosscheck / Crocheck

O usuario chama de `crosscheck` ou `crocheck` um metodo de auditoria com ChatGPT externo:

1. Tirar prints/screenshot ou gerar evidencia concreta do site.
2. Mandar para uma conversa do ChatGPT, preferencialmente a mesma conversa usada no projeto, modo `muito alto`.
3. Pedir auditoria rigorosa: visual, proporcao, responsividade, cortes, sobreposicao, texto, botoes, funcionalidade percebida e aderencia ao objetivo.
4. Pedir nota/percentual e bloqueadores.
5. Corrigir localmente.
6. Repetir ate aprovar ou sobrar apenas polimento opcional.

Adaptacao combinada para economizar tempo/credito:

- Usar automacao local/API para checks repetitivos.
- Usar ChatGPT manual via Computer Use como auditor premium final de visual, principalmente quando a exigencia for 98-99%.
- Para backend/codigo, usar testes locais e logs; ChatGPT pode ajudar no raciocinio, mas visual e UX sao a maior prioridade do crosscheck.
- Se Computer Use falhar, tentar recuperar/reconectar antes de abandonar. O usuario notou que geralmente volta a funcionar quando o agente tenta corrigir.

### Checagem de conectores antes de tarefas longas

Antes de tarefas grandes envolvendo site/Wix/Gmail/Drive/Vercel:

- Testar Wix.
- Testar Gmail.
- Testar Google Drive/Sheets se a etapa usa planilha.
- Testar Vercel/Git se for publicar.

Se falhar, tentar reconectar/recuperar. Se precisar de intervencao do usuario, mandar email com link exato e o que ele precisa fazer.

### Vercel com erro

Se houver erro de deploy e logs locais/API nao forem suficientes, abrir o dashboard logado da Vercel pelo navegador, ir em Deployments, abrir o failed deployment e ler o cartao de erro. Nao ficar chutando.

Erro real visto no dashboard em 2026-06-16:

`No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan.`

Isso indica limite de funcoes do plano Hobby. O caminho correto e reduzir/combinar endpoints ou mover logica para poucas funcoes, antes de tentar novo deploy.

### Contexto compactado

Problema recorrente: depois de "contexto compactado automaticamente", o agente tende a voltar para a ultima mensagem antiga e reabrir assunto ja resolvido. A proxima IA deve:

- Ignorar a ultima frase isolada como fonte unica.
- Ler este handoff e o `ACTIVE_MOBILYTECH_LEDGER.md`.
- Restatar mentalmente: ja feito, pendente real, bloqueado por permissao, proximo passo.
- Continuar a fila ativa.

## Estado dos conectores apos reinicio

Apos o usuario reiniciar o PC, foi checado:

- Wix voltou a funcionar. A listagem retornou 3 sites. O site premium/canonico e `85e985c5-2904-452f-85e2-a98f6d3b1cac`, nome `MobilyTech BR`.
- Gmail voltou a funcionar. List labels respondeu.
- Google Drive voltou a funcionar. List folder root respondeu.
- Computer Use nao apareceu nas ferramentas no momento da ultima checagem via `tool_search`; tentar procurar novamente antes de considerar indisponivel.

## Stack e arquivos principais

O site nao e Next/React/Vite. E HTML/CSS/JS puro gerado por script Python, com APIs Node em Vercel Functions.

Arquivos principais:

- `index.html`: site publico gerado.
- `fase2-hibrida.html`: variante/espelho fase 2.
- `fase2/*.html`: subpaginas.
- `scripts/build_phase2_ibuy_style.py`: gerador da fase 2.
- `data/products.json`: produtos fisicos e MobilyTech Finds.
- `data/phase2-finalists.json`: lista de finalistas/curadoria dropshipping/afiliados.
- `data/addons.json`: adicionais.
- `data/swaps.json`: swaps.
- `data/automation-settings.json`: configuracoes de automacao, Wix, cupom, dropshipping.
- `admin/index.html`: painel.
- `api/create-preference.js`: Mercado Pago.
- `api/create-abacate-checkout.js`: Abacate Pay checkout.
- `api/create-abacate-pix.js`: Abacate Pay Pix.
- `api/shipping-quote.js`: cotacao de frete.
- `api/shipping-confirm.js`: confirmacao/frete/rastreio.
- `api/mercado-pago-webhook.js`: webhook Mercado Pago.
- `api/abacate-pay-webhook.js`: webhook Abacate Pay.
- `lib/fulfillment-shipping.js`: separacao fisico x fornecedor, frete direto, validacao de estoque fisico.
- `lib/promotions.js`: cupom local.
- `docs/google-apps-script/mobilytech-pos-venda.gs`: modelo Apps Script.

## Backups e docs importantes

Pasta de backup consolidada pelo usuario:

`C:\Users\MF\Documents\BACKUPSSITECODEX`

Backups vistos:

- `MobilyTech_backup_pos_estoque_unitario_2026-06-15_230219.zip`
- `MobilyTech_backup_final_site_2026-06-15_215909.zip`
- `MobilyTechBR_backup_final_site_fase2_2026-06-15_145132.zip`
- `backup-final-versao-site-2026-06-15_001956.zip`
- `MobilyTechBR_backup_pre_wix_hybrid_2026-06-14_20-04-44.zip`
- `MobilyTechBR_2026-06-14_versao_fase_2_aprovada_com_conta_wix_backup.zip`
- `MobilyTechBR_2026-06-14_versao_fase_2_backup.zip`

Docs relevantes ja existentes:

- `docs/ACTIVE_MOBILYTECH_LEDGER.md`
- `docs/wix-hybrid-premium-status-2026-06-15.md`
- `docs/phase2-final-qa-2026-06-15.md`
- `docs/phase2-ibuy-style-report-2026-06-14.md`
- `docs/wix-hybrid-account-bridge-2026-06-14.md`
- `docs/phase2-hibrida-execution-2026-06-13.md`
- `docs/MobilyTech_Fase2_Finalistas_Validacao_Criativos_2026-06-13.xlsx`
- `docs/phase2-finalists-2026-06-13.csv`
- `docs/phase2-creatives-2026-06-13.csv`

## Estado Wix/dominio

Estado anotado no ledger antes:

- `https://mobilytechbr.vercel.app` estava respondendo com fase 2 correta.
- `https://www.mobilytech.com.br` ainda servia o site Wix antigo/generico em uma checagem anterior.
- A ponte Wix por iframe/custom embed foi usada em algum momento com `https://mobilytechbr.vercel.app/?wixBridge=1`.
- Subrotas diretas Wix `/fase2/...` tendem a 404; workaround documentado: usar query `?mtbPath=%2Ffase2%2Fofertas.html`.
- A meta do usuario e o dominio oficial Wix ser o link final do cliente, mas com visual Vercel.

O que ainda precisa decidir/executar:

- Melhor caminho tecnico para `www.mobilytech.com.br` apontar para o visual Vercel:
  - Opção preferida do usuario: dominio oficial apontando para Vercel, com Wix usado via API/headless.
  - Nao usar Wix puro/builder, porque ja falhou visualmente varias vezes.
  - Se mexer em DNS/dominio, cuidado: API Wix de dominio pode exigir API key/schema diferente. Se nao estiver claro, usar painel logado e pedir intervencao.

## Vercel e limite de funcoes

Erro real no deploy:

`No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan.`

Houve tentativa de reduzir pacote/arquivos com `.vercelignore`. Verificar se o repo atual esta abaixo do limite antes de publicar.

Recomendacao:

- Nao adicionar novas Vercel Functions.
- Consolidar endpoints quando possivel.
- Para novas features pequenas, preferir rotas ja existentes, JSON/config, Apps Script ou frontend.
- Antes de push, conferir numero de arquivos em `api/`.

## Estado atual do trabalho interrompido

O usuario mandou parar agora e pediu handoff. A implementacao foi interrompida no meio.

Mudancas locais feitas antes de parar, ainda precisando verificacao/publicacao:

- `lib/promotions.js`
  - `itemTotal` passou a considerar `item.quantity`.
- `lib/fulfillment-shipping.js`
  - `supplierFulfillmentItem` passou a ler `product.quantity`/`qty`.
  - Frete de fornecedor agora multiplica por quantidade.
  - `supplierItems` carrega `quantity`.
  - `validateUniquePhysicalCheckoutItems` ja existia/foi usado para bloquear produto fisico duplicado.
- `api/create-preference.js`
  - Checkout Mercado Pago agora preserva `quantity`.
  - Totais de produto multiplicam por quantidade.
  - Metadata inclui `product_quantities`.
- `api/create-abacate-checkout.js`
  - Checkout Abacate Pay agora preserva `quantity`.
  - Linhas de checkout incluem `quantity`.
  - Metadata inclui `productQuantities`.
- `api/create-abacate-pix.js`
  - Pix Abacate Pay agora preserva `quantity`.
  - Totais multiplicam por quantidade.
  - Metadata inclui `productQuantities`.
- `api/shipping-quote.js`
  - `productsFromCartItems` passou a montar produtos com `quantity`.
  - Chama `validateUniquePhysicalCheckoutItems(cartProducts)` para carrinho fisico.

Teste rapido feito:

- `node --check` passou para:
  - `lib/promotions.js`
  - `lib/fulfillment-shipping.js`
  - `api/create-preference.js`
  - `api/create-abacate-checkout.js`
  - `api/create-abacate-pix.js`
  - `api/shipping-quote.js`
- Teste Node de `supplierQuote` confirmou:
  - produto dropshipping quantidade 3, frete unitario 12, total de frete 36.
  - produto fisico quantidade 2 gera erro `PHYSICAL_PRODUCT_SINGLE_QUANTITY` status 400.

Erro aberto no gerador:

Ao rodar:

`C:\Users\MF\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe scripts\build_phase2_ibuy_style.py`

ocorreu:

`NameError: name 'quantity' is not defined`

Local:

`scripts/build_phase2_ibuy_style.py`, por volta da linha 1339.

Causa:

Dentro de uma f-string Python que gera JavaScript, existe template string JS:

`const quantityLabel = quantity > 1 ? `Qtd. ${quantity}` : "";`

O Python tentou interpolar `${quantity}`. Precisa escapar para JS, por exemplo usando `${{quantity}}` dentro da f-string Python. Conferir tambem outros trechos JS com `${...}` que deveriam ser `${{...}}`.

Depois de corrigir, regenerar o site.

## Git/PATH

Apos o restart, no PowerShell o comando `git` nao estava no PATH:

`git : O termo 'git' nao e reconhecido...`

Tentativas de localizar em caminhos comuns nao retornaram resultado. Proxima IA deve:

- Tentar `where.exe git`.
- Tentar Git Bash/GitHub Desktop se instalado.
- Procurar em `C:\Program Files\Git\cmd\git.exe`, `C:\Program Files\Git\bin\git.exe`, `C:\Users\MF\AppData\Local\Programs\Git\cmd\git.exe`.
- Se nao encontrar, usar GitHub Desktop ou pedir ao usuario para reinstalar/ajustar PATH antes de prometer commit/push.

## Produtos e estoque

Produtos fisicos da MobilyTech:

- PCs.
- SSDs.
- Fontes.
- Pecas em estoque local.

Regra:

- Produto fisico tem estoque unitario por padrao.
- Cliente nao pode adicionar o mesmo produto fisico mais de uma vez nem quantidade maior que 1.
- Produtos de dropshipping/fornecedor podem aceitar quantidade maior.
- SSDs e fontes nao devem mostrar adicionais/swaps no modal; adicionais/swaps sao para PCs.
- Se venda do site for confirmada, o item fisico deve sair do site/estoque automaticamente.
- Registro manual de venda no painel e para vendas fora do site: OLX, Facebook Marketplace e atendimento direto.

## MobilyTech Finds, afiliados e dropshipping

Nome publico: `MobilyTech Finds`.

O usuario quer:

- Uma pagina/area de curadoria com produtos tech.
- Para o cliente, nao falar "dropshipping" nem "afiliado".
- Separar internamente:
  - vendidos pela MobilyTech: dropshipping/fornecedor, checkout pelo site.
  - recomendacoes MobilyTech: afiliados, botao externo para Mercado Livre/Amazon/AliExpress.
- Shopee nao deve ser usada por enquanto; usuario disse que nao tem mais.
- Usar Mercado Livre, Amazon e AliExpress para afiliados.
- Para cada produto, fotos oficiais/reais do produto, nao imagem generica inventada se isso puder enganar cliente.
- Se imagem estiver ruim/cortada, pode usar AI Product Images/ChatGPT para melhorar fundo/iluminacao/recorte, mas sem alterar fidelidade do produto.
- Botao de afiliado com logo da plataforma e cor/gradiente da marca.
- Botao Mercado Livre estava com logo pequena; aumentar proporcionalmente se ainda estiver assim.

Frete de dropshipping:

- Nao usar Melhor Envio com CEP de origem da casa do usuario para produtos de fornecedor.
- Frete de fornecedor deve ser cobrado do cliente, como adicional separado, de acordo com origem/fornecedor.
- Se frete do fornecedor for estimado/fixo, deixar isso configuravel no painel.
- Produtos nacionais/internacionais devem ter indicador interno e, se visualmente conveniente, bandeira/rotulo no painel/site.
- Margem padrao de dropshipping: 25%.
- Produtos de compra manual: margem minima 35%.
- Margem global deve ser editavel no painel.
- Margem especifica por produto deve sobrescrever a global.
- Painel deve mostrar preco de custo, margem, preco final ao cliente e lucro estimado.

Wix apps conectados pelo usuario:

- Modalyst.
- Dropi.
- AI Product Images.

Recomendacao:

- Pesquisar/usar Wix apps se eles resolverem logistica/fornecedor automaticamente.
- Se a API Wix nao der info suficiente, usar painel Wix via Computer Use.
- Dropi parece relevante para dropshipping nacional, AliExpress e sincronizacao de estoque.
- Modalyst tem limite de plano gratuito (usuario viu limite pequeno).
- Nao depender so da Wix; usar Vercel/painel proprio quando for melhor.

## Carrinho, cupom, frete e checkout

Cupom:

- Cupom `MOBMEN`, 6%.
- Desconto em PC/produto, nao no frete.
- Deve haver campo de cupom no carrinho.
- Ideal: se possivel, integrar cupons Wix reais. Se o usuario criar cupom novo na Wix, o site deveria aceitar automaticamente. Se nao for possivel agora, deixar local e documentar.

Frete:

- Produtos fisicos: retirada local em Vila Suzana ou Melhor Envio por CEP.
- Dropshipping/fornecedor: envio obrigatorio, com frete de fornecedor; nao retirada local.
- Carrinho misto: combinar Melhor Envio para itens fisicos + envio direto para MobilyTech Finds.
- Formatar opcoes de frete de modo legivel:
  - Empresa - Servico
  - prazo
  - preco
  - sem sobreposicao no mobile.

Pagamentos:

- Hoje existem Mercado Pago, Abacate Pay e Pix/Abacate Pay.
- Usuario quer preferir pagamentos Wix se possivel, mas manter Mercado Pago e Abacate Pay quando possivel.
- Abacate Pay fica como adicional/alternativo porque a taxa e boa.
- Botao Mercado Pago e Abacate Pay devem ter visual/gradiente/logo proporcional.
- Nao expor tokens ou secrets.

## Login/conta/pedidos

Usuario quer login seguro para clientes:

- Login via Google/Microsoft, se possivel, como "continuar com Google/Microsoft".
- Nao criar login fake.
- Login deve permitir:
  - salvar endereco.
  - ver pedidos.
  - acompanhar status.
  - consultar retirada/entrega.
- Dados de pagamento nao precisam ser salvos se nao for seguro.

Estado atual conhecido:

- Login real ainda nao estava implementado.
- O caminho certo apontado: Wix Headless Authentication com OAuth App.
- Criar OAuth App pode gerar segredo sensivel; guardar em env vars seguras Vercel/Wix, nao no codigo.
- Se precisar criar OAuth App/secret, preparar abas/links e pedir intervencao do usuario.

Fluxo de pedidos:

- Checkout do site deve enviar email/status ao cliente.
- Status esperados:
  - pagamento pendente.
  - pagamento aprovado.
  - retirada a combinar (se retirada local).
  - etiqueta/posta/despachado.
  - em transporte.
  - saiu para entrega/entregue.
- Se retirada local, mostrar botao para WhatsApp/e-mail combinar retirada.
- Se envio, usar Melhor Envio/tracking quando aplicavel.
- Dropshipping manual deve enviar ao vendedor email com dados necessarios: produto, fornecedor/link, cliente, CEP/endereco, valor, frete, margem, observacoes.

## Painel/admin

Usuario quer manter/atualizar o painel:

- Estetica alinhada ao site fase 2.
- Editar PCs/produtos, fotos, precos, status ativo/inativo.
- Editar produtos dropshipping e afiliados.
- Campo para margem global dropshipping e margem especifica por produto.
- Calcular preco final/lucro estimado.
- Registrar venda manual dentro do proprio painel, nao em app separado.

Registro manual de venda:

- Deve servir para vendas OLX/Facebook/atendimento direto.
- Produto ja cadastrado no painel deve aparecer para registrar venda.
- Ao marcar venda:
  - opcao "vendeu pelo preco original?"
  - se nao, campo para preco personalizado.
  - campo para custo total.
  - campo para descricao/configuracao final vendida, caso o cliente tenha pedido upgrade/adicional.
  - data da venda.
  - canal da venda: OLX/Facebook/WhatsApp/Site/outro.
  - atualizar Planilha OLX com nome do PC/produto, data, preco venda, custo, descricao/configuracao, canal.
  - planilha calcula lucro bruto e margem com formulas ja existentes.
  - remover/desativar anuncio do site se for produto fisico vendido.

Planilha:

- Link fornecido pelo usuario:
  `https://docs.google.com/spreadsheets/d/1Wc_ctkvNJh-64Yg30EHGBCjylL92s2BDtXbNhug0VsQ/edit?gid=1386556618#gid=1386556618`
- A planilha ja tinha Apps Script antigo. Nao sobrescrever.
- Usuario abriu um novo projeto Apps Script dentro da planilha e autorizou/quer autorizar quando necessario.
- Criar novo Apps Script/endpoint com cuidado.
- Se pedir autorizacao, mandar e-mail com link/acao exata.

## E-mails transacionais

Usuario quer e-mails bonitos/responsivos com a identidade visual atual:

- Logo MobilyTech BR centralizada no topo.
- Paleta branca/azul clara.
- Cards arredondados.
- Visual legivel no celular e desktop.
- Texto mais descontraido para cliente.
- Texto operacional completo para vendedor.
- Usar crosscheck com ChatGPT para texto e visual.

Criar/enviar testes para o e-mail MobilyTech:

- Assunto deve explicitar `CLIENTE` ou `VENDEDOR`.
- Tipos minimos:
  - Cliente: pedido recebido/confirmado.
  - Cliente: pagamento aprovado.
  - Cliente: pedido despachado/rastreio.
  - Cliente: retirada a combinar.
  - Cliente: entregue/pos-venda.
  - Vendedor: nova venda site.
  - Vendedor: nova venda dropshipping/manual.
  - Vendedor: erro/bloqueio de pagamento/frete.
- Se ChatGPT sugerir etapa importante, pode incluir e sinalizar como sugestao implementada.

## Problemas visuais que foram mencionados pelo usuario

Corrigir/verificar:

- Fotos de produto cortadas em cards de PCs, SSDs, afiliados e MobilyTech Finds.
- Alguns titulos sobrepondo imagens.
- Barra de pesquisa redirecionava sempre para o mesmo lugar; deve pesquisar produto/secao real.
- `MobilyTech Finds` deve ficar em grade, nao um produto por linha.
- Preco dos Finds deve ficar mais destacado e centralizado como nos PCs.
- Secao de limpeza principal tinha botao muito grande; deixar proporcional ao card menor.
- Secao de limpeza secundaria precisa imagem ao lado do formulario tambem.
- Avaliacoes devem estar centralizadas quando apropriado.
- Marcas/logos estavam sumidas/cortadas; usar logos originais sem fundo, proporcionais.
- Favicon/icone da aba deve ser a logo MobilyTech BR tambem no dominio Wix.
- Nav/header deve ter separadores tipo `Ofertas | PC Gamer | ...` ou outro tratamento limpo, nao botoes pesados.
- Topbar deve trocar texto generico por algo como cupom `MOBMEN` e promocao real.
- Contato deve incluir WhatsApp, e-mail, retirada local, garantia e envio para todo Brasil com rastreio/bandeira do Brasil.

## Referencias de imagem do usuario

O usuario mandou muitas imagens e disse que algumas eram referencia e outras eram apenas prints de erro. Nao reutilizar imagens que ele explicitamente rejeitou.

Imagens de referencia importantes mencionadas:

- Mockup claro iBUYPOWER-like para:
  - card Monte seu PC.
  - card Limpeza de PC.
  - formulario de limpeza claro.
- Mockup dark anterior que ele gostou acabou sendo menos oficial depois; a direcao final atual e clara/iBUYPOWER.
- Usar imagens reais dos PCs e produtos.
- Para marcas, usar logos oficiais, nao geradas genericas.

## Publicacao e QA

Fluxo local recomendado:

1. Corrigir gerador.
2. Rodar:
   `C:\Users\MF\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe scripts\build_phase2_ibuy_style.py`
3. Rodar `node --check` em APIs/libs.
4. Subir servidor local:
   `python -m http.server 4173 --bind 127.0.0.1`
5. Testar:
   `http://127.0.0.1:4173/?qa=<timestamp>`
6. QA desktop e mobile com screenshots.
7. QA funcional:
   - busca por `ryzen`, `ssd`, `limpeza`, `mercado livre`, `carrinho`.
   - abrir detalhes PC e confirmar swaps/addons.
   - abrir detalhes SSD/fonte e confirmar sem addons.
   - adicionar produto fisico duas vezes: deve bloquear/nao duplicar.
   - adicionar produto fornecedor duas vezes: pode aumentar quantidade.
   - carrinho com cupom `MOBMEN`.
   - retirada local para produto fisico.
   - frete por CEP para produto fisico.
   - frete fornecedor para MobilyTech Finds.
   - checkout Mercado Pago e Abacate Pay sem expor secrets.
   - formularios de limpeza/montagem.
   - links afiliados Mercado Livre/Amazon/AliExpress.
   - painel/admin.
8. Crosscheck visual final com ChatGPT para todas as secoes desktop/mobile.
9. Corrigir bloqueadores.
10. Criar backup.
11. Publicar/push quando seguro.
12. Verificar Vercel e depois dominio oficial Wix.
13. Enviar e-mail resumo.

## Atualizacao pos-handoff em 2026-06-16

Este bloco registra o que ja foi concluido depois da criacao deste handoff, para evitar que uma proxima conversa volte ao ponto antigo.

- Backup pre-mudancas criado em `C:\Users\MF\Documents\BACKUPSSITECODEX\MobilyTechBR_backup_pre_changes_2026-06-16_122553.zip`.
- `scripts/build_phase2_ibuy_style.py` foi corrigido para escapar `Qtd. ${{quantity}}` dentro da f-string Python, e o site fase 2 foi regenerado.
- Testes locais passaram para `node --check`, limite de Vercel Functions, frete por quantidade de fornecedor, bloqueio de quantidade para produto fisico, cupom `MOBMEN`, retirada local, busca, carrinho, desktop/mobile e painel.
- Publicacao Vercel concluida no `main` com commit `d46d9e2`; production verificada como `READY`.
- Apps Script separado de pos-venda foi atualizado/publicado sem sobrescrever a rotina mensal existente da planilha. `Vendas_PCs` continua em `A:I`; extras vao para `Vendas_PCs_Metadata`.
- Endpoints de pos-venda foram configurados na Vercel como variaveis sensiveis de Production. Nao registrar a URL completa do Web App em docs, chat ou prints.
- `ADMIN_WRITE_TOKEN` segue pendente por decisao segura; `api/register-sale.js` retorna 501 controlado enquanto ele nao existir.
- O blocker do dominio oficial foi resolvido para `www.mobilytech.com.br`: o CNAME `www` no Wix DNS aponta para Vercel, e Vercel Domains mostra `www.mobilytech.com.br` como `Valid Configuration`.
- `https://www.mobilytech.com.br/fase2/ofertas.html` responde 200 via Vercel e tem HTML identico ao Vercel de referencia `https://mobilytechbr.vercel.app/fase2/ofertas.html`, SHA-256 `a36c60e328345a139fc1acb5b735bc9533b42d16935f45565d89e591266798ae`.
- `https://mobilytech.com.br/` permanece no Wix como redirect 301 para `https://www.mobilytech.com.br/`. Durante propagacao, navegadores que cachearam DNS antigo podem mostrar 404 Wix em subrotas; resolvers externos e HTTP direto ja validaram o `www` na Vercel.
- Crocheck ChatGPT em modo `muito alto`: primeiro bloqueou por subrota 404; depois da correcao DNS aprovou publicacao real, nota 9,1/10, sem blockers.
- Evidencias atuais: `docs/qa/production-final-2026-06-16-env-redeploy/qa-results.json` e `docs/qa/production-final-2026-06-16-env-redeploy/official-domain-byte-compare.json`.
- Investigacao de crash/fechamento: Crashpad do Codex tem dumps em `C:\Users\MF\AppData\Local\Packages\OpenAI.Codex_2p2nqsd0c76g0\LocalCache\Roaming\Codex\web\Codex\Crashpad\reports`; Windows Event Viewer mostrou `APPCRASH` do Opera GX `132.0.5905.43` em `opera_browser.dll` com excecao `0xc0000005` e historico de watchdog/GPU. Mitigacao: nao usar Browser interno para Google OAuth/Apps Script, evitar Opera headless, preferir conectores/shell/HTTP para QA e Opera normal apenas quando login humano for necessario.
- Fechamento adicional: os 11 modelos de e-mails transacionais foram regenerados a partir do Apps Script local e enviados como e-mails reais de teste para a conta MobilyTech/Gmail; os 11 assuntos `[TESTE CLIENTE]`/`[TESTE VENDEDOR]` foram confirmados em `SENT`. Depois do adendo do usuario, os e-mails de vendedor receberam tema proprio em azul mais escuro, faixa superior discreta e botoes/blocos no mesmo tom, mantendo a estrutura; cinco testes `[TESTE VENDEDOR - AJUSTE COR]` foram enviados ao Gmail.
- Fechamento adicional: `www.mobilytech.com.br` ja serve a home Vercel com titulo `MobilyTech BR | Loja gamer` e link para `assets/favicon.png`; foram adicionados tambem `favicon.ico`, `favicon.png` e `apple-touch-icon.png` na raiz publica para cobrir `/favicon.ico` direto apos deploy.
- `ADMIN_WRITE_TOKEN`: foi gerado localmente sem imprimir o valor e salvo criptografado por DPAPI em `C:\Users\MF\Documents\BACKUPSSITECODEX\MobilyTechBR_secrets\admin-write-token.dpapi.txt`, com helper `copy-admin-token-to-clipboard.ps1`. O usuario informou que colou o valor na Vercel como env var sensivel de Production e fez redeploy. Validacao segura com token errado retornou 401 em producao, nao 501, confirmando que a env var esta ativa. Foi adicionado `dryRun`/`mode=auth-check` em `api/register-sale.js` para validar o token correto sem registrar venda real; depois do deploy `99106c0`, o token real em `dryRun` retornou 200 com `authenticated:true` sem chamar o Apps Script/upstream.
- Login/headless: nao criar OAuth App Wix ainda. A documentacao oficial confirma que Create OAuth App retorna `secret`; sem canal seguro para gravar esse segredo em env vars, manter `fase2/minha-conta.html` como consulta/atendimento seguro e nao expor login social real/fake.
- Deploy final: commit `99106c0` (`Finalize admin token and seller emails`) gerou deploy Vercel `dpl_BHy7ttr5FocwThk5wHazzgzwQ32M`, estado `READY`. QA em `www.mobilytech.com.br` com `qa=99106c0` confirmou home, `/fase2/ofertas.html`, `/fase2/minha-conta.html`, `/favicon.ico`, `/favicon.png` e `/apple-touch-icon.png` com 200 via Vercel.
- Apps Script vivo: a fonte local esta atualizada/testada, mas qualquer publicacao no projeto Apps Script real deve preservar a codificacao mensal existente na planilha. Preferir backup/compare ou Web App separado; nao sobrescrever script vivo em massa sem verificar.
- Investigacao final Codex/Opera: Event Viewer mostrou APPCRASH do Opera GX `132.0.5905.43` em `opera_browser.dll` com excecao `0xc0000005`, alem de historico `LiveKernelEvent`/watchdog GPU. Crashpad do Codex tem dumps recentes, mas nao apareceu APPCRASH textual do Codex nas ultimas horas. Mitigacao adotada: evitar Opera GX/Browser interno para OAuth/Apps Script e tarefas longas; usar conectores oficiais/shell/HTTP; nao mexer em driver/cache/perfil sem janela propria.
- Pendencias restantes reais: sincronizar as copias do handoff e decidir/publicar Apps Script vivo com salvaguarda se a cor nova dos e-mails de vendedor precisar entrar no Web App real. Wix Headless/Auth real fica como opcional bloqueado por armazenamento seguro de OAuth secret.

## Checklist final para a proxima IA

### Antes de editar

- [ ] Ler este handoff.
- [ ] Ler `docs/ACTIVE_MOBILYTECH_LEDGER.md`.
- [ ] Conferir estado real dos arquivos.
- [ ] Testar Wix/Gmail/Drive/Vercel se forem usados.
- [ ] Tentar recuperar Computer Use se nao aparecer.
- [ ] Nao assumir que ultima mensagem antes da compactacao e a unica tarefa.

### Corrigir ponto atual

- [ ] Corrigir `scripts/build_phase2_ibuy_style.py` no trecho `Qtd. ${quantity}` para escapar template JS dentro da f-string Python.
- [ ] Procurar outros `${...}` nao escapados no script.
- [ ] Regenerar site.
- [ ] Rodar `node --check`.
- [ ] Rodar testes funcionais locais.

### Funcionalidades pendentes

- [ ] Fechar estoque fisico unitario no frontend e backend.
- [ ] Frete fornecedor separado do Melhor Envio.
- [ ] Campo cupom e `MOBMEN` funcionando sem aplicar ao frete.
- [ ] Dropshipping com margem global 25%, manual minimo 35%, margem por produto.
- [ ] MobilyTech Finds em grade, com afiliados e vendidos pela MobilyTech separados internamente.
- [ ] Painel com registro de venda manual e sync Planilha OLX.
- [ ] Apps Script sem sobrescrever script antigo.
- [x] E-mails transacionais bonitos e testados por previews HTML reais enviados ao Gmail; vendedor diferenciado por azul mais escuro.
- [x] Login/conta/pedidos: bloqueio seguro documentado; manter consulta de pedido, sem login fake, ate existir armazenamento seguro de OAuth secret.
- [x] Ponte Wix/dominio oficial usando visual Vercel no `www.mobilytech.com.br`.
- [x] Confirmar favicon/logo no dominio oficial; root favicon adicionado para deploy Vercel.
- [x] Validar `ADMIN_WRITE_TOKEN` em producao com `dryRun`, sem registrar venda real.

### QA e publicacao

- [ ] QA desktop.
- [ ] QA mobile.
- [ ] QA carrinho/frete/checkout.
- [ ] QA painel/admin.
- [ ] Crosscheck final visual com ChatGPT.
- [ ] Backup em `C:\Users\MF\Documents\BACKUPSSITECODEX`.
- [ ] Publicar quando seguro.
- [ ] Enviar Gmail resumo com link oficial e pendencias reais.
- [ ] Se tudo terminar e o usuario pedir desligar, usar timer de 10 minutos, nao desligar imediatamente.

## O que nao fazer

- Nao voltar para Wix builder puro.
- Nao voltar para tema dark antigo sem pedido explicito.
- Nao expor secrets.
- Nao mexer em DNS sem entender exatamente.
- Nao publicar site quebrado.
- Nao criar novas Vercel Functions sem checar limite Hobby.
- Nao trocar stack para React/Next sem decisao explicita.
- Nao remover backups.
- Nao substituir fotos reais por imagens inventadas.
- Nao deixar termos internos visiveis ao cliente.

## Resumo do ponto exato para continuar

A proxima IA nao deve voltar ao erro antigo de `${quantity}`: isso ja esta corrigido (`Qtd. ${{quantity}}`) e o build da fase 2 ja rodou sem erro. Estado atual: commit `99106c0` publicado e validado em `www.mobilytech.com.br`; favicon raiz e `ADMIN_WRITE_TOKEN` em `dryRun` confirmados. Proximos passos, se ainda necessarios: publicar a cor nova dos e-mails de vendedor no Apps Script vivo usando backup/compare para nao sobrescrever a codificacao mensal, manter Wix Headless/Auth como opcional bloqueado por segredo OAuth seguro, e continuar usando conectores/API/shell em vez de Opera GX para evitar novos crashes.
