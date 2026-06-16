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

module.exports = async function authGoogleCallback(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const origin = requestOrigin(req);
  const currentUrl = new URL(req.url || "/api/auth-google-callback", origin);
  const code = currentUrl.searchParams.get("code") || "";
  const state = currentUrl.searchParams.get("state") || "";
  const statePayload = readOAuthState(req);

  if (!clientId || !clientSecret) {
    json(res, 501, { ok: false, needsConfig: true, error: "Login Google ainda nao esta configurado." });
    return;
  }
  if (!code || !statePayload || statePayload.provider !== "google" || statePayload.state !== state) {
    json(res, 400, { ok: false, error: "Estado de login invalido ou expirado. Tente entrar novamente." });
    return;
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth-google-callback`,
        grant_type: "authorization_code"
      })
    });
    const tokens = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokens.id_token) {
      json(res, 502, { ok: false, error: "Google nao concluiu o login.", details: tokens.error || tokens.error_description || "" });
      return;
    }

    const claims = decodeJwtPayload(tokens.id_token);
    const allowedIssuers = ["https://accounts.google.com", "accounts.google.com"];
    if (claims.aud !== clientId || !allowedIssuers.includes(claims.iss) || claims.email_verified !== true) {
      json(res, 401, { ok: false, error: "Conta Google nao validada para login." });
      return;
    }

    const sessionToken = createSession({
      email: claims.email,
      name: claims.name || claims.email,
      picture: claims.picture || ""
    }, "google");
    setSessionCookie(res, sessionToken);
    clearOAuthStateCookie(res);
    redirect(res, statePayload.returnTo || "/fase2/minha-conta.html");
  } catch (error) {
    json(res, 500, { ok: false, error: error.message || "Erro no login Google." });
  }
};
