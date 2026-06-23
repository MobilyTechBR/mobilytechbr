const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "data", "products.json");
const SITE_CONTENT_PATH = path.join(ROOT, "data", "site-content.json");
const ASSET_DIR = path.join(ROOT, "assets", "source", "nossos-produtos");
const TODAY = "2026-06-23";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

const catalog = [
  {
    id: "nossos-ssd-kingston-a400-480gb",
    title: "SSD Kingston A400 480GB SATA III",
    url: "https://www.kabum.com.br/produto/85198/ssd-kingston-a400-480gb-sata-iii-2-5-leitura-500mb-s-gravacao-450mb-s-preto-sa400s37-480g",
    subcategory: "armazenamento",
    niche: "hardware",
    priceRange: "medio",
    specs: ["480GB", "SATA III", "2,5 polegadas", "Upgrade para PCs e notebooks"],
    dims: [10, 1, 7],
    weight: 0.08,
    demandSignal: "SSD SATA de marca conhecida, procura recorrente para upgrade e manutencao.",
  },
  {
    id: "nossos-ssd-kingston-nv3-1tb",
    title: "SSD Kingston NV3 1TB M.2 NVMe PCIe 4.0",
    url: "https://www.kabum.com.br/produto/621162/ssd-kingston-nv3-1-tb-m-2-2280-pcie-4-0-x4-nvme-leitura-6000-mb-s-gravacao-4000-mb-s-azul-snv3s-1000g",
    subcategory: "armazenamento",
    niche: "hardware",
    priceRange: "medio-alto",
    specs: ["1TB", "M.2 2280", "NVMe PCIe 4.0", "Leitura ate 6000 MB/s"],
    dims: [8, 1, 3],
    weight: 0.06,
    demandSignal: "NVMe 1TB atende upgrades de notebook, desktop gamer e trabalho.",
  },
  {
    id: "nossos-ram-kingston-fury-impact-8gb-notebook",
    title: "Memoria Kingston Fury Impact 8GB DDR4 3200MHz notebook",
    url: "https://www.kabum.com.br/produto/193299/memoria-ram-para-notebook-kingston-fury-impact-8gb-3200mhz-ddr4-cl20-kf432s20ib-8",
    subcategory: "memoria",
    niche: "hardware",
    priceRange: "medio",
    specs: ["8GB", "DDR4", "3200MHz", "SODIMM para notebook"],
    dims: [10, 2, 7],
    weight: 0.05,
    demandSignal: "RAM SODIMM tem procura constante para notebooks lentos.",
  },
  {
    id: "nossos-ram-kingston-fury-beast-8gb-desktop",
    title: "Memoria Kingston Fury Beast 8GB DDR4 3200MHz desktop",
    url: "https://www.kabum.com.br/produto/172365/memoria-ram-kingston-fury-beast-8gb-3200mhz-ddr4-cl16-preto-kf432c16bb-8",
    subcategory: "memoria",
    niche: "hardware",
    priceRange: "medio",
    specs: ["8GB", "DDR4", "3200MHz", "Desktop", "Intel XMP"],
    dims: [14, 2, 6],
    weight: 0.08,
    demandSignal: "Upgrade barato para PCs com 8GB ou menos.",
  },
  {
    id: "nossos-ram-kingston-fury-beast-16gb-desktop",
    title: "Memoria Kingston Fury Beast 16GB DDR4 3200MHz desktop",
    url: "https://www.kabum.com.br/produto/172366/memoria-ram-kingston-fury-beast-16gb-3200mhz-ddr4-cl16-preto-kf432c16bb1-16",
    subcategory: "memoria",
    niche: "hardware",
    priceRange: "medio-alto",
    specs: ["16GB", "DDR4", "3200MHz", "Desktop", "Intel XMP"],
    dims: [14, 2, 6],
    weight: 0.08,
    demandSignal: "16GB e ponto de entrada ideal para jogos, multitarefa e trabalho.",
  },
  {
    id: "nossos-processador-ryzen-5-5500",
    title: "Processador AMD Ryzen 5 5500 AM4",
    url: "https://www.kabum.com.br/produto/356695/processador-amd-ryzen-5-5500-3-6ghz-cache-16mb-hexa-core-12-threads-am4-100-100000457box",
    subcategory: "processador",
    niche: "hardware",
    priceRange: "medio-alto",
    specs: ["6 nucleos", "12 threads", "AM4", "Sem video integrado"],
    dims: [13, 8, 13],
    weight: 0.45,
    demandSignal: "Ryzen 5 5500 segue como upgrade AM4 de bom custo-beneficio.",
  },
  {
    id: "nossos-processador-intel-i3-12100f",
    title: "Processador Intel Core i3-12100F LGA 1700",
    url: "https://www.kabum.com.br/produto/327442/processador-intel-i3-12100f-3-3ghz-cache-12mb-quad-core-8-threads-lga-1700-bx8071512100f",
    subcategory: "processador",
    niche: "hardware",
    priceRange: "medio-alto",
    specs: ["4 nucleos", "8 threads", "LGA 1700", "Sem video integrado"],
    dims: [13, 8, 13],
    weight: 0.45,
    demandSignal: "Entrada moderna Intel para setups com placa de video dedicada.",
  },
  {
    id: "nossos-placa-mae-msi-a520m-a-pro",
    title: "Placa-mae MSI A520M-A PRO AM4 DDR4",
    url: "https://www.kabum.com.br/produto/280890/placa-mae-msi-a520m-a-pro-amd-am4-matx-ddr4-preto-a520m-a-pro",
    subcategory: "placa-mae",
    niche: "hardware",
    priceRange: "medio",
    specs: ["AM4", "mATX", "DDR4", "Slot M.2"],
    dims: [26, 6, 26],
    weight: 0.85,
    demandSignal: "A520M e base popular para upgrades Ryzen de baixo custo.",
  },
  {
    id: "nossos-placa-mae-asus-prime-a520m-e",
    title: "Placa-mae ASUS Prime A520M-E AM4 DDR4",
    url: "https://www.kabum.com.br/produto/129653/placa-mae-asus-prime-a520m-e-amd-am4-matx-ddr4-preto-90mb1510-c1bay0",
    subcategory: "placa-mae",
    niche: "hardware",
    priceRange: "medio",
    specs: ["AM4", "mATX", "DDR4", "M.2", "HDMI"],
    dims: [26, 6, 26],
    weight: 0.85,
    demandSignal: "Placa AM4 de marca forte para montagem de PC custo-beneficio.",
  },
  {
    id: "nossos-fonte-duex-500w-bronze",
    title: "Fonte Duex 500W 80 Plus Bronze",
    url: "https://www.kabum.com.br/produto/286389/fonte-duex-dx-500fse-500w-80-plus-bronze-pfc-ativo-com-cabo",
    subcategory: "fonte",
    niche: "hardware",
    priceRange: "medio",
    specs: ["500W", "80 Plus Bronze", "PFC ativo", "Com cabo"],
    dims: [20, 12, 25],
    weight: 1.55,
    demandSignal: "Fonte 500W e item frequente em manutencao e montagem basica.",
  },
  {
    id: "nossos-monitor-lg-24-full-hd-100hz",
    title: "Monitor LG 24 Full HD IPS 100Hz",
    url: "https://www.kabum.com.br/produto/644868/monitor-gamer-lg-24-full-hd-100hz-ips-5ms-hdmi-ajuste-de-inclinacao-preto-24ms500-b",
    subcategory: "monitor",
    niche: "setup",
    priceRange: "caro",
    specs: ["24 polegadas", "Full HD", "IPS", "100Hz", "HDMI"],
    dims: [61, 13, 42],
    weight: 4.0,
    demandSignal: "Monitor 24 FHD e compra comum para home office e setup gamer de entrada.",
  },
  {
    id: "nossos-monitor-rise-24-180hz",
    title: "Monitor Rise Mode 24 Full HD 180Hz IPS",
    url: "https://www.kabum.com.br/produto/881070/monitor-gamer-rise-mode-prime-24-fhd-180hz-1ms-ips-freesync-hdr-400-hdmi-e-vga-srgb-110-preto-rm-mog-24f180fh-b",
    subcategory: "monitor",
    niche: "setup",
    priceRange: "caro",
    specs: ["24 polegadas", "Full HD", "IPS", "180Hz", "1ms"],
    dims: [61, 13, 42],
    weight: 4.2,
    demandSignal: "Monitor 180Hz agrega ticket maior sem sair do nicho gamer.",
  },
  {
    id: "nossos-mouse-logitech-g203-preto",
    title: "Mouse gamer Logitech G203 LIGHTSYNC RGB preto",
    url: "https://www.kabum.com.br/produto/112948/mouse-gamer-logitech-g203-lightsync-rgb-efeito-de-ondas-de-cores-6-botoes-programaveis-e-ate-8-000-dpi-preto-910-005793",
    subcategory: "mouse",
    niche: "perifericos",
    priceRange: "medio-barato",
    specs: ["8000 DPI", "RGB", "USB", "6 botoes"],
    dims: [12, 5, 8],
    weight: 0.18,
    demandSignal: "Mouse de marca conhecida, preco acessivel e forte apelo gamer.",
  },
  {
    id: "nossos-teclado-redragon-kumara-abnt2",
    title: "Teclado mecanico Redragon Kumara ABNT2",
    url: "https://www.kabum.com.br/produto/93162/teclado-mecanico-gamer-redragon-kumara-anti-ghosting-led-vermelho-switch-red-abnt2-preto-k552-2-pt-red",
    subcategory: "teclado",
    niche: "perifericos",
    priceRange: "medio",
    specs: ["Mecanico", "ABNT2", "Switch Red", "Anti-ghosting"],
    dims: [39, 5, 18],
    weight: 0.9,
    demandSignal: "Teclado mecanico ABNT2 combina trabalho e setup gamer.",
  },
  {
    id: "nossos-teclado-redragon-castor-65",
    title: "Teclado mecanico Redragon Castor 65% ABNT2",
    url: "https://www.kabum.com.br/produto/475170/teclado-mecanico-gamer-redragon-castor-rgb-switch-blue-abnt2-preto-k631-rgb-pt-blue",
    subcategory: "teclado",
    niche: "perifericos",
    priceRange: "medio",
    specs: ["65%", "ABNT2", "RGB", "Switch Blue"],
    dims: [35, 5, 16],
    weight: 0.75,
    demandSignal: "Formato compacto vende bem para setup pequeno e mesa de trabalho.",
  },
  {
    id: "nossos-mousepad-rgb-80x30",
    title: "Mousepad gamer RGB 80x30cm",
    url: "https://www.kabum.com.br/produto/483843/mousepad-gamer-grande-com-led-rgb-11-cores-80x30cm-mapa-mundi",
    subcategory: "mousepad",
    niche: "setup",
    priceRange: "barato",
    specs: ["80x30cm", "LED RGB", "Base antiderrapante", "Superficie speed"],
    dims: [32, 6, 6],
    weight: 0.35,
    demandSignal: "Produto barato de setup que aumenta carrinho e ticket medio.",
  },
  {
    id: "nossos-mousepad-exbom-70x35",
    title: "Mousepad Exbom grande 70x35cm",
    url: "https://www.kabum.com.br/produto/318878/mouse-pad-gamer-exbom-grande-barato-70x35cm-estampa-guerreiro-speed",
    subcategory: "mousepad",
    niche: "setup",
    priceRange: "barato",
    specs: ["70x35cm", "Speed", "Borda costurada", "Base emborrachada"],
    dims: [30, 6, 6],
    weight: 0.3,
    demandSignal: "Acessorio barato para escritorio e gamer, bom para combos.",
  },
  {
    id: "nossos-hub-usbc-ugreen-5em1",
    title: "Hub UGREEN USB-C 5 em 1 com HDMI 4K",
    url: "https://www.kabum.com.br/produto/913111/hub-ugreen-usb-c-5-em-1-para-hdmi-1x-usb-3-0-2x-usb-2-0-e-usb-c-pd-100w-cinza-ug-15495",
    subcategory: "hub",
    niche: "acessorios",
    priceRange: "medio",
    specs: ["USB-C", "HDMI 4K", "USB 3.0", "PD 100W"],
    dims: [13, 3, 8],
    weight: 0.18,
    demandSignal: "Hub USB-C e acessorio pratico para notebook, trabalho e estudo.",
  },
  {
    id: "nossos-hub-usb-3-md9-4-portas",
    title: "Hub USB 3.0 MD9 4 portas",
    url: "https://www.kabum.com.br/produto/114594/hub-usb-3-0-md9-4-portas-preto-9166",
    subcategory: "hub",
    niche: "acessorios",
    priceRange: "barato",
    specs: ["USB 3.0", "4 portas", "Plug and play", "Preto"],
    dims: [12, 4, 8],
    weight: 0.12,
    demandSignal: "Hub barato resolve problema comum de poucas portas USB.",
  },
  {
    id: "nossos-hub-usb-2-4-portas",
    title: "Hub USB 2.0 4 portas",
    url: "https://www.kabum.com.br/produto/351716/hub-usb-2-0-4-portas",
    subcategory: "hub",
    niche: "acessorios",
    priceRange: "muito-barato",
    specs: ["USB 2.0", "4 portas", "Compacto", "Plug and play"],
    dims: [10, 3, 7],
    weight: 0.1,
    demandSignal: "Acessorio muito barato para ampliar opcoes de compra.",
  },
  {
    id: "nossos-adaptador-wifi-usb-600mbps",
    title: "Adaptador Wi-Fi USB dual band 600Mbps",
    url: "https://www.kabum.com.br/produto/1020330/adaptador-wifi-usb-600mbps-dual-band-2-4-5ghz-antena-5dbi",
    subcategory: "rede",
    niche: "rede",
    priceRange: "barato",
    specs: ["USB", "Dual band", "600Mbps", "Antena 5dBi"],
    dims: [13, 4, 8],
    weight: 0.12,
    demandSignal: "Adaptador Wi-Fi vende bem para desktop sem wireless e notebook com defeito.",
  },
  {
    id: "nossos-roteador-tplink-archer-c6",
    title: "Roteador TP-Link Archer C6 AC1200 Dual Band",
    url: "https://www.kabum.com.br/produto/111493/roteador-tp-link-archer-c6-ac1200-dual-band-gigabit-preto",
    subcategory: "rede",
    niche: "rede",
    priceRange: "medio",
    specs: ["AC1200", "Dual band", "Gigabit", "4 antenas"],
    dims: [28, 7, 20],
    weight: 0.6,
    demandSignal: "Roteador dual band e upgrade frequente para casa e escritorio.",
  },
  {
    id: "nossos-webcam-full-hd-1080p",
    title: "Webcam Full HD 1080p USB com microfone",
    url: "https://www.kabum.com.br/produto/164676/webcam-full-hd-1080p-usb-microfone-e-suporta",
    subcategory: "webcam",
    niche: "escritorio",
    priceRange: "barato",
    specs: ["1080p", "USB", "Microfone integrado", "Plug and play"],
    dims: [12, 6, 9],
    weight: 0.2,
    demandSignal: "Webcam segue util para trabalho remoto, atendimento e estudo.",
  },
  {
    id: "nossos-suporte-notebook-kabum-essentials",
    title: "Suporte de notebook dobravel KaBuM! Essentials",
    url: "https://www.kabum.com.br/produto/480028/suporte-de-notebook-kabum-essentials-preto-dobravel-com-6-ajustes-de-altura-kesne100pt",
    subcategory: "ergonomia",
    niche: "escritorio",
    priceRange: "barato",
    specs: ["Dobrável", "6 ajustes", "Preto", "Para notebook"],
    dims: [28, 5, 26],
    weight: 0.45,
    demandSignal: "Suporte de notebook e acessorio simples para setup e home office.",
  },
  {
    id: "nossos-case-ssd-m2-nvme-usbc",
    title: "Case externo para SSD M.2 NVMe USB-C",
    url: "https://www.kabum.com.br/produto/408101/case-adaptador-ssd-m-2-nvme-para-usb-c-usb-3-0-f3-cs-adp-ngff-nvme",
    subcategory: "armazenamento",
    niche: "acessorios",
    priceRange: "barato",
    specs: ["M.2 NVMe", "USB-C", "USB 3.0", "Ate 10Gbps"],
    dims: [13, 3, 8],
    weight: 0.18,
    demandSignal: "Case NVMe complementa upgrades e reaproveitamento de SSD.",
  },
  {
    id: "nossos-cabo-hdmi-pix-2m",
    title: "Cabo HDMI 2.0 4K PIX 2 metros",
    url: "https://www.kabum.com.br/produto/94087/cabo-hdmi-2-0-4k-pix-2-metros-19-pinos-018-2222",
    subcategory: "cabos",
    niche: "acessorios",
    priceRange: "muito-barato",
    specs: ["HDMI 2.0", "4K", "2 metros", "19 pinos"],
    dims: [15, 4, 12],
    weight: 0.16,
    demandSignal: "Cabo HDMI e item barato que combina com monitor, notebook e setup.",
  },
  {
    id: "nossos-filtro-iclamper-energia-5",
    title: "Filtro de linha iClamper Energia 5 com DPS",
    url: "https://www.kabum.com.br/produto/397139/filtro-de-linha-dps-iclamper-energia-5-5-tomadas-bivolt-transparente-23460",
    subcategory: "energia",
    niche: "escritorio",
    priceRange: "barato",
    specs: ["5 tomadas", "DPS", "Bivolt", "Protecao contra surtos"],
    dims: [28, 5, 12],
    weight: 0.55,
    demandSignal: "Protecao eletrica e acessorio coerente para quem compra hardware.",
  },
  {
    id: "nossos-pasta-termica-implastec-50g",
    title: "Pasta termica Thermal Silver Implastec 50g",
    url: "https://www.kabum.com.br/produto/147376/pasta-termica-thermal-silver-implastec-pote-50g",
    subcategory: "manutencao",
    niche: "manutencao",
    priceRange: "muito-barato",
    specs: ["50g", "Thermal Silver", "Uso em CPUs e dissipadores"],
    dims: [8, 5, 8],
    weight: 0.08,
    demandSignal: "Manutencao combina diretamente com servicos MobilyTech e carrinhos pequenos.",
  },
  {
    id: "nossos-pasta-termica-ts-cold-4g",
    title: "Pasta termica Implastec TS Cold 4g",
    url: "https://www.kabum.com.br/produto/461746/pasta-termica-implastec-ts-cold-condutividade-termica-10-5-w-mk-4g-cinza",
    subcategory: "manutencao",
    niche: "manutencao",
    priceRange: "barato",
    specs: ["4g", "10,5 W/mK", "Alta performance", "Aplicacao em CPU/GPU"],
    dims: [8, 3, 8],
    weight: 0.06,
    demandSignal: "Pasta premium pequena para upgrades e manutencao.",
  },
  {
    id: "nossos-headset-multi-ph073",
    title: "Headset gamer Multi PH073 P2 preto e vermelho",
    url: "https://www.kabum.com.br/produto/35658/headset-gamer-multi-earpad-de-silicone-p2-preto-e-vermelho-ph073",
    subcategory: "audio",
    niche: "perifericos",
    priceRange: "barato",
    specs: ["P2", "Microfone retratil", "Super bass", "PC e notebook"],
    dims: [22, 10, 20],
    weight: 0.35,
    demandSignal: "Headset barato e item comum para setup, aula, chamada e jogos.",
  },
  {
    id: "nossos-headset-x5-1000-rgb",
    title: "Headset gamer 5+ X5-1000 RGB drivers 50mm",
    url: "https://www.kabum.com.br/produto/480126/headset-gamer-5-x5-1000-rgb-drivers-50mm-p2-e-usb-preto-015-0096",
    subcategory: "audio",
    niche: "perifericos",
    priceRange: "medio-barato",
    specs: ["Drivers 50mm", "RGB", "P2 e USB", "Microfone"],
    dims: [24, 12, 22],
    weight: 0.45,
    demandSignal: "Headset RGB tem apelo de setup e ticket intermediario.",
  },
  {
    id: "nossos-cooler-fan-rise-120mm-branco",
    title: "Ventoinha Rise Mode Galaxy LED 120mm branca",
    url: "https://www.kabum.com.br/produto/96823/ventoinha-rise-mode-galaxy-led-120mm-branco-rm-fn-01-bw",
    subcategory: "cooler",
    niche: "manutencao",
    priceRange: "muito-barato",
    specs: ["120mm", "LED", "1500 RPM", "3 pinos/Molex"],
    dims: [13, 4, 13],
    weight: 0.16,
    demandSignal: "Ventoinha de baixo preco e boa para manutencao e personalizacao.",
  },
  {
    id: "nossos-cooler-fan-rgb-120mm",
    title: "Cooler fan LED RGB 120mm para gabinete",
    url: "https://www.kabum.com.br/produto/659858/cooler-fan-led-120mm-rgb-ventoinha-pc-gamer-super-silencioso",
    subcategory: "cooler",
    niche: "manutencao",
    priceRange: "barato",
    specs: ["120mm", "RGB", "38 CFM", "Baixo ruido"],
    dims: [13, 4, 13],
    weight: 0.18,
    demandSignal: "Fan RGB barato combina com montagem e upgrade visual.",
  },
  {
    id: "nossos-kit-3-fans-rgb-120mm",
    title: "Kit 3 cooler fans RGB 120mm com controlador",
    url: "https://www.kabum.com.br/produto/405672/kit-3-cooler-fan-led-rgb-120mm-com-controlador-gabinete-pc-gamer-ventoinha-fc1306",
    subcategory: "cooler",
    niche: "manutencao",
    priceRange: "medio-barato",
    specs: ["3 fans 120mm", "RGB", "Controladora", "Controle remoto"],
    dims: [24, 7, 18],
    weight: 0.55,
    demandSignal: "Kit de fans aumenta ticket e resolve airflow de gabinete.",
  },
  {
    id: "nossos-kit-limpa-telas-150ml-microfibra",
    title: "Kit limpa telas 150ml com pano de microfibra",
    url: "https://www.kabum.com.br/produto/992236/kit-limpa-telas-de-outro-mundo-150ml-com-pano-microfibra",
    subcategory: "limpeza",
    niche: "escritorio",
    priceRange: "muito-barato",
    specs: ["150ml", "Pano microfibra", "Sem alcool", "Telas e notebooks"],
    dims: [16, 5, 8],
    weight: 0.25,
    demandSignal: "Item barato para limpeza de monitores, notebooks e celulares.",
  },
  {
    id: "nossos-limpa-tela-cleanup-120ml",
    title: "Limpa tela Clean'Up 120ml para notebook e celular",
    url: "https://www.kabum.com.br/produto/676514/limpa-tela-120ml-celular-smart-tv-grande-led-notebook-lente-camera-oculos-lupa-clean-up",
    subcategory: "limpeza",
    niche: "escritorio",
    priceRange: "muito-barato",
    specs: ["120ml", "Telas e lentes", "Limpeza de notebook", "Portatil"],
    dims: [15, 5, 7],
    weight: 0.2,
    demandSignal: "Limpeza de tela e produto de impulso para setups.",
  },
  {
    id: "nossos-kit-limpeza-teclado-fortrek-7em1",
    title: "Kit limpeza para teclados Fortrek 7 em 1",
    url: "https://www.kabum.com.br/produto/1029680/kit-limpeza-para-teclados-7-em-1-fortrek-ec7-86971",
    subcategory: "limpeza",
    niche: "escritorio",
    priceRange: "barato",
    specs: ["7 em 1", "Teclados", "Fones", "Telas", "Portatil"],
    dims: [11, 5, 8],
    weight: 0.14,
    demandSignal: "Kit pequeno com apelo para teclado, fones e mesa de trabalho.",
  },
  {
    id: "nossos-carregador-usbc-20w",
    title: "Carregador USB-C 20W branco",
    url: "https://www.kabum.com.br/produto/932948/carregador-usb-c-20w-com-postagem-imediata",
    subcategory: "carregador",
    niche: "acessorios",
    priceRange: "barato",
    specs: ["USB-C", "20W", "Bivolt", "Compacto"],
    dims: [10, 5, 8],
    weight: 0.12,
    demandSignal: "Carregador USB-C e acessorio de alta procura no dia a dia.",
  },
  {
    id: "nossos-carregador-apple-usbc-20w",
    title: "Carregador Apple USB-C 20W original",
    url: "https://www.kabum.com.br/produto/208371/carregador-usb-c-de-20w-apple-branco-original-muvu3bz-a",
    subcategory: "carregador",
    niche: "acessorios",
    priceRange: "medio-barato",
    specs: ["Apple", "USB-C", "20W", "Branco"],
    dims: [10, 5, 8],
    weight: 0.12,
    demandSignal: "Carregador original e opcao premium para celulares e tablets.",
  },
  {
    id: "nossos-flanela-microfibra-notebook-13",
    title: "Flanela microfibra para limpeza de notebook 13 polegadas",
    url: "https://www.kabum.com.br/produto/570960/flanela-microfibra-para-limpeza-macbook-palm-teclado-13",
    subcategory: "limpeza",
    niche: "escritorio",
    priceRange: "muito-barato",
    specs: ["Microfibra", "13 polegadas", "Teclado e tela", "Protecao contra riscos"],
    dims: [14, 2, 10],
    weight: 0.05,
    demandSignal: "Acessorio muito barato para mesa, notebook e limpeza.",
  },
  {
    id: "nossos-adaptador-som-usb-71",
    title: "Adaptador externo de som USB 7.1",
    url: "https://www.kabum.com.br/produto/509250/adaptador-externo-de-placa-de-som-7-1-usb-canais-duplo",
    subcategory: "audio",
    niche: "acessorios",
    priceRange: "muito-barato",
    specs: ["USB", "Som 7.1", "Entrada para fone e microfone", "Portatil"],
    dims: [10, 3, 7],
    weight: 0.08,
    demandSignal: "Adaptador barato resolve entrada P2 quebrada ou headset em desktop.",
  },
];

function slugToAssetPath(id, ext) {
  return `./assets/source/nossos-produtos/${id}.${ext}`;
}

function parseJsonLd(html) {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      const product = candidates.find((item) => item && item["@type"] === "Product") || candidates[0];
      if (product && product["@type"] === "Product") return product;
    } catch {
      // Ignore malformed structured data from store pages.
    }
  }
  return null;
}

function extractOgImage(html) {
  const match = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)/i);
  return match ? match[1] : "";
}

function imageUrlFromProduct(product, html) {
  const image = product?.image;
  if (Array.isArray(image) && image[0]) return image[0];
  if (typeof image === "string" && image) return image;
  return extractOgImage(html);
}

function availability(product) {
  const value = product?.offers?.availability || "";
  return String(value).toLowerCase();
}

function offerPrice(product) {
  const price = Number(product?.offers?.price);
  return Number.isFinite(price) && price > 0 ? price : 0;
}

function inboundShipping(cost, weight) {
  if (cost <= 50) return 12.9;
  if (cost <= 120) return 16.9;
  if (cost <= 300) return 22.9;
  if (cost <= 800) return weight > 1 ? 39.9 : 34.9;
  return weight > 2 ? 69.9 : 49.9;
}

function defaultMargin(baseCost, range) {
  if (range === "muito-barato") return 55;
  if (baseCost <= 120) return 45;
  if (baseCost <= 300) return 35;
  if (baseCost <= 800) return 28;
  return 22;
}

function roundedPrice(baseCost, margin) {
  const raw = baseCost * (1 + margin / 100);
  if (raw < 80) return Math.ceil(raw / 5) * 5 - 0.1;
  if (raw < 300) return Math.ceil(raw / 10) * 10 - 0.1;
  return Math.ceil(raw / 20) * 20 - 0.1;
}

function priceBand(price) {
  if (price <= 60) return "muito barato";
  if (price <= 140) return "barato";
  if (price <= 280) return "medio barato";
  if (price <= 550) return "medio";
  if (price <= 1100) return "medio alto";
  return "caro";
}

function extensionFromResponse(response, url) {
  const type = response.headers.get("content-type") || "";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("jpeg") || type.includes("jpg")) return "jpg";
  const match = String(url).split("?")[0].match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : "jpg";
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "pt-BR,pt;q=0.9,en;q=0.8",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function downloadImage(url, id) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      referer: "https://www.kabum.com.br/",
    },
  });
  if (!response.ok) throw new Error(`Imagem HTTP ${response.status}`);
  const ext = extensionFromResponse(response, url);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 4000) throw new Error("Imagem muito pequena");
  const assetPath = path.join(ASSET_DIR, `${id}.${ext}`);
  fs.writeFileSync(assetPath, buffer);
  return slugToAssetPath(id, ext);
}

async function buildProduct(item) {
  const html = await fetchText(item.url);
  const product = parseJsonLd(html);
  if (!product) throw new Error("sem JSON-LD de produto");
  const stock = availability(product);
  if (stock && !stock.includes("instock")) throw new Error(`produto sem estoque: ${stock}`);
  const supplierCost = offerPrice(product);
  if (!supplierCost) throw new Error("sem preco estruturado");
  const imageUrl = imageUrlFromProduct(product, html);
  if (!imageUrl) throw new Error("sem imagem");
  const image = await downloadImage(imageUrl, item.id);
  const inbound = item.inboundShippingCost ?? inboundShipping(supplierCost, item.weight);
  const baseCost = Math.round((supplierCost + inbound) * 100) / 100;
  const margin = item.marginPercent ?? defaultMargin(baseCost, item.priceRange);
  const price = Math.round(roundedPrice(baseCost, margin) * 100) / 100;
  const [widthCm, heightCm, lengthCm] = item.dims;
  return {
    id: item.id,
    name: item.title,
    title: item.title,
    category: "sob-encomenda",
    subcategory: item.subcategory,
    niche: item.niche,
    priceRange: item.priceRange,
    priceBand: priceBand(price),
    supplierCost: Math.round(supplierCost * 100) / 100,
    inboundShippingCost: inbound,
    marginPercent: margin,
    targetMarginPercent: margin,
    image,
    source: "KaBuM - produto nacional/marketplace",
    supplierPlatform: "KaBuM",
    supplierReferenceUrl: item.url,
    shortDescription: `${item.title} selecionado para setups, manutencao e upgrades MobilyTech.`,
    description:
      "Produto selecionado pela MobilyTech BR. Frete, prazo total estimado e valor final aparecem no carrinho antes do pagamento.",
    publicOriginNote: "Disponibilidade e envio confirmados no carrinho.",
    shippingNote: "Frete final calculado pelo CEP antes do pagamento.",
    publicShippingNote: "Frete, prazo total estimado e valor final aparecem no carrinho antes do pagamento.",
    specs: item.specs,
    widthCm,
    heightCm,
    lengthCm,
    weightKg: item.weight,
    demandSignal: item.demandSignal,
    sourceNotes:
      "Preco e imagem extraidos de pagina publica de produto nacional em 23/06/2026; confirmar estoque e vendedor antes da compra.",
    baseCost,
    price,
    salePrice: price,
    active: true,
    checkoutEnabled: true,
    storeCheckout: true,
    purchaseMode: "made-to-order",
    fulfillmentMode: "mobilytech-preorder",
    madeToOrder: true,
    procurementBusinessDays: item.procurementBusinessDays ?? 3,
    handlingBusinessDays: item.handlingBusinessDays ?? 1,
    allowQuantity: true,
    requiresShipping: true,
    shippingScope: "nacional",
    inventory: 99,
    stock: 99,
    condition: "novo",
    currency: "BRL",
    reviewBeforePurchase: true,
    updatedAt: TODAY,
  };
}

async function main() {
  fs.mkdirSync(ASSET_DIR, { recursive: true });
  const built = [];
  const failures = [];
  for (const item of catalog) {
    try {
      const product = await buildProduct(item);
      built.push(product);
      console.log(`OK ${product.id} R$ ${product.price}`);
    } catch (error) {
      failures.push({ id: item.id, url: item.url, error: error.message });
      console.warn(`FAIL ${item.id}: ${error.message}`);
    }
  }
  if (built.length < 24) {
    throw new Error(`Catalogo ficou pequeno demais (${built.length}). Falhas: ${JSON.stringify(failures, null, 2)}`);
  }
  const products = readJson(PRODUCTS_PATH);
  const preserved = products.filter(
    (product) =>
      !(
        product &&
        (product.madeToOrder === true ||
          product.purchaseMode === "made-to-order" ||
          product.category === "sob-encomenda" ||
          product.category === "dropshipping")
      )
  );
  fs.writeFileSync(PRODUCTS_PATH, `${JSON.stringify([...preserved, ...built], null, 2)}\n`, "utf8");

  const siteContent = readJson(SITE_CONTENT_PATH);
  siteContent.homeFeaturedProducts = siteContent.homeFeaturedProducts || {};
  siteContent.homeFeaturedProducts.dropshipping = [
    "nossos-ssd-kingston-a400-480gb",
    "nossos-ram-kingston-fury-beast-8gb-desktop",
    "nossos-mouse-logitech-g203-preto",
    "nossos-teclado-redragon-kumara-abnt2",
    "nossos-hub-usbc-ugreen-5em1",
    "nossos-processador-ryzen-5-5500",
  ].filter((id) => built.some((product) => product.id === id));
  siteContent.pages = siteContent.pages || {};
  siteContent.pages.produtos = {
    ...(siteContent.pages.produtos || {}),
    title: "Nossos produtos",
    intro:
      "Produtos nacionais selecionados para upgrades, setup, manutencao e escritorio. O carrinho mostra frete, prazo estimado total e valor final antes do pagamento.",
  };
  fs.writeFileSync(SITE_CONTENT_PATH, `${JSON.stringify(siteContent, null, 2)}\n`, "utf8");

  const reportPath = path.join(ROOT, "docs", "qa", "nossos-produtos-catalog-2026-06-23.json");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify({ built: built.length, failures, ids: built.map((x) => x.id) }, null, 2)}\n`, "utf8");
  console.log(`Catalogo atualizado: ${built.length} produtos. Relatorio: ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
