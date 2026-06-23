# Arquivo CJ / dropshipping internacional

Atualizado em 2026-06-23.

## Status

O modelo CJ/CJDropshipping foi pausado por decisao operacional. A vitrine publica atual deve usar **Produtos sob encomenda na MobilyTech BR**, com origem nacional e frete final por CEP a partir da MobilyTech.

## O que foi preservado

- Scripts e bibliotecas relacionados ao CJ continuam no repositorio para uma reativacao futura.
- A nomenclatura tecnica `dropshippingProducts` ainda existe em alguns pontos internos porque alimenta a mesma rota/grade de compra direta. Ela nao deve aparecer como texto publico para o cliente.
- Backups locais criados antes da migracao:
  - `backups/products-before-sob-encomenda-20260623-023738.json`
  - `backups/site-content-before-sob-encomenda-20260623-023738.json`
  - `backups/automation-settings-before-sob-encomenda-20260623-023738.json`

## Regra para reativar

Reativar CJ apenas quando todos os pontos abaixo estiverem confirmados:

- Produto com SKU/VID valido no CJ.
- Frete exato por CEP funcionando em API, sem frete padrao ou estimado.
- Preco incluindo custo do produto, frete, tributos/importacao quando aplicavel, taxa de pagamento, margem e buffer.
- Textos legais e checkout revisados para compra internacional.
- QA visual/funcional com screenshots desktop/mobile e crosscheck Ollama/local antes de publicar.

## Regra publica atual

Enquanto CJ estiver pausado:

- Nao usar os termos `CJ`, `CJDropshipping`, `CJPacket` ou `dropshipping` em texto publico.
- Usar `Produtos sob encomenda`, `compra direta MobilyTech BR`, `produto nacional sob encomenda` e `frete final por CEP`.
