# Pos-venda MobilyTech BR

Este arquivo deixa pronto o caminho de pos-venda por Google Apps Script.

## Arquivos

- `mobilytech-pos-venda.gs`: cole no Apps Script de uma planilha.
- `data/automation-settings.json`: aparece no painel do site para ligar/desligar automacoes.

## Setup recomendado

1. Crie uma planilha no Google Sheets.
2. Abra `Extensoes > Apps Script`.
3. Cole o conteudo de `mobilytech-pos-venda.gs`.
4. Troque `COLE_AQUI_O_ID_DA_PLANILHA` pelo ID da planilha.
5. Rode `setupMobilyTechPostSale()` uma vez.
6. Publique como Web App.
7. Na Vercel, configure `ORDER_NOTIFICATION_ENDPOINT` com a URL do Web App.
8. Na Vercel, configure `ORDER_CONFIRMATION_SECRET` com uma frase forte qualquer para assinar os links de confirmacao de etiqueta.
9. No painel do Abacate Pay, configure o webhook para:

`https://mobilytechbr.vercel.app/api/abacate-pay-webhook`

O Mercado Pago continua usando o webhook proprio que ja esta configurado no projeto.

## Como funciona

- Quando o Mercado Pago ou Abacate Pay confirmar uma venda, o webhook envia os dados para o Apps Script.
- O Apps Script salva o pedido na aba `Pedidos`.
- A cada 5 minutos, ele envia:
  - e-mail de compra confirmada para o cliente;
  - e-mail interno para `mobilytechbr@gmail.com`;
  - e-mail de rastreio quando a coluna `CodigoRastreio` for preenchida e o status virar `DESPACHADO`;
  - e-mail de entrega quando o status virar `ENTREGUE`.

## Etiqueta do Melhor Envio

O e-mail interno inclui o link `Confirmar etiqueta` quando a venda tiver frete.

Por seguranca, a compra automatica de etiqueta continua dependendo da variavel:

`MELHOR_ENVIO_ENABLE_LABEL_PURCHASE=true`

Se voce negar a etiqueta pelo link do Apps Script, o pedido fica marcado como `CANCELAR` e `ReembolsoManual = Pendente`.

## Transportadoras no checkout

O checkout consulta o Melhor Envio e aceita, por padrao, cotacoes de:

`correios,jadlog,loggi`

O Correios aparece como opcao recomendada quando estiver disponivel. Para trocar a lista sem mexer no codigo, use estas variaveis na Vercel:

- `SHIPPING_ALLOWED_CARRIERS`: lista separada por virgula, por exemplo `correios,jadlog,loggi`.
- `SHIPPING_PREFERRED_CARRIER`: transportadora recomendada, por exemplo `correios`.

## Automacao de anuncios Facebook/OLX

A automacao pode revisar anuncios a cada intervalo configurado no painel.

Fluxo atual:

- Precos sao conferidos pelo Facebook Marketplace.
- OLX nao muda preco: ela so sugere links de redirecionamento, sempre com aprovacao por e-mail.
- Quando a confianca fica abaixo de 95%, o script envia um unico e-mail de revisao para `mobilytechbr@gmail.com`.
- Quando a confianca fica em 95% ou mais, o script pode aplicar a alteracao sozinho e envia um e-mail com botao para desfazer.
- Se o anuncio parecer removido/vendido, vale o mesmo fluxo: alta confianca pode remover, baixa confianca pede revisao.
- Anuncios novos detectados no Facebook viram rascunhos inativos em `data/products.json`, para aparecerem no painel sem aparecerem para clientes ate voce revisar fotos e ativar.

Para os botoes de aprovar/desfazer realmente alterarem o site, configure nas **Propriedades do script** do Apps Script:

- `GITHUB_TOKEN`: token fino do GitHub com acesso de leitura/escrita ao repositorio.
- `GITHUB_OWNER`: `MobilyTechBR`
- `GITHUB_REPO`: `mobilytechbr`
- `GITHUB_BRANCH`: `main`
- `GITHUB_PRODUCTS_PATH`: `data/products.json`

Sem `GITHUB_TOKEN`, o script ainda envia os e-mails e registra a revisao na planilha, mas nao altera o site sozinho.
