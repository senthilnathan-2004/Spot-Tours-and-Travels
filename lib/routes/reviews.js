import express from 'express';
import { dbConnect } from '../db.js';
import Review from '../models/Review.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/reviews — public (approved only)
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const reviews = await Review.find({ approved: true }).sort({ order: 1, createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reviews/all — admin
router.get('/all', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews — public (submit review) or admin
router.post('/', async (req, res) => {
  try {
    await dbConnect();
    const review = await Review.create({
      ...req.body,
      approved: req.body.approved !== undefined ? req.body.approved : true // auto-approve or moderate
    });
    res.status(201).json({ review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/reviews/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const idParam = req.params.id;
    const isObjectId = idParam && idParam.length === 24 && /^[0-9a-fA-F]{24}$/.test(idParam);
    let review;
    if (isObjectId) {
      review = await Review.findByIdAndUpdate(idParam, { $set: req.body }, { new: true });
    } else {
      review = await Review.findOneAndUpdate({ name: idParam }, { $set: req.body }, { new: true });
    }
    if (!review) {
      review = await Review.create(req.body);
    }
    res.json({ review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/reviews/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
