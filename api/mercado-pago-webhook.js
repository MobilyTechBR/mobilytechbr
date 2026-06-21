const crypto = require("crypto");
const {
  fulfillmentItemsForIds,
  formatFulfillmentItems,
  isManualShippingProvider,
  loadProductsFromDisk
} = require("../lib/fulfillment-shipping");
const { createCjSemiAutomaticOrders } = require("../lib/cj-dropshipping");
const { createDropifySemiAutomaticOrder } = require("../lib/dropify");

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

function parseJsonField(value, fallback) {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function formatCjPreparation(result) {
  if (!result) return "";
  if (result.status === "not-needed") return "";
  if (result.status === "payload-only") {
    return [
      "Pedido CJ preparado em modo payload-only; nenhum pedido foi criado automaticamente.",
      `Pedidos preparados: ${(result.payloads || []).map((item) => item.orderNumber).join(", ") || "nenhum"}`,
      "Revise/ative a criacao semi-automatica quando as credenciais e testes estiverem OK."
    ].join("\n");
  }
  if (result.status === "created-unpaid") {
    const orders = result.orders || [];
    return [
      "Pedido CJ semi-automatico criado sem pagamento automatico.",
      ...orders.map((order) => [
        `CJ orderNumber: ${order.orderNumber || "nao informado"}`,
        `CJ orderId: ${order.orderId || "nao informado"}`,
        `Status CJ: ${order.orderStatus || "criado/pendente"}`,
        order.cjPayUrl ? `Link de pagamento CJ: ${order.cjPayUrl}` : "",
        order.logisticsMiss ? `Logistica faltante: ${order.logisticsMiss}` : "",
        (order.interceptOrderReasons || []).length
          ? `Interceptacoes CJ: ${JSON.stringify(order.interceptOrderReasons)}`
          : ""
      ].filter(Boolean).join(" | "))
    ].join("\n");
  }
  if (result.status === "error") {
    return [
      "Pedido CJ NAO foi criado automaticamente.",
      `Motivo: ${result.error || "erro desconhecido"}`,
      "Use os dados de envio direto abaixo para fazer a revisao manual e nao confirme compra se custo/frete mudarem."
    ].join("\n");
  }
  return "";
}

function formatDropifyPreparation(result) {
  if (!result) return "";
  if (result.status === "not-needed") return "";
  if (result.status === "payload-only") {
    return [
      "Pedido Dropify preparado em modo payload-only; nenhum pedido foi criado automaticamente.",
      "Ative DROPIFY_CREATE_ORDER_ENABLED=true somente depois de testar credenciais, frete e fluxo de liberacao no painel."
    ].join("\n");
  }
  if (result.status === "created-review-required") {
    return [
      "Pedido Dropify criado para revisao no painel.",
      `Dropify orderId: ${result.orderId || "nao informado"}`,
      "Revise o pedido, escolha/libere o frete e confirme o pagamento manualmente no fornecedor."
    ].join("\n");
  }
  if (result.status === "error") {
    return [
      "Pedido Dropify NAO foi criado automaticamente.",
      `Motivo: ${result.error || "erro desconhecido"}`,
      "Use os dados de envio direto abaixo para fazer a revisao manual."
    ].join("\n");
  }
  return "";
}

async function prepareCjOrdersIfNeeded(orderReference, metadata, shippingCustomer, supplierItems) {
  const hasCjItems = (supplierItems || []).some((item) => item?.cj?.vid || item?.cj?.sku);
  if (!hasCjItems) return { status: "not-needed" };
  try {
    return await createCjSemiAutomaticOrders({
      orderReference,
      customer: shippingCustomer,
      supplierItems,
      sandbox: String(process.env.CJ_ORDER_SANDBOX || "").toLowerCase() === "true"
    });
  } catch (error) {
    return {
      status: "error",
      created: false,
      error: error.message || "Erro ao preparar pedido CJ.",
      code: error.code || "",
      details: error.details
    };
  }
}

async function prepareDropifyOrderIfNeeded(orderReference, metadata, shippingCustomer, supplierItems) {
  const hasDropifyItems = (supplierItems || []).some((item) => item?.dropify?.sku);
  if (!hasDropifyItems) return { status: "not-needed" };
  try {
    return await createDropifySemiAutomaticOrder({
      orderReference,
      customer: shippingCustomer,
      supplierItems
    });
  } catch (error) {
    return {
      status: "error",
      created: false,
      error: error.message || "Erro ao preparar pedido Dropify.",
      code: error.code || "",
      details: error.details
    };
  }
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
  let manualFulfillmentItemsJson = parseJsonField(metadata.manual_fulfillment_items_json, []);
  if (manualFulfillmentRequired && !manualFulfillmentItems) {
    const products = await loadProductsFromDisk().catch(() => []);
    manualFulfillmentItemsJson = fulfillmentItemsForIds(products, productIdsFromMetadata(metadata));
    manualFulfillmentItems = formatFulfillmentItems(manualFulfillmentItemsJson);
  }
  const cjPreparation = manualFulfillmentRequired
    ? await prepareCjOrdersIfNeeded(orderReference, metadata, shippingCustomer, manualFulfillmentItemsJson)
    : { status: "not-needed" };
  const dropifyPreparation = manualFulfillmentRequired
    ? await prepareDropifyOrderIfNeeded(orderReference, metadata, shippingCustomer, manualFulfillmentItemsJson)
    : { status: "not-needed" };
  const cjPreparationText = formatCjPreparation(cjPreparation);
  const dropifyPreparationText = formatDropifyPreparation(dropifyPreparation);
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
        "ACAO SEMI-AUTOMATICA CJ / ENVIO DIRETO.",
        cjPreparationText,
        dropifyPreparationText,
        "Nao compre etiqueta Melhor Envio para estes itens.",
        "Revise custo, frete e produto antes de confirmar/pagar o pedido no fornecedor.",
        manualFulfillmentItems || "Itens de fornecedor nao detalhados nos metadados.",
        "Depois de confirmar/pagar no fornecedor, acompanhe o rastreio e atualize o cliente."
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
    manual_fulfillment_items_json: metadata.manual_fulfillment_items_json || "",
    cj_order_status: cjPreparation.status || "",
    cj_order_created: cjPreparation.created ? "true" : "false",
    cj_order_ids: (cjPreparation.orders || []).map((order) => order.orderId).filter(Boolean).join("; "),
    cj_order_numbers: (cjPreparation.orders || cjPreparation.payloads || []).map((order) => order.orderNumber).filter(Boolean).join("; "),
    cj_pay_urls: (cjPreparation.orders || []).map((order) => order.cjPayUrl).filter(Boolean).join("; "),
    cj_order_message: cjPreparationText || "",
    dropify_order_status: dropifyPreparation.status || "",
    dropify_order_created: dropifyPreparation.created ? "true" : "false",
    dropify_order_id: dropifyPreparation.orderId || "",
    dropify_order_message: dropifyPreparationText || "",
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
