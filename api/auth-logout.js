const {
  clearSessionCookie,
  redirect,
  safeReturnTo
} = require("../lib/auth-session");

module.exports = async function authLogout(req, res) {
  clearSessionCookie(res);
  redirect(res, safeReturnTo(req.query?.returnTo || "/"));
};
