import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdEdit, 
  MdDelete, 
  MdRefresh, 
  MdClose, 
  MdSave,
  MdArticle,
  MdCalendarToday,
  MdPerson,
  MdAccessTime
} from 'react-icons/md';
import { api } from '../utils/api.js';
import { blogPosts } from '../../data/travelData.js';
import AdminImageUpload from '../components/AdminImageUpload.jsx';
import AdminAlert from '../components/AdminAlert.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

const EMPTY_BLOG = {
  id: '',
  title: '',
  slug: '',
  category: 'Hill Stations',
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  readTime: '5 min read',
  author: 'Spot Tours Travel Desk',
  image: '',
  excerpt: '',
  content: '',
  active: true
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState(EMPTY_BLOG);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = ['All', 'Hill Stations', 'Pilgrimage', 'International', 'Travel Tips', 'Honeymoon'];

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    try {
      const data = await api.getAllBlogs();
      if (data.blogs && data.blogs.length > 0) {
        setBlogs(data.blogs);
      } else {
        setBlogs(blogPosts);
      }
    } catch {
      setBlogs(blogPosts);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingBlog(null);
    setForm({
      ...EMPTY_BLOG,
      id: `blog-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });
    setModalOpen(true);
  }

  function openEdit(b) {
    setEditingBlog(b);
    setForm({ ...b });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const payload = {
        ...form,
        slug,
        id: form.id || slug
      };

      if (editingBlog) {
        await api.updateBlog(editingBlog._id || editingBlog.id || editingBlog.slug, payload);
        showAlert('success', `Blog "${payload.title}" updated successfully!`);
      } else {
        await api.createBlog(payload);
        showAlert('success', `Blog "${payload.title}" created successfully!`);
      }
      setModalOpen(false);
      loadBlogs();
    } catch (err) {
      showAlert('error', `Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirmItem) return;
    setDeleting(true);
    try {
      await api.deleteBlog(deleteConfirmItem._id || deleteConfirmItem.id || deleteConfirmItem.slug);
      showAlert('success', `Blog "${deleteConfirmItem.title}" deleted.`);
      setDeleteConfirmItem(null);
      loadBlogs();
    } catch (err) {
      showAlert('error', `Delete failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  }

  function showAlert(type, msg) {
    setAlert({ type, msg });
  }

  const filtered = blogs.filter(b => {
    const q = search.toLowerCase();
    return !search || 
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q));
  });

  return (
    <div>
      <AdminAlert alert={alert} onClose={() => setAlert(null)} />

      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        title={`Delete Blog Post?`}
        message={`Are you sure you want to permanently delete "${deleteConfirmItem?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmItem(null)}
        loading={deleting}
      />

      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">BLOG & GUIDES CMS</div>
          <h1 className="adm-page-title">
            TRAVEL <span>ARTICLES &amp; BLOGS</span>
          </h1>
          <p className="adm-page-subtitle">
            Publish travel advice, custom itineraries, sightseeing recommendations, and SEO guides.
          </p>
        </div>
        <div className="adm-page-actions">
          <button className="adm-btn adm-btn-ghost" onClick={loadBlogs}>
            <MdRefresh /> Refresh
          </button>
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <MdAdd /> New Blog Post
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-card-body" style={{ padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <input 
              type="text"
              placeholder="Search blogs by title, category, or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="adm-search-input"
            />
          </div>
        </div>
      </div>

      {/* Blog List Grid */}
      {loading ? (
        <div className="adm-loading"><div className="adm-spinner" /> Loading blogs…</div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty-state">
          <MdArticle style={{ fontSize: '3rem', color: 'var(--adm-text-light)' }} />
          <h3>No blog posts found</h3>
          <p>Create your first travel guide article to attract more visitors.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filtered.map(b => (
            <div key={b._id || b.id || b.slug} className="adm-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 170, background: '#0F172A' }}>
                <img 
                  src={b.image} 
                  alt={b.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'; }}
                />
                <span className="adm-badge adm-badge-confirmed" style={{ position: 'absolute', top: 12, left: 12 }}>
                  {b.category}
                </span>
                <span style={{ position: 'absolute', bottom: 8, right: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MdAccessTime /> {b.readTime}
                </span>
              </div>

              <div className="adm-card-body" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--adm-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MdCalendarToday /> {b.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MdPerson /> {b.author}
                  </span>
                </div>

                <h3 style={{ margin: 0, color: 'var(--adm-text-main)', fontSize: '1.05rem', lineHeight: 1.4, fontFamily: 'Oswald, sans-serif' }}>
                  {b.title}
                </h3>

                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {b.excerpt}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                  <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(b)}>
                    <MdEdit /> Edit
                  </button>
                  <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setDeleteConfirmItem(b)}>
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editor */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal" style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3 className="adm-modal-title">
                  {editingBlog ? `Edit Post: ${editingBlog.title}` : 'Create New Travel Guide'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>
                  Compose informative travel guides and itineraries for Coimbatore travelers.
                </p>
              </div>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto', padding: '20px' }}>
                <div style={{ marginBottom: 16 }}>
                  <label className="adm-label">Article Title *</label>
                  <input 
                    type="text" 
                    className="adm-input" 
                    required
                    value={form.title} 
                    onChange={e => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                      setForm({ ...form, title, slug: form.slug ? form.slug : slug });
                    }}
                    placeholder="e.g. The Ultimate 3-Day Ooty & Kodaikanal Itinerary from Coimbatore"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="adm-label">URL Slug *</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      required
                      value={form.slug} 
                      onChange={e => setForm({ ...form, slug: e.target.value })}
                      placeholder="e.g. ooty-kodaikanal-itinerary"
                    />
                  </div>

                  <div>
                    <label className="adm-label">Category</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      value={form.category} 
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. Hill Stations or Pilgrimage"
                    />
                  </div>

                  <div>
                    <label className="adm-label">Author Name</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      value={form.author} 
                      onChange={e => setForm({ ...form, author: e.target.value })}
                      placeholder="e.g. Spot Tours Travel Desk"
                    />
                  </div>

                  <div>
                    <label className="adm-label">Reading Time / Date</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      value={form.readTime} 
                      onChange={e => setForm({ ...form, readTime: e.target.value })}
                      placeholder="e.g. 5 min read"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <AdminImageUpload
                    label="Cover Image"
                    value={form.image}
                    onChange={val => setForm({ ...form, image: val })}
                    helpText="Upload a high-quality destination photo or paste direct URL."
                    previewHeight={140}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="adm-label">Short Excerpt (Summary for Cards) *</label>
                  <textarea 
                    className="adm-textarea" 
                    rows={2}
                    required
                    value={form.excerpt} 
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence preview to show on blog listing cards..."
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="adm-label">Full Article Content (Markdown or HTML supported) *</label>
                  <textarea 
                    className="adm-textarea" 
                    rows={10}
                    required
                    value={form.content} 
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="### Day 1 Itinerary&#10;Write detailed itinerary points, hotel suggestions, timings, route advice..."
                    style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                  <MdSave /> {saving ? 'Saving…' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
