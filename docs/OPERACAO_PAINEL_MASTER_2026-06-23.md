# Operacao Painel Master - 2026-06-23

Status: salvo para execucao futura. Nao executar agora.

Gatilho de execucao: quando o usuario disser explicitamente algo como "executar a operacao Painel Master".

Regra principal: antes de iniciar, ler este arquivo inteiro, reler o pedido original no historico da conversa de 2026-06-23 e gerar uma pre-lista por e-mail. Durante a execucao, atualizar por e-mail por fases. Antes do relatorio final, conferir se tudo que foi pedido na mensagem original foi atendido; se algo nao for tecnicamente possivel, implementar a alternativa mais proxima e relatar.

## Pedido Original A Preservar

O usuario adicionou a operacao futura depois de notar que uma imagem personalizada no painel principal da loja ficou cortada. O pedido foi para salvar tudo como "Painel Master", sem executar agora, e continuar primeiro a tarefa atual.

Resumo fiel dos requisitos do pedido:

- Reorganizar o painel administrativo em subpaginas, como o site principal ja tem subpaginas.
- Criar uma navegacao superior no painel para selecionar essas areas.
- Ter uma pagina so para "Textos, destaques e artes do site", reunindo destaques, paginas, heroes, artes e personalizacoes visuais.
- Ter uma subpagina so para registrar vendas.
- Ter uma subpagina separada para "MobilyTech Finds, comissoes e links".
- Ter uma subpagina separada para "Nossos produtos".
- Nas listas grandes de MobilyTech Finds e Nossos produtos, deixar o conteudo recolhido por padrao, com preview/resumo de alguns produtos e botao/seta para expandir o restante.
- Mostrar no topo/resumo do painel contadores como quantidade de produtos MobilyTech Finds, Nossos produtos, PCs anunciados, swaps de hardware e outros grupos relevantes.
- Tornar o painel mais bonito, simples, intuitivo e facil de manipular por alguem sem conhecimento tecnico.
- Migrar para o painel o maximo possivel do que hoje depende do Page CMS/CMS.
- Permitir editar PCs, swaps, adicionais de PCs, valores de acrescimo ou decrescimo, pesos, medidas, produtos e demais campos editaveis do CMS.
- Revisar tudo que existe no Page CMS/CMS e trazer para o painel quando for seguro e util.
- Garantir que salvar pelo painel realmente aplica no site.
- Manter o painel seguro, com acesso apenas pelas duas contas Google autorizadas pelo usuario.
- Nunca expor segredos/tokens; se precisar configurar token ou env var, usar local seguro/oficial e clipboard quando apropriado.
- Criar uma opcao de "desligar o site" no painel, perto dos atalhos como Page CMS, Wix e Vercel oficial.
- Quando o site estiver desligado, visitantes devem ver uma tela de manutencao com logo MobilyTech, nome MobilyTech BR, mensagem curta de manutencao e botoes para contato por e-mail e WhatsApp.
- A tela de manutencao nao deve expor detalhes demais; deve sugerir contato para compra, montagem ou atendimento.
- Na personalizacao de destaques e artes, permitir imagem enviada para artes/heroes sem cortar a imagem.
- Para imagens personalizadas, adicionar opcao/behavior para encaixar a imagem inteira no espaco, preenchendo os quatro cantos mesmo que precise esticar para evitar corte.
- Criar editor de botoes dentro do painel:
  - texto do botao;
  - cor por paletas predefinidas;
  - cor personalizada por seletor visual tipo arco-iris/color picker;
  - tamanho, altura e largura;
  - redirecionamento/acao do clique;
  - preview visual.
- No redirecionamento dos botoes, oferecer lista de opcoes do site:
  - areas gerais, como avaliacoes, Nossos produtos, MobilyTech Finds, Monte seu PC, limpeza, suporte etc.;
  - produto especifico de Nossos produtos;
  - produto especifico de afiliado/MobilyTech Finds;
  - topo/pagina geral de uma area quando nao for produto especifico.
- Se selecionar uma area como MobilyTech Finds ou Nossos produtos, mostrar opcao secundaria para pagina geral ou produto especifico.
- O editor deve ter preview lateral mostrando a imagem/hero/art escolhida e o botao no local configurado.
- Permitir arrastar o botao com o mouse dentro do preview, parecido com editor visual/Wix, para posicionar exatamente sobre a imagem.
- O preview deve refletir a imagem enviada, cores selecionadas, texto e posicao.
- Organizar a UX com bom senso: as etapas devem ficar onde forem mais praticas, mesmo que a estrutura atual do painel precise mudar.
- Consultar Ollama/local visual agent e fazer crosscheck visual e funcional antes de considerar pronto.
- Fazer verificacao visual manual pelo computador quando possivel.
- Fazer uma revisao de seguranca do painel/site quando possivel.
- Criar uma pre-lista da operacao antes de executar, no estilo Codex, mas tambem preservar a mensagem original como fonte de verdade.
- A operacao deve ser autonoma quando disparada, com intervencao humana apenas se indispensavel.
- Criar depois um executavel/atalho na Area de Trabalho para abrir o Codex e iniciar a operacao Painel Master automaticamente, se isso for tecnicamente viavel e seguro.

## Pre-lista tecnica sugerida

1. Inventariar o painel atual em `private/admin/index.html`, `api/*`, `data/site-content.json`, `data/products.json`, `data/phase2-finalists.json` e qualquer arquivo CMS usado pelo build.
2. Mapear todos os controles existentes e separar em subpaginas internas.
3. Definir um modelo de dados unico para configuracoes visuais, botoes, heroes, produtos, PCs, swaps, adicionais, frete e manutencao.
4. Implementar navegacao superior do painel com subpaginas.
5. Implementar tela/flag de manutencao do site.
6. Implementar editor visual de artes/heroes com imagem, fit/stretch, botoes, color picker, redirecionamentos e preview arrastavel.
7. Implementar paginas separadas para MobilyTech Finds e Nossos produtos, com listas recolhidas/expansiveis, resumo e edicao de campos.
8. Implementar pagina de PCs/swaps/adicionais com edicao segura e intuitiva.
9. Garantir escrita segura no GitHub/Vercel sem expor tokens.
10. Testar salvamento real: painel -> JSON -> build/site -> dominio oficial.
11. Rodar QA funcional com Browser/Playwright e crosscheck visual com Ollama.
12. Rodar revisao de seguranca focada em autenticacao do painel, escrita de arquivos, segredos e endpoints administrativos.
13. Enviar relatorios por e-mail por fase e relatorio final com links, prints e pendencias.

## Observacoes

- O usuario pediu explicitamente para nao executar esta operacao agora.
- O usuario quer que o painel seja menos dependente do Codex e mais facil para edicao autonoma.
- O problema visual motivador foi uma arte/hero personalizada cortada no site.
- O nome canonico da operacao e: Painel Master.
