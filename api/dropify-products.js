const { sessionFromRequest } = require("../lib/auth-session");
const {
  getDropifyProduct,
  isDropifyConfigured,
  isDropifyFreightConfigured,
  listDropifyProducts,
  normalizeDropifyProduct,
  normalizeProductArray
} = require("../lib/dropify");

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

function isAdminRequest(request, body = {}) {
  const session = sessionFromRequest(request);
  if (session?.admin) return true;
  const configuredToken = process.env.ADMIN_WRITE_TOKEN || "";
  const providedToken = request.headers["x-admin-token"] || body.adminToken || "";
  return Boolean(configuredToken && String(providedToken) === String(configuredToken));
}

module.exports = async function dropifyProducts(request, response) {
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (!["GET", "POST"].includes(request.method)) {
    sendJson(response, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  const url = new URL(request.url || "/", `https://${request.headers.host || "mobilytech.com.br"}`);
  const body = request.method === "POST" ? await readJsonBody(request) : {};
  if (!isAdminRequest(request, body)) {
    sendJson(response, 401, { ok: false, error: "Acesso administrativo necessario." });
    return;
  }

  if (!isDropifyConfigured()) {
    sendJson(response, 501, {
      ok: false,
      configured: false,
      freightConfigured: isDropifyFreightConfigured(),
      error: "Credenciais Dropify ainda nao configuradas na Vercel."
    });
    return;
  }

  try {
    const sku = body.sku || url.searchParams.get("sku");
    const raw = sku
      ? await getDropifyProduct(sku)
      : await listDropifyProducts({
        page: body.page || url.searchParams.get("page") || 1,
        pageSize: body.pageSize || url.searchParams.get("page_size") || 50
      });
    const products = sku
      ? [normalizeDropifyProduct(raw.data || raw.product || raw)]
      : normalizeProductArray(raw).map(normalizeDropifyProduct);
    sendJson(response, 200, {
      ok: true,
      configured: true,
      freightConfigured: isDropifyFreightConfigured(),
      count: products.length,
      products,
      pagination: raw.pagination || raw.meta || null
    });
  } catch (error) {
    sendJson(response, error.statusCode || 500, {
      ok: false,
      error: error.message || "Erro ao consultar produtos Dropify.",
      code: error.code,
      details: error.details
    });
  }
};
