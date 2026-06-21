const fs = require("fs/promises");
const path = require("path");
const { isCjProduct, quoteCjSupplierFreight } = require("./cj-dropshipping");
const { isDropifyProduct, quoteDropifySupplierFreight } = require("./dropify");

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");
const DEFAULT_SUPPLIER_SHIPPING_BRL = 29.9;
const TRUE_VALUES = new Set(["1", "true", "sim", "yes", "on"]);
const DEFAULT_ADDON_MIN_SUBTOTAL_BRL = 99;
const DEFAULT_INCLUDED_SHIPPING_MIN_SUBTOTAL_BRL = 99;
const DEFAULT_INCLUDED_SHIPPING_MIN_NET_MARGIN_BRL = 12;
const DEFAULT_INCLUDED_SHIPPING_MAX_MARGIN_SHARE = 0.75;
const DEFAULT_HIGH_FREIGHT_RATIO = 1.25;
const DEFAULT_ADDON_FREIGHT_RATIO = 2;

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

function envFlag(name, fallback = false) {
  const value = normalizeText(process.env[name] ?? "");
  if (!value) return fallback;
  if (TRUE_VALUES.has(value)) return true;
  if (["0", "false", "nao", "no", "off"].includes(value)) return false;
  return fallback;
}

function envNumber(name, fallback) {
  const parsed = parseMoneyNumber(process.env[name]);
  return parsed !== null ? parsed : fallback;
}

function productQuantity(product) {
  return Math.max(1, parseMoneyNumber(product?.quantity ?? product?.qty ?? 1) || 1);
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

  const allowDefaultShipping = TRUE_VALUES.has(normalizeText(process.env.DROPSHIPPING_ALLOW_DEFAULT_SHIPPING_BRL || ""));
  if (!allowDefaultShipping) {
    const error = new Error(`${product?.title || "Produto MobilyTech Finds"} nao pode usar frete padrao; configure frete exato do fornecedor ate o cliente antes do checkout.`);
    error.statusCode = 409;
    error.code = "SUPPLIER_EXACT_FREIGHT_REQUIRED";
    throw error;
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
  if (isDropifyProduct(product)) return product?.supplierPlatform || "Dropify";
  if (region === "INTL") {
    return sourceNotes.phase1SourcePlatform || product?.supplierPlatform || product?.marketplace?.name || "Fornecedor internacional";
  }
  return product?.supplierPlatform || product?.marketplace?.name || sourceNotes.phase1SourcePlatform || "Canal de origem";
}

function supplierPrimaryUrl(product, sourceNotes, region) {
  if (region === "INTL") {
    return product?.supplierReferenceUrl || product?.supplierUrl || product?.sourceUrl || product?.supplierSearchUrl || sourceNotes.supplierSearchUrl || "";
  }
  return product?.supplierReferenceUrl || product?.supplierUrl || product?.sourceUrl || product?.supplierSearchUrl || sourceNotes.supplierSearchUrl || "";
}

function validateSupplierProductForCheckout(product) {
  const title = product?.title || "Produto de envio direto";
  if (product?.checkoutEnabled !== true) {
    const error = new Error(`${title} ainda nao esta liberado para checkout direto.`);
    error.statusCode = 409;
    error.code = "SUPPLIER_CHECKOUT_DISABLED";
    throw error;
  }

  const salePrice = parseMoneyNumber(product?.price);
  const costPrice = parseMoneyNumber(product?.costPrice || product?.supplierCost);
  if (salePrice === null || salePrice <= 0 || costPrice === null || costPrice <= 0) {
    const error = new Error(`${title} precisa de preco de venda e custo do fornecedor validados antes do checkout.`);
    error.statusCode = 409;
    error.code = "SUPPLIER_PRICE_COST_REQUIRED";
    throw error;
  }

  const sourceNotes = product?.sourceNotes || {};
  const referenceUrl = supplierPrimaryUrl(product, sourceNotes, supplierRegion(product));
  if (!referenceUrl || !/^https?:\/\//i.test(referenceUrl)) {
    const error = new Error(`${title} precisa de link de referencia do fornecedor antes do checkout.`);
    error.statusCode = 409;
    error.code = "SUPPLIER_REFERENCE_URL_REQUIRED";
    throw error;
  }

  const shipping = product?.shipping || {};
  if (shipping.exactRequired !== true && product?.requireExactSupplierFreight !== true) {
    const error = new Error(`${title} precisa exigir frete exato do fornecedor ate o cliente.`);
    error.statusCode = 409;
    error.code = "SUPPLIER_EXACT_FREIGHT_FLAG_REQUIRED";
    throw error;
  }

  return { salePrice, costPrice, referenceUrl };
}

function supplierSaleSubtotal(products = []) {
  return toMoney(products.reduce((sum, product) => {
    return sum + (parseMoneyNumber(product?.price) || 0) * productQuantity(product);
  }, 0));
}

function supplierCostSubtotal(products = []) {
  return toMoney(products.reduce((sum, product) => {
    const cost = parseMoneyNumber(product?.costPrice || product?.supplierCost) || 0;
    return sum + cost * productQuantity(product);
  }, 0));
}

function isSupplierAddOnOnly(product) {
  const shipping = product?.shipping || {};
  const policy = product?.commercePolicy || {};
  return Boolean(
    shipping.addOnOnly === true ||
    policy.addOnOnly === true ||
    shipping.freightRiskLevel === "add-on-only" ||
    policy.freightRiskLevel === "add-on-only"
  );
}

function supplierAddOnCartError(products = [], options = {}) {
  const minSubtotal = options.minSubtotal || envNumber("DROPSHIPPING_ADDON_MIN_CART_SUBTOTAL_BRL", DEFAULT_ADDON_MIN_SUBTOTAL_BRL);
  const flaggedProducts = options.products || products;
  const titles = flaggedProducts.map((item) => item.title || "item").slice(0, 3).join(", ");
  const error = new Error(`${titles} tem frete proporcionalmente alto quando comprado sozinho. Adicione outros itens de Nossos Produtos ate pelo menos R$ ${minSubtotal.toFixed(2).replace(".", ",")} para recalcular o envio em combo.`);
  error.statusCode = 409;
  error.code = "SUPPLIER_ADDON_CART_REQUIRED";
  error.details = {
    minimumSubtotalBrl: minSubtotal,
    cartSubtotalBrl: supplierSaleSubtotal(products),
    addOnOnlyProductIds: flaggedProducts.map((item) => item.id).filter(Boolean)
  };
  return error;
}

function validateSupplierCartEconomics(products = []) {
  if (!products.length || !envFlag("DROPSHIPPING_ENFORCE_ADDON_CART_POLICY", true)) return;

  const addOnOnlyItems = products.filter(isSupplierAddOnOnly);
  if (!addOnOnlyItems.length) return;

  const subtotal = supplierSaleSubtotal(products);
  const minSubtotal = envNumber("DROPSHIPPING_ADDON_MIN_CART_SUBTOTAL_BRL", DEFAULT_ADDON_MIN_SUBTOTAL_BRL);
  if (subtotal >= minSubtotal) return;

  throw supplierAddOnCartError(products, { minSubtotal, products: addOnOnlyItems });
}

function supplierShippingEconomics(products = [], quote = {}) {
  const subtotal = supplierSaleSubtotal(products);
  const supplierCost = supplierCostSubtotal(products);
  const supplierShipping = toMoney(parseMoneyNumber(quote.supplierPrice ?? quote.price) || 0);
  const grossMargin = toMoney(subtotal - supplierCost);
  const marginAfterSupplierShipping = toMoney(grossMargin - supplierShipping);
  const freightRatio = subtotal > 0 ? Number((supplierShipping / subtotal).toFixed(2)) : 0;
  const minSubtotal = envNumber("DROPSHIPPING_INCLUDED_SHIPPING_MIN_SUBTOTAL_BRL", DEFAULT_INCLUDED_SHIPPING_MIN_SUBTOTAL_BRL);
  const minNetMargin = envNumber("DROPSHIPPING_INCLUDED_SHIPPING_MIN_NET_MARGIN_BRL", DEFAULT_INCLUDED_SHIPPING_MIN_NET_MARGIN_BRL);
  const maxMarginShare = Math.min(1, Math.max(0, envNumber("DROPSHIPPING_INCLUDED_SHIPPING_MAX_MARGIN_SHARE", DEFAULT_INCLUDED_SHIPPING_MAX_MARGIN_SHARE)));
  const absorbableBudget = toMoney(Math.max(0, grossMargin - minNetMargin) * maxMarginShare);
  const includedShippingEligible = envFlag("DROPSHIPPING_INCLUDED_SHIPPING_ENABLED", true) &&
    subtotal >= minSubtotal &&
    supplierShipping > 0 &&
    absorbableBudget >= supplierShipping;
  const highFreightRatio = envNumber("DROPSHIPPING_HIGH_FREIGHT_RATIO", DEFAULT_HIGH_FREIGHT_RATIO);
  const addOnFreightRatio = envNumber("DROPSHIPPING_ADDON_FREIGHT_RATIO", DEFAULT_ADDON_FREIGHT_RATIO);
  const freightRiskLevel = freightRatio >= addOnFreightRatio
    ? "add-on-only"
    : freightRatio >= highFreightRatio
      ? "combo-recommended"
      : "normal";

  return {
    subtotal,
    supplierCost,
    grossMargin,
    supplierShipping,
    marginAfterSupplierShipping,
    freightRatio,
    freightRiskLevel,
    includedShippingEligible,
    includedShippingMinSubtotalBrl: minSubtotal,
    includedShippingMinNetMarginBrl: minNetMargin,
    includedShippingAbsorbableBudgetBrl: absorbableBudget
  };
}

function cloneSupplierItemsForIncludedShipping(items = [], supplierShipping = 0) {
  return items.map((item, index) => ({
    ...item,
    customerShippingPrice: 0,
    shippingIncluded: true,
    absorbedShippingPrice: index === 0 ? toMoney(supplierShipping) : 0
  }));
}

function withSupplierQuoteEconomics(products = [], quotes = []) {
  const enriched = quotes.map((quote) => {
    const supplierPrice = toMoney(parseMoneyNumber(quote.supplierPrice ?? quote.price) || 0);
    const shippingEconomics = supplierShippingEconomics(products, { ...quote, supplierPrice });
    return {
      ...quote,
      supplierPrice,
      customerShippingPrice: toMoney(parseMoneyNumber(quote.price) || 0),
      freightRiskLevel: shippingEconomics.freightRiskLevel,
      shippingEconomics
    };
  });

  const includedSource = enriched.find((quote) => quote.shippingEconomics?.includedShippingEligible);
  if (!includedSource) return enriched;

  const supplierShipping = toMoney(parseMoneyNumber(includedSource.supplierPrice ?? includedSource.price) || 0);
  const supplierItems = cloneSupplierItemsForIncludedShipping(includedSource.supplierItems || [], supplierShipping);
  const includedQuote = {
    ...includedSource,
    id: `included:${includedSource.id}`,
    name: `Frete incluso - ${includedSource.name}`,
    price: 0,
    customerShippingPrice: 0,
    supplierPrice: supplierShipping,
    originalShippingPrice: supplierShipping,
    includedShipping: true,
    recommended: true,
    supplierItems,
    shippingEconomics: {
      ...includedSource.shippingEconomics,
      includedShippingApplied: true
    },
    raw: {
      ...(includedSource.raw || {}),
      includedShipping: true,
      originalShippingPrice: supplierShipping,
      supplierItems
    }
  };

  return [includedQuote, ...enriched];
}

function validateLiveSupplierQuoteEconomics(products = [], quotes = []) {
  if (!products.length || !quotes.length || !envFlag("DROPSHIPPING_ENFORCE_ADDON_CART_POLICY", true)) return;
  const subtotal = supplierSaleSubtotal(products);
  const minSubtotal = envNumber("DROPSHIPPING_ADDON_MIN_CART_SUBTOTAL_BRL", DEFAULT_ADDON_MIN_SUBTOTAL_BRL);
  if (subtotal >= minSubtotal) return;
  const cheapest = [...quotes].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))[0];
  if (cheapest?.shippingEconomics?.freightRiskLevel === "add-on-only") {
    throw supplierAddOnCartError(products, { minSubtotal });
  }
}

function supplierFulfillmentItem(product, freightOverride) {
  const validation = validateSupplierProductForCheckout(product);
  const freight = freightOverride || supplierShippingPrice(product);
  const region = supplierRegion(product);
  const quantity = Math.max(1, parseMoneyNumber(product?.quantity ?? product?.qty ?? 1) || 1);
  const sourceNotes = product?.sourceNotes || {};
  const shipping = product?.shipping || {};
  const cj = product?.cj || {};
  const selectedVariant = product?.selectedVariant || {};
  const dropify = {
    ...(product?.dropify || {}),
    ...(selectedVariant?.dropify || {})
  };
  return {
    productId: product?.id || "",
    title: product?.title || "",
    quantity,
    image: product?.image || product?.cutout || "",
    supplierPlatform: supplierPlatform(product, sourceNotes, region),
    supplierUrl: validation.referenceUrl,
    supplierBackupUrl: product?.supplierBackupUrl || sourceNotes.supplierBackupUrl || sourceNotes.supplierBackup || "",
    supplierInstruction: sourceNotes.supplierInstruction || product?.supplierInstructions || "",
    sellerReputation: sourceNotes.sellerReputation || "",
    operationRisk: sourceNotes.risk || "",
    freightBasis: shipping.freightBasis || sourceNotes.shipping || "",
    salePrice: validation.salePrice,
    costPrice: validation.costPrice,
    selectedVariant: product?.selectedVariant || null,
    marginPercent: product?.marginPercent || "",
    customerShippingPrice: toMoney(freight.price * quantity),
    shippingEstimated: freight.estimated,
    freightServiceName: freight.name || "",
    freightProvider: freight.provider || "",
    deliveryTime: supplierDeliveryTime(product),
    region,
    originLabel: region === "INTL" ? "Internacional" : "Brasil",
    cj: {
      pid: cj.pid || sourceNotes.cjProductId || "",
      vid: cj.vid || product?.cjVid || product?.cjVariantId || sourceNotes.cjVariantId || "",
      sku: cj.sku || product?.cjSku || "",
      productSku: cj.productSku || "",
      startCountryCode: cj.startCountryCode || shipping.startCountryCode || "CN",
      productNameEn: cj.productNameEn || sourceNotes.originalTitle || "",
      variantNameEn: cj.variantNameEn || sourceNotes.originalVariant || "",
      logisticName: freight.name || shipping.sampleQuoteService || "",
      costUsd: product?.costUsd || cj.costUsd || "",
      usdBrlRate: cj.usdBrlRate || shipping.cjUsdBrlRate || ""
    },
    dropify: {
      sku: dropify.sku || selectedVariant.sku || product?.dropifySku || "",
      productSku: dropify.productSku || product?.dropifyProductSku || "",
      variationSku: dropify.variationSku || selectedVariant.sku || "",
      freightServiceName: freight.name || shipping.sampleQuoteService || "",
      deadline: dropify.deadline || shipping.deliveryDays || "",
      immediateShipment: dropify.immediateShipment === true
    }
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
  validateSupplierCartEconomics(products);
  const liveQuoteFn = helpers.quoteSupplierFreight || quoteLiveSupplierFreight;
  if (liveQuoteFn) {
    const liveQuotes = await liveQuoteFn(products, postalCode, helpers.customer || {});
    if (Array.isArray(liveQuotes) && liveQuotes.length) {
      const enriched = withSupplierQuoteEconomics(products, liveQuotes.map((quote) => liveSupplierQuote(products, quote)));
      validateLiveSupplierQuoteEconomics(products, enriched);
      return enriched;
    }
  }
  const fallbackQuotes = withSupplierQuoteEconomics(products, [supplierQuote(products)]);
  validateLiveSupplierQuoteEconomics(products, fallbackQuotes);
  return fallbackQuotes;
}

async function quoteLiveSupplierFreight(products = [], postalCode, customer = {}) {
  if (products.length && products.every(isDropifyProduct)) {
    return quoteDropifySupplierFreight(products, postalCode, customer);
  }
  if (products.length && products.every(isCjProduct)) {
    return quoteCjSupplierFreight(products, postalCode, customer);
  }
  return null;
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
  const isSupplierOnly = Boolean(split.supplier.length && !split.physical.length);
  const isMixed = provider === "mixed";
  const selectedSupplierPrice = selected.supplierPrice ?? selected.actualSupplierPrice ?? (isSupplierOnly ? selected.price : 0);

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
    supplierPrice: isSupplierOnly ? selectedSupplierPrice : (selected.supplierPrice || 0),
    supplierItems: selected.supplierItems || [],
    includedShipping: selected.includedShipping === true,
    originalShippingPrice: selected.originalShippingPrice,
    shippingEconomics: selected.shippingEconomics,
    requiresManualFulfillment: Boolean(split.supplier.length)
  };
}

function isManualShippingProvider(provider) {
  const normalized = normalizeText(provider || "");
  return normalized.includes("supplier") || normalized.includes("mixed") || normalized.includes("fornecedor") || normalized.includes("dropshipping") || normalized.includes("cj");
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
    item.selectedVariant?.label ? `Variacao: ${item.selectedVariant.label}` : "",
    `Qtd: ${item.quantity || 1}`,
    `Canal de origem: ${item.supplierPlatform}`,
    `Origem: ${item.originLabel || item.region || "Nao informada"}`,
    `Link: ${item.supplierUrl || "Nao informado"}`,
    item.supplierBackupUrl ? `Backup: ${item.supplierBackupUrl}` : "",
    `Custo estimado: ${item.costPrice !== null ? `R$ ${item.costPrice}` : "Nao informado"}`,
    item.shippingIncluded
      ? `Frete real do fornecedor absorvido pela margem: R$ ${item.absorbedShippingPrice || item.customerShippingPrice}`
      : `Frete cobrado do cliente: R$ ${item.customerShippingPrice}`,
    `Prazo estimado: ${item.deliveryTime || "nao informado"} dia(s)`,
    `Frete estimado: ${item.shippingEstimated ? "sim" : "nao"}`,
    item.freightBasis ? `Base do frete: ${compactText(item.freightBasis, 180)}` : "",
    item.dropify?.sku ? `Dropify SKU: ${item.dropify.sku}` : "",
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
  quoteLiveSupplierFreight,
  resolveShippingSelection,
  splitFulfillmentProducts,
  supplierFulfillmentItem,
  supplierQuote,
  validateSupplierCartEconomics,
  validateUniquePhysicalCheckoutItems
};
