const DEFAULT_USD_BRL_RATE = 5.45;
const DEFAULT_IMPORT_DUTY_RATE = 0.60;
const DEFAULT_ICMS_RATE = 0.20;

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

function itemQuantity(item) {
  return Math.max(1, parseMoneyNumber(item?.quantity ?? item?.qty ?? 1) || 1);
}

function itemSubtotal(item) {
  const unitPrice = parseMoneyNumber(item?.unitPrice ?? item?.product?.price) || 0;
  const addonsTotal = (item?.addons || []).reduce((sum, addon) => sum + (parseMoneyNumber(addon?.price) || 0), 0);
  const swapsTotal = (item?.swaps || []).reduce((sum, swap) => sum + (parseMoneyNumber(swap?.price) || 0), 0);
  return toMoney((unitPrice + addonsTotal + swapsTotal) * itemQuantity(item));
}

function isSupplierProduct(product) {
  const text = normalizeText([
    product?.category,
    product?.type,
    product?.purchaseMode,
    product?.fulfillmentMode,
    product?.shipping?.mode,
    product?.shippingMode
  ].join(" "));
  return Boolean(
    product?.manualFulfillment ||
    text.includes("dropshipping") ||
    text.includes("supplier") ||
    text.includes("fornecedor")
  );
}

function isInternationalSupplierProduct(product) {
  if (!isSupplierProduct(product)) return false;
  const shipping = product?.shipping || {};
  const text = normalizeText([
    shipping.region,
    shipping.originCountry,
    shipping.startCountryCode,
    product?.supplierRegion,
    product?.originRegion,
    product?.publicOriginNote,
    product?.supplierPlatform,
    product?.source
  ].join(" "));
  if (text.includes("brasil") || text === "br") return false;
  return Boolean(
    text.includes("intl") ||
    text.includes("internacional") ||
    text.includes("exterior") ||
    text.includes("china") ||
    text.includes("cn") ||
    normalizeText(product?.source).includes("cj")
  );
}

function supplierShippingPrice(normalizedShipping) {
  const supplierPrice = parseMoneyNumber(normalizedShipping?.supplierPrice);
  if (supplierPrice !== null) return supplierPrice;
  const totalPrice = parseMoneyNumber(normalizedShipping?.price);
  return totalPrice !== null ? totalPrice : 0;
}

function productUsdBrlRate(product) {
  return (
    parseMoneyNumber(product?.shipping?.cjUsdBrlRate) ||
    parseMoneyNumber(product?.cj?.usdBrlRate) ||
    DEFAULT_USD_BRL_RATE
  );
}

function estimateImportTaxes(checkoutItems = [], normalizedShipping = null, options = {}) {
  const taxableItems = checkoutItems.filter((item) => isInternationalSupplierProduct(item?.product || item));
  if (!taxableItems.length) {
    return {
      applies: false,
      pending: false,
      total: 0,
      importDuty: 0,
      icms: 0,
      customsValue: 0,
      supplierSubtotal: 0,
      supplierShipping: 0,
      regime: "not_applicable"
    };
  }

  const supplierSubtotal = toMoney(taxableItems.reduce((sum, item) => sum + itemSubtotal(item), 0));
  const supplierShipping = toMoney(supplierShippingPrice(normalizedShipping));
  const hasShippingSelection = Boolean(normalizedShipping && (normalizedShipping.serviceId || normalizedShipping.provider));

  if (!hasShippingSelection) {
    return {
      applies: true,
      pending: true,
      total: 0,
      importDuty: 0,
      icms: 0,
      customsValue: supplierSubtotal,
      supplierSubtotal,
      supplierShipping: 0,
      regime: "non_prc_estimate_pending_shipping"
    };
  }

  const customsValue = toMoney(supplierSubtotal + supplierShipping);
  const importDutyRate = parseMoneyNumber(options.importDutyRate ?? process.env.IMPORT_TAX_IMPORT_DUTY_RATE) ?? DEFAULT_IMPORT_DUTY_RATE;
  const icmsRate = parseMoneyNumber(options.icmsRate ?? process.env.IMPORT_TAX_ICMS_RATE) ?? DEFAULT_ICMS_RATE;
  const importDuty = toMoney(customsValue * importDutyRate);
  const icms = toMoney(((customsValue + importDuty) / (1 - icmsRate)) * icmsRate);
  const usdBrlRate = productUsdBrlRate(taxableItems[0]?.product || taxableItems[0]);

  return {
    applies: true,
    pending: false,
    total: toMoney(importDuty + icms),
    importDuty,
    icms,
    customsValue,
    supplierSubtotal,
    supplierShipping,
    importDutyRate,
    icmsRate,
    usdBrlRate,
    customsValueUsd: usdBrlRate > 0 ? toMoney(customsValue / usdBrlRate) : 0,
    regime: "non_prc_conservative_estimate"
  };
}

module.exports = {
  estimateImportTaxes,
  isInternationalSupplierProduct,
  isSupplierProduct
};
