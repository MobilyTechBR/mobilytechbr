#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");
const { cjGetRequest } = require("../lib/cj-dropshipping");

const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_FILE = path.join(ROOT, "data", "products.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function arg(name, fallback = "") {
  const flag = `--${name}=`;
  const found = process.argv.find((item) => item.startsWith(flag));
  return found ? found.slice(flag.length) : fallback;
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");
}

function variantList(detail = {}) {
  return [
    detail.variants,
    detail.variantList,
    detail.productVariantList,
    detail.stanProducts,
    detail.productSkuList,
    detail.productVariant
  ].find(Array.isArray) || [];
}

function variantPriceUsd(variant = {}, product = {}) {
  return firstValue(
    parseMoneyNumber(variant.sellPrice),
    parseMoneyNumber(variant.variantSellPrice),
    parseMoneyNumber(variant.nowPrice),
    parseMoneyNumber(product.costUsd)
  );
}

function salePrice(costBrl) {
  let margin = 0.45;
  if (costBrl >= 300) margin = 0.28;
  else if (costBrl >= 120) margin = 0.34;
  else if (costBrl >= 50) margin = 0.38;
  const raw = costBrl * (1 + margin + 0.08);
  const rounded = raw < 20 ? Math.ceil(raw * 10) / 10 : Math.ceil(raw / 5) * 5 - 0.1;
  return toMoney(Math.max(8.9, rounded));
}

const TRANSLATIONS = new Map([
  ["black", "preto"],
  ["white", "branco"],
  ["blue", "azul"],
  ["red", "vermelho"],
  ["green", "verde"],
  ["pink", "rosa"],
  ["yellow", "amarelo"],
  ["purple", "roxo"],
  ["gray", "cinza"],
  ["grey", "cinza"],
  ["silver", "prata"],
  ["gold", "dourado"],
  ["orange", "laranja"],
  ["eu", "plug EU"],
  ["us", "plug US"],
  ["uk", "plug UK"]
]);

function humanVariantLabel(value = "") {
  const parts = String(value || "")
    .replace(/[_|/]+/g, "-")
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) return "Variacao";
  return parts.map((part) => {
    const lower = part.toLowerCase();
    if (TRANSLATIONS.has(lower)) return TRANSLATIONS.get(lower);
    return part
      .replace(/\bstyle\b/ig, "modelo")
      .replace(/\bcolor\b/ig, "cor")
      .replace(/\bplug\b/ig, "plug")
      .replace(/\s+/g, " ")
      .trim();
  }).join(" / ");
}

function normalizeVariant(product, detail, variant) {
  const vid = firstValue(variant.vid, variant.variantId, variant.id);
  const sku = firstValue(variant.sku, variant.variantSku);
  if (!vid && !sku) return null;

  const usdBrlRate = parseMoneyNumber(product.cj?.usdBrlRate || product.shipping?.cjUsdBrlRate) || 5.45;
  const priceUsd = variantPriceUsd(variant, product);
  if (!priceUsd || priceUsd <= 0) return null;

  const costPrice = toMoney(priceUsd * usdBrlRate);
  const price = salePrice(costPrice);
  const label = humanVariantLabel(firstValue(variant.variantKey, variant.variantName, variant.variantNameEn, sku, vid));
  const basePrice = parseMoneyNumber(product.price) || 0;
  const defaultVid = String(product.cj?.vid || product.cjVariantId || product.cjVid || "");

  return {
    id: String(vid || sku),
    active: true,
    default: defaultVid && String(vid) === defaultVid,
    label,
    optionSummary: label,
    price,
    priceDelta: toMoney(price - basePrice),
    costPrice,
    costUsd: toMoney(priceUsd),
    image: firstValue(variant.variantImage, variant.img, product.image, product.cutout),
    sku,
    vid,
    variantKey: firstValue(variant.variantKey, variant.variantName, variant.variantNameEn),
    variantNameEn: firstValue(variant.variantNameEn, variant.variantName),
    cj: {
      pid: product.cj?.pid || detail.pid || product.id,
      vid,
      sku,
      productSku: firstValue(detail.productSku, product.cj?.productSku),
      variantKey: firstValue(variant.variantKey, variant.variantName, variant.variantNameEn),
      variantNameEn: firstValue(variant.variantNameEn, variant.variantName),
      productNameEn: firstValue(detail.productNameEn, detail.nameEn, product.cj?.productNameEn),
      startCountryCode: product.cj?.startCountryCode || product.shipping?.startCountryCode || "CN",
      usdBrlRate
    }
  };
}

async function main() {
  const delayMs = Number(arg("delay-ms", "180"));
  const maxPerProduct = Number(arg("max-per-product", "48"));
  const force = process.argv.includes("--force");
  const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, "utf8"));
  let enriched = 0;
  let variantsTotal = 0;
  const errors = [];

  for (const product of products) {
    if (product.category !== "dropshipping" || !product.cj?.pid) continue;
    if (!force && Array.isArray(product.variants) && product.variants.length > 1) continue;
    try {
      await sleep(delayMs);
      const response = await cjGetRequest("/api2.0/v1/product/query", { pid: product.cj.pid });
      const detail = response.data || {};
      const seen = new Set();
      const variants = variantList(detail)
        .map((variant) => normalizeVariant(product, detail, variant))
        .filter(Boolean)
        .filter((variant) => {
          const key = variant.id || variant.sku;
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .sort((a, b) => {
          if (a.default !== b.default) return a.default ? -1 : 1;
          return Number(a.price || 0) - Number(b.price || 0);
        })
        .slice(0, Math.max(1, maxPerProduct));

      if (variants.length > 1) {
        product.variants = variants;
        enriched += 1;
        variantsTotal += variants.length;
      } else {
        delete product.variants;
      }
    } catch (error) {
      errors.push({
        id: product.id,
        code: error.code || "",
        message: error.message || String(error)
      });
    }
  }

  await fs.writeFile(PRODUCTS_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ enriched, variantsTotal, errors }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
