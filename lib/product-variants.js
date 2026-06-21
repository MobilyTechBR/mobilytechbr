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

function compactText(value, maxLength = 220) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  if (!clean || clean.length <= maxLength) return clean;
  return `${clean.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function variantList(product = {}) {
  return Array.isArray(product.variants)
    ? product.variants.filter((variant) => variant && variant.active !== false)
    : [];
}

function variantId(variant = {}) {
  return String(
    variant.id
    || variant.variantId
    || variant.vid
    || variant.cj?.vid
    || variant.sku
    || variant.cj?.sku
    || ""
  ).trim();
}

function variantMatches(variant = {}, selectedId = "") {
  const target = String(selectedId || "").trim();
  if (!target) return false;
  return [
    variant.id,
    variant.variantId,
    variant.vid,
    variant.cj?.vid,
    variant.sku,
    variant.cj?.sku
  ].some((value) => String(value || "").trim() === target);
}

function selectedVariantForProduct(product = {}, selection = {}) {
  const variants = variantList(product);
  if (!variants.length) return null;

  const rawSelected = selection.selectedVariant || selection.variant || {};
  const selectedId = String(
    selection.selectedVariantId
    || selection.variantId
    || rawSelected.id
    || rawSelected.variantId
    || rawSelected.vid
    || rawSelected.cj?.vid
    || rawSelected.sku
    || rawSelected.cj?.sku
    || ""
  ).trim();

  if (selectedId) {
    const found = variants.find((variant) => variantMatches(variant, selectedId));
    if (!found) {
      const error = new Error("Variacao do produto nao encontrada ou indisponivel.");
      error.statusCode = 400;
      error.code = "PRODUCT_VARIANT_NOT_FOUND";
      throw error;
    }
    return found;
  }

  const productVid = String(product.cj?.vid || product.cjVariantId || product.cjVid || "").trim();
  return variants.find((variant) => variant.default === true)
    || variants.find((variant) => productVid && variantMatches(variant, productVid))
    || variants[0];
}

function variantPrice(product = {}, variant = {}) {
  const basePrice = parseMoneyNumber(product.price) || 0;
  const directPrice = parseMoneyNumber(variant.price);
  if (directPrice !== null && directPrice > 0) return toMoney(directPrice);
  const delta = parseMoneyNumber(variant.priceDelta);
  if (delta !== null) return toMoney(basePrice + delta);
  return toMoney(basePrice);
}

function variantCost(product = {}, variant = {}) {
  const directCost = parseMoneyNumber(variant.costPrice || variant.supplierCost);
  if (directCost !== null && directCost > 0) return toMoney(directCost);
  const baseCost = parseMoneyNumber(product.costPrice || product.supplierCost);
  return baseCost !== null ? toMoney(baseCost) : product.costPrice;
}

function selectedVariantSummary(product = {}, variant = {}) {
  if (!variant) return null;
  const price = variantPrice(product, variant);
  const basePrice = parseMoneyNumber(product.price) || 0;
  return {
    id: variantId(variant),
    label: compactText(variant.label || variant.optionSummary || variant.variantKey || variant.name || "Variacao selecionada", 120),
    price,
    priceDelta: toMoney(price - basePrice),
    costPrice: variantCost(product, variant),
    costUsd: parseMoneyNumber(variant.costUsd) ?? product.costUsd,
    image: variant.image || variant.variantImage || "",
    sku: variant.sku || variant.cj?.sku || "",
    vid: variant.vid || variant.cj?.vid || "",
    cj: {
      ...(variant.cj || {}),
      vid: variant.vid || variant.cj?.vid || "",
      sku: variant.sku || variant.cj?.sku || "",
      variantKey: variant.variantKey || variant.cj?.variantKey || "",
      variantNameEn: variant.variantNameEn || variant.cj?.variantNameEn || ""
    }
  };
}

function productTitleWithVariant(product = {}, selectedVariant = {}) {
  const title = compactText(product.title || "Produto", 180);
  const label = compactText(selectedVariant.label || "", 80);
  if (!label) return title;
  const base = title.replace(/\s+-\s+[^-]{2,80}$/u, "").trim() || title;
  return `${base} - ${label}`;
}

function productWithSelectedVariant(product = {}, selection = {}) {
  const variant = selectedVariantForProduct(product, selection);
  if (!variant) return product;

  const selectedVariant = selectedVariantSummary(product, variant);
  const image = selectedVariant.image || product.image || product.cutout || "";
  const title = productTitleWithVariant(product, selectedVariant);

  return {
    ...product,
    title,
    price: selectedVariant.price,
    costPrice: selectedVariant.costPrice,
    costUsd: selectedVariant.costUsd,
    image,
    cutout: image || product.cutout,
    selectedVariant,
    cj: {
      ...(product.cj || {}),
      ...(selectedVariant.cj || {})
    }
  };
}

module.exports = {
  productWithSelectedVariant,
  selectedVariantForProduct,
  selectedVariantSummary,
  variantId,
  variantList
};
