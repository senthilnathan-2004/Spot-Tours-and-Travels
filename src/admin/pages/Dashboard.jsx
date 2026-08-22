import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MdBookmark,
  MdEmail,
  MdCardTravel,
  MdCheckCircle,
  MdPending,
  MdTrendingUp,
  MdArrowForward,
  MdPhone,
  MdWhatsapp,
  MdAdd
} from 'react-icons/md';
import { api } from '../utils/api.js';
import './Dashboard.css';

const STATUS_BADGE = {
  pending: 'adm-badge-pending',
  confirmed: 'adm-badge-confirmed',
  completed: 'adm-badge-completed',
  cancelled: 'adm-badge-cancelled'
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [bs, es, bk, en] = await Promise.all([
          api.getBookingStats(),
          api.getEnquiryStats(),
          api.getBookings({ limit: 5 }),
          api.getEnquiries({ limit: 5 })
        ]);
        setStats({ bookings: bs, enquiries: es });
        setRecentBookings(bk.bookings || []);
        setRecentEnquiries(en.enquiries || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner" />
        <span>Loading live dashboard analytics...</span>
      </div>
    );
  }

  return (
    <div className="adm-dashboard-view">
      {/* Page Title Section */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-tag">OVERVIEW</div>
          <h1 className="adm-page-title">
            WELCOME TO <span>SPOT TOURS</span> ADMIN
          </h1>
          <p className="adm-page-subtitle">
            Real-time monitoring of customer bookings, packages, and direct enquiries.
          </p>
        </div>

        <div className="adm-header-actions">
          <Link to="/admin/packages" className="adm-btn adm-btn-primary">
            <MdAdd /> New Package
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="adm-stats-grid">
        <StatCard
          icon={<MdBookmark />}
          value={stats?.bookings?.total || 0}
          label="Total Bookings"
          gradient="linear-gradient(135deg, #0E7490 0%, #0284C7 100%)"
          color="#0E7490"
          bg="rgba(14, 116, 144, 0.12)"
        />
        <StatCard
          icon={<MdPending />}
          value={stats?.bookings?.pending || 0}
          label="Pending Bookings"
          gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
          color="#F59E0B"
          bg="rgba(245, 158, 11, 0.12)"
        />
        <StatCard
          icon={<MdEmail />}
          value={stats?.enquiries?.new || 0}
          label="New Enquiries"
          gradient="linear-gradient(135deg, #D83A56 0%, #E11D48 100%)"
          color="#D83A56"
          bg="rgba(216, 58, 86, 0.12)"
        />
        <StatCard
          icon={<MdCheckCircle />}
          value={stats?.bookings?.confirmed || 0}
          label="Confirmed Trips"
          gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
          color="#10B981"
          bg="rgba(16, 185, 129, 0.12)"
        />
      </div>

      {/* Main Grid: Recent Bookings & Recent Enquiries */}
      <div className="adm-dashboard-dual-grid">
        {/* Recent Bookings Card */}
        <div className="adm-card">
          <div className="adm-card-header">
            <h2 className="adm-card-title">
              <MdBookmark /> Recent Booking Requests
            </h2>
            <Link to="/admin/bookings" className="adm-btn adm-btn-ghost adm-btn-sm">
              View All <MdArrowForward />
            </Link>
          </div>

          <div className="adm-table-wrap">
            {recentBookings.length === 0 ? (
              <div className="adm-empty">
                <div className="adm-empty-icon">🏖️</div>
                <h3>No Bookings Yet</h3>
                <p>Customer reservations from the package pages will appear here in real-time.</p>
              </div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Customer</th>
                    <th>Package</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b._id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className="adm-ref-code">{b.bookingRef}</span>
                      </td>
                      <td>
                        <div className="adm-customer-name">{b.fullName}</div>
                        <div className="adm-customer-sub">{b.phone}</div>
                      </td>
                      <td>
                        <div className="adm-package-title-cell" title={b.packageTitle}>
                          {b.packageTitle}
                        </div>
                      </td>
                      <td className="adm-date-cell">
                        {b.travelDate || 'Flexible'}
                      </td>
                      <td>
                        <span className={`adm-badge ${STATUS_BADGE[b.status] || ''}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Enquiries Card */}
        <div className="adm-card">
          <div className="adm-card-header">
            <h2 className="adm-card-title">
              <MdEmail /> Recent Leads &amp; Enquiries
            </h2>
            <Link to="/admin/enquiries" className="adm-btn adm-btn-ghost adm-btn-sm">
              View All <MdArrowForward />
            </Link>
          </div>

          <div className="adm-enquiries-feed">
            {recentEnquiries.length === 0 ? (
              <div className="adm-empty">
                <div className="adm-empty-icon">📩</div>
                <h3>No Direct Enquiries</h3>
                <p>Website contact form submissions will appear here.</p>
              </div>
            ) : (
              recentEnquiries.map(e => (
                <div key={e._id} className={`adm-enquiry-card ${e.status === 'new' ? 'is-new' : ''}`}>
                  <div className="adm-enquiry-avatar">
                    {(e.name || 'G').charAt(0).toUpperCase()}
                  </div>

                  <div className="adm-enquiry-content">
                    <div className="adm-enquiry-top-row">
                      <span className="adm-enquiry-name">{e.name}</span>
                      <span className={`adm-badge adm-badge-${e.status}`}>
                        {e.status}
                      </span>
                    </div>

                    <div className="adm-enquiry-dest">
                      📍 {e.destination || 'General Enquiry'} • {e.travelDate || 'Flexible dates'}
                    </div>

                    {e.message && (
                      <p className="adm-enquiry-snippet">"{e.message}"</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="adm-card adm-quick-shortcuts-card">
        <div className="adm-card-header">
          <h2 className="adm-card-title">
            <MdTrendingUp /> Quick Operations
          </h2>
        </div>
        <div className="adm-card-body adm-shortcuts-wrap">
          <Link to="/admin/packages" className="adm-shortcut-btn">
            <div className="adm-shortcut-icon" style={{ background: 'rgba(216, 58, 86, 0.15)', color: 'var(--adm-primary)' }}>
              <MdCardTravel />
            </div>
            <div className="adm-shortcut-text">
              <strong>Manage Tour Packages</strong>
              <span>Add, update rates, or edit itineraries</span>
            </div>
          </Link>

          <Link to="/admin/bookings?status=pending" className="adm-shortcut-btn">
            <div className="adm-shortcut-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--adm-accent)' }}>
              <MdCheckCircle />
            </div>
            <div className="adm-shortcut-text">
              <strong>Review Pending Bookings</strong>
              <span>Confirm customer hotel &amp; cab vouchers</span>
            </div>
          </Link>

          <Link to="/admin/enquiries?status=new" className="adm-shortcut-btn">
            <div className="adm-shortcut-icon" style={{ background: 'rgba(14, 116, 144, 0.15)', color: 'var(--adm-secondary)' }}>
              <MdEmail />
            </div>
            <div className="adm-shortcut-text">
              <strong>Respond to Enquiries</strong>
              <span>Connect via WhatsApp or Phone call</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, gradient, color, bg }) {
  return (
    <div className="adm-stat-card" style={{ '--stat-gradient': gradient, '--stat-color': color, '--stat-bg': bg }}>
      <div className="adm-stat-icon">{icon}</div>
      <div className="adm-stat-info">
        <div className="adm-stat-value">{value}</div>
        <div className="adm-stat-label">{label}</div>
      </div>
    </div>
  );
}
