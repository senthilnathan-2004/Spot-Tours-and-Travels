import express from 'express';
import { dbConnect } from '../db.js';
import Booking from '../models/Booking.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { sendBookingNotification } from '../email.js';

const router = express.Router();

// GET /api/bookings/stats — admin
router.get('/stats', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' })
    ]);
    res.json({ total, pending, confirmed, completed, cancelled });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/bookings — admin
router.get('/', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ bookedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();
    res.json({ bookings, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/bookings/:id — admin
router.get('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/bookings — public (from booking form)
router.post('/', async (req, res) => {
  try {
    await dbConnect();
    const booking = await Booking.create(req.body);
    // Fire-and-forget email — never fail the booking response
    sendBookingNotification(booking).catch(e => console.error('Booking email error:', e.message));
    res.status(201).json({ success: true, bookingRef: booking.bookingRef, booking });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/bookings/:id/status — admin
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
