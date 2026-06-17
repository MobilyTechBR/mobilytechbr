const fs = require("fs/promises");
const path = require("path");

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");
const ADDONS_FILE = path.join(process.cwd(), "data", "addons.json");
const MERCADO_PAGO_API = "https://api.mercadopago.com/checkout/preferences";
const { quoteMelhorEnvio } = require("./shipping-quote");
const {
  formatFulfillmentItems,
  resolveShippingSelection,
  splitFulfillmentProducts,
  validateUniquePhysicalCheckoutItems
} = require("../lib/fulfillment-shipping");
const { discountForCheckoutItems } = require("../lib/promotions");
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

function requestOrigin(request) {
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  const protocol = request.headers["x-forwarded-proto"] || "https";
  return process.env.SITE_URL || `${protocol}://${host}`;
}

function absoluteUrl(origin, value) {
  if (!value) return undefined;
  if (/^https?:\/\//.test(value)) return value;
  return new URL(String(value).replace(/^\.\//, "/"), origin).toString();
}

async function loadProducts() {
  const products = JSON.parse(await fs.readFile(PRODUCTS_FILE, "utf8"));
  return Array.isArray(products) ? products : [];
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

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function envNumber(name, fallback) {
  const raw = String(process.env[name] || "").trim();
  if (!raw) return fallback;
  const value = Number(raw.replace(",", "."));
  return Number.isFinite(value) ? value : fallback;
}

function toMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function mercadoPagoGrossUp(netValue) {
  const net = Number(netValue || 0);
  const enabled = String(process.env.MERCADO_PAGO_GROSS_UP_ENABLED || "true").toLowerCase() !== "false";
  if (!enabled || !Number.isFinite(net) || net <= 0) return { gross: toMoney(net), fee: 0 };

  const percent = envNumber("MERCADO_PAGO_FEE_PERCENT", 4.99);
  const fixed = envNumber("MERCADO_PAGO_FIXED_FEE_BRL", 0);
  const rate = Math.max(0, percent) / 100;
  if (rate >= 1) return { gross: toMoney(net), fee: 0 };

  const gross = Math.ceil(((net + Math.max(0, fixed)) / (1 - rate)) * 100) / 100;
  return {
    gross: toMoney(gross),
    fee: toMoney(Math.max(0, gross - net))
  };
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

function splitName(name = "") {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { name: "", surname: "" };
  return {
    name: parts[0],
    surname: parts.slice(1).join(" ")
  };
}

function splitPhone(value = "") {
  const digits = onlyDigits(value);
  if (digits.length >= 10) {
    return {
      area_code: digits.slice(0, 2),
      number: digits.slice(2)
    };
  }
  return digits ? { number: digits } : undefined;
}

function formBody(fields) {
  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== "") {
      params.set(key, String(value));
    }
  });
  return params;
}

async function notifyPendingOrder(fields) {
  const endpoint = process.env.ORDER_NOTIFICATION_ENDPOINT || "";
  if (!endpoint) return { sent: false, skipped: true };

  const controller = new AbortController();
  const timeoutMs = Math.max(500, Number(process.env.ORDER_NOTIFICATION_TIMEOUT_MS || 2500));
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formBody(fields).toString(),
      signal: controller.signal
    });
    return { sent: response.ok, status: response.status };
  } catch (error) {
    return { sent: false, error: error.name === "AbortError" ? "timeout" : (error.message || "pending notification failed") };
  } finally {
    clearTimeout(timeout);
  }
}

async function normalizeShipping(products, shipping) {
  return resolveShippingSelection(products, shipping, {
    quoteMelhorEnvio,
    aggregateShippingProduct
  });
}

module.exports = async function createPreference(request, response) {
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

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    sendJson(response, 500, { error: "MERCADO_PAGO_ACCESS_TOKEN nao configurado na Vercel." });
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
    const origin = requestOrigin(request);
    const checkoutReferenceBase = checkoutItems.length === 1
      ? checkoutItems[0].product.id
      : "cart";
    const checkoutReference = `${checkoutReferenceBase}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const allAddons = checkoutItems.flatMap((item) => item.addons.map((addon) => ({
      ...addon,
      productId: item.product.id,
      productTitle: item.product.title
    })));
    const allSwaps = checkoutItems.flatMap((item) => item.swaps.map((swap) => ({
      ...swap,
      productId: item.product.id,
      productTitle: item.product.title
    })));
    const shippingDescription = normalizedShipping
      ? `Frete ${normalizedShipping.carrier} ${normalizedShipping.serviceName} para CEP ${normalizedShipping.postalCode}`
      : "";
    const customer = normalizedShipping?.customer || {};
    const customerName = splitName(customer.name);
    const productsSubtotal = checkoutItems.reduce((sum, item) => {
      const addonsTotal = item.addons.reduce((addonSum, addon) => addonSum + addon.price, 0);
      const swapsTotal = item.swaps.reduce((swapSum, swap) => swapSum + swap.price, 0);
      return sum + ((item.unitPrice + addonsTotal + swapsTotal) * item.quantity);
    }, 0);
    const promotion = discountForCheckoutItems(checkoutItems, payload.coupon);
    const baseCheckoutTotal = Math.max(0, productsSubtotal - promotion.discount) + (normalizedShipping ? normalizedShipping.price : 0);
    const mercadoFeeAdjustment = mercadoPagoGrossUp(baseCheckoutTotal).fee;
    let remainingCouponDiscount = promotion.discount;
    const preference = {
      items: [
        ...checkoutItems.flatMap((item) => {
          const addonDescription = item.addons.map((addon) => `${addon.categoryLabel}: ${addon.label}`).join(" | ");
          const swapDescription = item.swaps.map((swap) => `${swap.targetLabel}: ${swap.label}`).join(" | ");
          const swapsTotal = item.swaps.reduce((sum, swap) => sum + swap.price, 0);
          const adjustedUnitPrice = item.unitPrice + swapsTotal;
          let productUnitPrice = adjustedUnitPrice;
          let discountDescription = "";
          if (remainingCouponDiscount > 0 && productCategory(item.product) === "pc") {
            const appliedDiscount = Math.min(Math.max(0, productUnitPrice - 1), remainingCouponDiscount);
            productUnitPrice = toMoney(productUnitPrice - appliedDiscount);
            remainingCouponDiscount = toMoney(remainingCouponDiscount - appliedDiscount);
            discountDescription = appliedDiscount > 0 ? `Cupom ${promotion.code}: -R$ ${appliedDiscount.toFixed(2)}` : "";
          }
          return [
            {
              id: item.product.id,
              title: item.product.title,
              description: [item.product.tags?.filter(Boolean).join(" | "), swapDescription, addonDescription, discountDescription].filter(Boolean).join(" | ") || item.product.title,
              picture_url: absoluteUrl(origin, item.product.image || item.product.cutout),
              quantity: item.quantity,
              currency_id: "BRL",
              unit_price: productUnitPrice
            },
            ...item.addons.map((addon) => ({
              id: `${item.product.id}-${addon.category}-${addon.index}`,
              title: `${item.product.title} - ${addon.categoryLabel}: ${addon.label}`,
              quantity: item.quantity,
              currency_id: "BRL",
              unit_price: addon.price
            }))
          ];
        }),
        ...(normalizedShipping ? [{
          id: `${checkoutReference}-shipping-${normalizedShipping.serviceId}`,
          title: shippingDescription,
          quantity: 1,
          currency_id: "BRL",
          unit_price: normalizedShipping.price
        }] : []),
        ...(mercadoFeeAdjustment > 0 ? [{
          id: `${checkoutReference}-mercado-pago-processing-adjustment`,
          title: "Ajuste de processamento Mercado Pago",
          quantity: 1,
          currency_id: "BRL",
          unit_price: mercadoFeeAdjustment
        }] : [])
      ],
      payer: normalizedShipping ? {
        name: customerName.name || undefined,
        surname: customerName.surname || undefined,
        email: customer.email || undefined,
        phone: splitPhone(customer.phone),
        address: {
          zip_code: normalizedShipping.postalCode,
          street_name: customer.street || undefined,
          street_number: customer.number || undefined
        }
      } : undefined,
      back_urls: {
        success: `${origin}/pagamento-sucesso.html`,
        pending: `${origin}/pagamento-pendente.html`,
        failure: `${origin}/pagamento-falha.html`
      },
      auto_return: "approved",
      external_reference: checkoutReference,
      metadata: {
        checkout_type: checkoutItems.length > 1 ? "cart" : "single_product",
        order_reference: checkoutReference,
        product_id: checkoutItems[0].product.id,
        product_ids: checkoutItems.map((item) => item.product.id).join("; "),
        product_quantities: checkoutItems.map((item) => `${item.product.id}:${item.quantity}`).join("; "),
        product_title: checkoutItems.map((item) => item.product.title).join("; "),
        selected_addons: allAddons.map((addon) => `${addon.productId}:${addon.category}:${addon.label}`).join("; "),
        selected_swaps: allSwaps.map((swap) => `${swap.productId}:${swap.target}:${swap.label}`).join("; "),
        shipping_requested: normalizedShipping ? "true" : "false",
        shipping_provider: normalizedShipping?.provider || "",
        shipping_service_id: normalizedShipping?.serviceId || "",
        shipping_service_name: normalizedShipping?.serviceName || "",
        shipping_carrier: normalizedShipping?.carrier || "",
        shipping_price: normalizedShipping ? String(normalizedShipping.price) : "",
        shipping_physical_service_id: normalizedShipping?.physicalServiceId || "",
        shipping_physical_carrier: normalizedShipping?.physicalCarrier || "",
        shipping_physical_service_name: normalizedShipping?.physicalServiceName || "",
        shipping_physical_price: normalizedShipping?.physicalPrice !== undefined ? String(normalizedShipping.physicalPrice) : "",
        shipping_supplier_price: normalizedShipping?.supplierPrice !== undefined ? String(normalizedShipping.supplierPrice) : "",
        manual_fulfillment_required: manualFulfillmentRequired ? "true" : "false",
        manual_fulfillment_product_ids: fulfillmentSplit.supplier.map((product) => product.id).join("; "),
        manual_fulfillment_items: formatFulfillmentItems(manualFulfillmentItems),
        coupon_code: promotion.code || "",
        coupon_label: promotion.label || "",
        coupon_percent: promotion.percent ? String(promotion.percent) : "",
        coupon_discount: promotion.discount ? String(promotion.discount) : "",
        products_subtotal: String(productsSubtotal),
        mercado_pago_fee_adjustment: String(mercadoFeeAdjustment),
        shipping_postal_code: normalizedShipping?.postalCode || "",
        shipping_customer: normalizedShipping ? JSON.stringify(customer) : ""
      },
      statement_descriptor: "MOBILYTECHBR"
    };

    const notificationUrl = process.env.MERCADO_PAGO_WEBHOOK_URL || `${origin}/api/mercado-pago-webhook`;
    if (notificationUrl) {
      preference.notification_url = notificationUrl;
    }

    const mercadoPagoResponse = await fetch(MERCADO_PAGO_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    });

    const data = await mercadoPagoResponse.json().catch(() => ({}));
    if (!mercadoPagoResponse.ok) {
      sendJson(response, mercadoPagoResponse.status, {
        error: data.message || data.error || "Mercado Pago recusou a criacao do checkout.",
        details: data.error || data.cause
      });
      return;
    }

    const checkoutUrl = accessToken.startsWith("TEST-")
      ? data.sandbox_init_point || data.init_point
      : data.init_point || data.sandbox_init_point;

    const pendingNotification = await notifyPendingOrder({
      _subject: "Pedido recebido - pagamento pendente - MobilyTechBR",
      order_status: "PENDENTE",
      platform: "Mercado Pago",
      email: customer.email || "",
      mensagem: [
        "Pedido recebido no checkout Mercado Pago.",
        "",
        `Pedido: ${checkoutReference}`,
        `Checkout Mercado Pago: ${data.id || ""}`,
        `Produto: ${preference.metadata.product_title}`,
        `Valor pendente: R$ ${toMoney(baseCheckoutTotal + mercadoFeeAdjustment).toFixed(2)}`,
        "",
        "O cliente deve receber confirmacao automatica quando o pagamento for aprovado."
      ].join("\n"),
      pagamento: checkoutReference,
      payment_id: checkoutReference,
      provider_checkout_id: data.id || "",
      produto: preference.metadata.product_title,
      product_ids: preference.metadata.product_ids,
      product_title: preference.metadata.product_title,
      selected_swaps: preference.metadata.selected_swaps,
      selected_addons: preference.metadata.selected_addons,
      amount_paid: String(toMoney(baseCheckoutTotal + mercadoFeeAdjustment)),
      customer_name: customer.name || "",
      customer_email: customer.email || "",
      customer_phone: customer.phone || "",
      delivery_mode: manualFulfillmentRequired ? (normalizedShipping?.provider === "mixed" ? "mixed_shipping" : "supplier_shipping") : (normalizedShipping ? "shipping" : "pickup"),
      shipping_requested: normalizedShipping ? "true" : "false",
      shipping_provider: preference.metadata.shipping_provider,
      shipping_service_id: preference.metadata.shipping_service_id,
      shipping_service_name: preference.metadata.shipping_service_name,
      shipping_carrier: preference.metadata.shipping_carrier,
      shipping_price: preference.metadata.shipping_price,
      shipping_postal_code: preference.metadata.shipping_postal_code,
      shipping_customer: preference.metadata.shipping_customer,
      shipping_physical_service_id: preference.metadata.shipping_physical_service_id,
      shipping_physical_carrier: preference.metadata.shipping_physical_carrier,
      shipping_physical_service_name: preference.metadata.shipping_physical_service_name,
      shipping_physical_price: preference.metadata.shipping_physical_price,
      shipping_supplier_price: preference.metadata.shipping_supplier_price,
      manual_fulfillment_required: preference.metadata.manual_fulfillment_required,
      manual_fulfillment_product_ids: preference.metadata.manual_fulfillment_product_ids,
      manual_fulfillment_items: preference.metadata.manual_fulfillment_items
    });

    sendJson(response, 200, {
      id: data.id,
      checkout_url: checkoutUrl,
      pending_notification: pendingNotification
    });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { error: error.message || "Erro ao criar checkout." });
  }
};
