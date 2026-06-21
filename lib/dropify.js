const DROPIFY_API_BASE = process.env.DROPIFY_API_BASE || "https://app.dropify.com.br";
const DROPIFY_FREIGHT_API_BASE = process.env.DROPIFY_FREIGHT_API_BASE || "https://express.dropify.com.br";
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;

let dropifyTokenCache = null;

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function compactText(value, maxLength = 240) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  if (!clean || clean.length <= maxLength) return clean;
  return `${clean.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function stripHtml(value = "") {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
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

function brlToCents(value) {
  const parsed = parseMoneyNumber(value);
  return parsed !== null ? Math.max(1, Math.round(parsed * 100)) : null;
}

function centsToBrl(value) {
  const parsed = parseMoneyNumber(value);
  if (parsed === null) return null;
  return toMoney(parsed / 100);
}

function moneyFromPossibleCents(value) {
  if (value === undefined || value === null || value === "") return null;
  const raw = String(value);
  const parsed = parseMoneyNumber(value);
  if (parsed === null) return null;
  if (/[,\.]/.test(raw) && !Number.isInteger(Number(raw))) return toMoney(parsed);
  if (Number.isInteger(parsed) && Math.abs(parsed) >= 1000) return centsToBrl(parsed);
  return toMoney(parsed);
}

function dropifyCatalogMoney(value) {
  if (value === undefined || value === null || value === "") return null;
  const raw = String(value);
  const parsed = parseMoneyNumber(value);
  if (parsed === null) return null;
  if (/[,\.]/.test(raw) && !Number.isInteger(Number(raw))) return toMoney(parsed);
  return centsToBrl(parsed);
}

function freightMoneyFromPossibleCents(value) {
  if (value === undefined || value === null || value === "") return null;
  const raw = String(value);
  const parsed = parseMoneyNumber(value);
  if (parsed === null) return null;
  if (/[,\.]/.test(raw) && !Number.isInteger(Number(raw))) return toMoney(parsed);
  return centsToBrl(parsed);
}

function dropifyClientId() {
  return process.env.DROPIFY_CLIENT_ID
    || process.env.DROPIFY_APP_CLIENT_ID
    || "";
}

function dropifyClientSecret() {
  return process.env.DROPIFY_CLIENT_SECRET
    || process.env.DROPIFY_APP_CLIENT_SECRET
    || "";
}

function dropifyFreightKey() {
  return process.env.DROPIFY_FREIGHT_KEY
    || process.env.DROPIFY_FREIGHT_API_KEY
    || "";
}

function isDropifyConfigured() {
  return Boolean(dropifyClientId() && dropifyClientSecret());
}

function isDropifyFreightConfigured() {
  return Boolean(dropifyFreightKey());
}

function tokenIsFresh(tokenData) {
  return Boolean(tokenData?.accessToken && tokenData.expiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS);
}

async function getDropifyAccessToken() {
  if (tokenIsFresh(dropifyTokenCache)) return dropifyTokenCache.accessToken;

  const clientId = dropifyClientId();
  const clientSecret = dropifyClientSecret();
  if (!clientId || !clientSecret) {
    const error = new Error("DROPIFY_CLIENT_ID e DROPIFY_CLIENT_SECRET ainda nao configurados na Vercel.");
    error.statusCode = 501;
    error.code = "DROPIFY_CREDENTIALS_REQUIRED";
    throw error;
  }

  const response = await fetch(`${DROPIFY_API_BASE}/oauth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "MobilyTechBR"
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  const data = await response.json().catch(() => ({}));
  const accessToken = data.access_token || data.accessToken || data.token;
  if (!response.ok || !accessToken) {
    const error = new Error(data.message || data.error || `Dropify autenticacao retornou ${response.status}.`);
    error.statusCode = response.status || 502;
    error.code = "DROPIFY_AUTH_ERROR";
    error.details = data;
    throw error;
  }

  dropifyTokenCache = {
    accessToken,
    expiresAt: Date.now() + Math.max(60, Number(data.expires_in || data.expiresIn || 86400)) * 1000
  };
  return accessToken;
}

async function dropifyRequest(pathname, options = {}) {
  const token = await getDropifyAccessToken();
  const url = new URL(`${DROPIFY_API_BASE}${pathname}`);
  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "MobilyTechBR",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false || data.error) {
    const error = new Error(data.message || data.error?.message || data.error || `Dropify retornou ${response.status}.`);
    error.statusCode = response.status || 502;
    error.code = "DROPIFY_REQUEST_ERROR";
    error.details = data;
    throw error;
  }
  return data;
}

async function listDropifyProducts({ page = 1, pageSize = 50 } = {}) {
  return dropifyRequest("/api/products", {
    query: {
      page: Math.max(1, Number(page) || 1),
      page_size: Math.min(50, Math.max(1, Number(pageSize) || 50))
    }
  });
}

async function getDropifyProduct(sku) {
  const cleanSku = String(sku || "").trim();
  if (!cleanSku) {
    const error = new Error("SKU Dropify nao informado.");
    error.statusCode = 400;
    error.code = "DROPIFY_SKU_REQUIRED";
    throw error;
  }
  return dropifyRequest(`/api/products/${encodeURIComponent(cleanSku)}`);
}

function normalizeProductArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?._embedded?.products)) return data._embedded.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function normalizeDropifyProduct(product = {}) {
  const sku = String(product.sku || product.SKU || product.id || "").trim();
  const measurements = product.measurements || {};
  const descriptions = product.descriptions || {};
  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage = images.find(Boolean);
  const description = descriptions.shortDescription
    || descriptions.description
    || product.shortDescription
    || product.description
    || "";
  return {
    sku,
    name: compactText(product.name || product.title || "", 180),
    description: compactText(stripHtml(description), 500),
    technicalDescription: compactText(stripHtml(descriptions.technicalDescription || ""), 700),
    includedItems: compactText(stripHtml(descriptions.includedItems || ""), 240),
    brand: compactText(product.brand || "", 80),
    categories: Array.isArray(product.categories) ? product.categories.filter(Boolean) : [],
    ean: compactText(product.ean || product.gtin || "", 32),
    ncm: compactText(product.ncm || "", 16),
    cest: compactText(product.cest || "", 16),
    model: compactText(product.model || "", 80),
    warrantyDays: Number(product.warranty || product.warrantyDays || 0) || null,
    stockQuantity: Number(product.stockQuantity ?? product.stock ?? 0) || 0,
    immediateShipment: product.immediateShipment === true,
    deadline: Number(product.deadline || 0) || null,
    image: typeof firstImage === "string" ? firstImage : (firstImage?.url || ""),
    wholesalePrice: dropifyCatalogMoney(product.wholesalePrice),
    suggestedRetailPrice: dropifyCatalogMoney(product.suggestedRetailPrice),
    measurements: {
      height: parseMoneyNumber(measurements.height),
      width: parseMoneyNumber(measurements.width),
      length: parseMoneyNumber(measurements.length),
      weight: parseMoneyNumber(measurements.weight)
    },
    combinations: Array.isArray(product.combinations) ? product.combinations : [],
    raw: product
  };
}

function dropifySku(product = {}) {
  const selected = product.selectedVariant || {};
  return String(
    selected.dropify?.sku
    || selected.sku
    || product.dropify?.sku
    || product.dropifySku
    || product.sku
    || product.shipping?.dropifySku
    || ""
  ).trim();
}

function isDropifyProduct(product = {}) {
  const platform = normalizeText([
    product.supplierPlatform,
    product.marketplace?.name,
    product.shipping?.provider,
    product.fulfillmentProvider,
    product.dropify?.provider
  ].filter(Boolean).join(" "));
  return Boolean(dropifySku(product) || platform.includes("dropify"));
}

function productDimension(product, key) {
  if (key === "weight") return productWeightGrams(product);

  const shipping = product.shipping || {};
  const dropify = product.dropify || {};
  const selected = product.selectedVariant || {};
  const selectedDropify = selected.dropify || {};
  return parseMoneyNumber(
    selectedDropify[key]
    ?? dropify[key]
    ?? shipping[`${key}Cm`]
    ?? shipping[key]
    ?? product[`${key}Cm`]
    ?? product[key]
  );
}

function productWeightGrams(product = {}) {
  const shipping = product.shipping || {};
  const dropify = product.dropify || {};
  const selected = product.selectedVariant || {};
  const selectedDropify = selected.dropify || {};
  const gramValue = [
    selectedDropify.weightG,
    selectedDropify.weightGrams,
    dropify.weightG,
    dropify.weightGrams,
    shipping.weightG,
    shipping.weightGrams,
    product.weightG,
    product.weightGrams,
    selectedDropify.weight,
    dropify.weight,
    shipping.weight,
    product.weight
  ].map(parseMoneyNumber).find((value) => value !== null && value > 0);
  if (gramValue !== undefined) return gramValue;

  const kgValue = [
    selectedDropify.weightKg,
    dropify.weightKg,
    shipping.weightKg,
    product.weightKg
  ].map(parseMoneyNumber).find((value) => value !== null && value > 0);
  if (kgValue === undefined) return null;
  return kgValue <= 50 ? Math.round(kgValue * 1000) : kgValue;
}

function dropifyFreightItem(product = {}) {
  const sku = dropifySku(product);
  const quantity = Math.max(1, Number(product.quantity || product.qty || 1) || 1);
  const price = brlToCents(product.costPrice || product.supplierCost || product.price);
  const height = productDimension(product, "height");
  const length = productDimension(product, "length");
  const width = productDimension(product, "width");
  const weight = productDimension(product, "weight");

  if (!sku || !price || !height || !length || !width || !weight) {
    const error = new Error(`${product.title || "Produto Dropify"} precisa de SKU, custo/preco, peso e medidas antes de calcular frete Dropify.`);
    error.statusCode = 409;
    error.code = "DROPIFY_PRODUCT_MEASUREMENTS_REQUIRED";
    throw error;
  }

  return { sku, price, quantity, height, length, width, weight };
}

function freightOptionsArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.quotes)) return data.quotes;
  if (Array.isArray(data?.shippingOptions)) return data.shippingOptions;
  if (Array.isArray(data?.services)) return data.services;
  return [];
}

function dropifyFreightName(option = {}) {
  return compactText(
    option.shippingMethodName
    || option.name
    || option.serviceName
    || option.shippingMethod
    || option.shippingMethodId
    || option.method
    || option.code
    || "Envio nacional",
    120
  );
}

function dropifyFreightDeliveryDays(option = {}) {
  return Number(
    option.deliveryTime
    || option.delivery_time
    || option.deadline
    || option.estimatedDays
    || option.days
    || 0
  ) || null;
}

function dropifyFreightPrice(option = {}) {
  return [
    option.cost,
    option.price,
    option.value,
    option.amount,
    option.shippingCost,
    option.total
  ].map(freightMoneyFromPossibleCents).find((value) => value !== null && value >= 0);
}

async function quoteDropifySupplierFreight(products = [], postalCode) {
  const dropifyProducts = products.filter(isDropifyProduct);
  if (!dropifyProducts.length || dropifyProducts.length !== products.length) return null;

  const key = dropifyFreightKey();
  if (!key) {
    const error = new Error("DROPIFY_FREIGHT_KEY ainda nao configurado na Vercel.");
    error.statusCode = 501;
    error.code = "DROPIFY_FREIGHT_KEY_REQUIRED";
    throw error;
  }

  const zip = onlyDigits(postalCode);
  if (zip.length !== 8) {
    const error = new Error("CEP de destino invalido.");
    error.statusCode = 400;
    error.code = "DROPIFY_ZIP_INVALID";
    throw error;
  }

  const body = {
    zipcode: zip,
    items: dropifyProducts.map(dropifyFreightItem)
  };

  const url = new URL(`${DROPIFY_FREIGHT_API_BASE}/api/freight`);
  url.searchParams.set("key", key);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "MobilyTechBR"
    },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false || data.error) {
    const error = new Error(data.message || data.error?.message || data.error || `Dropify Frete retornou ${response.status}.`);
    error.statusCode = response.status || 502;
    error.code = "DROPIFY_FREIGHT_ERROR";
    error.details = data;
    throw error;
  }

  return freightOptionsArray(data)
    .map((option) => {
      const price = dropifyFreightPrice(option);
      if (price === null) return null;
      const name = dropifyFreightName(option);
      return {
        id: `dropify:${option.shippingMethodId || option.id || option.code || option.method || name}`,
        name,
        company: "Envio nacional",
        provider: "dropify",
        price,
        deliveryTime: dropifyFreightDeliveryDays(option),
        recommended: true,
        raw: {
          provider: "dropify",
          dropify: option,
          zip,
          items: body.items.map((item) => ({ sku: item.sku, quantity: item.quantity }))
        }
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.price - b.price);
}

function normalizeCustomer(customer = {}) {
  const city = customer.city || customer.localidade || "";
  const state = customer.state || customer.uf || customer.province || "";
  const district = customer.district || customer.neighborhood || customer.bairro || "";
  const street = customer.street || customer.address || "";
  const number = customer.number || customer.houseNumber || "";
  const complement = customer.complement || customer.address2 || "";
  return {
    name: compactText(customer.name || customer.fullName || "", 120),
    email: compactText(customer.email || "", 120),
    phone: onlyDigits(customer.phone || customer.telephone || customer.cellphone || ""),
    document: onlyDigits(customer.taxId || customer.cpf || customer.document || ""),
    address: {
      zipcode: onlyDigits(customer.postalCode || customer.zip || customer.cep),
      street: compactText(street, 160),
      number: compactText(number, 30),
      complement: compactText(complement, 160),
      neighborhood: compactText(district, 120),
      city: compactText(city, 120),
      state: compactText(state, 2).toUpperCase()
    }
  };
}

function validateCustomer(customer) {
  const missing = [];
  if (!customer.name) missing.push("nome");
  if (!customer.email) missing.push("e-mail");
  if (!customer.phone) missing.push("telefone");
  if (!customer.document) missing.push("CPF");
  if (!customer.address.zipcode) missing.push("CEP");
  if (!customer.address.street) missing.push("rua");
  if (!customer.address.number) missing.push("numero");
  if (!customer.address.city) missing.push("cidade");
  if (!customer.address.state) missing.push("UF");
  if (missing.length) {
    const error = new Error(`Dados do cliente incompletos para preparar pedido Dropify: ${missing.join(", ")}.`);
    error.statusCode = 409;
    error.code = "DROPIFY_ORDER_CUSTOMER_REQUIRED";
    throw error;
  }
}

function dropifyItemFromSupplierItem(item = {}) {
  const dropify = item.dropify || {};
  const sku = String(dropify.sku || item.sku || item.dropifySku || "").trim();
  if (!sku) return null;
  const salePrice = brlToCents(item.salePrice || item.price || item.costPrice || item.supplierCost);
  if (!salePrice) {
    const error = new Error(`${item.title || sku} precisa de preco para preparar pedido Dropify.`);
    error.statusCode = 409;
    error.code = "DROPIFY_ORDER_ITEM_PRICE_REQUIRED";
    throw error;
  }
  return {
    sku,
    quantity: Math.max(1, Number(item.quantity || 1) || 1),
    salePrice
  };
}

function dropifyConsumerPayload(customer) {
  return {
    consumerType: "naturalPerson",
    name: customer.name,
    email: customer.email,
    phoneNumber: customer.phone,
    mobilePhoneNumber: customer.phone,
    cpfCnpj: customer.document,
    address: {
      postalCode: customer.address.zipcode,
      street: customer.address.street,
      number: customer.address.number,
      complement: customer.address.complement,
      district: customer.address.neighborhood,
      city: customer.address.city,
      state: customer.address.state,
      country: "Brasil"
    }
  };
}

function buildDropifyOrderPayload({ orderReference, customer, supplierItems = [], shippingMethod = "CUSTOM_LABEL" }) {
  const consumer = normalizeCustomer(customer);
  validateCustomer(consumer);
  const items = supplierItems.map(dropifyItemFromSupplierItem).filter(Boolean);
  if (!items.length) {
    const error = new Error("Nenhum item Dropify com SKU valido para preparar pedido.");
    error.statusCode = 409;
    error.code = "DROPIFY_ORDER_ITEMS_REQUIRED";
    throw error;
  }

  return {
    externalOrderId: compactText(orderReference, 80),
    salesChannel: process.env.DROPIFY_SALES_CHANNEL || "MobilyTech BR",
    consumer: dropifyConsumerPayload(consumer),
    items,
    shippingMethod
  };
}

function shouldCreateDropifyOrder() {
  const raw = normalizeText(process.env.DROPIFY_SEMI_AUTOMATIC_ORDER_ENABLED || process.env.DROPIFY_CREATE_ORDER_ENABLED || "false");
  return ["1", "true", "sim", "yes", "on"].includes(raw);
}

async function createDropifySemiAutomaticOrder({ orderReference, customer, supplierItems = [] }) {
  const payload = buildDropifyOrderPayload({
    orderReference,
    customer,
    supplierItems,
    shippingMethod: process.env.DROPIFY_ORDER_SHIPPING_METHOD || "CUSTOM_LABEL"
  });

  if (!shouldCreateDropifyOrder()) {
    return {
      status: "payload-only",
      created: false,
      payload
    };
  }

  const data = await dropifyRequest("/api/orders/create", {
    method: "POST",
    body: payload
  });
  const order = data.data || data.order || data;
  return {
    status: "created-review-required",
    created: true,
    orderId: order.id || order.orderId || order.externalOrderId || "",
    raw: order,
    payload
  };
}

module.exports = {
  buildDropifyOrderPayload,
  createDropifySemiAutomaticOrder,
  dropifyClientId,
  dropifyClientSecret,
  dropifyFreightKey,
  dropifyRequest,
  dropifySku,
  getDropifyAccessToken,
  getDropifyProduct,
  isDropifyConfigured,
  isDropifyFreightConfigured,
  isDropifyProduct,
  listDropifyProducts,
  normalizeDropifyProduct,
  normalizeProductArray,
  quoteDropifySupplierFreight
};
