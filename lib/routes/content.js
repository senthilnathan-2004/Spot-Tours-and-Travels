import express from 'express';
import { dbConnect } from '../db.js';
import SiteContent from '../models/SiteContent.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/content — public readable
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const items = await SiteContent.find().sort({ section: 1, key: 1 }).lean();
    // Group by section
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = {};
      acc[item.section][item.key] = item.value;
      return acc;
    }, {});
    res.json({ content: grouped, raw: items });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// PUT /api/content/batch — admin: update multiple fields / section at once
router.put('/batch', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const { updates } = req.body; // array of { section, key, value }
    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'updates must be an array' });
    }

    const ops = updates.map(u => ({
      updateOne: {
        filter: { section: u.section, key: u.key },
        update: { $set: { value: String(u.value) } },
        upsert: true
      }
    }));

    if (ops.length > 0) {
      await SiteContent.bulkWrite(ops);
    }

    res.json({ success: true, count: ops.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/content/:section/:key — admin
router.put('/:section/:key', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const item = await SiteContent.findOneAndUpdate(
      { section: req.params.section, key: req.params.key },
      { value: String(req.body.value) },
      { new: true, upsert: true }
    );
    res.json({ item });
  } catch (err) { 
    res.status(400).json({ error: err.message }); 
  }
});

export default router;
