# MobilyTech BR - Ledger ativo

Este arquivo existe para evitar perda de sequencia quando o contexto for compactado automaticamente.

## Regra operacional

- Mensagens novas do usuario durante uma tarefa longa sao complementos por padrao.
- Nao substituir tarefas anteriores por um complemento, salvo se o usuario disser explicitamente que e um fechamento, cancelamento ou mudanca de prioridade.
- Depois de compactacao automatica, retomar pelo plano ativo, por este ledger e pelo estado real dos arquivos, nao pela ultima frase isolada antes da compactacao.
- Nao reabrir itens ja resolvidos apenas porque apareceram perto da linha de compactacao.
- Se houver duvida, verificar o arquivo, a pagina ou o conector atual antes de responder como se o tema ainda estivesse aberto.

## Estado em andamento

- Fechar carrinho com cupom, retirada local e frete de fornecedor separado do Melhor Envio.
- Completar suporte backend para cupom local `MOBMEN` sem criar nova Vercel Function.
- Manter dropshipping com frete cobrado do cliente, origem nacional/internacional e margem editavel no painel.
- Complementar painel com origem, lucro estimado, margem e registro de venda para Planilha OLX.
- Atualizar modelo do Google Apps Script para a Planilha OLX correta, sem sobrescrever script antigo do usuario.
- Regenerar o site fase 2, validar desktop/mobile, busca, carrinho, frete, checkout e painel.
- Preparar ponte Wix/Headless e dominio oficial como etapa de publicacao/integração, preservando visual Vercel.
- Registro manual de venda no painel e para vendas fora do site: OLX, Facebook Marketplace e atendimento direto. Venda feita pelo checkout do site deve baixar estoque automaticamente e manter o fluxo de e-mails/status do pedido.
- Produtos fisicos da MobilyTech BR (PCs, SSDs, fontes e pecas em estoque local) tem estoque unitario por padrao e nao podem ser adicionados ao carrinho mais de uma vez. Produtos de dropshipping/fornecedor podem aceitar quantidade maior.
