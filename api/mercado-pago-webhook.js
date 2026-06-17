const crypto = require("crypto");
const {
  fulfillmentItemsForIds,
  formatFulfillmentItems,
  isManualShippingProvider,
  loadProductsFromDisk
} = require("../lib/fulfillment-shipping");

const MERCADO_PAGO_PAYMENT_API = "https://api.mercadopago.com/v1/payments";
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

function extractPaymentId(request, body) {
  const url = new URL(request.url || "/", requestOrigin(request));
  return (
    body?.data?.id ||
    body?.id ||
    url.searchParams.get("data.id") ||
    url.searchParams.get("id")
  );
}

function signPayload(payload) {
  const secret = process.env.ORDER_CONFIRMATION_SECRET || process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!secret) return "";

  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function productIdsFromMetadata(metadata) {
  return [
    metadata.product_ids,
    metadata.product_id
  ].join(";")
    .split(";")
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

async function fetchPayment(paymentId) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    const error = new Error("MERCADO_PAGO_ACCESS_TOKEN nao configurado.");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(`${MERCADO_PAGO_PAYMENT_API}/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Nao foi possivel consultar o pagamento.");
    error.statusCode = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

async function notifyOrder(request, payment) {
  const endpoint = process.env.ORDER_NOTIFICATION_ENDPOINT || DEFAULT_ORDER_ENDPOINT;
  if (!endpoint) return { sent: false };

  const metadata = payment.metadata || {};
  const orderReference = metadata.order_reference || payment.external_reference || String(payment.id);
  const shippingRequested = metadata.shipping_requested === "true";
  const shippingCustomer = metadata.shipping_customer ? JSON.parse(metadata.shipping_customer) : {};
  const manualFulfillmentRequired = metadata.manual_fulfillment_required === "true" || isManualShippingProvider(metadata.shipping_provider);
  let manualFulfillmentItems = metadata.manual_fulfillment_items || "";
  if (manualFulfillmentRequired && !manualFulfillmentItems) {
    const products = await loadProductsFromDisk().catch(() => []);
    manualFulfillmentItems = formatFulfillmentItems(fulfillmentItemsForIds(products, productIdsFromMetadata(metadata)));
  }
  const origin = requestOrigin(request);
  const canAutoConfirmLabel = shippingRequested && !manualFulfillmentRequired && metadata.shipping_provider !== "mixed";
  const confirmationToken = canAutoConfirmLabel ? signPayload({
    paymentId: payment.id,
    productId: metadata.product_id,
    productTitle: metadata.product_title,
    shipping: {
      provider: "melhor-envio",
      serviceId: metadata.shipping_physical_service_id || metadata.shipping_service_id,
      serviceName: metadata.shipping_physical_service_name || metadata.shipping_service_name,
      carrier: metadata.shipping_physical_carrier || metadata.shipping_carrier,
      price: metadata.shipping_physical_price || metadata.shipping_price,
      postalCode: metadata.shipping_postal_code,
      customer: shippingCustomer
    },
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
  }) : "";
  const confirmationUrl = confirmationToken
    ? `${origin}/api/shipping-confirm?token=${encodeURIComponent(confirmationToken)}`
    : "";
  const customerEmail = shippingCustomer.email || payment.payer?.email || "";
  const customerName = shippingCustomer.name || payment.payer?.first_name || "";

  const lines = [
    "Novo pedido pago no Mercado Pago.",
    "",
    `Pedido: ${orderReference}`,
    `Pagamento Mercado Pago: ${payment.id}`,
    `Produto: ${metadata.product_title || payment.description || ""}`,
    `Trocas: ${metadata.selected_swaps || "Nenhuma"}`,
    `Opcionais: ${metadata.selected_addons || "Nenhum"}`,
    `Valor pago: R$ ${payment.transaction_amount}`,
    "",
    "Entrega:",
    `Tipo: ${shippingRequested ? "Frete" : "Retirada local"}`,
    `Transportadora: ${metadata.shipping_carrier || "Nao informado"}`,
    `Servico: ${metadata.shipping_service_name || "Nao informado"}`,
    `Frete: R$ ${metadata.shipping_price || "0"}`,
    `CEP: ${metadata.shipping_postal_code || shippingCustomer.postalCode || ""}`,
    `Cliente: ${customerName}`,
    `Email: ${customerEmail}`,
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
    platform: "Mercado Pago",
    email: customerEmail || "",
    mensagem: lines.join("\n"),
    pagamento: orderReference,
    payment_id: orderReference,
    provider_payment_id: String(payment.id),
    produto: metadata.product_title || "",
    product_ids: metadata.product_ids || metadata.product_id || "",
    product_title: metadata.product_title || payment.description || "",
    selected_swaps: metadata.selected_swaps || "Nenhuma",
    selected_addons: metadata.selected_addons || "Nenhum",
    amount_paid: String(payment.transaction_amount || ""),
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: shippingCustomer.phone || "",
    delivery_mode: manualFulfillmentRequired ? (metadata.shipping_provider === "mixed" ? "mixed_shipping" : "supplier_shipping") : (shippingRequested ? "shipping" : "pickup"),
    shipping_requested: shippingRequested ? "true" : "false",
    shipping_provider: metadata.shipping_provider || "",
    shipping_service_id: metadata.shipping_service_id || "",
    shipping_service_name: metadata.shipping_service_name || "",
    shipping_carrier: metadata.shipping_carrier || "",
    shipping_price: metadata.shipping_price || "",
    shipping_postal_code: metadata.shipping_postal_code || shippingCustomer.postalCode || "",
    shipping_customer: metadata.shipping_customer || "",
    shipping_physical_service_id: metadata.shipping_physical_service_id || "",
    shipping_physical_carrier: metadata.shipping_physical_carrier || "",
    shipping_physical_service_name: metadata.shipping_physical_service_name || "",
    shipping_physical_price: metadata.shipping_physical_price || "",
    shipping_supplier_price: metadata.shipping_supplier_price || "",
    manual_fulfillment_required: manualFulfillmentRequired ? "true" : "false",
    manual_fulfillment_product_ids: metadata.manual_fulfillment_product_ids || "",
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

module.exports = async function mercadoPagoWebhook(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Metodo nao permitido." });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const paymentId = extractPaymentId(request, body);
    if (!paymentId) {
      sendJson(response, 200, { ok: true, ignored: "missing_payment_id" });
      return;
    }

    const payment = await fetchPayment(paymentId);
    if (payment.status !== "approved") {
      sendJson(response, 200, { ok: true, status: payment.status });
      return;
    }

    const notification = await notifyOrder(request, payment);
    sendJson(response, 200, { ok: true, paymentId, notification });
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      error: error.message || "Erro no webhook do Mercado Pago.",
      details: error.details
    });
  }
};
