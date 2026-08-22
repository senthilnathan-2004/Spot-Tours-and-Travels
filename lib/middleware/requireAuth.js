import { verifyToken, getTokenFromRequest } from '../auth.js';

export function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized — no token' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
  req.admin = payload;
  next();
}
