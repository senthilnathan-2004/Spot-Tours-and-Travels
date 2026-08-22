import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdClose, MdStar, MdCheck, MdTrendingUp, MdImage } from 'react-icons/md';
import { api } from '../utils/api.js';
import AdminImageUpload from '../components/AdminImageUpload.jsx';
import AdminGalleryUpload from '../components/AdminGalleryUpload.jsx';

const EMPTY_PKG = {
  id: '', title: '', destination: '', region: '', theme: '',
  duration: '', durationDays: 2, price: '', originalPrice: '',
  rating: 4.8, reviews: 10, popular: false, active: true,
  image: '', gallery: [], overview: '',
  highlights: [''], inclusions: [''], exclusions: ['']
};

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_PKG);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadPackages(); }, []);

  async function loadPackages() {
    setLoading(true);
    try {
      const { packages } = await api.getPackages();
      setPackages(packages || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const regions = ['all', ...Array.from(new Set(packages.map(p => p.region).filter(Boolean)))];

  const filtered = packages.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.destination || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.theme || '').toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === 'all' || p.region === regionFilter;
    return matchSearch && matchRegion;
  });

  function openAdd() { setForm({ ...EMPTY_PKG }); setError(''); setModal('add'); }
  function openEdit(pkg) { setForm({ ...pkg }); setError(''); setSelected(pkg); setModal('edit'); }
  function openView(pkg) { setSelected(pkg); setModal('view'); }
  function openDelete(pkg) { setSelected(pkg); setModal('delete'); }
  function closeModal() { setModal(null); setSelected(null); setError(''); }

  function updateArr(field, idx, val) {
    const arr = [...(form[field] || [''])];
    arr[idx] = val;
    setForm(f => ({ ...f, [field]: arr }));
  }
  function addArr(field) { setForm(f => ({ ...f, [field]: [...(f[field] || []), ''] })); }
  function removeArr(field, idx) {
    const arr = (form[field] || []).filter((_, i) => i !== idx);
    setForm(f => ({ ...f, [field]: arr }));
  }

  async function handleSave() {
    setError(''); setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice) || parseFloat(form.price),
        durationDays: parseInt(form.durationDays) || 1,
        rating: parseFloat(form.rating) || 4.5,
        reviews: parseInt(form.reviews) || 0,
        highlights: (form.highlights || []).filter(Boolean),
        inclusions: (form.inclusions || []).filter(Boolean),
        exclusions: (form.exclusions || []).filter(Boolean),
        id: form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
      };
      if (modal === 'add') await api.createPackage(data);
      else await api.updatePackage(selected.id, data);
      setSuccess(modal === 'add' ? 'Package created successfully!' : 'Package updated successfully!');
      setTimeout(() => setSuccess(''), 3500);
      closeModal();
      loadPackages();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await api.deletePackage(selected.id);
      setSuccess('Package deleted successfully');
      setTimeout(() => setSuccess(''), 3500);
      closeModal();
      loadPackages();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">CATALOG</div>
          <h1 className="adm-page-title">
            TOUR <span>PACKAGES</span>
          </h1>
          <p className="adm-page-subtitle">
            Manage your domestic &amp; international itineraries, pricing, and hotel options.
          </p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={openAdd}>
          <MdAdd /> Add New Package
        </button>
      </div>

      {success && <div className="adm-alert adm-alert-success">✅ {success}</div>}

      {/* Filters Bar */}
      <div className="adm-filters">
        <input
          type="text"
          className="adm-search-input"
          placeholder="Search by package name, destination, or theme..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {regions.length > 1 && (
          <div className="adm-filter-tabs">
            {regions.map(r => (
              <button
                key={r}
                className={`adm-btn adm-btn-sm ${regionFilter === r ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
                onClick={() => setRegionFilter(r)}
                style={{ textTransform: 'capitalize' }}
              >
                {r === 'all' ? 'All Regions' : r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="adm-card">
        {loading ? (
          <div className="adm-loading"><div className="adm-spinner" /> Loading packages…</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">🏖️</div>
            <h3>No Tour Packages Found</h3>
            <p>Try clearing your search or click "Add New Package" above.</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Package Details</th>
                  <th>Price / Person</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(pkg => (
                  <tr key={pkg._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 56, height: 42, borderRadius: 8, overflow: 'hidden', background: '#E2E8F0', flexShrink: 0 }}>
                          {pkg.image ? (
                            <img src={pkg.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}><MdImage /></div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--adm-text-main)', fontSize: '0.95rem' }}>
                            {pkg.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)', display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                            <span>📍 {pkg.destination}</span>
                            {pkg.popular && (
                              <span style={{ background: '#FEF3C7', color: '#D97706', padding: '1px 6px', borderRadius: 4, fontWeight: 700, fontSize: '0.7rem' }}>
                                ⭐ POPULAR
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
                        ₹{Number(pkg.price).toLocaleString('en-IN')}
                      </div>
                      {pkg.originalPrice > pkg.price && (
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                          ₹{Number(pkg.originalPrice).toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                      {pkg.duration}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#D97706', background: '#FFFBEB', padding: '3px 8px', borderRadius: 6, border: '1px solid #FDE68A', fontSize: '0.8rem' }}>
                        <MdStar /> {pkg.rating} <span style={{ color: '#92400E', fontWeight: 500 }}>({pkg.reviews || 0})</span>
                      </span>
                    </td>
                    <td>
                      <span className={`adm-badge ${pkg.active ? 'adm-badge-active' : 'adm-badge-inactive'}`}>
                        {pkg.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => openView(pkg)} title="Preview Details"><MdVisibility /></button>
                        <button className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => openEdit(pkg)} title="Edit Package"><MdEdit /></button>
                        <button className="adm-btn adm-btn-danger adm-btn-icon" onClick={() => openDelete(pkg)} title="Delete"><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">
                {modal === 'add' ? <><MdAdd /> Add New Tour Package</> : <><MdEdit /> Edit Tour Package</>}
              </h3>
              <button className="adm-modal-close" onClick={closeModal}><MdClose /></button>
            </div>
            <div className="adm-modal-body">
              {error && <div className="adm-alert adm-alert-error">{error}</div>}

              <div className="adm-grid-2">
                <FormField label="Package Title *" value={form.title} onChange={v => setForm(f=>({...f,title:v}))} placeholder="e.g. Ooty & Kodaikanal Queen of Hills" />
                <FormField label="Destination *" value={form.destination} onChange={v => setForm(f=>({...f,destination:v}))} placeholder="e.g. Ooty & Kodaikanal, Tamil Nadu" />
                <FormField label="Region" value={form.region} onChange={v => setForm(f=>({...f,region:v}))} placeholder="e.g. South India / International" />
                <FormField label="Theme" value={form.theme} onChange={v => setForm(f=>({...f,theme:v}))} placeholder="e.g. Hill Station / Family / Honeymoon" />
                <FormField label="Duration Display" value={form.duration} onChange={v => setForm(f=>({...f,duration:v}))} placeholder="e.g. 4 Days / 3 Nights" />
                <FormField label="Duration (Total Days)" type="number" value={form.durationDays} onChange={v => setForm(f=>({...f,durationDays:v}))} />
                <FormField label="Offer Price (₹) *" type="number" value={form.price} onChange={v => setForm(f=>({...f,price:v}))} placeholder="7499" />
                <FormField label="Original Price (₹)" type="number" value={form.originalPrice} onChange={v => setForm(f=>({...f,originalPrice:v}))} placeholder="9499" />
                <FormField label="Star Rating" type="number" value={form.rating} onChange={v => setForm(f=>({...f,rating:v}))} placeholder="4.9" />
                <FormField label="Reviews Count" type="number" value={form.reviews} onChange={v => setForm(f=>({...f,reviews:v}))} placeholder="25" />
              </div>

              <AdminImageUpload
                label="Package Cover / Hero Image *"
                value={form.image}
                onChange={v => setForm(f => ({ ...f, image: v }))}
                helpText="Choose an image file from your device or paste a URL."
                previewHeight={180}
              />

              <AdminGalleryUpload
                label="Tour Gallery Photos"
                gallery={form.gallery || []}
                onChange={g => setForm(f => ({ ...f, gallery: g }))}
              />

              <FormField label="Package Overview" textarea value={form.overview} onChange={v => setForm(f=>({...f,overview:v}))} placeholder="Detailed description of the tour..." />

              <div style={{ display: 'flex', gap: 24, margin: '14px 0', padding: '14px 18px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input type="checkbox" checked={form.popular} onChange={e=>setForm(f=>({...f,popular:e.target.checked}))} />
                  <span>Mark as Popular (Featured on Homepage)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input type="checkbox" checked={form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} />
                  <span>Active &amp; Visible to Public</span>
                </label>
              </div>

              <ArrayField label="Key Highlights" items={form.highlights} onChange={(i,v)=>updateArr('highlights',i,v)} onAdd={()=>addArr('highlights')} onRemove={i=>removeArr('highlights',i)} />
              <ArrayField label="Inclusions" items={form.inclusions} onChange={(i,v)=>updateArr('inclusions',i,v)} onAdd={()=>addArr('inclusions')} onRemove={i=>removeArr('inclusions',i)} />
              <ArrayField label="Exclusions" items={form.exclusions} onChange={(i,v)=>updateArr('exclusions',i,v)} onAdd={()=>addArr('exclusions')} onRemove={i=>removeArr('exclusions',i)} />
            </div>

            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : (modal === 'add' ? 'Publish Package' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="adm-modal adm-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title"><MdVisibility /> {selected.title}</h3>
              <button className="adm-modal-close" onClick={closeModal}><MdClose /></button>
            </div>
            <div className="adm-modal-body">
              {selected.image && (
                <img src={selected.image} alt={selected.title} style={{ width:'100%', height: 220, objectFit:'cover', borderRadius: 12, marginBottom: 18 }} />
              )}
              <div className="adm-detail-grid">
                <DetailItem label="Destination" value={selected.destination} />
                <DetailItem label="Duration" value={selected.duration} />
                <DetailItem label="Price" value={`₹${Number(selected.price).toLocaleString('en-IN')}`} />
                <DetailItem label="Rating" value={`${selected.rating} ★ (${selected.reviews || 0} reviews)`} />
                <DetailItem label="Theme" value={selected.theme} />
                <DetailItem label="Region" value={selected.region} />
              </div>
              {selected.overview && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: 6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Oswald, sans-serif' }}>Overview</div>
                  <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>{selected.overview}</p>
                </div>
              )}
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-primary" onClick={() => { closeModal(); openEdit(selected); }}>
                <MdEdit /> Edit Package
              </button>
              <button className="adm-btn adm-btn-ghost" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal === 'delete' && selected && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="adm-modal adm-modal-sm" onClick={e=>e.stopPropagation()}>
            <div className="adm-modal-header" style={{ background: 'linear-gradient(135deg, #7F1D1D, #991B1B)' }}>
              <h3 className="adm-modal-title" style={{ color: '#FFFFFF' }}>⚠️ Confirm Deletion</h3>
              <button className="adm-modal-close" onClick={closeModal}><MdClose /></button>
            </div>
            <div className="adm-modal-body">
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.5 }}>
                Are you sure you want to remove <strong>{selected.title}</strong>? It will no longer be visible on your website.
              </p>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Deleting…' : 'Yes, Delete Package'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', textarea, placeholder }) {
  return (
    <div className="adm-form-group">
      <label className="adm-label">{label}</label>
      {textarea ? (
        <textarea className="adm-textarea" value={value || ''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="adm-input" type={type} value={value || ''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function ArrayField({ label, items, onChange, onAdd, onRemove }) {
  return (
    <div className="adm-form-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label className="adm-label" style={{ marginBottom: 0 }}>{label}</label>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={onAdd}><MdAdd /> Add Item</button>
      </div>
      {(items || []).map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input className="adm-input" value={item} onChange={e=>onChange(i, e.target.value)} placeholder={`${label} ${i + 1}`} />
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={()=>onRemove(i)} style={{ flexShrink: 0 }}><MdClose /></button>
        </div>
      ))}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="adm-detail-item">
      <div className="adm-detail-label">{label}</div>
      <div className="adm-detail-value">{value || '—'}</div>
    </div>
  );
}
