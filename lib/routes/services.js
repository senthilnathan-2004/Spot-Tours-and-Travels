import express from 'express';
import { dbConnect } from '../db.js';
import Service from '../models/Service.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/services — public (active only)
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const services = await Service.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json({ services });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/services/all — admin
router.get('/all', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json({ services });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/services — admin
router.post('/', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const service = await Service.create(req.body);
    res.status(201).json({ service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/services/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const idParam = req.params.id;
    const isObjectId = idParam && idParam.length === 24 && /^[0-9a-fA-F]{24}$/.test(idParam);
    let service;
    if (isObjectId) {
      service = await Service.findByIdAndUpdate(idParam, { $set: req.body }, { new: true });
    } else {
      service = await Service.findOneAndUpdate({ title: idParam }, { $set: req.body }, { new: true });
    }
    if (!service) {
      service = await Service.create(req.body);
    }
    res.json({ service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/services/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
