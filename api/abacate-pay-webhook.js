const crypto = require("crypto");
const {
  fulfillmentItemsForIds,
  formatFulfillmentItems,
  isManualShippingProvider,
  loadProductsFromDisk
} = require("../lib/fulfillment-shipping");

const DEFAULT_ORDER_ENDPOINT = "https://formspree.io/f/mnjrqypq";

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");

  let raw = "";
  for await (const chunk of request) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function requestOrigin(request) {
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  const protocol = request.headers["x-forwarded-proto"] || "https";
  return process.env.SITE_URL || `${protocol}://${host}`;
}

function signPayload(payload) {
  const secret = process.env.ORDER_CONFIRMATION_SECRET || process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.ABACATE_PAY_API_KEY || process.env.ABACATEPAY_API_KEY;
  if (!secret) return "";

  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function readPath(source, paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((current, key) => current?.[key], source);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
}

function parseMetadata(body) {
  const metadata = readPath(body, [
    "data.metadata",
    "metadata",
    "data.checkout.metadata",
    "checkout.metadata",
    "data.billing.metadata",
    "billing.metadata"
  ]);
  return metadata && typeof metadata === "object" ? metadata : {};
}

function parseCustomer(metadata) {
  try {
    return metadata.shippingCustomer ? JSON.parse(metadata.shippingCustomer) : {};
  } catch (_error) {
    return {};
  }
}

function isPaidStatus(value) {
  return /^(paid|approved|completed|confirmed)$/i.test(String(value || ""));
}

function productIdsFromMetadata(metadata) {
  return [
    metadata.productIds,
    metadata.productId
  ].join(";")
    .split(";")
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

async function notifyOrder(request, body) {
  const endpoint = process.env.ORDER_NOTIFICATION_ENDPOINT || DEFAULT_ORDER_ENDPOINT;
  if (!endpoint) return { sent: false };

  const metadata = parseMetadata(body);
  const shippingCustomer = parseCustomer(metadata);
  const paymentId = String(readPath(body, ["data.id", "id", "data.billing.id", "billing.id", "data.checkout.id", "checkout.id"]) || metadata.externalId || "");
  const orderReference = metadata.orderReference || paymentId;
  const status = String(readPath(body, ["data.status", "status", "data.billing.status", "billing.status", "data.checkout.status", "checkout.status"]) || "approved");
  const amountPaid = readPath(body, ["data.amount", "amount", "data.totalAmount", "totalAmount", "data.billing.amount", "billing.amount"]) || "";
  const shippingRequested = metadata.shippingRequested === "true";
  const manualFulfillmentRequired = metadata.manualFulfillmentRequired === "true" || isManualShippingProvider(metadata.shippingProvider);
  let manualFulfillmentItems = metadata.manualFulfillmentItems || "";
  if (manualFulfillmentRequired && !manualFulfillmentItems) {
    const products = await loadProductsFromDisk().catch(() => []);
    manualFulfillmentItems = formatFulfillmentItems(fulfillmentItemsForIds(products, productIdsFromMetadata(metadata)));
  }
  const origin = requestOrigin(request);
  const canAutoConfirmLabel = shippingRequested && !manualFulfillmentRequired && metadata.shippingProvider !== "mixed";
  const confirmationToken = canAutoConfirmLabel ? signPayload({
    paymentProvider: "abacate",
    paymentStatus: "approved",
    paymentId,
    productId: metadata.productId || String(metadata.productIds || "").split(";")[0].trim(),
    productTitle: metadata.productTitles,
    shipping: {
      provider: "melhor-envio",
      serviceId: metadata.shippingPhysicalServiceId || metadata.shippingServiceId,
      serviceName: metadata.shippingPhysicalServiceName || metadata.shippingServiceName,
      carrier: metadata.shippingPhysicalCarrier || metadata.shippingCarrier,
      price: metadata.shippingPhysicalPrice || metadata.shippingPrice,
      postalCode: metadata.shippingPostalCode,
      customer: shippingCustomer
    },
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
  }) : "";
  const confirmationUrl = confirmationToken
    ? `${origin}/api/shipping-confirm?token=${encodeURIComponent(confirmationToken)}`
    : "";

  const lines = [
    "Novo pedido pago no Abacate Pay.",
    "",
    `Pedido: ${orderReference || "Nao informado"}`,
    `Pagamento Abacate Pay: ${paymentId || "Nao informado"}`,
    `Produto: ${metadata.productTitles || ""}`,
    `Trocas: ${metadata.selectedSwaps || "Nenhuma"}`,
    `Opcionais: ${metadata.selectedAddons || "Nenhum"}`,
    `Valor pago: ${amountPaid}`,
    "",
    "Entrega:",
    `Tipo: ${shippingRequested ? "Frete" : "Retirada local"}`,
    `Transportadora: ${metadata.shippingCarrier || "Nao informado"}`,
    `Servico: ${metadata.shippingServiceName || "Nao informado"}`,
    `Frete: R$ ${metadata.shippingPrice || "0"}`,
    `CEP: ${metadata.shippingPostalCode || shippingCustomer.postalCode || ""}`,
    `Cliente: ${shippingCustomer.name || ""}`,
    `Email: ${shippingCustomer.email || ""}`,
    `Telefone: ${shippingCustomer.phone || ""}`,
    `Endereco: ${[shippingCustomer.street, shippingCustomer.number, shippingCustomer.complement, shippingCustomer.district, shippingCustomer.city, shippingCustomer.state].filter(Boolean).join(", ")}`,
    "",
    manualFulfillmentRequired
      ? [
        "ACAO MANUAL NECESSARIA: pedido com item de envio direto MobilyTech Finds.",
        "Nao compre etiqueta Melhor Envio para estes itens.",
        manualFulfillmentItems || "Itens de fornecedor nao detalhados nos metadados.",
        "Use o link/canal de origem acima, compre em nome do cliente, acompanhe o rastreio e atualize o pedido."
      ].join("\n")
      : (shippingRequested
        ? (confirmationUrl ? `Confirmar compra da etiqueta: ${confirmationUrl}` : "Confirmacao de etiqueta indisponivel: configure ORDER_CONFIRMATION_SECRET.")
        : "Pedido sem frete: retirada local selecionada.")
  ];

  const form = new URLSearchParams({
    _subject: "Pedido pago - MobilyTechBR",
    order_status: "PAGO",
    platform: "Abacate Pay",
    email: shippingCustomer.email || "",
    mensagem: lines.join("\n"),
    pagamento: orderReference,
    payment_id: orderReference,
    provider_payment_id: paymentId,
    produto: metadata.productTitles || "",
    product_ids: metadata.productIds || "",
    product_title: metadata.productTitles || "",
    selected_swaps: metadata.selectedSwaps || "Nenhuma",
    selected_addons: metadata.selectedAddons || "Nenhum",
    amount_paid: String(amountPaid || ""),
    customer_name: shippingCustomer.name || "",
    customer_email: shippingCustomer.email || "",
    customer_phone: shippingCustomer.phone || "",
    delivery_mode: manualFulfillmentRequired ? (metadata.shippingProvider === "mixed" ? "mixed_shipping" : "supplier_shipping") : (shippingRequested ? "shipping" : "pickup"),
    shipping_requested: shippingRequested ? "true" : "false",
    shipping_provider: metadata.shippingProvider || "",
    shipping_service_id: metadata.shippingServiceId || "",
    shipping_service_name: metadata.shippingServiceName || "",
    shipping_carrier: metadata.shippingCarrier || "",
    shipping_price: metadata.shippingPrice || "",
    shipping_postal_code: metadata.shippingPostalCode || "",
    shipping_customer: metadata.shippingCustomer || "",
    shipping_physical_service_id: metadata.shippingPhysicalServiceId || "",
    shipping_physical_carrier: metadata.shippingPhysicalCarrier || "",
    shipping_physical_service_name: metadata.shippingPhysicalServiceName || "",
    shipping_physical_price: metadata.shippingPhysicalPrice || "",
    shipping_supplier_price: metadata.shippingSupplierPrice || "",
    manual_fulfillment_required: manualFulfillmentRequired ? "true" : "false",
    manual_fulfillment_product_ids: metadata.manualFulfillmentProductIds || "",
    manual_fulfillment_items: manualFulfillmentItems || "",
    confirmar_etiqueta: confirmationUrl,
    label_confirmation_url: confirmationUrl
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form.toString()
  });

  return { sent: response.ok, status: response.status };
}

module.exports = async function abacatePayWebhook(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Metodo nao permitido." });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const status = readPath(body, ["data.status", "status", "data.billing.status", "billing.status", "data.checkout.status", "checkout.status"]);
    if (status && !isPaidStatus(status)) {
      sendJson(response, 200, { ok: true, ignored: "not_paid", status });
      return;
    }

    const notification = await notifyOrder(request, body);
    sendJson(response, 200, { ok: true, notification });
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || "Erro no webhook do Abacate Pay."
    });
  }
};
