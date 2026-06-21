const crypto = require("crypto");

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

async function readRawBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function timingSafeEqualText(a = "", b = "") {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function verifyWebhook(request, rawBody) {
  const secret = process.env.DROPIFY_WEBHOOK_SECRET || "";
  if (!secret) return { ok: true, mode: "no-secret-configured" };

  const provided = String(
    request.headers["x-dropify-signature"]
    || request.headers["x-webhook-signature"]
    || request.headers["x-hub-signature-256"]
    || ""
  ).replace(/^sha256=/i, "");
  if (!provided) return { ok: false, reason: "missing-signature" };

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEqualText(provided, expected)
    ? { ok: true, mode: "hmac-sha256" }
    : { ok: false, reason: "invalid-signature" };
}

module.exports = async function dropifyWebhook(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  try {
    const rawBody = await readRawBody(request);
    const verification = verifyWebhook(request, rawBody);
    if (!verification.ok) {
      sendJson(response, 401, { ok: false, error: "Assinatura Dropify invalida.", reason: verification.reason });
      return;
    }

    const body = rawBody.length ? JSON.parse(rawBody.toString("utf8")) : {};
    console.log("Dropify webhook received", {
      event: body.event || body.type || body.action || "",
      sku: body.sku || body.productSku || body.data?.sku || "",
      mode: verification.mode
    });
    sendJson(response, 200, { ok: true, received: true });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message || "Webhook Dropify invalido." });
  }
};
