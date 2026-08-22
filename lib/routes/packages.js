import express from 'express';
import { dbConnect } from '../db.js';
import Package from '../models/Package.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/packages — public, active only
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const packages = await Package.find({ active: true }).sort({ popular: -1, createdAt: -1 });
    res.json({ packages });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/packages/all — admin: all packages including inactive
router.get('/all', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json({ packages });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/packages/:id — public
router.get('/:id', async (req, res) => {
  try {
    await dbConnect();
    const pkg = await Package.findOne({ id: req.params.id });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json({ package: pkg });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/packages — admin
router.post('/', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    // Auto-generate id from title if not provided
    if (!req.body.id) {
      req.body.id = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    const pkg = await Package.create(req.body);
    res.status(201).json({ package: pkg });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/packages/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const idParam = req.params.id;
    const isObjectId = idParam && idParam.length === 24 && /^[0-9a-fA-F]{24}$/.test(idParam);
    const filter = isObjectId ? { $or: [{ _id: idParam }, { id: idParam }] } : { id: idParam };
    const pkg = await Package.findOneAndUpdate(filter, { $set: req.body }, { new: true, runValidators: false });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json({ package: pkg });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/packages/:id — admin (soft delete)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const idParam = req.params.id;
    const isObjectId = idParam && idParam.length === 24 && /^[0-9a-fA-F]{24}$/.test(idParam);
    const filter = isObjectId ? { $or: [{ _id: idParam }, { id: idParam }] } : { id: idParam };
    await Package.findOneAndUpdate(filter, { active: false });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
