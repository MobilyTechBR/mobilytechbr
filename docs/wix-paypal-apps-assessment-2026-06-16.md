# MobilyTech BR - Avaliacao PayPal e apps Wix

Data: 2026-06-16

Escopo: avaliar PayPal e apps Wix citados pelo usuario, usando somente opcoes gratuitas permanentes quando houver. Nenhuma instalacao/contratacao foi feita nesta rodada.

## Status do conector Wix

- O conector Wix retornou: `This app connection requires reauthentication before other actions on this app can succeed.`
- Por seguranca, nao foi tentada instalacao via API sem conexao ativa.
- Proximo passo se for testar dentro do Wix: reautenticar o conector Wix ou usar painel Wix logado no navegador, confirmando que qualquer app escolhido esta no plano gratuito permanente.

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
- Recomendacao: melhor candidato para teste visual gratuito. Usar primeiro em 1-2 imagens duplicadas/nao criticas e comparar com o metodo atual.

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
3. Priorizar teste gratuito do `AI Product Images` quando houver acesso Wix reautenticado/painel.
4. Para dropshipping Wix, priorizar DSers (AliExpress) e considerar AppScenic como alternativa, sempre em produtos de teste e sem trial/pago.
5. Manter a operacao Vercel atual como fonte final ate a migracao Wix estar comprovada.
