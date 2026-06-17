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
- Quando o checkout Mercado Pago ou Abacate Pay e criado, as funcoes existentes tentam avisar `ORDER_NOTIFICATION_ENDPOINT` com `order_status=PENDENTE`. Se a variavel nao estiver configurada, o checkout continua normal e esse aviso fica apenas pulado.
- O Apps Script salva o pedido na aba `Pedidos`.
- A cada 5 minutos, ele envia:
  - e-mail de pedido recebido/pagamento pendente para o cliente;
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

- Precos sao conferidos pelo Facebook Marketplace quando houver link do Facebook.
- Para SSDs sem link do Facebook, a OLX pode ser usada como fonte de preco.
- OLX tambem sugere links de redirecionamento, sempre com aprovacao por e-mail.
- Quando a confianca fica abaixo de 95%, o script envia um unico e-mail de revisao para `mobilytechbr@gmail.com`.
- Quando a confianca fica em 95% ou mais, o script pode aplicar a alteracao sozinho e envia um e-mail com botao para desfazer.
- Se o anuncio parecer removido/vendido, vale o mesmo fluxo: alta confianca pode remover, baixa confianca pede revisao.
- Anuncios novos detectados no Facebook viram rascunhos inativos em `data/products.json`, incluindo PCs e fontes.
- SSDs novos detectados na OLX tambem viram rascunhos inativos; o script usa medidas padrao de embalagem de SSD.
- Os rascunhos nao aparecem para clientes ate voce revisar fotos, conferir as informacoes e ativar no painel.

Medidas automaticas dos rascunhos:

- SSD: `15 x 13 x 7 cm`, `1 kg`.
- Fonte: `30 x 25 x 15 cm`, `3.5 kg`.

Para os botoes de aprovar/desfazer realmente alterarem o site, configure nas **Propriedades do script** do Apps Script:

- `GITHUB_TOKEN`: token fino do GitHub com acesso de leitura/escrita ao repositorio.
- `GITHUB_OWNER`: `MobilyTechBR`
- `GITHUB_REPO`: `mobilytechbr`
- `GITHUB_BRANCH`: `main`
- `GITHUB_PRODUCTS_PATH`: `data/products.json`

Sem `GITHUB_TOKEN`, o script ainda envia os e-mails e registra a revisao na planilha, mas nao altera o site sozinho.

## Editor visual do painel

O painel interno tambem edita `data/site-content.json`, que controla textos, destaque e artes das paginas da fase 2.

- O botao `Baixar site-content.json revisado` continua sendo o fallback seguro.
- O botao `Salvar no site` chama `/api/update-site-content` e exige sessao admin ou `ADMIN_WRITE_TOKEN`.
- Para gravar direto no GitHub, configure na Vercel uma variavel sensivel de servidor:

`GITHUB_CONTENT_WRITE_TOKEN`

Use um token fino do GitHub com acesso apenas ao repositorio `MobilyTechBR/mobilytechbr` e permissao de leitura/escrita em contents. Sem esse token, a rota retorna `needsConfig` e nao grava nada.

## Registro de venda pelo painel

O painel interno pode registrar uma venda manual na aba `Vendas_PCs` e, se o GitHub estiver configurado no Apps Script, desativar o produto vendido em `data/products.json`.

Na Vercel, configure:

- `ADMIN_WRITE_TOKEN`: token privado para autorizar a chamada do painel para `/api/register-sale`.
- `SALES_REGISTRATION_ENDPOINT`: URL do Web App do Apps Script. Se nao existir, a funcao usa `ORDER_NOTIFICATION_ENDPOINT`.

No Apps Script, mantenha as propriedades de GitHub acima se quiser que o produto seja desativado automaticamente. Sem `GITHUB_TOKEN`, a venda ainda pode ser registrada na planilha, mas a remocao do site precisa ser aplicada pelo JSON revisado baixado no painel.

Ao rodar `setupMobilyTechPostSale()` ou registrar a primeira venda depois da atualizacao, a aba `Vendas_PCs` continua usando somente as 9 colunas financeiras originais, de `A:I`.

Isso e importante porque a planilha OLX ja tem um Apps Script de relatorio mensal e ordenacao que trata `Vendas_PCs` como tabela `A:I` e usa colunas auxiliares fora dessa faixa. Para evitar conflito, o registro manual grava informacoes extras em uma aba separada:

- `Vendas_PCs_Metadata`

Essa aba separada recebe:

- `Linha Vendas_PCs`
- `Dia da Venda`
- `Canal`
- `ProdutoID`
- `Status no Site`
- `Observacoes`
- `RegistradoEm`

Nao cole este script por cima do projeto `MobilyTech Relatorio Mensal` sem revisar os nomes globais e fazer backup. O caminho mais seguro e manter o pos-venda em um Web App separado apontando para a mesma planilha.

## Historico de pedidos na conta do cliente

A pagina `Minha conta` consulta `/api/customer-orders`, que so responde quando o cliente esta logado no site. Essa funcao da Vercel chama o Apps Script com a acao `lookup-customer-orders`.

Na Vercel, configure:

- `CUSTOMER_ORDERS_ENDPOINT`: URL do Web App do Apps Script.
- `CUSTOMER_ORDERS_TOKEN`: token secreto compartilhado com o Apps Script.

Nas **Propriedades do script** do Apps Script, configure o mesmo valor em:

- `CUSTOMER_ORDERS_TOKEN`

A consulta e somente leitura: ela le a aba `Pedidos`, filtra por `ClienteEmail` igual ao e-mail da conta logada e retorna apenas campos publicos do pedido. Ela nao altera `Vendas_PCs`, nao chama GitHub, nao dispara e-mails e nao mexe nas colunas `A:I` usadas pelo relatorio mensal.

## Testes de e-mail

O Apps Script inclui a funcao `sendTestTransactionalEmails()` para enviar exemplos para `mobilytechbr@gmail.com` com assunto marcado como `TESTE CLIENTE` ou `TESTE VENDEDOR`.

Modelos cobertos:

- Cliente: pedido recebido/pagamento pendente.
- Cliente: compra confirmada.
- Cliente: pagamento aprovado.
- Cliente: pedido despachado/rastreio.
- Cliente: retirada a combinar.
- Cliente: entregue/pos-venda.
- Vendedor: nova venda no site.
- Vendedor: nova venda manual/fornecedor.
- Vendedor: pedido despachado.
- Vendedor: pedido entregue.
- Vendedor: erro/bloqueio de pagamento ou frete.
