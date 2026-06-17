const CJ_API_BASE = process.env.CJ_API_BASE || "https://developers.cjdropshipping.com";

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

function cjAccessToken() {
  return process.env.CJ_ACCESS_TOKEN
    || process.env.CJ_API_TOKEN
    || process.env.CJDROPSHIPPING_ACCESS_TOKEN
    || "";
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
  const token = cjAccessToken();
  if (!token) {
    const error = new Error("CJ_ACCESS_TOKEN ainda nao configurado.");
    error.statusCode = 501;
    error.code = "CJ_ACCESS_TOKEN_REQUIRED";
    throw error;
  }

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

  const data = await cjRequest("/api2.0/v1/logistic/freightCalculate", body);
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

module.exports = {
  cjAccessToken,
  cjVariantId,
  isCjProduct,
  quoteCjSupplierFreight
};
