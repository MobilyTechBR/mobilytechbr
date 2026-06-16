const {
  clearOAuthStateCookie,
  createSession,
  json,
  readOAuthState,
  redirect,
  requestOrigin,
  setSessionCookie
} = require("../lib/auth-session");

function decodeJwtPayload(token) {
  const part = String(token || "").split(".")[1];
  if (!part) return {};
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
}

module.exports = async function authMicrosoftCallback(req, res) {
  const clientId = process.env.MICROSOFT_CLIENT_ID || "";
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET || "";
  const origin = requestOrigin(req);
  const currentUrl = new URL(req.url || "/api/auth-microsoft-callback", origin);
  const code = currentUrl.searchParams.get("code") || "";
  const state = currentUrl.searchParams.get("state") || "";
  const statePayload = readOAuthState(req);

  if (!clientId || !clientSecret) {
    json(res, 501, { ok: false, needsConfig: true, error: "Login Microsoft ainda nao esta configurado." });
    return;
  }
  if (!code || !statePayload || statePayload.provider !== "microsoft" || statePayload.state !== state) {
    json(res, 400, { ok: false, error: "Estado de login invalido ou expirado. Tente entrar novamente." });
    return;
  }

  try {
    const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth-microsoft-callback`,
        grant_type: "authorization_code"
      })
    });
    const tokens = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokens.id_token) {
      json(res, 502, { ok: false, error: "Microsoft nao concluiu o login.", details: tokens.error || tokens.error_description || "" });
      return;
    }

    const claims = decodeJwtPayload(tokens.id_token);
    const email = claims.email || claims.preferred_username || claims.upn || "";
    if (claims.aud !== clientId || !email) {
      json(res, 401, { ok: false, error: "Conta Microsoft nao validada para login." });
      return;
    }

    const sessionToken = createSession({
      email,
      name: claims.name || email,
      picture: ""
    }, "microsoft");
    setSessionCookie(res, sessionToken);
    clearOAuthStateCookie(res);
    redirect(res, statePayload.returnTo || "/fase2/minha-conta.html");
  } catch (error) {
    json(res, 500, { ok: false, error: error.message || "Erro no login Microsoft." });
  }
};
