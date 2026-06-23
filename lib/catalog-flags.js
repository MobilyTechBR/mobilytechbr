const fs = require("fs/promises");
const path = require("path");

const SITE_CONTENT_FILE = path.join(process.cwd(), "data", "site-content.json");

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

async function loadSiteContent() {
  try {
    const content = JSON.parse(await fs.readFile(SITE_CONTENT_FILE, "utf8"));
    return content && typeof content === "object" && !Array.isArray(content) ? content : {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

function featureEnabled(siteContent, group, key, fallback = true) {
  const flags = siteContent && typeof siteContent === "object" ? siteContent.featureFlags || {} : {};
  const section = flags && typeof flags === "object" ? flags[group] || {} : {};
  if (section && typeof section === "object" && Object.prototype.hasOwnProperty.call(section, key)) {
    return section[key] === true;
  }
  return fallback;
}

function dropshippingCatalogEnabled(siteContent) {
  return featureEnabled(siteContent, "catalog", "dropshippingProducts", true);
}

function physicalCatalogEnabled(siteContent) {
  return featureEnabled(siteContent, "catalog", "physicalProducts", false);
}

function isDropshippingProduct(product) {
  const category = normalizeText(product?.category || product?.type || "");
  const mode = normalizeText([
    product?.purchaseMode,
    product?.fulfillmentMode,
    product?.fulfillmentType,
    product?.shipping?.mode
  ].join(" "));
  return Boolean(
    category === "dropshipping" ||
    category === "sob-encomenda" ||
    category === "sob encomenda" ||
    category === "encomenda" ||
    product?.madeToOrder === true ||
    product?.manualFulfillment === true ||
    mode.includes("dropshipping") ||
    mode.includes("supplier") ||
    mode.includes("fornecedor")
  );
}

function assertCatalogAvailabilityForProducts(products = [], siteContent = {}) {
  const list = Array.isArray(products) ? products.filter(Boolean) : [];
  const dropshippingEnabled = dropshippingCatalogEnabled(siteContent);
  const physicalEnabled = physicalCatalogEnabled(siteContent);
  const blockedDropshipping = list.find(isDropshippingProduct);
  if (blockedDropshipping && !dropshippingEnabled) {
    const error = new Error("Produtos sob encomenda estao temporariamente indisponiveis para checkout.");
    error.statusCode = 409;
    error.code = "CATALOG_DROPSHIPPING_DISABLED";
    throw error;
  }
  const blockedPhysical = list.find((product) => !isDropshippingProduct(product));
  if (blockedPhysical && !physicalEnabled) {
    const error = new Error("Produtos fisicos proprios estao temporariamente indisponiveis para checkout.");
    error.statusCode = 409;
    error.code = "CATALOG_PHYSICAL_DISABLED";
    throw error;
  }
}

module.exports = {
  assertCatalogAvailabilityForProducts,
  dropshippingCatalogEnabled,
  featureEnabled,
  isDropshippingProduct,
  loadSiteContent,
  physicalCatalogEnabled
};
