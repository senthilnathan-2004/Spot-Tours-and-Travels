import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MdVisibility, 
  MdClose, 
  MdPhone, 
  MdRefresh, 
  MdDeleteOutline, 
  MdFileDownload, 
  MdCheck, 
  MdBlock, 
  MdDoneAll,
  MdSwapVert,
  MdDateRange
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { api } from '../utils/api.js';
import AdminAlert from '../components/AdminAlert.jsx';

const STATUS_BADGE = {
  pending: 'adm-badge-pending',
  confirmed: 'adm-badge-confirmed',
  completed: 'adm-badge-completed',
  cancelled: 'adm-badge-cancelled'
};

const STATUSES = [
  { id: 'all', label: 'All Bookings' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' }
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

function exportBookingsToCSV(bookingsList) {
  if (!bookingsList || bookingsList.length === 0) return;
  const headers = [
    'Booking Reference',
    'Customer Name',
    'Phone',
    'Email',
    'Package Title',
    'Destination',
    'Duration',
    'Travel Date',
    'Adults',
    'Children',
    'Vehicle',
    'Hotel Category',
    'Total Amount (INR)',
    'Status',
    'Booked Timestamp',
    'Notes'
  ];

  const rows = bookingsList.map(b => [
    `"${b.bookingRef || ''}"`,
    `"${(b.fullName || '').replace(/"/g, '""')}"`,
    `"${b.phone || ''}"`,
    `"${b.email || ''}"`,
    `"${(b.packageTitle || '').replace(/"/g, '""')}"`,
    `"${(b.destination || '').replace(/"/g, '""')}"`,
    `"${b.duration || ''}"`,
    `"${b.travelDate || ''}"`,
    b.adults || 1,
    b.children || 0,
    `"${b.vehicleType || ''}"`,
    `"${b.hotelCategory || ''}"`,
    Number(b.totalAmount || 0),
    `"${(b.status || 'pending').toUpperCase()}"`,
    `"${new Date(b.bookedAt || b.createdAt || Date.now()).toLocaleString('en-IN')}"`,
    `"${(b.specialNotes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Spot_Tours_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Bookings() {
  const location = useLocation();
  const urlStatus = new URLSearchParams(location.search).get('status') || 'all';
  const [filter, setFilter] = useState(urlStatus);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState('');
  const [dateSort, setDateSort] = useState('desc'); // 'desc' | 'asc'
  const [selectedIds, setSelectedIds] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter !== 'all') params.status = filter;
      const data = await api.getBookings(params);
      setBookings(data.bookings || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { 
    setPage(1); 
    setSelectedIds([]);
  }, [filter]);

  // Search & Date Sort Filtering
  const filtered = bookings
    .filter(b => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        b.fullName?.toLowerCase().includes(q) ||
        b.bookingRef?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.packageTitle?.toLowerCase().includes(q) ||
        b.destination?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.bookedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.bookedAt || b.createdAt || 0).getTime();
      return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const isAllSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(b => b._id));
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
      await api.updateBookingStatus(id, status);
      setSuccess(`Booking marked as ${status.toUpperCase()}! Customer notified.`);
      setTimeout(() => setSuccess(''), 3500);
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
      load();
    } catch (err) {
      setError(err.message || 'Failed to update booking');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleBulkStatus(status) {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await api.bulkUpdateBookingStatus(selectedIds, status);
      setSuccess(`Successfully updated ${selectedIds.length} bookings to ${status.toUpperCase()}!`);
      setTimeout(() => setSuccess(''), 3500);
      setSelectedIds([]);
      load();
    } catch (err) {
      setError(err.message || 'Failed to update selected bookings');
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected bookings?`)) return;
    setLoading(true);
    try {
      await api.bulkDeleteBookings(selectedIds);
      setSuccess(`Deleted ${selectedIds.length} bookings successfully.`);
      setTimeout(() => setSuccess(''), 3500);
      setSelectedIds([]);
      load();
    } catch (err) {
      setError(err.message || 'Failed to delete bookings');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSingle(id, bookingRef) {
    if (!window.confirm(`Delete booking ${bookingRef}? This action cannot be undone.`)) return;
    try {
      await api.deleteBooking(id);
      setSuccess('Booking deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
      if (selected?._id === id) setSelected(null);
      setSelectedIds(prev => prev.filter(x => x !== id));
      load();
    } catch (err) {
      setError(err.message || 'Failed to delete booking');
    }
  }

  const waLink = b => {
    const msg = `*Spot Tours & Travels — Booking Update* ✈️\n\nDear ${b.fullName},\n\nWe have received your booking reference *${b.bookingRef}* for *${b.packageTitle}*.\n\n📅 Travel Date: ${b.travelDate || 'As scheduled'}\n👥 Guests: ${b.adults} Adults${b.children > 0 ? `, ${b.children} Children` : ''}\n🚗 Vehicle: ${b.vehicleType || 'Private Cab'}\n🏨 Hotel: ${b.hotelCategory || 'Standard'}\n💰 Total Amount: ₹${Number(b.totalAmount || 0).toLocaleString('en-IN')}\n\nOur tour manager is available to assist you at 095005 51404. Have a wonderful trip!`;
    const cleanPhone = b.phone ? b.phone.replace(/\D/g, '') : '';
    const target = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    return `https://wa.me/${target}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">RESERVATIONS CONSOLE</div>
          <h1 className="adm-page-title">
            CUSTOMER <span>BOOKINGS</span>
          </h1>
          <p className="adm-page-subtitle">
            {total} total reservations organized chronologically. Multi-select rows to batch confirm, complete, delete, or export.
          </p>
        </div>
        <div className="adm-page-actions" style={{ display: 'flex', gap: 8 }}>
          <button 
            className="adm-btn adm-btn-ghost" 
            onClick={() => exportBookingsToCSV(bookings)} 
            title="Export all visible bookings to CSV"
          >
            <MdFileDownload /> Export CSV
          </button>
          <button className="adm-btn adm-btn-ghost" onClick={load} title="Refresh bookings list">
            <MdRefresh /> Refresh
          </button>
        </div>
      </div>

      <AdminAlert 
        alert={success ? { type: 'success', msg: success } : (error ? { type: 'error', msg: error } : null)} 
        onClose={() => { setSuccess(''); setError(''); }} 
      />

      {/* Filter Tabs & Search Bar */}
      <div className="adm-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <input
          type="text"
          className="adm-search-input"
          placeholder="Search by customer name, ref ID, phone, package, destination..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1 1 280px' }}
        />

        {/* Date Sort Toggle */}
        <button
          type="button"
          onClick={() => setDateSort(s => s === 'desc' ? 'asc' : 'desc')}
          className="adm-btn adm-btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          title="Toggle date order"
        >
          <MdSwapVert style={{ fontSize: '1.2rem' }} />
          <span>Date: {dateSort === 'desc' ? 'Newest First' : 'Oldest First'}</span>
        </button>

        <div className="adm-filter-tabs" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
          <div className="adm-loading"><div className="adm-spinner" /> Loading customer bookings…</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">📋</div>
            <h3>No Bookings Found</h3>
            <p>Customer reservations submitted via your website will be displayed here.</p>
          </div>
        ) : (
          <>
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
                    <th>Ref ID</th>
                    <th>Received Date</th>
                    <th>Customer Name</th>
                    <th>Package Details</th>
                    <th>Travel Date</th>
                    <th>Party</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => {
                    const isSelected = selectedIds.includes(b._id);
                    const dt = formatReceivedDate(b.bookedAt || b.createdAt);

                    return (
                      <tr key={b._id} className={isSelected ? 'adm-row-selected' : ''}>
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            className="adm-checkbox" 
                            checked={isSelected}
                            onChange={() => toggleSelect(b._id)}
                          />
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="adm-ref-code">{b.bookingRef}</span>
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
                            {b.fullName}
                          </div>
                          <div className="adm-customer-sub">
                            📞 {b.phone}
                          </div>
                        </td>
                        <td>
                          <div className="adm-package-title-cell" title={b.packageTitle}>
                            {b.packageTitle}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            {b.destination || b.duration}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', fontWeight: 500 }}>
                          {b.travelDate || 'Flexible'}
                        </td>
                        <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          {b.adults} Adults {b.children > 0 ? `+ ${b.children} Kids` : ''}
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                            ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td>
                          <span className={`adm-badge ${STATUS_BADGE[b.status] || ''}`}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              className="adm-btn adm-btn-ghost adm-btn-icon"
                              onClick={() => setSelected(b)}
                              title="View Full Details"
                            >
                              <MdVisibility />
                            </button>

                            <a
                              href={waLink(b)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="adm-btn adm-btn-icon"
                              style={{ background: '#25D366', color: '#FFFFFF', border: 'none' }}
                              title="Message Customer on WhatsApp"
                            >
                              <FaWhatsapp style={{ fontSize: '1.1rem' }} />
                            </a>

                            <button
                              className="adm-btn adm-btn-ghost adm-btn-icon"
                              onClick={() => handleDeleteSingle(b._id, b.bookingRef)}
                              title="Delete Booking"
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

            {/* Pagination Controls */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '18px', borderTop: '1px solid #F1F5F9' }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`adm-btn adm-btn-sm ${p === page ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
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
              className="adm-bulk-btn btn-confirm"
              onClick={() => handleBulkStatus('confirmed')}
              title="Confirm Selected"
            >
              <MdCheck /> Confirm
            </button>
            <button 
              className="adm-bulk-btn btn-complete"
              onClick={() => handleBulkStatus('completed')}
              title="Mark as Completed"
            >
              <MdDoneAll /> Complete
            </button>
            <button 
              className="adm-bulk-btn btn-cancel"
              onClick={() => handleBulkStatus('cancelled')}
              title="Cancel Selected"
            >
              <MdBlock /> Cancel
            </button>
            <button 
              className="adm-bulk-btn btn-export"
              onClick={() => exportBookingsToCSV(bookings.filter(b => selectedIds.includes(b._id)))}
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

      {/* Booking Detail Modal */}
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">📋 Reservation Details</h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)} aria-label="Close modal"><MdClose /></button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-modal-ref-bar">
                <span className="adm-ref-code" style={{ fontSize: '0.92rem', padding: '5px 12px' }}>
                  REF: {selected.bookingRef}
                </span>
                <span className={`adm-badge ${STATUS_BADGE[selected.status] || ''}`} style={{ fontSize: '0.82rem', padding: '5px 14px' }}>
                  Status: {selected.status}
                </span>
              </div>

              <div className="adm-detail-grid">
                <DetailItem label="Guest Full Name" value={selected.fullName} />
                <DetailItem label="Mobile Number" value={selected.phone} />
                <DetailItem label="Email Address" value={selected.email || 'N/A'} />
                <DetailItem label="Package Booked" value={selected.packageTitle} />
                <DetailItem label="Destination" value={selected.destination} />
                <DetailItem label="Tour Duration" value={selected.duration} />
                <DetailItem label="Travel Start Date" value={selected.travelDate} />
                <DetailItem label="Party Size" value={`${selected.adults} Adults${selected.children > 0 ? `, ${selected.children} Children` : ''}`} />
                <DetailItem label="Vehicle Preference" value={selected.vehicleType || 'Standard AC Sedan'} />
                <DetailItem label="Hotel Category" value={selected.hotelCategory || '3-Star Deluxe Resort'} />
                <DetailItem label="Estimated Total" value={`₹${Number(selected.totalAmount || 0).toLocaleString('en-IN')}`} />
                <DetailItem label="Booked Timestamp" value={new Date(selected.bookedAt || selected.createdAt).toLocaleString('en-IN')} />
              </div>

              {selected.specialNotes && (
                <div style={{ marginTop: 16, padding: '14px 16px', background: '#FFFBEB', borderRadius: 10, border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E', marginBottom: 4, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Customer Request / Notes</div>
                  <p style={{ fontSize: '0.88rem', color: '#78350F', lineHeight: 1.5, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{selected.specialNotes}</p>
                </div>
              )}

              {/* Status Updater */}
              <div className="adm-status-box">
                <div className="adm-status-title">
                  Update Booking Status (Auto Customer Email)
                </div>
                <div className="adm-status-buttons">
                  {[
                    { id: 'pending', label: 'Pending' },
                    { id: 'confirmed', label: 'Confirmed' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'cancelled', label: 'Cancelled' }
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
                title="Send WhatsApp confirmation"
              >
                <FaWhatsapp style={{ fontSize: '1.15rem', flexShrink: 0 }} /> WhatsApp
              </a>
              <a 
                href={`tel:${selected.phone}`} 
                className="adm-btn adm-btn-ghost"
                title="Call Customer"
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
