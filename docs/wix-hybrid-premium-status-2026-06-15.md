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

Conclusao pratica: hoje o visual fase 2 servido pelo repo/Vercel ainda nao e automaticamente o mesmo conteudo servido pelo dominio Wix. Para que `www.mobilytech.com.br` mostre exatamente o site Vercel, e necessario escolher uma das pontes abaixo.

## Opcoes reais de ponte

1. Anexar o dominio customizado ao Vercel.
   - Vantagem: preserva 100% o visual e codigo atual do repo.
   - Limite: o dominio deixa de ser servido pelo construtor Wix tradicional; recursos Wix precisam entrar via APIs/headless, scripts ou fluxos externos.

2. Wix Headless com frontend do repo.
   - Vantagem: permite usar Wix Stores, Members e eCommerce como backend.
   - Limite: exige configurar OAuth/headless de verdade e adaptar login/checkout; nao e apenas "colar" HTML no Wix.

3. Embutir o Vercel dentro do Wix.
   - Vantagem: preserva visual rapidamente dentro de uma pagina Wix.
   - Limite: pior para SEO, login, checkout, rastreio e responsividade; nao e recomendado como solucao final.

## Catalogo Wix

Foi detectado 1 produto generico visivel no Wix Stores premium:

- `US Plug AC Outlet Multiprise Power Strip Braided Extension Cord Smart Home`

O produto foi ocultado via Catalog V3 Update Product. A reconsulta de produtos visiveis retornou 0 produtos, deixando a vitrine Wix limpa enquanto a versao final e preparada.

## Login do cliente

A pagina `fase2/minha-conta.html` foi mantida como consulta segura de pedido e atendimento. Ela evita apontar o cliente para rotas Wix quebradas (`/account/...`) ate que Wix Members/Headless OAuth esteja configurado.

Login real com Google/Microsoft deve ser feito por um fluxo de autenticacao oficial, como Wix Members/Headless OAuth ou outro provedor seguro. Nao expor botao de login real sem esse backend configurado.

## Decisao operacional atual

- Manter o repo/Vercel como fonte visual e funcional da fase 2.
- Manter Wix premium limpo e pronto para backend, sem produtos genericos visiveis.
- Documentar que a etapa "dominio Wix servindo visual Vercel com backend Wix" ainda exige decisao tecnica de dominio/headless.
- Nao publicar itens de dropshipping/afiliado no Wix Stores visivel ate que os produtos estejam curados e o fluxo de frete/checkout esteja decidido.
