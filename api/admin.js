const fs = require("fs/promises");
const path = require("path");
const {
  isAdminEmail,
  redirect,
  requestOrigin,
  sessionFromRequest
} = require("../lib/auth-session");

const ADMIN_HTML = path.join(process.cwd(), "private", "admin", "index.html");

function sendHtml(res, status, html) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.end(html);
}

function loginGate(origin, returnTo, configured) {
  const loginUrl = configured
    ? `/api/auth-google-start?returnTo=${encodeURIComponent(returnTo)}`
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
      <p><a class="btn" href="/api/auth-logout?returnTo=/">Sair</a></p>
    </main>
  </body>
</html>`;
}

module.exports = async function admin(req, res) {
  if (req.method !== "GET") {
    sendHtml(res, 405, "<p>Metodo nao permitido.</p>");
    return;
  }

  const origin = requestOrigin(req);
  const url = new URL(req.url || "/admin", origin);
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
};
