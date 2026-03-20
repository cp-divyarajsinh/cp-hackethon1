const { verifySession, destroySession } = require('../services/sessionService');

const COOKIE_NAME = 'calliq_session';

function parseCookies(header) {
  const out = {};
  if (!header || typeof header !== 'string') return out;
  header.split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i === -1) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    out[k] = decodeURIComponent(v);
  });
  return out;
}

function requireAuth(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  const session = verifySession(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.sessionId = token;
  req.user = session.username;
  next();
}

function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}

function setSessionCookie(res, token, maxAgeSec) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}`
  );
}

module.exports = {
  COOKIE_NAME,
  parseCookies,
  requireAuth,
  clearSessionCookie,
  setSessionCookie,
  destroySession, // from sessionService (re-export for routes)
};
