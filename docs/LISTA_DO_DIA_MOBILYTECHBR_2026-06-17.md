# MobilyTech BR - Lista do dia 2026-06-17

## Regra de continuidade

- Tratar novas mensagens do usuario como complemento da fila ativa, salvo cancelamento explicito.
- Enviar e-mail curto a cada etapa importante concluida, com resumo, proxima etapa e pendencias restantes.
- Fazer backup antes de mudancas relevantes no site.
- Usar crocheck/crosscheck externo com ChatGPT para validacao visual e funcional quando houver mudanca visual importante.
- Se Computer Use falhar, tentar recuperar/consertar antes de abandonar o caminho.
- Se um produto sair temporariamente de dropshipping para afiliado por seguranca, manter marcado para voltar ao dropshipping quando houver fornecedor, frete e automacao confiaveis.

## Lista de hoje

1. Enviar e-mail inicial com a lista do dia e plano de acao.
2. Fazer backup atualizado do projeto antes de editar.
3. Auditar os 51 produtos atuais de dropshipping:
   - separar AliExpress/DSers;
   - separar Mercado Livre;
   - separar itens mistos Mercado Livre/Amazon/AliExpress;
   - identificar itens com CJ backup;
   - marcar itens sem fornecedor/frete confiavel para afiliado temporario.
4. Implementar caminho seguro para CJdropshipping:
   - usar conta CJ ja aberta pelo usuario, via Computer Use se necessario;
   - verificar integracao/API/opcoes de store authorization;
   - mapear produtos que podem virar CJ real;
   - nao ativar checkout automatico em produto sem SKU/fornecedor/frete validado.
5. Implementar frete exato onde for viavel:
   - Mercado Livre: preparar caminho por API item_id + CEP;
   - CJ: preparar caminho por API/logistics quando houver produto CJ real;
   - manter fallback manual apenas onde nao houver fonte confiavel.
6. Ajustar catalogo/site:
   - remover/desativar PC GTX 750 Ti vendido;
   - manter apenas os dois PCs GTX 550 Ti disponiveis;
   - trocar "novo na OLX" por "Novidade!";
   - remover "Painel interno" do menu publico do cliente;
   - corrigir botoes Google/Microsoft para visual proximo ao print enviado;
   - remover pedidos falsos/teste do historico do cliente.
7. Ajustar painel/admin:
   - criar tela visual de login antes do painel principal;
   - mostrar conta logada no painel;
   - manter acesso restrito apenas a `mobilytechbr@gmail.com` e `julian.l.escribano@gmail.com`.
8. Validar Pages CMS:
   - manter separacao Anuncios de PCs, Anuncios de hardware, Dropshipping e afiliados;
   - suporte HEIC/HEIF e upload direto;
   - teste real de salvamento fica para o usuario quando ele puder, mas a estrutura deve estar pronta.
9. Rodar geracao/build/testes/QA local.
10. Fazer crocheck visual e funcional com ChatGPT, corrigir achados viaveis.
11. Publicar/deploy apenas depois de validar.
12. Enviar e-mail final com:
   - resumo do que foi feito;
   - links do site e do painel admin;
   - pendencias reais;
   - resultados de QA/crocheck.

## Decisoes especificas sobre dropshipping

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
