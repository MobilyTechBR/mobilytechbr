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
const {
  getDropifyProduct,
  isDropifyConfigured,
  isDropifyFreightConfigured,
  listDropifyProducts,
  normalizeDropifyProduct,
  normalizeProductArray
} = require("./dropify");

const ADMIN_HTML = path.join(process.cwd(), "private", "admin", "index.html");
const SITE_CONTENT_MAX_BODY_BYTES = 900 * 1024;
const SITE_CONTENT_TARGET_PATH = "data/site-content.json";
const CATALOG_CONTENT_MAX_BODY_BYTES = 6 * 1024 * 1024;
const CATALOG_WRITE_TARGETS = new Map([
  ["site-content", { path: "data/site-content.json", kind: "object" }],
  ["products", { path: "data/products.json", kind: "array" }],
  ["phase2-finalists", { path: "data/phase2-finalists.json", kind: "object" }],
  ["addons", { path: "data/addons.json", kind: "array" }],
  ["swaps", { path: "data/swaps.json", kind: "array" }]
]);
const MEDIA_UPLOAD_MAX_BODY_BYTES = 12 * 1024 * 1024;
const MEDIA_UPLOAD_MAX_FILE_BYTES = 8 * 1024 * 1024;
const MEDIA_UPLOAD_TARGET_DIR = "assets/uploads";
const MEDIA_UPLOAD_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence"
]);
const MEDIA_UPLOAD_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif", "heic", "heif"]);
const FAVICON_VERSION = "20260621";

function faviconHeadTags() {
  return [
    `<link rel="icon" type="image/x-icon" href="/assets/favicon.ico?v=${FAVICON_VERSION}" sizes="any">`,
    `<link rel="shortcut icon" href="/assets/favicon.ico?v=${FAVICON_VERSION}">`,
    `<link rel="icon" type="image/png" href="/assets/favicon.png?v=${FAVICON_VERSION}" sizes="256x256">`,
    `<link rel="apple-touch-icon" href="/assets/favicon.png?v=${FAVICON_VERSION}">`
  ].join("\n    ");
}

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
    "update-site-content": "update-site-content",
    "update-catalog-file": "update-catalog-file",
    "upload-media": "upload-media",
    "remove-background": "remove-background",
    "dropify-products": "dropify-products",
    "dropify-webhook": "dropify-webhook",
    admin: "admin"
  }[key] || "";
}

async function readJsonBody(req, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBytes) {
      const error = new Error("Payload muito grande.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(buffer);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function readRawBody(req, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBytes) {
      const error = new Error("Payload muito grande.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
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

function stringEquals(leftValue, rightValue) {
  const left = Buffer.from(String(leftValue || ""));
  const right = Buffer.from(String(rightValue || ""));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function hasAdminWriteAccess(req, body) {
  const session = sessionFromRequest(req);
  if (session && session.admin) return { ok: true, mode: "admin-session", email: session.email };
  const configuredToken = process.env.ADMIN_WRITE_TOKEN || "";
  const providedToken = req.headers["x-admin-token"] || body.adminToken || "";
  if (configuredToken && stringEquals(providedToken, configuredToken)) return { ok: true, mode: "admin-token" };
  return { ok: false };
}

function cleanSiteContent(content) {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    throw new Error("siteContent deve ser um objeto JSON.");
  }
  const allowedTopLevel = new Set(["featureFlags", "homeHero", "homeFeaturedProducts", "servicePanels", "pages", "maintenance", "pageBuilder", "customPages"]);
  const cleaned = {};
  for (const [key, value] of Object.entries(content)) {
    if (!allowedTopLevel.has(key)) continue;
    if (key === "customPages") {
      if (Array.isArray(value)) cleaned[key] = value;
      continue;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    cleaned[key] = value;
  }
  if (!Object.keys(cleaned).length) {
    throw new Error("JSON nao contem campos editaveis conhecidos.");
  }
  JSON.stringify(cleaned);
  return cleaned;
}

function catalogWriteTarget(value) {
  const key = String(value || "")
    .replace(/^data\//, "")
    .replace(/\.json$/i, "")
    .trim();
  return CATALOG_WRITE_TARGETS.get(key) || null;
}

function cleanCatalogContent(target, content) {
  if (!target) throw new Error("Arquivo de destino nao permitido.");
  if (target.path === SITE_CONTENT_TARGET_PATH) return cleanSiteContent(content);
  if (target.kind === "array") {
    if (!Array.isArray(content)) throw new Error("O arquivo precisa ser uma lista JSON.");
    JSON.stringify(content);
    return content;
  }
  if (target.path === "data/phase2-finalists.json") {
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      throw new Error("phase2-finalists.json precisa ser um objeto JSON.");
    }
    if (!Array.isArray(content.finalists)) {
      throw new Error("phase2-finalists.json precisa conter finalists[].");
    }
    JSON.stringify(content);
    return content;
  }
  throw new Error("Tipo de arquivo administrativo nao suportado.");
}

function githubContentConfig() {
  const repo = process.env.GITHUB_REPO || "MobilyTechBR/mobilytechbr";
  const [owner, name] = repo.includes("/")
    ? repo.split("/", 2)
    : [process.env.GITHUB_OWNER || "MobilyTechBR", repo];
  return {
    token: process.env.GITHUB_CONTENT_WRITE_TOKEN || process.env.MOBILYTECH_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "",
    owner,
    repo: name || "mobilytechbr",
    branch: process.env.GITHUB_BRANCH || "main"
  };
}

function cleanMediaStem(value) {
  return String(value || "imagem")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "imagem";
}

function mediaExtensionFromMime(mimeType) {
  return {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/heic-sequence": "heic",
    "image/heif-sequence": "heif"
  }[String(mimeType || "").toLowerCase()] || "";
}

function mediaMimeFromExtension(extension) {
  return {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    heif: "image/heif"
  }[String(extension || "").toLowerCase()] || "application/octet-stream";
}

function sniffImageBuffer(buffer, extension) {
  const ext = String(extension || "").toLowerCase();
  if (ext === "png") return buffer.length > 8 && buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (ext === "jpg" || ext === "jpeg") return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (ext === "gif") return buffer.length > 6 && ["GIF87a", "GIF89a"].includes(buffer.slice(0, 6).toString("ascii"));
  if (ext === "webp") return buffer.length > 12 && buffer.slice(0, 4).toString("ascii") === "RIFF" && buffer.slice(8, 12).toString("ascii") === "WEBP";
  if (ext === "heic" || ext === "heif") {
    if (buffer.length < 12 || buffer.slice(4, 8).toString("ascii") !== "ftyp") return false;
    const brands = buffer.slice(8, Math.min(buffer.length, 64)).toString("ascii");
    return /(heic|heix|hevc|hevx|heim|heis|hevm|hevs|mif1|msf1)/.test(brands);
  }
  return false;
}

function cleanMediaUpload(body) {
  const filename = String(body.filename || body.name || "imagem").replace(/\\/g, "/").split("/").pop();
  const requestedMime = String(body.mimeType || body.type || "").toLowerCase();
  const rawExtension = String(path.extname(filename || "")).replace(".", "").toLowerCase();
  const extension = rawExtension || mediaExtensionFromMime(requestedMime);
  const mimeType = MEDIA_UPLOAD_MIME_TYPES.has(requestedMime) ? requestedMime : "";
  if (!MEDIA_UPLOAD_EXTENSIONS.has(extension)) {
    throw new Error("Formato de imagem nao permitido. Use JPG, PNG, WebP, GIF, HEIC ou HEIF.");
  }
  if (requestedMime && !mimeType) {
    throw new Error("Tipo MIME de imagem nao permitido.");
  }

  const rawBase64 = String(body.dataBase64 || body.base64 || "")
    .replace(/^data:[^;]+;base64,/, "")
    .replace(/\s/g, "");
  if (!rawBase64) throw new Error("Arquivo de imagem vazio.");

  const buffer = Buffer.from(rawBase64, "base64");
  if (!buffer.length || buffer.length > MEDIA_UPLOAD_MAX_FILE_BYTES) {
    throw new Error("Imagem muito grande. Use ate 8 MB por arquivo.");
  }
  if (!sniffImageBuffer(buffer, extension)) {
    throw new Error("O arquivo nao parece ser uma imagem valida para a extensao enviada.");
  }

  const stem = cleanMediaStem(path.basename(filename || "imagem", path.extname(filename || "")));
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const suffix = crypto.randomBytes(4).toString("hex");
  const targetPath = `${MEDIA_UPLOAD_TARGET_DIR}/${stem}-${timestamp}-${suffix}.${extension === "jpeg" ? "jpg" : extension}`;
  return {
    buffer,
    targetPath,
    mimeType: mimeType || mediaMimeFromExtension(extension)
  };
}

async function githubContentRequest(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "MobilyTechBR-admin",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch (_error) {
    body = { raw: text };
  }
  if (!response.ok) {
    const message = body.message || `GitHub retornou ${response.status}.`;
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }
  return body;
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
    ${faviconHeadTags()}
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
    ${faviconHeadTags()}
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

async function updateSiteContent(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req, SITE_CONTENT_MAX_BODY_BYTES);
  } catch (error) {
    json(res, error.statusCode || 400, { ok: false, error: error.message || "JSON invalido." });
    return;
  }

  const auth = hasAdminWriteAccess(req, body);
  if (!auth.ok) {
    json(res, 401, { ok: false, error: "Acesso administrativo obrigatorio." });
    return;
  }

  let content;
  try {
    content = cleanSiteContent(body.siteContent || body.content || body);
  } catch (error) {
    json(res, 400, { ok: false, error: error.message || "site-content.json invalido." });
    return;
  }

  const config = githubContentConfig();
  if (!config.token) {
    json(res, 501, {
      ok: false,
      needsConfig: true,
      error: "Configure GITHUB_CONTENT_WRITE_TOKEN na Vercel para salvar direto no GitHub. O download do JSON continua disponivel como fallback."
    });
    return;
  }

  const apiPath = encodeURIComponent(SITE_CONTENT_TARGET_PATH).replace(/%2F/g, "/");
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${apiPath}?ref=${encodeURIComponent(config.branch)}`;
  const authHeader = { Authorization: `Bearer ${config.token}` };

  try {
    const current = await githubContentRequest(url, { method: "GET", headers: authHeader });
    const nextContent = JSON.stringify(content, null, 2) + "\n";
    const currentContent = current.content
      ? Buffer.from(String(current.content).replace(/\s/g, ""), "base64").toString("utf8")
      : "";

    if (currentContent === nextContent) {
      json(res, 200, {
        ok: true,
        noChange: true,
        authMode: auth.mode,
        message: "site-content.json ja esta atualizado."
      });
      return;
    }

    const result = await githubContentRequest(url, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify({
        message: "Update site content from MobilyTech admin",
        content: Buffer.from(nextContent, "utf8").toString("base64"),
        sha: current.sha,
        branch: config.branch,
        committer: {
          name: "MobilyTech BR Admin",
          email: "mobilytechbr@gmail.com"
        }
      })
    });

    json(res, 200, {
      ok: true,
      path: SITE_CONTENT_TARGET_PATH,
      branch: config.branch,
      commitSha: result.commit && result.commit.sha,
      commitUrl: result.commit && result.commit.html_url,
      message: "site-content.json salvo no GitHub. A Vercel deve reconstruir o site e publicar a alteracao automaticamente em instantes."
    });
  } catch (error) {
    json(res, error.statusCode || 502, {
      ok: false,
      error: error.message || "Erro ao salvar site-content.json no GitHub."
    });
  }
}

async function updateCatalogFile(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req, CATALOG_CONTENT_MAX_BODY_BYTES);
  } catch (error) {
    json(res, error.statusCode || 400, { ok: false, error: error.message || "JSON invalido." });
    return;
  }

  const auth = hasAdminWriteAccess(req, body);
  if (!auth.ok) {
    json(res, 401, { ok: false, error: "Acesso administrativo obrigatorio." });
    return;
  }

  const target = catalogWriteTarget(body.target || body.path || body.file);
  let content;
  try {
    content = cleanCatalogContent(target, body.content || body.data);
  } catch (error) {
    json(res, 400, { ok: false, error: error.message || "Arquivo administrativo invalido." });
    return;
  }

  const config = githubContentConfig();
  if (!config.token) {
    json(res, 501, {
      ok: false,
      needsConfig: true,
      error: "Configure GITHUB_CONTENT_WRITE_TOKEN na Vercel para salvar direto no GitHub. O download do JSON continua disponivel como fallback."
    });
    return;
  }

  const apiPath = encodeURIComponent(target.path).replace(/%2F/g, "/");
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${apiPath}?ref=${encodeURIComponent(config.branch)}`;
  const authHeader = { Authorization: `Bearer ${config.token}` };

  try {
    const current = await githubContentRequest(url, { method: "GET", headers: authHeader });
    const nextContent = JSON.stringify(content, null, 2) + "\n";
    const currentContent = current.content
      ? Buffer.from(String(current.content).replace(/\s/g, ""), "base64").toString("utf8")
      : "";

    if (currentContent === nextContent) {
      json(res, 200, {
        ok: true,
        noChange: true,
        path: target.path,
        authMode: auth.mode,
        message: `${target.path} ja esta atualizado.`
      });
      return;
    }

    const result = await githubContentRequest(url, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify({
        message: `Update ${target.path} from MobilyTech admin`,
        content: Buffer.from(nextContent, "utf8").toString("base64"),
        sha: current.sha,
        branch: config.branch,
        committer: {
          name: "MobilyTech BR Admin",
          email: "mobilytechbr@gmail.com"
        }
      })
    });

    json(res, 200, {
      ok: true,
      path: target.path,
      branch: config.branch,
      commitSha: result.commit && result.commit.sha,
      commitUrl: result.commit && result.commit.html_url,
      message: `${target.path} salvo no GitHub. A Vercel deve publicar a alteracao automaticamente em instantes.`
    });
  } catch (error) {
    json(res, error.statusCode || 502, {
      ok: false,
      error: error.message || `Erro ao salvar ${target.path} no GitHub.`
    });
  }
}

async function uploadMedia(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req, MEDIA_UPLOAD_MAX_BODY_BYTES);
  } catch (error) {
    json(res, error.statusCode || 400, { ok: false, error: error.message || "JSON invalido." });
    return;
  }

  const auth = hasAdminWriteAccess(req, body);
  if (!auth.ok) {
    json(res, 401, { ok: false, error: "Acesso administrativo obrigatorio." });
    return;
  }

  let upload;
  try {
    upload = cleanMediaUpload(body);
  } catch (error) {
    json(res, 400, { ok: false, error: error.message || "Imagem invalida." });
    return;
  }

  const config = githubContentConfig();
  if (!config.token) {
    json(res, 501, {
      ok: false,
      needsConfig: true,
      error: "Configure GITHUB_CONTENT_WRITE_TOKEN na Vercel para enviar imagens direto ao GitHub."
    });
    return;
  }

  const apiPath = encodeURIComponent(upload.targetPath).replace(/%2F/g, "/");
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${apiPath}`;
  const authHeader = { Authorization: `Bearer ${config.token}` };

  try {
    const result = await githubContentRequest(url, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify({
        message: "Upload admin media asset",
        content: upload.buffer.toString("base64"),
        branch: config.branch,
        committer: {
          name: "MobilyTech BR Admin",
          email: "mobilytechbr@gmail.com"
        }
      })
    });

    json(res, 200, {
      ok: true,
      path: upload.targetPath,
      publicPath: `./${upload.targetPath}`,
      mimeType: upload.mimeType,
      branch: config.branch,
      commitSha: result.commit && result.commit.sha,
      message: "Imagem enviada ao GitHub. Salve o conteudo do site para publicar a referencia."
    });
  } catch (error) {
    json(res, error.statusCode || 502, {
      ok: false,
      error: error.message || "Erro ao enviar imagem ao GitHub."
    });
  }
}

async function removeBackground(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req, MEDIA_UPLOAD_MAX_BODY_BYTES);
  } catch (error) {
    json(res, error.statusCode || 400, { ok: false, error: error.message || "JSON invalido." });
    return;
  }

  const auth = hasAdminWriteAccess(req, body);
  if (!auth.ok) {
    json(res, 401, { ok: false, error: "Acesso administrativo obrigatorio." });
    return;
  }

  json(res, 501, {
    ok: false,
    needsConfig: true,
    error: "Remocao por IA ainda nao tem provedor configurado. Use Remover fundo por cor como fallback gratuito no painel."
  });
}

async function dropifyProducts(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
    res.end();
    return;
  }

  if (!["GET", "POST"].includes(req.method)) {
    json(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  let body = {};
  if (req.method === "POST") {
    try {
      body = await readJsonBody(req, SITE_CONTENT_MAX_BODY_BYTES);
    } catch (error) {
      json(res, error.statusCode || 400, { ok: false, error: error.message || "JSON invalido." });
      return;
    }
  }
  const auth = hasAdminWriteAccess(req, body);
  if (!auth.ok) {
    json(res, 401, { ok: false, error: "Acesso administrativo necessario." });
    return;
  }

  if (!isDropifyConfigured()) {
    json(res, 501, {
      ok: false,
      configured: false,
      freightConfigured: isDropifyFreightConfigured(),
      error: "Credenciais Dropify ainda nao configuradas na Vercel."
    });
    return;
  }

  try {
    const url = routeUrl(req, "/api/dropify-products");
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
    json(res, 200, {
      ok: true,
      configured: true,
      freightConfigured: isDropifyFreightConfigured(),
      count: products.length,
      products,
      pagination: raw.pagination || raw.meta || null
    });
  } catch (error) {
    json(res, error.statusCode || 500, {
      ok: false,
      error: error.message || "Erro ao consultar produtos Dropify.",
      code: error.code,
      details: error.details
    });
  }
}

function verifyDropifyWebhook(req, rawBody) {
  const secret = process.env.DROPIFY_WEBHOOK_SECRET || "";
  if (!secret) return { ok: true, mode: "no-secret-configured" };

  const provided = String(
    req.headers["x-dropify-signature"]
    || req.headers["x-webhook-signature"]
    || req.headers["x-hub-signature-256"]
    || ""
  ).replace(/^sha256=/i, "");
  if (!provided) return { ok: false, reason: "missing-signature" };

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return stringEquals(provided, expected)
    ? { ok: true, mode: "hmac-sha256" }
    : { ok: false, reason: "invalid-signature" };
}

async function dropifyWebhook(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  try {
    const rawBody = await readRawBody(req, SITE_CONTENT_MAX_BODY_BYTES);
    const verification = verifyDropifyWebhook(req, rawBody);
    if (!verification.ok) {
      json(res, 401, { ok: false, error: "Assinatura Dropify invalida.", reason: verification.reason });
      return;
    }

    const body = rawBody.length ? JSON.parse(rawBody.toString("utf8")) : {};
    console.log("Dropify webhook received", {
      event: body.event || body.type || body.action || "",
      sku: body.sku || body.productSku || body.data?.sku || "",
      mode: verification.mode
    });
    json(res, 200, { ok: true, received: true });
  } catch (error) {
    json(res, error.statusCode || 400, { ok: false, error: error.message || "Webhook Dropify invalido." });
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
  if (action === "update-site-content") return updateSiteContent(req, res);
  if (action === "update-catalog-file") return updateCatalogFile(req, res);
  if (action === "upload-media") return uploadMedia(req, res);
  if (action === "remove-background") return removeBackground(req, res);
  if (action === "dropify-products") return dropifyProducts(req, res);
  if (action === "dropify-webhook") return dropifyWebhook(req, res);
  if (action === "admin") return admin(req, res);
  json(res, 404, { ok: false, error: "Rota de conta nao encontrada." });
}

module.exports = {
  handleAccountRoute
};
