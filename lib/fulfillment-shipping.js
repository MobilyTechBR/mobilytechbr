const fs = require("fs/promises");
const path = require("path");
const { quoteCjSupplierFreight } = require("./cj-dropshipping");

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");
const DEFAULT_SUPPLIER_SHIPPING_BRL = 29.9;

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseMoneyNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const raw = String(value || "").replace(/[^\d,.-]/g, "");
  if (!raw) return null;
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function toMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function compactText(value, maxLength = 260) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  if (!clean || clean.length <= maxLength) return clean;
  return `${clean.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

async function loadProductsFromDisk() {
  const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, "utf8"));
  return Array.isArray(products) ? products : [];
}

function isSupplierFulfilled(product) {
  const category = normalizeText(product?.category || product?.type || "");
  const fulfillmentMode = normalizeText(product?.fulfillmentMode || product?.fulfillmentType || product?.purchaseMode || product?.fulfillment?.mode || "");
  const shippingMode = normalizeText(product?.shipping?.mode || product?.shippingMode || "");
  return Boolean(
    product?.manualFulfillment ||
    category === "dropshipping" ||
    fulfillmentMode.includes("dropshipping") ||
    fulfillmentMode.includes("supplier") ||
    shippingMode.includes("supplier") ||
    shippingMode.includes("fornecedor")
  );
}

function splitFulfillmentProducts(products = []) {
  return products.reduce((groups, product) => {
    if (isSupplierFulfilled(product)) groups.supplier.push(product);
    else groups.physical.push(product);
    return groups;
  }, { physical: [], supplier: [] });
}

function validateUniquePhysicalCheckoutItems(checkoutItems = []) {
  const seen = new Set();

  checkoutItems.forEach((item) => {
    const product = item?.product || item;
    if (!product || isSupplierFulfilled(product)) return;

    const productId = String(product.id || "").trim();
    if (!productId) return;

    const quantity = parseMoneyNumber(item?.quantity ?? item?.qty ?? 1) || 1;
    if (quantity > 1) {
      const error = new Error(`${product.title || "Produto fisico"} tem estoque unico e nao aceita quantidade maior que 1.`);
      error.statusCode = 400;
      error.code = "PHYSICAL_PRODUCT_SINGLE_QUANTITY";
      throw error;
    }

    if (seen.has(productId)) {
      const error = new Error(`${product.title || "Produto fisico"} tem estoque unico e ja esta no carrinho.`);
      error.statusCode = 400;
      error.code = "DUPLICATE_PHYSICAL_PRODUCT";
      throw error;
    }

    seen.add(productId);
  });

  return true;
}

function supplierShippingPrice(product) {
  const shipping = product?.shipping || {};
  const mode = normalizeText(shipping.mode || "");
  const checkoutDisabled = product?.checkoutEnabled === false || shipping.checkoutEnabled === false;
  const exactRequired = shipping.exactRequired === true || product?.requireExactSupplierFreight === true || mode.includes("quote-required");
  if (checkoutDisabled || (exactRequired && shipping.liveQuoteReady !== true)) {
    const error = new Error(`${product?.title || "Produto MobilyTech Finds"} precisa de frete exato do fornecedor ate o cliente antes de ir para checkout.`);
    error.statusCode = 409;
    error.code = "SUPPLIER_EXACT_FREIGHT_REQUIRED";
    throw error;
  }
  const explicit = [
    shipping.customerPrice,
    shipping.customerPriceBrl,
    shipping.supplierPrice,
    shipping.supplierCost,
    shipping.fixedPrice,
    product?.customerShippingPrice,
    product?.supplierShippingPrice
  ].map(parseMoneyNumber).find((value) => value !== null && value >= 0);

  if (explicit !== undefined) return { price: explicit, estimated: false };

  if (shipping.free === true || mode.includes("gratis") || mode.includes("free")) {
    return { price: 0, estimated: false };
  }

  const fallback = parseMoneyNumber(process.env.DROPSHIPPING_DEFAULT_SHIPPING_BRL);
  return {
    price: fallback !== null && fallback >= 0 ? fallback : DEFAULT_SUPPLIER_SHIPPING_BRL,
    estimated: true
  };
}

function supplierDeliveryTime(product) {
  const shipping = product?.shipping || {};
  const candidates = [
    shipping.deliveryTime,
    shipping.deliveryDays,
    shipping.supplierDeliveryTime,
    shipping.supplierDeliveryDays,
    product?.supplierDeliveryDays
  ];
  const value = candidates.map(parseMoneyNumber).find((number) => number !== null && number > 0);
  return value || 8;
}

function supplierRegion(product) {
  const shipping = product?.shipping || {};
  const raw = normalizeText(shipping.region || shipping.originCountry || product?.supplierRegion || product?.originRegion || "");
  if (raw.includes("intl") || raw.includes("internacional") || raw.includes("china") || raw.includes("global")) return "INTL";
  return "BR";
}

function supplierPlatform(product, sourceNotes, region) {
  if (region === "INTL") {
    return sourceNotes.phase1SourcePlatform || product?.supplierPlatform || product?.marketplace?.name || "Fornecedor internacional";
  }
  return product?.supplierPlatform || product?.marketplace?.name || sourceNotes.phase1SourcePlatform || "Canal de origem";
}

function supplierPrimaryUrl(product, sourceNotes, region) {
  if (region === "INTL") {
    return product?.supplierSearchUrl || sourceNotes.supplierSearchUrl || product?.supplierUrl || product?.sourceUrl || "";
  }
  return product?.supplierUrl || product?.sourceUrl || product?.supplierSearchUrl || sourceNotes.supplierSearchUrl || "";
}

function supplierFulfillmentItem(product, freightOverride) {
  const freight = freightOverride || supplierShippingPrice(product);
  const region = supplierRegion(product);
  const quantity = Math.max(1, parseMoneyNumber(product?.quantity ?? product?.qty ?? 1) || 1);
  const sourceNotes = product?.sourceNotes || {};
  const shipping = product?.shipping || {};
  return {
    productId: product?.id || "",
    title: product?.title || "",
    quantity,
    supplierPlatform: supplierPlatform(product, sourceNotes, region),
    supplierUrl: supplierPrimaryUrl(product, sourceNotes, region),
    supplierBackupUrl: product?.supplierBackupUrl || sourceNotes.supplierBackupUrl || sourceNotes.supplierBackup || "",
    supplierInstruction: sourceNotes.supplierInstruction || product?.supplierInstructions || "",
    sellerReputation: sourceNotes.sellerReputation || "",
    operationRisk: sourceNotes.risk || "",
    freightBasis: shipping.freightBasis || sourceNotes.shipping || "",
    salePrice: parseMoneyNumber(product?.price),
    costPrice: parseMoneyNumber(product?.costPrice || product?.supplierCost),
    marginPercent: product?.marginPercent || "",
    customerShippingPrice: toMoney(freight.price * quantity),
    shippingEstimated: freight.estimated,
    deliveryTime: supplierDeliveryTime(product),
    region,
    originLabel: region === "INTL" ? "Internacional" : "Brasil"
  };
}

function supplierQuote(products = []) {
  const items = products.map((product) => supplierFulfillmentItem(product));
  const price = toMoney(items.reduce((sum, item) => sum + Number(item.customerShippingPrice || 0), 0));
  const deliveryTime = Math.max(...items.map((item) => Number(item.deliveryTime || 0)), 0) || null;
  const regions = new Set(items.map((item) => item.region));
  const name = regions.size > 1
    ? "Envios diretos com rastreio"
    : regions.has("INTL")
      ? "Envio internacional com rastreio"
      : "Envio nacional com rastreio";
  return {
    id: "supplier-manual",
    name,
    company: "Envio direto",
    price,
    deliveryTime,
    recommended: true,
    provider: "supplier-manual",
    supplierItems: items,
    raw: { supplierItems: items }
  };
}

function liveSupplierQuote(products = [], quote) {
  const items = products.map((product, index) => supplierFulfillmentItem(product, {
    price: index === 0 ? quote.price : 0,
    estimated: false
  }));
  return {
    id: quote.id,
    name: quote.name,
    company: quote.company || "Envio direto",
    price: toMoney(quote.price),
    deliveryTime: quote.deliveryTime,
    recommended: quote.recommended !== false,
    provider: quote.provider || "supplier-live",
    supplierItems: items,
    raw: {
      ...(quote.raw || {}),
      supplierItems: items,
      priceUsd: quote.priceUsd,
      usdBrlRate: quote.usdBrlRate
    }
  };
}

async function supplierQuotes(products = [], postalCode, helpers = {}) {
  const liveQuoteFn = helpers.quoteSupplierFreight || quoteCjSupplierFreight;
  if (liveQuoteFn) {
    const liveQuotes = await liveQuoteFn(products, postalCode, helpers.customer || {});
    if (Array.isArray(liveQuotes) && liveQuotes.length) {
      return liveQuotes.map((quote) => liveSupplierQuote(products, quote));
    }
  }
  return [supplierQuote(products)];
}

function combineShippingQuotes(melhorEnvioQuotes = [], supplier) {
  return melhorEnvioQuotes.map((quote) => ({
    ...quote,
    id: `mixed:${quote.id}`,
    name: `${quote.name} + envio direto`,
    price: toMoney(Number(quote.price || 0) + Number(supplier.price || 0)),
    provider: "mixed",
    physicalServiceId: String(quote.id),
    physicalCarrier: quote.company,
    physicalServiceName: quote.name,
    physicalPrice: quote.price,
    supplierPrice: supplier.price,
    supplierItems: supplier.supplierItems || [],
    deliveryTime: Math.max(Number(quote.deliveryTime || 0), Number(supplier.deliveryTime || 0)) || quote.deliveryTime,
    raw: {
      melhorEnvio: quote.raw || quote,
      supplier: supplier.raw || supplier
    }
  }));
}

async function buildShippingQuotes(products, postalCode, helpers = {}) {
  const { quoteMelhorEnvio, aggregateShippingProduct } = helpers;
  const split = splitFulfillmentProducts(products);
  const suppliers = split.supplier.length ? await supplierQuotes(split.supplier, postalCode, helpers) : [];
  const supplier = suppliers[0] || null;
  let physicalResult = null;

  if (split.physical.length) {
    const physicalProduct = split.physical.length === 1
      ? split.physical[0]
      : aggregateShippingProduct(split.physical);
    physicalResult = await quoteMelhorEnvio(physicalProduct, postalCode);
  }

  if (supplier && !split.physical.length) {
    return {
      provider: supplier.provider || "supplier-manual",
      quotes: suppliers,
      supplier,
      package: null
    };
  }

  if (supplier && physicalResult) {
    return {
      provider: "mixed",
      quotes: suppliers.flatMap((supplierQuoteOption) => combineShippingQuotes(physicalResult.quotes, supplierQuoteOption)),
      supplier,
      package: physicalResult.package
    };
  }

  return {
    provider: "melhor-envio",
    quotes: physicalResult?.quotes || [],
    supplier: null,
    package: physicalResult?.package || null
  };
}

async function resolveShippingSelection(products, shipping, helpers) {
  const split = splitFulfillmentProducts(products);
  if (!shipping || !shipping.postalCode || !shipping.serviceId) {
    if (split.supplier.length) {
      const error = new Error("Calcule e selecione o envio direto para produtos MobilyTech Finds.");
      error.statusCode = 400;
      throw error;
    }
    return null;
  }

  const quoteResult = await buildShippingQuotes(products, shipping.postalCode, helpers);
  const selected = quoteResult.quotes.find((quote) => String(quote.id) === String(shipping.serviceId));
  if (!selected) {
    const error = new Error("Frete selecionado nao esta mais disponivel.");
    error.statusCode = 400;
    throw error;
  }

  const provider = selected.provider || quoteResult.provider;
  const isSupplierOnly = provider === "supplier-manual";
  const isMixed = provider === "mixed";

  return {
    ...shipping,
    provider,
    postalCode: onlyDigits(shipping.postalCode),
    serviceId: String(selected.id),
    serviceName: selected.name,
    carrier: selected.company,
    price: selected.price,
    deliveryTime: selected.deliveryTime,
    physicalServiceId: isSupplierOnly ? "" : (selected.physicalServiceId || selected.id),
    physicalCarrier: isSupplierOnly ? "" : (selected.physicalCarrier || selected.company),
    physicalServiceName: isSupplierOnly ? "" : (selected.physicalServiceName || selected.name),
    physicalPrice: isSupplierOnly ? 0 : (selected.physicalPrice ?? (isMixed ? 0 : selected.price)),
    supplierPrice: isSupplierOnly ? selected.price : (selected.supplierPrice || 0),
    supplierItems: selected.supplierItems || [],
    requiresManualFulfillment: Boolean(split.supplier.length)
  };
}

function isManualShippingProvider(provider) {
  const normalized = normalizeText(provider || "");
  return normalized.includes("supplier") || normalized.includes("mixed") || normalized.includes("fornecedor");
}

function fulfillmentItemsForIds(products, productIds = []) {
  const wanted = new Set(productIds.map((id) => String(id || "").trim()).filter(Boolean));
  return products
    .filter((product) => wanted.has(String(product.id)) && isSupplierFulfilled(product))
    .map(supplierFulfillmentItem);
}

function formatFulfillmentItems(items = []) {
  return items.map((item) => [
    `Produto: ${item.title}`,
    `ID: ${item.productId}`,
    `Qtd: ${item.quantity || 1}`,
    `Canal de origem: ${item.supplierPlatform}`,
    `Origem: ${item.originLabel || item.region || "Nao informada"}`,
    `Link: ${item.supplierUrl || "Nao informado"}`,
    item.supplierBackupUrl ? `Backup: ${item.supplierBackupUrl}` : "",
    `Custo estimado: ${item.costPrice !== null ? `R$ ${item.costPrice}` : "Nao informado"}`,
    `Frete cobrado do cliente: R$ ${item.customerShippingPrice}`,
    `Prazo estimado: ${item.deliveryTime || "nao informado"} dia(s)`,
    `Frete estimado: ${item.shippingEstimated ? "sim" : "nao"}`,
    item.freightBasis ? `Base do frete: ${compactText(item.freightBasis, 180)}` : "",
    item.sellerReputation ? `Reputacao: ${compactText(item.sellerReputation, 220)}` : "",
    item.operationRisk ? `Risco/checagem: ${compactText(item.operationRisk, 220)}` : "",
    item.supplierInstruction ? `Instrucao: ${compactText(item.supplierInstruction, 320)}` : ""
  ].filter(Boolean).join(" | ")).join("\n");
}

module.exports = {
  buildShippingQuotes,
  combineShippingQuotes,
  fulfillmentItemsForIds,
  formatFulfillmentItems,
  isManualShippingProvider,
  isSupplierFulfilled,
  loadProductsFromDisk,
  onlyDigits,
  parseMoneyNumber,
  resolveShippingSelection,
  splitFulfillmentProducts,
  supplierFulfillmentItem,
  supplierQuote,
  validateUniquePhysicalCheckoutItems
};
