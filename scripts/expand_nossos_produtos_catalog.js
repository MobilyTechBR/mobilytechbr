const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "data", "products.json");
const SITE_CONTENT_PATH = path.join(ROOT, "data", "site-content.json");
const ASSET_DIR = path.join(ROOT, "assets", "source", "nossos-produtos");
const REPORT_PATH = path.join(ROOT, "docs", "qa", "nossos-produtos-expanded-2026-06-23.json");
const TODAY = "2026-06-23";
const TARGET_MADE_TO_ORDER = 125;
const MAX_DYNAMIC_PRODUCTS = 90;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36";

const SEARCH_TERMS = [
  "hub usb",
  "hub usb c",
  "cabo hdmi 2m",
  "cabo usb c",
  "cabo de rede cat6",
  "adaptador bluetooth usb",
  "adaptador wifi usb",
  "adaptador usb c hdmi",
  "leitor cartao usb",
  "suporte notebook",
  "suporte celular mesa",
  "suporte monitor",
  "suporte headset",
  "apoio pulso teclado",
  "mousepad escritorio",
  "mousepad gamer grande",
  "teclado numerico usb",
  "mouse sem fio",
  "mouse bluetooth",
  "teclado sem fio",
  "kit teclado mouse",
  "webcam usb",
  "headset p2",
  "microfone lapela",
  "luminaria led usb",
  "luminaria mesa led",
  "mini ventilador usb",
  "ventilador usb mesa",
  "organizador cabos",
  "organizador mesa",
  "canaleta cabos",
  "filtro de linha",
  "adaptador tomada",
  "extensor usb",
  "controle apresentacao",
  "suporte tablet",
  "base notebook cooler",
  "cooler notebook",
  "cooler fan 120mm",
  "pasta termica",
  "cabo sata",
  "case hd externo",
  "case ssd m2",
  "adaptador sata usb",
  "bateria cr2032",
  "pilha recarregavel",
  "carregador usb c 20w",
  "carregador de parede",
  "kit limpeza teclado",
  "limpa tela",
  "pano microfibra",
  "aspirador teclado",
  "soprador pc",
  "pincel antiestatico",
  "caixa som usb",
  "relogio digital mesa",
  "umidificador usb",
  "porta caneta mesa",
  "tomada inteligente",
  "ring light mesa",
  "tripe celular",
  "webcam cover",
  "ssd 240gb sata",
  "ssd 480gb sata",
  "memoria ddr4 8gb",
  "memoria notebook ddr4",
  "roteador dual band",
  "switch rede 5 portas",
  "placa de rede usb",
  "adaptador p2 usb",
  "cabo displayport",
  "cabo vga",
  "cabo auxiliar p2",
  "fita led usb",
  "suporte articulado celular",
  "mini teclado wireless",
  "mouse vertical",
  "descanso de pe mouse",
  "cooler para celular",
  "dock station usb c",
];

const EXCLUDE_TERMS = [
  "iphone",
  "smartphone",
  "celular samsung",
  "notebook gamer",
  "console",
  "jogo ",
  "gift card",
  "assinatura",
  "software",
  "licenca",
  "licença",
  "curso",
  "ebook",
  "recondicionado",
  "usado",
  "seminovo",
  "esgotado",
  "openbox",
  "open box",
  "refurbished",
  "305 metros",
  "rolo",
  "hollyland",
  "kit gamer redragon",
  "sistema microfone",
  "refil",
  "toner",
  "cartucho",
  "camera de seguranca",
  "camera ip",
  "drone",
  "smart tv",
  "mesa madesa",
  "mesa gamer",
  "mesa para computador",
  "fogao",
  "geladeira",
  "liquidificador",
  "air fryer",
  "panela",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugify(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 58)
    .replace(/-+$/g, "") || "produto";
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
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

function extractProductUrls(html) {
  const urls = new Set();
  for (const match of html.matchAll(/https:\/\/www\.kabum\.com\.br\/produto\/[^"\\<\s]+/g)) {
    const clean = decodeHtml(match[0]).split("?")[0];
    urls.add(clean);
  }
  return [...urls];
}

async function discoverUrls() {
  const discovered = [];
  const seen = new Set();
  const failures = [];

  for (const term of SEARCH_TERMS) {
    const url = `https://www.kabum.com.br/busca/${encodeURIComponent(term).replace(/%20/g, "-")}`;
    try {
      const html = await fetchText(url);
      const urls = extractProductUrls(html).slice(0, 4);
      for (const productUrl of urls) {
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);
        discovered.push({ url: productUrl, searchTerm: term });
      }
      console.log(`SEARCH ${term}: ${urls.length} candidatos`);
    } catch (error) {
      failures.push({ term, error: error.message });
      console.warn(`SEARCH FAIL ${term}: ${error.message}`);
    }
    if (discovered.length >= MAX_DYNAMIC_PRODUCTS * 4) break;
  }

  return { discovered, failures };
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
      // Ignore malformed JSON-LD snippets from store pages.
    }
  }
  return null;
}

function productCodeFromUrl(url) {
  const match = String(url).match(/\/produto\/(\d+)\//);
  return match ? match[1] : "";
}

function offerPrice(product) {
  const price = Number(product?.offers?.price);
  return Number.isFinite(price) && price > 0 ? price : 0;
}

function imageUrlFromProduct(product, html) {
  const image = product?.image;
  if (Array.isArray(image) && image[0]) return image[0];
  if (typeof image === "string" && image) return image;
  const match = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)/i);
  return match ? match[1] : "";
}

function availability(product) {
  return normalize(product?.offers?.availability || "");
}

function titleIsAllowed(title, price) {
  const value = normalize(title);
  if (!title || title.length < 8) return false;
  if (price < 5 || price > 650) return false;
  return !EXCLUDE_TERMS.some((term) => value.includes(normalize(term)));
}

function classify(title, term) {
  const value = normalize(`${title} ${term}`);
  const has = (...words) => words.some((word) => value.includes(word));

  if (has("ssd", "nvme", "sata")) return { subcategory: "armazenamento", niche: "hardware", dims: [13, 4, 9], weight: 0.18 };
  if (has("memoria", "ddr", "ram")) return { subcategory: "memoria", niche: "hardware", dims: [14, 3, 8], weight: 0.1 };
  if (has("placa de rede", "roteador", "switch ", "wifi", "wi-fi")) return { subcategory: "rede", niche: "rede", dims: [20, 8, 16], weight: 0.45 };
  if (has("hub", "dock", "adaptador", "leitor cartao", "placa de som")) return { subcategory: "hub-adaptadores", niche: "acessorios", dims: [12, 4, 8], weight: 0.14 };
  if (has("cabo", "displayport", "hdmi", "vga", "p2", "sata")) return { subcategory: "cabos", niche: "acessorios", dims: [16, 4, 12], weight: 0.16 };
  if (has("suporte", "base", "apoio", "descanso")) return { subcategory: "ergonomia", niche: "escritorio", dims: [28, 7, 22], weight: 0.55 };
  if (has("mousepad", "deskpad")) return { subcategory: "mousepad", niche: "setup", dims: [32, 7, 7], weight: 0.35 };
  if (has("mouse", "teclado", "kit teclado")) return { subcategory: "perifericos", niche: "perifericos", dims: [38, 6, 16], weight: 0.55 };
  if (has("headset", "fone", "caixa som", "microfone")) return { subcategory: "audio", niche: "perifericos", dims: [22, 10, 18], weight: 0.35 };
  if (has("webcam", "ring light", "tripe")) return { subcategory: "video", niche: "escritorio", dims: [18, 8, 18], weight: 0.35 };
  if (has("luminaria", "ventilador", "umidificador", "relogio", "tomada inteligente")) return { subcategory: "gadgets", niche: "escritorio", dims: [18, 10, 14], weight: 0.45 };
  if (has("organizador", "canaleta", "velcro", "abraçadeira", "abracadeira", "porta caneta")) return { subcategory: "organizacao", niche: "escritorio", dims: [20, 5, 16], weight: 0.22 };
  if (has("filtro de linha", "carregador", "pilha", "bateria", "tomada")) return { subcategory: "energia", niche: "acessorios", dims: [18, 7, 12], weight: 0.3 };
  if (has("cooler", "fan", "pasta termica", "limpa", "limpeza", "pano", "aspirador", "soprador", "pincel")) {
    return { subcategory: "manutencao", niche: "manutencao", dims: [16, 7, 12], weight: 0.22 };
  }
  return { subcategory: "acessorios", niche: "acessorios", dims: [18, 7, 12], weight: 0.25 };
}

function inboundShipping(cost, weight) {
  if (cost <= 35) return 9.9;
  if (cost <= 80) return 12.9;
  if (cost <= 160) return 16.9;
  if (cost <= 350) return 22.9;
  if (cost <= 900) return weight > 1 ? 39.9 : 34.9;
  return weight > 2 ? 69.9 : 49.9;
}

function defaultMargin(baseCost) {
  if (baseCost <= 35) return 75;
  if (baseCost <= 80) return 62;
  if (baseCost <= 160) return 50;
  if (baseCost <= 300) return 40;
  if (baseCost <= 650) return 30;
  if (baseCost <= 1200) return 24;
  return 20;
}

function roundedPrice(baseCost, margin) {
  const raw = baseCost * (1 + margin / 100);
  if (raw < 60) return Math.ceil(raw / 5) * 5 - 0.1;
  if (raw < 180) return Math.ceil(raw / 10) * 10 - 0.1;
  if (raw < 500) return Math.ceil(raw / 20) * 20 - 0.1;
  return Math.ceil(raw / 50) * 50 - 0.1;
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
  if (buffer.length < 3500) throw new Error("Imagem muito pequena");
  const assetPath = path.join(ASSET_DIR, `${id}.${ext}`);
  fs.writeFileSync(assetPath, buffer);
  return `./assets/source/nossos-produtos/${id}.${ext}`;
}

function specsFor(title, classification) {
  const specs = ["Produto novo", "Compra nacional", "Selecionado pela MobilyTech"];
  if (classification.niche === "escritorio") specs.push("Uso em mesa, home office ou setup");
  if (classification.niche === "hardware") specs.push("Upgrade ou manutencao de computador");
  if (classification.subcategory === "cabos") specs.push("Acessorio leve para envio");
  if (classification.subcategory === "hub-adaptadores") specs.push("Conectividade para PC e notebook");
  const compact = title.replace(/\s+/g, " ").trim();
  if (compact.length <= 70) specs.unshift(compact);
  return [...new Set(specs)].slice(0, 5);
}

async function buildProduct(candidate) {
  const html = await fetchText(candidate.url);
  const product = parseJsonLd(html);
  if (!product) throw new Error("sem JSON-LD de produto");

  const title = String(product.name || product.title || "").trim();
  const supplierCost = offerPrice(product);
  if (!titleIsAllowed(title, supplierCost)) throw new Error(`produto filtrado: ${title || "sem titulo"}`);

  const stock = availability(product);
  if (stock && !stock.includes("instock") && !stock.includes("in stock")) {
    throw new Error(`produto sem estoque: ${stock}`);
  }

  const imageUrl = imageUrlFromProduct(product, html);
  if (!imageUrl) throw new Error("sem imagem");

  const code = productCodeFromUrl(candidate.url);
  const id = `nossos-kb-${code || slugify(title).slice(0, 12)}-${slugify(title)}`;
  const classification = classify(title, candidate.searchTerm);
  const image = await downloadImage(imageUrl, id);
  const inbound = inboundShipping(supplierCost, classification.weight);
  const baseCost = Math.round((supplierCost + inbound) * 100) / 100;
  const margin = defaultMargin(baseCost);
  const price = Math.round(roundedPrice(baseCost, margin) * 100) / 100;
  const [widthCm, heightCm, lengthCm] = classification.dims;

  return {
    id,
    name: title,
    title,
    category: "sob-encomenda",
    subcategory: classification.subcategory,
    niche: classification.niche,
    priceRange: priceBand(price).replace(" ", "-"),
    priceBand: priceBand(price),
    supplierCost: Math.round(supplierCost * 100) / 100,
    inboundShippingCost: inbound,
    marginPercent: margin,
    targetMarginPercent: margin,
    image,
    source: "KaBuM - produto nacional/marketplace",
    supplierPlatform: "KaBuM",
    supplierReferenceUrl: candidate.url,
    shortDescription: `${title} selecionado para escritorio, setup, upgrades ou manutencao MobilyTech.`,
    description:
      "Produto selecionado pela MobilyTech BR. O carrinho mostra frete, prazo estimado total e valor final antes do pagamento.",
    publicOriginNote: "Disponibilidade confirmada antes do pagamento.",
    shippingNote: "Frete final calculado pelo CEP antes do pagamento.",
    publicShippingNote: "Frete, prazo estimado total e valor final aparecem no carrinho antes do pagamento.",
    specs: specsFor(title, classification),
    widthCm,
    heightCm,
    lengthCm,
    weightKg: classification.weight,
    demandSignal: `Item escolhido a partir de busca atual por "${candidate.searchTerm}", com foco em giro, setup e ticket acessivel.`,
    sourceNotes:
      "Preco, imagem e link extraidos de pagina publica de produto nacional em 23/06/2026; conferir estoque e vendedor antes da compra.",
    baseCost,
    price,
    salePrice: price,
    active: true,
    checkoutEnabled: true,
    storeCheckout: true,
    purchaseMode: "made-to-order",
    fulfillmentMode: "mobilytech-preorder",
    madeToOrder: true,
    procurementBusinessDays: 3,
    handlingBusinessDays: 1,
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

function isMadeToOrder(product) {
  return Boolean(
    product &&
      (product.madeToOrder === true ||
        product.purchaseMode === "made-to-order" ||
        product.category === "sob-encomenda" ||
        product.category === "dropshipping")
  );
}

function isGeneratedDynamic(product) {
  return String(product?.id || "").startsWith("nossos-kb-");
}

function sortStoreProducts(products) {
  const bandRank = {
    "muito barato": 0,
    barato: 1,
    "medio barato": 2,
    medio: 3,
    "medio alto": 4,
    caro: 5,
  };
  const nicheRank = {
    escritorio: 0,
    acessorios: 1,
    perifericos: 2,
    setup: 3,
    manutencao: 4,
    rede: 5,
    hardware: 6,
  };
  return [...products].sort((a, b) => {
    const band = (bandRank[a.priceBand] ?? 9) - (bandRank[b.priceBand] ?? 9);
    if (band) return band;
    const niche = (nicheRank[a.niche] ?? 9) - (nicheRank[b.niche] ?? 9);
    if (niche) return niche;
    return Number(a.price || 0) - Number(b.price || 0);
  });
}

function updateSiteContent(selectedIds) {
  const siteContent = readJson(SITE_CONTENT_PATH);
  siteContent.homeFeaturedProducts = siteContent.homeFeaturedProducts || {};
  siteContent.homeFeaturedProducts.dropshipping = selectedIds.slice(0, 6);
  siteContent.pages = siteContent.pages || {};
  siteContent.pages.produtos = {
    ...(siteContent.pages.produtos || {}),
    title: "Nossos produtos",
    intro:
      "Produtos selecionados para setup, escritorio, manutencao e upgrades. O carrinho mostra frete, prazo estimado total e valor final antes do pagamento.",
  };
  writeJson(SITE_CONTENT_PATH, siteContent);
}

async function main() {
  fs.mkdirSync(ASSET_DIR, { recursive: true });
  const products = readJson(PRODUCTS_PATH);
  const preservedNonStore = products.filter((product) => !isMadeToOrder(product));
  const preservedStore = products.filter((product) => isMadeToOrder(product) && !isGeneratedDynamic(product));
  const existingUrls = new Set(preservedStore.map((product) => product.supplierReferenceUrl).filter(Boolean));
  const existingIds = new Set(preservedStore.map((product) => product.id).filter(Boolean));

  const { discovered, failures: searchFailures } = await discoverUrls();
  const dynamic = [];
  const failures = [...searchFailures];

  for (const candidate of discovered) {
    if (existingUrls.has(candidate.url)) continue;
    try {
      const built = await buildProduct(candidate);
      if (existingIds.has(built.id) || dynamic.some((product) => product.id === built.id)) continue;
      dynamic.push(built);
      console.log(`OK ${dynamic.length}: ${built.title} - R$ ${built.price}`);
    } catch (error) {
      failures.push({ url: candidate.url, searchTerm: candidate.searchTerm, error: error.message });
      console.warn(`FAIL ${candidate.searchTerm}: ${error.message}`);
    }
    if (preservedStore.length + dynamic.length >= TARGET_MADE_TO_ORDER) break;
    if (dynamic.length >= MAX_DYNAMIC_PRODUCTS) break;
  }

  const allStore = sortStoreProducts([...preservedStore, ...dynamic]);
  if (allStore.length < 100) {
    throw new Error(`Catalogo ficou com ${allStore.length} produtos; minimo solicitado e 100.`);
  }

  const preferredHomeIds = [
    "nossos-kb-592191-hub-c3tech-usb-4x-usb-2-0-preto-hu-230bk",
    "nossos-kb-115754-mousepad-reliza-compact-com-apoio-de-pulso-preto-3769",
    "nossos-kb-752416-mini-ventilador-portatil-bommax-rotacao-360-velocidade-aju",
    "nossos-kb-630681-suporte-celular-articulado-mesa-haste-flexivel-universal-c",
    "nossos-kb-94087-cabo-hdmi-2-0-4k-pix-2-metros-19-pinos-018-2222",
    "nossos-ssd-kingston-a400-480gb",
    "nossos-mouse-logitech-g203-preto",
  ];
  const storeIds = new Set(allStore.map((product) => product.id));
  const homeIds = [
    ...preferredHomeIds.filter((id) => storeIds.has(id)),
    ...allStore
      .filter((product) => ["muito barato", "barato", "medio barato"].includes(product.priceBand))
      .map((product) => product.id),
  ].filter((id, index, array) => array.indexOf(id) === index);
  updateSiteContent(homeIds);

  writeJson(PRODUCTS_PATH, [...preservedNonStore, ...allStore]);
  writeJson(REPORT_PATH, {
    date: TODAY,
    requestedMinimum: 100,
    totalMadeToOrder: allStore.length,
    preservedMadeToOrder: preservedStore.length,
    addedDynamic: dynamic.length,
    homeFeaturedIds: homeIds.slice(0, 6),
    byBand: allStore.reduce((acc, product) => {
      const band = product.priceBand || "sem faixa";
      acc[band] = (acc[band] || 0) + 1;
      return acc;
    }, {}),
    byNiche: allStore.reduce((acc, product) => {
      const niche = product.niche || "sem nicho";
      acc[niche] = (acc[niche] || 0) + 1;
      return acc;
    }, {}),
    failures,
  });

  console.log(`Catalogo atualizado: ${allStore.length} Nossos produtos (${dynamic.length} novos).`);
  console.log(`Relatorio: ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
