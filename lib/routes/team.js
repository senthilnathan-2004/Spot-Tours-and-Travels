import express from 'express';
import { dbConnect } from '../db.js';
import TeamMember from '../models/TeamMember.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ members });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const count = await TeamMember.countDocuments();
    const member = await TeamMember.create({ ...req.body, order: count });
    res.status(201).json({ member });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ member });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
