const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const {
  clearOAuthStateCookie,
  clearSessionCookie,
  createSession,
  isAdminEmail,
  json,
  publicUser,
  readOAuthState,
  redirect,
  requestOrigin,
  safeReturnTo,
  sessionFromRequest,
  setOAuthStateCookie,
  setSessionCookie
} = require("./auth-session");

const ADMIN_HTML = path.join(process.cwd(), "private", "admin", "index.html");

function routeUrl(req, fallback = "/api/account") {
  return new URL(req.url || fallback, requestOrigin(req));
}

function routeAction(req) {
  const url = routeUrl(req);
  const action = url.searchParams.get("action") || "";
  if (action) return action;
  const pathName = url.pathname.replace(/\/$/, "").replace(/\.js$/, "");
  const key = pathName.split("/").pop() || "";
  return {
    account: "session",
    "auth-session": "session",
    "customer-orders": "customer-orders",
    "auth-google-start": "google-start",
    "auth-google-callback": "google-callback",
    "auth-microsoft-start": "microsoft-start",
    "auth-microsoft-callback": "microsoft-callback",
    "auth-logout": "logout",
    admin: "admin"
  }[key] || "";
}

function decodeJwtPayload(token) {
  const part = String(token || "").split(".")[1];
  if (!part) return {};
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
}

function sendHtml(res, status, html) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.end(html);
}

function loginGate(origin, returnTo, configured) {
  const loginUrl = configured
    ? `/api/account?action=google-start&returnTo=${encodeURIComponent(returnTo)}`
    : "/fase2/minha-conta.html";
  const note = configured
    ? "Entre com uma das contas Google autorizadas para abrir o painel interno."
    : "O painel ja esta protegido, mas o login Google precisa das variaveis GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET na Vercel.";
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Painel protegido | MobilyTech BR</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f7fb;color:#101318;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      main{width:min(520px,calc(100vw - 32px));background:#fff;border:1px solid #e1e7f0;border-radius:18px;box-shadow:0 22px 60px rgba(16,24,40,.14);padding:30px}
      h1{margin:0 0 10px;font-size:28px;line-height:1.05}p{color:#59616d;font-weight:800;line-height:1.45}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;border-radius:999px;background:#111;color:#fff;font-weight:1000;text-decoration:none}.small{font-size:12px;color:#778196}
    </style>
  </head>
  <body>
    <main>
      <h1>Painel MobilyTech BR protegido</h1>
      <p>${note}</p>
      <p><a class="btn" href="${loginUrl}">Entrar com Google</a></p>
      <p class="small">${origin.replace(/"/g, "")}</p>
    </main>
  </body>
</html>`;
}

function forbiddenGate(email) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Acesso negado | MobilyTech BR</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f7fb;color:#101318;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      main{width:min(520px,calc(100vw - 32px));background:#fff;border:1px solid #e1e7f0;border-radius:18px;box-shadow:0 22px 60px rgba(16,24,40,.14);padding:30px}
      h1{margin:0 0 10px;font-size:28px;line-height:1.05}p{color:#59616d;font-weight:800;line-height:1.45}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;border-radius:999px;background:#111;color:#fff;font-weight:1000;text-decoration:none}
    </style>
  </head>
  <body>
    <main>
      <h1>Acesso negado</h1>
      <p>A conta ${String(email || "").replace(/</g, "&lt;")} nao esta autorizada para o painel interno da MobilyTech BR.</p>
      <p><a class="btn" href="/api/account?action=logout&returnTo=/">Sair</a></p>
    </main>
  </body>
</html>`;
}

async function authSession(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  const session = sessionFromRequest(req);
  json(res, 200, {
    ok: true,
    authenticated: Boolean(session),
    user: publicUser(session),
    admin: Boolean(session && session.admin),
    providers: {
      googleConfigured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      microsoftConfigured: Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET)
    }
  });
}

async function customerOrders(req, res) {
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
}

async function authProviderStart(req, res, provider) {
  const isGoogle = provider === "google";
  const clientId = process.env[isGoogle ? "GOOGLE_CLIENT_ID" : "MICROSOFT_CLIENT_ID"] || "";
  const clientSecret = process.env[isGoogle ? "GOOGLE_CLIENT_SECRET" : "MICROSOFT_CLIENT_SECRET"] || "";
  const providerLabel = isGoogle ? "Google" : "Microsoft";
  if (!clientId || !clientSecret) {
    json(res, 501, {
      ok: false,
      needsConfig: true,
      error: `Configure ${isGoogle ? "GOOGLE" : "MICROSOFT"}_CLIENT_ID e ${isGoogle ? "GOOGLE" : "MICROSOFT"}_CLIENT_SECRET na Vercel para ativar login ${providerLabel}.`
    });
    return;
  }

  const origin = requestOrigin(req);
  const currentUrl = routeUrl(req, `/api/auth-${provider}-start`);
  const state = crypto.randomBytes(24).toString("base64url");
  const returnTo = safeReturnTo(currentUrl.searchParams.get("returnTo"));
  setOAuthStateCookie(res, { provider, state, returnTo });

  const authorizeUrl = new URL(isGoogle
    ? "https://accounts.google.com/o/oauth2/v2/auth"
    : "https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", `${origin}/api/auth-${provider}-callback`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "openid email profile");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("prompt", "select_account");

  res.statusCode = 302;
  res.setHeader("Location", authorizeUrl.toString());
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

async function authProviderCallback(req, res, provider) {
  const isGoogle = provider === "google";
  const clientId = process.env[isGoogle ? "GOOGLE_CLIENT_ID" : "MICROSOFT_CLIENT_ID"] || "";
  const clientSecret = process.env[isGoogle ? "GOOGLE_CLIENT_SECRET" : "MICROSOFT_CLIENT_SECRET"] || "";
  const origin = requestOrigin(req);
  const currentUrl = routeUrl(req, `/api/auth-${provider}-callback`);
  const code = currentUrl.searchParams.get("code") || "";
  const state = currentUrl.searchParams.get("state") || "";
  const statePayload = readOAuthState(req);
  const providerLabel = isGoogle ? "Google" : "Microsoft";

  if (!clientId || !clientSecret) {
    json(res, 501, { ok: false, needsConfig: true, error: `Login ${providerLabel} ainda nao esta configurado.` });
    return;
  }
  if (!code || !statePayload || statePayload.provider !== provider || statePayload.state !== state) {
    json(res, 400, { ok: false, error: "Estado de login invalido ou expirado. Tente entrar novamente." });
    return;
  }

  try {
    const tokenResponse = await fetch(isGoogle
      ? "https://oauth2.googleapis.com/token"
      : "https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth-${provider}-callback`,
        grant_type: "authorization_code"
      })
    });
    const tokens = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokens.id_token) {
      json(res, 502, { ok: false, error: `${providerLabel} nao concluiu o login.`, details: tokens.error || tokens.error_description || "" });
      return;
    }

    const claims = decodeJwtPayload(tokens.id_token);
    if (isGoogle) {
      const allowedIssuers = ["https://accounts.google.com", "accounts.google.com"];
      if (claims.aud !== clientId || !allowedIssuers.includes(claims.iss) || claims.email_verified !== true) {
        json(res, 401, { ok: false, error: "Conta Google nao validada para login." });
        return;
      }
    }
    const email = isGoogle ? claims.email : (claims.email || claims.preferred_username || claims.upn || "");
    if (claims.aud !== clientId || !email) {
      json(res, 401, { ok: false, error: `Conta ${providerLabel} nao validada para login.` });
      return;
    }

    const sessionToken = createSession({
      email,
      name: claims.name || email,
      picture: isGoogle ? (claims.picture || "") : ""
    }, provider);
    setSessionCookie(res, sessionToken);
    clearOAuthStateCookie(res);
    redirect(res, statePayload.returnTo || "/fase2/minha-conta.html");
  } catch (error) {
    json(res, 500, { ok: false, error: error.message || `Erro no login ${providerLabel}.` });
  }
}

async function authLogout(req, res) {
  clearSessionCookie(res);
  const returnTo = routeUrl(req, "/api/account").searchParams.get("returnTo") || "/";
  redirect(res, safeReturnTo(returnTo));
}

async function admin(req, res) {
  if (req.method !== "GET") {
    sendHtml(res, 405, "<p>Metodo nao permitido.</p>");
    return;
  }

  const origin = requestOrigin(req);
  const url = routeUrl(req, "/admin");
  const returnTo = url.pathname.startsWith("/api/") ? "/admin" : `${url.pathname}${url.search}`;
  const session = sessionFromRequest(req);
  const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  if (!session) {
    sendHtml(res, 401, loginGate(origin, returnTo || "/admin", googleConfigured));
    return;
  }

  if (!isAdminEmail(session.email)) {
    sendHtml(res, 403, forbiddenGate(session.email));
    return;
  }

  try {
    const html = await fs.readFile(ADMIN_HTML, "utf8");
    sendHtml(res, 200, html);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    redirect(res, "/fase2/minha-conta.html");
  }
}

async function handleAccountRoute(req, res) {
  const action = routeAction(req);
  if (action === "session") return authSession(req, res);
  if (action === "customer-orders") return customerOrders(req, res);
  if (action === "google-start") return authProviderStart(req, res, "google");
  if (action === "google-callback") return authProviderCallback(req, res, "google");
  if (action === "microsoft-start") return authProviderStart(req, res, "microsoft");
  if (action === "microsoft-callback") return authProviderCallback(req, res, "microsoft");
  if (action === "logout") return authLogout(req, res);
  if (action === "admin") return admin(req, res);
  json(res, 404, { ok: false, error: "Rota de conta nao encontrada." });
}

module.exports = {
  handleAccountRoute
};
