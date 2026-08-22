import express from 'express';
import { dbConnect } from '../db.js';
import Enquiry from '../models/Enquiry.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { sendEnquiryNotification, sendEnquiryStatusNotification } from '../email.js';

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
      .limit(parseInt(limit))
      .lean();
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
    sendEnquiryStatusNotification(enquiry, req.body.status).catch(e => console.error('Enquiry status email error:', e.message));
    res.json({ enquiry });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// POST /api/enquiries/bulk-status — admin: update status of multiple enquiries
router.post('/bulk-status', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return res.status(400).json({ error: 'ids array and status required' });
    }
    const result = await Enquiry.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );
    if (status === 'resolved') {
      Enquiry.find({ _id: { $in: ids } }).lean().then(enquiries => {
        enquiries.forEach(eq => {
          sendEnquiryStatusNotification(eq, status).catch(e => console.error('Bulk enquiry email error:', e.message));
        });
      }).catch(() => {});
    }
    res.json({ success: true, count: result.modifiedCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/enquiries/bulk-delete — admin: delete multiple enquiries
router.post('/bulk-delete', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids array required' });
    }
    const result = await Enquiry.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, count: result.deletedCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/enquiries/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
