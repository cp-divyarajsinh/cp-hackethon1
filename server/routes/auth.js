const router = require('express').Router();
const { createSession, MAX_AGE_MS } = require('../services/sessionService');
const { requireAuth, clearSessionCookie, setSessionCookie, destroySession } = require('../middleware/auth');

const ADMIN_USER = process.env.AUTH_USERNAME || 'admin';
const ADMIN_PASS = process.env.AUTH_PASSWORD || 'password123';

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = createSession(username);
    setSessionCookie(res, token, Math.floor(MAX_AGE_MS / 1000));
    return res.json({ user: username });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

router.post('/logout', (req, res) => {
  destroySession();
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
