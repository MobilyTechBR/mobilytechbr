const {
  json,
  publicUser,
  sessionFromRequest
} = require("../lib/auth-session");

module.exports = async function authSession(req, res) {
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
};
