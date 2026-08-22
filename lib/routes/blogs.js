import express from 'express';
import { dbConnect } from '../db.js';
import Blog from '../models/Blog.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/blogs — public (active only)
router.get('/', async (req, res) => {
  try {
    await dbConnect();
    const blogs = await Blog.find({ active: true }).sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blogs/all — admin
router.get('/all', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blogs/:slug — public
router.get('/:slug', async (req, res) => {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/blogs — admin
router.post('/', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    if (!req.body.title) {
      return res.status(400).json({ error: 'Blog title is required' });
    }
    if (!req.body.slug) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `blog-${Date.now()}`;
    }
    if (!req.body.id) {
      req.body.id = req.body.slug;
    }
    if (!req.body.image) {
      req.body.image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800';
    }
    const blog = await Blog.create(req.body);
    res.status(201).json({ blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/blogs/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const idParam = req.params.id;
    const isObjectId = idParam && idParam.length === 24 && /^[0-9a-fA-F]{24}$/.test(idParam);
    const filter = isObjectId 
      ? { $or: [{ _id: idParam }, { id: idParam }, { slug: idParam }] }
      : { $or: [{ id: idParam }, { slug: idParam }] };

    const blog = await Blog.findOneAndUpdate(
      filter,
      { $set: req.body },
      { new: true, runValidators: false }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/blogs/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await dbConnect();
    const idParam = req.params.id;
    const isObjectId = idParam && idParam.length === 24 && /^[0-9a-fA-F]{24}$/.test(idParam);
    const filter = isObjectId 
      ? { $or: [{ _id: idParam }, { id: idParam }, { slug: idParam }] }
      : { $or: [{ id: idParam }, { slug: idParam }] };

    await Blog.findOneAndDelete(filter);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
