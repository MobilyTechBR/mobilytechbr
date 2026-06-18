# Pendencias ativas MobilyTech BR - 2026-06-18

Estas pendencias sao para executar agora/proxima retomada. Nao mover para backlog futuro.

## Status 2026-06-18 18:21 BRT

- Botoes `Ver oferta` refeitos na fonte do site para Mercado Livre, AliExpress e Amazon.
- Layout dos botoes padronizado: mesma altura real no card (`46px`), mesma fonte (`15.5px`), logo a esquerda, divisor interno, texto centralizado e variacao visual por marketplace.
- MobilyTech Finds local validado com 66 produtos ativos: 24 Mercado Livre, 29 AliExpress e 13 Amazon.
- QA local desktop/mobile passou com 0 links vazios, 0 logos faltando, 0 divisores faltando e 0 botoes fora da altura esperada.
- Evidencias: `docs/qa/affiliate-buttons-2026-06-18/qa.json` e screenshots na mesma pasta.
- IA local foi usada apenas como apoio/checklist; o Codex revisou, corrigiu e validou manualmente o resultado.
- Crocheck externo na conversa fixada do ChatGPT ficou bloqueado nesta retomada porque a ferramenta direta de Chrome/Computer Use nao ficou disponivel para o agente. Validacao substituta: Chrome/Playwright + screenshots + inspeção visual do Codex.
- Publicacao concluida via Git/Vercel no commit `4ffb6a5`; dominio oficial validado em `https://www.mobilytech.com.br`.
- Smoke oficial: home 200, MobilyTech Finds 200, Minha Conta 200 e `/admin` 401 protegido.
- QA oficial desktop/mobile em `https://www.mobilytech.com.br/fase2/achados.html`: 66 cards, 66 botoes, 24 Mercado Livre, 29 AliExpress, 13 Amazon, 0 links vazios, 0 links de busca generica, 0 logos/divisores faltando e 0 botoes fora de 46px.

## MobilyTech Finds - afiliados e botoes

- Refazer os botoes `Ver oferta` de Mercado Livre, Amazon e AliExpress para ficarem 100% iguais as referencias visuais enviadas pelo usuario.
- Garantir que todos os botoes tenham exatamente a mesma largura, altura, proporcao interna, alinhamento, tamanho de fonte e posicao do texto.
- Trocar/corrigir logos dos botoes para ficarem iguais as referencias do usuario. O usuario apontou que os logos atuais ainda estao diferentes.
- Fazer crocheck visual externo com ChatGPT na conversa fixada `Analise Visual MobilyTech BR` antes de considerar aprovado.
- O crocheck deve comparar desktop e mobile, focando especialmente em: logo, cor/gradiente, borda, sombra, espacamento, divisor interno, tamanho do texto `Ver oferta` e tamanho/proporcao do botao.
- Se o ChatGPT reprovar ou apontar diferencas, iterar ate aprovar ou sobrar apenas polish opcional.

## Publicacao

- Publicar/deployar a versao final no site oficial, pois o usuario verificou `https://www.mobilytech.com.br` e ainda nao viu os novos anuncios/links.
- Depois da publicacao, validar no dominio oficial que a pagina MobilyTech Finds mostra os produtos novos das tres plataformas.
- Validar no dominio oficial que os links rastreaveis continuam corretos:
  - Mercado Livre: `https://meli.la/...`
  - AliExpress: `https://s.click.aliexpress.com/e/...`
  - Amazon: URLs com `tag=mobilytechbr-20`

## Estado atual conhecido

- Implementacao local anterior deixou 66 produtos ativos no JSON/HTML local: 24 Mercado Livre, 29 AliExpress e 13 Amazon.
- Essa implementacao local ainda nao foi aprovada visualmente pelo usuario, porque os botoes/logos nao ficaram iguais as imagens de referencia.
- Essa implementacao local tambem ainda nao foi publicada no dominio oficial.

## Proximo input esperado do usuario

- O usuario vai enviar um handoff de outra conversa do ChatGPT sobre a ideia de usar uma IA gratuita/local para ajudar o Codex em tarefas repetitivas.
- Quando esse handoff chegar, analisar a proposta e decidir qual seria o melhor uso pratico dessa IA dentro do fluxo MobilyTech.
