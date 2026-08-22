import express from 'express';
import { dbConnect } from '../db.js';
import Enquiry from '../models/Enquiry.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { sendEnquiryNotification } from '../email.js';

const router = express.Router();

// GET /api/enquiries/stats — admin
router.get('/stats', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const [total, newCount, read, resolved] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: 'read' }),
      Enquiry.countDocuments({ status: 'resolved' })
    ]);
    res.json({ total, new: newCount, read, resolved });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/enquiries — admin
router.get('/', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const total = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .sort({ submittedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ enquiries, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/enquiries — public (from contact form)
router.post('/', async (req, res) => {
  try {
    await dbConnect();
    const enquiry = await Enquiry.create(req.body);
    sendEnquiryNotification(enquiry).catch(e => console.error('Enquiry email error:', e.message));
    res.status(201).json({ success: true, enquiry });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/enquiries/:id/status — admin
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ enquiry });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
