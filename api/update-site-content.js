const { sessionFromRequest } = require("../lib/auth-session");

const MAX_BODY_BYTES = 220 * 1024;
const TARGET_PATH = "data/site-content.json";

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Payload muito grande para site-content.json.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function respond(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function stringEquals(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  return left.length === right.length && require("crypto").timingSafeEqual(left, right);
}

function hasAdminAccess(req, body) {
  const session = sessionFromRequest(req);
  if (session && session.admin) return { ok: true, mode: "admin-session", email: session.email };
  const configuredToken = process.env.ADMIN_WRITE_TOKEN || "";
  const providedToken = req.headers["x-admin-token"] || body.adminToken || "";
  if (configuredToken && stringEquals(providedToken, configuredToken)) return { ok: true, mode: "admin-token" };
  return { ok: false };
}

function cleanContent(content) {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    throw new Error("siteContent deve ser um objeto JSON.");
  }
  const allowedTopLevel = new Set(["homeHero", "servicePanels", "pages"]);
  const cleaned = {};
  for (const [key, value] of Object.entries(content)) {
    if (!allowedTopLevel.has(key)) continue;
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    cleaned[key] = value;
  }
  if (!cleaned.homeHero && !cleaned.servicePanels && !cleaned.pages) {
    throw new Error("JSON nao contem campos editaveis conhecidos.");
  }
  JSON.stringify(cleaned);
  return cleaned;
}

function githubConfig() {
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

async function githubRequest(url, options) {
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
    error.body = body;
    throw error;
  }
  return body;
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
    respond(res, 405, { ok: false, error: "Metodo nao permitido." });
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    respond(res, error.statusCode || 400, { ok: false, error: error.message || "JSON invalido." });
    return;
  }

  const auth = hasAdminAccess(req, body);
  if (!auth.ok) {
    respond(res, 401, { ok: false, error: "Acesso administrativo obrigatorio." });
    return;
  }

  let content;
  try {
    content = cleanContent(body.siteContent || body.content || body);
  } catch (error) {
    respond(res, 400, { ok: false, error: error.message || "site-content.json invalido." });
    return;
  }

  const config = githubConfig();
  if (!config.token) {
    respond(res, 501, {
      ok: false,
      needsConfig: true,
      error: "Configure GITHUB_CONTENT_WRITE_TOKEN na Vercel para salvar direto no GitHub. O download do JSON continua disponivel como fallback."
    });
    return;
  }

  const apiPath = encodeURIComponent(TARGET_PATH).replace(/%2F/g, "/");
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${apiPath}?ref=${encodeURIComponent(config.branch)}`;
  const authHeader = { Authorization: `Bearer ${config.token}` };

  try {
    const current = await githubRequest(url, { method: "GET", headers: authHeader });
    const nextContent = JSON.stringify(content, null, 2) + "\n";
    const currentContent = current.content
      ? Buffer.from(String(current.content).replace(/\s/g, ""), "base64").toString("utf8")
      : "";

    if (currentContent === nextContent) {
      respond(res, 200, {
        ok: true,
        noChange: true,
        authMode: auth.mode,
        message: "site-content.json ja esta atualizado."
      });
      return;
    }

    const result = await githubRequest(url, {
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

    respond(res, 200, {
      ok: true,
      path: TARGET_PATH,
      branch: config.branch,
      commitSha: result.commit && result.commit.sha,
      commitUrl: result.commit && result.commit.html_url,
      message: "site-content.json salvo no GitHub. A Vercel deve publicar a alteracao automaticamente."
    });
  } catch (error) {
    respond(res, error.statusCode || 502, {
      ok: false,
      error: error.message || "Erro ao salvar site-content.json no GitHub."
    });
  }
};
