const fs = require("fs/promises");
const path = require("path");
const {
  listDropifyProducts,
  normalizeDropifyProduct,
  normalizeProductArray
} = require("../lib/dropify");

function slug(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "dropify-produto";
}

const PRICE_BANDS = [
  { key: "muito-barato", label: "Muito barato", max: 25, score: 25 },
  { key: "barato", label: "Barato", max: 60, score: 22 },
  { key: "medio-barato", label: "Medio barato", max: 120, score: 18 },
  { key: "medio", label: "Medio", max: 250, score: 12 },
  { key: "medio-alto", label: "Medio alto", max: 500, score: 6 },
  { key: "caro", label: "Caro", max: Infinity, score: 2 }
];

function searchableProductText(product) {
  return [
    product.name,
    product.description,
    product.technicalDescription,
    product.brand,
    ...(product.categories || [])
  ].filter(Boolean).join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function classifyPriceBand(price) {
  const value = Number(price || 0);
  return PRICE_BANDS.find((band) => value <= band.max) || PRICE_BANDS[PRICE_BANDS.length - 1];
}

function classifyNiche(product) {
  const text = searchableProductText(product);
  const matchers = [
    {
      key: "hardware",
      label: "Hardware",
      score: 35,
      words: ["usb", "cabo", "adaptador", "roteador", "hub", "teclado", "mouse", "ssd", "hdmi", "memoria", "notebook", "pc", "gamer", "fonte", "cooler", "carregador"]
    },
    {
      key: "ferramentas",
      label: "Ferramentas",
      score: 24,
      words: ["vonder", "furadeira", "parafusadeira", "compressor", "serra", "chave", "alicate", "ferramenta"]
    },
    {
      key: "casa",
      label: "Casa",
      score: 18,
      words: ["tramontina", "cozinha", "limpeza", "panela", "cafeteira", "air fryer", "fritadeira", "liquidificador", "lampada", "ventilador", "organizador"]
    },
    {
      key: "beleza",
      label: "Beleza",
      score: 8,
      words: ["secador", "escova", "barbeador", "beleza", "cabelo"]
    },
    {
      key: "brinquedos",
      label: "Brinquedos",
      score: 4,
      words: ["brinquedo", "infantil", "bebe", "carrinho", "boneca"]
    }
  ];
  return matchers.find((matcher) => matcher.words.some((word) => text.includes(word)))
    || { key: "utilidades", label: "Utilidades", score: 10 };
}

function candidateScore(product, candidate, niche, band) {
  let score = 0;
  score += niche.score;
  score += band.score;
  if (product.image) score += 8;
  if (product.wholesalePrice) score += 12;
  if (product.suggestedRetailPrice) score += 8;
  if (product.immediateShipment) score += 10;
  if (product.stockQuantity >= 20) score += 10;
  else if (product.stockQuantity >= 5) score += 6;
  if (product.ean) score += 4;
  if (candidate.shipping.heightCm && candidate.shipping.lengthCm && candidate.shipping.widthCm && candidate.shipping.weightG) score += 8;
  return score;
}

function toCandidate(product) {
  const marginPercent = Number(process.env.DROPIFY_DEFAULT_MARGIN_PERCENT || 35);
  const costPrice = product.wholesalePrice || null;
  const suggested = product.suggestedRetailPrice || null;
  const price = suggested || (costPrice ? Math.round(costPrice * (1 + marginPercent / 100) * 100) / 100 : null);
  const niche = classifyNiche(product);
  const priceBand = classifyPriceBand(price || costPrice || 0);
  return {
    id: `dropify-${slug(product.name)}-${slug(product.sku)}`,
    title: product.name,
    category: "dropshipping",
    niche: niche.key,
    nicheLabel: niche.label,
    priceBand: priceBand.key,
    priceBandLabel: priceBand.label,
    tags: ["envio-nacional", niche.key, priceBand.key, ...(product.categories || []).map(slug).filter(Boolean)],
    fulfillmentMode: "manual-dropshipping",
    purchaseMode: "manual-dropshipping",
    checkoutEnabled: false,
    active: false,
    supplierPlatform: "Dropify",
    supplierRegion: "BR",
    price,
    costPrice,
    marginPercent,
    image: product.image,
    cutout: product.image,
    description: product.description || "Envio nacional por fornecedor parceiro. Frete, prazo e disponibilidade sao recalculados antes do pagamento.",
    supplierReferenceUrl: product.raw?._links?.self?.href || "",
    shipping: {
      provider: "dropify",
      region: "BR",
      mode: "supplier-quote-required",
      originMode: "supplier",
      exactRequired: true,
      liveQuoteReady: false,
      heightCm: product.measurements.height,
      widthCm: product.measurements.width,
      lengthCm: product.measurements.length,
      weightG: product.measurements.weight
    },
    dropify: {
      sku: product.sku,
      immediateShipment: product.immediateShipment,
      deadline: product.deadline,
      stockQuantity: product.stockQuantity,
      brand: product.brand,
      ean: product.ean,
      ncm: product.ncm,
      cest: product.cest,
      model: product.model,
      warrantyDays: product.warrantyDays,
      heightCm: product.measurements.height,
      widthCm: product.measurements.width,
      lengthCm: product.measurements.length,
      weightG: product.measurements.weight
    },
    sourceNotes: {
      phase1SourcePlatform: "Dropify",
      originalTitle: product.name,
      originalCategories: product.categories,
      risk: "Nao ativar para checkout ate validar custo, imagem, medidas, estoque e frete real no CEP do cliente."
    }
  };
}

function withScore(product) {
  const candidate = toCandidate(product);
  return {
    ...candidate,
    selectionScore: candidateScore(product, candidate, { key: candidate.niche, label: candidate.nicheLabel, score: classifyNiche(product).score }, classifyPriceBand(candidate.price || candidate.costPrice || 0))
  };
}

function buildMarkdown(candidates, limit) {
  const lines = [
    "# Pre-lista Dropify MobilyTech",
    "",
    `Gerada em: ${new Date().toISOString()}`,
    `Selecionados para revisao inicial: ${Math.min(limit, candidates.length)}`,
    "",
    "| # | Faixa | Nicho | Preco | Custo | Estoque | SKU | Produto |",
    "| - | - | - | -: | -: | -: | - | - |"
  ];
  candidates.slice(0, limit).forEach((item, index) => {
    lines.push([
      `| ${index + 1}`,
      item.priceBandLabel,
      item.nicheLabel,
      item.price ? `R$ ${Number(item.price).toFixed(2)}` : "-",
      item.costPrice ? `R$ ${Number(item.costPrice).toFixed(2)}` : "-",
      item.dropify?.stockQuantity ?? "-",
      item.dropify?.sku || "-",
      String(item.title || "").replace(/\|/g, "/"),
      "|"
    ].join(" | "));
  });
  lines.push("", "Todos entram como inativos/check-out bloqueado ate validacao de imagem, custo, estoque e frete real.");
  return `${lines.join("\n")}\n`;
}

async function main() {
  const pages = Math.max(1, Number(process.env.DROPIFY_IMPORT_PAGES || 1));
  const pageSize = Math.min(50, Math.max(1, Number(process.env.DROPIFY_IMPORT_PAGE_SIZE || 50)));
  const topLimit = Math.max(1, Number(process.env.DROPIFY_IMPORT_TOP_LIMIT || 75));
  const products = [];
  for (let page = 1; page <= pages; page += 1) {
    const data = await listDropifyProducts({ page, pageSize });
    const pageProducts = normalizeProductArray(data).map(normalizeDropifyProduct);
    products.push(...pageProducts);
    if (pageProducts.length < pageSize) break;
  }

  const candidates = products
    .filter((product) => product.sku && product.name && product.stockQuantity > 0)
    .map(withScore)
    .sort((a, b) => b.selectionScore - a.selectionScore);
  const outputDir = path.join(process.cwd(), "docs", "qa", "dropify-import-2026-06-21");
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "dropify-candidates.json");
  const selectedPath = path.join(outputDir, "dropify-selected-75.json");
  const markdownPath = path.join(outputDir, "dropify-prelista.md");
  await fs.writeFile(outputPath, JSON.stringify({ generatedAt: new Date().toISOString(), candidates }, null, 2));
  await fs.writeFile(selectedPath, JSON.stringify({ generatedAt: new Date().toISOString(), candidates: candidates.slice(0, topLimit) }, null, 2));
  await fs.writeFile(markdownPath, buildMarkdown(candidates, topLimit));
  console.log(JSON.stringify({ outputPath, selectedPath, markdownPath, count: candidates.length, selected: Math.min(topLimit, candidates.length) }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message,
    code: error.code,
    statusCode: error.statusCode
  }, null, 2));
  process.exit(1);
});
