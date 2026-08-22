import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  id: { type: String, default: () => 'blog_' + Date.now() },
  title: { type: String, required: true },
  slug: { type: String, default: () => 'blog-' + Date.now() },
  category: { type: String, default: 'Travel Guides' },
  date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
  readTime: { type: String, default: '5 min read' },
  author: { type: String, default: 'Spot Tours Travel Desk' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
