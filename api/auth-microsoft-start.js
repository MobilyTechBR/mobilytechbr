const crypto = require("crypto");
const {
  json,
  requestOrigin,
  safeReturnTo,
  setOAuthStateCookie
} = require("../lib/auth-session");

module.exports = async function authMicrosoftStart(req, res) {
  const clientId = process.env.MICROSOFT_CLIENT_ID || "";
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) {
    json(res, 501, {
      ok: false,
      needsConfig: true,
      error: "Configure MICROSOFT_CLIENT_ID e MICROSOFT_CLIENT_SECRET na Vercel para ativar login Microsoft."
    });
    return;
  }

  const origin = requestOrigin(req);
  const currentUrl = new URL(req.url || "/api/auth-microsoft-start", origin);
  const state = crypto.randomBytes(24).toString("base64url");
  const returnTo = safeReturnTo(currentUrl.searchParams.get("returnTo"));
  setOAuthStateCookie(res, { provider: "microsoft", state, returnTo });

  const authorizeUrl = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", `${origin}/api/auth-microsoft-callback`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "openid email profile");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("prompt", "select_account");

  res.statusCode = 302;
  res.setHeader("Location", authorizeUrl.toString());
  res.setHeader("Cache-Control", "no-store");
  res.end();
};
