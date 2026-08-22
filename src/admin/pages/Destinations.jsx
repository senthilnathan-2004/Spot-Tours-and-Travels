import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdEdit, 
  MdDelete, 
  MdRefresh, 
  MdClose, 
  MdSave,
  MdLocationOn,
  MdCalendarToday,
  MdSchedule,
  MdCheckCircle,
  MdCancel
} from 'react-icons/md';
import { api } from '../utils/api.js';
import { destinationsList } from '../../data/travelData.js';
import AdminImageUpload from '../components/AdminImageUpload.jsx';
import AdminAlert from '../components/AdminAlert.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

const EMPTY_DESTINATION = {
  id: '',
  name: '',
  state: '',
  tagline: '',
  banner: '',
  bestTime: 'September to June',
  idealDuration: '3 - 4 Days',
  category: 'Hill Station',
  description: '',
  topAttractions: [''],
  travelTips: '',
  startingPrice: '₹4,999',
  active: true,
  order: 0
};

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [form, setForm] = useState(EMPTY_DESTINATION);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = ['All', 'Hill Station', 'Beach', 'Spiritual', 'International', 'Heritage', 'Wildlife'];

  useEffect(() => {
    loadDestinations();
  }, []);

  async function loadDestinations() {
    setLoading(true);
    try {
      const data = await api.getAllDestinations();
      if (data.destinations && data.destinations.length > 0) {
        setDestinations(data.destinations);
      } else {
        setDestinations(destinationsList);
      }
    } catch {
      setDestinations(destinationsList);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingDest(null);
    setForm({
      ...EMPTY_DESTINATION,
      id: `dest-${Date.now()}`,
      order: destinations.length
    });
    setModalOpen(true);
  }

  function openEdit(d) {
    setEditingDest(d);
    setForm({
      ...d,
      topAttractions: Array.isArray(d.topAttractions) && d.topAttractions.length > 0 ? d.topAttractions : ['']
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanAttractions = (form.topAttractions || []).filter(a => a && a.trim() !== '');
      const payload = {
        ...form,
        topAttractions: cleanAttractions,
        id: form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      };

      if (editingDest) {
        await api.updateDestination(editingDest.id, payload);
        showAlert('success', `Destination "${payload.name}" updated successfully!`);
      } else {
        await api.createDestination(payload);
        showAlert('success', `Destination "${payload.name}" created successfully!`);
      }
      setModalOpen(false);
      loadDestinations();
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
      await api.deleteDestination(deleteConfirmItem.id || deleteConfirmItem._id);
      showAlert('success', `Destination "${deleteConfirmItem.name}" deleted.`);
      setDeleteConfirmItem(null);
      loadDestinations();
    } catch (err) {
      showAlert('error', `Delete failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  }

  function showAlert(type, msg) {
    setAlert({ type, msg });
  }

  const filtered = destinations.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !search || 
      (d.name && d.name.toLowerCase().includes(q)) ||
      (d.state && d.state.toLowerCase().includes(q)) ||
      (d.category && d.category.toLowerCase().includes(q));
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <AdminAlert alert={alert} onClose={() => setAlert(null)} />
      
      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        title={`Delete Destination?`}
        message={`Are you sure you want to permanently delete "${deleteConfirmItem?.name}" from your catalog?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmItem(null)}
        loading={deleting}
      />

      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">DESTINATION CMS</div>
          <h1 className="adm-page-title">
            EXPLORE <span>DESTINATIONS</span>
          </h1>
          <p className="adm-page-subtitle">
            Manage tourist destinations, categories, attraction highlights, descriptions, and pricing cards shown on the public site.
          </p>
        </div>
        <div className="adm-page-actions">
          <button className="adm-btn adm-btn-ghost" onClick={loadDestinations}>
            <MdRefresh /> Refresh
          </button>
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <MdAdd /> Add Destination
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-card-body" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ width: '100%' }}>
            <input 
              type="text"
              placeholder="Search by name, state, or keywords..."
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
                className={`adm-btn adm-btn-sm ${selectedCategory === cat ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
                style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="adm-loading"><div className="adm-spinner" /> Loading destinations…</div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty-state">
          <MdLocationOn style={{ fontSize: '3rem', color: 'var(--adm-text-light)' }} />
          <h3>No destinations found</h3>
          <p>Try clearing filters or add a new destination.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filtered.map(d => (
            <div key={d.id || d._id} className="adm-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 180, background: '#0F172A' }}>
                <img 
                  src={d.banner} 
                  alt={d.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'; }}
                />
                <span className="adm-badge adm-badge-confirmed" style={{ position: 'absolute', top: 12, left: 12 }}>
                  {d.category}
                </span>
                <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.75)', color: '#FFD700', padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
                  From {d.startingPrice}
                </span>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', padding: '24px 16px 8px' }}>
                  <span style={{ color: '#E2E8F0', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MdLocationOn style={{ color: '#F97316' }} /> {d.state}
                  </span>
                  <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.25rem', fontFamily: 'Oswald, sans-serif' }}>
                    {d.name}
                  </h3>
                </div>
              </div>

              <div className="adm-card-body" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {d.tagline && (
                  <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--adm-text-muted)' }}>
                    "{d.tagline}"
                  </p>
                )}

                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--adm-text-main)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {d.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--adm-text-muted)', borderTop: '1px solid #E2E8F0', paddingTop: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MdCalendarToday /> {d.bestTime}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MdSchedule /> {d.idealDuration}
                  </span>
                </div>

                {d.topAttractions && d.topAttractions.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {d.topAttractions.slice(0, 3).map((a, i) => (
                      <span key={i} style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>
                        {a}
                      </span>
                    ))}
                    {d.topAttractions.length > 3 && (
                      <span style={{ color: 'var(--adm-text-muted)', fontSize: '0.72rem', alignSelf: 'center' }}>
                        +{d.topAttractions.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
                  <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(d)}>
                    <MdEdit /> Edit
                  </button>
                  <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setDeleteConfirmItem(d)}>
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
          <div className="adm-modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3 className="adm-modal-title">
                  {editingDest ? `Edit Destination: ${editingDest.name}` : 'Create New Destination'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>
                  Configure destination details, photo, attractions, and pricing.
                </p>
              </div>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto', padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="adm-label">Destination Name *</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      required
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ooty & Nilgiris"
                    />
                  </div>

                  <div>
                    <label className="adm-label">State / Country *</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      required
                      value={form.state} 
                      onChange={e => setForm({ ...form, state: e.target.value })}
                      placeholder="e.g. Tamil Nadu or UAE"
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

                  <div>
                    <label className="adm-label">Starting Price Text</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      value={form.startingPrice} 
                      onChange={e => setForm({ ...form, startingPrice: e.target.value })}
                      placeholder="e.g. ₹4,999"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="adm-label">Catchy Tagline / Quote</label>
                  <input 
                    type="text" 
                    className="adm-input" 
                    value={form.tagline} 
                    onChange={e => setForm({ ...form, tagline: e.target.value })}
                    placeholder="e.g. The Queen of Hill Stations"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <AdminImageUpload
                    label="Banner / Cover Image"
                    value={form.banner}
                    onChange={val => setForm({ ...form, banner: val })}
                    helpText="Upload an image from device or paste direct image URL."
                    previewHeight={140}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="adm-label">Best Time to Visit</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      value={form.bestTime} 
                      onChange={e => setForm({ ...form, bestTime: e.target.value })}
                      placeholder="e.g. September to June"
                    />
                  </div>

                  <div>
                    <label className="adm-label">Ideal Tour Duration</label>
                    <input 
                      type="text" 
                      className="adm-input" 
                      value={form.idealDuration} 
                      onChange={e => setForm({ ...form, idealDuration: e.target.value })}
                      placeholder="e.g. 3 - 4 Days"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="adm-label">Overview Description *</label>
                  <textarea 
                    className="adm-textarea" 
                    rows={4}
                    required
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the destination highlights, geography, weather, and experience..."
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="adm-label">Top Attractions (comma separated)</label>
                  <input 
                    type="text" 
                    className="adm-input" 
                    value={Array.isArray(form.topAttractions) ? form.topAttractions.join(', ') : ''} 
                    onChange={e => setForm({ ...form, topAttractions: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Botanical Gardens, Doddabetta Peak, Pykara Falls, Tea Factory"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="adm-label">Local Travel Tips & Advice</label>
                  <input 
                    type="text" 
                    className="adm-input" 
                    value={form.travelTips} 
                    onChange={e => setForm({ ...form, travelTips: e.target.value })}
                    placeholder="e.g. Carry light woolens. Try fresh homemade chocolates."
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                  <MdSave /> {saving ? 'Saving…' : 'Save Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
