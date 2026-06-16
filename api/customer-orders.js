const {
  json,
  sessionFromRequest
} = require("../lib/auth-session");

module.exports = async function customerOrders(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  const session = sessionFromRequest(req);
  if (!session || !session.email) {
    json(res, 401, { ok: false, error: "Entre na conta para ver seus pedidos." });
    return;
  }

  const endpoint = process.env.CUSTOMER_ORDERS_ENDPOINT || "";
  if (!endpoint) {
    json(res, 200, {
      ok: true,
      configured: false,
      orders: [],
      message: "Endpoint seguro de historico de pedidos ainda nao configurado."
    });
    return;
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "lookup-customer-orders",
        customer_email: session.email,
        token: process.env.CUSTOMER_ORDERS_TOKEN || ""
      })
    });
    const text = await upstream.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (_error) {
      parsed = { raw: text };
    }
    if (!upstream.ok || parsed.ok === false) {
      json(res, upstream.ok ? 502 : upstream.status, {
        ok: false,
        error: parsed.error || parsed.message || "Nao foi possivel consultar pedidos agora."
      });
      return;
    }
    json(res, 200, {
      ok: true,
      configured: true,
      orders: Array.isArray(parsed.orders) ? parsed.orders : []
    });
  } catch (error) {
    json(res, 502, { ok: false, error: error.message || "Erro ao consultar pedidos." });
  }
};
