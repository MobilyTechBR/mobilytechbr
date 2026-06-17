const fs = require("fs/promises");
const path = require("path");

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");
const ADDONS_FILE = path.join(process.cwd(), "data", "addons.json");
const ABACATE_PIX_API = "https://api.abacatepay.com/v2/transparents/create";
const { quoteMelhorEnvio } = require("./shipping-quote");
const {
  formatFulfillmentItems,
  resolveShippingSelection,
  splitFulfillmentProducts,
  validateUniquePhysicalCheckoutItems
} = require("../lib/fulfillment-shipping");
const { abacatePixGrossUp } = require("../lib/payment-fees");
const { loadGlobalSwaps, normalizeSelectedSwaps } = require("../lib/product-swaps");

const ADDON_CATEGORIES = {
  storage: "Armazenamento",
  peripherals: "Kit perifericos"
};

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body);

  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
  }
  return raw ? JSON.parse(raw) : {};
}

function parsePriceBRL(value) {
  if (typeof value === "number") return value;
  const raw = String(value || "").replace(/[^\d,.-]/g, "");
  if (!raw) return NaN;

  if (raw.includes(",")) {
    return Number(raw.replace(/\./g, "").replace(",", "."));
  }

  const parts = raw.split(".");
  if (parts.length > 1 && parts[parts.length - 1].length === 3) {
    return Number(parts.join(""));
  }

  return Number(raw);
}

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function categoryMinimumWeight(product) {
  const category = normalizeText(product?.category || product?.type || product?.title || "");
  if (category.includes("ssd")) return 1;
  if (category.includes("fonte")) return 3.5;
  return null;
}

function packageWeight(product, shipping) {
  const explicitWeight = parsePriceBRL(shipping.weightKg);
  const minimumWeight = categoryMinimumWeight(product);
  if (minimumWeight) {
    return Math.max(Number.isFinite(explicitWeight) && explicitWeight > 0 ? explicitWeight : minimumWeight, minimumWeight);
  }
  const defaultWeight = parsePriceBRL(process.env.DEFAULT_PACKAGE_WEIGHT_KG);
  return Number.isFinite(explicitWeight) && explicitWeight > 0
    ? explicitWeight
    : (Number.isFinite(defaultWeight) && defaultWeight > 0 ? defaultWeight : 0);
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function abacateCustomerFromShipping(shipping) {
  const customer = shipping?.customer || {};
  const taxId = onlyDigits(customer.taxId || customer.document || customer.cpfCnpj);
  const name = String(customer.name || "").trim();
  const email = String(customer.email || "").trim();
  const cellphone = String(customer.phone || customer.cellphone || "").trim();
  if (!name || !taxId || !email || !cellphone) return undefined;

  return {
    name,
    taxId,
    email,
    cellphone
  };
}

async function loadProducts() {
  const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, "utf8"));
  return Array.isArray(products) ? products : [];
}

async function loadGlobalAddons() {
  try {
    const addons = JSON.parse(await fs.readFile(ADDONS_FILE, "utf8"));
    return Array.isArray(addons) ? addons : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function normalizeAddonOption(option) {
  const label = option?.label || option?.name || "";
  const price = parsePriceBRL(option?.price);
  if (!option || option.active === false || !label || !Number.isFinite(price) || price <= 0) {
    return null;
  }
  return { ...option, label, price };
}

function productCategory(product) {
  return String(product?.category || product?.type || "").toLowerCase();
}

function productAddonGroups(product, globalAddons = []) {
  if (productCategory(product) !== "pc") {
    return Object.fromEntries(Object.keys(ADDON_CATEGORIES).map((category) => [category, []]));
  }
  const source = product.addons || product.options || {};
  return Object.fromEntries(Object.keys(ADDON_CATEGORIES).map((category) => {
    const globalOptions = Array.isArray(globalAddons)
      ? globalAddons.filter((option) => option?.category === category)
      : [];
    const productOptions = Array.isArray(source[category]) ? source[category] : [];
    const activeOptions = [...globalOptions, ...productOptions]
      .map(normalizeAddonOption)
      .filter(Boolean);
    return [category, activeOptions];
  }));
}

function normalizeSelectedAddons(product, selectedAddons, globalAddons = []) {
  if (!Array.isArray(selectedAddons) || selectedAddons.length === 0) return [];
  if (productCategory(product) !== "pc") return [];

  const groups = productAddonGroups(product, globalAddons);
  const usedOptions = new Set();
  return selectedAddons.map((selection) => {
    const category = String(selection?.category || "");
    const index = Number(selection?.index);
    if (!ADDON_CATEGORIES[category]) {
      const error = new Error("Categoria de opcional invalida.");
      error.statusCode = 400;
      throw error;
    }

    const optionKey = `${category}:${index}`;
    if (usedOptions.has(optionKey)) {
      const error = new Error("Opcional repetido no checkout.");
      error.statusCode = 400;
      throw error;
    }
    usedOptions.add(optionKey);

    if (!Number.isInteger(index) || index < 0 || index >= groups[category].length) {
      const error = new Error("Opcional nao encontrado ou indisponivel.");
      error.statusCode = 400;
      throw error;
    }

    const option = groups[category][index];
    return {
      category,
      categoryLabel: ADDON_CATEGORIES[category],
      index,
      label: option.label,
      price: option.price
    };
  });
}

function normalizeCheckoutItems(products, globalAddons, globalSwaps, payload) {
  const rawCartItems = Array.isArray(payload.cartItems) ? payload.cartItems : [];
  const requestedItems = rawCartItems.length
    ? rawCartItems
    : [{ productId: payload.productId, selectedAddons: payload.selectedAddons, selectedSwaps: payload.selectedSwaps }];

  if (!requestedItems.length || !requestedItems[0]?.productId) {
    const error = new Error("Produto nao informado.");
    error.statusCode = 400;
    throw error;
  }

  return requestedItems.map((item) => {
    const productId = String(item?.productId || "");
    const product = products.find((entry) => entry.id === productId && entry.active !== false);
    if (!product) {
      const error = new Error("Produto nao encontrado ou inativo.");
      error.statusCode = 404;
      throw error;
    }

    const unitPrice = parsePriceBRL(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      const error = new Error("Preco do produto invalido.");
      error.statusCode = 400;
      throw error;
    }

    const rawQuantity = Number(item?.quantity || item?.qty || 1);
    const quantity = Number.isFinite(rawQuantity) ? Math.max(1, Math.floor(rawQuantity)) : 1;

    return {
      product,
      unitPrice,
      quantity,
      addons: normalizeSelectedAddons(product, item.selectedAddons, globalAddons),
      swaps: normalizeSelectedSwaps(product, item.selectedSwaps, globalSwaps)
    };
  });
}

function aggregateShippingProduct(products) {
  const packages = products.map((product) => {
    const shipping = product.shipping || {};
    return {
      weight: packageWeight(product, shipping),
      height: parsePriceBRL(shipping.heightCm) || parsePriceBRL(process.env.DEFAULT_PACKAGE_HEIGHT_CM) || 0,
      width: parsePriceBRL(shipping.widthCm) || parsePriceBRL(process.env.DEFAULT_PACKAGE_WIDTH_CM) || 0,
      length: parsePriceBRL(shipping.lengthCm) || parsePriceBRL(process.env.DEFAULT_PACKAGE_LENGTH_CM) || 0,
      insuranceValue: parsePriceBRL(shipping.insuranceValue) || parsePriceBRL(product.price) || 1
    };
  });

  return {
    id: "mobilytech-cart",
    title: "Carrinho MobilyTech BR",
    price: packages.reduce((sum, item) => sum + item.insuranceValue, 0) || 1,
    shipping: {
      weightKg: packages.reduce((sum, item) => sum + item.weight, 0) || null,
      heightCm: Math.max(...packages.map((item) => item.height), 0) || null,
      widthCm: Math.max(...packages.map((item) => item.width), 0) || null,
      lengthCm: packages.reduce((sum, item) => sum + item.length, 0) || null,
      insuranceValue: packages.reduce((sum, item) => sum + item.insuranceValue, 0) || 1
    }
  };
}

async function normalizeShipping(products, shipping) {
  return resolveShippingSelection(products, shipping, {
    quoteMelhorEnvio,
    aggregateShippingProduct
  });
}

function totalFromCheckoutItems(checkoutItems, normalizedShipping) {
  const productsTotal = checkoutItems.reduce((sum, item) => {
    const addonsTotal = item.addons.reduce((addonSum, addon) => addonSum + addon.price, 0);
    const swapsTotal = item.swaps.reduce((swapSum, swap) => swapSum + swap.price, 0);
    return sum + ((item.unitPrice + addonsTotal + swapsTotal) * item.quantity);
  }, 0);
  return productsTotal + (normalizedShipping ? normalizedShipping.price : 0);
}

function toCents(value) {
  return Math.round(Number(value || 0) * 100);
}

function buildDescription(checkoutItems) {
  if (checkoutItems.length === 1) {
    return String(checkoutItems[0].product.title || "Pedido MobilyTech BR").slice(0, 37);
  }
  return "Carrinho MobilyTech BR";
}

function normalizeApiKey(value) {
  return String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

module.exports = async function createAbacatePix(request, response) {
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Metodo nao permitido." });
    return;
  }

  const apiKey = normalizeApiKey(process.env.ABACATE_PAY_API_KEY || process.env.ABACATEPAY_API_KEY || process.env.ABACATE_PAY_TOKEN);
  if (!apiKey) {
    sendJson(response, 500, { error: "ABACATE_PAY_API_KEY nao configurado na Vercel." });
    return;
  }

  try {
    const payload = await readJsonBody(request);
    const { shipping } = payload;
    const [products, globalAddons, globalSwaps] = await Promise.all([
      loadProducts(),
      loadGlobalAddons(),
      loadGlobalSwaps()
    ]);
    const checkoutItems = normalizeCheckoutItems(products, globalAddons, globalSwaps, payload);
    validateUniquePhysicalCheckoutItems(checkoutItems);
    const checkoutProducts = checkoutItems.map((item) => ({ ...item.product, quantity: item.quantity }));
    const normalizedShipping = await normalizeShipping(checkoutProducts, shipping);
    const fulfillmentSplit = splitFulfillmentProducts(checkoutProducts);
    const manualFulfillmentRequired = Boolean(fulfillmentSplit.supplier.length);
    const manualFulfillmentItems = manualFulfillmentRequired
      ? (normalizedShipping?.supplierItems || fulfillmentSplit.supplier.map((product) => ({ productId: product.id, title: product.title })))
      : [];
    const total = totalFromCheckoutItems(checkoutItems, normalizedShipping);
    const abacateFee = abacatePixGrossUp(total).fee;
    const finalTotal = total + abacateFee;
    const amount = toCents(finalTotal);

    if (!Number.isInteger(amount) || amount <= 0) {
      sendJson(response, 400, { error: "Valor do pedido invalido." });
      return;
    }

    const externalId = `mobilytech-${Date.now()}`;
    const selectedAddons = checkoutItems.flatMap((item) => item.addons.map((addon) => `${item.product.id}:${addon.category}:${addon.label}`));
    const selectedSwaps = checkoutItems.flatMap((item) => item.swaps.map((swap) => `${item.product.id}:${swap.target}:${swap.label}`));
    const pixPayload = {
      method: "PIX",
      data: {
        amount,
        externalId,
        expiresIn: Number(process.env.ABACATE_PAY_PIX_EXPIRES_IN_SECONDS || 3600),
        description: buildDescription(checkoutItems),
        customer: abacateCustomerFromShipping(normalizedShipping),
        metadata: {
          externalId,
          checkoutType: checkoutItems.length > 1 ? "cart" : "single_product",
          productIds: checkoutItems.map((item) => item.product.id).join("; "),
          productQuantities: checkoutItems.map((item) => `${item.product.id}:${item.quantity}`).join("; "),
          productTitles: checkoutItems.map((item) => item.product.title).join("; "),
          selectedAddons: selectedAddons.join("; "),
          selectedSwaps: selectedSwaps.join("; "),
          shippingRequested: normalizedShipping ? "true" : "false",
          shippingProvider: normalizedShipping?.provider || "",
          shippingServiceId: normalizedShipping?.serviceId || "",
          shippingServiceName: normalizedShipping?.serviceName || "",
          shippingCarrier: normalizedShipping?.carrier || "",
          shippingPrice: normalizedShipping ? String(normalizedShipping.price) : "",
          shippingPhysicalServiceId: normalizedShipping?.physicalServiceId || "",
          shippingPhysicalCarrier: normalizedShipping?.physicalCarrier || "",
          shippingPhysicalServiceName: normalizedShipping?.physicalServiceName || "",
          shippingPhysicalPrice: normalizedShipping?.physicalPrice !== undefined ? String(normalizedShipping.physicalPrice) : "",
          shippingSupplierPrice: normalizedShipping?.supplierPrice !== undefined ? String(normalizedShipping.supplierPrice) : "",
          manualFulfillmentRequired: manualFulfillmentRequired ? "true" : "false",
          manualFulfillmentProductIds: fulfillmentSplit.supplier.map((product) => product.id).join("; "),
          manualFulfillmentItems: formatFulfillmentItems(manualFulfillmentItems),
          abacateFeeAdjustment: String(abacateFee),
          baseTotal: String(total),
          finalTotal: String(finalTotal),
          shippingPostalCode: normalizedShipping?.postalCode || "",
          shippingCustomer: normalizedShipping ? JSON.stringify(normalizedShipping.customer || {}) : ""
        }
      }
    };

    const abacateResponse = await fetch(ABACATE_PIX_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pixPayload)
    });

    const data = await abacateResponse.json().catch(() => ({}));
    const pixData = data.data || data;
    const copyCode = pixData.brCode || pixData.copyPaste || pixData.pixCopyPaste || pixData.payload;
    const qrCodeBase64 = pixData.brCodeBase64 || pixData.qrCodeBase64 || pixData.qrCode;
    if (!abacateResponse.ok || data.success === false || data.error || !copyCode) {
      if ([401, 403].includes(abacateResponse.status)) {
        console.error("Abacate Pay Pix authorization failed", {
          statusCode: abacateResponse.status,
          details: data.error || data
        });
        sendJson(response, 401, {
          error: "Abacate Pay esta temporariamente indisponivel. Use Mercado Pago ou tente novamente mais tarde.",
          code: "ABACATE_AUTH_FAILED"
        });
        return;
      }

      const detail = typeof data.error === "string"
        ? data.error
        : data.error?.message || data.message;
      sendJson(response, abacateResponse.status || 500, {
        error: detail || "Abacate Pay recusou a criacao do Pix.",
        details: data.error || data
      });
      return;
    }

    sendJson(response, 200, {
      id: pixData.id,
      amount: pixData.amount,
      amount_brl: finalTotal,
      base_amount_brl: total,
      fee_adjustment_brl: abacateFee,
      copy_code: copyCode,
      qr_code_base64: qrCodeBase64,
      expires_at: pixData.expiresAt,
      external_id: externalId
    });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { error: error.message || "Erro ao criar Pix Abacate Pay." });
  }
};
