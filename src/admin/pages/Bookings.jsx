import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { MdVisibility, MdClose, MdPhone, MdCalendarToday, MdPeople, MdDirectionsCar, MdHotel, MdRefresh } from 'react-icons/md';
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
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
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
  useEffect(() => { setPage(1); }, [filter]);

  const filtered = search
    ? bookings.filter(b =>
        b.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        b.bookingRef?.toLowerCase().includes(search.toLowerCase()) ||
        b.phone?.includes(search) ||
        b.packageTitle?.toLowerCase().includes(search.toLowerCase())
      )
    : bookings;

  async function updateStatus(id, status) {
    setUpdatingId(id);
    try {
      await api.updateBookingStatus(id, status);
      setSuccess(`Booking marked as ${status.toUpperCase()}!`);
      setTimeout(() => setSuccess(''), 3500);
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
      load();
    } catch (err) {
      setError(err.message || 'Failed to update booking');
    } finally {
      setUpdatingId(null);
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
          <div className="adm-page-tag">RESERVATIONS</div>
          <h1 className="adm-page-title">
            CUSTOMER <span>BOOKINGS</span>
          </h1>
          <p className="adm-page-subtitle">
            {total} total reservations received from your tour package forms.
          </p>
        </div>
        <button className="adm-btn adm-btn-ghost" onClick={load} title="Refresh bookings list">
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
          placeholder="Search by customer name, ref ID, phone, or package..."
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
                    <th>Ref ID</th>
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
                  {filtered.map(b => (
                    <tr key={b._id}>
                      <td>
                        <span className="adm-ref-code">{b.bookingRef}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text-main)', fontSize: '0.92rem' }}>
                          {b.fullName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)', marginTop: 2 }}>
                          📞 {b.phone}
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.9rem' }}>
                          {b.packageTitle}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          {b.duration}
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

                          <a
                            href={`tel:${b.phone}`}
                            className="adm-btn adm-btn-ghost adm-btn-icon"
                            title="Call Customer"
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

      {/* Booking Detail Modal */}
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">📋 Reservation Details</h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)}><MdClose /></button>
            </div>
            <div className="adm-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <span className="adm-ref-code" style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
                  REF: {selected.bookingRef}
                </span>
                <span className={`adm-badge ${STATUS_BADGE[selected.status] || ''}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
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
                <DetailItem label="Party Size" value={`${selected.adults} Adults, ${selected.children || 0} Children`} />
                <DetailItem label="Vehicle Preference" value={selected.vehicleType || 'Standard AC Sedan'} />
                <DetailItem label="Hotel Category" value={selected.hotelCategory || '3-Star Deluxe Resort'} />
                <DetailItem label="Estimated Total" value={`₹${Number(selected.totalAmount || 0).toLocaleString('en-IN')}`} />
                <DetailItem label="Booked Timestamp" value={new Date(selected.bookedAt || selected.createdAt).toLocaleString('en-IN')} />
              </div>

              {selected.specialNotes && (
                <div style={{ marginTop: 16, padding: '14px 18px', background: '#FFFBEB', borderRadius: 10, border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E', marginBottom: 4, textTransform: 'uppercase', fontFamily: 'Oswald, sans-serif' }}>Customer Request / Notes</div>
                  <p style={{ fontSize: '0.9rem', color: '#78350F', lineHeight: 1.5 }}>{selected.specialNotes}</p>
                </div>
              )}

              {/* Status Updater */}
              <div style={{ marginTop: 22, padding: '16px 20px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Oswald, sans-serif' }}>
                  Update Booking Status
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected._id, s)}
                      disabled={updatingId === selected._id || selected.status === s}
                      className={`adm-btn adm-btn-sm ${selected.status === s ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      Mark as {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              <a href={`tel:${selected.phone}`} className="adm-btn adm-btn-ghost">
                <MdPhone /> Call Customer
              </a>
              <a
                href={waLink(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="adm-btn"
                style={{ background: '#25D366', color: '#FFFFFF', textDecoration: 'none' }}
              >
                <FaWhatsapp style={{ fontSize: '1.1rem' }} /> WhatsApp Confirmation
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
