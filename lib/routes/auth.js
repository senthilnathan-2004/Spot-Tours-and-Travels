import express from 'express';
import bcrypt from 'bcryptjs';
import { dbConnect } from '../db.js';
import Admin from '../models/Admin.js';
import { signToken, setAuthCookie, clearAuthCookie, getTokenFromRequest, verifyToken } from '../auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    await dbConnect();
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.status(401).json({ error: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
    const token = signToken({ id: admin._id.toString(), email: admin.email, name: admin.name, role: admin.role });
    setAuthCookie(res, token);
    res.json({ success: true, token, admin: { email: admin.email, name: admin.name, role: admin.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid token' });
  res.json({ admin: { email: payload.email, name: payload.name, role: payload.role } });
});

export default router;
