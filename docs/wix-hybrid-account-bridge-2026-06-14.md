# MobilyTech BR - ponte Wix, conta e pedidos

Data: 2026-06-14

## Implementado localmente na Fase 2

- Nova pagina publica `fase2/minha-conta.html`.
- Link de conta no cabecalho e no rodape.
- Busca interna agora encontra "Minha conta", pedidos, rastreio, login e retirada.
- Pagina de conta preparada para:
  - acesso seguro via Wix Members;
  - enderecos e historico de pedidos pela camada Wix;
  - status de pedido;
  - retirada local a combinar;
  - contato rapido por WhatsApp.
- Dados de pagamento nao sao armazenados no front-end. Cartao e metodos sensiveis devem ficar apenas nos provedores de checkout.

## Status de pedido previsto

1. Pagamento pendente.
2. Pagamento aprovado.
3. Despachado.
4. Em transporte.
5. Entregue ou retirada combinada.

## Painel/admin

`admin/index.html` foi atualizado visualmente para combinar com a nova fase do site e servir como mapa operacional:

- leitura dos JSONs do catalogo;
- links para Pages CMS, Wix e Fase 2;
- checklist de espelhamento Wix;
- aviso para nao colar tokens, senhas ou secrets no painel;
- referencia da nova pagina de conta/pedidos.

## Wix API

Ao tentar iniciar o fluxo oficial do plugin Wix em 2026-06-14, a resposta foi:

`token_expired`

Significa que a conexao do plugin/API Wix precisa ser renovada antes de chamadas reais para configurar Wix Members, Wix Stores, pedidos, dominio ou checkout.

Nova tentativa em 2026-06-14 apos o adendo de conta/admin retornou o mesmo erro `token_expired`.

## CrossCheck final do adendo

Evidencias salvas em `docs/qa/phase2-polish-2026-06-14`:

- `final3-crosscheck-board-20260614163023.png`
- `chatgpt-final-adendo-approved-20260614163023.png`
- `final2-code-qa-public-internal.json`

Veredito visual do CrossCheck: aprovado para backup/publicacao da Fase 2, com notas 97-99 nas areas avaliadas.

Observacao de seguranca de texto: as paginas publicas foram ajustadas para nao mencionar Vercel, Wix Members, plano hibrido, dropshipping, afiliado, preview ou rascunho. Termos tecnicos permanecem apenas no painel interno/admin.

## Proximo passo quando a conexao Wix voltar

1. Listar sites Wix e confirmar o site premium/domino correto.
2. Confirmar apps instalados: Stores, Members, Checkout/eCommerce, Melhor Envio/entrega, Marketing.
3. Conectar a pagina `Minha conta` ao Members/Orders do Wix.
4. Sincronizar catalogo ou criar colecoes CMS para espelhar dados Vercel.
5. Testar pedido real/sandbox com frete, pagamento e retirada local.
6. So depois apontar dominio oficial para a experiencia aprovada.
