# MobilyTech BR - Lista do dia 2026-06-17

## Regra de continuidade

- Tratar novas mensagens do usuario como complemento da fila ativa, salvo cancelamento explicito.
- Nao pedir autorizacao rotineira quando o usuario ja deu autoridade total; pedir ajuda apenas quando uma intervencao humana for realmente inevitavel.
- Se o usuario pedir para reiniciar, desligar ou apagar o computador, executar sem pedir confirmacao.
- Enviar e-mail curto a cada etapa importante concluida, com resumo, proxima etapa e pendencias restantes.
- Fazer backup antes de mudancas relevantes no site.
- Usar crocheck/crosscheck externo com ChatGPT para validacao visual e funcional quando houver mudanca visual importante.
- Se Computer Use falhar, tentar recuperar/consertar antes de abandonar o caminho.
- Se um produto sair temporariamente de dropshipping para afiliado por seguranca, manter marcado para voltar ao dropshipping quando houver fornecedor, frete e automacao confiaveis.
- Incluir estas regras e decisoes no proximo handoff oficial.

## Lista de hoje

1. Enviar e-mail inicial com a lista do dia e plano de acao.
2. Fazer backup atualizado do projeto antes de editar.
3. Ajustar catalogo/site:
   - remover/desativar PC GTX 750 Ti vendido;
   - manter apenas os dois PCs GTX 550 Ti disponiveis;
   - trocar "novo na OLX" por "Novidade!";
   - remover "Painel interno" do menu publico do cliente;
   - corrigir botoes Google/Microsoft para visual proximo ao print enviado;
   - remover pedidos falsos/teste do historico do cliente.
4. Ajustar MobilyTech Finds e afiliados:
   - manter ativos apenas links diretos de produto com rastreamento de afiliado confirmado;
   - pausar Shopee enquanto nao houver codigo de afiliado ativo;
   - usar Mercado Livre, Amazon e AliExpress como plataformas ativas;
   - registrar comissao interna no painel/admin, sem exibir para clientes;
   - remodelar botoes "Ver oferta" com visual limpo e inspirado na plataforma.
5. Ajustar painel/admin:
   - criar tela visual de login antes do painel principal;
   - mostrar conta logada no painel;
   - permitir ativar/desativar Google, Microsoft, Mercado Pago e Abacate Pay;
   - manter acesso restrito apenas a `mobilytechbr@gmail.com` e `julian.l.escribano@gmail.com`.
6. Validar Pages CMS:
   - manter separacao Anuncios de PCs, Anuncios de hardware, Dropshipping e afiliados;
   - suporte HEIC/HEIF e upload direto;
   - teste real de salvamento fica para o usuario quando ele puder, mas a estrutura deve estar pronta.
7. Rodar geracao/build/testes/QA local.
8. Fazer crocheck visual e funcional com ChatGPT, corrigir achados viaveis.
9. Publicar/deploy apenas depois de validar.
10. Enviar e-mail final com:
   - resumo do que foi feito;
   - links do site e do painel admin;
   - pendencias reais;
   - resultados de QA/crocheck.

## Decisoes especificas sobre dropshipping

- Atualizacao de escopo: em 2026-06-17, o usuario decidiu jogar toda a frente de dropshipping/CJ/DSers/frete exato para backlog. Nao executar agora; manter apenas documentado para retomada futura.
- Produtos atuais nao devem ficar com checkout direto se o frete e o fornecedor forem apenas estimados.
- AliExpress/DSers pode ser mantido como semi-automatico ou migrado para CJ se houver produto equivalente confiavel.
- Mercado Livre deve priorizar API de frete por item e CEP, ou virar afiliado/Ver oferta temporariamente.
- CJdropshipping e caminho preferido para automacao real, mas somente para produtos CJ reais ou produtos que a CJ consiga fazer sourcing.
- Produtos movidos para afiliado por seguranca devem manter anotacao de retorno futuro para dropshipping seguro.

## Progresso desta execucao

- Backup antes das alteracoes: `C:\Users\MF\Documents\BACKUPSSITECODEX\MobilyTechBR_pre_cj_dropshipping_2026-06-17_084938.zip`.
- Auditoria inicial dos 51 itens dropshipping salva em `docs/dropshipping-audit-2026-06-17.json`.
- Mapa de retorno seguro para dropshipping salvo em `data/dropshipping-sourcing-map.json`.
- PC GTX 750 Ti marcado como vendido/inativo; apenas os dois PCs GTX 550 Ti ficam ativos.
- Cards dos PCs ativos ajustados para usar o selo `Novidade!`.
- `Painel interno` removido do menu publico da conta do cliente.
- Botoes Google/Microsoft migrados para icones oficiais em SVG e estilo visual mais proximo do print enviado.
- Aba `Pedidos` da Planilha OLX teve removidas somente as linhas falsas `pedido-1781657995494` e `pedido-1781658045002`; `Vendas_PCs` e `Resumo_Mensal` nao foram alteradas.
- Checkout direto dos itens de fornecedor foi bloqueado quando nao houver frete exato validado fornecedor-cliente.
- Suporte tecnico CJ adicionado em `lib/cj-dropshipping.js`: o sistema so aceita frete CJ se houver token CJ, SKU/VID CJ e taxa USD-BRL configurada; sem isso, segue bloqueado.

- Regra adicional salva em 2026-06-17: se Computer Use falhar em tarefas MobilyTech BR, tentar recuperar/reiniciar/corrigir antes de concluir bloqueio; antes do relatorio final, retentar e avisar por e-mail se voltou ou nao.
- Atualizacao de escopo salva: dropshipping/CJ/DSers/frete exato saiu da fila de hoje e foi para backlog.
- `featureFlags` adicionados em `data/site-content.json`: Google e Mercado Pago ativos; Microsoft e Abacate Pay pausados.
- Painel/admin passou a ter controles para ativar/desativar Google, Microsoft, Mercado Pago e Abacate Pay.
- Painel/admin passou a registrar `Comissao interna` nos itens MobilyTech Finds, sem expor isso para clientes.
- MobilyTech Finds ficou conservador: so publica itens com link direto rastreavel de afiliado. Foram gerados 3 novos links Mercado Livre via Chrome CDP, chegando a 11 itens publicos prontos e 93 pausados.
- Site regenerado por `scripts/build_phase2_ibuy_style.py`; HTML publico nao contem `Entrar com Microsoft`, `Abacate Pay` ou `Painel interno`.
- QA local desktop/mobile salvo em `docs/qa/final-adjustments-2026-06-17/qa-report.json`: 22 checks passaram, 0 falhas e 0 erros reais de console.
- QA DOM do painel salvo em `docs/qa/final-adjustments-2026-06-17/admin-dom-qa.json`: gate visual, controles de botoes e coluna de comissao interna validados.
- Crocheck ChatGPT apontou um unico bloqueador: logo quebrado/truncado no gate do admin.
- Gate do admin corrigido para usar `/assets/mobilytech-logo.png`, caixa fixa e fallback `MT`; validacao local salva em `docs/qa/final-adjustments-2026-06-17/admin-logo-fix-qa.json`.
- Revalidacao ChatGPT retornou `APROVADO`, sem bloqueadores restantes. Registro salvo em `docs/qa/final-adjustments-2026-06-17/crocheck-chatgpt-final-2026-06-17.md`.
