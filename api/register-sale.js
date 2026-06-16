const { sessionFromRequest } = require("../lib/auth-session");

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (_error) {
    const params = new URLSearchParams(raw);
    return Object.fromEntries(params.entries());
  }
}

function safeResponse(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    safeResponse(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  const body = await readJson(req);
  const session = sessionFromRequest(req);
  const hasAdminSession = Boolean(session && session.admin);
  const configuredToken = process.env.ADMIN_WRITE_TOKEN || "";
  if (!configuredToken && !hasAdminSession) {
    safeResponse(res, 501, {
      ok: false,
      needsConfig: true,
      error: "Configure ADMIN_WRITE_TOKEN na Vercel para permitir registro automatico de vendas pelo painel."
    });
    return;
  }

  const providedToken = req.headers["x-admin-token"] || body.adminToken || "";
  if (!hasAdminSession && String(providedToken) !== String(configuredToken)) {
    safeResponse(res, 401, { ok: false, error: "Token administrativo invalido." });
    return;
  }

  const dryRun = body.dryRun === true || String(body.mode || "").toLowerCase() === "auth-check";
  if (dryRun) {
    safeResponse(res, 200, {
      ok: true,
      authenticated: true,
      authMode: hasAdminSession ? "admin-session" : "admin-token",
      dryRun: true,
      message: "Token administrativo validado sem registrar venda."
    });
    return;
  }

  const endpoint = process.env.SALES_REGISTRATION_ENDPOINT || process.env.ORDER_NOTIFICATION_ENDPOINT || "";
  if (!endpoint) {
    safeResponse(res, 501, {
      ok: false,
      needsConfig: true,
      error: "Configure SALES_REGISTRATION_ENDPOINT ou ORDER_NOTIFICATION_ENDPOINT na Vercel."
    });
    return;
  }

  const payload = {
    ...body,
    action: "register-manual-sale",
    event_type: "manual_sale_registration",
    registered_by: session && session.email ? session.email : body.registered_by
  };
  delete payload.adminToken;

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    const text = await upstream.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (_error) {
      parsed = { raw: text };
    }
    safeResponse(res, upstream.ok ? 200 : upstream.status, {
      ok: upstream.ok,
      upstreamStatus: upstream.status,
      result: parsed
    });
  } catch (error) {
    safeResponse(res, 502, {
      ok: false,
      error: error.message || "Erro ao registrar venda."
    });
  }
};
