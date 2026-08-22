import express from 'express';
import { dbConnect } from '../db.js';
import SiteContent from '../models/SiteContent.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/content — public readable
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const items = await SiteContent.find().sort({ section: 1, key: 1 });
    // Group by section
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = {};
      acc[item.section][item.key] = item.value;
      return acc;
    }, {});
    res.json({ content: grouped, raw: items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:section/:key', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const item = await SiteContent.findOneAndUpdate(
      { section: req.params.section, key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json({ item });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
