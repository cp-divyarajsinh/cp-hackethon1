const crypto = require('crypto');

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  return process.env.AUTH_SECRET || 'calliq-dev-secret-change-in-production';
}

/**
 * Stateless signed session (works across multiple Node workers; survives server restarts until expiry).
 * Format: base64url(payloadJson).base64url(hmacSha256)
 */
function createSession(username) {
  const exp = Date.now() + MAX_AGE_MS;
  const payload = Buffer.from(JSON.stringify({ u: username, exp }), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySession(token) {
  if (!token || typeof token !== 'string') return null;
  const i = token.lastIndexOf('.');
  if (i <= 0) return null;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!data.u || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
  return { username: data.u };
}

/** Legacy no-op; sessions are stateless. */
function destroySession() {}

module.exports = { createSession, verifySession, destroySession, MAX_AGE_MS };
