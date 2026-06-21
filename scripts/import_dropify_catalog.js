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

function toCandidate(product) {
  const marginPercent = Number(process.env.DROPIFY_DEFAULT_MARGIN_PERCENT || 35);
  const costPrice = product.wholesalePrice || null;
  const suggested = product.suggestedRetailPrice || null;
  const price = suggested || (costPrice ? Math.round(costPrice * (1 + marginPercent / 100) * 100) / 100 : null);
  return {
    id: `dropify-${slug(product.name)}-${slug(product.sku)}`,
    title: product.name,
    category: "dropshipping",
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
    description: "Envio nacional por fornecedor parceiro. Frete, prazo e disponibilidade sao recalculados antes do pagamento.",
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
      weightKg: product.measurements.weight
    },
    dropify: {
      sku: product.sku,
      immediateShipment: product.immediateShipment,
      deadline: product.deadline,
      stockQuantity: product.stockQuantity
    },
    sourceNotes: {
      phase1SourcePlatform: "Dropify",
      originalTitle: product.name,
      risk: "Nao ativar para checkout ate validar custo, imagem, medidas, estoque e frete real no CEP do cliente."
    }
  };
}

async function main() {
  const pages = Math.max(1, Number(process.env.DROPIFY_IMPORT_PAGES || 1));
  const pageSize = Math.min(50, Math.max(1, Number(process.env.DROPIFY_IMPORT_PAGE_SIZE || 50)));
  const products = [];
  for (let page = 1; page <= pages; page += 1) {
    const data = await listDropifyProducts({ page, pageSize });
    const pageProducts = normalizeProductArray(data).map(normalizeDropifyProduct);
    products.push(...pageProducts);
    if (pageProducts.length < pageSize) break;
  }

  const candidates = products
    .filter((product) => product.sku && product.name && product.stockQuantity > 0)
    .map(toCandidate);
  const outputDir = path.join(process.cwd(), "docs", "qa", "dropify-import-2026-06-21");
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "dropify-candidates.json");
  await fs.writeFile(outputPath, JSON.stringify({ generatedAt: new Date().toISOString(), candidates }, null, 2));
  console.log(JSON.stringify({ outputPath, count: candidates.length }, null, 2));
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
