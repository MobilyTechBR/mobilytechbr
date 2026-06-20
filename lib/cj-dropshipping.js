const CJ_API_BASE = process.env.CJ_API_BASE || "https://developers.cjdropshipping.com";
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;

let cjTokenCache = null;

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

function compactText(value, maxLength = 200) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  if (!clean || clean.length <= maxLength) return clean;
  return `${clean.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function cjAccessToken() {
  return process.env.CJ_ACCESS_TOKEN
    || process.env.CJ_API_TOKEN
    || process.env.CJDROPSHIPPING_ACCESS_TOKEN
    || "";
}

function cjApiKey() {
  return process.env.CJ_API_KEY
    || process.env.CJDROPSHIPPING_API_KEY
    || "";
}

function cjRefreshToken() {
  return process.env.CJ_REFRESH_TOKEN
    || process.env.CJDROPSHIPPING_REFRESH_TOKEN
    || "";
}

function tokenIsFresh(tokenData) {
  if (!tokenData?.accessToken) return false;
  const expiresAt = Date.parse(tokenData.accessTokenExpiryDate || "");
  return Number.isFinite(expiresAt) && expiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS;
}

function cacheToken(data = {}) {
  cjTokenCache = {
    accessToken: data.accessToken,
    accessTokenExpiryDate: data.accessTokenExpiryDate,
    refreshToken: data.refreshToken,
    refreshTokenExpiryDate: data.refreshTokenExpiryDate
  };
  return cjTokenCache.accessToken || "";
}

async function cjAuthRequest(endpoint, body) {
  const response = await fetch(`${CJ_API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "MobilyTechBR"
    },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.result === false || data.success === false || !data.data?.accessToken) {
    const error = new Error(data.message || `CJ autenticacao retornou ${response.status}.`);
    error.statusCode = response.status || 502;
    error.code = "CJ_AUTH_ERROR";
    error.details = data;
    throw error;
  }
  return cacheToken(data.data);
}

async function getCjAccessToken() {
  const configuredToken = cjAccessToken();
  if (configuredToken) return configuredToken;

  if (tokenIsFresh(cjTokenCache)) return cjTokenCache.accessToken;

  const cachedRefreshToken = cjTokenCache?.refreshToken || cjRefreshToken();
  if (cachedRefreshToken) {
    try {
      return await cjAuthRequest("/api2.0/v1/authentication/refreshAccessToken", {
        refreshToken: cachedRefreshToken
      });
    } catch (error) {
      if (!cjApiKey()) throw error;
    }
  }

  const apiKey = cjApiKey();
  if (!apiKey) {
    const error = new Error("CJ_API_KEY ou CJ_ACCESS_TOKEN ainda nao configurado.");
    error.statusCode = 501;
    error.code = "CJ_API_KEY_REQUIRED";
    throw error;
  }

  return cjAuthRequest("/api2.0/v1/authentication/getAccessToken", { apiKey });
}

function cjUsdBrlRate(product) {
  return parseMoneyNumber(
    process.env.CJ_USD_BRL_RATE
    || product?.cj?.usdBrlRate
    || product?.shipping?.cjUsdBrlRate
  );
}

function cjVariantId(product) {
  return String(
    product?.cj?.vid
    || product?.cj?.variantId
    || product?.cjVid
    || product?.cjVariantId
    || product?.shipping?.cjVid
    || product?.shipping?.cjVariantId
    || ""
  ).trim();
}

function cjSku(product) {
  return String(product?.cj?.sku || product?.cjSku || product?.shipping?.cjSku || "").trim();
}

function isCjProduct(product) {
  const platform = normalizeText([
    product?.supplierPlatform,
    product?.marketplace?.name,
    product?.sourceNotes?.phase1SourcePlatform,
    product?.shipping?.provider
  ].filter(Boolean).join(" "));
  return Boolean(cjVariantId(product) || cjSku(product) || platform.includes("cj"));
}

function cjStartCountryCode(product) {
  return String(product?.cj?.startCountryCode || product?.shipping?.startCountryCode || "CN").toUpperCase();
}

function cjProductPayload(product) {
  const vid = cjVariantId(product);
  if (!vid) return null;
  const quantity = Math.max(1, Number(product?.quantity || product?.qty || 1) || 1);
  return { vid, quantity };
}

function cjOptionPriceUsd(option) {
  return [
    option?.logisticPrice,
    option?.totalPostageFee,
    option?.postageAmount,
    option?.postage,
    option?.discountFee,
    option?.wrapPostage
  ].map(parseMoneyNumber).find((value) => value !== null && value >= 0);
}

function cjOptionName(option) {
  return option?.logisticName
    || option?.option?.enName
    || option?.channel?.enName
    || option?.logisticsName
    || "CJ Dropshipping";
}

function cjDeliveryDays(option) {
  const raw = String(option?.logisticAging || option?.arrivalTime || option?.option?.arrivalTime || "");
  const matches = raw.match(/\d+/g);
  if (!matches || !matches.length) return null;
  return Math.max(...matches.map(Number).filter(Number.isFinite));
}

async function cjRequest(endpoint, body) {
  const token = await getCjAccessToken();

  const response = await fetch(`${CJ_API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": token,
      "User-Agent": "MobilyTechBR"
    },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.result === false || data.success === false) {
    const error = new Error(data.message || `CJ retornou ${response.status}.`);
    error.statusCode = response.status || 502;
    error.code = "CJ_FREIGHT_ERROR";
    error.details = data;
    throw error;
  }
  return data;
}

async function cjGetRequest(endpoint, query = {}) {
  const token = await getCjAccessToken();
  const url = new URL(`${CJ_API_BASE}${endpoint}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "CJ-Access-Token": token,
      "User-Agent": "MobilyTechBR"
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.result === false || data.success === false) {
    const error = new Error(data.message || `CJ retornou ${response.status}.`);
    error.statusCode = response.status || 502;
    error.code = "CJ_REQUEST_ERROR";
    error.details = data;
    throw error;
  }
  return data;
}

async function cjRequestFirst(endpoints, body) {
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      return await cjRequest(endpoint, body);
    } catch (error) {
      lastError = error;
      if (/too many|qps|rate|429/i.test(String(error?.message || error))) {
        throw error;
      }
    }
  }
  throw lastError;
}

async function quoteCjSupplierFreight(products = [], postalCode) {
  const cjProducts = products.filter(isCjProduct);
  if (!cjProducts.length || cjProducts.length !== products.length) return null;

  const productPayload = cjProducts.map(cjProductPayload);
  if (productPayload.some((item) => !item)) return null;

  const rates = cjProducts.map(cjUsdBrlRate).filter((rate) => rate !== null && rate > 0);
  const usdBrlRate = rates[0];
  if (!usdBrlRate) {
    const error = new Error("CJ_USD_BRL_RATE precisa estar configurado antes de cobrar frete CJ em reais.");
    error.statusCode = 409;
    error.code = "CJ_USD_BRL_RATE_REQUIRED";
    throw error;
  }

  const startCountryCode = cjStartCountryCode(cjProducts[0]);
  if (cjProducts.some((product) => cjStartCountryCode(product) !== startCountryCode)) return null;

  const body = {
    startCountryCode,
    endCountryCode: "BR",
    zip: onlyDigits(postalCode),
    products: productPayload
  };

  const data = await cjRequestFirst([
    process.env.CJ_FREIGHT_ENDPOINT || "/api2.0/v1/logistic/freightCalculateTip",
    "/api2.0/v1/logistic/freightCalculate"
  ], body);
  const options = Array.isArray(data.data) ? data.data : [];
  return options
    .map((option) => {
      const priceUsd = cjOptionPriceUsd(option);
      if (priceUsd === null) return null;
      const name = cjOptionName(option);
      return {
        id: `cj:${option.optionId || option.channelId || name}`,
        name,
        company: "CJ Dropshipping",
        provider: "cj-dropshipping",
        price: toMoney(priceUsd * usdBrlRate),
        priceUsd: toMoney(priceUsd),
        usdBrlRate,
        deliveryTime: cjDeliveryDays(option),
        recommended: true,
        raw: {
          provider: "cj-dropshipping",
          cj: option,
          requestId: data.requestId,
          startCountryCode,
          endCountryCode: "BR",
          zip: body.zip,
          usdBrlRate
        }
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.price - b.price);
}

function cjItemFromSupplierItem(item = {}) {
  const cj = item.cj || {};
  const vid = String(cj.vid || item.cjVid || item.cjVariantId || "").trim();
  const sku = String(cj.sku || item.cjSku || "").trim();
  if (!vid && !sku) return null;
  return {
    vid: vid || undefined,
    sku: sku || undefined,
    quantity: Math.max(1, Number(item.quantity || 1) || 1),
    storeLineItemId: compactText(item.productId || item.title || "mobilytech-item", 120),
    storeProductId: compactText(item.productId || "", 64),
    storeProductImg: compactText(item.image || item.pictureUrl || "", 500),
    unitPrice: item.costUsd || cj.costUsd || undefined
  };
}

function normalizeCustomerAddress(customer = {}) {
  const city = customer.city || customer.localidade || "";
  const state = customer.state || customer.uf || customer.province || "";
  const district = customer.district || customer.neighborhood || customer.bairro || "";
  const street = customer.street || customer.address || "";
  const number = customer.number || customer.houseNumber || "";
  const complement = customer.complement || customer.address2 || "";
  return {
    shippingZip: onlyDigits(customer.postalCode || customer.zip || customer.cep),
    shippingCountry: "Brazil",
    shippingCountryCode: "BR",
    shippingProvince: state,
    shippingCity: city,
    shippingCounty: district,
    shippingPhone: onlyDigits(customer.phone || customer.telephone || ""),
    shippingCustomerName: compactText(customer.name || customer.fullName || "", 50),
    shippingAddress: compactText([street, number].filter(Boolean).join(", "), 200),
    shippingAddress2: compactText(complement, 200),
    houseNumber: compactText(number, 20),
    taxId: onlyDigits(customer.taxId || customer.cpf || customer.document || ""),
    email: compactText(customer.email || "", 50)
  };
}

function validateCjOrderCustomer(customer) {
  const required = {
    shippingZip: "CEP",
    shippingProvince: "estado",
    shippingCity: "cidade",
    shippingCustomerName: "nome do cliente",
    shippingAddress: "endereco"
  };
  const missing = Object.entries(required)
    .filter(([key]) => !String(customer[key] || "").trim())
    .map(([, label]) => label);
  if (missing.length) {
    const error = new Error(`Dados do cliente incompletos para preparar pedido CJ: ${missing.join(", ")}.`);
    error.statusCode = 409;
    error.code = "CJ_ORDER_CUSTOMER_REQUIRED";
    throw error;
  }
  if (customer.shippingZip.length !== 8) {
    const error = new Error("CEP do cliente invalido para preparar pedido CJ.");
    error.statusCode = 409;
    error.code = "CJ_ORDER_ZIP_INVALID";
    throw error;
  }
}

function groupSupplierItemsForCj(supplierItems = []) {
  const groups = new Map();
  supplierItems.forEach((item) => {
    const cjItem = cjItemFromSupplierItem(item);
    if (!cjItem) return;
    const logisticName = item.cj?.logisticName || item.freightServiceName || item.shippingServiceName || item.shipping?.serviceName || "";
    const fromCountryCode = String(item.cj?.startCountryCode || item.startCountryCode || "CN").toUpperCase();
    const key = `${fromCountryCode}|${logisticName || "CJPacket"}`;
    if (!groups.has(key)) {
      groups.set(key, {
        fromCountryCode,
        logisticName: logisticName || "CJPacket",
        products: []
      });
    }
    groups.get(key).products.push(cjItem);
  });
  return [...groups.values()];
}

function buildCjOrderPayload({ orderReference, customer, supplierItems = [], payType = 3, sandbox = false }) {
  const normalizedCustomer = normalizeCustomerAddress(customer);
  validateCjOrderCustomer(normalizedCustomer);
  const groups = groupSupplierItemsForCj(supplierItems);
  if (!groups.length) {
    const error = new Error("Nenhum item CJ com SKU/VID valido para preparar pedido.");
    error.statusCode = 409;
    error.code = "CJ_ORDER_ITEMS_REQUIRED";
    throw error;
  }

  return groups.map((group, index) => ({
    ...normalizedCustomer,
    orderNumber: compactText(`${orderReference}-${index + 1}`, 50),
    remark: compactText("Pedido MobilyTech BR semi-automatico: criar sem pagamento automatico; revisar antes de confirmar/pagar.", 500),
    payType,
    isSandbox: sandbox ? 1 : 0,
    logisticName: group.logisticName,
    fromCountryCode: group.fromCountryCode,
    platform: "Api",
    orderFlow: 1,
    shopLogisticsType: 2,
    products: group.products
  }));
}

function shouldCreateCjOrders() {
  const raw = normalizeText(process.env.CJ_SEMI_AUTOMATIC_ORDER_ENABLED || process.env.CJ_CREATE_ORDER_ENABLED || "true");
  return !["0", "false", "nao", "no", "off", "payload-only"].includes(raw);
}

async function createCjSemiAutomaticOrders({ orderReference, customer, supplierItems = [], sandbox = false }) {
  const payloads = buildCjOrderPayload({
    orderReference,
    customer,
    supplierItems,
    payType: 3,
    sandbox
  });

  if (!shouldCreateCjOrders()) {
    return {
      status: "payload-only",
      created: false,
      payloads
    };
  }

  const orders = [];
  for (const payload of payloads) {
    const data = await cjRequest("/api2.0/v1/shopping/order/createOrderV2", payload);
    orders.push({
      orderNumber: payload.orderNumber,
      orderId: data.data?.orderId || "",
      shipmentOrderId: data.data?.shipmentOrderId || "",
      cjPayUrl: data.data?.cjPayUrl || "",
      orderStatus: data.data?.orderStatus || "",
      logisticsMiss: data.data?.logisticsMiss ?? "",
      interceptOrderReasons: data.data?.interceptOrderReasons || [],
      requestId: data.requestId || "",
      raw: data.data || {}
    });
  }

  return {
    status: "created-unpaid",
    created: true,
    orders,
    payloads
  };
}

module.exports = {
  buildCjOrderPayload,
  cjAccessToken,
  cjApiKey,
  cjRequest,
  createCjSemiAutomaticOrders,
  cjGetRequest,
  getCjAccessToken,
  cjVariantId,
  isCjProduct,
  quoteCjSupplierFreight
};
