# Produtos sob encomenda - MobilyTech BR

Atualizado em 2026-06-23.

## Modelo operacional

- A vitrine publica deve usar o nome **Produtos sob encomenda na MobilyTech BR**.
- Nao usar linguagem publica de CJ, CJDropshipping ou dropshipping.
- Regra de preco: `preco do produto = custo do fornecedor nacional + frete ate a MobilyTech BR + margem`.
- O cliente paga separadamente o frete final da MobilyTech BR ate o CEP dele, calculado no carrinho pelo fluxo de frete fisico/Melhor Envio.
- Cada item deve ter `supplierReferenceUrl`, `supplierCost`, `inboundShippingCost`, `baseCost`, `marginPercent`, `targetMarginPercent`, dimensoes/peso e `allowQuantity: true`.
- Antes de comprar de fato para atender uma venda, confirmar estoque, vendedor, valor e prazo no link de origem.

## Catalogo inicial

| ID | Produto | Custo base | Margem | Preco site | Origem |
| --- | --- | ---: | ---: | ---: | --- |
| `sob-ssd-kingston-a400-480gb` | SSD Kingston A400 480GB SATA III | R$ 524,00 | 24% | R$ 649,76 | Mercado Livre |
| `sob-ram-kingston-ddr4-8gb-notebook` | Memoria RAM Kingston 8GB DDR4 para notebook | R$ 244,96 | 30% | R$ 318,45 | Mercado Livre |
| `sob-ram-crucial-ddr4-8gb-desktop` | Memoria RAM Crucial 8GB DDR4 3200MHz desktop | R$ 398,00 | 24% | R$ 493,52 | Mercado Livre |
| `sob-fonte-duex-500w-bronze` | Fonte Duex 500W 80 Plus Bronze | R$ 225,77 | 28% | R$ 288,99 | Mercado Livre |
| `sob-roteador-tplink-archer-c6` | Roteador TP-Link Archer C6 AC1200 Dual Band | R$ 239,00 | 27% | R$ 303,53 | Mercado Livre |
| `sob-teclado-redragon-sindri-abnt2` | Teclado gamer Redragon Sindri ABNT2 | R$ 261,00 | 25% | R$ 326,25 | Mercado Livre |
| `sob-hub-usbc-ugreen-5em1` | Hub USB-C Ugreen 5 em 1 com HDMI | R$ 104,76 | 35% | R$ 141,43 | Mercado Livre |
| `sob-adaptador-wifi-usb-dualband` | Adaptador Wi-Fi USB Dual Band 600Mbps | R$ 34,90 | 55% | R$ 54,10 | Mercado Livre |
| `sob-mouse-logitech-g203` | Mouse gamer Logitech G203 Lightsync | R$ 189,00 | 28% | R$ 241,92 | Mercado Livre |
| `sob-suporte-notebook-aluminio` | Suporte para notebook dobravel | R$ 35,90 | 55% | R$ 55,65 | Mercado Livre |
| `sob-pasta-termica-gd900` | Pasta termica GD900 para manutencao | R$ 21,97 | 65% | R$ 36,25 | Mercado Livre |
| `sob-kit-limpeza-eletronicos` | Kit de limpeza para eletronicos e teclado | R$ 41,99 | 48% | R$ 62,15 | Mercado Livre |
| `sob-mini-aspirador-teclado-usb` | Mini aspirador USB para teclado | R$ 39,99 | 50% | R$ 59,99 | Mercado Livre |
| `sob-case-ssd-nvme-usb-c` | Case para SSD M.2 NVMe USB-C | R$ 78,90 | 40% | R$ 110,46 | Mercado Livre |
| `sob-mousepad-rgb-80x30` | Mousepad gamer RGB 80x30 cm | R$ 49,95 | 45% | R$ 72,43 | Mercado Livre |
| `sob-ssd-kingston-nv3-1tb-nvme` | SSD Kingston NV3 1TB NVMe PCIe 4.0 | R$ 889,00 | 18% | R$ 1.049,02 | Mercado Livre |
| `sob-monitor-24-fullhd-75hz` | Monitor 24 polegadas Full HD 75Hz | R$ 499,90 | 20% | R$ 599,88 | Mercado Livre |

## QA local

- Browser QA: `docs/qa/sob-encomenda-2026-06-23/browser-qa.json`.
- QA apos ajuste de imagem: `docs/qa/sob-encomenda-2026-06-23/browser-qa-after-css.json`.
- Ollama final: `docs/qa/sob-encomenda-2026-06-23/ollama-visual-qa-final.json`.
- Screenshots principais: `desktop-home-section-after-css.png`, `mobile-produtos-grid-after-css.png`, `desktop-cart-quantity.png`.

## CJ pausado

O mecanismo CJ foi preservado para uso futuro, mas a vitrine publica atual nao deve carregar produtos CJ. Ver tambem:

- `docs/CJ_DROPSHIPPING_ARCHIVE_2026-06-23.md`
- `docs/ACTIVE_MOBILYTECH_LEDGER.md`
