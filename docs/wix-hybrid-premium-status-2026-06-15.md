# MobilyTech BR - status Wix/Vercel hibrido em 2026-06-15

Este documento registra o estado real verificado dos conectores e da ponte Wix/Vercel, para evitar prometer uma migracao que ainda depende de configuracao de dominio ou arquitetura.

## Sites e conectores verificados

- Wix premium correto: `85e985c5-2904-452f-85e2-a98f6d3b1cac`
- URL Wix premium atual: `https://www.mobilytech.com.br/`
- Plano Wix: Premium, dominio customizado
- Wix Apps confirmados: Velo, Members Area, Stores V3, Forms, Forms & Payments, Invoices, Chat, Instagram Feed e Promote SEO
- Vercel correto: projeto `mobilytechbr`, time `MobilyTech's projects`
- Vercel production atual: `https://mobilytechbr.vercel.app`
- Drive/Sheets: planilha OLX acessivel com `Vendas_PCs`, `Estoque_Componentes` e `Resumo_Mensal`

## Estado do dominio

O dominio `www.mobilytech.com.br` esta conectado ao Wix premium. O projeto Vercel `mobilytechbr` ainda nao tem esse dominio anexado nos dominios do projeto; os dominios confirmados no Vercel sao:

- `mobilytechbr.vercel.app`
- `mobilytechbr-mobily-tech-s-projects.vercel.app`
- `mobilytechbr-git-main-mobily-tech-s-projects.vercel.app`

Conclusao pratica atualizada: `www.mobilytech.com.br` esta servindo o visual fase 2 por uma ponte Wix Custom Embed com iframe apontando para `https://mobilytechbr.vercel.app/?wixBridge=1`. Isso preserva o dominio Wix e a renderizacao do frontend Vercel, mas nao equivale a uma implementacao Wix Headless nativa completa.

Evidencia de QA em 2026-06-15:

- Desktop e mobile renderizaram `MobilyTech BR | Loja gamer`.
- O iframe `#mtb-vercel-frame` estava ativo e preenchendo a viewport.
- O iframe apontou para `https://mobilytechbr.vercel.app/?wixBridge=1`.
- Sem overflow horizontal detectado.
- Sem termos publicos proibidos detectados.
- Prints e JSON: `C:\Users\MF\Documents\New project\mobilytech-qa-2026-06-15\wix-final-cursor-check`.

Limite descoberto na mesma rodada:

- A home `https://www.mobilytech.com.br/` funciona.
- URLs diretas como `https://www.mobilytech.com.br/fase2/ofertas.html`, `/fase2/achados.html`, `/fase2/limpeza.html`, `/fase2/montagem.html`, `/fase2/avaliacoes.html`, `/fase2/minha-conta.html` e `/fase2/contato.html` retornam 404 do Wix.
- A configuracao SEO do Wix ja esta com `shouldUsePartialRouteMatch=true`, entao essa opcao nao corrige o problema.
- Para rotas publicas completas no dominio Wix, as opcoes reais sao: criar paginas/roteamento equivalente no Wix, usar URLs por query/hash na home Wix para controlar o iframe, ou anexar o dominio ao Vercel e consumir Wix via APIs/headless.

Mitigacao aplicada:

- O Custom Embed JS do Wix foi atualizado para aceitar `mtbPath`, `mtbRoute` ou `pagePath` na query, alem de hashes equivalentes.
- Exemplo funcional: `https://www.mobilytech.com.br/?mtbPath=%2Ffase2%2Fofertas.html`.
- QA confirmou que essa URL carrega o iframe em `https://mobilytechbr.vercel.app/fase2/ofertas.html?wixBridge=1`.
- Evidencias: `C:\Users\MF\Documents\New project\mobilytech-qa-2026-06-15\wix-query-route-check`.

## Opcoes reais de ponte

1. Anexar o dominio customizado ao Vercel.
   - Vantagem: preserva 100% o visual e codigo atual do repo.
   - Limite: o dominio deixa de ser servido pelo construtor Wix tradicional; recursos Wix precisam entrar via APIs/headless, scripts ou fluxos externos.

2. Wix Headless com frontend do repo.
   - Vantagem: permite usar Wix Stores, Members e eCommerce como backend.
   - Limite: exige configurar OAuth/headless de verdade e adaptar login/checkout; nao e apenas "colar" HTML no Wix.

3. Embutir o Vercel dentro do Wix.
   - Vantagem: preserva visual rapidamente dentro de uma pagina Wix.
   - Estado atual: esta e a ponte em uso no Wix premium.
   - Limite: pior para SEO, login, checkout, rastreio e integracoes Wix profundas; funciona como espelho visual, nao como backend Wix completo. No estado atual, apenas a home Wix renderiza a ponte; subrotas `/fase2/...` no dominio Wix retornam 404.

## Catalogo Wix

Foi detectado 1 produto generico visivel no Wix Stores premium:

- `US Plug AC Outlet Multiprise Power Strip Braided Extension Cord Smart Home`

O produto foi ocultado via Catalog V3 Update Product. A reconsulta de produtos visiveis retornou 0 produtos, deixando a vitrine Wix limpa enquanto a versao final e preparada.

## Login do cliente

A pagina `fase2/minha-conta.html` foi mantida como consulta segura de pedido e atendimento. Ela evita apontar o cliente para rotas Wix quebradas (`/account/...`) ate que Wix Members/Headless OAuth esteja configurado.

Login real com Google/Microsoft deve ser feito por um fluxo de autenticacao oficial, como Wix Members/Headless OAuth ou outro provedor seguro. Nao expor botao de login real sem esse backend configurado.

Em 2026-06-15 foi confirmado que Wix Headless OAuth App e o caminho oficial para login real, mas a API de criacao retorna `secret`. Como o ambiente local nao tem `.vercel/project.json`, `VERCEL_TOKEN` nem Vercel CLI no PATH, nao ha canal seguro confirmado para gravar o segredo direto em env var do deploy. Decisao segura: nao criar OAuth App ate haver armazenamento seguro confirmado para o segredo.

## Decisao operacional atual

- Manter o repo/Vercel como fonte visual e funcional da fase 2.
- Manter Wix premium com ponte visual via iframe enquanto a versao headless real nao esta pronta.
- Manter Wix Stores premium limpo, sem produtos genericos visiveis.
- Documentar que a etapa "backend Wix real com login/headless" ainda exige OAuth seguro e adaptacao tecnica.
- Nao publicar itens de dropshipping/afiliado no Wix Stores visivel ate que os produtos estejam curados e o fluxo de frete/checkout esteja decidido.

## Atualizacao de verificacao em 2026-06-16

- `https://mobilytechbr.vercel.app/?qa=2026-06-16-status` respondeu 200 com titulo `MobilyTech BR | Loja gamer`, contendo `MOBMEN` e `MobilyTech Finds`.
- `https://www.mobilytech.com.br/?qa=2026-06-16-status` respondeu 200 com titulo Wix `Inicio | MobilyTech BR`; o HTML contem iframe/ponte para `mobilytechbr.vercel.app`, mas o HTML externo nao contem diretamente `MOBMEN` nem `MobilyTech Finds`.
- `https://www.mobilytech.com.br/fase2/ofertas.html?qa=2026-06-16-status` segue retornando 404 no Wix. O workaround por query `https://www.mobilytech.com.br/?mtbPath=%2Ffase2%2Fofertas.html` responde 200 e contem a ponte para Vercel.
- O favicon do dominio oficial ainda aponta para `https://static.parastorage.com/client/pfavico.ico`, favicon padrao Wix, nao para a logo MobilyTech BR.
- Conector Wix confirmou o site canonico `85e985c5-2904-452f-85e2-a98f6d3b1cac` como Premium, Published, custom domain, Velo enabled, Wix Members Area e Wix Stores V3.
- Conector Vercel confirmou o projeto `mobilytechbr` (`prj_ljqtPnKqvLMRUio4bMAWMtNaGeWz`) com dominios anexados apenas `mobilytechbr.vercel.app`, `mobilytechbr-mobily-tech-s-projects.vercel.app` e `mobilytechbr-git-main-mobily-tech-s-projects.vercel.app`. O dominio `www.mobilytech.com.br` ainda nao esta anexado ao projeto Vercel.
- Busca oficial Wix encontrou API para `business profile logo`, mas nao confirmou API REST especifica para favicon/site icon. Para trocar favicon do Wix, usar painel/editor Wix ou uma documentacao/API especifica confirmada antes de qualquer chamada.
