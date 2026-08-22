import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { MdVisibility, MdClose, MdPhone, MdRefresh, MdMarkEmailRead, MdCheckCircle } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { api } from '../utils/api.js';
import AdminAlert from '../components/AdminAlert.jsx';

const STATUS_BADGE = {
  new: 'adm-badge-new',
  read: 'adm-badge-read',
  resolved: 'adm-badge-resolved'
};

const STATUSES = [
  { id: 'all', label: 'All Leads' },
  { id: 'new', label: 'New / Unread' },
  { id: 'read', label: 'In Review' },
  { id: 'resolved', label: 'Resolved' }
];

export default function Enquiries() {
  const location = useLocation();
  const urlStatus = new URLSearchParams(location.search).get('status') || 'all';
  const [filter, setFilter] = useState(urlStatus);
  const [enquiries, setEnquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      const data = await api.getEnquiries(params);
      setEnquiries(data.enquiries || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? enquiries.filter(e =>
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.phone?.includes(search) ||
        e.destination?.toLowerCase().includes(search.toLowerCase()) ||
        e.message?.toLowerCase().includes(search.toLowerCase())
      )
    : enquiries;

  async function updateStatus(id, status) {
    setUpdatingId(id);
    try {
      await api.updateEnquiryStatus(id, status);
      setSuccess(`Enquiry marked as ${status.toUpperCase()}`);
      setTimeout(() => setSuccess(''), 3000);
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
      load();
    } catch (err) {
      setError(err.message || 'Failed to update enquiry');
    } finally {
      setUpdatingId(null);
    }
  }

  function openView(e) {
    setSelected(e);
    if (e.status === 'new') updateStatus(e._id, 'read');
  }

  const waLink = e => {
    const msg = `Hi ${e.name},\n\nThank you for reaching out to *Spot Tours and Travels Coimbatore*!\n\nWe received your enquiry for ${e.destination ? `*${e.destination}*` : 'a vacation package'}.\n\nHow can we assist you with cabs, hotels, and flight reservations? Our team is glad to provide customized itineraries.`;
    const cleanPhone = e.phone ? e.phone.replace(/\D/g, '') : '';
    const target = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    return `https://wa.me/${target}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">LEADS &amp; INQUIRIES</div>
          <h1 className="adm-page-title">
            CONTACT <span>ENQUIRIES</span>
          </h1>
          <p className="adm-page-subtitle">
            {total} total client submissions received via your website contact form.
          </p>
        </div>
        <button className="adm-btn adm-btn-ghost" onClick={load} title="Refresh enquiries list">
          <MdRefresh /> Refresh
        </button>
      </div>

      <AdminAlert 
        alert={success ? { type: 'success', msg: success } : (error ? { type: 'error', msg: error } : null)} 
        onClose={() => { setSuccess(''); setError(''); }} 
      />

      {/* Filter Tabs & Search */}
      <div className="adm-filters">
        <input
          type="text"
          className="adm-search-input"
          placeholder="Search by customer name, phone, destination, or note..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="adm-filter-tabs">
          {STATUSES.map(s => (
            <button
              key={s.id}
              className={`adm-btn adm-btn-sm ${filter === s.id ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
              onClick={() => setFilter(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="adm-card">
        {loading ? (
          <div className="adm-loading"><div className="adm-spinner" /> Loading customer enquiries…</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">📩</div>
            <h3>No Enquiries Found</h3>
            <p>Direct contact messages submitted from your website will be cataloged here.</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Client Contact</th>
                  <th>Destination Interest</th>
                  <th>Preferred Date</th>
                  <th>Received Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e._id} style={e.status === 'new' ? { background: 'rgba(216, 58, 86, 0.04)' } : {}}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--adm-text-main)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {e.status === 'new' && (
                          <span style={{ width: 8, height: 8, background: 'var(--adm-primary)', borderRadius: '50%', flexShrink: 0 }} />
                        )}
                        {e.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)', marginTop: 2 }}>
                        📞 {e.phone} {e.email && `• ${e.email}`}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.88rem' }}>
                        📍 {e.destination || 'General Travel Advice'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      {e.travelDate || 'Flexible'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {new Date(e.submittedAt || e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span className={`adm-badge ${STATUS_BADGE[e.status] || ''}`}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => openView(e)} title="View Enquiry Details">
                          <MdVisibility />
                        </button>
                        <a
                          href={waLink(e)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="adm-btn adm-btn-icon"
                          style={{ background: '#25D366', color: '#FFFFFF', border: 'none' }}
                          title="Reply on WhatsApp"
                        >
                          <FaWhatsapp style={{ fontSize: '1.1rem' }} />
                        </a>
                        <a
                          href={`tel:${e.phone}`}
                          className="adm-btn adm-btn-ghost adm-btn-icon"
                          title="Call Lead"
                        >
                          <MdPhone />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">📩 Client Enquiry</h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)} aria-label="Close modal"><MdClose /></button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-modal-ref-bar" style={{ justifyContent: 'flex-end' }}>
                <span className={`adm-badge ${STATUS_BADGE[selected.status] || ''}`} style={{ fontSize: '0.82rem', padding: '5px 14px' }}>
                  Status: {selected.status}
                </span>
              </div>

              <div className="adm-detail-grid">
                <DetailItem label="Client Name" value={selected.name} />
                <DetailItem label="Mobile Number" value={selected.phone} />
                <DetailItem label="Email" value={selected.email || 'N/A'} />
                <DetailItem label="Destination Interest" value={selected.destination || 'Not Specified'} />
                <DetailItem label="Target Travel Date" value={selected.travelDate || 'Flexible'} />
                <DetailItem label="Submitted At" value={new Date(selected.submittedAt || selected.createdAt).toLocaleString('en-IN')} />
              </div>

              {selected.message && (
                <div style={{ marginTop: 16, padding: '14px 16px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Client Note / Message</div>
                  <p style={{ fontSize: '0.9rem', color: '#1E293B', lineHeight: 1.6, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{selected.message}</p>
                </div>
              )}

              {/* Status Updater */}
              <div className="adm-status-box">
                <div className="adm-status-title">
                  Change Status
                </div>
                <div className="adm-status-buttons">
                  {[
                    { id: 'new', label: 'New / Unread' },
                    { id: 'read', label: 'In Review' },
                    { id: 'resolved', label: 'Resolved' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => updateStatus(selected._id, s.id)}
                      disabled={updatingId === selected._id || selected.status === s.id}
                      className={`adm-btn adm-btn-sm ${selected.status === s.id ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
                    >
                      {selected.status === s.id ? `✓ ${s.label}` : s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              <a
                href={waLink(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="adm-btn adm-btn-whatsapp"
                title="Reply on WhatsApp"
              >
                <FaWhatsapp style={{ fontSize: '1.15rem', flexShrink: 0 }} /> WhatsApp
              </a>
              <a 
                href={`tel:${selected.phone}`} 
                className="adm-btn adm-btn-ghost"
                title="Call Lead"
              >
                <MdPhone style={{ fontSize: '1.1rem', flexShrink: 0 }} /> Call
              </a>
              <button className="adm-btn adm-btn-ghost" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
