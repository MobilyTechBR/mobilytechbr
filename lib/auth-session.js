const crypto = require("crypto");

const SESSION_COOKIE = "mtb_session";
const OAUTH_STATE_COOKIE = "mtb_oauth_state";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;
const OAUTH_STATE_TTL_SECONDS = 60 * 10;
const DEFAULT_ADMIN_EMAILS = [
  "mobilytechbr@gmail.com",
  "julian.l.escribano@gmail.com"
];

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64url(input) {
  const normalized = String(input || "").replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function sessionSecret() {
  return process.env.AUTH_SESSION_SECRET || process.env.ADMIN_WRITE_TOKEN || "";
}

function signToken(payload, ttlSeconds) {
  const secret = sessionSecret();
  if (!secret) throw new Error("AUTH_SESSION_SECRET ou ADMIN_WRITE_TOKEN nao configurado.");
  const now = Math.floor(Date.now() / 1000);
  const body = base64url(JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds }));
  const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyToken(token) {
  const secret = sessionSecret();
  if (!secret || !token || !String(token).includes(".")) return null;
  const [body, signature] = String(token).split(".");
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  const given = Buffer.from(signature || "");
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) return null;
  try {
    const payload = JSON.parse(fromBase64url(body));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_error) {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index < 0) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || "/"}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.httpOnly !== false) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure !== false) parts.push("Secure");
  return parts.join("; ");
}

function appendSetCookie(res, cookie) {
  const existing = res.getHeader("Set-Cookie");
  if (!existing) {
    res.setHeader("Set-Cookie", cookie);
  } else if (Array.isArray(existing)) {
    res.setHeader("Set-Cookie", [...existing, cookie]);
  } else {
    res.setHeader("Set-Cookie", [existing, cookie]);
  }
}

function allowedAdminEmails() {
  const configured = String(process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(/[,\s;]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ADMIN_EMAILS, ...configured])];
}

function isAdminEmail(email) {
  return allowedAdminEmails().includes(String(email || "").toLowerCase());
}

function publicUser(payload) {
  if (!payload || !payload.email) return null;
  return {
    email: payload.email,
    name: payload.name || "",
    picture: payload.picture || "",
    provider: payload.provider || "google"
  };
}

function sessionFromRequest(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  const payload = verifyToken(token);
  if (!payload || !payload.email) return null;
  return {
    ...payload,
    admin: isAdminEmail(payload.email)
  };
}

function createSession(user, provider) {
  const email = String(user.email || "").toLowerCase();
  if (!email) throw new Error("Conta sem e-mail confirmado.");
  return signToken({
    email,
    name: user.name || email,
    picture: user.picture || "",
    provider,
    admin: isAdminEmail(email)
  }, SESSION_TTL_SECONDS);
}

function setSessionCookie(res, token) {
  appendSetCookie(res, serializeCookie(SESSION_COOKIE, token, {
    maxAge: SESSION_TTL_SECONDS,
    httpOnly: true,
    sameSite: "Lax"
  }));
}

function clearSessionCookie(res) {
  appendSetCookie(res, serializeCookie(SESSION_COOKIE, "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "Lax"
  }));
}

function setOAuthStateCookie(res, statePayload) {
  const token = signToken(statePayload, OAUTH_STATE_TTL_SECONDS);
  appendSetCookie(res, serializeCookie(OAUTH_STATE_COOKIE, token, {
    maxAge: OAUTH_STATE_TTL_SECONDS,
    httpOnly: true,
    sameSite: "Lax"
  }));
}

function readOAuthState(req) {
  return verifyToken(parseCookies(req)[OAUTH_STATE_COOKIE]);
}

function clearOAuthStateCookie(res) {
  appendSetCookie(res, serializeCookie(OAUTH_STATE_COOKIE, "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "Lax"
  }));
}

function requestOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "www.mobilytech.com.br";
  return process.env.PUBLIC_SITE_ORIGIN || `${proto}://${host}`;
}

function safeReturnTo(value, fallback = "/fase2/minha-conta.html") {
  const raw = String(value || fallback);
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return fallback;
  return raw;
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function redirect(res, location, status = 302) {
  res.statusCode = status;
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

module.exports = {
  SESSION_COOKIE,
  OAUTH_STATE_COOKIE,
  allowedAdminEmails,
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
  setSessionCookie,
  signToken,
  verifyToken
};
