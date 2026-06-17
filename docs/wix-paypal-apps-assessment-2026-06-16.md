# MobilyTech BR - Avaliacao PayPal e apps Wix

Data: 2026-06-16

Escopo: avaliar PayPal e apps Wix citados pelo usuario, usando somente opcoes gratuitas permanentes quando houver. Nenhuma instalacao/contratacao foi feita nesta rodada.

## Status do conector Wix

- O conector Wix retornou: `This app connection requires reauthentication before other actions on this app can succeed.`
- Por seguranca, nao foi tentada instalacao via API sem conexao ativa.
- Proximo passo se for testar dentro do Wix: reautenticar o conector Wix ou usar painel Wix logado no navegador, confirmando que qualquer app escolhido esta no plano gratuito permanente.

### Atualizacao 2026-06-16/17 - conector revalidado e painel Wix

- Apos o usuario reconectar/logar no Wix, o conector Wix voltou a responder para o site canonico `85e985c5-2904-452f-85e2-a98f6d3b1cac`.
- API oficial `GET https://www.wixapis.com/apps-installer-service/v1/app-instances` retornou a lista completa de app instances habilitadas no site. A resposta traz `appDefId`, `version`, `enabled` e `status`, mas nao traz nomes comerciais; por isso a decisao de negocio abaixo usa tambem o painel Wix e paginas oficiais do App Market.
- No painel Wix observado pelo navegador logado, `AI Product Images` mostrou `20 creditos` no plano gratuito. Isso confirma que ele pode servir para teste pequeno, mas nao para substituir em massa o fluxo atual de recorte/melhoria de todas as imagens de PCs/SSDs.
- No painel Wix observado, `Dropi` apareceu como `Trial Profissional` com poucos dias restantes, apesar do App Market listar free plan. Pela regra do usuario, nao usar operacionalmente enquanto o painel nao estiver explicitamente em plano gratuito permanente.
- No painel Wix observado, `Modalyst` entrou em `Hobby plan`, com limite restante baixo para produtos. Pode ser consultado, mas nao deve virar fonte principal de produtos sem limpeza do catalogo importado e validacao de fornecedores/frete Brasil.

## PayPal

Fontes:
- PayPal Standard Checkout: https://developer.paypal.com/studio/checkout/standard/integrate
- PayPal JS SDK reference: https://developer.paypal.com/sdk/js/reference/
- PayPal Orders API v2: https://developer.paypal.com/docs/api/orders/v2/
- Wix App Market/PURPLE lista `PayPal Payment Button` com free plan available: https://www.wix.com/app-market/developer/purple

Conclusao:
- Para o site Vercel atual, o caminho correto nao e um botao HTML simples. O PayPal recomenda backend para criar pedido e capturar pagamento via Orders API, usando `PAYPAL_CLIENT_ID` e `PAYPAL_CLIENT_SECRET` em variaveis de ambiente.
- Isso exigiria criar novas rotas tipo `/api/paypal-create-order` e `/api/paypal-capture-order`, webhook/registro de pedido, tratamento de frete/cupom e segredo PayPal em Vercel.
- Recomendacao: nao adicionar agora como terceiro checkout vivo. Manter Mercado Pago + Abacate Pay ate o fluxo atual estar publicado/validado. PayPal pode entrar depois como etapa propria com credenciais seguras.
- O app Wix `PayPal Payment Button` tem plano gratuito disponivel, mas parece mais adequado para botao/pagamento simples em site Wix, nao para substituir o carrinho customizado Vercel com produtos, cupom, frete e Apps Script.

## Apps de imagem

### AI Product Images (MarketPushApps)

Fonte: https://www.wix.com/app-market/ai-product-images

- Plano gratuito: 20 image credits.
- Avaliacao publica vista: 4.9 com 369 reviews.
- Recursos relevantes: limpar iluminacao, melhorar nitidez, trocar fundo, publicar direto nas imagens de produto Wix.
- Recomendacao atualizada: melhor candidato para teste visual gratuito dentro do Wix, mas limitado a imagens de produtos Wix e a 20 creditos. Nao atende ao pedido de refazer todas as imagens do site atual. Usar somente em 1-2 imagens duplicadas/nao criticas e comparar por crocheck antes de substituir o metodo atual.

### AI Product Photos and Images (CreatorKit)

Fonte: https://www.wix.com/app-market/ai-product-photos-and-images

- Plano gratuito: 8 AI generations, HD resolution, 200 MB cloud storage.
- Avaliacao publica vista: 2.3 com 3 reviews.
- Recursos relevantes: imagens de produto com IA, edicoes, fundos e blend do produto no cenario.
- Recomendacao: candidato secundario. So testar se o `AI Product Images` nao entregar qualidade suficiente.

## Apps de dropshipping/importacao

### DSers - AliExpress Dropshipping

Fonte: https://www.wix.com/app-market/dsers-aliexpress-dropshipping

- Plano gratuito: ate 3 stores por conta, ate 3000 produtos por conta e pedidos ilimitados.
- Requer Wix Stores.
- Recursos relevantes: importacao AliExpress/Alibaba/1688, bulk orders, auto-sync de estoque/preco/pedido/rastreio, supplier optimization.
- Recomendacao: melhor candidato gratuito para AliExpress se a operacao migrar para Wix Stores. Nao instalar/testar sem confirmar conexao Wix ativa e sem separar produtos de teste.

### Dropi - AliExpress & FForder

Fonte: https://www.wix.com/app-market/dropi-aliexpress-nacional

- App Market informa plano gratuito e foco no mercado brasileiro, AliExpress/CJ/fornecedores nacionais, sincronizacao de pedidos e traducao.
- Painel do site MobilyTech mostrou `Trial Profissional`, nao plano gratuito permanente.
- Recomendacao: manter em observacao, mas nao usar como rotina enquanto a conta/painel nao estiver claramente no plano gratuito. Se o trial acabar e virar free real sem cobranca, reavaliar.

### Modalyst - Dropshipping

Fonte: https://www.wix.com/app-market/modalyst

- App Market informa marketplace de fornecedores dropshipping/POD, com Wix Stores como requisito.
- Modalyst informa que existe entrada gratuita/Hobby, mas fontes de precificacao indicam limite de produtos e taxa/transacao no plano gratuito.
- Painel do site mostrou `Hobby plan`, `My Products 18`, `Import List 1`, `Sync List 17` e apenas `7 products left`.
- Recomendacao: nao usar para escalar o catalogo MobilyTech agora. Serve para aprender/testar fluxo, mas a conta ja esta quase no limite gratuito e os produtos importados precisam ser revisados/limpos.

### AppScenic - Smart Dropshipping

Fonte: https://www.wix.com/app-market/appscenic-smart-dropshipping

- Tem free plan e tambem trial; free plan informa 1 loja conectada e 500 produtos importados, sem premium products.
- Foco em fornecedores USA/UK/EU/CAN/AUS e automacao.
- Recomendacao: candidato interessante para fornecedores fora do AliExpress, mas validar disponibilidade/preco/frete para Brasil antes de usar.

### DropCommerce

Fonte: https://www.wix.com/app-market/dropcommerce-us-dropshipping

- Free plan visto como `Preview plan`: navegar fornecedores/produtos e pedir amostras.
- Importar produtos exige plano pago.
- Recomendacao: nao usar agora para MobilyTech, porque nao atende a regra de operacao gratuita completa.

### Product Upload: AI importer

Fonte: https://www.wix.com/app-market/product-upload

- Plano gratuito: 5 product searches.
- Serve para importar dados de produto de Amazon, AliExpress, Alibaba, Temu, eBay, CJ etc.
- Recomendacao: util como teste limitado de importacao/cadastro, nao como solucao operacional continua gratuita.

### Zonify - Amazon Affiliate

Fonte: https://www.wix.com/app-market/zonify-amazon-affiliate

- Apenas trial de 3 dias e planos pagos em BRL.
- Recomendacao: rejeitar por enquanto. Nao atende a regra do usuario de usar somente plano gratuito permanente.

## Decisao operacional desta rodada

1. Nao adicionar PayPal ao checkout agora.
2. Nao instalar Zonify.
3. Nao usar Dropi enquanto o painel indicar trial profissional.
4. Nao gastar creditos do `AI Product Images` em massa: o limite gratuito de 20 creditos e o escopo limitado a produtos Wix nao cobrem todo o site atual.
5. Para dropshipping Wix, priorizar DSers (AliExpress) como melhor plano gratuito permanente; Modalyst fica apenas como teste/observacao por limite baixo; AppScenic pode ser alternativa se houver produto com frete Brasil viavel.
6. Manter a operacao Vercel atual como fonte final ate a migracao Wix estar comprovada.
