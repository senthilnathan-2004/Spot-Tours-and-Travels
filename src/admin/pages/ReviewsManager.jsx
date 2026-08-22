import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdEdit, 
  MdDelete, 
  MdRefresh, 
  MdClose, 
  MdSave,
  MdStar,
  MdCheckCircle,
  MdOutlineRemoveRedEye,
  MdRateReview
} from 'react-icons/md';
import { api } from '../utils/api.js';
import AdminAlert from '../components/AdminAlert.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

const initialStaticReviews = [
  {
    name: "Praveen Kumar",
    time: "2 weeks ago",
    rating: 5,
    trip: "Family Kerala Tour",
    category: "Family",
    text: "Booked our family Kerala tour (Munnar & Alleppey) with Spot Tours and Travels Coimbatore. Excellent vehicle condition, hygienic resorts, and punctual driver. The entire trip coordination was seamless and stress-free. Highly recommended in Kuniyamuthur!",
    approved: true,
    featured: true
  },
  {
    name: "Ananya & Karthik",
    time: "a month ago",
    rating: 5,
    trip: "Bali Honeymoon Package",
    category: "Honeymoon",
    text: "We planned our honeymoon to Bali through Spot Tours and Travels. From flight ticketing and visa guidance to romantic candlelit dinner and private sightseeing, everything was executed flawlessly. Best travel agency in Coimbatore!",
    approved: true,
    featured: true
  },
  {
    name: "Suresh Sundaram",
    time: "3 weeks ago",
    rating: 5,
    trip: "Rameswaram Temple Tour",
    category: "Pilgrimage",
    text: "Organized a spiritual pilgrimage trip to Rameswaram & Madurai for my elderly parents. The AC tourist cab was spotless and the driver was extremely patient and courteous with senior citizens. Truly 'The Spot For Needs'!",
    approved: true,
    featured: true
  },
  {
    name: "Deepak Raj",
    time: "2 months ago",
    rating: 5,
    trip: "Goa Friends Vacation",
    category: "Friends",
    text: "Spot Tours and Travels gave us the best transparent pricing for our Goa trip with friends. No hidden charges, great resort right next to the beach, and constant support from their Coimbatore office.",
    approved: true,
    featured: true
  },
  {
    name: "Divya Ramesh",
    time: "1 month ago",
    rating: 5,
    trip: "Ooty & Kodaikanal Tour",
    category: "Family",
    text: "Top-notch travel agency near Kuniyamuthur SBI Bank. Prompt train ticket reservations and a fantastic customized hill station itinerary. The resort stay in Ooty was breathtaking.",
    approved: true,
    featured: true
  },
  {
    name: "Mohammed Farooq",
    time: "3 months ago",
    rating: 5,
    trip: "Dubai Holiday Package",
    category: "International",
    text: "Booked a Dubai holiday for our family. Smooth tourist visa processing, hotel stays, desert safari, and Burj Khalifa tickets. Spot Tours handled everything end-to-end with high professionalism.",
    approved: true,
    featured: true
  }
];

const EMPTY_REVIEW = {
  name: '',
  trip: '',
  category: 'Family',
  rating: 5,
  time: 'Recently',
  text: '',
  approved: true,
  featured: true
};

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [form, setForm] = useState(EMPTY_REVIEW);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const categories = ['All', 'Family', 'Honeymoon', 'Pilgrimage', 'Friends', 'International'];

  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    try {
      const data = await api.getAllReviews();
      if (data.reviews && data.reviews.length > 0) {
        setReviews(data.reviews);
      } else {
        setReviews(initialStaticReviews);
      }
    } catch {
      setReviews(initialStaticReviews);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingReview(null);
    setForm(EMPTY_REVIEW);
    setModalOpen(true);
  }

  function openEdit(r) {
    setEditingReview(r);
    setForm({ ...r });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingReview && editingReview._id) {
        await api.updateReview(editingReview._id, form);
        showAlert('success', `Review by ${form.name} updated!`);
      } else {
        await api.createReview(form);
        showAlert('success', `Review by ${form.name} added!`);
      }
      setModalOpen(false);
      loadReviews();
    } catch (err) {
      showAlert('error', `Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(r, field) {
    if (!r._id) {
      showAlert('error', 'Please create reviews in DB first or run seed.');
      return;
    }
    try {
      await api.updateReview(r._id, { [field]: !r[field] });
      loadReviews();
    } catch (err) {
      showAlert('error', `Failed: ${err.message}`);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirmItem) return;
    setDeleting(true);
    try {
      if (deleteConfirmItem._id) await api.deleteReview(deleteConfirmItem._id);
      showAlert('success', `Review from "${deleteConfirmItem.name}" deleted.`);
      setDeleteConfirmItem(null);
      loadReviews();
    } catch (err) {
      showAlert('error', `Delete failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  }

  function showAlert(type, msg) {
    setAlert({ type, msg });
  }

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search || 
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.trip && r.trip.toLowerCase().includes(q)) ||
      (r.text && r.text.toLowerCase().includes(q));
    const matchCat = filterCat === 'All' || r.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <AdminAlert alert={alert} onClose={() => setAlert(null)} />

      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        title={`Delete Review?`}
        message={`Are you sure you want to permanently delete the review from "${deleteConfirmItem?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmItem(null)}
        loading={deleting}
      />

      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">REVIEWS &amp; SOCIAL PROOF</div>
          <h1 className="adm-page-title">
            GUEST <span>TESTIMONIALS</span>
          </h1>
          <p className="adm-page-subtitle">
            Manage, approve, and showcase authentic traveler reviews across the homepage and reviews page.
          </p>
        </div>
        <div className="adm-page-actions">
          <button className="adm-btn adm-btn-ghost" onClick={loadReviews}>
            <MdRefresh /> Refresh
          </button>
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <MdAdd /> Add Review
          </button>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-card-body" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ width: '100%' }}>
            <input 
              type="text"
              placeholder="Search by reviewer name, trip, or review words..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="adm-search-input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 8, 
            flexWrap: 'nowrap', 
            overflowX: 'auto', 
            paddingBottom: 4, 
            width: '100%', 
            WebkitOverflowScrolling: 'touch', 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`adm-btn adm-btn-sm ${filterCat === cat ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
                style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                onClick={() => setFilterCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Table / Cards */}
      {loading ? (
        <div className="adm-loading"><div className="adm-spinner" /> Loading reviews…</div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty-state">
          <MdRateReview style={{ fontSize: '3rem', color: 'var(--adm-text-light)' }} />
          <h3>No reviews found</h3>
          <p>Add genuine feedback from happy tourists.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map((r, idx) => (
            <div key={r._id || idx} className="adm-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                    {r.name ? r.name.charAt(0) : 'G'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--adm-text-main)', fontSize: '1rem', fontWeight: 600 }}>
                      {r.name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)' }}>
                      {r.trip} • {r.time || 'Recently'}
                    </span>
                  </div>
                </div>
                <span className="adm-badge adm-badge-confirmed" style={{ fontSize: '0.72rem', borderRadius: '20px', padding: '3px 10px' }}>
                  {r.category || 'Family'}
                </span>
              </div>

              {/* Star Rating */}
              <div style={{ display: 'flex', gap: 2, color: '#F59E0B', marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} style={{ opacity: i < (r.rating || 5) ? 1 : 0.25, fontSize: '1.1rem' }} />
                ))}
                <span style={{ marginLeft: 6, fontSize: '0.8rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                  {r.rating || 5}.0
                </span>
              </div>

              {/* Text */}
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--adm-text-main)', lineHeight: 1.5, flex: 1 }}>
                "{r.text}"
              </p>

              {/* Actions & Status Toggles */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 12, marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span 
                    style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', background: r.approved !== false ? '#DCFCE7' : '#FEE2E2', color: r.approved !== false ? '#166534' : '#991B1B', fontWeight: 600, transition: 'all 0.2s' }}
                    onClick={() => toggleStatus(r, 'approved')}
                    title="Click to toggle Approved status"
                  >
                    {r.approved !== false ? '✓ Approved' : 'Hidden'}
                  </span>

                  <span 
                    style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', background: r.featured ? '#FEF3C7' : '#F1F5F9', color: r.featured ? '#92400E' : '#64748B', fontWeight: 600, transition: 'all 0.2s' }}
                    onClick={() => toggleStatus(r, 'featured')}
                    title="Click to toggle Featured on Home"
                  >
                    {r.featured ? '⭐ Featured' : 'Standard'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button 
                    className="adm-btn adm-btn-ghost adm-btn-sm" 
                    style={{ width: 34, height: 34, borderRadius: '50%', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} 
                    onClick={() => openEdit(r)}
                    title="Edit Review"
                  >
                    <MdEdit style={{ fontSize: '1.05rem' }} />
                  </button>
                  <button 
                    className="adm-btn adm-btn-danger adm-btn-sm" 
                    style={{ width: 34, height: 34, borderRadius: '50%', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} 
                    onClick={() => setDeleteConfirmItem(r)}
                    title="Delete Review"
                  >
                    <MdDelete style={{ fontSize: '1.05rem' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3 className="adm-modal-title">
                  {editingReview ? `Edit Review: ${editingReview.name}` : 'Add Traveler Review'}
                </h3>
              </div>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="adm-label">Customer / Traveler Name *</label>
                  <input 
                    type="text" 
                    className="adm-input" 
                    required
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Praveen Kumar"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="adm-label">Tour / Trip Package Taken *</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      required
                      value={form.trip} 
                      onChange={e => setForm({ ...form, trip: e.target.value })}
                      placeholder="e.g. Family Kerala Tour"
                    />
                  </div>

                  <div>
                    <label className="adm-label">Category</label>
                    <select 
                      className="adm-input"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="adm-label">Star Rating (1 to 5)</label>
                    <select 
                      className="adm-input"
                      value={form.rating}
                      onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Good)</option>
                      <option value={2}>⭐⭐ (2 - Fair)</option>
                      <option value={1}>⭐ (1 - Poor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="adm-label">Time / Date Text</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      value={form.time} 
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      placeholder="e.g. 2 weeks ago"
                    />
                  </div>
                </div>

                <div>
                  <label className="adm-label">Review Testimonial Text *</label>
                  <textarea 
                    className="adm-textarea" 
                    rows={4}
                    required
                    value={form.text} 
                    onChange={e => setForm({ ...form, text: e.target.value })}
                    placeholder="Write the traveler feedback and testimonial..."
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                  <MdSave /> {saving ? 'Saving…' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
