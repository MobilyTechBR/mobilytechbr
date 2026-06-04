const fs = require("fs/promises");
const path = require("path");

const SWAPS_FILE = path.join(process.cwd(), "data", "swaps.json");

const SWAP_CATEGORIES = {
  processor: { detail: "Processador", label: "Processador" },
  memory: { detail: "Memoria", label: "Memoria" },
  gpu: { detail: "Placa de video", label: "Placa de video" },
  powerSupply: { detail: "Fonte", label: "Fonte" },
  storage: { detail: "Armazenamento", label: "Armazenamento" }
};

function parsePriceBRL(value) {
  if (typeof value === "number") return value;
  const raw = String(value || "").replace(/[^\d,.-]/g, "");
  if (!raw) return NaN;
  if (raw.includes(",")) return Number(raw.replace(/\./g, "").replace(",", "."));
  const parts = raw.split(".");
  if (parts.length > 1 && parts[parts.length - 1].length === 3) return Number(parts.join(""));
  return Number(raw);
}

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function listIncludesAny(value, list = []) {
  const text = normalizeText(value);
  const terms = Array.isArray(list) ? list.filter(Boolean) : [];
  if (!terms.length) return false;
  return terms.some((term) => text.includes(normalizeText(term)));
}

async function loadGlobalSwaps() {
  try {
    const swaps = JSON.parse(await fs.readFile(SWAPS_FILE, "utf8"));
    return Array.isArray(swaps) ? swaps : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function productCategory(product) {
  return String(product?.category || product?.type || "pc").toLowerCase();
}

function productDetails(product) {
  return {
    Processador: product.processor || product.specs?.processor || product.details?.processor,
    Memoria: product.memory || product.specs?.memory || product.details?.memory,
    "Placa de video": product.gpu || product.specs?.gpu || product.details?.gpu,
    Fonte: product.powerSupply || product.specs?.powerSupply || product.details?.powerSupply,
    Armazenamento: product.storage || product.specs?.storage || product.details?.storage,
    Marca: product.brand || product.specs?.brand || product.details?.brand,
    Modelo: product.model || product.specs?.model || product.details?.model,
    Capacidade: product.capacity || product.specs?.capacity || product.details?.capacity,
    Tipo: product.kind || product.specs?.kind || product.details?.kind,
    Formato: product.format || product.specs?.format || product.details?.format,
    Interface: product.interface || product.specs?.interface || product.details?.interface,
    Potencia: product.wattage || product.specs?.wattage || product.details?.wattage,
    Certificacao: product.certification || product.specs?.certification || product.details?.certification,
    Conectores: product.connectors || product.specs?.connectors || product.details?.connectors
  };
}

function normalizeSwapOption(option, fallbackTarget = "") {
  const label = option?.label || option?.name || "";
  const price = parsePriceBRL(option?.price);
  const target = option?.target || fallbackTarget;
  if (!option || option.active === false || !label || !SWAP_CATEGORIES[target] || !Number.isFinite(price)) {
    return null;
  }
  return { ...option, label, price, target };
}

function swapMatchesProduct(product, option) {
  if (productCategory(product) !== "pc" && product.allowGlobalSwaps !== true) return false;
  const target = SWAP_CATEGORIES[option.target];
  const detailValue = productDetails(product)[target.detail] || "";
  if (!detailValue) return false;
  const when = Array.isArray(option.whenContains) ? option.whenContains.filter(Boolean) : [];
  const exclude = Array.isArray(option.excludeContains) ? option.excludeContains.filter(Boolean) : [];
  if (when.length && !listIncludesAny(detailValue, when)) return false;
  if (exclude.length && listIncludesAny(detailValue, exclude)) return false;
  return true;
}

function productSwapGroups(product, globalSwaps = []) {
  const source = product.swaps || {};
  const globalOptions = Array.isArray(globalSwaps) ? globalSwaps : [];
  const productOptions = Object.entries(source).flatMap(([target, options]) => (
    Array.isArray(options) ? options.map((option) => ({ ...option, target })) : []
  ));
  const activeOptions = [...globalOptions, ...productOptions]
    .map((option) => normalizeSwapOption(option))
    .filter((option) => option && swapMatchesProduct(product, option));

  return Object.fromEntries(Object.entries(SWAP_CATEGORIES).map(([target, category]) => [
    target,
    {
      ...category,
      target,
      options: activeOptions.filter((option) => option.target === target)
    }
  ]));
}

function normalizeSelectedSwaps(product, selectedSwaps, globalSwaps = []) {
  if (!Array.isArray(selectedSwaps) || selectedSwaps.length === 0) return [];

  const groups = productSwapGroups(product, globalSwaps);
  const usedTargets = new Set();
  return selectedSwaps.map((selection) => {
    const target = String(selection?.target || "");
    const index = Number(selection?.index);
    if (!SWAP_CATEGORIES[target]) {
      const error = new Error("Categoria de troca invalida.");
      error.statusCode = 400;
      throw error;
    }
    if (usedTargets.has(target)) {
      const error = new Error("Apenas uma troca por categoria pode ser selecionada.");
      error.statusCode = 400;
      throw error;
    }
    usedTargets.add(target);
    if (!Number.isInteger(index) || index < 0 || index >= groups[target].options.length) {
      const error = new Error("Troca nao encontrada ou indisponivel.");
      error.statusCode = 400;
      throw error;
    }

    const option = groups[target].options[index];
    return {
      target,
      targetLabel: groups[target].label,
      index,
      label: option.label,
      price: option.price
    };
  });
}

module.exports = {
  loadGlobalSwaps,
  normalizeSelectedSwaps,
  productSwapGroups
};
