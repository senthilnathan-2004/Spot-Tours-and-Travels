import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MdVisibility, 
  MdClose, 
  MdPhone, 
  MdRefresh, 
  MdDeleteOutline, 
  MdFileDownload, 
  MdMarkEmailRead, 
  MdCheckCircle, 
  MdEmail,
  MdSwapVert
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { api } from '../utils/api.js';
import AdminAlert from '../components/AdminAlert.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

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

function formatReceivedDate(dateVal) {
  if (!dateVal) return { dateStr: '—', timeStr: '', isRecent: false, tag: '' };
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return { dateStr: String(dateVal), timeStr: '', isRecent: false, tag: '' };
  
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (isToday) return { dateStr, timeStr, isRecent: true, tag: 'Today' };
  if (isYesterday) return { dateStr, timeStr, isRecent: true, tag: 'Yesterday' };
  return { dateStr, timeStr, isRecent: false, tag: '' };
}

function exportEnquiriesToCSV(enquiriesList) {
  if (!enquiriesList || enquiriesList.length === 0) return;
  const headers = [
    'Customer Name',
    'Phone Number',
    'Email Address',
    'Destination Interest',
    'Expected Travel Date',
    'Status',
    'Received Timestamp',
    'Requirements / Message'
  ];

  const rows = enquiriesList.map(e => [
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${e.phone || ''}"`,
    `"${e.email || ''}"`,
    `"${(e.destination || '').replace(/"/g, '""')}"`,
    `"${e.travelDate || ''}"`,
    `"${(e.status || 'new').toUpperCase()}"`,
    `"${new Date(e.submittedAt || e.createdAt || Date.now()).toLocaleString('en-IN')}"`,
    `"${(e.message || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Spot_Tours_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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
  const [dateSort, setDateSort] = useState('desc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
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
  useEffect(() => { setSelectedIds([]); }, [filter]);

  const filtered = enquiries
    .filter(e => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        e.name?.toLowerCase().includes(q) ||
        e.phone?.includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.destination?.toLowerCase().includes(q) ||
        e.message?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.submittedAt || b.createdAt || 0).getTime();
      return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const isAllSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(e => e._id));
    }
  }

  function toggleSelect(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

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

  async function handleBulkStatus(status) {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await api.bulkUpdateEnquiryStatus(selectedIds, status);
      setSuccess(`Updated ${selectedIds.length} enquiries to ${status.toUpperCase()}!`);
      setTimeout(() => setSuccess(''), 3500);
      setSelectedIds([]);
      load();
    } catch (err) {
      setError(err.message || 'Failed to update selected enquiries');
    } finally {
      setLoading(false);
    }
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    setDeleteModal({
      isOpen: true,
      title: `Delete ${selectedIds.length} Enquiries?`,
      message: `Are you sure you want to permanently delete ${selectedIds.length} selected enquiries? This action cannot be undone.`,
      onConfirm: async () => {
        setDeleteModal(prev => ({ ...prev, loading: true }));
        try {
          await api.bulkDeleteEnquiries(selectedIds);
          setSuccess(`Deleted ${selectedIds.length} enquiries successfully.`);
          setTimeout(() => setSuccess(''), 3500);
          setSelectedIds([]);
          load();
        } catch (err) {
          setError(err.message || 'Failed to delete enquiries');
        } finally {
          setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: null, loading: false });
        }
      }
    });
  }

  function handleDeleteSingle(id, name) {
    setDeleteModal({
      isOpen: true,
      title: `Delete enquiry from ${name || 'customer'}?`,
      message: `Are you sure you want to delete the enquiry from ${name || 'customer'}? This action cannot be undone.`,
      onConfirm: async () => {
        setDeleteModal(prev => ({ ...prev, loading: true }));
        try {
          await api.deleteEnquiry(id);
          setSuccess('Enquiry deleted successfully.');
          setTimeout(() => setSuccess(''), 3000);
          if (selected?._id === id) setSelected(null);
          setSelectedIds(prev => prev.filter(x => x !== id));
          load();
        } catch (err) {
          setError(err.message || 'Failed to delete enquiry');
        } finally {
          setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: null, loading: false });
        }
      }
    });
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
            {total} total client submissions organized chronologically. Multi-select rows to batch resolve, update, delete, or export.
          </p>
        </div>
        <div className="adm-page-actions" style={{ display: 'flex', gap: 8 }}>
          <button 
            className="adm-btn adm-btn-ghost" 
            onClick={() => exportEnquiriesToCSV(enquiries)} 
            title="Export all visible leads to CSV"
          >
            <MdFileDownload /> Export CSV
          </button>
          <button className="adm-btn adm-btn-ghost" onClick={load} title="Refresh enquiries list">
            <MdRefresh /> Refresh
          </button>
        </div>
      </div>

      <AdminAlert 
        alert={success ? { type: 'success', msg: success } : (error ? { type: 'error', msg: error } : null)} 
        onClose={() => { setSuccess(''); setError(''); }} 
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={deleteModal.onConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: null, loading: false })}
        loading={deleteModal.loading}
      />

      {/* Filter Tabs & Search */}
      <div className="adm-filters">
        <input
          type="text"
          className="adm-search-input"
          placeholder="Search by customer name, phone, email, destination, or note..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="adm-filter-bar">
          {/* Date Sort Toggle */}
          <button
            type="button"
            onClick={() => setDateSort(s => s === 'desc' ? 'asc' : 'desc')}
            className="adm-btn adm-btn-sm adm-btn-ghost"
            title="Toggle date order"
          >
            <MdSwapVert style={{ fontSize: '1.15rem' }} />
            <span>{dateSort === 'desc' ? 'Date: Newest' : 'Date: Oldest'}</span>
          </button>

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
                  <th style={{ width: 44, textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      className="adm-checkbox" 
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      title="Select All"
                    />
                  </th>
                  <th>Received Date</th>
                  <th>Customer Name</th>
                  <th>Destination Interest</th>
                  <th>Expected Date</th>
                  <th>Message Preview</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => {
                  const isSelected = selectedIds.includes(e._id);
                  const dt = formatReceivedDate(e.submittedAt || e.createdAt);

                  return (
                    <tr key={e._id} className={isSelected ? 'adm-row-selected' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          className="adm-checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelect(e._id)}
                        />
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {dt.tag && (
                            <span className="adm-badge adm-badge-confirmed" style={{ fontSize: '0.68rem', padding: '2px 6px', fontWeight: 800 }}>
                              {dt.tag}
                            </span>
                          )}
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text-main)' }}>
                            {dt.dateStr}
                          </span>
                        </div>
                        {dt.timeStr && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: 2 }}>
                            {dt.timeStr}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="adm-customer-name">
                          {e.name}
                        </div>
                        <div className="adm-customer-sub">
                          📞 {e.phone} {e.email ? `• ${e.email}` : ''}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--adm-secondary)', fontSize: '0.88rem' }}>
                          {e.destination || 'Custom Vacation'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {e.travelDate || 'Flexible'}
                      </td>
                      <td>
                        <div style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--adm-text-muted)' }}>
                          {e.message || '—'}
                        </div>
                      </td>
                      <td>
                        <span className={`adm-badge ${STATUS_BADGE[e.status] || ''}`}>
                          {e.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button 
                            className="adm-btn adm-btn-ghost adm-btn-icon" 
                            onClick={() => openView(e)} 
                            title="View Enquiry Details"
                          >
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

                          <button
                            className="adm-btn adm-btn-ghost adm-btn-icon"
                            onClick={() => handleDeleteSingle(e._id, e.name)}
                            title="Delete Enquiry"
                            style={{ color: '#EF4444' }}
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Multi-Select Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="adm-bulk-bar">
          <span className="adm-bulk-count">
            ✓ {selectedIds.length} Selected
          </span>
          
          <div className="adm-bulk-actions">
            <button 
              className="adm-bulk-btn btn-complete"
              onClick={() => handleBulkStatus('read')}
              title="Mark In Review"
            >
              <MdMarkEmailRead /> In Review
            </button>
            <button 
              className="adm-bulk-btn btn-confirm"
              onClick={() => handleBulkStatus('resolved')}
              title="Mark Resolved"
            >
              <MdCheckCircle /> Resolved
            </button>
            <button 
              className="adm-bulk-btn btn-cancel"
              onClick={() => handleBulkStatus('new')}
              title="Mark as New"
            >
              <MdEmail /> New
            </button>
            <button 
              className="adm-bulk-btn btn-export"
              onClick={() => exportEnquiriesToCSV(enquiries.filter(e => selectedIds.includes(e._id)))}
              title="Export Selected to CSV"
            >
              <MdFileDownload /> Export
            </button>
            <button 
              className="adm-bulk-btn btn-delete"
              onClick={handleBulkDelete}
              title="Delete Selected"
            >
              <MdDeleteOutline /> Delete
            </button>
          </div>

          <button 
            className="adm-bulk-close" 
            onClick={() => setSelectedIds([])}
            title="Deselect All"
          >
            <MdClose />
          </button>
        </div>
      )}

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
                  Change Status (Auto Customer Email)
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
