import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || 'spot-tours-secret-fallback';
const COOKIE_NAME = 'spot_admin_token';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${isProd ? '; Secure' : ''}`
  );
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  );
}

export function getTokenFromRequest(req) {
  // Check cookie first
  const cookieHeader = req.headers.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const [k, ...v] = c.trim().split('=');
    if (k) cookies[k.trim()] = decodeURIComponent(v.join('='));
  });
  if (cookies[COOKIE_NAME]) return cookies[COOKIE_NAME];

  // Fallback: Authorization header
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);

  return null;
}
