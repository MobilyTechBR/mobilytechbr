# MobilyTech BR - estado atual do projeto

Atualizado em: 2026-06-16

Este arquivo e a fonte compacta de verdade para continuar o projeto em uma conversa nova sem carregar todo o historico antigo. Antes de mexer no site, leia este arquivo, depois confira os arquivos reais do repo.

Nota de continuidade 2026-06-16: o handoff oficial mais recente e `docs/HANDOFF_MOBILYTECHBR_2026-06-16.md`. A direcao visual atual aprovada para continuidade e a fase 2 clara inspirada em iBUYPOWER/KaBuM, gerada por `scripts/build_phase2_ibuy_style.py`. As referencias antigas de tema dark abaixo sao historicas do site original e nao devem substituir a fase 2 clara sem pedido explicito do usuario.

## Identidade e URLs

- Nome correto do negocio: MobilyTech BR.
- Titulo atual da fase 2: MobilyTech BR | Loja gamer.
- Site Vercel funcional e referencia visual atual: https://mobilytechbr.vercel.app
- Dominio oficial desejado para cliente: https://www.mobilytech.com.br
- Site Wix premium/canonico: MobilyTech BR, site ID 85e985c5-2904-452f-85e2-a98f6d3b1cac.
- O dominio oficial continua dependente da ponte Wix/Vercel ou de configuracao segura de dominio/headless antes de ser tratado como substituto completo do Vercel.

## Fonte tecnica atual

- Repo local: C:\Users\MF\Documents\GitHub\mobilytechbr
- Repo GitHub conectado conhecido: MobilyTechBR/mobilytechbr
- Branch de producao conhecido: main
- Projeto Vercel conhecido: mobilytechbr
- Fluxo preferido para o site original:
  1. Editar arquivos no repo local.
  2. Testar localmente com `python -m http.server 4173 --bind 127.0.0.1`.
  3. Abrir http://127.0.0.1:4173 e validar desktop/mobile.
  4. Publicar via push para `main`.
  5. Verificar https://mobilytechbr.vercel.app/?qa=<timestamp>.
- Observacao: nesta sessao, `git` nao estava no PATH do PowerShell. Se acontecer de novo, usar GitHub Desktop, Git Bash, caminho absoluto do Git, ou ajustar PATH antes de prometer push.

## Stack do site original

- O site original nao e React, Next.js ou Vite.
- Stack principal: HTML/CSS/JavaScript puro em `index.html`.
- Nao existe `package.json` na raiz.
- Vercel Functions ficam em `api/`.
- Dados principais ficam em JSON dentro de `data/`.

## Arquivos principais

- `index.html`: site publico, estilos, catalogo, carrinho, modais de frete/pagamento/Pix, formularios e UI principal.
- `admin/index.html`: painel simples atual.
- `data/products.json`: produtos, fotos, galerias, specs, links OLX/Facebook, pesos e medidas.
- `data/addons.json`: adicionais globais.
- `data/swaps.json`: trocas globais de pecas.
- `data/automation-settings.json`: configuracoes/flags de automacao.
- `api/create-preference.js`: Mercado Pago.
- `api/create-abacate-checkout.js`: Abacate Pay checkout.
- `api/create-abacate-pix.js`: Abacate Pay Pix QR/copia-e-cola.
- `api/shipping-quote.js`: cotacao de frete.
- `api/shipping-confirm.js`: confirmacao de frete/etiqueta/rastreio.
- `api/mercado-pago-webhook.js`: webhook Mercado Pago.
- `api/abacate-pay-webhook.js`: webhook Abacate Pay.
- `api/payment-fees.js`: calculo/compensacao de taxas.
- `api/product-swaps.js`: trocas de produtos/componentes.
- `api/shipping-config.js`: configuracao de frete.
- `docs/google-apps-script/`: Apps Script de pos-venda e automacoes.
- `docs/wix-migration-functional-bridge-plan.md`: plano de ponte Wix + Vercel.
- `docs/wix-migration-parity-audit.md`: auditoria de paridade Wix.

## Estrutura publica do site original

- Topo/nav.
- Hero.
- Sobre a MobilyTech BR em bloco recolhivel "Saiba mais".
- Avaliacoes dos clientes.
- Metricas de reputacao.
- Faixa "Fretes pelos Correios".
- Catalogo com:
  - PCs em destaque / estoque.
  - Hardware em estoque.
- Carrinho.
- Formas de compra / finalizacao pelo site.
- Pos-venda e acompanhamento do pedido.
- Diferenciais em bloco recolhivel "Saiba mais".
- Montagem de PCs.
- Limpeza de PCs.
- Contato.
- Modal de foto/galeria.
- Modal de entrega/retirada.
- Modal de pagamento.
- Modal Pix.

## Identidade visual

- Direcao atual: fase 2 clara inspirada em iBUYPOWER/KaBuM, com visual de loja gamer brasileira, catalogo claro, destaque para ofertas, produtos e servicos.
- Fonte/visual devem seguir o que `scripts/build_phase2_ibuy_style.py` gera atualmente, validado no Vercel/local.
- Historico do site original dark, mantido aqui apenas como referencia antiga:
  - Fundo escuro: `#03070d`, `#06111d`, `#08131f`, `#0a1723`.
  - Cards/bordas: `#15324a`, azul/verde neon.
  - Texto: `#f7fbff`, `#aec6d4`.
  - Destaques: `#22f0c4`, `#04b7ff`, `#ffc928`.
- O usuario rejeita visual generico de template. Para Wix/headless, a prioridade e preservar a fase 2 clara atual com identidade MobilyTech BR e paridade funcional com o Vercel.
- Nao adicionar frases explicativas no site so porque apareceram em conversa. Texto novo so quando o usuario pedir explicitamente para escrever no site.

## Produtos ativos no site original

Fonte de verdade atual: `data/products.json`.

- PC GAMER INTEL I5 / 8GB RAM / GT 610 / SSD 120GB: R$ 800,00.
- PC GAMER RYZEN 5 3600X: R$ 4.500,00.
- PC GAMER i5 3o / 8GB RAM / GTX 550 Ti + SSD 128GB: R$ 1.000,00, preco antigo R$ 1.100,00.
- SSD 240GB PNY - SATA 3: R$ 220,00.
- SSD 240GB Crucial: R$ 215,00.
- SSD 256GB Lexar 2.5: R$ 215,00.
- SSD 240GB Kingston Original: R$ 225,00.
- Fonte 750W 80 Plus Bronze NVINET - Lacrada: R$ 355,00.

## Adicionais e trocas

Adicionais globais em `data/addons.json`:

- SSD 240GB: +R$ 200,00.
- Kit Mouse / Teclado PICHAU: +R$ 65,00, com miniatura.

Trocas globais em `data/swaps.json`:

- SSD 120GB/128GB para SSD 240GB: +R$ 100,00.
- SSD 240GB para SSD 128GB: -R$ 55,00, exceto PCs com 480GB.
- 8GB RAM para 16GB DDR3: +R$ 170,00.
- 12GB RAM para 16GB DDR3: +R$ 120,00.
- Fonte para NVINET 750W 80 Plus Bronze: +R$ 250,00, exceto quando o PC ja tem NVINET 750W.
- Troca de processador deve ser especifica por PC.

## Frete, pagamento e pos-venda

- O site original tem carrinho, entrega/retirada, frete por CEP, Mercado Pago, Abacate Pay, Pix direto, QR Code Pix e Pix copia-e-cola.
- O site compensa taxas de Mercado Pago e Abacate Pay para o cliente pagar o valor com taxa quando aplicavel.
- Retirada local: Vila Suzana, Sao Paulo, SP.
- CEP de referencia/despacho usado no projeto: 05641-090.
- E-mail comercial/site: mobilytechbr@gmail.com.
- Telefone/WhatsApp: +55 (11) 95480-1967.
- Pos-venda: Apps Script/planilha envia e-mails de compra confirmada, venda interna, rastreio e entrega.

## Wix

- Site Wix alvo atual: MobilyTech BR.
- Site ID confirmado em memoria recente: 85e985c5-2904-452f-85e2-a98f6d3b1cac.
- Dominio Wix atual verificado: https://www.mobilytech.com.br
- Wix deve ser tratado como migracao em andamento, nao como substituto aprovado automaticamente.
- O usuario comprou Wix principalmente por ferramentas comerciais: marketing, subpaginas, dropshipping, catalogo, chat, painel/gestao e integracoes.
- A Wix nao deve perder as funcoes do site original. Se alguma funcao nao tiver equivalente nativo, usar ponte com Vercel/Apps Script ate existir substituto.
- Separar estoque proprio e dropshipping. Produtos fisicos atuais: PCs, SSDs, fonte e adicionais. Dropshipping deve ficar separado e nao misturado com estoque proprio.

## Coisas que nao devem ser mexidas sem pedido claro

- Nao apagar ou substituir o site Vercel enquanto a Wix nao estiver visual e funcionalmente validada.
- Nao trocar DNS/dominio definitivamente sem validacao.
- Nao remover painel antigo, APIs, JSONs, Apps Script ou webhooks sem equivalente testado.
- Nao transformar o repo original em React/Next/Vite sem pedido explicito.
- Nao reativar ideias antigas revertidas.
- Nao tratar "publicou tecnicamente" como sucesso quando o visual esta errado.
- Nao inventar texto visivel no site a partir de comentarios do usuario que eram apenas orientacao interna.
- Nao expor tokens, secrets, senhas, chaves ou webhook secrets em handoffs.

## Plano recomendado para proximas conversas

Prioridade 1: manter o original Vercel como referencia funcional/visual e fonte de verdade.

Prioridade 2: se continuar Wix, reconstruir uma versao visualmente coerente e funcional, mesmo que nao 100% identica, usando:

- Home.
- Catalogo/Estoque MobilyTech.
- Hardware em estoque.
- Dropshipping separado.
- Montagem de PCs.
- Limpeza de PCs.
- Avaliacoes.
- Garantia/pos-venda.
- Contato.

Prioridade 3: estudar/planejar expansao, mas nao misturar com estoque fisico nem publicar sem revisao.

Prioridade 4: manter ou recriar as automacoes:

- Pos-venda.
- Webhooks Mercado Pago/Abacate Pay.
- Frete Melhor Envio.
- Revisao Facebook/OLX.
- E-mails internos.

## Primeira instrução para uma conversa nova

Comece dizendo:

"Leia `MOBILYTECH_STATE.md` no repo `C:\Users\MF\Documents\GitHub\mobilytechbr` antes de mexer. O site Vercel e a referencia funcional/visual. O Wix e uma migracao em andamento. Nao reescreva o projeto nem perca as automacoes."
