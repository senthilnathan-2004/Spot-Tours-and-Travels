import express from 'express';
import { dbConnect } from '../db.js';
import Destination from '../models/Destination.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/destinations — public (active only)
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const destinations = await Destination.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ destinations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/destinations/all — admin (all including inactive)
router.get('/all', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const destinations = await Destination.find().sort({ order: 1, createdAt: -1 });
    res.json({ destinations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/destinations/:id — public
router.get('/:id', async (req, res) => {
  try {
    await dbConnect();
    const dest = await Destination.findOne({ id: req.params.id });
    if (!dest) return res.status(404).json({ error: 'Destination not found' });
    res.json({ destination: dest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/destinations — admin
router.post('/', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    if (!req.body.name) {
      return res.status(400).json({ error: 'Destination name is required' });
    }
    if (!req.body.id) {
      req.body.id = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `dest-${Date.now()}`;
    }
    if (!req.body.banner) {
      req.body.banner = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800';
    }
    const dest = await Destination.create(req.body);
    res.status(201).json({ destination: dest });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/destinations/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const idParam = req.params.id;
    const isObjectId = idParam && idParam.length === 24 && /^[0-9a-fA-F]{24}$/.test(idParam);
    const filter = isObjectId 
      ? { $or: [{ _id: idParam }, { id: idParam }] }
      : { id: idParam };

    const dest = await Destination.findOneAndUpdate(
      filter,
      { $set: req.body },
      { new: true, runValidators: false }
    );
    if (!dest) return res.status(404).json({ error: 'Destination not found' });
    res.json({ destination: dest });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/destinations/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const idParam = req.params.id;
    const isObjectId = idParam && idParam.length === 24 && /^[0-9a-fA-F]{24}$/.test(idParam);
    const filter = isObjectId 
      ? { $or: [{ _id: idParam }, { id: idParam }] }
      : { id: idParam };

    await Destination.findOneAndDelete(filter);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
