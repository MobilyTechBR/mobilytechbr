# Operacao Painel Master - checklist final

Data: 2026-06-23

## Fonte de verdade conferida

- `docs/OPERACAO_PAINEL_MASTER_2026-06-23.md`
- Complementos recebidos na execucao:
  - criar e editar subpaginas do site;
  - criar caixas, textos, botoes, imagens e redirecionamentos;
  - preview visual com arraste;
  - imagem PNG/HEIC/HEIF e formatos ja aceitos;
  - redimensionar imagem/bloco com proporcao travada ou livre;
  - efeitos de gradiente, glass, sombra, blur e textura;
  - textura em texto inteiro ou em trecho/palavra/letras especificas, com campo de trecho exato.

## Implementado

- Painel reorganizado em abas internas: Visao geral, Textos e artes, Construtor, PCs e catalogo, MobilyTech Finds, Nossos produtos, Registrar vendas, Manutencao e Seguranca.
- Listas grandes de MobilyTech Finds e Nossos produtos com preview/resumo e lista completa recolhida.
- Contadores/resumos no topo do painel para catalogo, PCs, adicionais, swaps e Finds.
- Editor de PCs/catalogo, adicionais e swaps dentro do painel, incluindo preco, status, imagens, dimensoes, peso e campos de frete.
- Rota segura `/api/update-catalog-file` para gravar `site-content`, `products`, `phase2-finalists`, `addons` e `swaps`.
- `site-content.json` aceita `maintenance` e `customPages`.
- Tela de manutencao com logo, mensagem curta, WhatsApp e e-mail, controlada pelo painel.
- Editor visual do hero principal com imagem personalizada e modos de encaixe: esticar, conter ou cobrir.
- Blocos visuais do hero com texto, botao, tamanho, cor, posicao, largura/altura, redirecionamento e preview arrastavel.
- Construtor visual de paginas personalizadas:
  - criar/excluir pagina;
  - mostrar ou nao no menu;
  - editar titulo, nome no menu, slug e texto inicial;
  - criar/excluir blocos;
  - blocos de caixa, texto, botao e imagem;
  - redirecionamento para areas do site, produto especifico, MobilyTech Finds especifico e paginas customizadas;
  - preview lateral com arraste;
  - redimensionamento por alca;
  - cadeado de proporcao travada/livre;
  - upload de imagem/textura pelo endpoint seguro de media;
  - PNG sem fundo, HEIC/HEIF, JPG, WebP e GIF aceitos;
  - cor, tamanho, peso, alinhamento, borda curva, sombra, blur, gradiente, glass e textura.
- Textura em texto:
  - se `Trecho com textura` estiver vazio, a textura vale para o texto inteiro;
  - se preenchido, a textura vale apenas para aquele trecho, palavra ou letras exatas.
- Gerador publico cria paginas `fase2/<slug>.html` para `customPages` ativas.
- Navegacao e busca do site passam a reconhecer paginas customizadas.
- CSS publico para paginas customizadas: palco, blocos, botoes, imagens, gradiente, glass, sombra e textura parcial.
- Gate `[hidden]` corrigido no painel para evitar secoes sobrepostas.
- Controles avancados do bloco selecionado permanecem abertos apos re-render, evitando perder campos durante edicao.

## Aproximacao segura / limite atual

- O pedido de "editar literalmente todo bloco de todas as secoes existentes como Wix" foi atendido no nucleo por duas frentes: editor de conteudo das secoes principais existentes e construtor visual para novas paginas/blocos. Nem todo card legado do site recebeu um manipulador visual individual ainda; isso fica como expansao incremental do mesmo construtor.
- O atalho/executavel de Desktop para abrir o Codex e disparar automaticamente a operacao nao foi criado porque nao foi encontrado um executavel/URI seguro do Codex no Windows nesta maquina. Criar um atalho chutado seria fragil e poderia abrir o app errado ou nao disparar a mensagem.

## Validacoes

- `node -c lib/account-handlers.js`
- `python -m py_compile scripts/build_phase2_ibuy_style.py`
- parse do JavaScript inline de `private/admin/index.html`
- `python scripts/build_phase2_ibuy_style.py`
- Browser integrado: home local e Nossos produtos local carregaram sem erros de console.
- Playwright local: admin com sessao simulada criou pagina/bloco, aplicou textura parcial, destravou proporcao, redimensionou, salvou via endpoint simulado e trocou para Manutencao sem erro.
- QA visual/console: `docs/qa/painel-master-2026-06-23/public-visual-qa.json`
- QA admin: `docs/qa/painel-master-2026-06-23/admin-builder-qa.json`
- Renderer publico custom: `docs/qa/painel-master-2026-06-23/public-custom-renderer-qa.json`
- Ollama `qwen2.5vl:7b`: aprovado com 9.5/10 para painel e 9.5/10 para paginas publicas, sem bloqueadores.

